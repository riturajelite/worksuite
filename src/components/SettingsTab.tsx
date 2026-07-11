/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Sliders, Settings, Save, HelpCircle, Bell, ToggleLeft, ToggleRight,
  Building, MapPin, Download, User, DollarSign, CreditCard, Coins, FileText, Receipt,
  Briefcase, Clock, CalendarDays, Layers, ShieldAlert, Mail, Target, Hourglass,
  CheckSquare, Lock, Palette, Grid, HardDrive, Globe, Share2, Calendar, Link, ShieldCheck,
  Database, UserPlus, Package, Calculator, Activity, TrendingUp, ShoppingBag, UserCheck,
  Terminal, RefreshCw, X, ArrowUp, ArrowDown, CornerDownLeft, Plus, Check, Play, RefreshCcw, ArrowRight, Menu,
  Eye, EyeOff, Upload, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react';

// Modular Settings Components Imports
import CompanySettings from './settings/CompanySettings';
import BusinessAddressSettings from './settings/BusinessAddressSettings';
import DownloadsSettings from './settings/DownloadsSettings';
import AppSettings from './settings/AppSettings';
import ProfileSettings from './settings/ProfileSettings';
import NotificationSettings from './settings/NotificationSettings';
import CurrencySettings from './settings/CurrencySettings';
import PaymentCredentialsSettings from './settings/PaymentCredentialsSettings';
import FinanceSettings from './settings/FinanceSettings';
import ContractSettings from './settings/ContractSettings';
import TaxSettings from './settings/TaxSettings';
import TicketSettings from './settings/TicketSettings';
import ProjectSettings from './settings/ProjectSettings';
import AttendanceSettings from './settings/AttendanceSettings';
import LeaveSettings from './settings/LeaveSettings';
import CustomFieldsSettings from './settings/CustomFieldsSettings';
import RolesPermissionsSettings from './settings/RolesPermissionsSettings';
import MessageSettings from './settings/MessageSettings';
import LeadSettings from './settings/LeadSettings';
import TimeLogSettings from './settings/TimeLogSettings';
import TaskSettings from './settings/TaskSettings';
import SecuritySettings from './settings/SecuritySettings';
import ThemeSettings from './settings/ThemeSettings';
import ModuleSettings from './settings/ModuleSettings';
import StorageSettings from './settings/StorageSettings';
import LanguageSettings from './settings/LanguageSettings';
import SocialLoginSettings from './settings/SocialLoginSettings';
import GoogleCalendarSettings from './settings/GoogleCalendarSettings';
import CustomLinkSettings from './settings/CustomLinkSettings';
import GDPRSettings from './settings/GDPRSettings';
import DatabaseBackupSettings from './settings/DatabaseBackupSettings';
import SignUpSettings from './settings/SignUpSettings';
import AssetSettings from './settings/AssetSettings';
import PayrollSettings from './settings/PayrollSettings';
import OvertimeSettings from './settings/OvertimeSettings';
import PerformanceSettings from './settings/PerformanceSettings';
import PurchaseSettings from './settings/PurchaseSettings';
import RecruitSettings from './settings/RecruitSettings';
import UpdateAppSettings from './settings/UpdateAppSettings';

interface SettingsTabProps {
  onSaveSettings: (settings: { name: string; currency: string; timezone: string }) => void;
  appFontSize?: 'standard' | 'large' | 'long';
  onChangeFontSize?: (size: 'standard' | 'large' | 'long') => void;
  selectedSubTab?: string;
  onChangeSubTab?: (subTab: string) => void;
}

