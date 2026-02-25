const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Leave = require('../models/Leave');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ data: users, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (admin)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users
// @desc    Create a new user (admin only)
// @access  Private (admin)
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
      .isEmail().withMessage('Valid email is required')
      .custom((value) => {
        if (!value.endsWith('@leavora.in')) {
          throw new Error('Only @leavora.in email addresses are allowed');
        }
        return true;
      }),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .isIn(['admin', 'manager', 'employee'])
      .withMessage('Invalid role'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password, role, department } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role,
        department: department || 'General',
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        leaveBalance: user.leaveBalance,
      });
    } catch (error) {
      console.error('Create user error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/users/:id
// @desc    Update a user (admin only)
// @access  Private (admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, role, department, leaveBalance } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (department) user.department = department;
    if (leaveBalance) user.leaveBalance = leaveBalance;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      leaveBalance: user.leaveBalance,
    });
  } catch (error) {
    console.error('Update user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user (admin only)
// @access  Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    // Delete user's leaves too
    await Leave.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
