/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts';
import { 
  Search, Download, ChevronLeft, ChevronRight, FileSpreadsheet, 
  Printer, Copy, FileDown, Clock, DollarSign, Users, Briefcase
} from 'lucide-react';
import { MOCK_TIME_LOGS, EMPLOYEES, PROJECTS, TimeLogReportItem } from './mockReportsData';

export default function TimeLogReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [duration, setDuration] = useState('This Month');
  const [sortField, setSortField] = useState<keyof TimeLogReportItem>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Simulated Loader on filter
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [selectedProject, selectedEmployee, duration, searchTerm]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleSort = (field: keyof TimeLogReportItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = (type: string) => {
    triggerToast(`Exporting Time Log Report as ${type.toUpperCase()}...`);
  };

  // Filter Logic
  const filteredData = MOCK_TIME_LOGS.filter(item => {
    const matchesSearch = item.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'All' || item.project === selectedProject;
    const matchesEmployee = selectedEmployee === 'All' || item.employee === selectedEmployee;
    return matchesSearch && matchesProject && matchesEmployee;
  });

  // Sort Logic
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

  // Metrics
  const totalLoggedHours = filteredData.reduce((sum, item) => sum + item.hours, 0);
  const totalLoggedEarnings = filteredData.reduce((sum, item) => sum + item.earnings, 0);
  const activeLogsCount = filteredData.length;

  // Chart data: Employee Hours Logged
  const chartData: Record<string, number> = {};
  filteredData.forEach(item => {
    chartData[item.employee] = (chartData[item.employee] || 0) + item.hours;
  });
  const formattedChartData = Object.entries(chartData).map(([name, hours]) => ({
    name: name.split(' ')[0],
    hours: parseFloat(hours.toFixed(1)),
  }));

  return (
    <div className="space-y-4 animate-fade-in text-slate-800">
      
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl z-50 flex items-center gap-2 border border-slate-700"
          >
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span className="font-semibold">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Time Log Report</h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reports &gt; Time Log Report</p>
        </div>
        
        {/* Export Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => handleExport('copy')} className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Copy className="h-3.5 w-3.5 text-slate-500" />
            <span>Copy</span>
          </button>
          <button onClick={() => handleExport('csv')} className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>
          <button onClick={() => handleExport('excel')} className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
            <FileDown className="h-3.5 w-3.5 text-blue-600" />
            <span>Excel</span>
          </button>
          <button onClick={() => handleExport('pdf')} className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
            <FileDown className="h-3.5 w-3.5 text-rose-600" />
            <span>PDF</span>
          </button>
          <button onClick={() => handleExport('print')} className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Printer className="h-3.5 w-3.5 text-slate-600" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="This Month">This Month</option>
            <option value="This Week">This Week</option>
            <option value="Today">Today</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="All">All Projects</option>
            {PROJECTS.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee</label>
          <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="All">All Employees</option>
            {EMPLOYEES.map(e => (
              <option key={e.id} value={e.name}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Logged Hours</p>
            <h3 className="text-xl font-black text-indigo-600">{totalLoggedHours.toFixed(1)} hrs</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Est. Billing</p>
            <h3 className="text-xl font-black text-emerald-600">${totalLoggedEarnings.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Logged Entries Count</p>
            <h3 className="text-xl font-black text-slate-900">{activeLogsCount} logs</h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Workload Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
          Time Spent by Employee
        </h3>
        <div className="h-60">
          {formattedChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', offset: -10, style: { fontSize: '9px', fontWeight: 'bold', fill: '#94a3b8' } }} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip formatter={(value) => [`${value} hrs`, 'Logged Time']} />
                <Bar dataKey="hours" name="Hours Logged" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No timesheet records available</div>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search time logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-400 font-semibold"
            />
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Showing <span className="text-slate-700">{Math.min(startIndex + 1, totalItems)}-{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-indigo-600">{totalItems}</span> Entries
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            <div className="h-8 bg-slate-100 animate-pulse rounded-md" />
            <div className="h-16 bg-slate-50 animate-pulse rounded-md" />
            <div className="h-16 bg-slate-50 animate-pulse rounded-md" />
          </div>
        ) : paginatedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[9px] uppercase font-extrabold tracking-wider select-none">
                  <th onClick={() => handleSort('date')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Log Date</th>
                  <th onClick={() => handleSort('employee')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Employee</th>
                  <th onClick={() => handleSort('project')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Project Name</th>
                  <th onClick={() => handleSort('task')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Task Detail</th>
                  <th onClick={() => handleSort('hours')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Logged Hours</th>
                  <th onClick={() => handleSort('earnings')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Estimated Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[10px] text-slate-500 font-bold">{item.date}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{item.employee}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-400 max-w-xs truncate">{item.project}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700 max-w-xs truncate">{item.task}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-black text-indigo-600 text-right">{item.hours.toFixed(1)} hrs</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-black text-emerald-600 text-right">${item.earnings.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 italic">No log entries matched your parameters.</div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-500">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
