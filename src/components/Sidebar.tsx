/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, Users, Target, Briefcase, Clock, 
  FileText, CreditCard, Ticket, Cpu, Server, 
  Settings, ChevronDown, ChevronRight, Search, Award, 
  Activity, Webhook, TrendingUp, ShieldAlert, FileSpreadsheet,
  Mail, BookOpen, HardDrive, Heart, Map, Terminal, GraduationCap,
  User, LogOut, ShoppingCart, Headphones, MessageSquare, Clipboard,
  Monitor, Link, Fingerprint, Wallet, Layers, QrCode, PieChart,
  ChevronLeft, Smartphone, Gift, Building
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpandable: boolean;
  isGift?: boolean;
  badge?: string;
  items?: { id: string; label: string }[];
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
  userRole?: 'admin' | 'employee' | 'client';
  onLogout?: () => void;
  onOpenMobileApp?: () => void;
}

export default function Sidebar({ currentTab, onSelectTab, isMobileOpen, onClose, userRole, onLogout, onOpenMobileApp }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showFooterDropdown, setShowFooterDropdown] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    dashboard: true,
    leads: false,
    hr: false,
    work: false,
    finance: false,
    biometric: false,
    letter: false,
    payroll: false,
    performance: false,
    purchase: false,
    recruit: false,
    server: false,
    webhooks: false,
    reports: false,
  });

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isExpandable: true,
      items: [
        { id: 'dashboard', label: 'Private Dashboard' },
        { id: 'dashboard-advanced', label: 'Advanced Dashboard' }
      ]
    },
    {
      id: 'calendar',
      label: 'My Calendar',
      icon: Calendar,
      isExpandable: false
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: Target,
      isExpandable: true,
      items: [
        { id: 'leads', label: 'Lead Contacts' },
        { id: 'deals', label: 'Deals Pipeline' }
      ]
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Building,
      isExpandable: false
    },
    {
      id: 'hr',
      label: 'HR',
      icon: Users,
      isExpandable: true,
      items: [
        { id: 'employees', label: 'Employees Directory' },
        { id: 'leaves', label: 'Leaves Management' },
        { id: 'shift-roster', label: 'Shift Roster' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'holidays', label: 'Holiday Calendar' },
        { id: 'designations', label: 'Designations' },
        { id: 'departments', label: 'Departments' },
        { id: 'appreciations', label: 'Appreciation Wall' }
      ]
    },
    {
      id: 'work',
      label: 'Work',
      icon: Briefcase,
      isExpandable: true,
      items: [
        { id: 'contracts', label: 'Contracts' },
        { id: 'projects', label: 'Projects' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'timesheet', label: 'Timesheet' },
        { id: 'roadmap', label: 'Project Roadmap' }
      ]
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: CreditCard,
      isExpandable: true,
      items: [
        { id: 'proposals', label: 'Proposals' },
        { id: 'estimates', label: 'Estimates' },
        { id: 'invoices', label: 'Invoices Issued' },
        { id: 'payments', label: 'Payments Received' },
        { id: 'creditnotes', label: 'Credit Notes' },
        { id: 'expenses', label: 'Business Expenses' },
        { id: 'bankaccounts', label: 'Bank Accounts' },
        { id: 'vendors', label: 'Vendors Space' }
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      isExpandable: false
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: Headphones,
      isExpandable: false
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      isExpandable: false
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      isExpandable: false,
      badge: '2'
    },
    {
      id: 'notices',
      label: 'Notice Board',
      icon: Clipboard,
      isExpandable: false
    },
    {
      id: 'knowledgebase',
      label: 'Knowledge Base',
      icon: BookOpen,
      isExpandable: false
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: Monitor,
      isExpandable: false,
      isGift: true
    },
    {
      id: 'biolinks',
      label: 'Biolinks',
      icon: Link,
      isExpandable: false,
      isGift: true
    },
    {
      id: 'biometric',
      label: 'Biometric',
      icon: Fingerprint,
      isExpandable: true,
      isGift: true,
      items: [
        { id: 'bio-devices', label: 'Biometric Devices' },
        { id: 'bio-logs', label: 'Attendance Logs' },
        { id: 'bio-mapping', label: 'Employees Mapping' },
        { id: 'bio-commands', label: 'Device Commands' }
      ]
    },
    {
      id: 'letter',
      label: 'Letter',
      icon: Mail,
      isExpandable: true,
      isGift: true,
      items: [
        { id: 'recruit-offers', label: 'Offer Letters' },
        { id: 'letter-templates', label: 'Letter Templates' },
        { id: 'letter-generator', label: 'Standard Letter Generator' }
      ]
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: Wallet,
      isExpandable: true,
      isGift: true,
      items: [
        { id: 'payroll-salary', label: 'Employee Salary' },
        { id: 'payroll-expenses', label: 'Payroll Expenses' },
        { id: 'payroll-overtime', label: 'Overtime Requests' },
        { id: 'payroll-reports', label: 'Payroll Reports' }
      ]
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: TrendingUp,
      isExpandable: true,
      isGift: true,
      items: [
        { id: 'perf-dashboard', label: 'OKR Dashboard' },
        { id: 'perf-objectives', label: 'Company Objectives' },
        { id: 'perf-scoring', label: 'OKR Scoring' },
        { id: 'perf-meetings', label: 'Review Meetings' }
      ]
    },
    {
      id: 'purchase',
      label: 'Purchase',
      icon: Layers,
      isExpandable: true,
      isGift: true,
      items: [
        { id: 'purchase-vendors', label: 'Vendors' },
        { id: 'purchase-products', label: 'Products' },
        { id: 'purchase-orders', label: 'Purchase Orders' },
        { id: 'purchase-bills', label: 'Bills' },
        { id: 'purchase-payments', label: 'Vendor Payments' },
        { id: 'purchase-credits', label: 'Vendor Credits' },
        { id: 'purchase-inventory', label: 'Inventory' },
        { id: 'purchase-reports', label: 'Reports' }
      ]
    },
    {
      id: 'qrcode',
      label: 'QR Code',
      icon: QrCode,
      isExpandable: false,
      isGift: true
    },
    {
      id: 'recruit',
      label: 'Recruit',
      icon: GraduationCap,
      isExpandable: true,
      isGift: true,
      items: [
        { id: 'recruit-dashboard', label: 'Dashboard' },
        { id: 'recruit-jobs', label: 'Jobs' },
        { id: 'recruit-applications', label: 'Job Applications' },
        { id: 'recruit-interviews', label: 'Interview Schedule' },
        { id: 'recruit-offers', label: 'Offer Letters' },
        { id: 'recruit-skills', label: 'Skills' },
        { id: 'recruit-database', label: 'Candidate Database' },
        { id: 'recruit-reports', label: 'Reports' },
        { id: 'recruit-career', label: 'Career Site' }
      ]
    },
    {
      id: 'server',
      label: 'Server Manager',
      icon: Server,
      isExpandable: true,
      isGift: true,
      items: [
        { id: 'server-manager', label: 'Dashboard' },
        { id: 'server-hostings', label: 'Hosting Management' },
        { id: 'server-domains', label: 'Domain Management' },
        { id: 'server-providers', label: 'Provider Management' }
      ]
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      icon: Webhook,
      isExpandable: true,
      isGift: true,
      items: [
        { id: 'webhooks', label: 'Webhooks' },
        { id: 'webhook-logs', label: 'Log' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: PieChart,
      isExpandable: true,
      items: [
        { id: 'report-task', label: 'Task Report' },
        { id: 'report-time', label: 'Time Log Report' },
        { id: 'report-weekly-timesheet', label: 'Weekly Timesheet' },
        { id: 'report-finance', label: 'Finance Report' },
        { id: 'report-income-expense', label: 'Income vs Expense' },
        { id: 'report-leave', label: 'Leave Report' },
        { id: 'report-attendance', label: 'Attendance Report' },
        { id: 'report-expense', label: 'Expense Report' },
        { id: 'report-deal', label: 'Deal Report' },
        { id: 'report-sales', label: 'Sales Report' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      isExpandable: false
    }
  ];

  // Keep expanded items synchronized when the active tab changes
  React.useEffect(() => {
    const parent = sidebarItems.find(item => 
      item.isExpandable && item.items?.some(child => child.id === currentTab)
    );
    if (parent) {
      setExpandedItems(prev => ({
        ...prev,
        [parent.id]: true
      }));
    }
  }, [currentTab]);

  // Global flat items list for search
  const allSubItems = sidebarItems.reduce((acc, mainItem) => {
    if (mainItem.isExpandable && mainItem.items) {
      return [...acc, ...mainItem.items.map(child => ({ id: child.id, label: child.label, icon: mainItem.icon, mainId: mainItem.id }))];
    } else {
      return [...acc, { id: mainItem.id, label: mainItem.label, icon: mainItem.icon, mainId: mainItem.id }];
    }
  }, [] as { id: string; label: string; icon: React.ComponentType<{ className?: string }>; mainId: string }[]);

  const filteredItems = allSubItems.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectTab = (tabId: string) => {
    onSelectTab(tabId);
    onClose?.();
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.isExpandable) {
      setExpandedItems(prev => ({
        ...prev,
        [item.id]: !prev[item.id]
      }));
      // Navigate to first sub-item by default
      if (item.items && item.items.length > 0) {
        selectTab(item.items[0].id);
      }
    } else {
      selectTab(item.id);
    }
  };

  const handleCollapseClick = () => {
    if (window.innerWidth < 1024) {
      onClose?.();
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-fade-in"
          onClick={onClose}
        />
      )}
      <aside 
        id="worksuite-sidebar" 
        className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-30 bg-[#0b0f19] text-slate-200 flex flex-col border-r border-slate-800/60 h-screen overflow-hidden select-none transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20 w-64' : 'w-64'}`}
      >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/40 flex flex-col gap-2 shrink-0 bg-slate-950/10">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex flex-col gap-1.5 min-w-0 animate-in fade-in duration-200">
              <button className="flex items-center gap-1 font-bold text-base text-white tracking-wide hover:text-indigo-400 transition-colors">
                <span className="truncate">Worksuite</span>
                <ChevronDown className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              </button>
              <div className="flex items-center gap-2 px-0.5">
                <div className="w-2.5 h-2.5 bg-[#22c55e] rounded-full border border-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-semibold text-slate-300 truncate">
                  Eldora Mann MD
                </span>
              </div>
            </div>
          )}
          {/* Branded Logo Square */}
          <div className={`w-9 h-9 bg-[#f59e0b] rounded-lg flex items-center justify-center text-white font-black text-xl shadow-md select-none shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}>
            W
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="px-3 py-2 border-b border-slate-800/40 bg-slate-950/20 shrink-0 flex justify-center">
        {isCollapsed ? (
          <button 
            onClick={() => setIsCollapsed(false)}
            className="p-2 text-slate-500 hover:text-slate-300 cursor-pointer"
            title="Search modules"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
        ) : (
          <div className="relative w-full animate-in fade-in duration-200">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search modules..."
              className="w-full bg-slate-800/40 hover:bg-slate-800/60 text-slate-200 pl-8 pr-3 py-2 rounded-md text-sm placeholder-slate-500 border border-slate-700/30 focus:border-indigo-500 focus:outline-none transition-all duration-150"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800/60 scrollbar-track-transparent">
        {searchTerm ? (
          /* Search results */
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase px-3 mb-2">{isCollapsed ? '' : `Search Results (${filteredItems.length})`}</p>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => {
                const Icon = item.icon;
                const isSelected = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-search-item-${item.id}`}
                    onClick={() => {
                      if (isCollapsed) {
                        setIsCollapsed(false);
                      }
                      selectTab(item.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm font-medium transition-all duration-150 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-slate-500 px-3 py-2 italic">No matches found</p>
            )}
          </div>
        ) : (
          /* Structured modules list corresponding exactly to the screen recording */
          <div className="space-y-0.5">
            {sidebarItems.map(item => {
              const ItemIcon = item.icon;
              const isExpanded = expandedItems[item.id];
              const isChildActive = item.isExpandable && item.items?.some(child => child.id === currentTab);
              const isDirectActive = currentTab === item.id;
              const isActive = isDirectActive || isChildActive;

              return (
                <div key={item.id} className="space-y-0.5 animate-in fade-in duration-200">
                  <button
                    id={`sidebar-item-btn-${item.id}`}
                    onClick={() => {
                      if (isCollapsed) {
                        setIsCollapsed(false);
                      }
                      handleItemClick(item);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? 'text-[#38bdf8] bg-slate-800/40' 
                        : 'text-slate-300 hover:bg-slate-800/30 hover:text-white'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                      <ItemIcon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-[#38bdf8]' : 'text-slate-500'}`} />
                      {!isCollapsed && (
                        <>
                          <span className="truncate">{item.label}</span>
                          {item.isGift && (
                            <Gift className="h-3.5 w-3.5 text-amber-500 shrink-0 ml-1 fill-amber-500/10 animate-pulse" />
                          )}
                          {item.badge && (
                            <span className="ml-1.5 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-black shrink-0 leading-none">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {!isCollapsed && item.isExpandable && (
                      <div>
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Child list items */}
                  {!isCollapsed && item.isExpandable && isExpanded && item.items && (
                    <div className="pl-4 space-y-0.5 border-l border-slate-800/80 ml-5 mt-0.5 mb-1.5 animate-in slide-in-from-top-1 duration-150">
                      {item.items.map(child => {
                        const isChildSelected = currentTab === child.id;
                        return (
                          <button
                            key={child.id}
                            id={`sidebar-child-${child.id}`}
                            onClick={() => selectTab(child.id)}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                              isChildSelected 
                                ? 'bg-indigo-600 text-white shadow-sm font-bold' 
                                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isChildSelected ? 'bg-white' : 'bg-slate-600'}`} />
                            <span className="truncate">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar Footer Zone */}
      <div className={`p-3 border-t border-slate-800 bg-[#070b13] flex shrink-0 select-none ${isCollapsed ? 'flex-col gap-3 justify-center items-center' : 'items-center justify-between'}`}>
        <button 
          id="btn-sidebar-collapse"
          onClick={handleCollapseClick}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {isCollapsed ? (
          <button 
            id="btn-sidebar-mobile-app-collapsed"
            onClick={onOpenMobileApp}
            className="p-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-800/80 text-sky-200 transition-colors cursor-pointer shadow-xs"
            title="Mobile App"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        ) : (
          <button 
            id="btn-sidebar-mobile-app"
            onClick={onOpenMobileApp}
            className="flex items-center gap-1.5 bg-sky-950 hover:bg-sky-900 border border-sky-800/80 text-sky-200 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile App</span>
          </button>
        )}

        {!isCollapsed && (
          <span className="text-[11px] font-mono font-semibold text-slate-500">
            v6.0.0
          </span>
        )}
      </div>
    </aside>
    </>
  );
}

