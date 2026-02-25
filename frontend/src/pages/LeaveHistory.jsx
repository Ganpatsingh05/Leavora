import { useState, useEffect } from 'react';
import API from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import { HiOutlineCalendar, HiOutlineTrash, HiOutlineFilter } from 'react-icons/hi';
import { formatDate, getStatusColor, leaveTypeLabels, getLeaveTypeColor } from '../utils/helpers';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await API.get('/leaves/my');
      const data = res.data.data || res.data;
      setLeaves(data);
    } catch (err) {
      toast.error('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this leave request?')) return;
    try {
      await API.delete(`/leaves/${id}`);
      toast.success('Leave cancelled');
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const filteredLeaves =
    filter === 'all' ? leaves : leaves.filter((l) => l.status === filter);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <SkeletonLoader type="table" count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave History</h1>
          <p className="text-sm text-gray-500 dark:text-indigo-300 mt-1">
            View all your leave applications
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <HiOutlineFilter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-900 
            text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 shadow-sm overflow-hidden">
        {filteredLeaves.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No leaves found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">From</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">To</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Days</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Reason</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filteredLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leaveTypeLabels[leave.leaveType]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatDate(leave.fromDate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{formatDate(leave.toDate)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{leave.days}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{leave.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {leave.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(leave._id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
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

export default LeaveHistory;
