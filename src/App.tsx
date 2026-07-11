/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import CRMTab from './components/CRMTab';
import HRTab from './components/HRTab';
import ProjectsTab from './components/ProjectsTab';
import FinanceTab from './components/FinanceTab';
import MiscTab from './components/MiscTab';
import BiometricTab from './components/BiometricTab';
import LetterTab from './components/LetterTab';
import PayrollTab from './components/PayrollTab';
import PerformanceTab from './components/PerformanceTab';
import PurchaseTab from './components/PurchaseTab';
import ATSAndSystemsTab from './components/ATSAndSystemsTab';
import ReportsTab from './components/ReportsTab';
import CareerSite from './components/CareerSite';
import SettingsTab from './components/SettingsTab';
import Login from './components/Login';
import MobileAppModal from './components/MobileAppModal';

import { 
  INITIAL_LEADS, INITIAL_CLIENTS, INITIAL_EMPLOYEES, INITIAL_PROJECTS, 
  INITIAL_TASKS, INITIAL_LEAVES, INITIAL_ATTENDANCE, INITIAL_INVOICES, 
  INITIAL_EXPENSES, INITIAL_TICKETS, INITIAL_NOTICES, INITIAL_SERVERS, 
  INITIAL_WEBHOOKS, INITIAL_WEBHOOK_LOGS, INITIAL_JOBS, INITIAL_JOB_APPLICATIONS, 
  INITIAL_INTERVIEWS, Lead, Client, Employee, Leave, Project, Task, Invoice, Expense, Ticket, Webhook
} from './types';

