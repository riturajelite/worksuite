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
  Printer, Copy, FileDown, ShieldAlert, Sparkles, TrendingUp, Handshake
} from 'lucide-react';
import { MOCK_DEAL_REPORTS, EMPLOYEES, DealReportItem } from './mockReportsData';

export default function DealReport() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedOwner, setSelectedOwner] = useState('All');
  const [sortField, setSortField] = useState<keyof DealReportItem>('closeDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedStage, selectedOwner, searchTerm]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleExport = (type: string) => {
    triggerToast(`Exporting Deal Report as ${type.toUpperCase()}...`);
  };

  const handleSort = (field: keyof DealReportItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter Data
  const filteredData = MOCK_DEAL_REPORTS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'All' || item.stage === selectedStage;
    const matchesOwner = selectedOwner === 'All' || item.owner === selectedOwner;
    return matchesSearch && matchesStage && matchesOwner;
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
  const totalPipelineVal = filteredData.reduce((s, i) => s + i.value, 0);
  const activeOpportunities = filteredData.filter(i => i.stage !== 'Won' && i.stage !== 'Lost').length;
  const wonDeals = filteredData.filter(i => i.stage === 'Won').length;
  const avgDealVal = filteredData.length > 0 ? parseFloat((totalPipelineVal / filteredData.length).toFixed(0)) : 0;

  // Chart Formatting: Stage distribution
  const stageSummary: Record<string, number> = { Lead: 0, Contacted: 0, Proposal: 0, Negotiation: 0, Won: 0, Lost: 0 };
  filteredData.forEach(item => {
    stageSummary[item.stage] = (stageSummary[item.stage] || 0) + item.value;
  });

  const chartData = Object.entries(stageSummary).map(([stage, value]) => ({
    name: stage,
    Value: value
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
          <h1 className="text-xl font-black tracking-tight text-slate-900">Deal Report</h1>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reports &gt; Deal Report</p>
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
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Funnel Stage</label>
          <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="All">All Stages</option>
            <option value="Lead">Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deal Owner</label>
          <select value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)} className="w-full bg-slate-50 text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer">
            <option value="All">All Owners</option>
            <option value="Augustus Caesar">Augustus Caesar</option>
            <option value="Zara Khan">Zara Khan</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search leads or companies..."
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
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pipeline Value</p>
            <h3 className="text-xl font-black text-slate-900">${totalPipelineVal.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Opportunities count</p>
            <h3 className="text-xl font-black text-indigo-600">{activeOpportunities} active</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Avg Opportunity size</p>
            <h3 className="text-xl font-black text-emerald-600">${avgDealVal.toLocaleString()}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Contract Deals Won</p>
            <h3 className="text-xl font-black text-slate-800">{wonDeals} contracts</h3>
          </div>
          <div className="p-3 rounded-xl bg-[#e0e7ff] text-[#4f46e5]">
            <Handshake className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
          Pipeline Value distribution by Funnel Stage
        </h3>
        <div className="h-60">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Pipeline Value']} />
                <Bar dataKey="Value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No opportunities loaded</div>
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
                  <th onClick={() => handleSort('id')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">ID</th>
                  <th onClick={() => handleSort('title')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Opportunity Name</th>
                  <th onClick={() => handleSort('company')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Company</th>
                  <th onClick={() => handleSort('leadName')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Lead Contact</th>
                  <th onClick={() => handleSort('value')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right">Estimated Value</th>
                  <th onClick={() => handleSort('closeDate')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Est. Close Date</th>
                  <th onClick={() => handleSort('owner')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Owner</th>
                  <th onClick={() => handleSort('stage')} className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.id}</td>
                    <td className="px-5 py-3.5 font-bold text-indigo-600 max-w-xs truncate">{item.title}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-400 max-w-xs truncate">{item.company}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{item.leadName}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-black text-right text-emerald-600">${item.value.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono text-[10px] text-slate-400 font-semibold">{item.closeDate}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-500">{item.owner}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        item.stage === 'Won' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.stage === 'Lost' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        item.stage === 'Proposal' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        item.stage === 'Negotiation' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {item.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 italic">No correspond pipelines loaded matching criteria.</div>
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
