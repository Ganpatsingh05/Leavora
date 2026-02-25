import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineSun,
} from 'react-icons/hi';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="glass border-b border-gray-200/50 dark:border-indigo-800/30 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Menu button + Page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-indigo-300 hover:bg-gray-100 dark:hover:bg-indigo-800/30 transition-all"
            >
              <HiOutlineMenu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Welcome back, {user?.name?.split(' ')[0]} 👋
              </h2>
              <p className="text-xs text-gray-500 dark:text-indigo-300">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-indigo-300 hover:bg-gray-100 dark:hover:bg-indigo-800/30 transition-all duration-200"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <HiOutlineSun className="w-5 h-5" />
              ) : (
                <HiOutlineMoon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl text-gray-500 dark:text-indigo-300 hover:bg-gray-100 dark:hover:bg-indigo-800/30 transition-all duration-200">
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-indigo-900" />
            </button>

            {/* Avatar */}
            <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-indigo-700/50">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-[11px] text-gray-500 dark:text-indigo-300 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
