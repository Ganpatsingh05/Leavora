import { useState, useEffect } from 'react';
import API from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCalendar,
} from 'react-icons/hi';
import { formatDate, getStatusColor, leaveTypeLabels, getLeaveTypeColor, getInitials } from '../utils/helpers';

const AdminLeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviewLoading, setReviewLoading] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await API.get('/leaves');
      const data = res.data.data || res.data;
      setLeaves(data);
    } catch (err) {
      toast.error('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    const action = status === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this leave request?`)) return;
    setReviewLoading(id + status);
    try {
      await API.put(`/leaves/${id}/review`, { status });
      toast.success(`Leave ${status}`);
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setReviewLoading(null);
    }
  };

  const filtered = leaves.filter((l) => {
    const matchSearch =
      l.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.reason?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return <SkeletonLoader type="table" count={6} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Leave Requests</h1>
          <p className="text-sm text-gray-500 dark:text-indigo-300 mt-1">{leaves.length} total requests</p>
        </div>
        <div className="flex items-center gap-3">
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
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No leave requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Employee</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Dates</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Reason</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filtered.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(leave.user?.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{leave.user?.name}</p>
                          <p className="text-xs text-gray-400">{leave.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leaveTypeLabels[leave.leaveType]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(leave.fromDate)} - {formatDate(leave.toDate)}</p>
                      <p className="text-xs text-gray-400">{leave.days} day{leave.days > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{leave.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {leave.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(leave._id, 'approved')}
                            disabled={reviewLoading === leave._id + 'approved'}
                            className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                            title="Approve"
                          >
                            <HiOutlineCheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReview(leave._id, 'rejected')}
                            disabled={reviewLoading === leave._id + 'rejected'}
                            className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                            title="Reject"
                          >
                            <HiOutlineXCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {leave.reviewedBy?.name ? `By ${leave.reviewedBy.name}` : '—'}
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

export default AdminLeaveHistory;
