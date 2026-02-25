import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import AdminLeaveHistory from './pages/AdminLeaveHistory';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-indigo-300 font-medium text-sm">Loading Leavora...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'manager' ? '/manager' : '/dashboard'} /> : <Login />} />
      <Route path="/register" element={<Navigate to="/login" />} />

      {/* Employee routes */}
      <Route element={<ProtectedRoute roles={['employee', 'manager']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/leave-history" element={<LeaveHistory />} />
      </Route>

      {/* Manager routes */}
      <Route element={<ProtectedRoute roles={['manager']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/manager" element={<ManagerDashboard />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/leaves" element={<AdminLeaveHistory />} />
        <Route path="/admin/apply-leave" element={<ApplyLeave />} />
        <Route path="/admin/my-leaves" element={<LeaveHistory />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : user.role === 'manager' ? '/manager' : '/dashboard') : '/login'} />} />
    </Routes>
  );
}

export default App;
