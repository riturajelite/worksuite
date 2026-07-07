/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Headphones, Plus, Search, Filter, ArrowUpDown, Download, 
  Trash2, CheckCircle, Clock, Eye, X, User, Users, Landmark, 
  HelpCircle, ChevronLeft, ChevronRight, Settings, Sliders, 
  Code, Clipboard, FileText, ChevronDown, Check, GripVertical, AlertCircle
} from 'lucide-react';
import { Client, Project, Employee, Ticket as SupportTicket } from '../../types';

interface TicketsViewProps {
  clients: Client[];
  projects: Project[];
  employees: Employee[];
  initialTickets: SupportTicket[];
  onAddTicket: (ticket: any) => void;
  onResolveTicket: (id: string) => void;
}

export default function TicketsView({ 
  clients, 
  projects, 
  employees, 
  initialTickets,
  onAddTicket,
  onResolveTicket
}: TicketsViewProps) {
  // --- VIEWS ---
  const [view, setView] = useState<'list' | 'create' | 'builder'>('list');

  // --- LOCAL STATE ---
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-201',
      subject: 'Container runtime ingress handshake timed out',
      raisedBy: 'Tyrell Corp',
      assignedTo: 'Zara Khan',
      priority: 'Urgent',
      status: 'Open',
      createdDate: '2026-07-01'
    },
    {
      id: 'TCK-202',
      subject: 'Biometric fingerprint reader failing to sync logs',
      raisedBy: 'Wayne Enterprises',
      assignedTo: 'Elena Rostova',
      priority: 'High',
      status: 'In Progress',
      createdDate: '2026-06-29'
    },
    {
      id: 'TCK-203',
      subject: 'Invoices Issued PDF downloader layout shifting',
      raisedBy: 'Cyberdyne Systems',
      assignedTo: 'John Doe',
      priority: 'Medium',
      status: 'Resolved',
      createdDate: '2026-06-25'
    },
    {
      id: 'TCK-204',
      subject: 'Kubernetes nodes are experiencing excessive CPU spikes',
      raisedBy: 'Daniel Park',
      assignedTo: 'Zara Khan',
      priority: 'Low',
      status: 'Closed',
      createdDate: '2026-06-20'
    }
  ]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Stats calculation
  const totalTickets = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
  const closedCount = tickets.filter(t => t.status === 'Closed').length;

  // --- CREATE TICKET STATE ---
  const [requesterType, setRequesterType] = useState<'Client' | 'Employee'>('Client');
  const [requesterName, setRequesterName] = useState('');
  const [contactName, setContactName] = useState('');
  const [assignGroup, setAssignGroup] = useState('Customer Support');
  const [assignedAgent, setAssignedAgent] = useState('');
  const [ticketProject, setTicketProject] = useState('');
  const [ticketType, setTicketType] = useState('Bug / Issue');
  const [ticketPriority, setTicketPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('Medium');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketFile, setTicketFile] = useState<File | null>(null);

  // --- BUILDER STATE ---
  const [builderFields, setBuilderFields] = useState([
    { id: 'name', label: 'Requester Name', required: true, enabled: true, placeholder: 'Enter your full name' },
    { id: 'email', label: 'Email Address', required: true, enabled: true, placeholder: 'Enter your corporate email' },
    { id: 'subject', label: 'Ticket Subject', required: true, enabled: true, placeholder: 'Summarize your problem' },
    { id: 'description', label: 'Description', required: false, enabled: true, placeholder: 'Provide detailed context' },
    { id: 'type', label: 'Issue Type', required: false, enabled: true, placeholder: 'Pick category' },
    { id: 'priority', label: 'Priority / Severity', required: false, enabled: true, placeholder: 'Pick severity' },
    { id: 'assignGroup', label: 'Assign Group', required: false, enabled: false, placeholder: 'Routing destination' }
  ]);
  const [builderSaved, setBuilderSaved] = useState(false);

  // Add Ticket logic
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;

    const newTicket: SupportTicket = {
      id: `TCK-${200 + tickets.length + 1}`,
      subject: ticketSubject,
      raisedBy: requesterName || contactName || 'Anonymous Requester',
      assignedTo: assignedAgent || 'Elena Rostova',
      priority: ticketPriority,
      status: 'Open',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setTickets([newTicket, ...tickets]);
    
    // Also notify main app state if appropriate
    if (onAddTicket) {
      onAddTicket({
        subject: ticketSubject,
        priority: ticketPriority,
        assignedTo: assignedAgent || 'Elena Rostova'
      });
    }

    // Reset create fields
    setTicketSubject('');
    setTicketDescription('');
    setRequesterName('');
    setView('list');
  };

  const handleResolve = (id: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    if (onResolveTicket) {
      onResolveTicket(id);
    }
  };

  const handleDeleteTicket = (id: string) => {
    if (window.confirm('Delete this support ticket from database?')) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  // Export tickets CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Ticket ID,Subject,Raised By,Assigned To,Priority,Status,Created Date\n";
    tickets.forEach(t => {
      csvContent += `"${t.id}","${t.subject}","${t.raisedBy}","${t.assignedTo}","${t.priority}","${t.status}","${t.createdDate}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tickets_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Logic
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.raisedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (p: SupportTicket['priority']) => {
    switch (p) {
      case 'Urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200/60';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  const getStatusBadge = (s: SupportTicket['status']) => {
    switch (s) {
      case 'Open':
        return 'bg-rose-100 text-rose-800 font-bold';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 font-bold';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 font-bold';
      case 'Closed':
        return 'bg-slate-100 text-slate-800 font-bold';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  // Pagination bounds
  const totalEntries = filteredTickets.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const currentRecords = filteredTickets.slice(indexOfFirstRecord, indexOfLastRecord);

  // Save Builder State
  const handleSaveBuilder = () => {
    setBuilderSaved(true);
    setTimeout(() => setBuilderSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. TICKETS MAIN DASHBOARD LIST */}
      {view === 'list' && (
        <div className="space-y-6 animate-fade-in">
          {/* STATS TILES */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tickets</p>
              <p className="text-2xl font-black text-slate-900 font-mono">{totalTickets}</p>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-black text-amber-600 font-mono">{inProgressCount}</p>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Open Queue</p>
              <p className="text-2xl font-black text-rose-600 font-mono">{openCount}</p>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-black text-emerald-600 font-mono">{resolvedCount}</p>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 md:col-span-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Closed Logs</p>
              <p className="text-2xl font-black text-slate-600 font-mono">{closedCount}</p>
            </div>
          </div>

          {/* FILTERING CONTROLS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket #, subject, reporter..."
                className="w-full bg-slate-50/50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Actions Panel */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Quick status pill */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-xl text-slate-700 font-semibold focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-xl text-slate-700 font-semibold focus:outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Download className="h-4 w-4" />
                <span className="hidden md:inline">Export</span>
              </button>

              <button
                onClick={() => setView('builder')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Sliders className="h-4 w-4" />
                <span>Ticket Form Builder</span>
              </button>

              <button
                onClick={() => setView('create')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Create Ticket</span>
              </button>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider select-none">
                    <th className="px-6 py-4">Ticket #</th>
                    <th className="px-6 py-4 w-1/3">Subject</th>
                    <th className="px-6 py-4">Requester</th>
                    <th className="px-6 py-4">Requested On</th>
                    <th className="px-6 py-4">Assigned Agent</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">
                        <Headphones className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                        <p>No helpdesk tickets logged in database.</p>
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 font-mono">
                          {t.id}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 leading-snug">{t.subject}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {t.raisedBy}
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-slate-500">
                          {t.createdDate}
                        </td>
                        <td className="px-6 py-4 font-semibold text-indigo-600">
                          {t.assignedTo}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadge(t.priority)}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(t.status)}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {t.status !== 'Resolved' && t.status !== 'Closed' && (
                              <button
                                title="Mark Resolved"
                                onClick={() => handleResolve(t.id)}
                                className="p-1 bg-white hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 border border-slate-200 rounded-lg transition-all"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              title="Delete Log"
                              onClick={() => handleDeleteTicket(t.id)}
                              className="p-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLLER */}
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span>entries</span>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 border border-slate-200 rounded text-slate-500 bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        currentPage === idx + 1 ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1 border border-slate-200 rounded text-slate-500 bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <span className="font-mono text-slate-400">
                Displaying {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, totalEntries)} of {totalEntries} records
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATE TICKET PANEL */}
      {view === 'create' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Open Support Request Ticket</h3>
              <p className="text-xs text-slate-400">Raise commercial/operational inquiries or file container host failure logs.</p>
            </div>
            <button
              onClick={() => setView('list')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Requester Toggle */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requester Type</label>
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => { setRequesterType('Client'); setRequesterName(''); }}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      requesterType === 'Client' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Corporate Client
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRequesterType('Employee'); setRequesterName(''); }}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      requesterType === 'Employee' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Staff / Employee
                  </button>
                </div>
              </div>

              {/* Requester Select dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Requester Profile</label>
                <select
                  required
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                >
                  <option value="">-- Pick Requester --</option>
                  {requesterType === 'Client' 
                    ? clients.map(c => <option key={c.id} value={c.name}>{c.name} ({c.company})</option>)
                    : employees.map(e => <option key={e.id} value={e.name}>{e.name} ({e.designation})</option>)
                  }
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Assign Group */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Routing Group</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={assignGroup}
                  onChange={(e) => setAssignGroup(e.target.value)}
                >
                  <option value="Customer Support">Customer Support Desk</option>
                  <option value="DevOps & Cluster Engineering">DevOps & Cluster Engineering</option>
                  <option value="Accounting & Financials">Accounting & Financials</option>
                  <option value="Executive SLA Team">Executive SLA Team</option>
                </select>
              </div>

              {/* Agent Assignee */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned Expert Agent</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={assignedAgent}
                  onChange={(e) => setAssignedAgent(e.target.value)}
                >
                  <option value="">-- Pick Target Agent --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>

              {/* Project select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Related Project</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={ticketProject}
                  onChange={(e) => setTicketProject(e.target.value)}
                >
                  <option value="">-- No Specific Project --</option>
                  {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Inquiry Type</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                >
                  <option value="Bug / Issue">Bug / Issue</option>
                  <option value="Configuration Sync">Configuration Sync</option>
                  <option value="Billing Dispute">Billing Dispute</option>
                  <option value="SLA Escalation">SLA Escalation</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority / Severity</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as any)}
                >
                  <option value="Low">Low (General Inquiry)</option>
                  <option value="Medium">Medium (Standard)</option>
                  <option value="High">High (Service Degradation)</option>
                  <option value="Urgent">Urgent (Service Outage!)</option>
                </select>
              </div>

              {/* Contact Name input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Email / Phone</label>
                <input
                  type="text"
                  placeholder="e.g. tech@company.com"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ticket Summary / Subject</label>
              <input
                type="text"
                required
                placeholder="Briefly state the runtime error, hardware malfunction, or ledger delta..."
                className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>

            {/* Description Editor Mock */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detailed Description Logs</label>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                {/* Editor toolbar mockup */}
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-bold font-mono">
                  <span className="hover:text-slate-900 cursor-pointer">B</span>
                  <span className="hover:text-slate-900 cursor-pointer italic">I</span>
                  <span className="hover:text-slate-900 cursor-pointer underline">U</span>
                  <span className="text-slate-300">|</span>
                  <span className="hover:text-slate-900 cursor-pointer">{"</> Code"}</span>
                  <span className="hover:text-slate-900 cursor-pointer">{"List"}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-[10px] text-slate-400">SLA Secure Markdown Support Enabled</span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Paste stack traces, node container exceptions, or transaction timestamps..."
                  className="w-full bg-white p-4 text-xs font-semibold focus:outline-none text-slate-800"
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Upload Mock */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attachment Logs (Screenshots, JSON payloads)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50/50 transition-all cursor-pointer">
                <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Drag files here or tap to select from local storage</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">PNG, JPG, LOG, JSON (Max limit 12MB)</p>
              </div>
            </div>

            {/* Form submission controls */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Save Ticket Logs</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. TICKET FORM BUILDER PANEL */}
      {view === 'builder' && (
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-xs max-w-6xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-600" />
                <span>External Ticket Form Builder</span>
              </h3>
              <p className="text-xs text-slate-400">Design public-facing support forms, embed iframe codes, and manage input requirements.</p>
            </div>
            <button
              onClick={() => setView('list')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
            >
              <X className="h-4 w-4" />
              <span>Exit Builder</span>
            </button>
          </div>

          {/* Builder Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left controller sidebar (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Form Fields Configurator
              </h4>

              <div className="space-y-4">
                {builderFields.map((field, idx) => (
                  <div 
                    key={field.id} 
                    className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 group hover:border-indigo-200 hover:bg-indigo-50/10 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <GripVertical className="h-4 w-4 text-slate-300 cursor-move" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{field.label}</p>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono">{field.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Enabled Toggle */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Show</span>
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={(e) => {
                            setBuilderFields(builderFields.map((f, i) => i === idx ? { ...f, enabled: e.target.checked } : f));
                          }}
                          className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                        />
                      </div>

                      {/* Required Toggle */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Req</span>
                        <input
                          type="checkbox"
                          checked={field.required}
                          disabled={!field.enabled}
                          onChange={(e) => {
                            setBuilderFields(builderFields.map((f, i) => i === idx ? { ...f, required: e.target.checked } : f));
                          }}
                          className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer disabled:opacity-40"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setBuilderFields(builderFields.map(f => ({ ...f, enabled: true, required: f.id !== 'description' })));
                  }}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg text-center transition-all"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={handleSaveBuilder}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg text-center shadow-xs transition-all"
                >
                  Save Builder Config
                </button>
              </div>

              {builderSaved && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Config saved! Public iframe portal has reloaded.</span>
                </div>
              )}
            </div>

            {/* Right Live Preview panel (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Iframe Live Preview Mock */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-900 px-4 py-2 text-white text-[10px] font-bold tracking-widest uppercase font-mono flex justify-between items-center">
                  <span>PUBLIC HELP WINDOW PREVIEW (LIVE IFRAME)</span>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                </div>

                {/* Form rendered inside */}
                <div className="p-6 space-y-5 bg-white max-h-[450px] overflow-y-auto">
                  <div className="text-center pb-2 border-b border-slate-100 space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Submit Help Desk Ticket</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Our tech team will respond in under 4 hours.</p>
                  </div>

                  <div className="space-y-4">
                    {builderFields.filter(f => f.enabled).map(f => (
                      <div key={f.id} className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {f.label} {f.required && <span className="text-rose-500 font-bold">*</span>}
                        </label>

                        {f.id === 'description' ? (
                          <textarea
                            rows={3}
                            placeholder={f.placeholder}
                            className="w-full bg-slate-50/50 text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                            disabled
                          />
                        ) : f.id === 'type' ? (
                          <select className="w-full bg-slate-50/50 text-slate-400 text-xs p-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none" disabled>
                            <option>-- Select Category Type --</option>
                          </select>
                        ) : f.id === 'priority' ? (
                          <select className="w-full bg-slate-50/50 text-slate-400 text-xs p-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none" disabled>
                            <option>-- Select Priority Level --</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder={f.placeholder}
                            className="w-full bg-slate-50/50 text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                            disabled
                          />
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 bg-indigo-600/70 text-white text-xs font-bold rounded-xl cursor-not-allowed text-center uppercase tracking-wider"
                    >
                      Submit Ticket Inquiries
                    </button>
                  </div>
                </div>
              </div>

              {/* Embedding Instructions Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Iframe Integration Source Code</h4>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                    Embed this public widget code in your external client website, landing dashboard, or Knowledge Base portal.
                  </p>
                  
                  <div className="p-3 bg-slate-900 text-amber-400 font-mono text-[10px] rounded-xl overflow-x-auto whitespace-pre leading-normal border border-slate-950">
{`<iframe src="https://ais-dev.run.app/public/ticket-form?applet=${'cc6c2ffe'}"
  width="100%" 
  height="600px" 
  style="border:none; border-radius:16px;"
  allow="camera; microphone">
</iframe>`}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`<iframe src="https://ais-dev.run.app/public/ticket-form?applet=cc6c2ffe" width="100%" height="600px" style="border:none; border-radius:16px;"></iframe>`);
                      alert('Embed code copied onto your computer clipboard!');
                    }}
                    className="px-3.5 py-1.5 bg-indigo-550 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-150 flex items-center gap-1.5 transition-all"
                  >
                    <Clipboard className="h-4.5 w-4.5" />
                    <span>Copy Iframe Code</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('Form settings successfully synchronized with portal! External link will propagate instantly.');
                    }}
                    className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    <FileText className="h-4.5 w-4.5" />
                    <span>Deploy Form Live</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
