/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Filter, ArrowUpDown, MoreVertical, 
  Eye, Edit, Trash2, Calendar, FileDown, Printer, Check, X,
  PlusCircle, Trash, Download, Sparkles, User, DollarSign,
  ChevronLeft, ChevronRight, RefreshCw, Layers
} from 'lucide-react';
import { Estimate, LineItem } from './types';
import { Client, Project } from '../../types';

interface EstimateViewProps {
  clients: Client[];
  projects: Project[];
  onAddInvoiceFromEstimate: (invoiceData: any) => void;
}

export default function EstimateView({ clients, projects, onAddInvoiceFromEstimate }: EstimateViewProps) {
  // --- MOCK INITIAL ESTIMATES ---
  const [estimates, setEstimates] = useState<Estimate[]>([
    {
      id: 'EST-101',
      estimateNumber: 'EST-2026-101',
      clientName: 'Magdalena Morissette',
      clientCompany: 'Armstrong PLC',
      clientEmail: 'anika.kub@example.org',
      projectName: 'Survey and data collection tool',
      amount: 18000,
      validTill: '2026-08-15',
      status: 'Pending',
      items: [
        { id: '1', name: 'Survey Tool Deployment', description: 'Interactive forms, dashboard triggers, and hosting integration', quantity: 1, unitPrice: 15000, taxRate: 10 },
        { id: '2', name: 'Compliance Audits & GDPR Setup', description: 'Data storage security and encryption keys calibration', quantity: 1, unitPrice: 3000, taxRate: 10 }
      ],
      discount: 0,
      discountType: 'flat',
      tax: 10,
      notes: 'Estimate valid for 45 days. Convert to invoice once approved by directors.',
      templateName: 'Standard Consulting Template'
    },
    {
      id: 'EST-102',
      estimateNumber: 'EST-2026-102',
      clientName: 'Stephen Rogahn',
      clientCompany: 'Barrows, Schoen and Corkery',
      clientEmail: 'maudie@barrows.net',
      projectName: 'Video editing and animation service',
      amount: 11000,
      validTill: '2026-07-30',
      status: 'Accepted',
      items: [
        { id: '1', name: 'Promotional Motion Video (2m)', description: 'Full animation rendering, storyboards, and asset design', quantity: 1, unitPrice: 10000, taxRate: 10 }
      ],
      discount: 10,
      discountType: 'percent',
      tax: 10,
      notes: 'Authorized contract estimate.',
      templateName: 'Creative Services Template'
    }
  ]);

  // --- STATE FOR FILTERS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- SORTING STATE ---
  const [sortField, setSortField] = useState<keyof Estimate>('estimateNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // --- CURRENT VIEW MODE ---
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'pdf'>('list');
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);

  // --- FORM STATE ---
  const [estimateNumber, setEstimateNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [validTill, setValidTill] = useState('');
  const [status, setStatus] = useState<Estimate['status']>('Pending');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('percent');
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState('');
  const [templateName, setTemplateName] = useState('Standard Consulting Template');

  const templates = [
    { name: 'Standard Consulting Template', desc: 'Generic configuration scope and milestones list.' },
    { name: 'Creative Services Template', desc: 'Broken down by storyboarding, draft render, and final production.' },
    { name: 'Software Development Template', desc: 'Milestones, hourly rates, APIs, and staging setup.' }
  ];

  // --- HELPER CALCULATIONS ---
  const getSubtotal = (estimateItems: LineItem[]) => {
    return estimateItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const getTaxAmount = (subtotal: number, taxRate: number) => {
    return subtotal * (taxRate / 100);
  };

  const getDiscountAmount = (subtotal: number, disc: number, type: 'flat' | 'percent') => {
    if (type === 'percent') {
      return subtotal * (disc / 100);
    }
    return disc;
  };

  const getTotalAmount = (estimateItems: LineItem[], disc: number, discType: 'flat' | 'percent', taxRate: number) => {
    const subtotal = getSubtotal(estimateItems);
    const discAmt = getDiscountAmount(subtotal, disc, discType);
    const taxAmt = getTaxAmount(subtotal - discAmt, taxRate);
    return Math.max(0, subtotal - discAmt + taxAmt);
  };

  // --- ACTIONS ---
  const handleSort = (field: keyof Estimate) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleApplyTemplate = (tempName: string) => {
    setTemplateName(tempName);
    if (tempName === 'Creative Services Template') {
      setItems([
        { id: '1', name: 'Promotional Motion Video (2m)', description: 'Full animation rendering, storyboards, and asset design', quantity: 1, unitPrice: 10000, taxRate: 10 }
      ]);
      setDiscount(10);
      setDiscountType('percent');
      setTax(10);
      setNotes('Project estimation for advertising content development.');
    } else if (tempName === 'Software Development Template') {
      setItems([
        { id: '1', name: 'Staging Kubernetes Provisioning', description: 'Setup of Node pools, cluster triggers, and DevOps secrets', quantity: 1, unitPrice: 8500, taxRate: 8 },
        { id: '2', name: 'REST API Custom Endpoint Coding', description: 'Writing 12 secure endpoints proxying Gemini data pools', quantity: 1, unitPrice: 4000, taxRate: 8 }
      ]);
      setDiscount(500);
      setDiscountType('flat');
      setTax(8);
      setNotes('Technical estimation for high-performance cloud application build.');
    } else {
      setItems([{ id: '1', name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 }]);
      setDiscount(0);
      setTax(0);
      setNotes('');
    }
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClientName(client.name);
      setClientCompany(client.company);
      setClientEmail(client.email);
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setProjectName(project.name);
    }
  };

  const handleAddItemRow = () => {
    setItems([
      ...items,
      { id: String(items.length + 1), name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 }
    ]);
  };

  const handleRemoveItemRow = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemFieldChange = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || items.some(it => !it.name)) {
      alert('Please fill out the client name and all line item names.');
      return;
    }

    const totalAmt = getTotalAmount(items, discount, discountType, tax);

    if (viewMode === 'create') {
      const newEst: Estimate = {
        id: `EST-${Date.now().toString().slice(-3)}`,
        estimateNumber: estimateNumber || `EST-2026-${String(estimates.length + 101).padStart(3, '0')}`,
        clientName,
        clientCompany,
        clientEmail,
        projectName,
        amount: totalAmt,
        validTill: validTill || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status,
        items,
        discount,
        discountType,
        tax,
        notes,
        templateName
      };
      setEstimates([newEst, ...estimates]);
    } else {
      if (!selectedEstimate) return;
      setEstimates(estimates.map(e => {
        if (e.id === selectedEstimate.id) {
          return {
            ...e,
            estimateNumber,
            clientName,
            clientCompany,
            clientEmail,
            projectName,
            amount: totalAmt,
            validTill,
            status,
            items,
            discount,
            discountType,
            tax,
            notes,
            templateName
          };
        }
        return e;
      }));
    }
    setViewMode('list');
    setSelectedEstimate(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this estimate?')) {
      setEstimates(estimates.filter(e => e.id !== id));
    }
  };

  const handleOpenEdit = (est: Estimate) => {
    setSelectedEstimate(est);
    setEstimateNumber(est.estimateNumber);
    setClientName(est.clientName);
    setClientCompany(est.clientCompany);
    setClientEmail(est.clientEmail);
    setProjectName(est.projectName);
    setValidTill(est.validTill);
    setStatus(est.status);
    setItems(est.items);
    setDiscount(est.discount);
    setDiscountType(est.discountType);
    setTax(est.tax);
    setNotes(est.notes);
    setTemplateName(est.templateName || 'Standard Consulting Template');
    setViewMode('edit');
  };

  const handleOpenPdf = (est: Estimate) => {
    setSelectedEstimate(est);
    setViewMode('pdf');
  };

  const handleConvert = (est: Estimate) => {
    if (confirm(`Do you wish to convert Estimate ${est.estimateNumber} into a live workspace Invoice?`)) {
      onAddInvoiceFromEstimate(est);
      setEstimates(estimates.map(e => e.id === est.id ? { ...e, status: 'Accepted' } : e));
      alert(`Success! Generated standard Invoice from Estimate ${est.estimateNumber}. Review under "Invoices Issued".`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // --- FILTERING LOGIC ---
  const filteredEstimates = estimates.filter(e => {
    const matchesSearch = e.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- SORTING LOGIC ---
  const sortedEstimates = [...filteredEstimates].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(sortedEstimates.length / itemsPerPage);
  const paginatedEstimates = sortedEstimates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <>
          {/* Dashboard Summary Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Estimates</span>
              <p className="text-2xl font-extrabold text-slate-900">{estimates.length}</p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                <Layers className="h-4 w-4" />
                <span>Standard pipeline tracking</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Approved Estimates</span>
              <p className="text-2xl font-extrabold text-emerald-600">
                {estimates.filter(e => e.status === 'Accepted').length}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Check className="h-4 w-4" />
                <span>Ready for invoice mapping</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Pending Decisions</span>
              <p className="text-2xl font-extrabold text-amber-500">
                {estimates.filter(e => e.status === 'Pending').length}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                <RefreshCw className="h-4 w-4 animate-spin text-amber-500" style={{ animationDuration: '3s' }} />
                <span>Awaiting client signature</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Declined Estimates</span>
              <p className="text-2xl font-extrabold text-slate-400">
                {estimates.filter(e => e.status === 'Declined').length}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <X className="h-4 w-4" />
                <span>Inactive or stalled deals</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search estimates, project scope, client name..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span>Filters</span>
                </button>

                <button
                  onClick={() => {
                    setEstimateNumber(`EST-2026-${String(estimates.length + 101).padStart(3, '0')}`);
                    setClientName('');
                    setClientCompany('');
                    setClientEmail('');
                    setProjectName('');
                    setValidTill(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                    setStatus('Pending');
                    setItems([{ id: '1', name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 }]);
                    setDiscount(0);
                    setTax(0);
                    setNotes('');
                    setViewMode('create');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Estimate</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 bg-slate-50 border-b border-slate-100 animate-fade-in text-xs">
                <div className="max-w-xs">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select
                    className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending Decision</option>
                    <option value="Accepted">Accepted / Active</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>
            )}

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('estimateNumber')}>
                      <div className="flex items-center gap-1">
                        <span>Estimate ID</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('clientName')}>
                      <div className="flex items-center gap-1">
                        <span>Target Client</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Associated Project</th>
                    <th className="px-6 py-3.5 text-right">Scope Cost Billed</th>
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('validTill')}>
                      <div className="flex items-center gap-1">
                        <span>Expiry Date</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedEstimates.length > 0 ? (
                    paginatedEstimates.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{e.estimateNumber}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800">{e.clientName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{e.clientCompany}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium max-w-xs truncate">{e.projectName || '--'}</td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-900">${e.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">{e.validTill}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            e.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' :
                            e.status === 'Pending' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10' :
                            'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {e.status === 'Pending' && (
                              <button
                                onClick={() => handleConvert(e)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                                title="Convert to Active Invoice"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span>Convert</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenPdf(e)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 cursor-pointer"
                              title="View PDF / Print"
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(e)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 cursor-pointer"
                              title="Edit Estimate"
                            >
                              <Edit className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(e.id)}
                              className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        <FileText className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                        <span>No project estimates logged.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedEstimates.length)} of {sortedEstimates.length} estimates</span>
                <div className="flex gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
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
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {viewMode === 'create' ? 'Assemble Project Estimate' : 'Revise Staged Estimate'}
              </h3>
              <p className="text-[10px] text-slate-500">Provide transparent budget structures, discount offsets, and milestones.</p>
            </div>
            <button type="button" onClick={() => setViewMode('list')} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Estimate templates selection */}
            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-3">
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Estimate Templates Blueprint</span>
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {templates.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyTemplate(t.name)}
                    className={`p-3 rounded-lg border cursor-pointer text-left space-y-1 transition-all ${
                      templateName === t.name ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600/20' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold text-slate-900 leading-tight truncate">{t.name}</p>
                    <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estimate ID *</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={estimateNumber}
                  onChange={(e) => setEstimateNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Link Client Entity</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  onChange={(e) => handleClientChange(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>-- Pick Client representative --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Client Name *</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Company</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Billing Email</label>
                <input
                  type="email" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Associated Project Link</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  onChange={(e) => handleProjectChange(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>-- Or pick existing Project --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Custom Project Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry date</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                />
              </div>
            </div>

            {/* Line items row */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Estimate Line Items</span>
                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                    <div className="md:col-span-4">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Deliverable Name *</label>
                      <input
                        type="text" required
                        className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none text-xs"
                        value={item.name}
                        onChange={(e) => handleItemFieldChange(item.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Deliverable Description</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none text-xs"
                        value={item.description}
                        onChange={(e) => handleItemFieldChange(item.id, 'description', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Qty</label>
                      <input
                        type="number" required min={1}
                        className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none text-xs text-center font-bold"
                        value={item.quantity}
                        onChange={(e) => handleItemFieldChange(item.id, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Unit Price ($)</label>
                      <input
                        type="number" required min={0}
                        className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none text-xs text-right font-extrabold"
                        value={item.unitPrice}
                        onChange={(e) => handleItemFieldChange(item.id, 'unitPrice', Number(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Tax (%)</label>
                      <input
                        type="number" min={0}
                        className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none text-xs text-center font-semibold"
                        value={item.taxRate}
                        onChange={(e) => handleItemFieldChange(item.id, 'taxRate', Number(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-center pt-5">
                      <button
                        type="button"
                        disabled={items.length === 1}
                        onClick={() => handleRemoveItemRow(item.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-400 disabled:opacity-50 cursor-pointer"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Scope Conditions & Memo</label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200/80 space-y-4 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-center">
                  <span>Gross Subtotal:</span>
                  <span className="font-extrabold text-slate-900">${getSubtotal(items).toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Discount Value</label>
                    <input
                      type="number" min={0}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Type</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                    >
                      <option value="percent">% Ratio</option>
                      <option value="flat">Flat Value</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Discount Amount:</span>
                  <span className="text-rose-600 font-bold">-${getDiscountAmount(getSubtotal(items), discount, discountType).toLocaleString()}</span>
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Tax rate (%)</label>
                  <input
                    type="number" min={0} max={100}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-black text-slate-950">
                  <span>Calculated Valuation Total:</span>
                  <span className="text-indigo-600">${getTotalAmount(items, discount, discountType, tax).toLocaleString()}</span>
                </div>
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
              {viewMode === 'create' ? 'Save Estimate' : 'Apply Revisions'}
            </button>
          </div>
        </form>
      )}

      {viewMode === 'pdf' && selectedEstimate && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10">
                STAGED PDF PREVIEW
              </span>
              <span className="font-semibold text-slate-600">Reviewing Estimate Layout</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print Estimate</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Return to Directory
              </button>
            </div>
          </div>

          <div className="p-12 space-y-8 bg-white max-w-4xl mx-auto min-h-[1056px]">
            {/* Header */}
            <div className="flex justify-between items-start pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#f59e0b] rounded-xl flex items-center justify-center text-white font-black text-2xl">
                    W
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight">Worksuite Enterprise</h1>
                    <p className="text-[10px] text-slate-400 font-bold">Workspace Architecture</p>
                  </div>
                </div>
                <p className="text-slate-500 max-w-xs leading-relaxed font-semibold">
                  104 Cloud Core Row, Suite 400<br />
                  San Francisco, CA 94107<br />
                  billing@worksuite.biz
                </p>
              </div>

              <div className="text-right space-y-1">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Project Estimate</h2>
                <p className="font-mono font-bold text-indigo-600 text-xs">{selectedEstimate.estimateNumber}</p>
                <div className="text-slate-500 font-semibold space-y-0.5 pt-2">
                  <p>Valid Till: <span className="font-bold text-slate-800">{selectedEstimate.validTill}</span></p>
                  <p>Linked Project: <span className="font-bold text-slate-800">{selectedEstimate.projectName || '--'}</span></p>
                  <p>Status: <span className="font-bold text-indigo-600 uppercase text-[10px]">{selectedEstimate.status}</span></p>
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Client Recipient</span>
                <p className="text-xs font-extrabold text-slate-900">{selectedEstimate.clientName}</p>
                <p className="font-bold text-slate-700">{selectedEstimate.clientCompany}</p>
                <p className="text-slate-500">{selectedEstimate.clientEmail}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Pricing Model Scope</span>
                <p className="text-xs font-extrabold text-slate-900">{selectedEstimate.templateName || 'Custom Project Estimation'}</p>
                <p className="font-medium text-slate-500 leading-normal">Agreement covering designated deliverables, commercial frameworks, and operational milestones.</p>
              </div>
            </div>

            {/* Line items */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2.5">Scope Deliverable & Milestones</th>
                  <th className="py-2.5 text-center">Quantity</th>
                  <th className="py-2.5 text-right">Unit Rate</th>
                  <th className="py-2.5 text-center">Tax Surcharge</th>
                  <th className="py-2.5 text-right font-black">Sum Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {selectedEstimate.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-4 pr-6">
                      <p className="font-extrabold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-0.5">{item.description}</p>
                    </td>
                    <td className="py-4 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-4 text-right font-semibold">${item.unitPrice.toLocaleString()}</td>
                    <td className="py-4 text-center font-medium text-slate-500">{item.taxRate}%</td>
                    <td className="py-4 text-right font-extrabold text-slate-950">${(item.quantity * item.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              <div>
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Scope terms & Conditions</span>
                <p className="text-slate-600 leading-relaxed italic">"{selectedEstimate.notes || 'No custom scope notes entered.'}"</p>
                <div className="text-[10px] text-slate-400 leading-normal font-semibold space-y-1 pt-2">
                  <p>• Prices are subject to revision after 45 days.</p>
                  <p>• Conversion to invoice triggers standard payment timelines.</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-600 self-start">
                <div className="flex justify-between items-center">
                  <span>Gross Subtotal:</span>
                  <span className="font-extrabold text-slate-900">${getSubtotal(selectedEstimate.items).toLocaleString()}</span>
                </div>
                {selectedEstimate.discount > 0 && (
                  <div className="flex justify-between items-center text-rose-600">
                    <span>Discount offset:</span>
                    <span className="font-bold">-${getDiscountAmount(getSubtotal(selectedEstimate.items), selectedEstimate.discount, selectedEstimate.discountType).toLocaleString()}</span>
                  </div>
                )}
                {selectedEstimate.tax > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Tax Surcharge ({selectedEstimate.tax}%):</span>
                    <span>+${getTaxAmount(getSubtotal(selectedEstimate.items) - getDiscountAmount(getSubtotal(selectedEstimate.items), selectedEstimate.discount, selectedEstimate.discountType), selectedEstimate.tax).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-black text-slate-950">
                  <span>Calculated Estimation:</span>
                  <span className="text-indigo-600 text-lg">${selectedEstimate.amount.toLocaleString()} USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
