/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Filter, ArrowUpDown, MoreVertical, 
  Eye, Edit, Trash2, Calendar, FileDown, Printer, Check, X,
  PlusCircle, Trash, Download, Sparkles, BookOpen, User, DollarSign,
  ChevronLeft, ChevronRight, HelpCircle, AlertCircle
} from 'lucide-react';
import { Proposal, LineItem } from './types';
import { Client } from '../../types';

interface ProposalViewProps {
  clients: Client[];
}

export default function ProposalView({ clients }: ProposalViewProps) {
  // --- MOCK INITIAL PROPOSALS ---
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 'PROP-001',
      proposalNumber: 'PROP-2026-001',
      leadName: 'Ms. Ashly Klocko',
      clientCompany: 'Vandervort Ltd',
      clientEmail: 'ashly@vandervort.com',
      date: '2026-07-01',
      validTill: '2026-08-01',
      status: 'Waiting',
      currency: 'USD',
      items: [
        { id: '1', name: 'Worksuite Custom Deployment Bundle', description: 'Includes 10 user licenses and cloud sync setup', quantity: 1, unitPrice: 12500, taxRate: 10 },
        { id: '2', name: 'UI/UX Interactive Audit', description: 'Full report on accessibility and design token structures', quantity: 1, unitPrice: 2500, taxRate: 10 }
      ],
      discount: 10,
      discountType: 'percent',
      tax: 10,
      notes: 'Please review the proposal terms. Services will commence within 5 business days of signing.',
      templateName: 'Premium Deployment Template'
    },
    {
      id: 'PROP-002',
      proposalNumber: 'PROP-2026-002',
      leadName: 'Stephen Rogahn',
      clientCompany: 'Barrows, Schoen and Corkery',
      clientEmail: 'stephen@barrows.com',
      date: '2026-06-25',
      validTill: '2026-07-25',
      status: 'Accepted',
      currency: 'USD',
      items: [
        { id: '1', name: 'Custom ERP Module Integration', description: 'Syncing ledger pipelines directly with local banks', quantity: 1, unitPrice: 35000, taxRate: 12 }
      ],
      discount: 1500,
      discountType: 'flat',
      tax: 12,
      notes: 'Confidential proposal for enterprise systems restructuring.',
      templateName: 'Enterprise ERP Template'
    },
    {
      id: 'PROP-003',
      proposalNumber: 'PROP-2026-003',
      leadName: 'Hazle Tillman Sr.',
      clientCompany: 'Kuvalis LLC',
      clientEmail: 'hazle@kuvalis.com',
      date: '2026-06-20',
      validTill: '2026-07-20',
      status: 'Declined',
      currency: 'USD',
      items: [
        { id: '1', name: 'Kubernetes Cluster Provisioning', description: 'High availability scaling in GCP APAC zones', quantity: 1, unitPrice: 8000, taxRate: 8 }
      ],
      discount: 0,
      discountType: 'flat',
      tax: 8,
      notes: 'Valid for 30 days from emission.',
      templateName: 'Cloud Infrastructure Template'
    }
  ]);

  // --- STATE FOR FILTERS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- SORTING STATE ---
  const [sortField, setSortField] = useState<keyof Proposal>('proposalNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // --- CURRENT FORM / DIALOG STATE ---
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'pdf'>('list');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // --- FORM STATE ---
  const [proposalNumber, setProposalNumber] = useState('');
  const [leadName, setLeadName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [date, setDate] = useState('');
  const [validTill, setValidTill] = useState('');
  const [status, setStatus] = useState<Proposal['status']>('Draft');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('percent');
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState('');
  const [templateName, setTemplateName] = useState('Default Standard Template');

  const templates = [
    { name: 'Default Standard Template', desc: 'Sleek professional template with generic legal boilerplate.' },
    { name: 'Premium Deployment Template', desc: 'Optimized for high-end SaaS deployments and license deals.' },
    { name: 'Enterprise ERP Template', desc: 'Structured for multi-phase consulting and migration contracts.' },
    { name: 'Cloud Infrastructure Template', desc: 'Focuses on compute resource breakdown, SLAs, and cluster setups.' }
  ];

  // --- HELPER CALCULATIONS ---
  const getSubtotal = (proposalItems: LineItem[]) => {
    return proposalItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
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

  const getTotalAmount = (proposalItems: LineItem[], disc: number, discType: 'flat' | 'percent', taxRate: number) => {
    const subtotal = getSubtotal(proposalItems);
    const discAmt = getDiscountAmount(subtotal, disc, discType);
    const taxAmt = getTaxAmount(subtotal - discAmt, taxRate);
    return Math.max(0, subtotal - discAmt + taxAmt);
  };

  // --- ACTIONS ---
  const handleSort = (field: keyof Proposal) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleApplyTemplate = (tempName: string) => {
    setTemplateName(tempName);
    if (tempName === 'Premium Deployment Template') {
      setItems([
        { id: '1', name: 'Worksuite Custom Deployment Bundle', description: 'Includes 10 user licenses and cloud sync setup', quantity: 1, unitPrice: 12500, taxRate: 10 },
        { id: '2', name: 'UI/UX Interactive Audit', description: 'Full report on accessibility and design token structures', quantity: 1, unitPrice: 2500, taxRate: 10 }
      ]);
      setDiscount(10);
      setDiscountType('percent');
      setTax(10);
      setNotes('Please review the proposal terms. Services will commence within 5 business days of signing.');
    } else if (tempName === 'Enterprise ERP Template') {
      setItems([
        { id: '1', name: 'Custom ERP Module Integration', description: 'Syncing ledger pipelines directly with local banks', quantity: 1, unitPrice: 35000, taxRate: 12 }
      ]);
      setDiscount(1500);
      setDiscountType('flat');
      setTax(12);
      setNotes('Confidential proposal for enterprise systems restructuring.');
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
      setLeadName(client.name);
      setClientCompany(client.company);
      setClientEmail(client.email);
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
    if (!leadName || items.some(it => !it.name)) {
      alert('Please fill out the customer name and all line item names.');
      return;
    }

    const calculatedTotal = getTotalAmount(items, discount, discountType, tax);

    if (viewMode === 'create') {
      const newProp: Proposal = {
        id: `PROP-${Date.now().toString().slice(-3)}`,
        proposalNumber: proposalNumber || `PROP-2026-${String(proposals.length + 1).padStart(3, '0')}`,
        leadName,
        clientCompany,
        clientEmail,
        date: date || new Date().toISOString().split('T')[0],
        validTill: validTill || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status,
        currency,
        items,
        discount,
        discountType,
        tax,
        notes,
        templateName
      };
      setProposals([newProp, ...proposals]);
    } else {
      // Editing
      if (!selectedProposal) return;
      setProposals(proposals.map(p => {
        if (p.id === selectedProposal.id) {
          return {
            ...p,
            proposalNumber,
            leadName,
            clientCompany,
            clientEmail,
            date,
            validTill,
            status,
            currency,
            items,
            discount,
            discountType,
            tax,
            notes,
            templateName
          };
        }
        return p;
      }));
    }
    setViewMode('list');
    setSelectedProposal(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this proposal?')) {
      setProposals(proposals.filter(p => p.id !== id));
    }
  };

  const handleOpenEdit = (prop: Proposal) => {
    setSelectedProposal(prop);
    setProposalNumber(prop.proposalNumber);
    setLeadName(prop.leadName);
    setClientCompany(prop.clientCompany);
    setClientEmail(prop.clientEmail);
    setDate(prop.date);
    setValidTill(prop.validTill);
    setStatus(prop.status);
    setCurrency(prop.currency);
    setItems(prop.items);
    setDiscount(prop.discount);
    setDiscountType(prop.discountType);
    setTax(prop.tax);
    setNotes(prop.notes);
    setTemplateName(prop.templateName || 'Default Standard Template');
    setViewMode('edit');
    setActiveMenuId(null);
  };

  const handleOpenPdf = (prop: Proposal) => {
    setSelectedProposal(prop);
    setViewMode('pdf');
    setActiveMenuId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- FILTERING LOGIC ---
  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.leadName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.proposalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.clientCompany.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'Expired') {
      matchesDate = new Date(p.validTill) < new Date();
    } else if (dateFilter === 'Active') {
      matchesDate = new Date(p.validTill) >= new Date();
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // --- SORTING LOGIC ---
  const sortedProposals = [...filteredProposals].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'amount') {
      aVal = getTotalAmount(a.items, a.discount, a.discountType, a.tax);
      bVal = getTotalAmount(b.items, b.discount, b.discountType, b.tax);
    }

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(sortedProposals.length / itemsPerPage);
  const paginatedProposals = sortedProposals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <>
          {/* Subtitle and Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Proposals</span>
              <p className="text-2xl font-extrabold text-slate-900">{proposals.length}</p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                <FileText className="h-4 w-4" />
                <span>Across leads pipeline</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Accepted Deals</span>
              <p className="text-2xl font-extrabold text-emerald-600">
                {proposals.filter(p => p.status === 'Accepted').length}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <Check className="h-4 w-4" />
                <span>Conversion: {Math.round((proposals.filter(p => p.status === 'Accepted').length / (proposals.length || 1)) * 100)}%</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Waiting Review</span>
              <p className="text-2xl font-extrabold text-amber-500">
                {proposals.filter(p => p.status === 'Waiting').length}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                <AlertCircle className="h-4 w-4" />
                <span>Require quick follow-up</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Declined Proposals</span>
              <p className="text-2xl font-extrabold text-rose-600">
                {proposals.filter(p => p.status === 'Declined').length}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold">
                <X className="h-4 w-4" />
                <span>Archived sales pitches</span>
              </div>
            </div>
          </div>

          {/* Table Header and Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search proposals, leads, company..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                  onClick={() => {
                    setProposalNumber(`PROP-2026-${String(proposals.length + 1).padStart(3, '0')}`);
                    setLeadName('');
                    setClientCompany('');
                    setClientEmail('');
                    setDate(new Date().toISOString().split('T')[0]);
                    setValidTill(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                    setStatus('Draft');
                    setItems([{ id: '1', name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 }]);
                    setDiscount(0);
                    setTax(0);
                    setNotes('');
                    setViewMode('create');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Proposal</span>
                </button>
              </div>
            </div>

            {/* Filter Panel Drawer */}
            {showFilters && (
              <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select
                    className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Waiting">Waiting Review</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Validity Timeline</label>
                  <select
                    className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="All">All Dates</option>
                    <option value="Active">Active Proposals</option>
                    <option value="Expired">Expired Proposals</option>
                  </select>
                </div>
              </div>
            )}

            {/* Table Area */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5 cursor-pointer select-none" onClick={() => handleSort('proposalNumber')}>
                      <div className="flex items-center gap-1.5">
                        <span>Proposal ID</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 cursor-pointer select-none" onClick={() => handleSort('leadName')}>
                      <div className="flex items-center gap-1.5">
                        <span>Lead Customer</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 cursor-pointer select-none" onClick={() => handleSort('date')}>
                      <div className="flex items-center gap-1.5">
                        <span>Date Emitted</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 cursor-pointer select-none" onClick={() => handleSort('validTill')}>
                      <div className="flex items-center gap-1.5">
                        <span>Valid Till</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-right">Estimated Valuation</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedProposals.length > 0 ? (
                    paginatedProposals.map(p => {
                      const totalAmt = getTotalAmount(p.items, p.discount, p.discountType, p.tax);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/40">
                          <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{p.proposalNumber}</td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-slate-800">{p.leadName}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{p.clientCompany}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-500">{p.date}</td>
                          <td className="px-6 py-4 font-mono">
                            <span className={new Date(p.validTill) < new Date() ? 'text-rose-600 font-semibold' : 'text-slate-500'}>
                              {p.validTill}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-extrabold text-slate-900">
                            ${totalAmt.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' :
                              p.status === 'Waiting' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10' :
                              p.status === 'Declined' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10' :
                              'bg-slate-100 text-slate-700 ring-1 ring-slate-600/10'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right relative">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenPdf(p)}
                                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                                title="View Proposal PDF"
                              >
                                <Eye className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                                title="Edit Proposal"
                              >
                                <Edit className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        <FileText className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                        <span>No proposals found matching the criteria.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedProposals.length)} of {sortedProposals.length} proposals</span>
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
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        currentPage === idx + 1 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 capitalize">
                {viewMode === 'create' ? 'Assemble Custom Pitch Proposal' : 'Revise Active Sales Proposal'}
              </h3>
              <p className="text-[10px] text-slate-500">Formulate strategic solutions, price catalogs, and client terms.</p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Template Selector Section */}
            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/60 space-y-3">
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                <span>Accelerate with Proposal Templates</span>
              </span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {templates.map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyTemplate(t.name)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer text-left space-y-1 ${
                      templateName === t.name 
                        ? 'bg-white border-indigo-600 shadow-sm shadow-indigo-600/5 ring-1 ring-indigo-600/20' 
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-bold text-slate-900 leading-tight truncate">{t.name}</p>
                    <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Proposal ID *</label>
                <input
                  type="text" required
                  placeholder="PROP-2026-001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  value={proposalNumber}
                  onChange={(e) => setProposalNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Client Lead</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  onChange={(e) => handleClientChange(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>-- Or pick from CRM Clients --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Customer Name *</label>
                <input
                  type="text" required
                  placeholder="e.g. Stephen Rogahn"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Kuvalis LLC"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Customer Email *</label>
                <input
                  type="email" required
                  placeholder="client@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date Logged</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Proposal Status</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Proposal['status'])}
                >
                  <option value="Draft">Draft</option>
                  <option value="Waiting">Waiting review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
            </div>

            {/* Line Items Builder */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Services / Products Breakdown</span>
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
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Item Name *</label>
                      <input
                        type="text" required
                        placeholder="e.g. Worksuite Core Setup"
                        className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none text-xs"
                        value={item.name}
                        onChange={(e) => handleItemFieldChange(item.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Short Scope Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Configuration and workspace assets transfer"
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
                        className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none text-xs text-center"
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

            {/* Calculations & Discounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Strategic Terms & Pitch Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Enter special terms, warranties, SLA descriptions, and attachment links..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Currency</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200/80 space-y-4 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
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
                  <span>Calculated Discount:</span>
                  <span className="text-rose-600 font-bold">-${getDiscountAmount(getSubtotal(items), discount, discountType).toLocaleString()}</span>
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Tax Surcharge (%)</label>
                  <input
                    type="number" min={0} max={100}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                  />
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Tax Amount:</span>
                  <span>+${getTaxAmount(getSubtotal(items) - getDiscountAmount(getSubtotal(items), discount, discountType), tax).toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-black text-slate-950">
                  <span>valuation Total:</span>
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl cursor-pointer shadow-sm shadow-indigo-600/10"
            >
              {viewMode === 'create' ? 'Emit Proposal' : 'Apply Revisions'}
            </button>
          </div>
        </form>
      )}

      {viewMode === 'pdf' && selectedProposal && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
          {/* Action Header bar (Invisible in Print) */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10 animate-pulse">
                PDF Rendering Client
              </span>
              <span className="font-semibold text-slate-600">Reviewing Proposal layout</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="h-4 w-4" />
                <span>Print Pitch</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Return to Directory
              </button>
            </div>
          </div>

          {/* PDF CANVAS (This content layout mirrors a printed receipt or letter) */}
          <div className="p-12 space-y-8 bg-white max-w-4xl mx-auto border-x border-slate-100/50 min-h-[1056px]">
            {/* Branded Letterhead */}
            <div className="flex justify-between items-start pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#f59e0b] rounded-xl flex items-center justify-center text-white font-black text-2xl">
                    W
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight">Worksuite Enterprise</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Enterprise Agile Workspace</p>
                  </div>
                </div>
                <p className="text-slate-500 max-w-xs leading-relaxed font-semibold">
                  104 Cloud Core Row, Suite 400<br />
                  San Francisco, CA 94107<br />
                  contact@worksuite.biz
                </p>
              </div>

              <div className="text-right space-y-1">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Sales Proposal</h2>
                <p className="font-mono font-bold text-indigo-600 text-xs">{selectedProposal.proposalNumber}</p>
                <div className="text-slate-500 font-semibold space-y-0.5 pt-2">
                  <p>Date Emitted: <span className="font-bold text-slate-800">{selectedProposal.date}</span></p>
                  <p>Valid Until: <span className="font-bold text-slate-800">{selectedProposal.validTill}</span></p>
                  <p>Status: <span className="font-bold text-indigo-600 uppercase text-[10px]">{selectedProposal.status}</span></p>
                </div>
              </div>
            </div>

            {/* Party addresses */}
            <div className="grid grid-cols-2 gap-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Prepared For</span>
                <p className="text-xs font-extrabold text-slate-900">{selectedProposal.leadName}</p>
                <p className="font-bold text-slate-700">{selectedProposal.clientCompany}</p>
                <p className="text-slate-500">{selectedProposal.clientEmail}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Proposal Template Context</span>
                <p className="text-xs font-extrabold text-slate-900">{selectedProposal.templateName || 'Standard Custom Proposal'}</p>
                <p className="font-medium text-slate-500 leading-normal">Agreement covering designated deliverables, commercial frameworks, and operational SLAs.</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2.5">Scope Deliverable & Services</th>
                    <th className="py-2.5 text-center">Quantity</th>
                    <th className="py-2.5 text-right">Unit Price</th>
                    <th className="py-2.5 text-center">Tax Rate</th>
                    <th className="py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {selectedProposal.items.map(item => (
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
            </div>

            {/* Summary Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              <div className="space-y-3">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Boilerplate Terms & Notes</span>
                <p className="text-slate-600 leading-relaxed italic">"{selectedProposal.notes || 'No custom scope notes entered.'}"</p>
                <div className="text-[10px] text-slate-400 leading-normal font-semibold space-y-1">
                  <p>• All rates are quoted in {selectedProposal.currency}.</p>
                  <p>• Services will be initiated upon formal acceptance and signature of the parties.</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-600 self-start">
                <div className="flex justify-between items-center">
                  <span>Gross Subtotal:</span>
                  <span className="font-extrabold text-slate-900">${getSubtotal(selectedProposal.items).toLocaleString()}</span>
                </div>
                {selectedProposal.discount > 0 && (
                  <div className="flex justify-between items-center text-rose-600">
                    <span>Discount applied ({selectedProposal.discountType === 'percent' ? `${selectedProposal.discount}%` : 'flat'}):</span>
                    <span className="font-bold">-${getDiscountAmount(getSubtotal(selectedProposal.items), selectedProposal.discount, selectedProposal.discountType).toLocaleString()}</span>
                  </div>
                )}
                {selectedProposal.tax > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Tax Surcharge ({selectedProposal.tax}%):</span>
                    <span>+${getTaxAmount(getSubtotal(selectedProposal.items) - getDiscountAmount(getSubtotal(selectedProposal.items), selectedProposal.discount, selectedProposal.discountType), selectedProposal.tax).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-black text-slate-950">
                  <span>Valuation Total:</span>
                  <span className="text-indigo-600 text-lg">${getTotalAmount(selectedProposal.items, selectedProposal.discount, selectedProposal.discountType, selectedProposal.tax).toLocaleString()} {selectedProposal.currency}</span>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-12 grid grid-cols-2 gap-12 text-center text-slate-400 text-[10px] font-bold">
              <div className="space-y-12">
                <p>Authorized Worksuite Representative</p>
                <div className="border-b border-slate-200 mx-10 pb-2">
                  <span className="font-serif italic text-base text-slate-800">Eldora Mann MD</span>
                </div>
                <p>Signature & Date</p>
              </div>

              <div className="space-y-12">
                <p>Accepted Client Lead Authorized Representative</p>
                <div className="border-b border-slate-200 mx-10 pb-6 h-6">
                  {selectedProposal.status === 'Accepted' && (
                    <span className="font-serif italic text-base text-slate-800">{selectedProposal.leadName}</span>
                  )}
                </div>
                <p>Signature & Date</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