// Exactly the 40 submodules requested by the user, categorized elegantly
const SUBMODULES = [
  { name: 'Company Settings', key: 'company-settings', icon: Building, category: 'Organization' },
  { name: 'Business Address', key: 'business-address', icon: MapPin, category: 'Organization' },
  { name: 'Downloads', key: 'downloads', icon: Download, category: 'Organization' },
  { name: 'App Settings', key: 'app-settings', icon: Sliders, category: 'System Configuration' },
  { name: 'Profile Settings', key: 'profile-settings', icon: User, category: 'Personalization' },
  { name: 'Notification Settings', key: 'notification-settings', icon: Bell, category: 'System Configuration' },
  { name: 'Currency Settings', key: 'currency-settings', icon: DollarSign, category: 'Finance' },
  { name: 'Payment Credentials', key: 'payment-credentials', icon: CreditCard, category: 'Finance' },
  { name: 'Finance Settings', key: 'finance-settings', icon: Coins, category: 'Finance' },
  { name: 'Contract Settings', key: 'contract-settings', icon: FileText, category: 'CRM & Contracts' },
  { name: 'Tax Settings', key: 'tax-settings', icon: Receipt, category: 'Finance' },
  { name: 'Ticket Settings', key: 'ticket-settings', icon: HelpCircle, category: 'Support' },
  { name: 'Project Settings', key: 'project-settings', icon: Briefcase, category: 'Operations' },
  { name: 'Attendance Settings', key: 'attendance-settings', icon: Clock, category: 'HR' },
  { name: 'Leave Settings', key: 'leave-settings', icon: CalendarDays, category: 'HR' },
  { name: 'Custom Fields', key: 'custom-fields', icon: Layers, category: 'System Configuration' },
  { name: 'Roles & Permissions', key: 'roles-permissions', icon: ShieldAlert, category: 'Access Control' },
  { name: 'Message Settings', key: 'message-settings', icon: Mail, category: 'Communication' },
  { name: 'Lead Settings', key: 'lead-settings', icon: Target, category: 'CRM & Contracts' },
  { name: 'Time Log Settings', key: 'time-log-settings', icon: Hourglass, category: 'Operations' },
  { name: 'Task Settings', key: 'task-settings', icon: CheckSquare, category: 'Operations' },
  { name: 'Security Settings', key: 'security-settings', icon: Lock, category: 'Access Control' },
  { name: 'Theme Settings', key: 'theme-settings', icon: Palette, category: 'Personalization' },
  { name: 'Module Settings', key: 'module-settings', icon: Grid, category: 'System Configuration' },
  { name: 'Storage Settings', key: 'storage-settings', icon: HardDrive, category: 'System Configuration' },
  { name: 'Language Settings', key: 'language-settings', icon: Globe, category: 'Localization' },
  { name: 'Social Login Settings', key: 'social-login-settings', icon: Share2, category: 'Access Control' },
  { name: 'Google Calendar Settings', key: 'google-calendar-settings', icon: Calendar, category: 'Integration' },
  { name: 'Custom Link Settings', key: 'custom-link-settings', icon: Link, category: 'Integration' },
  { name: 'GDPR Settings', key: 'gdpr-settings', icon: ShieldCheck, category: 'Access Control' },
  { name: 'Database Backup Settings', key: 'database-backup-settings', icon: Database, category: 'System Configuration' },
  { name: 'Sign Up Settings', key: 'sign-up-settings', icon: UserPlus, category: 'Access Control' },
  { name: 'Asset Settings', key: 'asset-settings', icon: Package, category: 'Operations' },
  { name: 'Payroll Settings', key: 'payroll-settings', icon: Calculator, category: 'Finance' },
  { name: 'Overtime Settings', key: 'overtime-settings', icon: Activity, category: 'HR' },
  { name: 'Performance Settings', key: 'performance-settings', icon: TrendingUp, category: 'HR' },
  { name: 'Purchase Settings', key: 'purchase-settings', icon: ShoppingBag, category: 'Finance' },
  { name: 'Recruit Settings', key: 'recruit-settings', icon: UserCheck, category: 'HR' },
  { name: 'REST API Settings', key: 'rest-api-settings', icon: Terminal, category: 'Integration' },
  { name: 'Update App', key: 'update-application', icon: RefreshCw, category: 'System Configuration' }
];

