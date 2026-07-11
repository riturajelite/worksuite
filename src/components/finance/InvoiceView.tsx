/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Filter, ArrowUpDown, MoreVertical, 
  Eye, Edit, Trash2, Calendar, Printer, Check, X,
  PlusCircle, Trash, Sparkles, User, DollarSign,
  ChevronLeft, ChevronRight, RefreshCw, Landmark, HelpCircle, Ship, MapPin, AlertCircle
} from 'lucide-react';
import { InvoiceDetail, LineItem } from './types';
import { Invoice, Client, Project } from '../../types';

interface InvoiceViewProps {
  invoices: Invoice[];
  clients: Client[];
  projects: Project[];
  onPayInvoice: (id: string) => void;
  // Callback when local invoices are added or modified
  onAddLocalInvoice?: (newInv: Invoice) => void;
}

export default function InvoiceView({ invoices, clients, projects, onPayInvoice, onAddLocalInvoice }: InvoiceViewProps) {
  // --- SYNC LOCAL AND GLOBAL INVOICES ---
  const [localInvoiceDetails, setLocalInvoiceDetails] = useState<InvoiceDetail[]>([
    {
      id: 'INV-801',
      invoiceNumber: 'INV-2026-001',
      clientName: 'Wayne Enterprises',
      clientCompany: 'Wayne Enterprises Corp',
      clientEmail: 'finance@wayne.com',
      projectName: 'SaaS Platform Redesign',
      amount: 23000,
      issuedDate: '2026-06-15',
      dueDate: '2026-07-15',
      status: 'Paid',
      billingAddress: 'Wayne Tower, Suite 100, Gotham City, NJ',
      shippingAddress: 'Wayne Tower, Suite 100, Gotham City, NJ',
      currency: 'USD',
      exchangeRate: 1.0,
      paymentDetails: 'Stripe Credit Card Direct - Settled Ref ST-8902',
      items: [
        { id: '1', name: 'Worksuite Custom Deployment Bundle', description: 'Setup of core Node workspace packages', quantity: 1, unitPrice: 20000, taxRate: 15 },
        { id: '2', name: 'UI/UX Token Calibration Services', description: 'Design tokens compilation and styling guides', quantity: 1, unitPrice: 3000, taxRate: 15 }
      ],
      discount: 0,
      discountType: 'flat',
      tax: 15,
      isRecurring: false
    },
    {
      id: 'INV-802',
      invoiceNumber: 'INV-2026-002',
      clientName: 'Cyberdyne Systems',
      clientCompany: 'Cyberdyne Research Labs',
      clientEmail: 'billing@cyberdyne.com',
      projectName: 'Cyberdyne Portal V2',
      amount: 12500,
      issuedDate: '2026-06-28',
      dueDate: '2026-07-28',
      status: 'Unpaid',
      billingAddress: '1000 Skynet Drive, Suite C, Los Angeles, CA',
      shippingAddress: '1000 Skynet Drive, Suite C, Los Angeles, CA',
      currency: 'USD',
      exchangeRate: 1.0,
      paymentDetails: 'ACH Wire Transfer - Routing •••• 9920',
      items: [
        { id: '1', name: 'Cyberdyne Sandbox API Integration', description: 'Syncing backend database schemas and logs calibration', quantity: 1, unitPrice: 12500, taxRate: 0 }
      ],
      discount: 0,
      discountType: 'flat',
      tax: 0,
      isRecurring: true,
      recurringCycle: 'Monthly'
    },
    {
      id: 'INV-803',
      invoiceNumber: 'INV-2026-003',
      clientName: 'Miller Enterprises',
      clientCompany: 'Miller Retail & logistics',
      clientEmail: 'support@miller.com',
      projectName: 'E-commerce Checkout Optimization',
      amount: 18000,
      issuedDate: '2026-05-10',
      dueDate: '2026-06-10',
      status: 'Paid',
      billingAddress: '404 Logistics Road, Suite 2, Seattle, WA',
      shippingAddress: '404 Logistics Road, Suite 2, Seattle, WA',
      currency: 'USD',
      exchangeRate: 1.0,
      paymentDetails: 'PayPal Transfer - Ref PY-92011',
      items: [
        { id: '1', name: 'Checkout Performance Audit', description: 'Decreasing latency on mobile touch targets', quantity: 1, unitPrice: 18000, taxRate: 0 }
      ],
      discount: 0,
      discountType: 'flat',
      tax: 0,
      isRecurring: false
    },
    {
      id: 'INV-804',
      invoiceNumber: 'INV-2026-004',
      clientName: 'Wayne Enterprises',
      clientCompany: 'Wayne Enterprises Corp',
      clientEmail: 'finance@wayne.com',
      projectName: 'SaaS Platform Redesign',
      amount: 22000,
      issuedDate: '2026-07-01',
      dueDate: '2026-08-01',
      status: 'Draft',
      billingAddress: 'Wayne Tower, Suite 100, Gotham City, NJ',
      shippingAddress: 'Wayne Tower, Suite 100, Gotham City, NJ',
      currency: 'USD',
      exchangeRate: 1.0,
      paymentDetails: 'Stripe API Gateway Link',
      items: [
        { id: '1', name: 'Staging Deployment Bundle', description: 'Vite & Tailwind asset bundle deployment', quantity: 1, unitPrice: 20000, taxRate: 10 }
      ],
      discount: 0,
      discountType: 'flat',
      tax: 10,
      isRecurring: false
    }
  ]);

  // --- FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // --- SORTING & PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState<keyof InvoiceDetail>('invoiceNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // --- VIEW MODE ---
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit' | 'pdf'>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null);

  // --- FORM STATES ---
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<InvoiceDetail['status']>('Unpaid');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1.0);
  const [paymentDetails, setPaymentDetails] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('percent');
  const [tax, setTax] = useState(0);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringCycle, setRecurringCycle] = useState('Monthly');
  const [timelogHours, setTimelogHours] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  // Sync state if global invoices change
  useEffect(() => {
    // If an invoice is marked paid globally, sync it in our local array
    invoices.forEach(globalInv => {
      if (globalInv.status === 'Paid') {
        setLocalInvoiceDetails(prev => 
          prev.map(localInv => 
            localInv.id === globalInv.id ? { ...localInv, status: 'Paid' } : localInv
          )
        );
      }
    });
  }, [invoices]);

  // --- HELPERS ---
  const getSubtotal = (invItems: LineItem[]) => {
    return invItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
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

  const getTotalAmount = (invItems: LineItem[], disc: number, discType: 'flat' | 'percent', taxRate: number) => {
    const subtotal = getSubtotal(invItems);
    const discAmt = getDiscountAmount(subtotal, disc, discType);
    const taxAmt = getTaxAmount(subtotal - discAmt, taxRate);
    return Math.max(0, subtotal - discAmt + taxAmt);
  };

  // --- HANDLERS ---
  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setClientName(client.name);
      setClientCompany(client.company);
      setClientEmail(client.email);
      setBillingAddress(`${client.company} HQ, Block A, City Center`);
      setShippingAddress(`${client.company} Warehouses, Block B`);
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

  const handleApplyTimelogHours = () => {
    // Standard developer contract is $150/hr
    setItems([
      { id: '1', name: `Consulting & Engineering Worklog`, description: `Accumulated timelog tasks: ${timelogHours || 45} verified hours`, quantity: timelogHours || 45, unitPrice: 150, taxRate: 0 }
    ]);
    setNotes(`Timelog generated invoice. Calculated on verified employee timestamps.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || items.some(it => !it.name)) {
      alert('Please fill out the client name and all line item names.');
      return;
    }

    const calculatedTotal = getTotalAmount(items, discount, discountType, tax);

    if (viewMode === 'create') {
      const generatedId = `INV-${Date.now().toString().slice(-3)}`;
      const newInv: InvoiceDetail = {
        id: generatedId,
        invoiceNumber: invoiceNumber || `INV-2026-${String(localInvoiceDetails.length + 1).padStart(3, '0')}`,
        clientName,
        clientCompany,
        clientEmail,
        projectName,
        amount: calculatedTotal,
        issuedDate: issuedDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status,
        billingAddress,
        shippingAddress,
        currency,
        exchangeRate,
        paymentDetails,
        items,
        discount,
        discountType,
        tax,
        isRecurring,
        recurringCycle: isRecurring ? recurringCycle : undefined,
        timelogHours
      };

      setLocalInvoiceDetails([newInv, ...localInvoiceDetails]);

      // Propagate basic details back to parent invoices state
      if (onAddLocalInvoice) {
        onAddLocalInvoice({
          id: generatedId,
          invoiceNumber: newInv.invoiceNumber,
          clientName: newInv.clientName,
          projectName: newInv.projectName,
          amount: newInv.amount,
          issuedDate: newInv.issuedDate,
          dueDate: newInv.dueDate,
          status: newInv.status === 'Paid' ? 'Paid' : newInv.status === 'Draft' ? 'Draft' : 'Unpaid'
        });
      }
    } else {
      // Edit
      if (!selectedInvoice) return;
      setLocalInvoiceDetails(localInvoiceDetails.map(item => {
        if (item.id === selectedInvoice.id) {
          return {
            ...item,
            invoiceNumber,
            clientName,
            clientCompany,
            clientEmail,
            projectName,
            amount: calculatedTotal,
            issuedDate,
            dueDate,
            status,
            billingAddress,
            shippingAddress,
            currency,
            exchangeRate,
            paymentDetails,
            items,
            discount,
            discountType,
            tax,
            isRecurring,
            recurringCycle: isRecurring ? recurringCycle : undefined,
            timelogHours
          };
        }
        return item;
      }));
    }
    setViewMode('list');
    setSelectedInvoice(null);
  };

  const handleMarkPaid = (id: string) => {
    // Local Paid update
    setLocalInvoiceDetails(localInvoiceDetails.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Paid' };
      }
      return item;
    }));
    // Global sync callback
    onPayInvoice(id);
    alert('Success! Invoice is successfully settled and archived.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setLocalInvoiceDetails(localInvoiceDetails.filter(item => item.id !== id));
    }
  };

  const handleOpenEdit = (inv: InvoiceDetail) => {
    setSelectedInvoice(inv);
    setInvoiceNumber(inv.invoiceNumber);
    setClientName(inv.clientName);
    setClientCompany(inv.clientCompany);
    setClientEmail(inv.clientEmail);
    setProjectName(inv.projectName);
    setIssuedDate(inv.issuedDate);
    setDueDate(inv.dueDate);
    setStatus(inv.status);
    setBillingAddress(inv.billingAddress);
    setShippingAddress(inv.shippingAddress);
    setCurrency(inv.currency);
    setExchangeRate(inv.exchangeRate);
    setPaymentDetails(inv.paymentDetails);
    setItems(inv.items);
    setDiscount(inv.discount);
    setDiscountType(inv.discountType);
    setTax(inv.tax);
    setIsRecurring(inv.isRecurring);
    setRecurringCycle(inv.recurringCycle || 'Monthly');
    setTimelogHours(inv.timelogHours);
    setViewMode('edit');
  };

  const handleOpenPdf = (inv: InvoiceDetail) => {
    setSelectedInvoice(inv);
    setViewMode('pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  // --- FILTERING ---
  const filteredInvoices = localInvoiceDetails.filter(inv => {
    const matchesSearch = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- SORTING ---
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const paginatedInvoices = sortedInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <>
          {/* Statistics summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Billed Volume</span>
              <p className="text-2xl font-extrabold text-slate-900">
                ${localInvoiceDetails.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                <Landmark className="h-4 w-4" />
                <span>Across all corporate divisions</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Paid / Settled</span>
              <p className="text-2xl font-extrabold text-emerald-600">
                ${localInvoiceDetails.filter(i => i.status === 'Paid').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Check className="h-4 w-4" />
                <span>Settled directly at bank</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Outstanding Accounts</span>
              <p className="text-2xl font-extrabold text-rose-600">
                ${localInvoiceDetails.filter(i => i.status === 'Unpaid' || i.status === 'Overdue').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                <AlertCircle className="h-4 w-4 animate-pulse" />
                <span>Urgent dunning triggers</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Unissued Drafts</span>
              <p className="text-2xl font-extrabold text-slate-400">
                ${localInvoiceDetails.filter(i => i.status === 'Draft').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <FileText className="h-4 w-4" />
                <span>Uncommitted revenue</span>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search invoice number, client name, project, timeline..."
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
                    setInvoiceNumber(`INV-2026-${String(localInvoiceDetails.length + 1).padStart(3, '0')}`);
                    setClientName('');
                    setClientCompany('');
                    setClientEmail('');
                    setProjectName('');
                    setIssuedDate(new Date().toISOString().split('T')[0]);
                    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                    setStatus('Unpaid');
                    setBillingAddress('');
                    setShippingAddress('');
                    setCurrency('USD');
                    setExchangeRate(1.0);
                    setPaymentDetails('');
                    setItems([{ id: '1', name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 0 }]);
                    setDiscount(0);
                    setTax(0);
                    setIsRecurring(false);
                    setTimelogHours(undefined);
                    setViewMode('create');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Invoice</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 bg-slate-50 border-b border-slate-100 animate-fade-in text-xs">
                <div className="max-w-xs">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Settlement Status</label>
                  <select
                    className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
            )}

            {/* Invoices List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => setSortField('invoiceNumber')}>
                      <div className="flex items-center gap-1">
                        <span>Invoice ID</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => setSortField('clientName')}>
                      <div className="flex items-center gap-1">
                        <span>Target Client</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Associated Project</th>
                    <th className="px-6 py-3.5 text-right">Amount Billed</th>
                    <th className="px-6 py-3.5">Issued / Due</th>
                    <th className="px-6 py-3.5">Collection Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedInvoices.length > 0 ? (
                    paginatedInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800">{inv.clientName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{inv.clientCompany}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium max-w-xs truncate">{inv.projectName}</td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-950">
                          ${inv.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-mono">{inv.currency}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">
                          <div>{inv.issuedDate}</div>
                          <div className="text-[10px] text-rose-600 font-semibold">Due: {inv.dueDate}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' :
                            inv.status === 'Unpaid' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10' :
                            inv.status === 'Overdue' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {inv.status !== 'Paid' && inv.status !== 'Draft' && (
                              <button
                                onClick={() => handleMarkPaid(inv.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="h-3 w-3" />
                                <span>Mark Paid</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenPdf(inv)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 cursor-pointer"
                              title="Invoice PDF view"
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(inv)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 cursor-pointer"
                              title="Edit Invoice"
                            >
                              <Edit className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(inv.id)}
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
                        <span>No invoices compiled.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedInvoices.length)} of {sortedInvoices.length} invoices</span>
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
                {viewMode === 'create' ? 'Compile Invoice Bill' : 'Revise Active Invoice'}
              </h3>
              <p className="text-[10px] text-slate-500">Formulate client payments, billing coordinates, and recurring cycle triggers.</p>
            </div>
            <button type="button" onClick={() => setViewMode('list')} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick action: Timelog Invoice integration */}
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-sky-800 uppercase tracking-wider flex items-center gap-1">
                  <Landmark className="h-4 w-4 text-sky-600" />
                  <span>Timelog Integration Engine</span>
                </span>
                <p className="text-[10px] text-sky-600 mt-0.5">Quick-populate billable hours from active employee project diaries.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="e.g. 45 hrs"
                  className="w-24 bg-white border border-sky-200 rounded p-1.5 text-center font-bold focus:outline-none"
                  value={timelogHours || ''}
                  onChange={(e) => setTimelogHours(Number(e.target.value))}
                />
                <button
                  type="button"
                  onClick={handleApplyTimelogHours}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded cursor-pointer text-[10px]"
                >
                  Apply Worklog
                </button>
              </div>
            </div>

            {/* Core Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Invoice Number *</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono font-bold"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Client Selection</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  onChange={(e) => handleClientChange(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>-- Pick CRM Client entity --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Client Contact Name *</label>
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Associate Project</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  onChange={(e) => handleProjectChange(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>-- Or bind to project --</option>
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Due Date timeline</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Addresses & Exchange rates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 inline mr-1" />
                  <span>Billing Address Coordinates</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Street address, Country, Postal coordinates..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  <Ship className="h-3.5 w-3.5 text-slate-400 inline mr-1" />
                  <span>Shipping Address Coordinates</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Street address, Shipping terminal, ZIP..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Exchange Currency</label>
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
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Exchange Rate (vs USD)</label>
                <input
                  type="number" step="any"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Collection Status</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="Draft">Draft</option>
                  <option value="Unpaid">Unpaid / Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Services / Assets breakdown</span>
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
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Short Scope Memo</label>
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

            {/* Recurring details */}
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="chk-recurring-invoice"
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <label htmlFor="chk-recurring-invoice" className="font-bold text-slate-800 cursor-pointer select-none">
                  Establish as Recurring Invoice
                </label>
              </div>

              {isRecurring && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Cycle Interval:</span>
                  <select
                    className="bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                    value={recurringCycle}
                    onChange={(e) => setRecurringCycle(e.target.value)}
                  >
                    <option value="Weekly">Weekly Cycle</option>
                    <option value="Monthly">Monthly Cycle</option>
                    <option value="Quarterly">Quarterly Cycle</option>
                    <option value="Yearly">Yearly Cycle</option>
                  </select>
                </div>
              )}
            </div>

            {/* Calculations & Bank routing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company Bank Wire routing details</label>
                <textarea
                  rows={3}
                  placeholder="Silicon Valley Corporate checking •••• 8910 Routing •••• 091"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
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

                <div className="flex justify-between items-center text-rose-600">
                  <span>Discount offsets:</span>
                  <span className="font-bold">-${getDiscountAmount(getSubtotal(items), discount, discountType).toLocaleString()}</span>
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
                  <span>Total Amount Billed:</span>
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
              {viewMode === 'create' ? 'Compile Invoice' : 'Apply Revisions'}
            </button>
          </div>
        </form>
      )}

      {viewMode === 'pdf' && selectedInvoice && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-2">
              <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10 animate-pulse">
                INVOICE PREVIEW ACTIVE
              </span>
              <span className="font-semibold text-slate-600">Reviewing invoice details</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print Bill</span>
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
            {/* Header letterhead */}
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
                  accounts@worksuite.biz
                </p>
              </div>

              <div className="text-right space-y-1">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Invoice Bill</h2>
                <p className="font-mono font-bold text-indigo-600 text-xs">{selectedInvoice.invoiceNumber}</p>
                <div className="text-slate-500 font-semibold space-y-0.5 pt-2">
                  <p>Date Emitted: <span className="font-bold text-slate-800">{selectedInvoice.issuedDate}</span></p>
                  <p>Due Date: <span className="font-bold text-slate-800">{selectedInvoice.dueDate}</span></p>
                  <p>Settlement: <span className="font-bold text-indigo-600 uppercase text-[10px]">{selectedInvoice.status}</span></p>
                </div>
              </div>
            </div>

            {/* Party Addresses coordinates */}
            <div className="grid grid-cols-2 gap-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Billed To</span>
                <p className="text-xs font-extrabold text-slate-900">{selectedInvoice.clientName}</p>
                <p className="font-bold text-slate-700">{selectedInvoice.clientCompany}</p>
                <p className="text-slate-500 italic mt-1 leading-normal">
                  <span className="font-semibold not-italic">Billing Address:</span><br />
                  {selectedInvoice.billingAddress || 'No billing address compiled.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Shipped Coordinates</span>
                <p className="text-slate-500 italic mt-1 leading-normal">
                  <span className="font-semibold not-italic">Shipping Address:</span><br />
                  {selectedInvoice.shippingAddress || 'No shipping address compiled.'}
                </p>
                <div className="pt-2 text-[10px] space-y-0.5 font-bold text-slate-400">
                  <p>CURRENCY: {selectedInvoice.currency}</p>
                  <p>EXCHANGE RATE: {selectedInvoice.exchangeRate} vs USD</p>
                </div>
              </div>
            </div>

            {/* Line items table */}
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
                {selectedInvoice.items.map(item => (
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
              <div className="space-y-4">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Bank Wire Routing Details</span>
                <p className="text-slate-600 leading-normal bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[10px]">
                  {selectedInvoice.paymentDetails || 'No bank routing details logged.'}
                </p>
                {selectedInvoice.isRecurring && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 font-bold text-[10px]">
                    <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>RECURRING INVOICE: {selectedInvoice.recurringCycle}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-600 self-start">
                <div className="flex justify-between items-center">
                  <span>Gross Subtotal:</span>
                  <span className="font-extrabold text-slate-900">${getSubtotal(selectedInvoice.items).toLocaleString()}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between items-center text-rose-600">
                    <span>Discount applied ({selectedInvoice.discountType === 'percent' ? `${selectedInvoice.discount}%` : 'flat'}):</span>
                    <span className="font-bold">-${getDiscountAmount(getSubtotal(selectedInvoice.items), selectedInvoice.discount, selectedInvoice.discountType).toLocaleString()}</span>
                  </div>
                )}
                {selectedInvoice.tax > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Tax Surcharge ({selectedInvoice.tax}%):</span>
                    <span>+${getTaxAmount(getSubtotal(selectedInvoice.items) - getDiscountAmount(getSubtotal(selectedInvoice.items), selectedInvoice.discount, selectedInvoice.discountType), selectedInvoice.tax).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-black text-slate-950">
                  <span>Valuation Total:</span>
                  <span className="text-indigo-600 text-lg">${selectedInvoice.amount.toLocaleString()} {selectedInvoice.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
