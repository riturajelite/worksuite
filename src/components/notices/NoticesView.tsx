import React, { useState, useRef } from 'react';
import { 
  Clipboard, Search, Plus, Download, ChevronLeft, ChevronRight, 
  Eye, MoreVertical, Trash2, X, Users, Radio, ArrowLeft, 
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, 
  Link2, Paperclip, CheckSquare, Square, Edit2, ShieldAlert
} from 'lucide-react';
import { Notice, Employee, Client } from '../../types';

interface ExtendedNotice extends Notice {
  target: 'Employees' | 'Clients' | 'All';
  assignedEmployees?: string[];
  attachments?: { name: string; size: string }[];
  status?: string;
  excerpt?: string;
}

interface NoticesViewProps {
  initialNotices: Notice[];
  employees: Employee[];
  clients: Client[];
}

const INITIAL_EXTENDED_NOTICES: ExtendedNotice[] = [
  {
    id: '1',
    title: 'Deployment & SSH Handshake Key Rotation guidelines',
    content: 'All engineers must rotate corporate deployment keys by the end of July 2026. Please coordinate key registrations inside the Biometric devices mapper console.',
    department: 'Engineering',
    date: '2026-07-04',
    target: 'Employees',
    assignedEmployees: ['Elena Rostova', 'Daniel Park'],
    attachments: [{ name: 'ssh_key_reg_policy.pdf', size: '240 KB' }],
    excerpt: 'Key registrations inside Biometric devices mapper console.'
  },
  {
    id: '2',
    title: 'Independence Day Holiday Schedule announcement',
    content: 'Our support teams will operate on a rotating roster schedule on July 4th. Critical database endpoints will be actively monitored via automated webhooks alerting portals.',
    department: 'Operations',
    date: '2026-07-03',
    target: 'All',
    assignedEmployees: [],
    attachments: [],
    excerpt: 'Support teams rotating roster schedule.'
  },
  {
    id: '3',
    title: 'Client Portal secure invoice payments upgrade complete',
    content: 'We migrated the Stripe checkout proxy server onto the isolated Docker network container. All clients can securely authorize payment entries with zero exposure of secrets.',
    department: 'Finance',
    date: '2026-07-02',
    target: 'Clients',
    assignedEmployees: [],
    attachments: [{ name: 'checkout_migration_v2.docx', size: '1.2 MB' }],
    excerpt: 'Stripe checkout proxy server migrated.'
  }
];

