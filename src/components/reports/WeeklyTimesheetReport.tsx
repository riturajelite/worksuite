/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Download, ChevronLeft, ChevronRight, FileSpreadsheet, 
  Printer, Copy, FileDown, Calendar, AlertCircle
} from 'lucide-react';
import { MOCK_WEEKLY_TIMESHEET, EMPLOYEES, PROJECTS } from './mockReportsData';

export default function WeeklyTimesheetReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');
  const [currentWeek, setCurrentWeek] = useState('01 Jul - 07 Jul 2026');
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, [selectedEmployee, selectedProject, searchTerm]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleExport = (type: string) => {
    triggerToast(`Exporting Weekly Timesheet as ${type.toUpperCase()}...`);
  };

  // Filter Data
  const filteredData = MOCK_WEEKLY_TIMESHEET.filter(row => {
    const matchesSearch = row.employee.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployee = selectedEmployee === 'All' || row.employee === selectedEmployee;
    const matchesProject = selectedProject === 'All' || row.project === selectedProject;
    return matchesSearch && matchesEmployee && matchesProject;
  });

  // Totals calculations
  const totalMon = filteredData.reduce((s, r) => s + r.monday, 0);
  const totalTue = filteredData.reduce((s, r) => s + r.tuesday, 0);
  const totalWed = filteredData.reduce((s, r) => s + r.wednesday, 0);
  const totalThu = filteredData.reduce((s, r) => s + r.thursday, 0);
  const totalFri = filteredData.reduce((s, r) => s + r.friday, 0);
  const totalSat = filteredData.reduce((s, r) => s + r.saturday, 0);
  const totalSun = filteredData.reduce((s, r) => s + r.sunday, 0);
  const grandTotal = filteredData.reduce((s, r) => s + r.total, 0);

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
          <h1 className="text-xl font-black tracking-tight text-slate-900">Weekly Timesheet</h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reports &gt; Weekly Timesheet</p>
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

      {/* Week Selector & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-semibold">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Period</label>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {
                setCurrentWeek('24 Jun - 30 Jun 2026');
                triggerToast('Navigated to previous week timesheets.');
              }}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
            </button>
            <div className="flex-1 bg-slate-50 p-2 text-center text-slate-800 rounded-lg border border-slate-200 font-bold flex items-center justify-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-indigo-600" />
              <span>{currentWeek}</span>
            </div>
            <button 
              onClick={() => {
                setCurrentWeek('08 Jul - 14 Jul 2026');
                triggerToast('Navigated to next week timesheets.');
              }}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            </button>
          </div>
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
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search employee or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-400 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Grid Stage */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-4">
            <div className="h-8 bg-slate-100 animate-pulse rounded-md" />
            <div className="h-16 bg-slate-50 animate-pulse rounded-md" />
            <div className="h-16 bg-slate-50 animate-pulse rounded-md" />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[9px] uppercase font-extrabold tracking-wider select-none text-center">
                  <th className="px-5 py-3 text-left w-56">Employee / Project</th>
                  <th className="px-4 py-3 w-16">Mon</th>
                  <th className="px-4 py-3 w-16">Tue</th>
                  <th className="px-4 py-3 w-16">Wed</th>
                  <th className="px-4 py-3 w-16">Thu</th>
                  <th className="px-4 py-3 w-16">Fri</th>
                  <th className="px-4 py-3 w-16 text-slate-400/70">Sat</th>
                  <th className="px-4 py-3 w-16 text-slate-400/70">Sun</th>
                  <th className="px-5 py-3 text-right w-24">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{row.employee}</div>
                      <div className="text-[10px] text-slate-400 font-semibold truncate max-w-xs">{row.project}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-600">{row.monday > 0 ? `${row.monday}h` : '-'}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-600">{row.tuesday > 0 ? `${row.tuesday}h` : '-'}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-600">{row.wednesday > 0 ? `${row.wednesday}h` : '-'}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-600">{row.thursday > 0 ? `${row.thursday}h` : '-'}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-600">{row.friday > 0 ? `${row.friday}h` : '-'}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-400/80">{row.saturday > 0 ? `${row.saturday}h` : '-'}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-400/80">{row.sunday > 0 ? `${row.sunday}h` : '-'}</td>
                    <td className="px-5 py-3.5 text-right font-mono font-black text-indigo-600 text-sm bg-slate-50/40">{row.total.toFixed(1)} hrs</td>
                  </tr>
                ))}
                
                {/* Total Summary Row */}
                <tr className="bg-slate-100/60 font-bold border-t border-slate-200 text-slate-900 text-center">
                  <td className="px-5 py-4 text-left font-extrabold text-xs uppercase tracking-wider text-slate-500">Weekly Summary Total</td>
                  <td className="px-4 py-4 font-mono">{totalMon > 0 ? `${totalMon.toFixed(1)}h` : '-'}</td>
                  <td className="px-4 py-4 font-mono">{totalTue > 0 ? `${totalTue.toFixed(1)}h` : '-'}</td>
                  <td className="px-4 py-4 font-mono">{totalWed > 0 ? `${totalWed.toFixed(1)}h` : '-'}</td>
                  <td className="px-4 py-4 font-mono">{totalThu > 0 ? `${totalThu.toFixed(1)}h` : '-'}</td>
                  <td className="px-4 py-4 font-mono">{totalFri > 0 ? `${totalFri.toFixed(1)}h` : '-'}</td>
                  <td className="px-4 py-4 font-mono text-slate-500">{totalSat > 0 ? `${totalSat.toFixed(1)}h` : '-'}</td>
                  <td className="px-4 py-4 font-mono text-slate-500">{totalSun > 0 ? `${totalSun.toFixed(1)}h` : '-'}</td>
                  <td className="px-5 py-4 text-right font-mono font-black text-[#4f46e5] text-base bg-slate-100">{grandTotal.toFixed(1)} hrs</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-400 italic">No timesheet records match this query.</p>
          </div>
        )}
      </div>

    </div>
  );
}
