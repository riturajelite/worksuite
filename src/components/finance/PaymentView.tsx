/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Filter, ArrowUpDown, MoreVertical, 
  Check, X, Upload, Download, CreditCard, Landmark, DollarSign,
  ChevronLeft, ChevronRight, HelpCircle, Layers, FileImage, Trash2, PlusCircle
} from 'lucide-react';
import { PaymentRecord } from './types';
import { Invoice } from '../../types';

interface PaymentViewProps {
  invoices: Invoice[];
  onAddPayment: (invoiceId: string, amount: number) => void;
}

export default function PaymentView({ invoices, onAddPayment }: PaymentViewProps) {
  // --- MOCK INITIAL PAYMENTS ---
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: 'PAY-201',
      invoiceId: 'INV-801',
      invoiceNumber: 'INV-2026-001',
      clientName: 'Wayne Enterprises',
      clientCompany: 'Wayne Enterprises Corp',
      amount: 23000,
      paymentDate: '2026-06-16',
      gateway: 'Stripe API',
      transactionId: 'ch_8902_settle_99',
      bankAccount: 'Silicon Valley checking •••• 8910',
      status: 'Completed',
      receiptFile: 'receipt_inv_801.pdf'
    },
    {
      id: 'PAY-202',
      invoiceId: 'INV-803',
      invoiceNumber: 'INV-2026-003',
      clientName: 'Miller Enterprises',
      clientCompany: 'Miller Retail & logistics',
      amount: 18000,
      paymentDate: '2026-05-11',
      gateway: 'PayPal Business',
      transactionId: 'txn_92011_paypal_ref',
      bankAccount: 'PayPal Virtual Balance Account',
      status: 'Completed',
      receiptFile: 'receipt_paypal_92011.png'
    }
  ]);

  // --- FILTERS & STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // --- PAGINATION & SORT ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState<keyof PaymentRecord>('paymentDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // --- FORM STATE ---
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'add-bulk'>('list');
  
  // Single Payment form state
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState('');
  const [gateway, setGateway] = useState('Stripe API');
  const [transactionId, setTransactionId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Bulk Payment state (list of transactions to add at once)
  const [bulkPayments, setBulkPayments] = useState([
    { invoiceId: '', amount: 0, gateway: 'Stripe API', transactionId: '', bankAccount: '' }
  ]);

  // --- DRAG & DROP UPLOAD HELPER ---
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
      setReceiptFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0].name);
    }
  };

  // --- ACTIONS ---
  const handleSort = (field: keyof PaymentRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId || amount <= 0) {
      alert('Please select a valid invoice and specify a payment amount.');
      return;
    }

    // Find linked invoice to pull client information
    const linkedInvoice = invoices.find(inv => inv.id === invoiceId);
    const clientName = linkedInvoice ? linkedInvoice.clientName : 'Unknown Client';
    const invoiceNumber = linkedInvoice ? linkedInvoice.invoiceNumber : 'INV-Unknown';

    const newPay: PaymentRecord = {
      id: `PAY-${Date.now().toString().slice(-3)}`,
      invoiceId,
      invoiceNumber,
      clientName,
      clientCompany: linkedInvoice ? (linkedInvoice as any).clientCompany || 'Corporate Group' : 'Corporate Group',
      amount,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      gateway,
      transactionId: transactionId || `ch_${Math.random().toString(36).substring(4, 10)}`,
      bankAccount: bankAccount || 'Silicon Valley checking •••• 8910',
      status: 'Completed',
      receiptFile: receiptFile || undefined
    };

    setPayments([newPay, ...payments]);
    onAddPayment(invoiceId, amount);

    setViewMode('list');
    resetSingleForm();
  };

  const resetSingleForm = () => {
    setInvoiceId('');
    setAmount(0);
    setPaymentDate('');
    setGateway('Stripe API');
    setTransactionId('');
    setBankAccount('');
    setReceiptFile(null);
  };

  // Bulk Actions
  const handleAddBulkRow = () => {
    setBulkPayments([
      ...bulkPayments,
      { invoiceId: '', amount: 0, gateway: 'Stripe API', transactionId: '', bankAccount: '' }
    ]);
  };

  const handleRemoveBulkRow = (index: number) => {
    if (bulkPayments.length === 1) return;
    setBulkPayments(bulkPayments.filter((_, idx) => idx !== index));
  };

  const handleBulkFieldChange = (index: number, field: string, value: any) => {
    setBulkPayments(bulkPayments.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validatedBulk = bulkPayments.filter(b => b.invoiceId && b.amount > 0);
    if (validatedBulk.length === 0) {
      alert('Please fill out at least one valid payment line.');
      return;
    }

    const newPaymentRecords: PaymentRecord[] = validatedBulk.map((b, idx) => {
      const linkedInvoice = invoices.find(inv => inv.id === b.invoiceId);
      return {
        id: `PAY-${Date.now().toString().slice(-3)}-${idx}`,
        invoiceId: b.invoiceId,
        invoiceNumber: linkedInvoice ? linkedInvoice.invoiceNumber : 'INV-Unknown',
        clientName: linkedInvoice ? linkedInvoice.clientName : 'Unknown Client',
        clientCompany: linkedInvoice ? (linkedInvoice as any).clientCompany || 'Corporate Group' : 'Corporate Group',
        amount: b.amount,
        paymentDate: new Date().toISOString().split('T')[0],
        gateway: b.gateway,
        transactionId: b.transactionId || `ch_${Math.random().toString(36).substring(4, 10)}`,
        bankAccount: b.bankAccount || 'Silicon Valley checking •••• 8910',
        status: 'Completed'
      };
    });

    setPayments([...newPaymentRecords, ...payments]);
    newPaymentRecords.forEach(rec => {
      onAddPayment(rec.invoiceId, rec.amount);
    });

    setViewMode('list');
    setBulkPayments([{ invoiceId: '', amount: 0, gateway: 'Stripe API', transactionId: '', bankAccount: '' }]);
  };

  const handleDeletePayment = (id: string) => {
    if (confirm('Are you sure you want to delete this payment record?')) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  // --- FILTERING ---
  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGateway = gatewayFilter === 'All' || p.gateway === gatewayFilter;
    return matchesSearch && matchesGateway;
  });

  // --- SORTING ---
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
  const paginatedPayments = sortedPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Payments Collected</span>
              <p className="text-2xl font-extrabold text-slate-900">{payments.length}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Check className="h-4 w-4" />
                <span>Cleared corporate settlements</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Cash Inflow</span>
              <p className="text-2xl font-extrabold text-emerald-600">
                ${payments.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                <Landmark className="h-4 w-4" />
                <span>Liquid cash accounts balance</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Awaiting Settlement</span>
              <p className="text-2xl font-extrabold text-amber-500">
                ${invoices.filter(i => i.status === 'Unpaid').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                <CreditCard className="h-4 w-4" />
                <span>Standard outstanding pipeline</span>
              </div>
            </div>
          </div>

          {/* Table Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transaction ID, invoice number, client name..."
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
                  onClick={() => setViewMode('add-bulk')}
                  className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="h-4 w-4 text-slate-400" />
                  <span>Bulk Payment</span>
                </button>

                <button
                  onClick={() => {
                    resetSingleForm();
                    setPaymentDate(new Date().toISOString().split('T')[0]);
                    setViewMode('add');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Payment</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 bg-slate-50 border-b border-slate-100 animate-fade-in text-xs">
                <div className="max-w-xs">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gateway Gateway</label>
                  <select
                    className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none"
                    value={gatewayFilter}
                    onChange={(e) => setGatewayFilter(e.target.value)}
                  >
                    <option value="All">All Gateways</option>
                    <option value="Stripe API">Stripe API</option>
                    <option value="PayPal Business">PayPal Business</option>
                    <option value="Bank Wire">Bank Wire</option>
                  </select>
                </div>
              </div>
            )}

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('paymentDate')}>
                      <div className="flex items-center gap-1">
                        <span>Payment Date</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Settled Invoice</th>
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('clientName')}>
                      <div className="flex items-center gap-1">
                        <span>Paid By</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-right font-black">Amount Settled</th>
                    <th className="px-6 py-3.5">Gateway Info</th>
                    <th className="px-6 py-3.5 font-mono">Transaction Code</th>
                    <th className="px-6 py-3.5 text-right">Receipt / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-mono text-slate-500">{p.paymentDate}</td>
                        <td className="px-6 py-4 font-bold text-indigo-600 font-mono">{p.invoiceNumber}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800">{p.clientName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{p.clientCompany}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-emerald-600">${p.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-slate-600">{p.gateway}</td>
                        <td className="px-6 py-4 font-mono text-slate-500 text-[10px]">{p.transactionId}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            {p.receiptFile ? (
                              <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); alert(`Downloading simulated receipt file: ${p.receiptFile}`); }}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-600 hover:bg-slate-100"
                                title="Download uploaded receipt file"
                              >
                                <Download className="h-3 w-3" />
                                <span>Receipt</span>
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-400">No Receipt</span>
                            )}
                            <button
                              onClick={() => handleDeletePayment(p.id)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded"
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
                        <CreditCard className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                        <span>No corporate payment transactions found.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedPayments.length)} of {sortedPayments.length} payments</span>
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
        <form onSubmit={handleSingleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Add Payment Record</h3>
              <p className="text-[10px] text-slate-500">Record payments received, transaction gateways, and link with active outstanding invoices.</p>
            </div>
            <button type="button" onClick={() => setViewMode('list')} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Link Active Invoice *</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={invoiceId}
                  onChange={(e) => {
                    setInvoiceId(e.target.value);
                    const linked = invoices.find(inv => inv.id === e.target.value);
                    if (linked) setAmount(linked.amount);
                  }}
                >
                  <option value="" disabled>-- Pick Outstanding Invoice --</option>
                  {invoices.filter(i => i.status !== 'Paid').map(inv => (
                    <option key={inv.id} value={inv.id}>{inv.invoiceNumber} - {inv.clientName} (${inv.amount.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Amount Received ($) *</label>
                <input
                  type="number" required min={1}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-extrabold"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Payment Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Payment Gateway *</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-semibold"
                  value={gateway}
                  onChange={(e) => setGateway(e.target.value)}
                >
                  <option value="Stripe API">Stripe API Gateway</option>
                  <option value="PayPal Business">PayPal Business</option>
                  <option value="Bank Wire">Bank Wire Transfer</option>
                  <option value="Cash/Cheque">Cash or Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Transaction Ref / ID</label>
                <input
                  type="text"
                  placeholder="e.g. ch_9100_custom"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Treasury Account</label>
                <input
                  type="text"
                  placeholder="e.g. SVB checking •••• 8910"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                />
              </div>
            </div>

            {/* Receipt upload - drag & drop */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Settlement Receipt</label>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  dragActive ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 bg-slate-50/30 hover:bg-slate-50"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('receipt-upload-input')?.click()}
              >
                <input
                  type="file"
                  id="receipt-upload-input"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Upload className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Drag & Drop transaction receipt here, or <span className="text-indigo-600 hover:underline">browse files</span></p>
                <p className="text-[10px] text-slate-400 mt-1">Supports PDF, PNG, JPG files up to 10MB</p>
                {receiptFile && (
                  <div className="mt-4 p-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center gap-1.5 text-indigo-700 font-bold max-w-xs mx-auto text-[11px]">
                    <FileImage className="h-4 w-4" />
                    <span className="truncate">{receiptFile}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setReceiptFile(null); }} className="p-0.5 hover:bg-indigo-100 rounded text-indigo-600">
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
              Commit Payment
            </button>
          </div>
        </form>
      )}

      {viewMode === 'add-bulk' && (
        <form onSubmit={handleBulkSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Add Bulk Payments</h3>
              <p className="text-[10px] text-slate-500">Record multiple incoming client transactions simultaneously to clear accounts fast.</p>
            </div>
            <button type="button" onClick={() => setViewMode('list')} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Transaction Registry Rows</span>
              <button
                type="button"
                onClick={handleAddBulkRow}
                className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-3">
              {bulkPayments.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                  <div className="md:col-span-3">
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Link Outstanding Invoice *</label>
                    <select
                      required
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                      value={row.invoiceId}
                      onChange={(e) => {
                        handleBulkFieldChange(idx, 'invoiceId', e.target.value);
                        const linked = invoices.find(inv => inv.id === e.target.value);
                        if (linked) handleBulkFieldChange(idx, 'amount', linked.amount);
                      }}
                    >
                      <option value="" disabled>-- Pick Invoice --</option>
                      {invoices.filter(i => i.status !== 'Paid').map(inv => (
                        <option key={inv.id} value={inv.id}>{inv.invoiceNumber} ({inv.clientName})</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Amount Billed ($) *</label>
                    <input
                      type="number" required min={1}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none font-bold"
                      value={row.amount || ''}
                      onChange={(e) => handleBulkFieldChange(idx, 'amount', Number(e.target.value))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Gateway *</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                      value={row.gateway}
                      onChange={(e) => handleBulkFieldChange(idx, 'gateway', e.target.value)}
                    >
                      <option value="Stripe API">Stripe API</option>
                      <option value="PayPal Business">PayPal Business</option>
                      <option value="Bank Wire">Bank Wire</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Transaction Code Ref</label>
                    <input
                      type="text"
                      placeholder="e.g. ch_bulk_801"
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none font-mono"
                      value={row.transactionId}
                      onChange={(e) => handleBulkFieldChange(idx, 'transactionId', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Treasury Account</label>
                    <input
                      type="text"
                      placeholder="e.g. checking •••• 8910"
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                      value={row.bankAccount}
                      onChange={(e) => handleBulkFieldChange(idx, 'bankAccount', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-center pt-3">
                    <button
                      type="button"
                      disabled={bulkPayments.length === 1}
                      onClick={() => handleRemoveBulkRow(idx)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 text-slate-400 disabled:opacity-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
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
              Commit Bulk Settlement
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
