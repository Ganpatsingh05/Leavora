import { HiOutlineHeart } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200/50 dark:border-indigo-800/20 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src="/leavora_logo.png" alt="Leavora" className="w-5 h-5 rounded object-contain" />
            <span className="text-xs text-gray-500 dark:text-indigo-400/60">
              &copy; {new Date().getFullYear()} Leavora. All rights reserved.
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-indigo-400/40 flex items-center gap-1">
            Built with <HiOutlineHeart className="w-3.5 h-3.5 text-red-400" /> by Leavora Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