export default function NoticesView({ initialNotices, employees, clients }: NoticesViewProps) {
  const [notices, setNotices] = useState<ExtendedNotice[]>(() => {
    // Merge or fallback to INITIAL_EXTENDED_NOTICES
    return INITIAL_EXTENDED_NOTICES;
  });

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [durationFilter, setDurationFilter] = useState('all'); // all, today, week, month

  // Table pagination & items selector
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<number[]>([]);

  // Navigation states: 'list' | 'add' | 'view'
  const [currentView, setCurrentView] = useState<'list' | 'add'>('list');
  const [viewingNotice, setViewingNotice] = useState<ExtendedNotice | null>(null);

  // Add Notice Form State
  const [targetType, setTargetType] = useState<'Employees' | 'Clients'>('Employees');
  const [noticeHeading, setNoticeHeading] = useState('');
  const [noticeDept, setNoticeDept] = useState('Engineering');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [noticeContent, setNoticeContent] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);

  // Toolbar state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // File drag & drop state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtering Notices
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(search.toLowerCase()) || 
                          notice.content.toLowerCase().includes(search.toLowerCase()) ||
                          notice.department.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Date filters
    if (startDate && notice.date < startDate) return false;
    if (endDate && notice.date > endDate) return false;

    // Duration quick tags
    if (durationFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const limitString = oneWeekAgo.toISOString().split('T')[0];
      if (notice.date < limitString) return false;
    } else if (durationFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const limitString = oneMonthAgo.toISOString().split('T')[0];
      if (notice.date < limitString) return false;
    }

    return true;
  });

  // Pagination bounds
  const totalEntries = filteredNotices.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + entriesPerPage);

  // Select Checkboxes
  const handleToggleSelectAll = () => {
    if (selectedNoticeIds.length === paginatedNotices.length) {
      setSelectedNoticeIds([]);
    } else {
      setSelectedNoticeIds(paginatedNotices.map(n => n.id));
    }
  };

  const handleToggleSelectRow = (id: number) => {
    if (selectedNoticeIds.includes(id)) {
      setSelectedNoticeIds(prev => prev.filter(rowId => rowId !== id));
    } else {
      setSelectedNoticeIds(prev => [...prev, id]);
    }
  };

  // Drag & drop file upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).map((file: any) => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`
      }));
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).map((file: any) => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`
      }));
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeHeading.trim() || !noticeContent.trim()) return;

    const newNotice: ExtendedNotice = {
      id: String(notices.length + 1),
      title: noticeHeading,
      content: noticeContent,
      department: noticeDept,
      date: new Date().toISOString().split('T')[0],
      target: targetType,
      assignedEmployees: targetType === 'Employees' ? selectedEmployees : [],
      attachments: attachedFiles,
      excerpt: noticeContent.slice(0, 80) + '...'
    };

    setNotices([newNotice, ...notices]);
    
    // Reset Form
    setNoticeHeading('');
    setNoticeContent('');
    setSelectedEmployees([]);
    setAttachedFiles([]);
    setCurrentView('list');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Notice ID,Heading,Department,Date,Target Audience"].join(",") + "\n"
      + filteredNotices.map(n => `"${n.id}","${n.title}","${n.department}","${n.date}","${n.target}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Notice_Board_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteNotice = (id: number) => {
    if (confirm("Are you sure you want to delete this notice broadcast?")) {
      setNotices(prev => prev.filter(n => n.id !== id));
      setSelectedNoticeIds(prev => prev.filter(rowId => rowId !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. BROADCAST LISTING VIEW */}
      {currentView === 'list' && (
        <div className="space-y-6">
          {/* Filters Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-indigo-600" />
                  <span>Notice Board Broadcasts</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Publish important circulars, guidelines, and compliance advisories.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-export-notices"
                  onClick={handleExportCSV}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </button>
                <button
                  id="btn-add-notice"
                  onClick={() => setCurrentView('add')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Notice</span>
                </button>
              </div>
            </div>

            {/* Sub-Filters: Duration, Dates, Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              {/* Duration filter selector */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Duration filter</label>
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="all">All Dates</option>
                  <option value="week">Past 7 Days</option>
                  <option value="month">Past 30 Days</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-1.5 rounded-xl border border-slate-200 focus:outline-none font-mono"
                />
              </div>

              {/* End Date */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-1.5 rounded-xl border border-slate-200 focus:outline-none font-mono"
                />
              </div>

              {/* Search Bar */}
              <div className="md:col-span-6 relative self-end">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notices by title, content, or department..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-4 w-12">
                      <button 
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {selectedNoticeIds.length === paginatedNotices.length && paginatedNotices.length > 0 ? (
                          <CheckSquare className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4">Notice Title</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Published Date</th>
                    <th className="px-6 py-4">To (Target)</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedNotices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <Clipboard className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-bold">No Records Found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedNotices.map(notice => (
                      <tr key={notice.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectRow(notice.id)}
                            className="text-slate-400 hover:text-indigo-600"
                          >
                            {selectedNoticeIds.includes(notice.id) ? (
                              <CheckSquare className="h-4 w-4 text-indigo-600" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">{notice.title}</h4>
                            <p className="text-[11px] text-slate-400 truncate max-w-[280px] font-medium">{notice.excerpt || notice.content}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                            {notice.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-500">{notice.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            notice.target === 'Employees' ? 'bg-indigo-50 text-indigo-700' :
                            notice.target === 'Clients' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {notice.target}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            <button
                              id={`btn-view-notice-${notice.id}`}
                              onClick={() => setViewingNotice(notice)}
                              className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View</span>
                            </button>
                            <button
                              id={`btn-delete-notice-${notice.id}`}
                              onClick={() => handleDeleteNotice(notice.id)}
                              className="text-[10px] text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                              title="Delete announcement"
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

            {/* Pagination footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg text-xs p-1 font-bold text-slate-700 focus:outline-none"
                >
                  <option value="5">5 entries</option>
                  <option value="10">10 entries</option>
                  <option value="25">25 entries</option>
                  <option value="50">50 entries</option>
                </select>
                <span className="text-xs text-slate-500 font-medium">
                  showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} records
                </span>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-600 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        currentPage === i + 1 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-600 transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD BROADCAST ANNOUNCEMENT PAGE */}
      {currentView === 'add' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentView('list')}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div>
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  Compose Broadcast Announcement
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Broadcast legal regulatory directives or local department logs.</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('list')}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              Back to board
            </button>
          </div>

          <form onSubmit={handleSaveNotice} className="space-y-4">
            {/* Target Radio Buttons Selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Target Audience</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700 select-none">
                  <input
                    type="radio"
                    name="targetAudience"
                    checked={targetType === 'Employees'}
                    onChange={() => setTargetType('Employees')}
                    className="accent-indigo-600 h-4 w-4"
                  />
                  <span>Internal Staff / Employees</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700 select-none">
                  <input
                    type="radio"
                    name="targetAudience"
                    checked={targetType === 'Clients'}
                    onChange={() => setTargetType('Clients')}
                    className="accent-indigo-600 h-4 w-4"
                  />
                  <span>External Partners / Clients</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Notice Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Notice Heading</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Server Migrations, Holiday Calendars..."
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  value={noticeHeading}
                  onChange={(e) => setNoticeHeading(e.target.value)}
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Department</label>
                <select
                  value={noticeDept}
                  onChange={(e) => setNoticeDept(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="Engineering">Engineering / Dev</option>
                  <option value="Operations">Operations Space</option>
                  <option value="Finance">Finance / Ledger</option>
                  <option value="Legal & HR">Legal & HR Team</option>
                </select>
              </div>
            </div>

            {/* Employee Selector Multi-Select (visible if Employees selected) */}
            {targetType === 'Employees' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Select Recipients (Leave empty for All)</label>
                <div className="border border-slate-200 rounded-xl p-3 max-h-36 overflow-y-auto bg-slate-50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {employees.map(emp => (
                    <label key={emp.id} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEmployees(prev => [...prev, emp.name]);
                          } else {
                            setSelectedEmployees(prev => prev.filter(name => name !== emp.name));
                          }
                        }}
                        className="accent-indigo-600 rounded"
                      />
                      <span>{emp.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Rich Text Editor Workspace */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Description (HTML Editor)</label>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                {/* Editor Toolbar matching screenshots */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border-b border-slate-200 text-slate-500">
                  <button
                    type="button"
                    onClick={() => setIsBold(!isBold)}
                    className={`p-1.5 rounded hover:bg-slate-100 ${isBold ? 'bg-indigo-50 text-indigo-600' : ''}`}
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsItalic(!isItalic)}
                    className={`p-1.5 rounded hover:bg-slate-100 ${isItalic ? 'bg-indigo-50 text-indigo-600' : ''}`}
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUnderline(!isUnderline)}
                    className={`p-1.5 rounded hover:bg-slate-100 ${isUnderline ? 'bg-indigo-50 text-indigo-600' : ''}`}
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-slate-100"><List className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-100"><ListOrdered className="h-3.5 w-3.5" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-100"><AlignLeft className="h-3.5 w-3.5" /></button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-slate-100"><Link2 className="h-3.5 w-3.5" /></button>
                </div>
                {/* Editable Text Area */}
                <textarea
                  rows={6}
                  required
                  placeholder="Provide precise regulatory or compliance instruction bulletins..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-xs p-3.5 focus:outline-none resize-none font-medium leading-relaxed"
                />
              </div>
            </div>

            {/* Upload Area styled exactly like screenshots */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Attachments Upload</label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50/20' 
                    : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <Paperclip className="h-7 w-7 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Drag and Drop attachments or browse your local file system</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, ZIP files supported. Size limit 25MB.</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />
              </div>

              {/* Uploaded File Badges */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 pl-2.5 pr-1 py-1 rounded-lg text-[10px] font-mono">
                      <Paperclip className="h-3 w-3 text-slate-400" />
                      <span className="font-bold text-slate-700 truncate max-w-[150px]">{file.name}</span>
                      <span className="text-slate-400">({file.size})</span>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="p-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors"
              >
                Save Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. NOTICE VIEW MODAL */}
      {viewingNotice && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-4 mx-4">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                  {viewingNotice.department} Broadcast
                </span>
                <h3 className="text-sm font-black text-slate-900 leading-snug pt-1">
                  {viewingNotice.title}
                </h3>
              </div>
              <button 
                onClick={() => setViewingNotice(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Meta Tags */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-medium">
              <div>
                <span className="text-slate-400">Target Users:</span>{' '}
                <span className="font-bold text-slate-800">{viewingNotice.target}</span>
              </div>
              <div>
                <span className="text-slate-400">Created Date:</span>{' '}
                <span className="font-bold font-mono text-slate-800">{viewingNotice.date}</span>
              </div>
              {viewingNotice.assignedEmployees && viewingNotice.assignedEmployees.length > 0 && (
                <div className="col-span-2">
                  <span className="text-slate-400">Explicit Recipients:</span>{' '}
                  <span className="font-bold text-indigo-700">{viewingNotice.assignedEmployees.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Description Text */}
            <div className="text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-medium p-1">
              {viewingNotice.content}
            </div>

            {/* Attachments Section */}
            {viewingNotice.attachments && viewingNotice.attachments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Published Attachments</h5>
                <div className="flex flex-col gap-1.5">
                  {viewingNotice.attachments.map((file, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => alert(`Downloading attachment: ${file.name}`)}
                      className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 hover:border-indigo-400 rounded-xl cursor-pointer text-[11px] font-mono hover:bg-indigo-50/20 transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-700 truncate">{file.name}</span>
                      </div>
                      <span className="text-indigo-600 font-bold shrink-0">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingNotice(null)}
                className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
