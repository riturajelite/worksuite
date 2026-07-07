import React, { useState, useEffect, useRef } from 'react';
import { Bell, Clock, Plus, Square, ShieldCheck, LogOut, User, Settings, Check, X, Shield, Calendar, Mail, FileText, Menu } from 'lucide-react';

interface HeaderProps {
  onQuickCreate: (type: 'task' | 'lead' | 'client' | 'ticket' | 'expense') => void;
  activeTimer: { isRunning: boolean; elapsedSeconds: number; taskTitle: string } | null;
  onStopTimer: () => void;
  onClockIn: () => void;
  isClockedIn: boolean;
  clockInTime: string | null;
  onMenuToggle?: () => void;
  userRole?: 'admin' | 'employee' | 'client';
  onLogout?: () => void;
  onNavigate?: (tabId: string) => void;
  appFontSize?: 'standard' | 'large' | 'long';
  onChangeFontSize?: (size: 'standard' | 'large' | 'long') => void;
}

export default function Header({ 
  onQuickCreate, 
  activeTimer, 
  onStopTimer, 
  onClockIn, 
  isClockedIn, 
  clockInTime,
  onMenuToggle,
  userRole = 'admin',
  onLogout,
  onNavigate,
  appFontSize = 'standard',
  onChangeFontSize
}: HeaderProps) {
  const [time, setTime] = useState(new Date());
  
  // Interactive Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, text: "James Carter requested Leave for Independence Day", time: "10m ago", read: false },
    { id: 2, text: "Invoice CL-102 of $4,500 successfully marked Paid", time: "1h ago", read: false },
    { id: 3, text: "New high-priority support ticket assigned to your team", time: "3h ago", read: false },
    { id: 4, text: "Company-wide Notice Board updated by HR Dept", time: "1d ago", read: true },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const userMap = {
    admin: {
      name: 'Frederique Borer',
      roleTitle: 'Team Lead',
      email: 'frederique.borer@worksuite.biz',
      dept: 'Corporate Operations',
      joined: '12 Jan 2024',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face'
    },
    employee: {
      name: 'Elena Rostova',
      roleTitle: 'Senior Dev',
      email: 'elena.rostova@worksuite.biz',
      dept: 'Engineering Department',
      joined: '04 Mar 2025',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face'
    },
    client: {
      name: 'Sovereign Tech',
      roleTitle: 'Client Rep',
      email: 'contact@sovereigntech.com',
      dept: 'External Partner',
      joined: '19 Nov 2025',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  };

  const currentUser = userMap[userRole] || userMap.admin;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header id="worksuite-header" className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shadow-sm shrink-0 z-30">
        {/* Search or Dynamic Info */}
        <div className="flex items-center gap-2">
          <button
            id="mobile-menu-toggle"
            onClick={onMenuToggle}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-md transition-colors duration-150 lg:hidden cursor-pointer mr-1"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-slate-800">
            <Clock className="h-4.5 w-4.5 text-indigo-600" />
            <span className="text-sm font-mono font-bold tracking-tight text-slate-900">
              {time.toLocaleTimeString()} - 03 Jul 2026
            </span>
          </div>
          <div className="h-5 w-[1px] bg-slate-200 hidden md:block" />
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 font-semibold text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure Enterprise Connection</span>
          </div>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-2.5">
          {/* Active Timesheet Tracker Widget */}
          {activeTimer && activeTimer.isRunning && (
            <div className="flex items-center gap-2.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg border border-rose-100 shadow-xs animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <div className="text-xs font-semibold leading-none">
                <p className="font-bold text-rose-900 truncate max-w-[120px]">{activeTimer.taskTitle}</p>
                <p className="font-mono text-xs text-rose-600 mt-0.5">{formatTimer(activeTimer.elapsedSeconds)}</p>
              </div>
              <button 
                id="stop-header-timer"
                onClick={onStopTimer} 
                className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors duration-100 cursor-pointer"
                title="Stop tracking"
              >
                <Square className="h-3 w-3 fill-current" />
              </button>
            </div>
          )}

          {/* Attendance Clocking Button */}
          <button
            id="header-attendance-clock"
            onClick={onClockIn}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all duration-150 cursor-pointer ${
              isClockedIn 
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-amber-500 animate-pulse' : 'bg-white'}`} />
            <span>{isClockedIn ? `Clock Out (${clockInTime})` : 'Clock In'}</span>
          </button>

          {/* Quick Create Dropdown / Trigger */}
          <div className="relative group">
            <button 
              id="header-quick-create-btn"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-xs transition-colors duration-150 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 hidden group-hover:block hover:block transition-all z-50">
              <button 
                id="quick-add-task-btn"
                onClick={() => onQuickCreate('task')} 
                className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                + Create Project Task
              </button>
              <button 
                id="quick-add-lead-btn"
                onClick={() => onQuickCreate('lead')} 
                className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                + Add Lead Contact
              </button>
              <button 
                id="quick-add-client-btn"
                onClick={() => onQuickCreate('client')} 
                className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                + Add Client Directory
              </button>
              <button 
                id="quick-add-ticket-btn"
                onClick={() => onQuickCreate('ticket')} 
                className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                + File Support Ticket
              </button>
              <button 
                id="quick-add-expense-btn"
                onClick={() => onQuickCreate('expense')} 
                className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                + Log Business Expense
              </button>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-200" />

          {/* Interactive Notifications Bell */}
          <div className="relative" ref={notificationsRef}>
            <button 
              id="header-notifications-bell" 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors duration-150 cursor-pointer"
              title="Notifications Alerts"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">Operational Alerts</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead} 
                      className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                          // Mark as read
                          setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                          setShowNotifications(false);
                          
                          // Navigate to appropriate module
                          if (notif.text.toLowerCase().includes('leave')) {
                            if (onNavigate) onNavigate('leaves');
                          } else if (notif.text.toLowerCase().includes('invoice')) {
                            if (onNavigate) onNavigate('invoices');
                          } else if (notif.text.toLowerCase().includes('ticket')) {
                            if (onNavigate) onNavigate('tickets');
                          } else if (notif.text.toLowerCase().includes('notice')) {
                            if (onNavigate) onNavigate('notices');
                          }
                        }}
                        className={`p-3.5 text-xs transition-colors flex items-start justify-between gap-2 hover:bg-slate-50 cursor-pointer ${!notif.read ? 'bg-indigo-50/20' : ''}`}
                      >
                        <div className="space-y-1">
                          <p className={`font-medium text-slate-800 leading-normal ${!notif.read ? 'font-bold' : ''}`}>{notif.text}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notif.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                          title="Dismiss"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-400">
                      <Check className="h-8 w-8 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold">All caught up! No notifications.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current Active User Profile Dropdown */}
          <div className="relative pl-1" ref={profileDropdownRef}>
            <div 
              id="header-profile-trigger"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-all"
              title="Account Menu"
            >
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-slate-800 leading-tight">{currentUser.name}</span>
                <span className="text-[11px] text-slate-400 font-bold leading-none uppercase tracking-wider">{currentUser.roleTitle}</span>
              </div>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-50 hover:ring-indigo-300 transition-all"
              />
            </div>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Signed In As</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>
                
                <div className="p-1 space-y-0.5">
                  <button 
                    id="header-action-see-profile"
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <User className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                    <span>See Profile</span>
                  </button>

                  <button 
                    id="header-action-go-settings"
                    onClick={() => {
                      if (onNavigate) onNavigate('settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                    <span>Company Settings</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 p-1 mt-1">
                  <button 
                    id="header-action-logout"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Beautiful "See Profile" Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            {/* Banner Cover color */}
            <div className="h-28 bg-gradient-to-r from-indigo-600 to-indigo-800 relative">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 bg-white/25 hover:bg-white/40 text-white p-1.5 rounded-full transition-colors cursor-pointer"
                title="Close Profile"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Avatar overlay */}
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white shrink-0"
                />
                <div className="space-y-1 pb-1">
                  <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{currentUser.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">{currentUser.roleTitle}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{currentUser.dept}</span>
                  </div>
                </div>
              </div>

              {/* Quick statistics */}
              <div className="grid grid-cols-3 gap-3 border-y border-slate-100 py-4 mb-5">
                <div className="text-center">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Joined System</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{currentUser.joined}</p>
                </div>
                <div className="text-center border-x border-slate-100">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Access Status</p>
                  <p className="text-sm font-bold text-emerald-600 mt-1 flex items-center justify-center gap-1">
                    <Shield className="h-3.5 w-3.5 fill-current" /> Active
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Employment</p>
                  <p className="text-sm font-bold text-indigo-600 mt-1">Full-Time</p>
                </div>
              </div>

              {/* Detailed specs */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Credentials</h4>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-600 font-medium">
                    <Mail className="h-4.5 w-4.5 text-slate-400" />
                    <span>Email Address</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">{currentUser.email}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-600 font-medium">
                    <Shield className="h-4.5 w-4.5 text-slate-400" />
                    <span>Access Node Level</span>
                  </div>
                  <span className="font-semibold text-slate-800">{userRole === 'admin' ? 'Root Administrator (L4)' : 'Standard User (L2)'}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-600 font-medium">
                    <FileText className="h-4.5 w-4.5 text-slate-400" />
                    <span>Associated Department</span>
                  </div>
                  <span className="font-semibold text-slate-800">{currentUser.dept}</span>
                </div>
              </div>

              {/* Footer action */}
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold cursor-pointer transition-all"
                >
                  Dismiss Detail
                </button>
                {onNavigate && (
                  <button 
                    onClick={() => {
                      onNavigate('settings');
                      setShowProfileModal(false);
                    }}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-600/10"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Edit Profile Settings</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
