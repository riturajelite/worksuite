/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip
} from 'recharts';
import { 
  Search, Filter, Download, ChevronLeft, ChevronRight, FileSpreadsheet, 
  Printer, Copy, FileDown, CheckCircle, Clock, AlertCircle, Calendar, RefreshCw
} from 'lucide-react';
import { MOCK_TASK_REPORTS, EMPLOYEES, PROJECTS, TaskReportItem } from './mockReportsData';

export default function TaskReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [duration, setDuration] = useState('This Month');
  const [sortField, setSortField] = useState<keyof TaskReportItem>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Trigger loading skeleton on filter updates for high realism
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [selectedProject, selectedEmployee, selectedStatus, duration, searchTerm]);

  // Handle Toast notification
  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleSort = (field: keyof TaskReportItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = (type: string) => {
    triggerToast(`Exporting Task Report as ${type.toUpperCase()}...`);
  };

  // Filter Data
  const filteredData = MOCK_TASK_REPORTS.filter(item => {
    const matchesSearch = item.task.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'All' || item.project === selectedProject;
    const matchesEmployee = selectedEmployee === 'All' || item.assignedTo === selectedEmployee;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    
    // Simple duration simulation
    let matchesDuration = true;
    if (duration === 'Today') {
      matchesDuration = item.startDate === '2026-07-06' || item.dueDate === '2026-07-06';
    } else if (duration === 'This Week') {
      matchesDuration = item.startDate >= '2026-07-01';
    }
    
    return matchesSearch && matchesProject && matchesEmployee && matchesStatus && matchesDuration;
  });

  // Sort Data
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Status metrics
  const totalTasks = filteredData.length;
  const completedTasks = filteredData.filter(t => t.status === 'Completed').length;
  const inProgressTasks = filteredData.filter(t => t.status === 'In Progress').length;
  const reviewTasks = filteredData.filter(t => t.status === 'Review').length;

  // Chart data 1: Status Distribution
  const chartDataStatus = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' },
    { name: 'Review', value: reviewTasks, color: '#f59e0b' },
    { name: 'To Do', value: filteredData.filter(t => t.status === 'To Do').length, color: '#6366f1' },
  ].filter(c => c.value > 0);

  // Chart data 2: Task allocation per Employee
  const employeeAllocations: Record<string, { completed: number, active: number }> = {};
  filteredData.forEach(task => {
    if (!employeeAllocations[task.assignedTo]) {
      employeeAllocations[task.assignedTo] = { completed: 0, active: 0 };
    }
    if (task.status === 'Completed') {
      employeeAllocations[task.assignedTo].completed += 1;
    } else {
      employeeAllocations[task.assignedTo].active += 1;
    }
  });

  const chartDataEmployees = Object.entries(employeeAllocations).map(([name, counts]) => ({
    name: name.split(' ')[0], // short name
    completed: counts.completed,
    active: counts.active,
  }));

  return (
    <div className="space-y-4 animate-fade-in text-slate-800">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl z-50 flex items-center gap-2 border border-slate-700"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="font-semibold">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Task Report</h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reports &gt; Task Report</p>
        </div>
        
        {/* Export Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button 
            onClick={() => handleExport('copy')}
            className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5 text-slate-500" />
            <span>Copy</span>
          </button>
          <button 
            onClick={() => handleExport('csv')}
            className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>
          <button 
            onClick={() => handleExport('excel')}
            className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileDown className="h-3.5 w-3.5 text-blue-600" />
            <span>Excel</span>
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileDown className="h-3.5 w-3.5 text-rose-600" />
            <span>PDF</span>
          </button>
          <button 
            onClick={() => handleExport('print')}
            className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-slate-600" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-semibold">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Duration
          </label>
          <select 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="This Month">This Month</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="All Time">All Time</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project</label>
          <select 
            value={selectedProject} 
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Projects</option>
            {PROJECTS.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee</label>
          <select 
            value={selectedEmployee} 
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Employees</option>
            {EMPLOYEES.map(e => (
              <option key={e.id} value={e.name}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Pending Review</option>
            <option value="To Do">To Do</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Tasks</p>
            <h3 className="text-xl font-black text-slate-900">{totalTasks}</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <RefreshCw className="h-5 w-5 animate-spin-slow" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Completed Tasks</p>
            <h3 className="text-xl font-black text-emerald-600">{completedTasks}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-xl font-black text-blue-600">{inProgressTasks}</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pending Review</p>
            <h3 className="text-xl font-black text-amber-600">{reviewTasks}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pie status chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs lg:col-span-4 flex flex-col justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
            Task Status Distribution
          </h3>
          <div className="h-56">
            {chartDataStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={chartDataStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartDataStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Tasks`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No status distribution data</div>
            )}
          </div>
        </div>

        {/* Bar member chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs lg:col-span-8">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
            Employee Task Workload
          </h3>
          <div className="h-56">
            {chartDataEmployees.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataEmployees} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Bar dataKey="completed" name="Completed Tasks" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="active" name="Active Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No workload data</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search tasks by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-400 font-semibold"
            />
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Showing <span className="text-slate-700">{Math.min(startIndex + 1, totalItems)}-{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-indigo-600">{totalItems}</span> Tasks
          </div>
        </div>

        {loading ? (
          /* Skeleton Loader */
          <div className="p-6 space-y-4">
            <div className="h-8 bg-slate-100 animate-pulse rounded-md" />
            <div className="h-20 bg-slate-50 animate-pulse rounded-md" />
            <div className="h-20 bg-slate-50 animate-pulse rounded-md" />
            <div className="h-12 bg-slate-100 animate-pulse rounded-md" />
          </div>
        ) : paginatedData.length > 0 ? (
          /* Table Stage */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[9px] uppercase font-extrabold tracking-wider select-none">
                  <th onClick={() => handleSort('id')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Task ID</th>
                  <th onClick={() => handleSort('task')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Task Title</th>
                  <th onClick={() => handleSort('project')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Associated Project</th>
                  <th onClick={() => handleSort('assignedTo')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Assignee</th>
                  <th onClick={() => handleSort('startDate')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Start Date</th>
                  <th onClick={() => handleSort('dueDate')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Due Date</th>
                  <th onClick={() => handleSort('status')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.id}</td>
                    <td className="px-5 py-3.5 font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors max-w-xs truncate">{item.task}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-500 max-w-xs truncate">{item.project}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        {item.assignedAvatar && (
                          <img src={item.assignedAvatar} alt={item.assignedTo} className="w-5 h-5 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                        )}
                        <span>{item.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[10px] text-slate-400 font-semibold">{item.startDate}</td>
                    <td className="px-5 py-3.5 font-mono text-[10px] text-slate-400 font-semibold">{item.dueDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        item.status === 'Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-16 text-center">
            <p className="text-sm font-semibold text-slate-400 italic">No tasks matched your exact filters.</p>
            <button 
              onClick={() => {
                setSelectedProject('All');
                setSelectedEmployee('All');
                setSelectedStatus('All');
                setSearchTerm('');
              }}
              className="mt-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Stage */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-500">Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
