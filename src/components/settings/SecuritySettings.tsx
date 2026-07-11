import React, { useState } from 'react';
import { 
  Lock, AlertCircle, Info, Check, Shield, ShieldCheck, Mail, Key, 
  Smartphone, QrCode, Copy, Download, RefreshCw, X, Laptop, Eye, EyeOff, Save, RotateCcw
} from 'lucide-react';

interface SecuritySettingsProps {
  onNotify: (message: string) => void;
}

interface AuditLog {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  time: string;
  trusted: boolean;
}

export default function SecuritySettings({ onNotify }: SecuritySettingsProps) {
  const [activeTab, setActiveTab] = useState<'2fa' | 'recaptcha'>('2fa');

  // --- Two-Factor Authentication (2FA) States ---
  const [showSmtpVerifyModal, setShowSmtpVerifyModal] = useState(false);
  const [smtpVerifyCode, setSmtpVerifyCode] = useState('');
  const [smtpVerifying, setSmtpVerifying] = useState(false);
  const [smtpConfigured, setSmtpConfigured] = useState(false);

  // Email 2FA setup states
  const [email2faEnabled, setEmail2faEnabled] = useState(false);
  const [emailTesting, setEmailTesting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'disabled' | 'pending' | 'enabled'>('disabled');
  const [emailLastVerified, setEmailLastVerified] = useState<string | null>(null);

  // Authenticator 2FA states
  const [auth2faEnabled, setAuth2faEnabled] = useState(false);
  const [showAuthSetupModal, setShowAuthSetupModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [authOtpError, setAuthOtpError] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([
    'ABCD-EFGH-1234', 'IJKL-MNOP-5678', 'QRST-UVWX-9012', 'YZAB-CDEF-3456',
    'GHIJ-KLMN-7890', 'OPQR-STUV-1234', 'WXYZ-ABCD-5678', 'EFGH-IJKL-9012'
  ]);
  const [showDisableAuthModal, setShowDisableAuthModal] = useState(false);

  // Additional Features
  const [rememberDeviceDays, setRememberDeviceDays] = useState<'30' | '90' | 'always'>('30');
  const [require2faRoles, setRequire2faRoles] = useState({
    admin: true,
    managers: false,
    employees: false,
    clients: false
  });
  const [forceExistingUsers, setForceExistingUsers] = useState(false);
  const [loginRecoveryOptions, setLoginRecoveryOptions] = useState({
    email: true,
    codes: true,
    adminReset: true
  });

  // Audit Logs (Trusted devices / history)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', device: 'Apple MacBook Pro M3', browser: 'Safari 17.4', ip: '192.168.1.45', location: 'San Francisco, CA (US)', time: 'Just now', trusted: true },
    { id: '2', device: 'Dell XPS 15', browser: 'Chrome 122.0', ip: '64.233.160.1', location: 'Mountain View, CA (US)', time: '2 hours ago', trusted: true },
    { id: '3', device: 'Apple iPhone 15 Pro', browser: 'Mobile Safari', ip: '172.56.21.89', location: 'Oakland, CA (US)', time: 'Yesterday, 04:12 PM', trusted: false },
    { id: '4', device: 'Ubuntu Desktop', browser: 'Firefox 123.0', ip: '198.51.100.42', location: 'London (UK)', time: '3 days ago', trusted: false }
  ]);

  // --- Google reCAPTCHA States ---
  const [recaptchaEnabled, setRecaptchaEnabled] = useState(false);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState('6Ld_XmUoAAAAAH9XXXXXXXXXXXXXXXXXXXXXXXX');
  const [recaptchaSecretKey, setRecaptchaSecretKey] = useState('6Ld_XmUoAAAAAGsXXXXXXXXXXXXXXXXXXXXXXXX');
  const [recaptchaVersion, setRecaptchaVersion] = useState<'v2-checkbox' | 'v2-invisible' | 'v3-score'>('v2-checkbox');
  const [recaptchaMinScore, setRecaptchaMinScore] = useState(0.5);
  const [recaptchaEnv, setRecaptchaEnv] = useState<'dev' | 'prod'>('dev');
  const [testingRecaptcha, setTestingRecaptcha] = useState(false);

  const [recaptchaScopes, setRecaptchaScopes] = useState({
    login: true,
    register: true,
    forgot: true,
    contact: false,
    support: false,
    lead: false,
    clientPortal: true,
    employeePortal: false,
    adminPortal: true
  });

  // --- Handlers ---
  const handleVerifySmtp = () => {
    if (!smtpVerifyCode.trim()) {
      onNotify('Please enter verification code');
      return;
    }
    setSmtpVerifying(true);
    setTimeout(() => {
      setSmtpVerifying(false);
      setSmtpConfigured(true);
      setShowSmtpVerifyModal(false);
      onNotify('SMTP configuration verified and connected successfully!');
    }, 1500);
  };

  const handleTestEmail2fa = () => {
    setEmailTesting(true);
    setTimeout(() => {
      setEmailTesting(false);
      onNotify('Test email sent to admin@example.com successfully!');
    }, 1200);
  };

  const handleToggleEmail2fa = () => {
    if (!email2faEnabled) {
      if (!smtpConfigured) {
        onNotify('Warning: SMTP is not configured. Please verify your SMTP settings first!');
        setShowSmtpVerifyModal(true);
        return;
      }
      setEmail2faEnabled(true);
      setEmailStatus('enabled');
      setEmailLastVerified(new Date().toLocaleString());
      onNotify('Email Two-Factor Authentication has been enabled!');
    } else {
      setEmail2faEnabled(false);
      setEmailStatus('disabled');
      onNotify('Email Two-Factor Authentication has been disabled.');
    }
  };

  const handleVerifyOtpCode = () => {
    if (otpCode === '123456' || otpCode.length === 6) {
      setAuth2faEnabled(true);
      setShowAuthSetupModal(false);
      setOtpCode('');
      setAuthOtpError('');
      onNotify('Google Authenticator activated successfully!');
    } else {
      setAuthOtpError('Invalid verification code. Please try again (Hint: enter any 6 digits).');
    }
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText('NBSWY3DPEB3W64TBNQXD2');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    onNotify('Secret key copied to clipboard!');
  };

  const regenerateRecoveryCodes = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const newCodes = Array.from({ length: 8 }, () => {
      const p1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const p2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      const p3 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      return `${p1}-${p2}-${p3}`;
    });
    setRecoveryCodes(newCodes);
    onNotify('New recovery codes generated successfully!');
  };

  const downloadRecoveryCodes = () => {
    const text = `Worksuite Security Backup Recovery Codes\nGenerated: ${new Date().toLocaleString()}\n\n` + recoveryCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'worksuite-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Recovery codes text file downloaded.');
  };

  const toggleTrustedDevice = (id: string) => {
    setAuditLogs(prev => prev.map(log => log.id === id ? { ...log, trusted: !log.trusted } : log));
    onNotify('Device trust status updated!');
  };

  const handleTestRecaptcha = () => {
    setTestingRecaptcha(true);
    setTimeout(() => {
      setTestingRecaptcha(false);
      onNotify('reCAPTCHA test connection succeeded! Keys are valid.');
    }, 1500);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Security settings saved successfully!');
  };

  return (
    <div className="space-y-6" id="security-settings-container">
      {/* Breadcrumbs */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">System Settings</span>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Shield className="h-5.5 w-5.5 text-indigo-600" />
          <span>Security Settings</span>
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('2fa')}
          className={`pb-3 text-xs font-bold relative transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === '2fa' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Two-Factor Authentication</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          {activeTab === '2fa' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('recaptcha')}
          className={`pb-3 text-xs font-bold relative transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'recaptcha' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Google reCAPTCHA</span>
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          {activeTab === 'recaptcha' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        
        {/* TAB 1: 2FA */}
        {activeTab === '2fa' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Banner */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex gap-3 items-start text-xs font-semibold text-slate-600 leading-relaxed">
              <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-800 font-bold">Two-Factor Authentication (2FA)</p>
                <p className="text-slate-500">Increase your account's security by enabling Two-Factor Authentication (2FA) to block unauthorized login attempts.</p>
              </div>
            </div>

            {/* SMTP Warning Card */}
            {!smtpConfigured ? (
              <div className="bg-rose-50/75 border border-rose-150 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex gap-2.5 items-center">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                  <span className="font-bold text-rose-900">Email SMTP settings not configured.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSmtpVerifyModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-extrabold px-4 py-2 rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Verify
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex gap-2.5 items-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900">SMTP Server Connected</span>
                    <p className="text-[10px] text-emerald-700 font-semibold">Ready for email verification alerts and codes.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSmtpConfigured(false); onNotify('SMTP simulation reset.'); }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold hover:underline"
                >
                  Reset SMTP
                </button>
              </div>
            )}

            {/* 2FA Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: Setup Using Email */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">Setup Using Email</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email OTP verification</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Enabling this feature will send single-use verification codes to your registered email address <span className="font-bold text-slate-700">admin@example.com</span> each time you attempt a secure login.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Status Badge</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      email2faEnabled 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {email2faEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  {emailLastVerified && (
                    <div className="text-[10px] text-slate-400 font-semibold flex justify-between">
                      <span>Last verified time:</span>
                      <span>{emailLastVerified}</span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleToggleEmail2fa}
                      className={`flex-1 text-center py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        email2faEnabled 
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-150'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      }`}
                    >
                      {email2faEnabled ? 'Disable' : 'Enable'}
                    </button>
                    {email2faEnabled && (
                      <button
                        type="button"
                        onClick={handleTestEmail2fa}
                        disabled={emailTesting}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1 shrink-0"
                      >
                        {emailTesting ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <span>Test Email</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Google Authenticator */}
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">Setup Using Google Authenticator</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time-based OTP (TOTP)</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Use standard authenticator apps like Google Authenticator, Microsoft Authenticator or Authy to generate secure verification codes even when offline. Available for Android and iPhone.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Status Badge</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      auth2faEnabled 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {auth2faEnabled ? 'Enabled & Live' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {auth2faEnabled ? (
                      <button
                        type="button"
                        onClick={() => setShowDisableAuthModal(true)}
                        className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-150 text-center py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        Disable Authentication
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAuthSetupModal(true)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-colors"
                      >
                        Enable Authenticator
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Additional Features Section */}
            <div className="pt-4 border-t border-slate-100 space-y-5">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Advanced Controls & Global Enforcement</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Remember Device */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Remember Device Validity</span>
                    <Info className="h-3.5 w-3.5 text-slate-400" />
                  </label>
                  <p className="text-[10px] text-slate-400 font-semibold">Exclude trusted systems from subsequent OTP requests for a designated period.</p>
                  <select
                    value={rememberDeviceDays}
                    onChange={(e) => setRememberDeviceDays(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer text-slate-700"
                  >
                    <option value="30">30 Days (Standard recommendation)</option>
                    <option value="90">90 Days (Enterprise security scope)</option>
                    <option value="always">Always Ask (Paranoid mode)</option>
                  </select>
                </div>

                {/* Force users to enable */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Global Mandate</label>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Force Existing Users to Enable 2FA</span>
                      <span className="text-[10px] text-slate-400 font-medium block">Prompts users to setup 2FA immediately on their next login session.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForceExistingUsers(!forceExistingUsers)}
                      className="cursor-pointer"
                    >
                      <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${forceExistingUsers ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${forceExistingUsers ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  </div>
                </div>

              </div>

              {/* Roles matrix */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-700 block">Require 2FA For Roles</label>
                  <p className="text-[10px] text-slate-400 font-semibold">Strictly enforce active 2FA parameters across selected user scopes.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(require2faRoles).map(([role, val]) => (
                    <label key={role} className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50/50 transition-all cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={() => setRequire2faRoles(prev => ({ ...prev, [role]: !val }))}
                        className="h-4.5 w-4.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700 capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recovery Options checklist */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-700 block">Login Recovery Methods</label>
                  <p className="text-[10px] text-slate-400 font-semibold">Allow users to regain secure workspace portal access in case OTP devices are lost.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { key: 'email', label: 'Email Backup', desc: 'Verify backup code sent to verified email.' },
                    { key: 'codes', label: 'Recovery Codes', desc: 'Pre-generated static alpha codes.' },
                    { key: 'adminReset', label: 'Admin Reset', desc: 'Administrators can bypass security logs.' }
                  ].map(opt => (
                    <label key={opt.key} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50/50 transition-all cursor-pointer flex gap-2.5">
                      <input
                        type="checkbox"
                        checked={(loginRecoveryOptions as any)[opt.key]}
                        onChange={() => setLoginRecoveryOptions(prev => ({ ...prev, [opt.key]: !(prev as any)[opt.key] }))}
                        className="h-4.5 w-4.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{opt.label}</span>
                        <span className="text-[9px] text-slate-400 font-medium block leading-tight">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recovery codes display */}
              {auth2faEnabled && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Active Backup Recovery Codes</h5>
                      <p className="text-[10px] text-slate-400 font-medium">Keep these stored safely in offline locations. Each code can be utilized once.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={downloadRecoveryCodes}
                        className="bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 shadow-3xs cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Codes</span>
                      </button>
                      <button
                        type="button"
                        onClick={regenerateRecoveryCodes}
                        className="bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 shadow-3xs cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs font-bold text-slate-700 bg-white border border-slate-150 p-4 rounded-xl text-center">
                    {recoveryCodes.map((code, idx) => (
                      <span key={idx} className="bg-slate-50/70 p-2 rounded border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent audit logs / trusted devices */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-700 block">Recent Login Activity & Trusted Devices</label>
                  <p className="text-[10px] text-slate-400 font-semibold">Verify active browsers and secure locations currently mapping into your account.</p>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black">
                      <tr>
                        <th className="p-3">Device & Browser</th>
                        <th className="p-3">IP Address</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Time</th>
                        <th className="p-3 text-right">Trust State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 flex items-center gap-2">
                            <Laptop className="h-4 w-4 text-slate-400 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-800">{log.device}</p>
                              <p className="text-[9px] text-slate-400 font-medium">{log.browser}</p>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-slate-500">{log.ip}</td>
                          <td className="p-3 text-slate-600">{log.location}</td>
                          <td className="p-3 text-[10px] text-slate-400">{log.time}</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => toggleTrustedDevice(log.id)}
                              className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase transition-all border cursor-pointer ${
                                log.trusted 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-150 hover:bg-emerald-100' 
                                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {log.trusted ? 'Trusted' : 'Untrusted'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Google reCAPTCHA */}
        {activeTab === 'recaptcha' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Main Toggle Checkbox */}
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex items-start gap-3">
              <input
                type="checkbox"
                id="recaptcha-master-toggle"
                checked={recaptchaEnabled}
                onChange={() => setRecaptchaEnabled(!recaptchaEnabled)}
                className="h-5 w-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer mt-0.5"
              />
              <div className="space-y-0.5 cursor-pointer select-none" onClick={() => setRecaptchaEnabled(!recaptchaEnabled)}>
                <label className="text-xs font-extrabold text-slate-800 block">Enable Google reCAPTCHA</label>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Protect application sign up forms, portal entries, and support ticket submissions from spam and bots.
                </p>
              </div>
            </div>

            {/* Config form */}
            {recaptchaEnabled && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Credentials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">reCAPTCHA Site Key</label>
                    <input
                      type="text"
                      value={recaptchaSiteKey}
                      onChange={(e) => setRecaptchaSiteKey(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 placeholder-slate-400"
                      placeholder="Enter Google reCAPTCHA Site Key"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">reCAPTCHA Secret Key</label>
                    <input
                      type="password"
                      value={recaptchaSecretKey}
                      onChange={(e) => setRecaptchaSecretKey(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 placeholder-slate-400"
                      placeholder="Enter Google reCAPTCHA Secret Key"
                    />
                  </div>
                </div>

                {/* reCAPTCHA Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Version select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">reCAPTCHA Version</label>
                    <select
                      value={recaptchaVersion}
                      onChange={(e) => setRecaptchaVersion(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer text-slate-700"
                    >
                      <option value="v2-checkbox">reCAPTCHA v2 Checkbox</option>
                      <option value="v2-invisible">reCAPTCHA v2 Invisible</option>
                      <option value="v3-score">reCAPTCHA v3 Score-Based</option>
                    </select>
                  </div>

                  {/* Min Score slider */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block flex justify-between">
                      <span>Minimum Passing Score</span>
                      <span className="font-mono text-indigo-600 font-extrabold">{recaptchaMinScore}</span>
                    </label>
                    <div className="h-10 flex items-center gap-3">
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        disabled={recaptchaVersion !== 'v3-score'}
                        value={recaptchaMinScore}
                        onChange={(e) => setRecaptchaMinScore(parseFloat(e.target.value))}
                        className={`w-full h-1.5 rounded-lg cursor-pointer accent-indigo-600 ${
                          recaptchaVersion !== 'v3-score' ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Environment */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Environment</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                      <button
                        type="button"
                        onClick={() => setRecaptchaEnv('dev')}
                        className={`py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
                          recaptchaEnv === 'dev' 
                            ? 'bg-white text-indigo-600 shadow-3xs' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Development
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecaptchaEnv('prod')}
                        className={`py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
                          recaptchaEnv === 'prod' 
                            ? 'bg-indigo-600 text-white shadow-3xs' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Production
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scope checkboxes */}
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-slate-700 block">Enable reCAPTCHA Validation On</label>
                    <p className="text-[10px] text-slate-400 font-semibold">Select client-facing and admin portal screens to inject Google anti-bot scripts.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'login', label: 'Login Panel' },
                      { key: 'register', label: 'Registration Form' },
                      { key: 'forgot', label: 'Forgot Password Page' },
                      { key: 'contact', label: 'Contact Web-forms' },
                      { key: 'support', label: 'Support Ticket Portal' },
                      { key: 'lead', label: 'Public Lead Forms' },
                      { key: 'clientPortal', label: 'Client Sign in Portal' },
                      { key: 'employeePortal', label: 'Employee Attendance Portal' },
                      { key: 'adminPortal', label: 'Administrator Portal' }
                    ].map(scope => (
                      <label key={scope.key} className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50/50 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(recaptchaScopes as any)[scope.key]}
                          onChange={() => setRecaptchaScopes(prev => ({ ...prev, [scope.key]: !(prev as any)[scope.key] }))}
                          className="h-4.5 w-4.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-700">{scope.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preview Widget */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                  <span className="text-[10px] uppercase text-slate-400 font-black block">Live Preview Widget Mock</span>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-3xs max-w-sm">
                    {recaptchaVersion === 'v2-checkbox' && (
                      <div className="flex items-center justify-between border border-slate-200 p-3 bg-slate-50/50 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="h-7 w-7 text-indigo-600 border-slate-300 rounded cursor-pointer" />
                          <span className="text-xs font-bold text-slate-700">I'm not a robot</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/1200px-RecaptchaLogo.svg.png" className="h-6 w-6 object-contain" alt="reCAPTCHA" />
                          <span className="text-[7px] text-slate-400 mt-1 uppercase font-semibold">reCAPTCHA v2</span>
                        </div>
                      </div>
                    )}
                    {recaptchaVersion === 'v2-invisible' && (
                      <div className="text-center p-3 text-slate-500 text-xs font-semibold italic flex items-center justify-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-indigo-600" />
                        <span>Invisible reCAPTCHA will run verification on action triggers automatically.</span>
                      </div>
                    )}
                    {recaptchaVersion === 'v3-score' && (
                      <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-lg text-xs font-bold text-indigo-900 border border-indigo-100">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                          <div>
                            <span>reCAPTCHA v3 Active score check</span>
                            <span className="text-[9px] text-indigo-600 font-medium block">Threshold required to login: {recaptchaMinScore}</span>
                          </div>
                        </div>
                        <span className="bg-white px-2 py-0.5 rounded text-[10px] text-indigo-700 border border-indigo-200">Live Rating</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button
                    type="button"
                    onClick={handleTestRecaptcha}
                    disabled={testingRecaptcha}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-200 cursor-pointer transition-colors flex items-center gap-2"
                  >
                    {testingRecaptcha ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-slate-500" />
                    ) : (
                      <RotateCcw className="h-4 w-4 text-slate-400" />
                    )}
                    <span>Test Configuration</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecaptchaSiteKey('6Ld_XmUoAAAAAH9XXXXXXXXXXXXXXXXXXXXXXXX');
                      setRecaptchaSecretKey('6Ld_XmUoAAAAAGsXXXXXXXXXXXXXXXXXXXXXXXX');
                      setRecaptchaVersion('v2-checkbox');
                      setRecaptchaMinScore(0.5);
                      setRecaptchaEnv('dev');
                      onNotify('reCAPTCHA options reset to default values.');
                    }}
                    className="text-slate-500 hover:text-slate-800 text-xs font-bold px-4 py-2.5 hover:underline cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </div>

              </div>
            )}

            {!recaptchaEnabled && (
              <div className="py-12 text-center text-xs text-slate-400 italic">
                reCAPTCHA verification is currently disabled. Check the master switch above to configure parameters.
              </div>
            )}

          </div>
        )}

      </div>

      {/* Sticky Save Actions Footer */}
      <div className="sticky bottom-0 bg-white border border-slate-200 rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-35 animate-slideUp">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span className="text-xs font-bold text-slate-600">All modified security scopes are buffered.</span>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              onNotify('Default security policy restored successfully.');
            }}
            className="flex-1 sm:flex-none text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 font-extrabold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all"
          >
            Use Default Policy
          </button>
          <button
            type="button"
            onClick={handleSaveSecurity}
            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Save Security Settings</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: SMTP verification code popup */}
      {showSmtpVerifyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl max-w-md w-full space-y-4 animate-scaleUp">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-800 text-sm">Verify SMTP Connections</h3>
              </div>
              <button 
                onClick={() => setShowSmtpVerifyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              We have initiated an outbound SMTP loop verification request. Please check your master settings or input your 6-digit confirmation key to whitelist this instance.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Verification Code</label>
              <input
                type="text"
                placeholder="e.g., 901552"
                maxLength={6}
                value={smtpVerifyCode}
                onChange={(e) => setSmtpVerifyCode(e.target.value)}
                className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg p-3 text-lg font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-500 placeholder-slate-400"
              />
              <span className="text-[10px] text-slate-400 font-medium text-center block">Hint: Enter any 6-digit number to bypass simulator checks.</span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSmtpVerifyModal(false)}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifySmtp}
                disabled={smtpVerifying}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {smtpVerifying ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span>Verify SMTP</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Authenticator setup wizard modal */}
      {showAuthSetupModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl max-w-lg w-full space-y-5 animate-scaleUp my-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <QrCode className="h-5 w-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-800 text-sm">Setup Google Authenticator</h3>
              </div>
              <button 
                onClick={() => setShowAuthSetupModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Steps timeline */}
            <div className="space-y-4 text-xs font-medium text-slate-600">
              
              {/* Step 1: Scan QR */}
              <div className="space-y-2.5 pb-4 border-b border-slate-100">
                <span className="font-black text-indigo-600 text-[10px] uppercase block tracking-wider">Step 1: Scan barcode QR</span>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-3xs shrink-0">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=otpauth%3A%2F%2Ftotp%2FWorksuite%3Aadmin%40example.com%3Fsecret%3DNBSWY3DPEB3W64TBNQXD2%26issuer%3DWorksuite%26algorithm%3DSHA1%26digits%3D6%26period%3D30"
                      alt="Google Authenticator QR barcode"
                      className="h-[120px] w-[120px] object-contain"
                    />
                  </div>
                  <div className="space-y-1 text-slate-500">
                    <p className="font-bold text-slate-800">Scan this QR image using your device camera.</p>
                    <p className="leading-relaxed">Scan with Authenticator app to instantly lock standard verification tokens.</p>
                    <p className="text-[10px] text-indigo-600 font-bold">Issuer: Worksuite • User: admin@example.com</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Manual keys */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <span className="font-black text-indigo-600 text-[10px] uppercase block tracking-wider">Step 2: Manual Setup Secret Key</span>
                <p className="text-slate-500">If QR scanner is unresponsive, add these configurations manually inside the authenticator app:</p>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-lg font-mono text-xs font-extrabold justify-between text-slate-800">
                  <span>NBSW Y3DP EB3W 64TB NQXD 2</span>
                  <button
                    type="button"
                    onClick={copySecretKey}
                    className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-slate-200 rounded cursor-pointer"
                    title="Copy Secret Key"
                  >
                    {copiedKey ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Step 3: Confirm OTP */}
              <div className="space-y-3">
                <span className="font-black text-indigo-600 text-[10px] uppercase block tracking-wider">Step 3: Verification OTP Check</span>
                <p className="text-slate-500">Input 6-digit code currently rendering in your device Authenticator app.</p>
                
                <div className="space-y-1">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                      if (authOtpError) setAuthOtpError('');
                    }}
                    className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-base font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  {authOtpError && (
                    <span className="text-[10px] font-bold text-rose-600 block text-center mt-1">{authOtpError}</span>
                  )}
                </div>
              </div>

            </div>

            <div className="flex gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setShowAuthSetupModal(false); setOtpCode(''); setAuthOtpError(''); }}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer"
              >
                Cancel Setup
              </button>
              <button
                type="button"
                onClick={handleVerifyOtpCode}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
              >
                Verify & Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Confirmation Dialog for Disabling Google Authenticator */}
      {showDisableAuthModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl max-w-sm w-full space-y-4 animate-scaleUp">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-full bg-rose-50 text-rose-600 shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Disable Google Authenticator?</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                  This reduces account login security constraints. Outbound security bypass codes will no longer be required on subsequent logins.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDisableAuthModal(false)}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer"
              >
                No, Keep Enabled
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuth2faEnabled(false);
                  setShowDisableAuthModal(false);
                  onNotify('Google Authenticator has been disabled.');
                }}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer"
              >
                Yes, Disable
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
