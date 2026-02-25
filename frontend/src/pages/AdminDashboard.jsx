import { useState, useEffect } from 'react';
import API from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import {
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCalendar,
} from 'react-icons/hi';
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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('/leaves/stats'),
        API.get('/users'),
      ]);
      setStats(statsRes.data);
      const usersData = usersRes.data.data || usersRes.data;
      setUsers(usersData);
    } catch (err) {
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const roleCount = {
    admin: users.filter((u) => u.role === 'admin').length,
    manager: users.filter((u) => u.role === 'manager').length,
    employee: users.filter((u) => u.role === 'employee').length,
  };

  const statusChart = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [stats?.pending || 0, stats?.approved || 0, stats?.rejected || 0],
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
        borderWidth: 2,
        borderColor: ['#d97706', '#059669', '#dc2626'],
        hoverOffset: 6,
      },
    ],
  };

  const leaveTypeChart = {
    labels: (stats?.leaveTypeStats || []).map(
      (s) => s._id?.charAt(0).toUpperCase() + s._id?.slice(1)
    ),
    datasets: [
      {
        label: 'Applications',
        data: (stats?.leaveTypeStats || []).map((s) => s.count),
        backgroundColor: ['#6366f1', '#f43f5e', '#8b5cf6', '#ec4899', '#14b8a6', '#6b7280'],
        borderRadius: 8,
        borderSkipped: false,
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-indigo-300 mt-1">
          System overview and analytics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: 'Total Users', value: users.length, icon: HiOutlineUsers, gradient: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
          { title: 'Total Leaves', value: stats?.total || 0, icon: HiOutlineCalendar, gradient: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
          { title: 'Pending', value: stats?.pending || 0, icon: HiOutlineClock, gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
          { title: 'Approved', value: stats?.approved || 0, icon: HiOutlineCheckCircle, gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
          { title: 'Rejected', value: stats?.rejected || 0, icon: HiOutlineXCircle, gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-950/20' },
        ].map((card, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 ${card.bg} border border-gray-100 dark:border-indigo-800/20 hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-linear-to-br ${card.gradient}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{card.title}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-indigo-800/20 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Leave Status</h3>
          <div className="h-56">
            <Doughnut
              data={statusChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, font: { size: 11 } } } },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-indigo-800/20 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">By Leave Type</h3>
          <div className="h-56">
            <Bar
              data={leaveTypeChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-indigo-800/20 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">User Roles</h3>
          <div className="space-y-4 mt-6">
            {[
              { label: 'Admins', count: roleCount.admin, color: 'bg-indigo-500', total: users.length },
              { label: 'Managers', count: roleCount.manager, color: 'bg-emerald-500', total: users.length },
              { label: 'Employees', count: roleCount.employee, color: 'bg-amber-500', total: users.length },
            ].map((role, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{role.label}</span>
                  <span className="text-gray-900 dark:text-white font-bold">{role.count}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${role.color} rounded-full transition-all duration-500`}
                    style={{ width: `${role.total ? (role.count / role.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
