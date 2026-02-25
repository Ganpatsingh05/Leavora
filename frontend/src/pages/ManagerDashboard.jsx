import { useState, useEffect } from 'react';
import API from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineUsers,
} from 'react-icons/hi';
import { formatDate, getStatusColor, leaveTypeLabels, getLeaveTypeColor, getInitials } from '../utils/helpers';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ManagerDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviewLoading, setReviewLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leavesRes, statsRes] = await Promise.all([
        API.get('/leaves'),
        API.get('/leaves/stats'),
      ]);
      const leavesData = leavesRes.data.data || leavesRes.data;
      setLeaves(leavesData);
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load data');
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
      toast.success(`Leave ${status} successfully`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update leave');
    } finally {
      setReviewLoading(null);
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchSearch =
      leave.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      leave.reason?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || leave.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  const chartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [stats?.pending || 0, stats?.approved || 0, stats?.rejected || 0],
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
        borderColor: ['#d97706', '#059669', '#dc2626'],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <SkeletonLoader type="card" count={3} />
        <SkeletonLoader type="table" count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-indigo-300 mt-1">
          Manage and review team leave requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { title: 'Total Requests', value: stats?.total || 0, icon: HiOutlineUsers, gradient: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
          { title: 'Pending', value: stats?.pending || 0, icon: HiOutlineClock, gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
          { title: 'Approved', value: stats?.approved || 0, icon: HiOutlineCheckCircle, gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
          { title: 'Rejected', value: stats?.rejected || 0, icon: HiOutlineXCircle, gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-950/20' },
        ].map((card, i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 ${card.bg} border border-gray-100 dark:border-indigo-800/20 
            hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl bg-linear-to-br ${card.gradient}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-indigo-800/20 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Status Overview</h3>
          <div className="h-52">
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { padding: 12, usePointStyle: true, font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-indigo-800/20 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Pending Approvals
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {pendingCount}
              </span>
            )}
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {leaves
              .filter((l) => l.status === 'pending')
              .slice(0, 5)
              .map((leave) => (
                <div
                  key={leave._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(leave.user?.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{leave.user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {leaveTypeLabels[leave.leaveType]} · {leave.days} day{leave.days > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(leave._id, 'approved')}
                      disabled={reviewLoading === leave._id + 'approved'}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium 
                      hover:scale-105 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(leave._id, 'rejected')}
                      disabled={reviewLoading === leave._id + 'rejected'}
                      className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium 
                      hover:scale-105 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            {pendingCount === 0 && (
              <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-6">No pending requests</p>
            )}
          </div>
        </div>
      </div>

      {/* All Requests Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">All Leave Requests</h3>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee..."
                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-800 
                text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-48"
              />
            </div>
            {/* Filter */}
            <div className="relative flex items-center gap-1">
              <HiOutlineFilter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-indigo-700/50 bg-white dark:bg-gray-800 
                text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 dark:text-gray-500">No leave requests found</p>
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
                {filteredLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(leave.user?.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{leave.user?.name}</p>
                          <p className="text-xs text-gray-400">{leave.user?.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leaveTypeLabels[leave.leaveType]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(leave.fromDate)}</p>
                      <p className="text-xs text-gray-400">to {formatDate(leave.toDate)} · {leave.days}d</p>
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
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium 
                            hover:scale-105 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(leave._id, 'rejected')}
                            disabled={reviewLoading === leave._id + 'rejected'}
                            className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium 
                            hover:scale-105 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
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

export default ManagerDashboard;
