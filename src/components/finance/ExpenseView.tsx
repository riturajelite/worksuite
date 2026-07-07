/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Filter, ArrowUpDown, MoreVertical, 
  Check, X, Upload, Download, CreditCard, Landmark, DollarSign,
  ChevronLeft, ChevronRight, HelpCircle, FileImage, Trash2, ShieldAlert,
  TrendingUp, TrendingDown, Coffee, Laptop, Car, Briefcase, Sparkles, RefreshCw
} from 'lucide-react';
import { ExpenseRecord } from './types';
import { Client, Project, Employee } from '../../types';

interface ExpenseViewProps {
  expenses: any[];
  employees: Employee[];
  projects: Project[];
  onAddExpense: (expense: any) => void;
  onApproveExpense: (id: string) => void;
}

export default function ExpenseView({ expenses, employees, projects, onAddExpense, onApproveExpense }: ExpenseViewProps) {
  // --- SYNC LOCAL AND GLOBAL EXPENSES ---
  const [localExpenses, setLocalExpenses] = useState<ExpenseRecord[]>([
    {
      id: 'EXP-401',
      itemName: 'Google Cloud Platform Nodes - APAC Server Clusters',
      purchaseFrom: 'Google Inc.',
      amount: 4500,
      purchaseDate: '2026-07-02',
      employeeName: 'Lia Parisian',
      projectName: 'Survey and data collection tool',
      category: 'Tech',
      bankAccount: 'SVB Corporate checking •••• 8910',
      currency: 'USD',
      exchangeRate: 1.0,
      description: 'APAC high availability zone clusters compute power surcharge.',
      status: 'Approved',
      isRecurring: true,
      recurringInterval: 'Monthly'
    },
    {
      id: 'EXP-402',
      itemName: 'Worksuite Launch Dinner - catering team',
      purchaseFrom: 'Le Petit Restaurant',
      amount: 850,
      purchaseDate: '2026-06-28',
      employeeName: 'Eldora Mann MD',
      projectName: 'SaaS Platform Redesign',
      category: 'Meals',
      bankAccount: 'Petty Cash Ledger',
      currency: 'USD',
      exchangeRate: 1.0,
      description: 'Celebrating contract signature with Wayne representatives.',
      status: 'Pending',
      isRecurring: false
    },
    {
      id: 'EXP-403',
      itemName: 'Enterprise UI/UX Auditing Suite Licenses',
      purchaseFrom: 'Figma Inc.',
      amount: 1200,
      purchaseDate: '2026-06-15',
      employeeName: 'Wellington Walsh',
      projectName: 'E-commerce Checkout Optimization',
      category: 'Tech',
      bankAccount: 'SVB Corporate checking •••• 8910',
      currency: 'USD',
      exchangeRate: 1.0,
      description: '10 professional designer licenses covering standard components library.',
      status: 'Approved',
      isRecurring: true,
      recurringInterval: 'Monthly'
    },
    {
      id: 'EXP-404',
      itemName: 'Enterprise Flight to Gotham City',
      purchaseFrom: 'Delta Airlines',
      amount: 650,
      purchaseDate: '2026-06-10',
      employeeName: 'Lia Parisian',
      projectName: 'SaaS Platform Redesign',
      category: 'Travel',
      bankAccount: 'Corporate Visa Card •••• 1040',
      currency: 'USD',
      exchangeRate: 1.0,
      description: 'Flight ticket for final physical signoff meeting with Wayne representatives.',
      status: 'Rejected',
      isRecurring: false
    }
  ]);

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // --- SORTING & PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState<keyof ExpenseRecord>('purchaseDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // --- FORM STATE ---
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');

  const [itemName, setItemName] = useState('');
  const [purchaseFrom, setPurchaseFrom] = useState('');
  const [amount, setAmount] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('Tech');
  const [bankAccount, setBankAccount] = useState('SVB Corporate checking •••• 8910');
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1.0);
  const [description, setDescription] = useState('');
  const [billFile, setBillFile] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('Monthly');
  const [dragActive, setDragActive] = useState(false);

  const categories = ['Tech', 'Meals', 'Travel', 'Marketing', 'Office Supplies', 'Other'];

  // --- DRAG & DROP BILL UPLOAD ---
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
      setBillFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBillFile(e.target.files[0].name);
    }
  };

  // --- ACTIONS ---
  const handleSort = (field: keyof ExpenseRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || amount <= 0 || !employeeName) {
      alert('Please compile item name, price, and designated employee.');
      return;
    }

    const newExp: ExpenseRecord = {
      id: `EXP-${Date.now().toString().slice(-3)}`,
      itemName,
      purchaseFrom,
      amount,
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      employeeName,
      projectName: projectName || undefined,
      category,
      bankAccount,
      currency,
      exchangeRate,
      description,
      billFile: billFile || undefined,
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : undefined,
      status: 'Pending'
    };

    setLocalExpenses([newExp, ...localExpenses]);
    onAddExpense(newExp);

    setViewMode('list');
    resetForm();
  };

  const resetForm = () => {
    setItemName('');
    setPurchaseFrom('');
    setAmount(0);
    setPurchaseDate('');
    setEmployeeName('');
    setProjectName('');
    setCategory('Tech');
    setBankAccount('SVB Corporate checking •••• 8910');
    setCurrency('USD');
    setExchangeRate(1.0);
    setDescription('');
    setBillFile(null);
    setIsRecurring(false);
  };

  const handleApprove = (id: string) => {
    setLocalExpenses(localExpenses.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
    onApproveExpense(id);
    alert('Success! Expense Approved & logged to general ledger.');
  };

  const handleReject = (id: string) => {
    setLocalExpenses(localExpenses.map(item => item.id === id ? { ...item, status: 'Rejected' } : item));
    alert('Expense rejected and returned to submitter for audit corrections.');
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense permanently?')) {
      setLocalExpenses(localExpenses.filter(item => item.id !== id));
    }
  };

  const handleExportCSV = () => {
    // Basic CSV download simulator
    let csvContent = "data:text/csv;charset=utf-8,ID,Item Name,Amount,Date,Employee,Category,Status\n";
    localExpenses.forEach(exp => {
      csvContent += `${exp.id},"${exp.itemName}",${exp.amount},${exp.purchaseDate},"${exp.employeeName}","${exp.category}",${exp.status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `worksuite_general_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FILTERING ---
  const filteredExpenses = localExpenses.filter(exp => {
    const matchesSearch = exp.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.purchaseFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exp.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || exp.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // --- SORTING ---
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = sortedExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- CATEGORY ICONS ---
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Tech': return <Laptop className="h-4 w-4 text-sky-500" />;
      case 'Meals': return <Coffee className="h-4 w-4 text-amber-500" />;
      case 'Travel': return <Car className="h-4 w-4 text-emerald-500" />;
      default: return <Briefcase className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <>
          {/* Bento Grid Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2 col-span-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Tech Expenses</span>
              <p className="text-2xl font-extrabold text-slate-900">
                ${localExpenses.filter(e => e.category === 'Tech').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-sky-600 font-semibold">
                <Laptop className="h-4 w-4" />
                <span>Compute, subscriptions</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2 col-span-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Travel & Lodging</span>
              <p className="text-2xl font-extrabold text-slate-900">
                ${localExpenses.filter(e => e.category === 'Travel').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Car className="h-4 w-4" />
                <span>Delta flights, Uber</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2 col-span-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Pending Audit Surcharges</span>
              <p className="text-2xl font-extrabold text-amber-500 font-extrabold">
                ${localExpenses.filter(e => e.status === 'Pending').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                <HelpCircle className="h-4 w-4" />
                <span>Require auditor signoff</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2 col-span-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Approved Operating Expenses</span>
              <p className="text-2xl font-extrabold text-indigo-600 font-black">
                ${localExpenses.filter(e => e.status === 'Approved').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                <TrendingUp className="h-4 w-4" />
                <span>Reconciled on cash ledger</span>
              </div>
            </div>
          </div>

          {/* List Controller */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search expense item, purchase vendor, employee..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span>Filters</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-4 w-4 text-slate-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => {
                    resetForm();
                    setPurchaseDate(new Date().toISOString().split('T')[0]);
                    setViewMode('add');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>Log Expense</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expense Category</label>
                  <select
                    className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Approval status</label>
                  <select
                    className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Approval types</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending Audit</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            )}

            {/* Expenses List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('purchaseDate')}>
                      <div className="flex items-center gap-1">
                        <span>Logged Date</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Operating Item Name</th>
                    <th className="px-6 py-3.5">Purchased From</th>
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('employeeName')}>
                      <div className="flex items-center gap-1">
                        <span>Employee / Project Link</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-right">Sum cost</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Reconcile / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedExpenses.length > 0 ? (
                    paginatedExpenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-mono text-slate-500">{exp.purchaseDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {getCategoryIcon(exp.category)}
                            <span className="font-semibold text-slate-700">{exp.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800 leading-normal">{exp.itemName}</p>
                            {exp.isRecurring && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-indigo-600 font-extrabold uppercase mt-0.5">
                                <RefreshCw className="h-2.5 w-2.5 animate-spin" style={{ animationDuration: '4s' }} />
                                <span>Recurring: {exp.recurringInterval}</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{exp.purchaseFrom || '--'}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800">{exp.employeeName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{exp.projectName || '--'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-900">${exp.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            exp.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' :
                            exp.status === 'Pending' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10' :
                            'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10'
                          }`}>
                            {exp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {exp.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(exp.id)}
                                  className="p-1 hover:bg-emerald-50 text-emerald-600 rounded cursor-pointer"
                                  title="Approve expense"
                                >
                                  <Check className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={() => handleReject(exp.id)}
                                  className="p-1 hover:bg-rose-50 text-rose-600 rounded cursor-pointer"
                                  title="Reject expense"
                                >
                                  <X className="h-4.5 w-4.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                        <FileText className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                        <span>No company expenses logged.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedExpenses.length)} of {sortedExpenses.length} expenses</span>
                <div className="flex gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
                        currentPage === idx + 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {viewMode === 'add' && (
        <form onSubmit={handleSubmitExpense} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Log Operating Expense</h3>
              <p className="text-[10px] text-slate-500">Log general operating expenses, tech purchases, meal tabs, or flight tickets.</p>
            </div>
            <button type="button" onClick={() => setViewMode('list')} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Item / Asset name *</label>
                <input
                  type="text" required
                  placeholder="e.g. AWS Nodes server bundle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vendor / Purchased From</label>
                <input
                  type="text"
                  placeholder="e.g. Amazon Web Services Inc."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={purchaseFrom}
                  onChange={(e) => setPurchaseFrom(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Operating sum ($) *</label>
                <input
                  type="number" required min={1}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-extrabold"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Purchase Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Employee Linking *</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-semibold"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                >
                  <option value="" disabled>-- Pick Corporate Employee --</option>
                  {employees.map((emp, idx) => (
                    <option key={idx} value={emp.name}>{emp.name} ({emp.designation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Project Link</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                >
                  <option value="" disabled>-- Pick Associated Project --</option>
                  {projects.map(proj => (
                    <option key={proj.id} value={proj.name}>{proj.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expense Category</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-semibold text-indigo-600"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Account Sourced</label>
                <input
                  type="text"
                  placeholder="e.g. SVB checking •••• 8910"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Local Sourced Currency</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-semibold"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Exchange Rate (vs USD)</label>
                <input
                  type="number" step="any"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                />
              </div>
              <div className="pt-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk-recurring-exp"
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded cursor-pointer"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  <label htmlFor="chk-recurring-exp" className="font-bold text-slate-700 cursor-pointer select-none">
                    Recurring operating expense
                  </label>
                </div>
              </div>
            </div>

            {isRecurring && (
              <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl max-w-xs animate-fade-in flex items-center gap-2">
                <span className="font-bold text-indigo-700 uppercase text-[9px]">Interval Cycle:</span>
                <select
                  className="bg-white border border-slate-200 rounded p-1 text-xs text-slate-700"
                  value={recurringInterval}
                  onChange={(e) => setRecurringInterval(e.target.value)}
                >
                  <option value="Weekly">Weekly Cycle</option>
                  <option value="Monthly">Monthly Cycle</option>
                  <option value="Yearly">Yearly Cycle</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Item Description / Memo</label>
              <textarea
                rows={3}
                placeholder="Technical justification, employee approval, and audit details..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Receipt Upload - drag & drop */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Expense Bill / Receipt</label>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  dragActive ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 bg-slate-50/30 hover:bg-slate-50"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('bill-upload-input')?.click()}
              >
                <input
                  type="file"
                  id="bill-upload-input"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Drag & Drop expense receipt here, or <span className="text-indigo-600 hover:underline">browse files</span></p>
                <p className="text-[10px] text-slate-400 mt-1">Supports PDF, PNG, JPG files up to 10MB</p>
                {billFile && (
                  <div className="mt-4 p-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center gap-1.5 text-indigo-700 font-bold max-w-xs mx-auto text-[11px]">
                    <FileImage className="h-4 w-4" />
                    <span className="truncate">{billFile}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setBillFile(null); }} className="p-0.5 hover:bg-indigo-100 rounded text-indigo-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl cursor-pointer shadow-sm"
            >
              Log Expense
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
