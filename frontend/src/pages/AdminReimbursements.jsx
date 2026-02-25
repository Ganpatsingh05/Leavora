import { useState, useEffect } from 'react';
import API from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import {
  HiOutlineSearch,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineReceiptTax,
} from 'react-icons/hi';
import {
  formatDate,
  getStatusColor,
  reimbursementCategoryLabels,
  getReimbursementCategoryColor,
  getInitials,
  formatCurrency,
} from '../utils/helpers';

const AdminReimbursements = () => {
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [reviewLoading, setReviewLoading] = useState(null);

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const fetchReimbursements = async () => {
    try {
      const res = await API.get('/reimbursements');
      const data = res.data.data || res.data;
      setReimbursements(data);
    } catch (err) {
      toast.error('Failed to load reimbursements');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    const action = status === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this reimbursement?`)) return;
    setReviewLoading(id + status);
    try {
      await API.put(`/reimbursements/${id}/review`, { status });
      toast.success(`Reimbursement ${status}`);
      fetchReimbursements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setReviewLoading(null);
    }
  };

  const filtered = reimbursements.filter((r) => {
    const matchSearch =
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchCategory = filterCategory === 'all' || r.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const totalPending = reimbursements
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalApproved = reimbursements
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalAll = reimbursements.reduce((sum, r) => sum + r.amount, 0);

  if (loading) {
    return <SkeletonLoader type="table" count={6} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Reimbursements</h1>
          <p className="text-sm text-gray-500 dark:text-indigo-300 mt-1">{reimbursements.length} total claims</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-900 
              text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-48"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-900 
            text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-900 
            text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="all">All Categories</option>
            {Object.entries(reimbursementCategoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Claims</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalAll)}</p>
          <p className="text-xs text-gray-400 mt-1">{reimbursements.length} requests</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 p-5">
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{formatCurrency(totalPending)}</p>
          <p className="text-xs text-gray-400 mt-1">{reimbursements.filter(r => r.status === 'pending').length} requests</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 p-5">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Approved</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalApproved)}</p>
          <p className="text-xs text-gray-400 mt-1">{reimbursements.filter(r => r.status === 'approved').length} requests</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineReceiptTax className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No reimbursements found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Employee</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(item.user?.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.user?.name}</p>
                          <p className="text-xs text-gray-400">{item.user?.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{item.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${getReimbursementCategoryColor(item.category)}`}>
                        {reimbursementCategoryLabels[item.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(item.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatDate(item.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(item._id, 'approved')}
                            disabled={reviewLoading === item._id + 'approved'}
                            className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                            title="Approve"
                          >
                            <HiOutlineCheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReview(item._id, 'rejected')}
                            disabled={reviewLoading === item._id + 'rejected'}
                            className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                            title="Reject"
                          >
                            <HiOutlineXCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {item.reviewedBy?.name ? `By ${item.reviewedBy.name}` : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReimbursements;
