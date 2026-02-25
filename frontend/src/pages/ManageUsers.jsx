import { useState, useEffect } from 'react';
import API from '../utils/api';
import Modal from '../components/Modal';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import {
  HiOutlinePlusCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';
import { getInitials } from '../utils/helpers';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'General',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      const data = res.data.data || res.data;
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditUser(null);
    setForm({ name: '', email: '', password: '', role: 'employee', department: 'General' });
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      department: user.department || 'General',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required');
      return;
    }
    if (!editUser && !form.password) {
      toast.error('Password is required for new users');
      return;
    }

    setSubmitting(true);
    try {
      if (editUser) {
        const updateData = { name: form.name, email: form.email, role: form.role, department: form.department };
        await API.put(`/users/${editUser._id}`, updateData);
        toast.success('User updated successfully');
      } else {
        await API.post('/users', form);
        toast.success('User created successfully');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This will also delete their leaves.`)) return;
    try {
      await API.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors = {
    admin: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    manager: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    employee: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  };

  const avatarGradients = [
    'from-indigo-400 to-violet-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500',
    'from-blue-400 to-cyan-500',
  ];

  if (loading) {
    return (
      <div className="animate-fade-in">
        <SkeletonLoader type="table" count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
          <p className="text-sm text-gray-500 dark:text-indigo-300 mt-1">
            {users.length} total users in the system
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 
          text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
          hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <HiOutlinePlusCircle className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-900 
          text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineUser className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Department</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Leave Balance</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filteredUsers.map((user, i) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-linear-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                          {getInitials(user.name)}
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.department || 'General'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          C:{user.leaveBalance?.casual || 0}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400">
                          S:{user.leaveBalance?.sick || 0}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                          E:{user.leaveBalance?.earned || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-800 
                text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Email</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@leavora.in"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-800 
                text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm"
              />
            </div>
          </div>

          {/* Password (only for new users) */}
          {!editUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm"
                />
              </div>
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-800 
              text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Department</label>
            <div className="relative">
              <HiOutlineOfficeBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="Engineering"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-800 
                text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 
              font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 
              text-white font-semibold text-sm shadow-lg shadow-indigo-500/25
              hover:from-indigo-700 hover:to-violet-700 transition-all
              disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : editUser ? (
                'Update User'
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
