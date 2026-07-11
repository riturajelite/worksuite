/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, CreditCard, Ticket as TicketIcon, ChevronRight, 
  ArrowUpRight, AlertCircle, FileText, Sparkles, TrendingUp,
  Clock, Award, Heart, Shield, Settings, Play, Check, Plus, 
  Calendar, Mail, Gift, Coffee, Cake, ChevronDown, File, 
  UserCheck, CheckCircle2, MessageSquare, Info, ShieldAlert,
  HelpCircle, Eye, MoreVertical, Ban, LayoutGrid, DollarSign,
  Briefcase as BriefcaseIcon, ListTodo, ClipboardList, CheckCircle,
  TrendingDown, ThumbsUp, CalendarDays, Filter, RefreshCw, X, Sliders
} from 'lucide-react';
import { Lead, Client, Employee, Project, Task, Invoice, Ticket as SupportTicket, Notice } from '../types';

interface DashboardTabProps {
  currentTab?: string;
  userRole?: 'admin' | 'employee' | 'client';
  isClockedIn?: boolean;
  clockInTime?: string | null;
  onClockIn?: () => void;
  leads: Lead[];
  clients: Client[];
  employees: Employee[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  notices: Notice[];
  onNavigate: (tabId: string) => void;
}

export default function DashboardTab({
  currentTab = 'dashboard',
  userRole = 'admin',
  isClockedIn = false,
  clockInTime = null,
  onClockIn,
  leads,
  clients,
  employees,
  projects,
  tasks,
  invoices,
  tickets,
  notices,
  onNavigate
}: DashboardTabProps) {
  // Determine if we should show Advanced or Private Dashboard
  const isAdvanced = currentTab === 'dashboard-advanced';

  // State for Advanced Dashboard horizontal sub-tabs
  const [activeAdvancedTab, setActiveAdvancedTab] = useState<'overview' | 'project' | 'client' | 'hr' | 'ticket' | 'finance'>('overview');

  // Dynamic time state
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const getDayName = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Logged-in employee details mapping
  const loggedInUser = {
    name: userRole === 'employee' ? 'Elena Rostova' : userRole === 'client' ? 'Sovereign Tech' : 'Frederique Borer',
    role: userRole === 'employee' ? 'Senior Dev' : userRole === 'client' ? 'Client Rep' : 'Team Lead',
    empId: userRole === 'employee' ? 'EMP-4' : userRole === 'client' ? 'CL-9' : 'EMP-1',
    avatar: userRole === 'employee' 
      ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face'
      : userRole === 'client'
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face'
  };

  // ---------------------------------------------------------
  // INTERACTIVE LOCAL STATES TO SUPPORT FULL WORKABILITY
  // ---------------------------------------------------------
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  const [localClients, setLocalClients] = useState<Client[]>(clients);
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(employees);
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(invoices);
  const [localTickets, setLocalTickets] = useState<SupportTicket[]>(tickets);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Sync state if props change (e.g. from global state)
  useEffect(() => { setLocalProjects(projects); }, [projects]);
  useEffect(() => { setLocalClients(clients); }, [clients]);
  useEffect(() => { setLocalEmployees(employees); }, [employees]);
  useEffect(() => { setLocalInvoices(invoices); }, [invoices]);
  useEffect(() => { setLocalTickets(tickets); }, [tickets]);
  useEffect(() => { setLocalTasks(tasks); }, [tasks]);

  // Leave approval simulator state
  const [pendingLeaves, setPendingLeaves] = useState([
    { id: 'LV-101', name: 'Mrs. Leora Williamson', role: 'Junior Web Dev', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', date: '04-07-2026', type: 'Casual Leave', status: 'Pending' },
    { id: 'LV-102', name: 'James Carter', role: 'Senior Architect', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', date: '06-07-2026', type: 'Medical Leave', status: 'Pending' }
  ]);

  // Income chart interactive filters
  const [incomeViewType, setIncomeViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Timesheet tracker interactive filter
  const [timesheetEmployeeFilter, setTimesheetEmployeeFilter] = useState<string>('All');
  const [timesheetHoveredIndex, setTimesheetHoveredIndex] = useState<number | null>(null);

  // Quick addition modal states inside dashboard
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjClient, setNewProjClient] = useState('Sovereign Tech');
  const [newProjBudget, setNewProjBudget] = useState('15,000');

  // Client search state
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  // Project progress slider state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState<number>(50);

  // Widget config dropdown for Finance tab
  const [showWidgetConfig, setShowWidgetConfig] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<Record<string, boolean>>({
    paidInvoices: true,
    totalEarnings: true,
    invoiceOverview: true,
    proposalOverview: true,
    earningsByProjects: true,
    totalExpenses: true,
    totalPendingAmount: true,
    estimateOverview: true,
    earningsByClient: true,
    dueInvoices: true
  });

  // Toast confirmation simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper calculation formulas
  const totalBilled = localInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = localInvoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalDue = localInvoices.filter(i => i.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  
  const presentEmployeesCount = localEmployees.filter(e => e.status === 'Present').length;
  const lateEmployeesCount = localEmployees.filter(e => e.status === 'Late').length;
  const absentEmployeesCount = localEmployees.filter(e => e.status === 'Absent' || !e.status).length;

  const resolvedTicketsCount = localTickets.filter(t => t.status === 'Resolved').length;
  const openTicketsCount = localTickets.filter(t => t.status !== 'Resolved').length;

  // Actions
  const handleApproveLeave = (leaveId: string, approve: boolean) => {
    setPendingLeaves(prev => prev.filter(lv => lv.id !== leaveId));
    if (approve) {
      triggerToast('Leave request successfully Approved!');
    } else {
      triggerToast('Leave request rejected and logged.');
    }
  };

  const handlePayInvoiceLocal = (invoiceId: string) => {
    setLocalInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv));
    triggerToast(`Invoice ${invoiceId} marked as successfully Paid!`);
  };

  const handleResolveTicketLocal = (ticketId: string) => {
    setLocalTickets(prev => prev.map(tick => tick.id === ticketId ? { ...tick, status: 'Resolved' } : tick));
    triggerToast(`Support Ticket ${ticketId} successfully resolved!`);
  };

  const handleCreateProjectLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;
    const newRecord: Project = {
      id: `PR-${Date.now().toString().slice(-3)}`,
      name: newProjName,
      clientId: 'CL-203',
      clientName: newProjClient,
      status: 'In Progress',
      budget: parseFloat(newProjBudget.replace(/,/g, '')) || 15000,
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      progress: 0,
      members: ['Elena Rostova']
    };
    setLocalProjects([newRecord, ...localProjects]);
    setNewProjName('');
    setShowAddProjectModal(false);
    triggerToast(`Project "${newProjName}" successfully added and initialized!`);
  };

  const handleUpdateProjectProgress = (projId: string, progress: number) => {
    setLocalProjects(prev => prev.map(p => p.id === projId ? { ...p, progress } : p));
    setEditingProjectId(null);
    triggerToast(`Project progress updated to ${progress}%!`);
  };

  // Mock data for overview tab pending tasks (matching video)
  const [overviewPendingTasks, setOverviewPendingTasks] = useState([
    { code: 'BOT', title: 'Quick, now! And...', project: 'Chatbots', status: 'Incomplete', date: 'Today', color: 'bg-slate-400', members: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop'] },
    { code: 'RSA', title: "Alice asked. 'The...", project: 'Recipe sharing and meal planning app', status: 'To Do', date: 'Today', color: 'bg-amber-400', members: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&h=60&fit=crop', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop'] },
    { code: 'CMA', title: 'Dodo had paused as...', project: 'Community management and engagement service', status: 'Doing', date: '03-07-2026', color: 'bg-blue-400', members: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop'] },
    { code: 'CMA', title: 'I can creep under...', project: 'Community management and engagement service', status: 'Incomplete', date: '03-07-2026', color: 'bg-slate-400', members: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop'] },
    { code: 'CA', title: 'The Dormouse again...', project: 'Chat Application', status: 'Incomplete', date: '01-07-2026', color: 'bg-slate-400', members: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop'] },
    { code: 'SEO', title: 'Hatter, and here...', project: 'Search engine optimization (SEO) service', status: 'To Do', date: '01-07-2026', color: 'bg-amber-400', members: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop'] }
  ]);

  return (
    <div className="space-y-6 animate-fade-in pb-12 select-none">
      {/* Toast Confirmation Panel */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border border-slate-700 animate-slide-up text-sm font-semibold">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Light-blue Banner Alert identical to the screenshot */}
      <div className="bg-[#e0f2fe]/80 border border-sky-300 text-sky-900 rounded-xl p-4.5 flex items-start gap-3.5 text-sm md:text-base shadow-sm">
        <Info className="h-5.5 w-5.5 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-semibold">
          The Workspace demo environment resets every <strong className="font-extrabold text-sky-950">2 hours</strong>. Feel free to explore and edit all charts, resolve tickets, and approve leaves in real-time to test workflows.
        </p>
      </div>

      {/* Main Title Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            {isAdvanced ? 'Dashboard' : `Welcome back, ${loggedInUser.name}`}
          </h2>
          <p className="text-sm text-slate-500 font-bold mt-1">
            Dashboard Workspace • <span className="text-indigo-600 capitalize font-extrabold">{isAdvanced ? 'Enterprise View' : 'Private View'}</span>
          </p>
        </div>

        {/* Dynamic Time & Clock-in Button (matching screenshot) */}
        <div className="flex flex-wrap items-center gap-4.5">
          <div className="text-left md:text-right bg-slate-50 border border-slate-150 px-4 py-2 rounded-xl">
            <p className="text-lg font-bold text-slate-800 tracking-tight font-mono">{formatTime(time)}</p>
            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">{getDayName(time)} • 03 Jul 2026</p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="dashboard-clock-in-btn"
              onClick={onClockIn}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all cursor-pointer ${
                isClockedIn 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Clock className="h-4.5 w-4.5" />
              <span>{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
            </button>

            <button 
              id="dashboard-config-btn"
              onClick={() => onNavigate('settings')}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl shadow-sm transition-colors cursor-pointer"
              title="Dashboard Settings"
            >
              <Settings className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Layout Rendering based on sub-tab */}
      {!isAdvanced ? (
        /* ==================== PRIVATE DASHBOARD VIEW ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CONTAINER (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Employee Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-5">
                <img
                  src={loggedInUser.avatar}
                  alt={loggedInUser.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-md bg-slate-50"
                />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{loggedInUser.name}</h3>
                  <p className="text-sm text-slate-500 font-semibold">{loggedInUser.role}</p>
                  <p className="text-xs text-indigo-600 font-mono font-bold mt-1 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block">ID : {loggedInUser.empId}</p>
                </div>
              </div>

              {/* Connected open metrics stats */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-150 text-center">
                <div className="cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors" onClick={() => onNavigate('tasks')}>
                  <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Open Tasks</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{localTasks.filter(t => t.status !== 'Completed').length}</p>
                </div>
                <div className="border-x border-slate-150 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors" onClick={() => onNavigate('projects')}>
                  <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Projects</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">{localProjects.length}</p>
                </div>
                <div className="cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors" onClick={() => onNavigate('tickets')}>
                  <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Open Tickets</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{openTicketsCount}</p>
                </div>
              </div>
            </div>

            {/* 2. Shift Schedule Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Shift Schedule</h4>
                  <p className="text-xs text-slate-400 font-medium">Verify daily workspace rosters</p>
                </div>
                <button 
                  onClick={() => onNavigate('employees')}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-colors cursor-pointer"
                >
                  View All Employees
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 text-xs sm:text-sm font-bold tracking-wider">
                      <th className="pb-3 font-bold">Date / Day</th>
                      <th className="pb-3 font-bold">Shift Name</th>
                      <th className="pb-3 font-bold">Shift Details</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm divide-y divide-slate-100 font-medium">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-800 font-bold">
                        29-06-2026 <span className="text-slate-400 text-xs block font-semibold">Monday</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">General Shift</span>
                      </td>
                      <td className="py-3 text-slate-500">Default company hours (9 AM - 6 PM)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-800 font-bold">
                        30-06-2026 <span className="text-slate-400 text-xs block font-semibold">Tuesday</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">General Shift</span>
                      </td>
                      <td className="py-3 text-slate-500">Default company hours (9 AM - 6 PM)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-800 font-bold">
                        01-07-2026 <span className="text-slate-400 text-xs block font-semibold">Wednesday</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">Night Shift</span>
                      </td>
                      <td className="py-3 text-slate-400">Rest / Remote Sync</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-800 font-bold">
                        02-07-2026 <span className="text-slate-400 text-xs block font-semibold">Thursday</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-150">Day Shift</span>
                      </td>
                      <td className="py-3 text-slate-400">On-Duty Standby</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT CONTAINER (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 3. Interactive Calendar Workspace Link */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:border-indigo-400 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Personal Calendar Workspace</h4>
                    <p className="text-xs text-slate-400 font-semibold">July 2026 schedules & meetings</p>
                  </div>
                </div>
                
                <button
                  onClick={() => onNavigate('calendar')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                >
                  <span>Open Calendar Module</span>
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Mini Interactive agenda blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                  <p className="text-xs font-extrabold text-indigo-600 font-mono uppercase">Today • 11:00 AM</p>
                  <p className="text-sm font-bold text-slate-900">Q3 Product Strategy Alignment</p>
                  <p className="text-xs text-slate-500">Boardroom Alpha / Google Meet Link</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                  <p className="text-xs font-extrabold text-emerald-600 font-mono uppercase">Tomorrow • 05:00 PM</p>
                  <p className="text-sm font-bold text-slate-900">Independence Day Social</p>
                  <p className="text-xs text-slate-500">Garden Terrace Gathering</p>
                </div>
              </div>
            </div>

            {/* 4. Support Tickets Workability Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Assigned Support Tickets</h4>
                  <p className="text-xs text-slate-400 font-medium">Solve customer helpdesk requests</p>
                </div>
                <span className="text-xs bg-rose-50 text-rose-700 border border-rose-100 font-bold px-3 py-1 rounded-full">
                  {localTickets.filter(t => t.status !== 'Resolved').length} Active
                </span>
              </div>

              {localTickets.filter(t => t.status !== 'Resolved').length > 0 ? (
                <div className="space-y-3.5">
                  {localTickets.filter(t => t.status !== 'Resolved').slice(0, 3).map(ticket => (
                    <div key={ticket.id} className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-colors border border-slate-150 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{ticket.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ticket.priority === 'Urgent' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                          }`}>{ticket.priority}</span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 mt-1.5">{ticket.subject}</h5>
                        <p className="text-xs text-slate-400 mt-0.5">Reporter: {ticket.raisedBy} • Assigned: {ticket.assignedTo}</p>
                      </div>

                      <button
                        onClick={() => handleResolveTicketLocal(ticket.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-lg cursor-pointer animate-pulse"
                      >
                        Resolve Ticket
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                  <p className="text-sm font-bold text-slate-700">All assigned tickets resolved successfully!</p>
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* ==================== ADVANCED DASHBOARD VIEW ==================== */
        <div className="space-y-6 animate-fade-in">
          
          {/* Advanced Horizontal Sub-navigation tabs (Larger Text) */}
          <div className="flex flex-wrap items-center border-b border-slate-200/80 bg-white p-1.5 rounded-2xl shadow-sm border gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'project', label: 'Project' },
              { id: 'client', label: 'Client' },
              { id: 'hr', label: 'HR' },
              { id: 'ticket', label: 'Ticket' },
              { id: 'finance', label: 'Finance' }
            ].map(tab => (
              <button
                key={tab.id}
                id={`advanced-sub-tab-${tab.id}`}
                onClick={() => setActiveAdvancedTab(tab.id as any)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeAdvancedTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* RENDERING INDIVIDUAL ADVANCED TABS */}
          {activeAdvancedTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* 1. KPI grid (8 elements matching screenshot exactly) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
                
                {/* Total Clients */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveAdvancedTab('client')}>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clients</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">9</h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                </div>

                {/* Total Employees */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveAdvancedTab('hr')}>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Employees</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">10</h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <UserCheck className="h-6 w-6" />
                  </div>
                </div>

                {/* Total Projects */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveAdvancedTab('project')}>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Projects</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">8</h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>
                </div>

                {/* Due Invoices */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveAdvancedTab('finance')}>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Due Invoices</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">6</h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>

                {/* Hours Logged */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('timesheet')}>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours Logged</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">30 hrs</h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>

                {/* Pending Tasks */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  const el = document.getElementById('overview-pending-tasks-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">Pending Tasks <HelpCircle className="h-3 w-3 text-slate-300" /></p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">30</h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <ListTodo className="h-6 w-6" />
                  </div>
                </div>

                {/* Today Attendance */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveAdvancedTab('hr')}>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today Attendance</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">0/10</h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <UserCheck className="h-6 w-6" />
                  </div>
                </div>

                {/* Unresolved Tickets */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveAdvancedTab('ticket')}>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unresolved Tickets</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">3</h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <TicketIcon className="h-6 w-6" />
                  </div>
                </div>

              </div>

              {/* Rows of charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Income Bar Chart with Help Icon & Calendar */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-lg font-bold text-slate-900">Income</h4>
                      <HelpCircle className="h-4.5 w-4.5 text-slate-400 cursor-pointer" />
                    </div>
                    
                    {/* View Switcher Toggle & Calendar Select style */}
                    <div className="flex items-center gap-2.5">
                      <button className="flex items-center gap-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 transition-all">
                        <span>01-July-26</span>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* SVG Bar Chart representing exact values */}
                  <div className="h-64 flex items-end gap-16 px-6 border-b border-l border-slate-200 pb-3 relative">
                    {/* Horizontal Gridlines */}
                    <div className="absolute left-0 right-0 top-12 border-t border-slate-100 w-full pointer-events-none" />
                    <div className="absolute left-0 right-0 top-28 border-t border-slate-100 w-full pointer-events-none" />
                    <div className="absolute left-0 right-0 top-44 border-t border-slate-100 w-full pointer-events-none" />

                    {/* Chart Labels */}
                    <div className="absolute -left-14 top-10 text-[11px] font-bold text-slate-400">100000 –</div>
                    <div className="absolute -left-14 top-26 text-[11px] font-bold text-slate-400">50000 –</div>
                    <div className="absolute -left-14 top-42 text-[11px] font-bold text-slate-400">20000 –</div>
                    <div className="absolute -left-10 bottom-2 text-[11px] font-bold text-slate-400">0 –</div>

                    {/* Bar 1: 01-July-26 */}
                    <div className="flex-1 flex flex-col items-center justify-end h-full group" onMouseEnter={() => setHoveredBar('w1')} onMouseLeave={() => setHoveredBar(null)}>
                      <div className="w-full max-w-[56px] bg-indigo-500 rounded-t-lg group-hover:bg-indigo-600 transition-all cursor-pointer relative" style={{ height: '75%' }}>
                        {hoveredBar === 'w1' && (
                          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs p-2 rounded-xl shadow-xl z-10 whitespace-nowrap font-bold">
                            <p className="text-[10px] text-slate-400">01-July-26</p>
                            <p>$75,000 Earnings</p>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 mt-2 whitespace-nowrap">01-July-26</span>
                    </div>

                    {/* Bar 2: 01-July-26 */}
                    <div className="flex-1 flex flex-col items-center justify-end h-full group" onMouseEnter={() => setHoveredBar('w2')} onMouseLeave={() => setHoveredBar(null)}>
                      <div className="w-full max-w-[56px] bg-indigo-500 rounded-t-lg group-hover:bg-indigo-600 transition-all cursor-pointer relative" style={{ height: '60%' }}>
                        {hoveredBar === 'w2' && (
                          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs p-2 rounded-xl shadow-xl z-10 whitespace-nowrap font-bold">
                            <p className="text-[10px] text-slate-400">01-July-26</p>
                            <p>$60,000 Earnings</p>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 mt-2 whitespace-nowrap">01-July-26</span>
                    </div>

                    {/* Bar 3: 03-July-26 */}
                    <div className="flex-1 flex flex-col items-center justify-end h-full group" onMouseEnter={() => setHoveredBar('w3')} onMouseLeave={() => setHoveredBar(null)}>
                      <div className="w-full max-w-[56px] bg-indigo-500 rounded-t-lg group-hover:bg-indigo-600 transition-all cursor-pointer relative" style={{ height: '35%' }}>
                        {hoveredBar === 'w3' && (
                          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs p-2 rounded-xl shadow-xl z-10 whitespace-nowrap font-bold">
                            <p className="text-[10px] text-slate-400">03-July-26</p>
                            <p>$35,000 Earnings</p>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 mt-2 whitespace-nowrap">03-July-26</span>
                    </div>

                  </div>
                </div>

                {/* 2. Timesheet Area Chart with Help Icon & Dropdown */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-lg font-bold text-slate-900">Timesheet</h4>
                      <HelpCircle className="h-4.5 w-4.5 text-slate-400 cursor-pointer" />
                    </div>

                    <button className="flex items-center gap-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 transition-all">
                      <span>01-July-26</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </div>

                  {/* Stunning area line spline plot */}
                  <div className="h-64 border-b border-l border-slate-200 pb-3 relative">
                    <div className="absolute left-0 right-0 top-16 border-t border-dashed border-slate-100 w-full pointer-events-none" />
                    <div className="absolute left-0 right-0 top-36 border-t border-dashed border-slate-100 w-full pointer-events-none" />

                    <div className="absolute -left-10 top-14 text-[10px] font-bold text-slate-400">5 –</div>
                    <div className="absolute -left-10 top-34 text-[10px] font-bold text-slate-400">2 –</div>
                    <div className="absolute -left-10 bottom-2 text-[10px] font-bold text-slate-400">0</div>

                    {/* Smooth custom Area Spline Path */}
                    <div className="w-full h-full relative pt-4 px-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="timesheetGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 10 190 Q 100 130, 200 90 T 390 10 L 390 190 Z"
                          fill="url(#timesheetGradient)"
                        />
                        <path
                          d="M 10 190 Q 100 130, 200 90 T 390 10"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="3.5"
                        />
                        <circle cx="200" cy="90" r="5.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                        <circle cx="390" cy="10" r="5.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 mt-2 px-4">
                      <span>01-July-26</span>
                      <span>03-July-26</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Secondary Layout for Pending Tables matching Video */}
              <div id="overview-pending-tasks-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                
                {/* Pending Tasks Panel */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-extrabold text-slate-900 tracking-tight">Pending Tasks</h4>
                      <HelpCircle className="h-4 w-4 text-slate-300" />
                    </div>
                    <button onClick={() => onNavigate('tasks')} className="text-xs bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold">View Taskboard</button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm font-medium">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="pb-3">Code</th>
                          <th className="pb-3">Task</th>
                          <th className="pb-3">Project</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                        {overviewPendingTasks.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/40">
                            <td className="py-3.5"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">{t.code}</span></td>
                            <td className="py-3.5 font-bold text-slate-800 max-w-[180px] truncate">{t.title}</td>
                            <td className="py-3.5 text-slate-500 truncate max-w-[200px]">{t.project}</td>
                            <td className="py-3.5">
                              <span className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${t.color}`} />
                                <span className="text-xs text-slate-600">{t.status}</span>
                                <span className="text-[10px] text-slate-400 font-bold ml-1.5 bg-slate-100 px-1.5 py-0.5 rounded">{t.date}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Left Mini-cards: Follow-up and documentations */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Pending FollowUp */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending FollowUp</h5>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                    <div className="py-8 text-center text-slate-400 text-xs italic font-medium">
                      - No record found. -
                    </div>
                  </div>

                  {/* Document Expiries */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Document Expiries</h5>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                    <div className="py-8 text-center text-slate-400 text-xs italic font-medium">
                      - No record found. -
                    </div>
                  </div>
                </div>

              </div>

              {/* Botton activity timelines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Activity Timeline</h5>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                  <div className="py-10 text-center text-slate-400 text-xs italic font-medium">
                    - No record found. -
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">User Activity Timeline</h5>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                  <div className="py-10 text-center text-slate-400 text-xs italic font-medium">
                    - No record found. -
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeAdvancedTab === 'project' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-fade-in space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Project Dashboard</h3>
                  <p className="text-sm text-slate-500">Home • Project Dashboard</p>
                </div>
                
                <button
                  id="advanced-add-proj-btn"
                  onClick={() => setShowAddProjectModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Small KPI Cards inside sub-tab */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Projects</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">8</p>
                  </div>
                  <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-xs">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Overdue Projects</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">0</p>
                  </div>
                  <div className="p-3 bg-white text-rose-500 rounded-xl shadow-xs">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Hours Logged</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">6h</p>
                  </div>
                  <div className="p-3 bg-white text-emerald-500 rounded-xl shadow-xs">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Main row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Status Wise Projects */}
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-extrabold text-slate-900">Status Wise Projects</h4>
                    <LayoutGrid className="h-4 w-4 text-slate-400 cursor-pointer" />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-4">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-indigo-600" strokeWidth="4.5" strokeDasharray="100, 100" strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl font-black text-slate-800">8</p>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase">Projects</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-600 block" />
                        <span>In Progress: 8</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Milestone table */}
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-extrabold text-slate-900">Pending Milestone</h4>
                      <HelpCircle className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>

                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm font-medium">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="pb-3">#</th>
                          <th className="pb-3">Milestone Title</th>
                          <th className="pb-3">Milestone Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={3} className="py-12 text-center text-slate-400 text-xs italic">
                            - No record found. -
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeAdvancedTab === 'client' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Client Dashboard</h3>
                  <p className="text-sm text-slate-500 font-semibold">Home • Client Dashboard</p>
                </div>
              </div>

              {/* 6 KPI Cards for clients */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Total Clients</p>
                  <p className="text-xl font-black text-slate-800">11</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase text-indigo-600">Total Leads</p>
                  <p className="text-xl font-black text-indigo-600">9</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase text-indigo-600">Total Deals</p>
                  <p className="text-xl font-black text-indigo-600">9</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase text-emerald-600">Deal Conversions</p>
                  <p className="text-xs font-black text-emerald-600 mt-1 whitespace-nowrap">1/8 (11.11%)</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase text-slate-700">Contracts Generated</p>
                  <p className="text-xl font-black text-slate-800">1</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase text-emerald-600">Contracts Signed</p>
                  <p className="text-xl font-black text-emerald-600">1</p>
                </div>
              </div>

              {/* Row of Client Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* Client Wise Earnings */}
                <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-3">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Client Wise Earnings</h4>
                  
                  <div className="h-56 flex items-end justify-around border-b border-l border-slate-200 pb-3 pt-6 relative px-4">
                    {/* Columns */}
                    <div className="flex flex-col items-center justify-end h-full group w-14">
                      <div className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all cursor-pointer relative" style={{ height: '80%' }}>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-1.5 rounded shadow whitespace-nowrap font-bold">$110,000</div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-full text-center">Camilla M.</span>
                    </div>

                    <div className="flex flex-col items-center justify-end h-full group w-14">
                      <div className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all cursor-pointer relative" style={{ height: '60%' }}>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-1.5 rounded shadow whitespace-nowrap font-bold">$80,000</div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-full text-center">Dean H.</span>
                    </div>

                    <div className="flex flex-col items-center justify-end h-full group w-14">
                      <div className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all cursor-pointer relative" style={{ height: '35%' }}>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-1.5 rounded shadow whitespace-nowrap font-bold">$40,000</div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-full text-center">Mrs. Wunsch</span>
                    </div>
                  </div>
                </div>

                {/* Client Wise Timelogs */}
                <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-3">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Client Wise Timelogs</h4>
                  
                  <div className="h-56 border-b border-l border-slate-200 pb-3 relative">
                    <div className="w-full h-full relative pt-4 px-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="clientLogsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M 10 140 Q 80 80, 150 110 T 290 20 L 290 140 Z" fill="url(#clientLogsGrad)" />
                        <path d="M 10 140 Q 80 80, 150 110 T 290 20" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
                        <circle cx="150" cy="110" r="4.5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                        <circle cx="290" cy="20" r="4.5" fill="#4f46e5" stroke="#fff" strokeWidth="1.5" />
                      </svg>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2 px-4">
                      <span>Camilla Monahan</span>
                      <span>Stuart Cronin</span>
                      <span>Dean Hammes</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Deal Counts by pipeline stages & Leads counts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Deal Count by stages */}
                <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Deal Count by Stages and Pipeline</h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">Sales Pipelines</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                        <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#ef4444" strokeWidth="4.5" strokeDasharray="15, 100" />
                        <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="20, 100" strokeDashoffset="-15" />
                        <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="25, 100" strokeDashoffset="-35" />
                        <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="40, 100" strokeDashoffset="-60" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xl font-black text-slate-800">9</p>
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase">Total Deals</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Won (40%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span>Proposal (25%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Contact (20%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <span>Lost (15%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leads count by Source */}
                <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Leads Count by Source</h4>
                  <div className="py-12 text-center text-slate-400 text-xs italic font-semibold">
                    - Not enough data -
                  </div>
                </div>

              </div>

              {/* Latest Clients Table & recent logins */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Latest Clients */}
                <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                  <h4 className="text-base font-bold text-slate-800">Latest Clients</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm font-medium">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="pb-3">Client</th>
                          <th className="pb-3">Email</th>
                          <th className="pb-3">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-slate-900">Edythe Moon PhD</td>
                          <td className="py-3 text-slate-500">sarton.marlen@example.net</td>
                          <td className="py-3 text-slate-400 font-mono">04-07-2026</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-slate-900">Josiane Green PhD</td>
                          <td className="py-3 text-slate-500">tillman.camille@example.com</td>
                          <td className="py-3 text-slate-400 font-mono">04-07-2026</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-slate-900">Stuart Cronin</td>
                          <td className="py-3 text-slate-500">jaren09@example.org</td>
                          <td className="py-3 text-slate-400 font-mono">04-07-2026</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-slate-900">Mrs. Delfina Wunsch</td>
                          <td className="py-3 text-slate-500">huels.regan@example.net</td>
                          <td className="py-3 text-slate-400 font-mono">04-07-2026</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-slate-900">Dean Hammes</td>
                          <td className="py-3 text-slate-500">kadin23@example.org</td>
                          <td className="py-3 text-slate-400 font-mono">04-07-2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent login logs */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Recent Login Activities</h4>
                  <div className="py-14 text-center text-slate-400 text-xs italic font-semibold">
                    - No record found. -
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeAdvancedTab === 'hr' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">HR Dashboard</h3>
                  <p className="text-sm text-slate-500 font-semibold">Home • HR Dashboard</p>
                </div>

                <button className="flex items-center gap-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600 hover:bg-slate-100 transition-all">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <span>01-07-2026 To 04-07-2026</span>
                </button>
              </div>

              {/* 6 KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Leaves Approved</p>
                  <p className="text-xl font-black text-slate-800">1</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Employees</p>
                  <p className="text-xl font-black text-slate-800">10</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">New Employees</p>
                  <p className="text-xl font-black text-slate-800">0</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Employee Exits</p>
                  <p className="text-xl font-black text-slate-800">0</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Today Attendance</p>
                  <p className="text-xl font-black text-slate-800">0/10</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-center space-y-1">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Average Attendance</p>
                  <p className="text-xl font-black text-slate-800">10.00%</p>
                </div>
              </div>

              {/* Four pie charts (row grid) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                
                {/* 1. Department wise */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 text-center space-y-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Department wise Employee</p>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f472b6" strokeWidth="4.5" strokeDasharray="50, 100" />
                      <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#a78bfa" strokeWidth="4.5" strokeDasharray="50, 100" strokeDashoffset="-50" />
                    </svg>
                  </div>
                </div>

                {/* 2. Designation wise */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 text-center space-y-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Designation wise Employee</p>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#60a5fa" strokeWidth="4.5" strokeDasharray="100, 100" />
                    </svg>
                  </div>
                </div>

                {/* 3. Gender wise */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 text-center space-y-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gender wise Employee</p>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f472b6" strokeWidth="4.5" strokeDasharray="30, 100" />
                      <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="70, 100" strokeDashoffset="-30" />
                    </svg>
                  </div>
                </div>

                {/* 4. Role wise */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 text-center space-y-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role wise Employee</p>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#fbbf24" strokeWidth="4.5" strokeDasharray="100, 100" />
                    </svg>
                  </div>
                </div>

              </div>

              {/* Joining Vs Attrition full scale line chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Joining Vs Attrition</h4>
                  <div className="flex gap-4 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Joining</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Attrition</span>
                  </div>
                </div>

                <div className="h-52 w-full relative pt-4">
                  {/* Custom continuous line spline representing joining peak on Oct */}
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none">
                    <line x1="0" y1="75" x2="600" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                    
                    {/* Joining Line */}
                    <path d="M 0 140 Q 100 140, 150 10 L 200 140 T 600 140" fill="none" stroke="#3b82f6" strokeWidth="3" />
                    {/* Attrition Line (flat) */}
                    <path d="M 0 140 L 600 140" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    
                    {/* Peak dot Oct */}
                    <circle cx="150" cy="10" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>

                  {/* Month axis */}
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mt-3 uppercase tracking-wider">
                    <span>August</span>
                    <span>September</span>
                    <span>October</span>
                    <span>November</span>
                    <span>December</span>
                    <span>January</span>
                    <span>February</span>
                    <span>March</span>
                    <span>April</span>
                    <span>May</span>
                    <span>June</span>
                    <span>July</span>
                  </div>
                </div>
              </div>

              {/* Leaves Taken birthday & late logs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Leaves Taken table */}
                <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Leaves Taken</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop" className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">Felipe Friksen</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Project Manager</p>
                        </div>
                      </div>
                      <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-lg font-black">1</span>
                    </div>
                  </div>
                </div>

                {/* Birthdays */}
                <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Birthdays</h4>
                  <div className="py-10 text-center text-slate-400 text-xs italic font-semibold">
                    - No record found. -
                  </div>
                </div>

              </div>

              {/* Late attendance */}
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Late Attendance</h4>
                <div className="py-10 text-center text-slate-400 text-xs italic font-semibold">
                  - No record found. -
                </div>
              </div>

            </div>
          )}

          {activeAdvancedTab === 'ticket' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-fade-in space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Ticket Dashboard</h3>
                  <p className="text-sm text-slate-500 font-semibold">Home • Ticket Dashboard</p>
                </div>
              </div>

              {/* KPI metrics row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Tickets</p>
                    <div className="flex items-center gap-3.5 mt-1">
                      <span className="text-lg font-black text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-xl">5 Unresolved</span>
                      <span className="text-lg font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">3 Resolved</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Unassigned Ticket</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">0</p>
                  </div>
                  <div className="p-3 bg-white text-slate-400 rounded-xl shadow-xs">
                    <Ban className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Pie charts for type and channel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* Type wise */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 text-center space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type Wise Ticket</h4>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="100, 100" />
                    </svg>
                  </div>
                </div>

                {/* Status wise */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 text-center space-y-4 flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Wise Ticket</h4>
                  <div className="py-8 text-slate-400 text-xs italic font-semibold">- Not enough data -</div>
                </div>

                {/* Channel wise */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 text-center space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channel Wise Ticket</h4>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#d946ef" strokeWidth="4.5" strokeDasharray="100, 100" />
                    </svg>
                  </div>
                </div>

              </div>

              {/* Tickets List View */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="text-base font-bold text-slate-800">Open Tickets List</h4>
                  <span className="text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full font-bold">Priority Resolving Active</span>
                </div>

                {localTickets.filter(t => t.status !== 'Resolved').map(tick => (
                  <div key={tick.id} className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-50/80 border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs font-bold">{tick.id}</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                          tick.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse' :
                          tick.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-slate-100 text-slate-600'
                        }`}>{tick.priority} Priority</span>
                      </div>
                      <p className="text-base font-bold text-slate-900">{tick.subject}</p>
                      <p className="text-xs text-slate-400 font-semibold">Raised: <span className="text-slate-600">04-07-2026</span> • Owner: <span className="text-indigo-600">{tick.assignedTo}</span> • Client: <span className="text-slate-600">{tick.raisedBy}</span></p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        tick.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>{tick.status}</span>
                      
                      {tick.status !== 'Resolved' && (
                        <button
                          onClick={() => handleResolveTicketLocal(tick.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all"
                        >
                          Resolve Status
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeAdvancedTab === 'finance' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-fade-in space-y-6">
              
              {/* Alert Message for Base Currency */}
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4.5 flex items-start gap-3 text-sm font-semibold shadow-xs">
                <AlertCircle className="h-5.5 w-5.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  The earnings are mentioned in your base currency. (USD)
                </p>
              </div>

              {/* Finance KPI block with Config dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 relative">
                
                {visibleWidgets.dueInvoices && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Invoices</p>
                      <div className="flex gap-3 mt-1 text-sm font-extrabold text-slate-700">
                        <span className="text-emerald-600">0 Paid Invoices</span>
                        <span className="text-rose-500">0 Due Invoices</span>
                      </div>
                    </div>
                  </div>
                )}

                {visibleWidgets.totalEarnings && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between relative">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Finance</p>
                      <div className="flex gap-4.5 mt-1 text-sm font-black">
                        <span className="text-rose-600">Total Expenses: $824.00</span>
                        <span className="text-emerald-600">Total Earnings: $219,077.00</span>
                      </div>
                    </div>

                    {/* Popover trigger button */}
                    <button
                      onClick={() => setShowWidgetConfig(!showWidgetConfig)}
                      className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg shadow-xs hover:bg-slate-100 transition-colors ml-2 cursor-pointer relative"
                    >
                      <Sliders className="h-4 w-4" />
                    </button>

                    {/* Dashboard Widgets checklist Popover */}
                    {showWidgetConfig && (
                      <div className="absolute top-16 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 w-64 z-40 animate-scale-up space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h4 className="text-xs font-black text-slate-800 uppercase">Dashboard Widgets</h4>
                          <button onClick={() => setShowWidgetConfig(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                        </div>

                        <div className="space-y-2 text-xs font-semibold text-slate-600 max-h-48 overflow-y-auto scrollbar-thin">
                          {[
                            { id: 'paidInvoices', label: 'Paid Invoices' },
                            { id: 'totalEarnings', label: 'Total Earnings' },
                            { id: 'invoiceOverview', label: 'Invoice Overview' },
                            { id: 'proposalOverview', label: 'Proposal Overview' },
                            { id: 'earningsByProjects', label: 'Earnings By Projects' },
                            { id: 'totalExpenses', label: 'Total Expenses' },
                            { id: 'totalPendingAmount', label: 'Total Pending Amount' },
                            { id: 'estimateOverview', label: 'Estimate Overview' },
                            { id: 'earningsByClient', label: 'Earnings By Client' },
                            { id: 'dueInvoices', label: 'Due Invoices' },
                          ].map(opt => (
                            <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
                              <input
                                type="checkbox"
                                checked={visibleWidgets[opt.id] ?? true}
                                onChange={(e) => setVisibleWidgets(prev => ({ ...prev, [opt.id]: e.target.checked }))}
                                className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>

                        <button
                          onClick={() => { setShowWidgetConfig(false); triggerToast('Widget preferences saved successfully!'); }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 rounded-xl shadow-md transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {visibleWidgets.totalPendingAmount && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Total Pending Amount</p>
                      <p className="text-2xl font-black text-slate-800 mt-1">$0.00</p>
                    </div>
                  </div>
                )}

              </div>

              {/* Grid of Finance charts and messages */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {visibleWidgets.invoiceOverview && (
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 text-center space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Overview</p>
                    <div className="py-8 text-slate-400 text-xs italic font-semibold">- Not enough data -</div>
                  </div>
                )}

                {visibleWidgets.estimateOverview && (
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 text-center space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimate Overview</p>
                    <div className="py-8 text-slate-400 text-xs italic font-semibold">- Not enough data -</div>
                  </div>
                )}

                {visibleWidgets.proposalOverview && (
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 text-center space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proposal Overview</p>
                    <div className="py-8 text-slate-400 text-xs italic font-semibold">- Not enough data -</div>
                  </div>
                )}

              </div>

              {/* Lower grid for client and project earnings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* Client Wise Earnings bar plot */}
                {visibleWidgets.earningsByClient && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-3">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Client Wise Earnings</h4>
                    
                    <div className="h-64 flex items-end justify-around border-b border-l border-slate-200 pb-3 pt-6 relative px-4">
                      <div className="flex flex-col items-center justify-end h-full group w-20">
                        <div className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all cursor-pointer relative" style={{ height: '80%' }}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-1.5 rounded shadow whitespace-nowrap font-bold">$100,000+</div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-2 text-center truncate w-full">Camilla Monahan</span>
                      </div>

                      <div className="flex flex-col items-center justify-end h-full group w-20">
                        <div className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all cursor-pointer relative" style={{ height: '60%' }}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-1.5 rounded shadow whitespace-nowrap font-bold">$80,000+</div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-2 text-center truncate w-full">Dean Hammes</span>
                      </div>

                      <div className="flex flex-col items-center justify-end h-full group w-20">
                        <div className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all cursor-pointer relative" style={{ height: '35%' }}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-1.5 rounded shadow whitespace-nowrap font-bold">$40,000+</div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-2 text-center truncate w-full">Mrs. Delfina Wunsch</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Earnings By Projects */}
                {visibleWidgets.earningsByProjects && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs space-y-3">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Earnings By Projects</h4>
                    
                    <div className="h-64 flex items-end justify-around border-b border-l border-slate-200 pb-3 pt-6 relative px-2 gap-2">
                      {[
                        { name: 'Lang Translation', height: '55%', amount: '$55,000' },
                        { name: 'Web Dev', height: '80%', amount: '$80,000' },
                        { name: 'Community Mgmt', height: '50%', amount: '$50,000' },
                        { name: 'Chatbots', height: '40%', amount: '$40,000' },
                        { name: 'SEO Service', height: '35%', amount: '$35,000' }
                      ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                          <div className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-all cursor-pointer relative" style={{ height: bar.height }}>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] p-1.5 rounded shadow whitespace-nowrap font-bold">{bar.amount}</div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 mt-2 text-center truncate w-full leading-tight">{bar.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
