/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Filter, ArrowUpDown, MoreVertical, 
  Check, X, Download, DollarSign, ChevronLeft, ChevronRight,
  PlusCircle, Trash, Sparkles, Printer, Eye, Edit, Trash2, HelpCircle
} from 'lucide-react';
import { CreditNoteRecord } from './types';
import { Invoice } from '../../types';

interface CreditNoteViewProps {
  invoices: Invoice[];
  onAddCreditNote?: (note: CreditNoteRecord) => void;
}

export default function CreditNoteView({ invoices, onAddCreditNote }: CreditNoteViewProps) {
  // --- MOCK INITIAL CREDIT NOTES ---
  const [creditNotes, setCreditNotes] = useState<CreditNoteRecord[]>([
    {
      id: 'CN-301',
      creditNoteNumber: 'CN-2026-301',
      invoiceId: 'INV-802',
      invoiceNumber: 'INV-2026-002',
      clientName: 'Cyberdyne Systems',
      clientCompany: 'Cyberdyne Research Labs',
      amount: 1500,
      date: '2026-06-29',
      reason: 'Sandbox schema adjustments & unused subscription nodes credit.',
      status: 'Unused'
    },
    {
      id: 'CN-302',
      creditNoteNumber: 'CN-2026-302',
      invoiceId: 'INV-803',
      invoiceNumber: 'INV-2026-003',
      clientName: 'Miller Enterprises',
      clientCompany: 'Miller Retail & logistics',
      amount: 3200,
      date: '2026-05-15',
      reason: 'Refunded due to discount adjustment on Checkout audit contract.',
      status: 'Refunded'
    }
  ]);

  // --- FILTERS & STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // --- PAGINATION & SORT ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState<keyof CreditNoteRecord>('creditNoteNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // --- FORM STATE ---
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'pdf'>('list');
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNoteRecord | null>(null);

  const [creditNoteNumber, setCreditNoteNumber] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<CreditNoteRecord['status']>('Unused');

  const reasons = [
    'Discount Adjustment Offset',
    'Unused Cloud Node Subscription Licenses',
    'Deficiency in Initial Project Deliverables',
    'Custom Resolution Refund Agreement'
  ];

  // --- ACTIONS ---
  const handleSort = (field: keyof CreditNoteRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleApplyRefund = (id: string, actionType: 'Apply' | 'Refund') => {
    setCreditNotes(creditNotes.map(cn => {
      if (cn.id === id) {
        return { ...cn, status: actionType === 'Apply' ? 'Applied' : 'Refunded' };
      }
      return cn;
    }));
    alert(`Success! Credit note status updated to ${actionType === 'Apply' ? 'Applied' : 'Refunded'}.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId || amount <= 0) {
      alert('Please link a valid invoice and state a non-zero credit valuation.');
      return;
    }

    const linkedInvoice = invoices.find(inv => inv.id === invoiceId);
    const clientName = linkedInvoice ? linkedInvoice.clientName : 'Unknown Client';
    const clientCompany = linkedInvoice ? (linkedInvoice as any).clientCompany || 'Corporate Group' : 'Corporate Group';
    const invoiceNumber = linkedInvoice ? linkedInvoice.invoiceNumber : 'INV-Unknown';

    if (viewMode === 'create') {
      const newCN: CreditNoteRecord = {
        id: `CN-${Date.now().toString().slice(-3)}`,
        creditNoteNumber: creditNoteNumber || `CN-2026-${String(creditNotes.length + 301).padStart(3, '0')}`,
        invoiceId,
        invoiceNumber,
        clientName,
        clientCompany,
        amount,
        date: date || new Date().toISOString().split('T')[0],
        reason,
        status
      };
      setCreditNotes([newCN, ...creditNotes]);
      if (onAddCreditNote) {
        onAddCreditNote(newCN);
      }
    } else {
      if (!selectedCreditNote) return;
      setCreditNotes(creditNotes.map(item => {
        if (item.id === selectedCreditNote.id) {
          return {
            ...item,
            creditNoteNumber,
            invoiceId,
            invoiceNumber,
            clientName,
            clientCompany,
            amount,
            date,
            reason,
            status
          };
        }
        return item;
      }));
    }

    setViewMode('list');
    setSelectedCreditNote(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this credit note?')) {
      setCreditNotes(creditNotes.filter(item => item.id !== id));
    }
  };

  const handleOpenEdit = (cn: CreditNoteRecord) => {
    setSelectedCreditNote(cn);
    setCreditNoteNumber(cn.creditNoteNumber);
    setInvoiceId(cn.invoiceId);
    setAmount(cn.amount);
    setDate(cn.date);
    setReason(cn.reason);
    setStatus(cn.status);
    setViewMode('edit');
  };

  const handleOpenPdf = (cn: CreditNoteRecord) => {
    setSelectedCreditNote(cn);
    setViewMode('pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  // --- FILTERING ---
  const filteredNotes = creditNotes.filter(cn => {
    const matchesSearch = cn.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cn.creditNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cn.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || cn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- SORTING ---
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(sortedNotes.length / itemsPerPage);
  const paginatedNotes = sortedNotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <>
          {/* Quick Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Credit Issued</span>
              <p className="text-2xl font-extrabold text-slate-900">
                ${creditNotes.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                <FileText className="h-4 w-4" />
                <span>Adjustments and offsets pipeline</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Available Credit / Unused</span>
              <p className="text-2xl font-extrabold text-amber-500">
                ${creditNotes.filter(cn => cn.status === 'Unused').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>Awaiting client application</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Refunded Cash / Applied</span>
              <p className="text-2xl font-extrabold text-emerald-600">
                ${creditNotes.filter(cn => cn.status === 'Applied' || cn.status === 'Refunded').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Check className="h-4 w-4" />
                <span>Fully reconciled ledger credits</span>
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
                  placeholder="Search credit notes, linked invoice, clients..."
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
                    setCreditNoteNumber(`CN-2026-${String(creditNotes.length + 301).padStart(3, '0')}`);
                    setInvoiceId('');
                    setAmount(0);
                    setDate(new Date().toISOString().split('T')[0]);
                    setReason('');
                    setStatus('Unused');
                    setViewMode('create');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Credit Note</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 bg-slate-50 border-b border-slate-100 animate-fade-in text-xs">
                <div className="max-w-xs">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status Badges</label>
                  <select
                    className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All credit types</option>
                    <option value="Unused">Unused / Available</option>
                    <option value="Applied">Applied directly</option>
                    <option value="Refunded">Refunded Cash</option>
                  </select>
                </div>
              </div>
            )}

            {/* Credit Note Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('creditNoteNumber')}>
                      <div className="flex items-center gap-1">
                        <span>Note ID</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Invoice Link</th>
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('clientName')}>
                      <div className="flex items-center gap-1">
                        <span>Client Entity</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Refund/Credit Reason</th>
                    <th className="px-6 py-3.5 text-right">Available Credit</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedNotes.length > 0 ? (
                    paginatedNotes.map(cn => (
                      <tr key={cn.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{cn.creditNoteNumber}</td>
                        <td className="px-6 py-4 text-slate-600 font-mono font-bold">{cn.invoiceNumber}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800">{cn.clientName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{cn.clientCompany}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate font-medium">{cn.reason}</td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-900">${cn.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            cn.status === 'Applied' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' :
                            cn.status === 'Refunded' ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/10' :
                            'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10'
                          }`}>
                            {cn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {cn.status === 'Unused' && (
                              <>
                                <button
                                  onClick={() => handleApplyRefund(cn.id, 'Apply')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2 py-1.5 rounded cursor-pointer"
                                  title="Apply credit directly"
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={() => handleApplyRefund(cn.id, 'Refund')}
                                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] px-2 py-1.5 rounded cursor-pointer"
                                  title="Refund money"
                                >
                                  Refund
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleOpenPdf(cn)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 cursor-pointer"
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(cn)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 cursor-pointer"
                            >
                              <Edit className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(cn.id)}
                              className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
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
                        <span>No credit adjustments logged.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedNotes.length)} of {sortedNotes.length} credit notes</span>
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

      {(viewMode === 'create' || viewMode === 'edit') && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {viewMode === 'create' ? 'Assemble Corporate Credit Note' : 'Revise Active Credit Note'}
              </h3>
              <p className="text-[10px] text-slate-500">Formulate ledger adjustments, offset available credit, or link cash refunds.</p>
            </div>
            <button type="button" onClick={() => setViewMode('list')} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Reasons Helper */}
            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-3">
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Predefined Resolution Templates</span>
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {reasons.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`p-2 rounded text-left border hover:bg-slate-50 transition-all font-semibold ${
                      reason === r ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Credit Note ID *</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono font-bold"
                  value={creditNoteNumber}
                  onChange={(e) => setCreditNoteNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Link Active Invoice *</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={invoiceId}
                  onChange={(e) => {
                    setInvoiceId(e.target.value);
                    const linked = invoices.find(inv => inv.id === e.target.value);
                    if (linked) setAmount(linked.amount * 0.1); // suggest 10% credit as starting default
                  }}
                >
                  <option value="" disabled>-- Pick Linked Invoice --</option>
                  {invoices.map(inv => (
                    <option key={inv.id} value={inv.id}>{inv.invoiceNumber} ({inv.clientName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Credit Valuation ($) *</label>
                <input
                  type="number" required min={1}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-extrabold"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Adjustment Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Credit Note Status</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="Unused">Unused / Available Balance</option>
                  <option value="Applied">Applied Directly to Invoice</option>
                  <option value="Refunded">Refunded Cash / ACH Back</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Detailed Reason Memo</label>
                <textarea
                  rows={2}
                  placeholder="Enter deep technical details regarding invoice credits..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none text-xs"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
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
              Emit Credit Note
            </button>
          </div>
        </form>
      )}

      {viewMode === 'pdf' && selectedCreditNote && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 ring-1 ring-amber-600/10 animate-pulse">
                PDF GENERATED
              </span>
              <span className="font-semibold text-slate-600">Reviewing credit note ledger</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print Adjustment</span>
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
                    <p className="text-[10px] text-slate-400 font-bold">Ledger Reconciliation</p>
                  </div>
                </div>
                <p className="text-slate-500 max-w-xs leading-relaxed font-semibold">
                  104 Cloud Core Row, Suite 400<br />
                  San Francisco, CA 94107<br />
                  finance@worksuite.biz
                </p>
              </div>

              <div className="text-right space-y-1">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Credit Note</h2>
                <p className="font-mono font-bold text-indigo-600 text-xs">{selectedCreditNote.creditNoteNumber}</p>
                <div className="text-slate-500 font-semibold space-y-0.5 pt-2">
                  <p>Adjustment Date: <span className="font-bold text-slate-800">{selectedCreditNote.date}</span></p>
                  <p>Linked Invoice ID: <span className="font-bold text-slate-800 font-mono">{selectedCreditNote.invoiceNumber}</span></p>
                  <p>Credit Status: <span className="font-bold text-indigo-600 uppercase text-[10px]">{selectedCreditNote.status}</span></p>
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="grid grid-cols-2 gap-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Client Entity Context</span>
                <p className="text-xs font-extrabold text-slate-900">{selectedCreditNote.clientName}</p>
                <p className="font-bold text-slate-700">{selectedCreditNote.clientCompany}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Total Reconciled credit</span>
                <p className="text-2xl font-black text-indigo-600">${selectedCreditNote.amount.toLocaleString()} USD</p>
                <p className="text-[10px] text-slate-400 font-bold leading-normal">Fully backed by verified corporate treasury reserves.</p>
              </div>
            </div>

            {/* Scope Explanation */}
            <div className="space-y-2 py-4 border-b border-t border-slate-100">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Reconciliation Reason & Scope Terms</span>
              <p className="text-slate-700 leading-relaxed italic text-sm">
                "{selectedCreditNote.reason || 'No detailed memo logged.'}"
              </p>
              <div className="text-[10px] text-slate-400 leading-normal font-semibold space-y-1 pt-4">
                <p>• The client is authorized to apply this credit note balance against any active unpaid invoices.</p>
                <p>• Refunded balances are paid out via corporate ACH wires and settle within 3-5 standard banking days.</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-12 grid grid-cols-2 gap-12 text-center text-slate-400 text-[10px] font-bold">
              <div className="space-y-12">
                <p>Authorized Worksuite Auditor</p>
                <div className="border-b border-slate-200 mx-10 pb-2">
                  <span className="font-serif italic text-base text-slate-800">Eldora Mann MD</span>
                </div>
                <p>Signature & Date</p>
              </div>

              <div className="space-y-12">
                <p>Client Recipient Entity Acknowledgment</p>
                <div className="border-b border-slate-200 mx-10 pb-6 h-6">
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
