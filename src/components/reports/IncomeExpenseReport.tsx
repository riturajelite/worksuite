/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts';
import { 
  Search, Download, ChevronLeft, ChevronRight, FileSpreadsheet, 
  Printer, Copy, FileDown, TrendingUp, TrendingDown, RefreshCw
} from 'lucide-react';
import { MOCK_INCOME_EXPENSES_LIST, PROJECTS, IncomeExpenseItem } from './mockReportsData';

export default function IncomeExpenseReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');
  const [sortField, setSortField] = useState<keyof IncomeExpenseItem>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedType, selectedProject, searchTerm]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleExport = (type: string) => {
    triggerToast(`Exporting Income vs Expense as ${type.toUpperCase()}...`);
  };

  const handleSort = (field: keyof IncomeExpenseItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter Data
  const filteredData = MOCK_INCOME_EXPENSES_LIST.filter(item => {
    const matchesSearch = item.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.project && item.project.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesProject = selectedProject === 'All' || item.project === selectedProject;
    return matchesSearch && matchesType && matchesProject;
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

  // Metrics
  const totalIncome = filteredData.filter(i => i.type === 'Income').reduce((s, i) => s + i.amount, 0);
  const totalExpense = filteredData.filter(i => i.type === 'Expense').reduce((s, i) => s + i.amount, 0);
  const netSurplus = totalIncome - totalExpense;

  // Chart data formatting: Daily plot values
  const dateTotals: Record<string, { income: number, expense: number }> = {};
  filteredData.forEach(item => {
    if (!dateTotals[item.date]) {
      dateTotals[item.date] = { income: 0, expense: 0 };
    }
    if (item.type === 'Income') {
      dateTotals[item.date].income += item.amount;
    } else {
      dateTotals[item.date].expense += item.amount;
    }
  });

  const chartData = Object.entries(dateTotals).map(([date, values]) => ({
    date: date.substring(5), // Short MM-DD
    income: values.income,
    expense: values.expense,
  })).sort((a, b) => (a.date < b.date ? -1 : 1));

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
          <h1 className="text-xl font-black tracking-tight text-slate-900">Income vs Expense</h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reports &gt; Income vs Expense</p>
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
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction Type</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="All">All Types</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expense Only</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Associated Project</label>
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
              placeholder="Search category description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-400 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Income</p>
            <h3 className="text-xl font-black text-emerald-600">${totalIncome.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Expense</p>
            <h3 className="text-xl font-black text-rose-600">${totalExpense.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Surplus / Deficit</p>
            <h3 className={`text-xl font-black ${netSurplus >= 0 ? 'text-indigo-600' : 'text-amber-600'}`}>
              ${netSurplus.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <RefreshCw className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
          Financial Comparison Trend (Inflow vs Outflow)
        </h3>
        <div className="h-60">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="income" name="Inflow (Income)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" name="Outflow (Expense)" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No corresponding ledger inputs</div>
          )}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-slate-900 font-bold text-xs uppercase tracking-wider">Income & Expense Audit Trail</div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Showing <span className="text-slate-700">{Math.min(startIndex + 1, totalItems)}-{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-indigo-600">{totalItems}</span> Transactions
          </div>
        </div>

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
                  <th onClick={() => handleSort('date')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Date</th>
                  <th onClick={() => handleSort('type')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Type</th>
                  <th onClick={() => handleSort('category')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Category</th>
                  <th onClick={() => handleSort('project')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Project Name</th>
                  <th onClick={() => handleSort('paymentMethod')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Method</th>
                  <th onClick={() => handleSort('amount')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[10px] text-slate-500 font-bold">{item.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        item.type === 'Income' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{item.category}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-400 max-w-xs truncate">{item.project || '--'}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-500">{item.paymentMethod}</td>
                    <td className={`px-5 py-3.5 font-mono text-[11px] font-black text-right ${item.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.type === 'Income' ? '+' : '-'}${item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 italic">No ledger accounts meet current query specifications.</div>
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
