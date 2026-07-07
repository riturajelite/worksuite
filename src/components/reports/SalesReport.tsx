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
  Printer, Copy, FileDown, DollarSign, Wallet, Percent, Tag
} from 'lucide-react';
import { MOCK_SALES_REPORTS, SalesReportItem } from './mockReportsData';

export default function SalesReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedClient, setSelectedClient] = useState('All');
  const [sortField, setSortField] = useState<keyof SalesReportItem>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedStatus, selectedClient, searchTerm]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleExport = (type: string) => {
    triggerToast(`Exporting Sales Report as ${type.toUpperCase()}...`);
  };

  const handleSort = (field: keyof SalesReportItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter Data
  const filteredData = MOCK_SALES_REPORTS.filter(item => {
    const matchesSearch = item.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesClient = selectedClient === 'All' || item.client === selectedClient;
    return matchesSearch && matchesStatus && matchesClient;
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
  const totalGross = filteredData.reduce((s, i) => s + i.total, 0);
  const collectedCash = filteredData.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const pendingCash = filteredData.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.total, 0);
  const taxInvoiced = filteredData.reduce((s, i) => s + i.tax, 0);

  // Chart Formatting: Invoice revenue distributions
  const chartData = filteredData.map(item => ({
    name: item.invoiceNumber.split('-')[2] || item.invoiceNumber,
    Revenue: item.subtotal,
    Taxes: item.tax,
  }));

  // Unique clients for filters
  const uniqueClients = Array.from(new Set(MOCK_SALES_REPORTS.map(item => item.client)));

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
          <h1 className="text-xl font-black tracking-tight text-slate-900">Sales Report</h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reports &gt; Sales Report</p>
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
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Portfolio</label>
          <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="All">All Clients</option>
            {uniqueClients.map((client, idx) => (
              <option key={idx} value={client}>{client}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Billing Status</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="All">All Statuses</option>
            <option value="Paid">Paid Only</option>
            <option value="Unpaid">Unpaid Only</option>
            <option value="Overdue">Overdue Only</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search invoice numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-400 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Sales Invoiced</p>
            <h3 className="text-xl font-black text-slate-900">${totalGross.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Collected cash</p>
            <h3 className="text-xl font-black text-emerald-600">${collectedCash.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Unpaid Receivables</p>
            <h3 className="text-xl font-black text-amber-600">${pendingCash.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Tag className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Vat / Taxes Invoiced</p>
            <h3 className="text-xl font-black text-indigo-600">${taxInvoiced.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
          Invoice Revenue Share vs Tax Overlays
        </h3>
        <div className="h-60">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Taxes" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No sales loaded</div>
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
                  <th onClick={() => handleSort('invoiceNumber')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Invoice Code</th>
                  <th onClick={() => handleSort('client')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Client Portfolio</th>
                  <th onClick={() => handleSort('project')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Project Name</th>
                  <th onClick={() => handleSort('date')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Date Issued</th>
                  <th onClick={() => handleSort('subtotal')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Subtotal</th>
                  <th onClick={() => handleSort('tax')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Tax Charge</th>
                  <th onClick={() => handleSort('discount')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Discounts</th>
                  <th onClick={() => handleSort('total')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Grand Total</th>
                  <th onClick={() => handleSort('status')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Billing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedData.map((item) => (
                  <tr key={item.invoiceId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.invoiceNumber}</td>
                    <td className="px-5 py-3.5 font-bold text-indigo-600 max-w-xs truncate">{item.client}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-400 max-w-xs truncate">{item.project}</td>
                    <td className="px-5 py-3.5 font-mono text-[10px] text-slate-400 font-semibold">{item.date}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-right text-slate-700">${item.subtotal.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-right text-amber-600">${item.tax.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-right text-rose-500">${item.discount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-black text-right text-indigo-600 bg-slate-50/40">${item.total.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        item.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'Unpaid' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
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
          <div className="p-12 text-center text-xs text-slate-400 italic">No corresponding billing sheets logged.</div>
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
