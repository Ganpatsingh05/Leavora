const express = require('express');
const { body, validationResult } = require('express-validator');
const Leave = require('../models/Leave');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/leaves
// @desc    Apply for leave
// @access  Private (all roles)
router.post(
  '/',
  protect,
  [
    body('leaveType').notEmpty().withMessage('Leave type is required'),
    body('fromDate').notEmpty().withMessage('From date is required'),
    body('toDate').notEmpty().withMessage('To date is required'),
    body('reason').notEmpty().withMessage('Reason is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { leaveType, fromDate, toDate, reason } = req.body;

      // Calculate days
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const diffTime = Math.abs(to - from);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Check leave balance for trackable leave types
      const trackableTypes = ['casual', 'sick', 'earned'];
      if (trackableTypes.includes(leaveType)) {
        const currentUser = await User.findById(req.user._id);
        const available = currentUser.leaveBalance[leaveType];
        if (available === undefined || available < days) {
          return res.status(400).json({
            message: `Insufficient ${leaveType} leave balance. Available: ${available || 0}, Requested: ${days}`,
          });
        }
      }

      const leave = await Leave.create({
        user: req.user._id,
        leaveType,
        fromDate: from,
        toDate: to,
        reason,
        days,
      });

      const populatedLeave = await Leave.findById(leave._id).populate(
        'user',
        'name email avatar department'
      );

      res.status(201).json(populatedLeave);
    } catch (error) {
      console.error('Apply leave error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/leaves/my
// @desc    Get my leaves
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const total = await Leave.countDocuments({ user: req.user._id });
    const leaves = await Leave.find({ user: req.user._id })
      .populate('user', 'name email avatar department')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ data: leaves, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaves
// @desc    Get all leaves (manager/admin)
// @access  Private (manager, admin)
router.get('/', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { status, leaveType } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    let filter = {};

    if (status) filter.status = status;
    if (leaveType) filter.leaveType = leaveType;

    const total = await Leave.countDocuments(filter);
    const leaves = await Leave.find(filter)
      .populate('user', 'name email avatar department')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ data: leaves, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaves/stats
// @desc    Get leave statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'employee') {
      filter.user = req.user._id;
    }

    const total = await Leave.countDocuments(filter);
    const pending = await Leave.countDocuments({ ...filter, status: 'pending' });
    const approved = await Leave.countDocuments({ ...filter, status: 'approved' });
    const rejected = await Leave.countDocuments({ ...filter, status: 'rejected' });

    // Monthly data for charts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Leave.aggregate([
      {
        $match: {
          ...filter,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const leaveTypeStats = await Leave.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$leaveType',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      total,
      pending,
      approved,
      rejected,
      monthlyData,
      leaveTypeStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/leaves/:id/review
// @desc    Approve or reject a leave (manager/admin)
// @access  Private (manager, admin)
router.put(
  '/:id/review',
  protect,
  authorize('manager', 'admin'),
  async (req, res) => {
    try {
      const { status, reviewComment } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const leave = await Leave.findById(req.params.id);
      if (!leave) {
        return res.status(404).json({ message: 'Leave not found' });
      }

      if (leave.status !== 'pending') {
        return res
          .status(400)
          .json({ message: 'Leave has already been reviewed' });
      }

      // Prevent self-approval
      if (leave.user.toString() === req.user._id.toString()) {
        return res
          .status(400)
          .json({ message: 'You cannot approve/reject your own leave request' });
      }

      leave.status = status;
      leave.reviewedBy = req.user._id;
      leave.reviewComment = reviewComment || '';

      // If approved, deduct from balance
      if (status === 'approved') {
        const leaveUser = await User.findById(leave.user);
        const trackableTypes = ['casual', 'sick', 'earned'];
        if (trackableTypes.includes(leave.leaveType)) {
          if (leaveUser.leaveBalance[leave.leaveType] < leave.days) {
            return res.status(400).json({
              message: `Insufficient ${leave.leaveType} leave balance for this user. Available: ${leaveUser.leaveBalance[leave.leaveType]}, Requested: ${leave.days}`,
            });
          }
          leaveUser.leaveBalance[leave.leaveType] -= leave.days;
          await leaveUser.save();
        }
      }

      await leave.save();

      const updatedLeave = await Leave.findById(leave._id)
        .populate('user', 'name email avatar department')
        .populate('reviewedBy', 'name');

      res.json(updatedLeave);
    } catch (error) {
      console.error('Review error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/leaves/:id
// @desc    Delete a leave (only if pending, own leave)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (
      leave.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (leave.status !== 'pending' && req.user.role !== 'admin') {
      return res
        .status(400)
        .json({ message: 'Can only delete pending leaves' });
    }

    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: 'Leave deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
