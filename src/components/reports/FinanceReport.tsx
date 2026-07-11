/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, ComposedChart
} from 'recharts';
import { 
  Search, Download, ChevronLeft, ChevronRight, FileSpreadsheet, 
  Printer, Copy, FileDown, DollarSign, ArrowUpRight, TrendingUp, Percent
} from 'lucide-react';
import { MOCK_FINANCE_REPORT_SUMMARY, FinanceSummaryItem } from './mockReportsData';

export default function FinanceReport() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [duration, setDuration] = useState('This Year');
  const [sortField, setSortField] = useState<keyof FinanceSummaryItem>('month');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedYear, duration]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleExport = (type: string) => {
    triggerToast(`Exporting Finance Report as ${type.toUpperCase()}...`);
  };

  const handleSort = (field: keyof FinanceSummaryItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter Logic (mock)
  const filteredData = MOCK_FINANCE_REPORT_SUMMARY;

  // Sort Logic
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate Aggregations
  const totalIncome = filteredData.reduce((s, i) => s + i.income, 0);
  const totalExpenses = filteredData.reduce((s, i) => s + i.expenses, 0);
  const totalProfit = filteredData.reduce((s, i) => s + i.profit, 0);
  const totalTax = filteredData.reduce((s, i) => s + i.tax, 0);

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
          <h1 className="text-xl font-black tracking-tight text-slate-900">Finance Report</h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reports &gt; Finance Report</p>
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
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap gap-3 text-xs font-semibold">
        <div className="space-y-1 w-full sm:w-48">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="This Year">This Year</option>
            <option value="Last 12 Months">Last 12 Months</option>
          </select>
        </div>

        <div className="space-y-1 w-full sm:w-48">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Year Filter</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-xl font-black text-slate-900">${totalIncome.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Overhead</p>
            <h3 className="text-xl font-black text-rose-600">${totalExpenses.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Net Profit</p>
            <h3 className="text-xl font-black text-emerald-600">${totalProfit.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Estimated Tax</p>
            <h3 className="text-xl font-black text-amber-600">${totalTax.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Mixed Line-Bar Composed Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
          Financial Growth & Forecast Curves
        </h3>
        <div className="h-64">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="income" name="Income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="profit" name="Net Profit Curve" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No historical metrics loaded</div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            <div className="h-8 bg-slate-100 rounded-md" />
            <div className="h-16 bg-slate-50 rounded-md" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[9px] uppercase font-extrabold tracking-wider select-none">
                  <th onClick={() => handleSort('month')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Reporting Month</th>
                  <th onClick={() => handleSort('income')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Income</th>
                  <th onClick={() => handleSort('expenses')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Expenses</th>
                  <th onClick={() => handleSort('profit')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Net Profit</th>
                  <th onClick={() => handleSort('tax')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Tax Accruals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {sortedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.month}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-indigo-600 text-right">${item.income.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-rose-600 text-right">${item.expenses.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-black text-emerald-600 text-right bg-emerald-50/10">${item.profit.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-amber-600 text-right">${item.tax.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
