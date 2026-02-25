import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineDocumentAdd,
  HiOutlineClipboardList,
  HiOutlineUsers,
  HiOutlineLogout,
  HiOutlineCalendar,
  HiX,
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const employeeLinks = [
    { to: '/dashboard', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { to: '/apply-leave', icon: HiOutlineDocumentAdd, label: 'Apply Leave' },
    { to: '/leave-history', icon: HiOutlineClipboardList, label: 'Leave History' },
  ];

  const managerLinks = [
    { to: '/manager', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { to: '/apply-leave', icon: HiOutlineDocumentAdd, label: 'Apply Leave' },
    { to: '/leave-history', icon: HiOutlineClipboardList, label: 'Leave History' },
  ];

  const adminLinks = [
    { to: '/admin', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { to: '/admin/users', icon: HiOutlineUsers, label: 'Manage Users' },
    { to: '/admin/leaves', icon: HiOutlineCalendar, label: 'Leave History' },
    { to: '/admin/apply-leave', icon: HiOutlineDocumentAdd, label: 'Apply Leave' },
    { to: '/admin/my-leaves', icon: HiOutlineClipboardList, label: 'My Leaves' },
  ];

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'manager'
      ? managerLinks
      : employeeLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-linear-to-b from-indigo-950 via-indigo-900 to-indigo-950 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-auto
        flex flex-col lg:min-h-screen lg:sticky lg:top-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-indigo-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/leavora_logo.png" alt="Leavora" className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-indigo-500/30" />
            <div>
              <h1 className="text-white font-bold text-sm tracking-wide">Leavora</h1>
              <p className="text-indigo-300 text-[10px] uppercase tracking-widest">HR System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-indigo-300 hover:text-white transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <p className="text-indigo-400 text-[10px] uppercase tracking-widest font-semibold px-3 mb-3">
            Navigation
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-white/10 text-white shadow-lg shadow-indigo-500/10'
                    : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User info & Logout */}
        <div className="p-4 border-t border-indigo-800/50 shrink-0">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-indigo-300 text-[11px] capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
          >
            <HiOutlineLogout className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
