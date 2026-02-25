require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Leave = require('../models/Leave');
const Reimbursement = require('../models/Reimbursement');

const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Leave.deleteMany({});
    await Reimbursement.deleteMany({});

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@leavora.in',
      password: 'password123',
      role: 'admin',
      department: 'HR',
    });

    const manager = await User.create({
      name: 'Sarah Johnson',
      email: 'manager@leavora.in',
      password: 'password123',
      role: 'manager',
      department: 'Engineering',
    });

    const emp1 = await User.create({
      name: 'John Doe',
      email: 'john@leavora.in',
      password: 'password123',
      role: 'employee',
      department: 'Engineering',
    });

    const emp2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@leavora.in',
      password: 'password123',
      role: 'employee',
      department: 'Design',
    });

    const emp3 = await User.create({
      name: 'Mike Wilson',
      email: 'mike@leavora.in',
      password: 'password123',
      role: 'employee',
      department: 'Marketing',
    });

    // Create sample leaves
    await Leave.create([
      {
        user: emp1._id,
        leaveType: 'casual',
        fromDate: new Date('2026-02-25'),
        toDate: new Date('2026-02-27'),
        reason: 'Family event - cousin wedding ceremony',
        status: 'pending',
        days: 3,
      },
      {
        user: emp1._id,
        leaveType: 'sick',
        fromDate: new Date('2026-02-10'),
        toDate: new Date('2026-02-11'),
        reason: 'Feeling unwell, fever and headache',
        status: 'approved',
        reviewedBy: manager._id,
        days: 2,
      },
      {
        user: emp2._id,
        leaveType: 'earned',
        fromDate: new Date('2026-03-01'),
        toDate: new Date('2026-03-05'),
        reason: 'Vacation trip to mountains',
        status: 'pending',
        days: 5,
      },
      {
        user: emp2._id,
        leaveType: 'casual',
        fromDate: new Date('2026-01-15'),
        toDate: new Date('2026-01-15'),
        reason: 'Personal work at bank',
        status: 'approved',
        reviewedBy: manager._id,
        days: 1,
      },
      {
        user: emp3._id,
        leaveType: 'sick',
        fromDate: new Date('2026-02-20'),
        toDate: new Date('2026-02-22'),
        reason: 'Medical procedure scheduled',
        status: 'rejected',
        reviewedBy: manager._id,
        reviewComment: 'Critical project deadline, please reschedule',
        days: 3,
      },
      {
        user: emp3._id,
        leaveType: 'casual',
        fromDate: new Date('2026-03-10'),
        toDate: new Date('2026-03-12'),
        reason: 'House shifting to new apartment',
        status: 'pending',
        days: 3,
      },
      {
        user: manager._id,
        leaveType: 'earned',
        fromDate: new Date('2026-04-01'),
        toDate: new Date('2026-04-04'),
        reason: 'Annual family vacation',
        status: 'pending',
        days: 4,
      },
    ]);

    // Create sample reimbursements
    await Reimbursement.create([
      {
        user: emp1._id,
        title: 'Client site travel',
        category: 'travel',
        amount: 4500,
        date: new Date('2026-02-15'),
        description: 'Cab fare and meals for client meeting in Pune',
        status: 'pending',
      },
      {
        user: emp1._id,
        title: 'Keyboard & mouse purchase',
        category: 'office_supplies',
        amount: 3200,
        date: new Date('2026-02-01'),
        description: 'Purchased ergonomic keyboard and wireless mouse for WFH setup',
        status: 'approved',
        reviewedBy: manager._id,
      },
      {
        user: emp2._id,
        title: 'Design conference registration',
        category: 'training',
        amount: 8000,
        date: new Date('2026-02-20'),
        description: 'Registration fee for UX India 2026 design conference',
        status: 'pending',
      },
      {
        user: emp2._id,
        title: 'Team lunch expense',
        category: 'meals',
        amount: 2800,
        date: new Date('2026-01-28'),
        description: 'Team lunch at restaurant for sprint celebration',
        status: 'approved',
        reviewedBy: manager._id,
      },
      {
        user: emp3._id,
        title: 'Figma Pro subscription',
        category: 'software',
        amount: 1500,
        date: new Date('2026-02-10'),
        description: 'Monthly Figma Pro license for design work',
        status: 'rejected',
        reviewedBy: manager._id,
        reviewComment: 'Company already provides Figma licenses, please use the org account',
      },
      {
        user: emp3._id,
        title: 'Medical checkup',
        category: 'medical',
        amount: 5500,
        date: new Date('2026-02-18'),
        description: 'Annual health checkup at Apollo hospital',
        status: 'pending',
      },
      {
        user: manager._id,
        title: 'Team offsite transport',
        category: 'travel',
        amount: 12000,
        date: new Date('2026-02-05'),
        description: 'Bus rental for engineering team offsite day trip',
        status: 'pending',
      },
    ]);

    console.log('Database seeded successfully!');
    console.log('---');
    console.log('Login credentials:');
    console.log('Admin:    admin@leavora.in / password123');
    console.log('Manager:  manager@leavora.in / password123');
    console.log('Employee: john@leavora.in / password123');
    console.log('Employee: jane@leavora.in / password123');
    console.log('Employee: mike@leavora.in / password123');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
};

module.exports = { seedDB };

// Allow running standalone: node seed/seed.js
if (require.main === module) {
  const mongoose2 = require('mongoose');
  mongoose2.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected for seeding...');
    return seedDB();
  }).then(() => process.exit(0)).catch(() => process.exit(1));
}
