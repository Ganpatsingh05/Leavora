import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowRight,
} from 'react-icons/hi';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const [focusedField, setFocusedField] = useState(null);
  const { login, register } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { toast.error('Please fill in all fields'); return; }
    setLoginLoading(true);
    try {
      const data = await login(loginEmail, loginPassword);
      toast.success(`Welcome back, ${data.name}!`);
      navigate({ admin: '/admin', manager: '/manager', employee: '/dashboard' }[data.role] || '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoginLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regConfirm) { toast.error('Please fill in all fields'); return; }
    if (!regEmail.endsWith('@leavora.in')) { toast.error('Only @leavora.in email addresses are allowed'); return; }
    if (regPassword !== regConfirm) { toast.error('Passwords do not match'); return; }
    if (regPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setRegLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setRegLoading(false); }
  };

  const inputWrap = (field) =>
    `relative rounded-xl border transition-all duration-200 ${
      focusedField === field
        ? 'border-indigo-500 ring-2 ring-indigo-500/20 dark:ring-indigo-400/20'
        : 'border-gray-200 dark:border-indigo-700/40 hover:border-gray-300 dark:hover:border-indigo-600/50'
    }`;

  const iconCls = (field) =>
    `absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
      focusedField === field ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-indigo-400/60'
    }`;

  const inputCls = 'w-full pl-11 pr-4 py-3 rounded-xl bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-indigo-400/40 focus:outline-none text-sm';
  const inputClsPass = 'w-full pl-11 pr-11 py-3 rounded-xl bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-indigo-400/40 focus:outline-none text-sm';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-400/10 dark:bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-violet-400/10 dark:bg-violet-500/8 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="relative z-30 flex items-center justify-between px-5 sm:px-8 py-4">
        <div className="flex items-center gap-2.5">
          <img src="/leavora_logo.png" alt="Leavora" className="w-9 h-9 rounded-lg object-contain" />
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Leavora</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-500 dark:text-indigo-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm border border-gray-200/50 dark:border-indigo-800/30"
          aria-label="Toggle theme"
        >
          {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
        </button>
      </div>

      {/* Main auth container */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 relative z-10">
        <div className="w-full max-w-230 relative">
          {/* Mobile toggle tabs */}
          <div className="md:hidden flex mb-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50 dark:border-indigo-800/20">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                !isSignUp
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-gray-500 dark:text-indigo-300/60 hover:text-gray-700 dark:hover:text-indigo-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isSignUp
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-gray-500 dark:text-indigo-300/60 hover:text-gray-700 dark:hover:text-indigo-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Card */}
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-200/50 dark:shadow-indigo-950/50 border border-gray-200/60 dark:border-indigo-800/20 overflow-hidden">
            <div className="flex flex-col md:flex-row relative min-h-130">

              {/* ============ LEFT: Sign In Form ============ */}
              <div className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center transition-all duration-500 ease-in-out ${
                isSignUp ? 'hidden md:flex md:opacity-40 md:blur-[2px] md:pointer-events-none md:scale-95' : 'flex opacity-100'
              }`}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Hello!
                  </h2>
                  <p className="text-gray-500 dark:text-indigo-300/70 text-sm">
                    Have we met before? Sign in to continue.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Email</label>
                    <div className={inputWrap('l-email')}>
                      <HiOutlineMail className={iconCls('l-email')} />
                      <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                        onFocus={() => setFocusedField('l-email')} onBlur={() => setFocusedField(null)}
                        placeholder="name@email.com" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Password</label>
                    <div className={inputWrap('l-pass')}>
                      <HiOutlineLockClosed className={iconCls('l-pass')} />
                      <input type={showLoginPassword ? 'text' : 'password'} value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onFocus={() => setFocusedField('l-pass')} onBlur={() => setFocusedField(null)}
                        placeholder="Enter your password" className={inputClsPass} />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-indigo-400/60 hover:text-gray-600 dark:hover:text-indigo-300 transition-colors">
                        {showLoginPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loginLoading}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
                    text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                    hover:scale-[1.01] active:scale-[0.99] transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2">
                    {loginLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                    ) : 'LOG IN'}
                  </button>
                </form>

                {/* Demo creds */}
                <div className="mt-5 p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100/60 dark:border-indigo-800/15">
                  <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 mb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" /> Demo Credentials
                  </p>
                  <div className="space-y-0.5 text-[11px] text-indigo-600/80 dark:text-indigo-400/70 font-mono leading-relaxed">
                    <p><span className="font-semibold font-sans text-indigo-700 dark:text-indigo-300">Admin:</span> admin@leavora.in / password123</p>
                    <p><span className="font-semibold font-sans text-indigo-700 dark:text-indigo-300">Manager:</span> manager@leavora.in / password123</p>
                    <p><span className="font-semibold font-sans text-indigo-700 dark:text-indigo-300">Employee:</span> john@leavora.in / password123</p>
                  </div>
                </div>

                {/* Mobile-only sign up link */}
                <p className="md:hidden mt-5 text-center text-sm text-gray-500 dark:text-indigo-300/60">
                  Don't have an account?{' '}
                  <button onClick={() => setIsSignUp(true)} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Sign up
                  </button>
                </p>
              </div>

              {/* ============ RIGHT: Sign Up Form ============ */}
              <div className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center transition-all duration-500 ease-in-out ${
                !isSignUp ? 'hidden md:flex md:opacity-40 md:blur-[2px] md:pointer-events-none md:scale-95' : 'flex opacity-100'
              }`}>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Create Account
                  </h2>
                  <p className="text-gray-500 dark:text-indigo-300/70 text-sm">
                    Fill in your details to get started
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Full Name</label>
                    <div className={inputWrap('r-name')}>
                      <HiOutlineUser className={iconCls('r-name')} />
                      <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                        onFocus={() => setFocusedField('r-name')} onBlur={() => setFocusedField(null)}
                        placeholder="John Doe" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Email</label>
                    <div className={inputWrap('r-email')}>
                      <HiOutlineMail className={iconCls('r-email')} />
                      <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                        onFocus={() => setFocusedField('r-email')} onBlur={() => setFocusedField(null)}
                        placeholder="you@leavora.in" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Password</label>
                    <div className={inputWrap('r-pass')}>
                      <HiOutlineLockClosed className={iconCls('r-pass')} />
                      <input type={showRegPassword ? 'text' : 'password'} value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        onFocus={() => setFocusedField('r-pass')} onBlur={() => setFocusedField(null)}
                        placeholder="Min 8 characters" className={inputClsPass} />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-indigo-400/60 hover:text-gray-600 dark:hover:text-indigo-300 transition-colors">
                        {showRegPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-1.5">Confirm Password</label>
                    <div className={inputWrap('r-conf')}>
                      <HiOutlineLockClosed className={iconCls('r-conf')} />
                      <input type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)}
                        onFocus={() => setFocusedField('r-conf')} onBlur={() => setFocusedField(null)}
                        placeholder="Re-enter password" className={inputCls} />
                    </div>
                  </div>

                  <button type="submit" disabled={regLoading}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
                    text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                    hover:scale-[1.01] active:scale-[0.99] transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-1">
                    {regLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                    ) : 'SIGN UP'}
                  </button>
                </form>

                {/* Mobile-only sign in link */}
                <p className="md:hidden mt-5 text-center text-sm text-gray-500 dark:text-indigo-300/60">
                  Already have an account?{' '}
                  <button onClick={() => setIsSignUp(false)} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </div>

              {/* ============ SLIDING OVERLAY (desktop only) ============ */}
              <div className={`hidden md:flex absolute top-0 h-full w-1/2 transition-transform duration-700 ease-in-out z-20 ${
                isSignUp ? 'translate-x-0' : 'translate-x-full'
              }`}>
                <div className="w-full h-full bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 flex items-center justify-center p-10 relative overflow-hidden">
                  {/* Decorative */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-12 left-12 w-32 h-32 bg-white/8 rounded-full blur-2xl" />
                    <div className="absolute bottom-12 right-12 w-48 h-48 bg-violet-400/15 rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }} />
                  </div>

                  {/* Overlay content — switches based on state */}
                  <div className="relative z-10 text-center max-w-xs">
                    <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <img src="/leavora_logo.png" alt="Leavora" className="w-9 h-9 rounded-lg object-contain" />
                    </div>

                    {isSignUp ? (
                      <>
                        <h3 className="text-2xl font-bold text-white mb-3">Welcome Back!</h3>
                        <p className="text-indigo-200/80 text-sm leading-relaxed mb-8">
                          Already have an account? Sign in to access your dashboard and manage your leaves.
                        </p>
                        <button
                          onClick={() => setIsSignUp(false)}
                          className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl border-2 border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200"
                        >
                          SIGN IN <HiOutlineArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-white mb-3">New Here?</h3>
                        <p className="text-indigo-200/80 text-sm leading-relaxed mb-8">
                          Create an account to get started with Leavora and streamline your leave management.
                        </p>
                        <button
                          onClick={() => setIsSignUp(true)}
                          className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl border-2 border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200"
                        >
                          SIGN UP <HiOutlineArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-5 sm:px-8 text-center">
        <p className="text-xs text-gray-400 dark:text-indigo-400/50">
          &copy; {new Date().getFullYear()} Leavora. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Login;