export default function SettingsTab({ 
  onSaveSettings,
  appFontSize = 'standard',
  onChangeFontSize,
  selectedSubTab,
  onChangeSubTab
}: SettingsTabProps) {
  
  // Navigation State
  const [localSubTab, setLocalSubTab] = useState('Company Settings');
  const activeSubTabName = selectedSubTab || localSubTab;
  const setActiveSubTabName = (name: string) => {
    if (onChangeSubTab) {
      onChangeSubTab(name);
    } else {
      setLocalSubTab(name);
    }
  };

  // Shared UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // References for keyboard & scrolling
  const listContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // Interactive Form States
  const [companyName, setCompanyName] = useState('Worksuite Enterprise Solutions Ltd.');
  const [companyEmail, setCompanyEmail] = useState('billing@worksuite.io');
  const [companyPhone, setCompanyPhone] = useState('+1 (555) 389-1029');
  const [companyCategory, setCompanyCategory] = useState('Technology');
  const [taxNumber, setTaxNumber] = useState('TX-890-551-A');

  const [addressStreet, setAddressStreet] = useState('100 Pine Street, Suite 1250');
  const [addressCity, setAddressCity] = useState('San Francisco');
  const [addressState, setAddressState] = useState('California');
  const [addressZip, setAddressZip] = useState('94111');
  const [addressCountry, setAddressCountry] = useState('United States');

  const [profileName, setProfileName] = useState('Administrator Augustus');
  const [profileEmail, setProfileEmail] = useState('admin@worksuite.io');
  const [profilePhone, setProfilePhone] = useState('+1 (555) 901-2345');

  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('UTC (GMT+0)');
  const [punchClock, setPunchClock] = useState(true);
  const [retinalScan, setRetinalScan] = useState(false);
  const [whAuto, setWhAuto] = useState(true);

  // API Keys List
  const [apiKeys, setApiKeys] = useState([
    { id: '1', key: 'ws_live_904fa871cd01ba53ee04', created: '2026-03-12' },
    { id: '2', key: 'ws_test_41f12da1ee52cfa1103f', created: '2026-05-18' }
  ]);

  // Backups
  const [backupSchedule, setBackupSchedule] = useState('Daily');
  const [backups, setBackups] = useState([
    { id: '1', date: '2026-07-06 04:00 AM', size: '28.4 MB' },
    { id: '2', date: '2026-07-05 04:00 AM', size: '28.1 MB' }
  ]);
  const [backingUp, setBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  // Active Modules state
  const [activeModules, setActiveModules] = useState({
    crm: true, projects: true, tasks: true, hr: true, finance: true, tickets: true, assets: false, payroll: true, recruit: true
  });

  // Custom Fields state
  const [customFields, setCustomFields] = useState([
    { label: 'Client Skype ID', module: 'Clients', type: 'Text' },
    { label: 'Hardware MAC ID', module: 'Assets', type: 'Text' }
  ]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldModule, setNewFieldModule] = useState('Tasks');

  // Theme Swatch state
  const [themeColor, setThemeColor] = useState('indigo');
  const [sidebarTheme, setSidebarTheme] = useState('light');

  // GDPR Consent checklist
  const [gdprCookieBanner, setGdprCookieBanner] = useState(true);
  const [gdprRightForgotten, setGdprRightForgotten] = useState(true);
  const [gdprExportData, setGdprExportData] = useState(false);

  // Notification Checklist Toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifSlack, setNotifSlack] = useState(true);

  // Shifts Settings
  const [shiftStart, setShiftStart] = useState('09:00');
  const [shiftEnd, setShiftEnd] = useState('18:00');
  const [lateThreshold, setLateThreshold] = useState(15);

  // Paid Leaves Settings
  const [leavePaid, setLeavePaid] = useState(15);
  const [leaveSick, setLeaveSick] = useState(10);

  // --- High-fidelity Settings Extension States ---
  // Company Extension
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [fiscalYearStart, setFiscalYearStart] = useState('January');
  const [companyWebsite, setCompanyWebsite] = useState('https://worksuite.io');
  
  // Business Address Extension
  const [businessHours, setBusinessHours] = useState('Mon - Fri, 9:00 AM - 6:00 PM');

  // Interactive Downloads state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [downloadFilter, setDownloadFilter] = useState<'All' | 'Manuals' | 'Payroll'>('All');

  // Profile Security Section State
  const [currentPassword, setCurrentPassword] = useState('admin12345');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Notification Preferences Toggles Matrix
  const [notifMatrix, setNotifMatrix] = useState({
    tasks: { email: true, sms: false, slack: true },
    billing: { email: true, sms: true, slack: false },
    attendance: { email: false, sms: true, slack: true },
    system: { email: true, sms: false, slack: true }
  });

  // Currency Converter Calculator state
  const [converterAmount, setConverterAmount] = useState<number>(100);
  const [converterSource, setConverterSource] = useState<string>('USD');
  const [converterTarget, setConverterTarget] = useState<string>('EUR');

  // Payment Gateway credentials states
  const [paymentGatewayTab, setPaymentGatewayTab] = useState<'stripe' | 'paypal' | 'razorpay'>('stripe');
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [showPaypalSecret, setShowPaypalSecret] = useState(false);
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [stripeLiveMode, setStripeLiveMode] = useState(false);
  const [paypalLiveMode, setPaypalLiveMode] = useState(false);
  const [razorpayLiveMode, setRazorpayLiveMode] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  // Finance prefix configurations
  const [creditNotePrefix, setCreditNotePrefix] = useState('CN-');
  const [invoiceFormat, setInvoiceFormat] = useState('Prefix + Year + Serial');
  const [paymentDueDays, setPaymentDueDays] = useState('30 Days');
  const [taxApplicability, setTaxApplicability] = useState(true);
  const [financeFooter, setFinanceFooter] = useState('Invoice payments are processed securely. Thank you for your continued partnership!');

  // Trigger brief alert banner
  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  // Filter based on Search
  const filteredSubmodules = SUBMODULES.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setFocusedIndex(0);
  }, [searchTerm]);

  // Sync scroll positioning
  useEffect(() => {
    if (activeItemRef.current && listContainerRef.current) {
      const activeEl = activeItemRef.current;
      const container = listContainerRef.current;
      const activeTop = activeEl.offsetTop;
      const activeHeight = activeEl.offsetHeight;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (activeTop < containerScrollTop) {
        container.scrollTop = activeTop;
      } else if (activeTop + activeHeight > containerScrollTop + containerHeight) {
        container.scrollTop = activeTop + activeHeight - containerHeight;
      }
    }
  }, [activeSubTabName]);

  // Handle arrow key bindings
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredSubmodules.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % filteredSubmodules.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + filteredSubmodules.length) % filteredSubmodules.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetSub = filteredSubmodules[focusedIndex];
      if (targetSub) {
        setActiveSubTabName(targetSub.name);
        setShowMobileMenu(false);
        triggerNotification(`Navigated to ${targetSub.name}`);
      }
    }
  };

  // Generators & Action Handlers
  const generateApiKey = () => {
    const chars = 'abcdef0123456789';
    let randStr = '';
    for (let i = 0; i < 20; i++) randStr += chars[Math.floor(Math.random() * chars.length)];
    setApiKeys(prev => [{ id: Date.now().toString(), key: `ws_live_${randStr}`, created: new Date().toISOString().split('T')[0] }, ...prev]);
    triggerNotification('Generated new secure REST API Key!');
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    triggerNotification('API key revoked successfully.');
  };

  const triggerBackup = () => {
    if (backingUp) return;
    setBackingUp(true);
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackingUp(false);
          const dateStr = `${new Date().toISOString().split('T')[0]} 09:30 PM`;
          setBackups(prevBackups => [{ id: Date.now().toString(), date: dateStr, size: '28.9 MB' }, ...prevBackups]);
          triggerNotification('PostgreSQL database backup generated!');
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;
    setCustomFields(prev => [...prev, { label: newFieldName, module: newFieldModule, type: 'Text' }]);
    setNewFieldName('');
    triggerNotification(`Added custom field "${newFieldName}" to ${newFieldModule}`);
  };

  const activeSubmodule = SUBMODULES.find(sub => sub.name === activeSubTabName) || SUBMODULES[0];
  const ActiveIcon = activeSubmodule.icon;

  return (
    <div className="w-full md:h-full md:flex md:flex-col md:min-h-0 relative font-sans text-slate-800 overscroll-none" style={{ overscrollBehavior: 'contain' }}>
      
      {/* Toast Notifier */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-slate-700 font-semibold"
          >
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span>{showNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex w-full flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden items-stretch">
        
        {/* 1. LEFT SIDEBAR (Scrollable Settings Navigation - Worksuite White Panel) */}
        <div className="w-[320px] shrink-0 border-r border-slate-200/60 bg-white h-full flex flex-col overflow-hidden">
          
          {/* Sticky Search bar */}
          <div className="bg-white p-5 border-b border-slate-100 space-y-3 shrink-0">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">System Settings</h3>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search Settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-slate-50 text-slate-800 text-[13px] pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white placeholder-slate-400 font-medium transition-all"
              />
            </div>
          </div>

          {/* Scrollable list */}
          <div 
            ref={listContainerRef}
            className="flex-1 overflow-y-auto overscroll-contain scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 divide-y divide-slate-100/50"
          >
            {filteredSubmodules.length > 0 ? (
              filteredSubmodules.map((sub, idx) => {
                const SubIcon = sub.icon;
                const isActive = sub.name === activeSubTabName;
                const isKeyboardFocused = idx === focusedIndex;

                return (
                  <button
                    key={sub.key}
                    ref={isActive ? activeItemRef : null}
                    onClick={() => {
                      setActiveSubTabName(sub.name);
                      triggerNotification(`Switched to ${sub.name}`);
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`w-full h-[52px] flex items-center justify-between px-6 text-left transition-all duration-150 cursor-pointer relative ${
                      isActive 
                        ? 'bg-indigo-50/40 text-indigo-700 border-l-[3px] border-indigo-600 font-bold' 
                        : isKeyboardFocused
                          ? 'bg-slate-50/50 text-slate-800 border-l-[3px] border-slate-200'
                          : 'bg-white hover:bg-slate-50/55 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <SubIcon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className={`text-[13px] tracking-tight truncate max-w-[210px] ${isActive ? 'font-bold text-indigo-900' : 'font-medium text-slate-600'}`}>
                        {sub.name}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                No matching configurations found
              </div>
            )}
          </div>

          {/* Footer controls guide */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-semibold flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              Navigate
            </span>
            <span className="flex items-center gap-0.5 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-3xs">
              <CornerDownLeft className="h-2.5 w-2.5 text-slate-500" />
              Enter
            </span>
          </div>
        </div>

        {/* 2. RIGHT PANEL: Content Area (Independently Scrollable) */}
        <div className="flex-1 bg-slate-50/40 p-8 h-full overflow-y-auto overscroll-contain scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          <motion.div 
            key={activeSubTabName}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col h-full"
          >
            {renderActiveContent()}
          </motion.div>
        </div>
      </div>

      {/* MOBILE RESPONSIVE LAYOUT */}
      <div className="md:hidden w-full flex flex-col space-y-4">
        {showMobileMenu ? (
          /* Mobile settings menu */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">System Settings</h3>
                <p className="text-[11px] text-slate-500 font-medium">Select a configuration module</p>
              </div>
              <button onClick={() => setShowMobileMenu(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search Settings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-[13px] pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white placeholder-slate-400 font-medium transition-all"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100/50 max-h-[70vh] overflow-y-auto">
              {filteredSubmodules.length > 0 ? (
                filteredSubmodules.map((sub) => {
                  const SubIcon = sub.icon;
                  const isActive = sub.name === activeSubTabName;

                  return (
                    <button
                      key={sub.key}
                      onClick={() => {
                        setActiveSubTabName(sub.name);
                        setShowMobileMenu(false);
                        triggerNotification(`Switched to ${sub.name}`);
                      }}
                      className={`w-full h-[54px] flex items-center justify-between px-5 text-left transition-all ${
                        isActive 
                          ? 'bg-indigo-50/40 font-bold text-slate-900 border-l-[4px] border-indigo-600' 
                          : 'bg-white hover:bg-slate-50/30 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <SubIcon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-[14px] font-semibold tracking-tight truncate max-w-[210px]">{sub.name}</span>
                      </div>
                      {isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 italic">
                  No matching configurations found
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mobile active form */
          <div className="flex flex-col space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ActiveIcon className="h-5 w-5 text-indigo-600" />
                <h2 className="font-black text-slate-900 text-sm tracking-tight">{activeSubTabName}</h2>
              </div>
              <button 
                onClick={() => setShowMobileMenu(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg border border-indigo-100 transition-colors cursor-pointer"
              >
                <Menu className="h-4 w-4" />
                <span>Settings Menu</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
              {renderActiveContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Core Render Engine for each of the 40 modules
  function renderActiveContent() {
    
    // Header component to maintain consistent styling with custom icons
    const renderHeader = (title: string, desc: string, iconComponent: React.ComponentType<any>) => {
      const Icon = iconComponent;
      return (
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <Icon className="h-6 w-6 text-indigo-600" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 font-medium">{desc}</p>
          </div>
        </div>
      );
    };

    switch (activeSubTabName) {
      
      case 'Company Settings':
        return <CompanySettings onNotify={triggerNotification} />;

      case 'Business Address':
        return <BusinessAddressSettings onNotify={triggerNotification} />;

      case 'Downloads':
        return <DownloadsSettings onNotify={triggerNotification} />;

      case 'App Settings':
        return <AppSettings onNotify={triggerNotification} />;

      case 'Profile Settings':
        return <ProfileSettings onNotify={triggerNotification} />;

      case 'Notification Settings':
        return <NotificationSettings onNotify={triggerNotification} />;

      case 'Currency Settings':
        return <CurrencySettings onNotify={triggerNotification} />;

      case 'Payment Credentials':
        return <PaymentCredentialsSettings onNotify={triggerNotification} />;

      case 'Finance Settings':
        return <FinanceSettings onNotify={triggerNotification} />;

      case 'Contract Settings':
        return <ContractSettings onNotify={triggerNotification} />;

      case 'Tax Settings':
        return <TaxSettings onNotify={triggerNotification} />;

      case 'Ticket Settings':
        return <TicketSettings onNotify={triggerNotification} />;

      case 'Project Settings':
        return <ProjectSettings onNotify={triggerNotification} />;

      case 'Attendance Settings':
        return <AttendanceSettings onNotify={triggerNotification} />;

      case 'Leave Settings':
        return <LeaveSettings onNotify={triggerNotification} />;

      case 'Custom Fields':
        return <CustomFieldsSettings onNotify={triggerNotification} />;

      case 'Roles & Permissions':
        return <RolesPermissionsSettings onNotify={triggerNotification} />;

      case 'Message Settings':
        return <MessageSettings onNotify={triggerNotification} />;

      case 'Lead Settings':
        return <LeadSettings onNotify={triggerNotification} />;

      case 'Time Log Settings':
        return <TimeLogSettings onNotify={triggerNotification} />;

      case 'Task Settings':
        return <TaskSettings onNotify={triggerNotification} />;

      case 'Security Settings':
        return <SecuritySettings onNotify={triggerNotification} />;

      case 'Theme Settings':
        return <ThemeSettings onNotify={triggerNotification} />;

      case 'Module Settings':
        return <ModuleSettings onNotify={triggerNotification} />;

      case 'Storage Settings':
        return <StorageSettings onNotify={triggerNotification} />;

      case 'Language Settings':
        return <LanguageSettings onNotify={triggerNotification} />;

      case 'Social Login Settings':
        return <SocialLoginSettings onNotify={triggerNotification} />;

      case 'Google Calendar Settings':
        return <GoogleCalendarSettings onNotify={triggerNotification} />;

      case 'Custom Link Settings':
        return <CustomLinkSettings onNotify={triggerNotification} />;

      case 'GDPR Settings':
        return <GDPRSettings onNotify={triggerNotification} />;

      case 'Database Backup Settings':
        return <DatabaseBackupSettings onNotify={triggerNotification} />;

      case 'Sign Up Settings':
        return <SignUpSettings onNotify={triggerNotification} />;

      case 'Asset Settings':
        return <AssetSettings onNotify={triggerNotification} />;

      case 'Payroll Settings':
        return <PayrollSettings onNotify={triggerNotification} />;

      case 'Overtime Settings':
        return <OvertimeSettings onNotify={triggerNotification} />;

      case 'Performance Settings':
        return <PerformanceSettings onNotify={triggerNotification} />;

      case 'Purchase Settings':
        return <PurchaseSettings onNotify={triggerNotification} />;

      case 'Recruit Settings':
        return <RecruitSettings onNotify={triggerNotification} />;

      case 'REST API Settings':
        return (
          <div className="space-y-5">
            {renderHeader('REST API Settings', 'Audit active programmatic keys.', Terminal)}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <h4 className="font-bold text-slate-800">Developer API Keys</h4>
                  <p className="text-[10px] text-slate-400">Keys give programmatic access to company databases.</p>
                </div>
                <button 
                  onClick={generateApiKey}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Generate Key</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="px-4 py-3">Access Token Key</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-semibold">
                    {apiKeys.map(k => (
                      <tr key={k.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-700">{k.key}</td>
                        <td className="px-4 py-3 text-slate-400">{k.created}</td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => revokeApiKey(k.id)}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'Update App':
      case 'Update Application':
        return <UpdateAppSettings onNotify={triggerNotification} />;

      default:
        return (
          <div className="p-8 text-center text-xs text-slate-400 italic">
            Module parameters not found.
          </div>
        );
    }
  }
}
