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
  Printer, Copy, FileDown, CheckCircle, Clock, AlertTriangle, Percent
} from 'lucide-react';
import { MOCK_ATTENDANCE_REPORT, AttendanceReportItem } from './mockReportsData';

export default function AttendanceReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [sortField, setSortField] = useState<keyof AttendanceReportItem>('attendancePercentage');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedDept, searchTerm]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleExport = (type: string) => {
    triggerToast(`Exporting Attendance Report as ${type.toUpperCase()}...`);
  };

  const handleSort = (field: keyof AttendanceReportItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter Data
  const filteredData = MOCK_ATTENDANCE_REPORT.filter(item => {
    const matchesSearch = item.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || item.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Sort Data
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Metrics calculations
  const avgAttendance = filteredData.length > 0 
    ? parseFloat((filteredData.reduce((s, i) => s + i.attendancePercentage, 0) / filteredData.length).toFixed(1))
    : 0;
  const totalPresent = filteredData.reduce((s, i) => s + i.presentDays, 0);
  const totalLate = filteredData.reduce((s, i) => s + i.lateDays, 0);
  const totalAbsent = filteredData.reduce((s, i) => s + i.absentDays, 0);

  // Chart Formatting: Dept levels of attendance
  const deptSummary: Record<string, { present: number, late: number, absent: number }> = {};
  filteredData.forEach(item => {
    if (!deptSummary[item.department]) {
      deptSummary[item.department] = { present: 0, late: 0, absent: 0 };
    }
    deptSummary[item.department].present += item.presentDays;
    deptSummary[item.department].late += item.lateDays;
    deptSummary[item.department].absent += item.absentDays;
  });

  const chartData = Object.entries(deptSummary).map(([dept, vals]) => ({
    name: dept,
    Present: vals.present,
    Late: vals.late,
    Absent: vals.absent,
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
          <h1 className="text-xl font-black tracking-tight text-slate-900">Attendance Report</h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reports &gt; Attendance Report</p>
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
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
            <option value="QA">QA</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-400 font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration Picker</label>
          <select className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 cursor-not-allowed" disabled>
            <option>This Month (Jul 2026)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Average Attendance</p>
            <h3 className="text-xl font-black text-indigo-600">{avgAttendance}%</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Present Days</p>
            <h3 className="text-xl font-black text-emerald-600">{totalPresent} days</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Late Logs</p>
            <h3 className="text-xl font-black text-amber-600">{totalLate} days</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Absent Days</p>
            <h3 className="text-xl font-black text-rose-600">{totalAbsent} days</h3>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
          Attendance Metrics breakdown by Department
        </h3>
        <div className="h-60">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No attendance records loaded</div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <div className="h-8 bg-slate-100 animate-pulse rounded-md" />
            <div className="h-16 bg-slate-50 animate-pulse rounded-md" />
          </div>
        ) : paginatedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[9px] uppercase font-extrabold tracking-wider select-none">
                  <th onClick={() => handleSort('employee')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Employee</th>
                  <th onClick={() => handleSort('department')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Department</th>
                  <th onClick={() => handleSort('totalDays')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Calendar Days</th>
                  <th onClick={() => handleSort('presentDays')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Present</th>
                  <th onClick={() => handleSort('lateDays')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Late Logs</th>
                  <th onClick={() => handleSort('absentDays')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Absents</th>
                  <th onClick={() => handleSort('onLeaveDays')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Approved Leaves</th>
                  <th onClick={() => handleSort('attendancePercentage')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.employee}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-400">{item.department}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-500">{item.totalDays}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-emerald-600">{item.presentDays}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-amber-500">{item.lateDays}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-rose-500">{item.absentDays}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-indigo-500">{item.onLeaveDays}</td>
                    <td className="px-5 py-3.5 text-right font-mono font-black text-slate-800 bg-slate-50/50">
                      <span className={`inline-block text-[11px] font-black ${item.attendancePercentage >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {item.attendancePercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 italic">No attendance records found.</div>
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
