import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building,
  KeyRound,
  ChevronRight
} from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'employee' | 'client') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Demo Credentials Map
  const demoUsers = [
    {
      role: 'admin' as const,
      email: 'admin@worksuite.biz',
      password: 'adminpassword123',
      name: 'Zara Khan',
      title: 'Global Administrator',
      desc: 'Full administrative controls, billing, system metrics & settings.',
      icon: ShieldCheck,
      color: 'border-indigo-100 bg-indigo-50/40 text-indigo-700 hover:bg-indigo-50'
    },
    {
      role: 'employee' as const,
      email: 'employee@worksuite.biz',
      password: 'employeepassword123',
      name: 'Elena Rostova',
      title: 'Senior Developer',
      desc: 'Personal dashboard, timesheets, tasks, leaves & attendance.',
      icon: Users,
      color: 'border-emerald-100 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50'
    },
    {
      role: 'client' as const,
      email: 'client@worksuite.biz',
      password: 'clientpassword123',
      name: 'Sovereign Tech Ltd',
      title: 'Enterprise Client',
      desc: 'Project status tracking, invoice viewing, contracts & proposals.',
      icon: Building,
      color: 'border-amber-100 bg-amber-50/40 text-amber-700 hover:bg-amber-50'
    }
  ];

  const handleQuickLogin = (user: typeof demoUsers[0]) => {
    setIsLoading(true);
    setEmail(user.email);
    setPassword(user.password);
    setError('');
    
    setTimeout(() => {
      onLogin(user.role);
      setIsLoading(false);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    // Validate credentials against our demo users
    setTimeout(() => {
      const matchedUser = demoUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (matchedUser) {
        onLogin(matchedUser.role);
      } else {
        setError('Invalid credentials. Tip: Use the Quick Demo Login cards below for instant login.');
      }
      setIsLoading(false);
    }, 700);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setIsLoading(true);
    setTimeout(() => {
      setResetSuccess(true);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-800 antialiased selection:bg-indigo-100">
      
      {/* LEFT PANE: LOGIN FORM & QUICK LOGINS */}
      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-white relative z-10 shadow-xl">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Briefcase className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest font-mono">
                Work<span className="text-indigo-600">Suite</span>
              </h1>
              <p className="text-xs text-slate-400 font-bold tracking-tight uppercase">SaaS Enterprise OS</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded">
            v3.2 Demo Portal
          </span>
        </div>

        {/* Main Content Area */}
        <div className="my-auto py-8 max-w-md w-full mx-auto space-y-7">
          
          {!isForgotPassword ? (
            <>
              {/* Login Copy */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100/50 w-fit text-xs font-bold">
                  <Sparkles className="h-3 w-3" />
                  <span>SaaS Management Suite</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome to Worksuite
                </h2>
                <p className="text-slate-500 text-xs font-medium">
                  Provide your business credentials or use our quick-access demo profiles.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-2.5 bg-rose-50 text-rose-800 border border-rose-100 p-3 rounded-xl text-xs font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* standard Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. administrator@worksuite.biz"
                      className="w-full bg-slate-50 text-slate-800 text-base pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">
                      Secret Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 text-slate-800 text-base pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember my work session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              {/* DEMO PROFILES SECTION */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Quick Demo Profiles (One-Tap Login)
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {demoUsers.map((user) => {
                    const Icon = user.icon;
                    return (
                      <button
                        key={user.role}
                        id={`quick-login-${user.role}`}
                        type="button"
                        onClick={() => handleQuickLogin(user)}
                        className={`border rounded-xl p-3 text-left transition-all duration-150 hover:shadow-sm cursor-pointer border-slate-200 bg-white hover:border-slate-300 flex flex-col justify-between h-full`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`p-1 rounded-md border ${user.color}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-900 capitalize font-mono">
                            {user.role}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">{user.name}</p>
                          <p className="text-xs text-slate-400 font-medium truncate">{user.title}</p>
                        </div>
                        <div className="mt-2 pt-1 border-t border-slate-50 flex items-center justify-between w-full text-xs text-indigo-600 font-bold uppercase tracking-wider">
                          <span>Log In</span>
                          <ChevronRight className="h-2 w-2" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Forgot Password Flow */}
              <div className="space-y-1.5">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Recover Workspace Password
                </h2>
                <p className="text-slate-500 text-xs font-medium">
                  We'll dispatch a secure recovery token to restore your access.
                </p>
              </div>

              {resetSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                    <span>Password Token Dispatched!</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-normal">
                    An encrypted password modification link has been sent to <span className="font-bold">{resetEmail}</span>. Check your inbox to complete setup.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSuccess(false);
                      setResetEmail('');
                    }}
                    className="text-xs font-bold text-emerald-900 hover:underline pt-1 cursor-pointer block"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">
                      Registered Corporate Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. zara@worksuite.biz"
                        className="w-full bg-slate-50 text-slate-800 text-base pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setResetSuccess(false);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Go Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      {isLoading ? 'Processing...' : 'Send Recovery Link'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

        </div>

        {/* Footer info */}
        <div className="text-center pt-6 border-t border-slate-100 shrink-0">
          <p className="text-xs text-slate-400 font-medium">
            Protected by CloudArmor™ & AES-256 Intrusion Safeguards.
          </p>
        </div>

      </div>

      {/* RIGHT PANE: BRANDING SHOWCASE */}
      <div className="hidden lg:flex w-full lg:w-[45%] xl:w-[50%] bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-10 md:p-14 flex-col justify-between relative overflow-hidden">
        
        {/* Backdrop Decorative Glows */}
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -mr-60 -mt-60 pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />
        
        {/* Top Showcase Element */}
        <div className="relative z-10 shrink-0">
          <div className="flex items-center gap-2 bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 px-2.5 py-1 rounded-full w-fit text-xs font-bold">
            <Sparkles className="h-3 w-3" />
            <span>SaaS Business Solution</span>
          </div>
        </div>

        {/* Middle Showcase: Mock SaaS Dashboard metrics */}
        <div className="relative z-10 my-auto max-w-lg space-y-8 py-10">
          <div className="space-y-3">
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
              A Complete Business <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                Operating Ecosystem
              </span>
            </h2>
            <p className="text-slate-300 text-xs xl:text-sm font-medium leading-relaxed">
              Worksuite bridges the gap between projects, financial billing, human assets, biometric access loggers, and customer relations in one fast, responsive system.
            </p>
          </div>

          {/* Interactive Live Metrics display */}
          <div className="grid grid-cols-2 gap-4">
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-300 uppercase tracking-wider font-bold">Active Attendance</span>
              </div>
              <p className="text-2xl font-black text-white font-mono">94.8%</p>
              <p className="text-xs text-slate-400 font-semibold">Today’s live staff presence</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-300 uppercase tracking-wider font-bold">Project Success</span>
              </div>
              <p className="text-2xl font-black text-white font-mono">148+</p>
              <p className="text-xs text-slate-400 font-semibold">Delivered in current fiscal year</p>
            </div>

          </div>

          <div className="bg-gradient-to-r from-indigo-900/30 to-indigo-950/20 border border-indigo-500/10 p-4 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300">
              <KeyRound className="h-4 w-4" />
            </div>
            <p className="text-xs text-indigo-200 font-semibold leading-normal">
              Unified Single-Sign On (SSO) integration matches all access layers instantly. Perfect for modern, scalable workgroups.
            </p>
          </div>
        </div>

        {/* Footer copyrights */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-6 shrink-0 font-medium">
          <span>© 2026 Worksuite Systems, Inc.</span>
          <div className="flex gap-4">
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>

    </div>
  );
}
