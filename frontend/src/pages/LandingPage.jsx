import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineLightningBolt,
  HiOutlineDocumentText,
  HiOutlineArrowRight,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineGlobe,
} from 'react-icons/hi';

const LandingPage = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const dashboardPath = user
    ? { admin: '/admin', manager: '/manager', employee: '/dashboard' }[user.role] || '/dashboard'
    : '/login';

  const features = [
    {
      icon: HiOutlineClock,
      title: 'Quick Leave Requests',
      description: 'Apply for leaves in seconds with an intuitive form. Track status in real-time from submission to approval.',
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      icon: HiOutlineShieldCheck,
      title: 'Role-Based Access',
      description: 'Separate dashboards for employees, managers, and admins. Everyone sees exactly what they need.',
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      icon: HiOutlineChartBar,
      title: 'Visual Analytics',
      description: 'Interactive charts showing leave patterns, team availability, and balance utilization at a glance.',
      gradient: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-50 dark:bg-violet-950/20',
    },
    {
      icon: HiOutlineUserGroup,
      title: 'Team Management',
      description: 'Managers can review, approve, or reject requests instantly. Admins manage the entire organization.',
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
    },
    {
      icon: HiOutlineLightningBolt,
      title: 'Instant Notifications',
      description: 'Stay informed with real-time status updates on your leave applications and team activity.',
      gradient: 'from-rose-500 to-pink-500',
      bg: 'bg-rose-50 dark:bg-rose-950/20',
    },
    {
      icon: HiOutlineDocumentText,
      title: 'Leave Balance Tracking',
      description: 'Automatic balance deduction on approval. See casual, sick, and earned leave balances anytime.',
      gradient: 'from-indigo-500 to-blue-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
  ];

  const stats = [
    { value: '6+', label: 'Leave Types' },
    { value: '3', label: 'User Roles' },
    { value: '24/7', label: 'Access' },
    { value: '100%', label: 'Paperless' },
  ];

  const steps = [
    { step: '01', title: 'Sign Up', description: 'Create your account with your @leavora.in email in just a few clicks.' },
    { step: '02', title: 'Apply Leave', description: 'Choose leave type, select dates, add a reason, and submit instantly.' },
    { step: '03', title: 'Get Approved', description: 'Your manager reviews and approves — balance is auto-updated.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

      {/* ─── Navbar ───────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-indigo-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/leavora_logo.png" alt="Leavora" className="w-9 h-9 rounded-xl object-contain" />
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Leavora</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
              <a href="#stats" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Why Leavora</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-indigo-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                aria-label="Toggle theme"
              >
                {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </button>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 
                text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-400/15 dark:bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-400/15 dark:bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-400/5 dark:bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/30 mb-8 animate-fade-in">
            <HiOutlineStar className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Modern HR Leave Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight animate-fade-in">
            Leave Management,{' '}
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Simplified.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '100ms' }}>
            Leavora streamlines your entire leave workflow — from applying and tracking to approving and analytics — all in one beautiful platform.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link
              to={dashboardPath}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 
              text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40
              hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              {user ? 'Open Dashboard' : 'Get Started Free'}
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-indigo-800/40 
              text-gray-700 dark:text-gray-300 font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-900 
              hover:border-gray-300 dark:hover:border-indigo-700 transition-all duration-200"
            >
              Learn More
            </a>
          </div>

          {/* Hero visual / Dashboard preview */}
          <div className="mt-16 sm:mt-20 relative animate-fade-in" style={{ animationDelay: '350ms' }}>
            <div className="absolute inset-0 bg-linear-to-t from-gray-50 dark:from-gray-950 via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
            <div className="relative mx-auto max-w-4xl rounded-2xl border border-gray-200/80 dark:border-indigo-800/30 overflow-hidden shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/5">
              <div className="bg-white dark:bg-gray-900 p-1">
                {/* Mock browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-t-xl border-b border-gray-100 dark:border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-6 rounded-lg bg-gray-200 dark:bg-gray-700 max-w-xs mx-auto flex items-center justify-center">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">leavora.in/dashboard</span>
                    </div>
                  </div>
                </div>
                {/* Mock dashboard content */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 p-4 text-white">
                      <p className="text-xs opacity-80">Pending</p>
                      <p className="text-2xl font-bold mt-1">5</p>
                    </div>
                    <div className="rounded-xl bg-linear-to-br from-emerald-500 to-green-600 p-4 text-white">
                      <p className="text-xs opacity-80">Approved</p>
                      <p className="text-2xl font-bold mt-1">23</p>
                    </div>
                    <div className="rounded-xl bg-linear-to-br from-amber-500 to-orange-600 p-4 text-white">
                      <p className="text-xs opacity-80">Balance</p>
                      <p className="text-2xl font-bold mt-1">37</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full border-[6px] border-indigo-200 dark:border-indigo-800 border-t-indigo-500 border-r-emerald-500" />
                    </div>
                    <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-end p-4 gap-2">
                      {[60, 40, 75, 55, 85, 45].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-md bg-linear-to-t from-indigo-500 to-violet-400" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────── */}
      <section id="stats" className="relative py-16 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-indigo-800/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────── */}
      <section id="features" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/30 mb-4">
              <HiOutlineLightningBolt className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Everything You Need
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              A complete suite of tools to manage leaves across your entire organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`group relative rounded-2xl p-6 ${feature.bg} border border-gray-100 dark:border-indigo-800/20 
                hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${feature.gradient} shadow-lg mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────── */}
      <section id="how-it-works" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800/30 mb-4">
              <HiOutlineGlobe className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Three Simple Steps
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Get started in minutes. No complex setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <div key={i} className="relative text-center group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-indigo-300 to-indigo-100 dark:from-indigo-700 dark:to-indigo-900" />
                )}

                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-extrabold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Roles Section ────────────────────────── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Built for Every Role
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Tailored experience for everyone in your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: 'Employee',
                color: 'from-blue-500 to-cyan-500',
                bg: 'bg-blue-50 dark:bg-blue-950/20',
                border: 'border-blue-100 dark:border-blue-800/20',
                items: ['Apply for leave instantly', 'Track request status', 'View leave balance', 'Cancel pending requests'],
              },
              {
                role: 'Manager',
                color: 'from-emerald-500 to-teal-500',
                bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                border: 'border-emerald-100 dark:border-emerald-800/20',
                items: ['Review team requests', 'Approve or reject leaves', 'View team analytics', 'Quick action dashboard'],
              },
              {
                role: 'Admin',
                color: 'from-violet-500 to-purple-500',
                bg: 'bg-violet-50 dark:bg-violet-950/20',
                border: 'border-violet-100 dark:border-violet-800/20',
                items: ['Manage all users', 'Organization-wide analytics', 'Full leave history', 'User CRUD operations'],
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 ${card.bg} border ${card.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`inline-flex px-4 py-1.5 rounded-full bg-linear-to-r ${card.color} text-white text-sm font-bold mb-6`}>
                  {card.role}
                </div>
                <ul className="space-y-3">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700" />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }} />

            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to Simplify Leave Management?
              </h2>
              <p className="mt-4 text-lg text-indigo-200 max-w-xl mx-auto">
                Join Leavora today and transform how your team handles time off. No credit card required.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-indigo-700 font-bold text-base 
                  shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                >
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-white/30 text-white font-semibold text-base 
                  hover:bg-white/10 transition-all duration-200"
                >
                  Explore Features
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────── */}
      <footer className="border-t border-gray-200/50 dark:border-indigo-800/20 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/leavora_logo.png" alt="Leavora" className="w-8 h-8 rounded-lg object-contain" />
              <div>
                <span className="font-bold text-gray-900 dark:text-white">Leavora</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Modern HR Leave Management</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
              <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</Link>
            </div>

            <p className="text-xs text-gray-400 dark:text-indigo-400/50">
              &copy; {new Date().getFullYear()} Leavora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
