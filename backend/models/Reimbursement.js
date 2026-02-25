const mongoose = require('mongoose');

const reimbursementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['travel', 'meals', 'office_supplies', 'medical', 'training', 'software', 'other'],
      required: [true, 'Category is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewComment: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

reimbursementSchema.index({ user: 1, status: 1 });
reimbursementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Reimbursement', reimbursementSchema);