export default function App() {
  const [userRole, setUserRole] = useState<'admin' | 'employee' | 'client' | null>(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Global app font size configuration ("make it long")
  const [appFontSize, setAppFontSize] = useState<'standard' | 'large' | 'long'>(() => {
    return (localStorage.getItem('app-font-size') as any) || 'standard';
  });

  // State to preserve the active settings sub-tab
  const [selectedSettingSubTab, setSelectedSettingSubTab] = useState('App Settings');

  const handleSetFontSize = (size: 'standard' | 'large' | 'long') => {
    setAppFontSize(size);
    localStorage.setItem('app-font-size', size);
  };

  // Core mutable datasets
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [leaves, setLeaves] = useState<Leave[]>(INITIAL_LEAVES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS);
  const [webhookLogs, setWebhookLogs] = useState(INITIAL_WEBHOOK_LOGS);

  // Constants
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [applications, setApplications] = useState(INITIAL_JOB_APPLICATIONS);
  const [interviews, setInterviews] = useState(INITIAL_INTERVIEWS);

  // Candidates, skills and offer letters state for perfect Recruit module interactivity
  const [candidates, setCandidates] = useState([
    { name: 'Michael Corleone', skills: 'Node, TS, PostgreSQL, Docker', matchScore: '95%', location: 'Bangalore' },
    { name: 'Harry Potter', skills: 'React, Express, AWS, Rust', matchScore: '89%', location: 'Remote / US' },
    { name: 'Lois Lane', skills: 'SEO, Content, Marketing, Copywriting', matchScore: '82%', location: 'Singapore' },
  ]);

  const [skillsList, setSkillsList] = useState([
    'Node.js', 'React', 'TypeScript', 'Tailwind CSS', 'Docker', 
    'AWS', 'PostgreSQL', 'Express', 'Marketing', 'Copywriting'
  ]);

  const [offerLetters, setOfferLetters] = useState([
    { candidate: 'Michael Corleone', job: 'Senior Backend Engineer (Node/TS)', date: '2026-07-01', salary: '$120,000 / Yr', status: 'Accepted' },
    { candidate: 'Harry Potter', job: 'Senior Backend Engineer (Node/TS)', date: '2026-07-03', salary: '$110,000 / Yr', status: 'Pending Review' },
  ]);

  const handleAddCandidate = (cand: { name: string; skills: string; matchScore: string; location: string }) => {
    setCandidates(prev => [cand, ...prev]);
  };

  const handleAddSkill = (skill: string) => {
    setSkillsList(prev => [...prev, skill]);
  };

  const handleAddOffer = (offer: { candidate: string; job: string; date: string; salary: string; status: string }) => {
    setOfferLetters(prev => [offer, ...prev]);
  };

  // Punch clock attendance state
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState<string | null>('08:58 AM');

  // Timesheet live tracker state
  const [activeTimer, setActiveTimer] = useState<{
    isRunning: boolean;
    elapsedSeconds: number;
    taskId: string;
    taskTitle: string;
    projectName: string;
  } | null>(null);

  // Active Timer counting thread
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTimer && activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer(prev => {
          if (!prev) return null;
          return {
            ...prev,
            elapsedSeconds: prev.elapsedSeconds + 1
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const handleStartTimer = (taskId: string, taskTitle: string, projectName: string) => {
    setActiveTimer({
      isRunning: true,
      elapsedSeconds: 0,
      taskId,
      taskTitle,
      projectName
    });
  };

  const handleStopTimer = () => {
    if (!activeTimer) return;
    // Log completion message
    alert(`Timesheet logging successful!\nLogged ${Math.ceil(activeTimer.elapsedSeconds / 60)} minutes onto "${activeTimer.taskTitle}" (${activeTimer.projectName})`);
    setActiveTimer(null);
  };

  const handleClockIn = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
      setClockInTime(null);
    } else {
      setIsClockedIn(true);
      const now = new Date();
      setClockInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  // Mutators
  const handleAddLead = (newLead: Omit<Lead, 'id' | 'createdDate'>) => {
    const leadRecord: Lead = {
      ...newLead,
      id: `LD-${Date.now().toString().slice(-3)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setLeads([leadRecord, ...leads]);
  };

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  const handleAddClient = (newClient: Omit<Client, 'id' | 'projectsCount' | 'totalBilled'>) => {
    const clientRecord: Client = {
      ...newClient,
      id: String(clients.length + 1),
      projectsCount: 0,
      totalBilled: 0
    };
    setClients([clientRecord, ...clients]);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const handleAddEmployee = (newEmp: Omit<Employee, 'id' | 'status' | 'joiningDate' | 'avatar'>) => {
    const empRecord: Employee = {
      ...newEmp,
      id: `EM-${Date.now().toString().slice(-2)}`,
      status: 'Present',
      joiningDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    };
    setEmployees([empRecord, ...employees]);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    setEmployees(employees.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
  };

  const handleApproveLeave = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaves(leaves.map(lv => lv.id === id ? { ...lv, status } : lv));
  };

  const handleApplyLeave = (newLeave: Omit<Leave, 'id' | 'status'>) => {
    const leaveRecord: Leave = {
      ...newLeave,
      id: `LV-${Date.now().toString().slice(-3)}`,
      status: 'Pending'
    };
    setLeaves([leaveRecord, ...leaves]);
  };

  const handleAddTask = (newTask: { projectId: string; title: string; assignedTo: string; priority: 'High' | 'Medium' | 'Low'; dueDate: string }) => {
    const project = projects.find(p => p.id === newTask.projectId);
    const taskRecord: Task = {
      ...newTask,
      id: `TSK-${Date.now().toString().slice(-3)}`,
      projectName: project ? project.name : 'Unknown Project',
      status: 'To Do'
    };
    setTasks([taskRecord, ...tasks]);
  };

  const handleToggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'To Do' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleAddExpense = (newExp: Omit<Expense, 'id' | 'status' | 'purchaseDate'>) => {
    const expRecord: Expense = {
      ...newExp,
      id: `EXP-${Date.now().toString().slice(-3)}`,
      status: 'Pending',
      purchaseDate: new Date().toISOString().split('T')[0]
    };
    setExpenses([expRecord, ...expenses]);
  };

  const handleApproveExpense = (id: string, status: 'Approved' | 'Rejected') => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, status } : exp));
  };

  const handlePayInvoice = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
  };

  const handleAddLocalInvoice = (newInv: Invoice) => {
    setInvoices(prev => {
      const exists = prev.some(i => i.id === newInv.id);
      if (exists) {
        return prev.map(i => i.id === newInv.id ? newInv : i);
      }
      return [newInv, ...prev];
    });
  };

  const handleAddTicket = (newTicket: { subject: string; priority: 'Urgent' | 'High' | 'Medium' | 'Low'; assignedTo: string }) => {
    const tick: Ticket = {
      ...newTicket,
      id: `TC-${Date.now().toString().slice(-3)}`,
      raisedBy: 'Frederique Borer',
      status: 'Open',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setTickets([tick, ...tickets]);
  };

  const handleResolveTicket = (id: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
  };

  const handleAddWebhook = (newWh: Omit<Webhook, 'id' | 'status'>) => {
    const wh: Webhook = {
      ...newWh,
      id: `WH-${Date.now().toString().slice(-2)}`,
      status: 'Active'
    };
    setWebhooks([wh, ...webhooks]);
  };

  const handleTriggerWebhook = (id: string) => {
    const wh = webhooks.find(w => w.id === id);
    if (!wh) return;
    
    // Create new delivery log
    const log = {
      id: `WHL-${Date.now().toString().slice(-3)}`,
      webhookName: wh.name,
      event: wh.event,
      timestamp: new Date().toLocaleString(),
      responseCode: 200
    };
    setWebhookLogs([log, ...webhookLogs]);
    alert(`Payload simulation triggered successfully!\nDelivered event "${wh.event}" to target URL.`);
  };

  // Header quick add trigger
  const handleQuickCreateTrigger = (type: 'task' | 'lead' | 'client' | 'ticket' | 'expense') => {
    if (type === 'task') {
      setCurrentTab('tasks');
    } else if (type === 'lead') {
      setCurrentTab('leads');
    } else if (type === 'client') {
      setCurrentTab('clients');
    } else if (type === 'ticket') {
      setCurrentTab('tickets');
    } else if (type === 'expense') {
      setCurrentTab('expenses');
    }
  };

  if (userRole === null) {
    return (
      <Login 
        onLogin={(role) => {
          setUserRole(role);
          setCurrentTab('dashboard');
        }} 
      />
    );
  }

  if (currentTab === 'recruit-career') {
    return (
      <CareerSite 
        jobs={jobs} 
        onAddApplication={(app) => setApplications(prev => [app, ...prev])}
        onAddCandidate={handleAddCandidate}
        onBack={() => setCurrentTab('recruit-dashboard')} 
      />
    );
  }

  return (
    <div 
      id="saas-portal" 
      className={`flex h-screen bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden select-none app-font-size-${appFontSize}`}
    >
      {/* 1. Global Navigation Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        isMobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        userRole={userRole}
        onLogout={() => setUserRole(null)}
        onOpenMobileApp={() => setShowMobileModal(true)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Control Bar */}
        <Header 
          onQuickCreate={handleQuickCreateTrigger}
          activeTimer={activeTimer}
          onStopTimer={handleStopTimer}
          onClockIn={handleClockIn}
          isClockedIn={isClockedIn}
          clockInTime={clockInTime}
          onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          userRole={userRole}
          onLogout={() => setUserRole(null)}
          onNavigate={setCurrentTab}
          appFontSize={appFontSize}
          onChangeFontSize={handleSetFontSize}
        />

        {/* Scrollable Workspace Stage */}
        <main 
          id="workspace-stage" 
          className={`flex-1 p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 ${
            currentTab === 'settings' ? 'md:overflow-hidden md:flex md:flex-col' : 'overflow-y-auto'
          }`}
        >
          
          {/* Executive Main dashboard */}
          {['dashboard', 'dashboard-private', 'dashboard-advanced'].includes(currentTab) && (
            <DashboardTab 
              currentTab={currentTab}
              userRole={userRole}
              isClockedIn={isClockedIn}
              clockInTime={clockInTime}
              onClockIn={handleClockIn}
              leads={leads}
              clients={clients}
              employees={employees}
              projects={projects}
              tasks={tasks}
              invoices={invoices}
              tickets={tickets}
              notices={notices}
              onNavigate={setCurrentTab}
            />
          )}

          {/* CRM Tab router */}
          {['leads', 'deals', 'clients', 'contracts'].includes(currentTab) && (
            <CRMTab 
              subTab={currentTab}
              leads={leads}
              clients={clients}
              onAddLead={handleAddLead}
              onDeleteLead={handleDeleteLead}
              onAddClient={handleAddClient}
              onDeleteClient={handleDeleteClient}
            />
          )}

          {/* HR Tab router */}
          {['employees', 'leaves', 'shift-roster', 'attendance', 'designations', 'departments', 'holidays', 'appreciations'].includes(currentTab) && (
            <HRTab 
              subTab={currentTab}
              employees={employees}
              leaves={leaves}
              onApproveLeave={handleApproveLeave}
              onAddEmployee={handleAddEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onApplyLeave={handleApplyLeave}
            />
          )}

          {/* Work Task & Projects router */}
          {['projects', 'tasks', 'timesheet', 'roadmap'].includes(currentTab) && (
            <ProjectsTab 
              subTab={currentTab}
              projects={projects}
              tasks={tasks}
              activeTimer={activeTimer}
              onStartTimer={handleStartTimer}
              onStopTimer={handleStopTimer}
              onAddTask={handleAddTask}
              onToggleTaskComplete={handleToggleTaskComplete}
            />
          )}

          {/* Finance Accounts and ledger router */}
          {['proposals', 'estimates', 'invoices', 'payments', 'creditnotes', 'expenses', 'bankaccounts', 'orders', 'vendors'].includes(currentTab) && (
            <FinanceTab 
              subTab={currentTab}
              invoices={invoices}
              expenses={expenses}
              clients={clients}
              projects={projects}
              employees={employees}
              onAddExpense={handleAddExpense}
              onApproveExpense={handleApproveExpense}
              onPayInvoice={handlePayInvoice}
              onAddLocalInvoice={handleAddLocalInvoice}
            />
          )}

          {/* Helpdesk and support channels */}
          {['calendar', 'tickets', 'events', 'messages', 'notices', 'knowledgebase', 'assets', 'biolinks', 'qrcode'].includes(currentTab) && (
            <MiscTab 
              subTab={currentTab}
              tickets={tickets}
              notices={notices}
              onAddTicket={handleAddTicket}
              onResolveTicket={handleResolveTicket}
              clients={clients}
              projects={projects}
              employees={employees}
            />
          )}

          {/* Biometrics & Hardware logs simulation */}
          {['bio-devices', 'bio-logs', 'bio-mapping', 'bio-commands'].includes(currentTab) && (
            <BiometricTab 
              subTab={currentTab}
            />
          )}

          {/* Letter Module tabs */}
          {['letter-templates', 'letter-generator'].includes(currentTab) && (
            <LetterTab 
              subTab={currentTab}
            />
          )}

          {/* Payroll Module tabs */}
          {['payroll', 'payroll-salary', 'payroll-expenses', 'payroll-overtime', 'payroll-reports'].includes(currentTab) && (
            <PayrollTab 
              subTab={currentTab}
            />
          )}

          {/* Performance Module tabs */}
          {['perf-dashboard', 'perf-objectives', 'perf-scoring', 'perf-meetings'].includes(currentTab) && (
            <PerformanceTab 
              subTab={currentTab}
            />
          )}

          {/* Purchase Module tabs */}
          {['purchase-vendors', 'purchase-products', 'purchase-orders', 'purchase-bills', 'purchase-payments', 'purchase-credits', 'purchase-inventory', 'purchase-reports'].includes(currentTab) && (
            <PurchaseTab 
              subTab={currentTab}
            />
          )}

          {/* Recruitment portal & Hosting webhooks router */}
          {['recruit-dashboard', 'recruit-jobs', 'recruit-applications', 'recruit-database', 'recruit-interviews', 'recruit-offers', 'recruit-skills', 'recruit-reports', 'server-manager', 'server-hostings', 'server-domains', 'server-providers', 'server-nodes', 'server-logs', 'webhooks', 'webhook-keys', 'webhook-logs'].includes(currentTab) && (
            <ATSAndSystemsTab 
              subTab={currentTab}
              jobs={jobs}
              onAddJob={(job) => setJobs(prev => [job, ...prev])}
              onDeleteJob={(id) => setJobs(prev => prev.filter(j => j.id !== id))}
              applications={applications}
              onAddApplication={(app) => setApplications(prev => [app, ...prev])}
              onDeleteApplication={(id) => setApplications(prev => prev.filter(a => a.id !== id))}
              interviews={interviews}
              onAddInterview={(interview) => setInterviews(prev => [interview, ...prev])}
              onDeleteInterview={(id) => setInterviews(prev => prev.filter(i => i.id !== id))}
              candidates={candidates}
              onAddCandidate={handleAddCandidate}
              onDeleteCandidate={(name) => setCandidates(prev => prev.filter(c => c.name !== name))}
              skillsList={skillsList}
              onAddSkill={handleAddSkill}
              onDeleteSkill={(skill) => setSkillsList(prev => prev.filter(s => s !== skill))}
              offerLetters={offerLetters}
              onAddOffer={handleAddOffer}
              onDeleteOffer={(cand) => setOfferLetters(prev => prev.filter(o => o.candidate !== cand))}
              servers={servers}
              webhooks={webhooks}
              webhookLogs={webhookLogs}
              onTriggerWebhook={handleTriggerWebhook}
              onAddWebhook={handleAddWebhook}
            />
          )}

          {/* Reports Module tabs */}
          {['report-task', 'report-time', 'report-weekly-timesheet', 'report-finance', 'report-income-expense', 'report-leave', 'report-attendance', 'report-expense', 'report-deal', 'report-sales'].includes(currentTab) && (
            <ReportsTab subTab={currentTab} />
          )}

          {/* Settings configurations tab */}
          {currentTab === 'settings' && (
            <SettingsTab 
              onSaveSettings={(config) => {
                alert(`Company settings secured: ${config.name}`);
              }}
              appFontSize={appFontSize}
              onChangeFontSize={handleSetFontSize}
              selectedSubTab={selectedSettingSubTab}
              onChangeSubTab={setSelectedSettingSubTab}
            />
          )}

        </main>
      </div>
      <MobileAppModal 
        isOpen={showMobileModal} 
        onClose={() => setShowMobileModal(false)} 
      />
    </div>
  );
}
