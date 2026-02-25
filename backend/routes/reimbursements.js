const express = require('express');
const { body, validationResult } = require('express-validator');
const Reimbursement = require('../models/Reimbursement');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reimbursements
// @desc    Submit a reimbursement request
// @access  Private (all roles)
router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
    body('date').notEmpty().withMessage('Expense date is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, category, amount, date, description, receiptUrl } = req.body;

      const reimbursement = await Reimbursement.create({
        user: req.user._id,
        title,
        category,
        amount,
        date: new Date(date),
        description,
        receiptUrl: receiptUrl || '',
      });

      const populated = await Reimbursement.findById(reimbursement._id).populate(
        'user',
        'name email avatar department'
      );

      res.status(201).json(populated);
    } catch (error) {
      console.error('Submit reimbursement error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/reimbursements/my
// @desc    Get my reimbursements
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const total = await Reimbursement.countDocuments(filter);
    const reimbursements = await Reimbursement.find(filter)
      .populate('user', 'name email avatar department')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ data: reimbursements, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reimbursements
// @desc    Get all reimbursements (manager/admin)
// @access  Private (manager, admin)
router.get('/', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { status, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const total = await Reimbursement.countDocuments(filter);
    const reimbursements = await Reimbursement.find(filter)
      .populate('user', 'name email avatar department')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ data: reimbursements, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reimbursements/stats
// @desc    Get reimbursement statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'employee') {
      filter.user = req.user._id;
    }

    const total = await Reimbursement.countDocuments(filter);
    const pending = await Reimbursement.countDocuments({ ...filter, status: 'pending' });
    const approved = await Reimbursement.countDocuments({ ...filter, status: 'approved' });
    const rejected = await Reimbursement.countDocuments({ ...filter, status: 'rejected' });

    // Total amounts by status
    const amountByStatus = await Reimbursement.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Category breakdown
    const categoryStats = await Reimbursement.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalAmount = amountByStatus.reduce((sum, s) => sum + s.totalAmount, 0);
    const approvedAmount = amountByStatus.find(s => s._id === 'approved')?.totalAmount || 0;
    const pendingAmount = amountByStatus.find(s => s._id === 'pending')?.totalAmount || 0;

    res.json({
      total,
      pending,
      approved,
      rejected,
      totalAmount,
      approvedAmount,
      pendingAmount,
      amountByStatus,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reimbursements/:id/review
// @desc    Approve or reject a reimbursement (manager/admin)
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

      const reimbursement = await Reimbursement.findById(req.params.id);
      if (!reimbursement) {
        return res.status(404).json({ message: 'Reimbursement not found' });
      }

      if (reimbursement.status !== 'pending') {
        return res.status(400).json({ message: 'Reimbursement has already been reviewed' });
      }

      // Prevent self-approval
      if (reimbursement.user.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot approve/reject your own reimbursement' });
      }

      reimbursement.status = status;
      reimbursement.reviewedBy = req.user._id;
      reimbursement.reviewComment = reviewComment || '';
      await reimbursement.save();

      const updated = await Reimbursement.findById(reimbursement._id)
        .populate('user', 'name email avatar department')
        .populate('reviewedBy', 'name');

      res.json(updated);
    } catch (error) {
      console.error('Review reimbursement error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/reimbursements/:id
// @desc    Delete a reimbursement (only if pending, own request)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) {
      return res.status(404).json({ message: 'Reimbursement not found' });
    }

    if (
      reimbursement.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (reimbursement.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Can only delete pending reimbursements' });
    }

    await Reimbursement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reimbursement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
