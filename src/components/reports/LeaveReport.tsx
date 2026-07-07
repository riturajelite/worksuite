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
  Printer, Copy, FileDown, ShieldAlert, HeartPulse, UserCheck, Eye
} from 'lucide-react';
import { MOCK_LEAVE_REPORT, LeaveReportItem } from './mockReportsData';

export default function LeaveReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [sortField, setSortField] = useState<keyof LeaveReportItem>('leavesApproved');
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
    triggerToast(`Exporting Leave Report as ${type.toUpperCase()}...`);
  };

  const handleSort = (field: keyof LeaveReportItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter Data
  const filteredData = MOCK_LEAVE_REPORT.filter(item => {
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

  // Metrics
  const totalCasualUsed = filteredData.reduce((s, i) => s + i.casualLeaves, 0);
  const totalSickUsed = filteredData.reduce((s, i) => s + i.sickLeaves, 0);
  const totalEarnedUsed = filteredData.reduce((s, i) => s + i.earnedLeaves, 0);
  const totalApproved = filteredData.reduce((s, i) => s + i.leavesApproved, 0);

  // Department totals for visual Chart
  const deptTotals: Record<string, { casual: number, sick: number, earned: number }> = {};
  filteredData.forEach(item => {
    if (!deptTotals[item.department]) {
      deptTotals[item.department] = { casual: 0, sick: 0, earned: 0 };
    }
    deptTotals[item.department].casual += item.casualLeaves;
    deptTotals[item.department].sick += item.sickLeaves;
    deptTotals[item.department].earned += item.earnedLeaves;
  });

  const chartData = Object.entries(deptTotals).map(([dept, vals]) => ({
    name: dept,
    Casual: vals.casual,
    Sick: vals.sick,
    Earned: vals.earned,
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
          <h1 className="text-xl font-black tracking-tight text-slate-900">Leave Report</h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reports &gt; Leave Report</p>
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

      {/* Filters */}
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
          <select className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-not-allowed" disabled>
            <option>Current Calendar Year (2026)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Casual Leaves Taken</p>
            <h3 className="text-xl font-black text-slate-900">{totalCasualUsed} days</h3>
          </div>
          <div className="p-3 rounded-xl bg-[#e0e7ff] text-[#4f46e5]">
            <Eye className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Sick Leaves Taken</p>
            <h3 className="text-xl font-black text-rose-600">{totalSickUsed} days</h3>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <HeartPulse className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Earned Leaves Spent</p>
            <h3 className="text-xl font-black text-emerald-600">{totalEarnedUsed} days</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Approved Absences</p>
            <h3 className="text-xl font-black text-indigo-600">{totalApproved} days</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
          Leave Absences count by Department
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
                <Bar dataKey="Casual" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sick" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Earned" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No leaves mapped</div>
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
                  <th onClick={() => handleSort('casualLeaves')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Casual Used</th>
                  <th onClick={() => handleSort('sickLeaves')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Sick Used</th>
                  <th onClick={() => handleSort('earnedLeaves')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Earned Used</th>
                  <th onClick={() => handleSort('leavesPending')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Pending Approvals</th>
                  <th onClick={() => handleSort('leavesApproved')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-center">Total Approved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.employee}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-400">{item.department}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-indigo-500">{item.casualLeaves} d</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-rose-500">{item.sickLeaves} d</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-emerald-500">{item.earnedLeaves} d</td>
                    <td className="px-5 py-3.5 text-center font-mono">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full ${item.leavesPending > 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-400'}`}>
                        {item.leavesPending} pending
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-black text-slate-800 bg-slate-50/50">{item.leavesApproved} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 italic">No corresponding employees match filters.</div>
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
