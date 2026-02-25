import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlinePlusCircle,
  HiOutlineTrash,
} from 'react-icons/hi';
import { formatDate, getStatusColor, leaveTypeLabels, getLeaveTypeColor } from '../utils/helpers';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const EmployeeDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leavesRes, statsRes, meRes] = await Promise.all([
        API.get('/leaves/my'),
        API.get('/leaves/stats'),
        API.get('/auth/me'),
      ]);
      const leavesData = leavesRes.data.data || leavesRes.data;
      setLeaves(leavesData);
      setStats(statsRes.data);
      // Refresh user balance from server to prevent stale data
      if (meRes.data?.leaveBalance) {
        updateUser({ leaveBalance: meRes.data.leaveBalance });
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave?')) return;
    try {
      await API.delete(`/leaves/${id}`);
      toast.success('Leave cancelled successfully');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel leave');
    }
  };

  const summaryCards = [
    {
      title: 'Pending Leaves',
      value: stats?.pending || 0,
      icon: HiOutlineClock,
      gradient: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/20',
      bg: 'bg-rose-50 dark:bg-rose-950/20',
    },
    {
      title: 'Approved Leaves',
      value: stats?.approved || 0,
      icon: HiOutlineCheckCircle,
      gradient: 'from-emerald-500 to-green-600',
      shadow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      title: 'Leave Balance',
      value: user?.leaveBalance
        ? (user.leaveBalance.casual || 0) +
          (user.leaveBalance.sick || 0) +
          (user.leaveBalance.earned || 0)
        : 37,
      icon: HiOutlineCalendar,
      gradient: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
    },
  ];

  // Chart data
  const doughnutData = {
    labels: ['Casual', 'Sick', 'Earned'],
    datasets: [
      {
        data: [
          user?.leaveBalance?.casual || 12,
          user?.leaveBalance?.sick || 10,
          user?.leaveBalance?.earned || 15,
        ],
        backgroundColor: ['#6366f1', '#f43f5e', '#f59e0b'],
        borderColor: ['#4f46e5', '#e11d48', '#d97706'],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const barData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Leaves',
        data: [stats?.pending || 0, stats?.approved || 0, stats?.rejected || 0],
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 12, family: 'Inter' },
        },
      },
    },
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-indigo-300 mt-1">
            Overview of your leave management
          </p>
        </div>
        <button
          onClick={() => navigate('/apply-leave')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 
          text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
          hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <HiOutlinePlusCircle className="w-5 h-5" />
          Apply Leave
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {summaryCards.map((card, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl p-6 ${card.bg} border border-gray-100 dark:border-indigo-800/20 
            hover:shadow-lg ${card.shadow} transition-all duration-300 hover:-translate-y-0.5`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-linear-to-br ${card.gradient} shadow-lg ${card.shadow}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            {/* Decorative */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-linear-to-br ${card.gradient} opacity-5 rounded-full`} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-indigo-800/20 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Leave Balance</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-indigo-800/20 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Leave Status Overview</h3>
          <div className="h-64">
            <Bar data={barData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* Leave History Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-indigo-800/20 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Leave Requests</h3>
        </div>

        {leaves.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No leave requests yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Apply for your first leave to get started</p>
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
                {leaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leaveTypeLabels[leave.leaveType] || leave.leaveType}
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
                          title="Cancel leave"
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

export default EmployeeDashboard;
