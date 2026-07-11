/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, ArrowUpDown, MoreVertical, 
  Check, X, Download, CreditCard, Landmark, DollarSign,
  ChevronLeft, ChevronRight, HelpCircle, Trash, Sparkles,
  Edit, Trash2, Eye, FileText, ShoppingCart, Calendar, User,
  MapPin, PlusCircle, AlertCircle
} from 'lucide-react';
import { Client, Project, Employee } from '../../types';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  tax: number; // percentage
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  clientName: string;
  projectName?: string;
  total: number;
  orderDate: string;
  status: 'Pending' | 'Paid' | 'Processing' | 'Completed' | 'Canceled';
  billingAddress: string;
  shippingAddress: string;
  generatedBy: string;
  discount: number;
  taxAmount: number;
  clientNote?: string;
  items: OrderItem[];
}

interface OrdersViewProps {
  clients: Client[];
  projects: Project[];
  employees: Employee[];
}

export default function OrdersView({ clients, projects, employees }: OrdersViewProps) {
  // --- STATE ---
  const [view, setView] = useState<'list' | 'create'>('list');
  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: 'ORD-101',
      orderNumber: 'ORD-001',
      clientName: 'Cyberdyne Systems',
      projectName: 'Skynet Integration',
      total: 15450,
      orderDate: '2026-06-28',
      status: 'Processing',
      billingAddress: '345 Technology Drive, Sunnyvale, CA 94085',
      shippingAddress: '345 Technology Drive, Sunnyvale, CA 94085',
      generatedBy: 'Zara Khan',
      discount: 500,
      taxAmount: 1450,
      clientNote: 'Deliver node-modules server package via secure courier.',
      items: [
        { id: 'item-1', name: 'Worksuite Custom Deployment Bundle', price: 12500, quantity: 1, tax: 10 },
        { id: 'item-2', name: 'Premium Dev Seat Add-on (x5)', price: 2000, quantity: 1, tax: 10 }
      ]
    },
    {
      id: 'ORD-102',
      orderNumber: 'ORD-002',
      clientName: 'Wayne Enterprises',
      projectName: 'Batcave Tech Stack',
      total: 3450,
      orderDate: '2026-06-20',
      status: 'Paid',
      billingAddress: '1007 Mountain Drive, Gotham City, NJ 07001',
      shippingAddress: '1007 Mountain Drive, Gotham City, NJ 07001',
      generatedBy: 'Elena Rostova',
      discount: 150,
      taxAmount: 300,
      clientNote: 'Ensure stealth encryption packages are fully pre-loaded.',
      items: [
        { id: 'item-3', name: 'Enterprise Kubernetes Configuration Nodes', price: 3000, quantity: 1, tax: 10 },
        { id: 'item-4', name: 'SaaS Dev Suite License', price: 300, quantity: 1, tax: 10 }
      ]
    },
    {
      id: 'ORD-103',
      orderNumber: 'ORD-003',
      clientName: 'Acme Corporation',
      projectName: 'Roadrunner Capture Kit',
      total: 1200,
      orderDate: '2026-06-15',
      status: 'Completed',
      billingAddress: '12 Coyote Canyon, Desert Mesa, AZ 85001',
      shippingAddress: '12 Coyote Canyon, Desert Mesa, AZ 85001',
      generatedBy: 'John Doe',
      discount: 0,
      taxAmount: 100,
      clientNote: 'Highly explosive components. Handle with extreme care.',
      items: [
        { id: 'item-5', name: 'Anvil Platform Node Core', price: 1100, quantity: 1, tax: 9.1 }
      ]
    },
    {
      id: 'ORD-104',
      orderNumber: 'ORD-004',
      clientName: 'Tyrell Corporation',
      projectName: 'Nexus-9 Replicant DB',
      total: 8250,
      orderDate: '2026-05-10',
      status: 'Pending',
      billingAddress: 'Plaza Tower One, Los Angeles, CA 90012',
      shippingAddress: 'Plaza Tower One, Los Angeles, CA 90012',
      generatedBy: 'Zara Khan',
      discount: 250,
      taxAmount: 750,
      clientNote: 'Voight-Kampff test logs should be backed up locally.',
      items: [
        { id: 'item-6', name: 'Replicant Database Clusters', price: 7750, quantity: 1, tax: 10 }
      ]
    }
  ]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  // Sorting & Pagination
  const [sortField, setSortField] = useState<keyof OrderRecord>('orderNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Form State for Create Order
  const [newOrderNum, setNewOrderNum] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [generatedBy, setGeneratedBy] = useState('');
  const [orderStatus, setOrderStatus] = useState<'Pending' | 'Paid' | 'Processing' | 'Completed' | 'Canceled'>('Pending');
  const [clientNote, setClientNote] = useState('');
  
  // Order Items form list
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: 'item-new-1', name: 'Worksuite Custom Deployment Bundle', price: 12500, quantity: 1, tax: 10 }
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [globalTaxRate, setGlobalTaxRate] = useState<number>(10);

  // Catalog products for fast adding
  const catalogProducts = [
    { name: 'Worksuite Custom Deployment Bundle', price: 12500, tax: 10 },
    { name: 'Premium Dev Seat Add-on (x5)', price: 2000, tax: 10 },
    { name: 'Enterprise Kubernetes Configuration Nodes', price: 3000, tax: 10 },
    { name: 'SaaS Dev Suite License', price: 300, tax: 10 },
    { name: 'Full-Stack Workspace Onboarding Support', price: 1500, tax: 10 }
  ];

  // Validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Setup initial order number when loading form
  useEffect(() => {
    if (view === 'create') {
      const nextNum = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
      setNewOrderNum(nextNum);
      // Pick first employee as default generated by
      if (employees.length > 0 && !generatedBy) {
        setGeneratedBy(employees[0].name);
      }
    }
  }, [view, orders, employees]);

  // Handle client select change -> Autofill address
  const handleClientChange = (clientName: string) => {
    setSelectedClient(clientName);
    const matchedClient = clients.find(c => c.name === clientName || c.company === clientName);
    if (matchedClient) {
      const addr = `100 Corporate Parkway, Suite 400, ${matchedClient.company || 'City Tech'}`;
      setBillingAddress(addr);
      setShippingAddress(addr);
    } else {
      setBillingAddress(`Custom Billing Address for ${clientName}`);
      setShippingAddress(`Custom Shipping Address for ${clientName}`);
    }
    
    // Auto-select first project associated with this client if any
    const associatedProj = projects.find(p => p.clientName === clientName);
    if (associatedProj) {
      setSelectedProject(associatedProj.name);
    } else {
      setSelectedProject('');
    }
  };

  // Add Item row
  const handleAddItemRow = () => {
    const newId = `item-new-${Date.now()}`;
    setOrderItems([...orderItems, { id: newId, name: '', price: 0, quantity: 1, tax: globalTaxRate }]);
  };

  // Remove Item row
  const handleRemoveItemRow = (id: string) => {
    if (orderItems.length <= 1) return;
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // Update row field
  const handleUpdateItemRow = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Fast select product from catalog dropdown
  const handleFastSelectProduct = (index: number) => {
    const product = catalogProducts[index];
    // check if last item is empty, replace it, otherwise append
    const lastItem = orderItems[orderItems.length - 1];
    if (lastItem && lastItem.name === '' && lastItem.price === 0) {
      setOrderItems(orderItems.map((item, idx) => {
        if (idx === orderItems.length - 1) {
          return { ...item, name: product.name, price: product.price, tax: product.tax };
        }
        return item;
      }));
    } else {
      setOrderItems([...orderItems, {
        id: `item-fast-${Date.now()}`,
        name: product.name,
        price: product.price,
        quantity: 1,
        tax: product.tax
      }]);
    }
  };

  // Dynamic Math
  const itemsSubtotal = orderItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
  const itemsTaxTotal = orderItems.reduce((acc, item) => {
    const sub = Number(item.price) * Number(item.quantity);
    return acc + (sub * (Number(item.tax) / 100));
  }, 0);
  const grandTotal = Math.max(0, itemsSubtotal + itemsTaxTotal - Number(discount));

  // Form Submit
  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!selectedClient) errors.push('Please select a Client.');
    if (!billingAddress.trim()) errors.push('Billing Address is required.');
    if (!shippingAddress.trim()) errors.push('Shipping Address is required.');
    if (orderItems.some(item => !item.name.trim())) errors.push('All order items must have a name.');
    if (orderItems.some(item => Number(item.price) <= 0)) errors.push('All items must have a unit price greater than 0.');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    const createdRecord: OrderRecord = {
      id: `ORD-${Date.now()}`,
      orderNumber: newOrderNum || `ORD-00${orders.length + 1}`,
      clientName: selectedClient,
      projectName: selectedProject || undefined,
      total: grandTotal,
      orderDate: new Date().toISOString().split('T')[0],
      status: orderStatus,
      billingAddress,
      shippingAddress,
      generatedBy: generatedBy || 'Zara Khan',
      discount,
      taxAmount: itemsTaxTotal,
      clientNote,
      items: orderItems
    };

    setOrders([createdRecord, ...orders]);
    setView('list');
    
    // Reset Form
    setSelectedClient('');
    setSelectedProject('');
    setBillingAddress('');
    setShippingAddress('');
    setOrderStatus('Pending');
    setClientNote('');
    setOrderItems([{ id: 'item-new-1', name: 'Worksuite Custom Deployment Bundle', price: 12500, quantity: 1, tax: 10 }]);
    setDiscount(0);
  };

  // --- FILTERS & SEARCH ---
  const handleSort = (field: keyof OrderRecord) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const filteredOrders = orders.filter(ord => {
    // Search filter
    const matchesSearch = ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ord.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (ord.projectName && ord.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Client Filter
    const matchesClient = clientFilter === 'All' || ord.clientName === clientFilter;

    // Status Filter
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;

    // Duration Filter
    let matchesDuration = true;
    if (durationFilter !== 'All') {
      const today = new Date();
      const orderDate = new Date(ord.orderDate);
      const diffTime = Math.abs(today.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (durationFilter === 'Today' && diffDays > 1) matchesDuration = false;
      if (durationFilter === 'This Week' && diffDays > 7) matchesDuration = false;
      if (durationFilter === 'This Month' && diffDays > 30) matchesDuration = false;
    }

    return matchesSearch && matchesClient && matchesStatus && matchesDuration;
  });

  // Sort logic
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  // Pagination logic
  const totalEntries = sortedOrders.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const currentRecords = sortedOrders.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Paid':
        return 'bg-teal-50 text-teal-700 border-teal-200/60';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Canceled':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Exporter function
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order Number,Client,Total,Order Date,Status\n";
    filteredOrders.forEach(ord => {
      csvContent += `"${ord.orderNumber}","${ord.clientName}",${ord.total},"${ord.orderDate}","${ord.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {view === 'list' ? (
        // ==========================================
        //             ORDERS LISTING VIEW
        // ==========================================
        <div className="space-y-4 animate-fade-in">
          {/* Quick Stats Toolbar & Filter Options */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by order number, client name..."
                  className="w-full bg-slate-50/50 hover:bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-all ${
                    showFilters 
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => setView('create')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Order</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters Drawer */}
            {(showFilters || durationFilter !== 'All' || clientFilter !== 'All' || statusFilter !== 'All') && (
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-slide-down">
                {/* Duration */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Duration</label>
                  <select
                    className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={durationFilter}
                    onChange={(e) => {
                      setDurationFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Time</option>
                    <option value="Today">Today Only</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                  </select>
                </div>

                {/* Client filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Client Organization</label>
                  <select
                    className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={clientFilter}
                    onChange={(e) => {
                      setClientFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Clients</option>
                    {Array.from(new Set(orders.map(o => o.clientName))).map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Order Status</label>
                  <select
                    className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Paid">Paid</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>

                {/* Custom Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setDurationFilter('All');
                      setClientFilter('All');
                      setStatusFilter('All');
                      setDateFilter('');
                    }}
                    className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg text-center"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider select-none">
                    <th onClick={() => handleSort('orderNumber')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-all">
                      <div className="flex items-center gap-1.5">
                        <span>Order Number</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('clientName')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-all">
                      <div className="flex items-center gap-1.5">
                        <span>Client</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('total')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-all">
                      <div className="flex items-center gap-1.5">
                        <span>Total Sum</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('orderDate')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-all">
                      <div className="flex items-center gap-1.5">
                        <span>Order Date</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('status')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 hover:text-slate-700 transition-all">
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                        <ShoppingCart className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                        <p>No corporate orders found matching the filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4.5 font-bold text-slate-900 font-mono">
                          {ord.orderNumber}
                        </td>
                        <td className="px-6 py-4.5">
                          <div>
                            <p className="font-bold text-slate-800">{ord.clientName}</p>
                            {ord.projectName && (
                              <p className="text-[10px] text-indigo-600 font-semibold">{ord.projectName}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4.5 font-extrabold text-slate-900">
                          ${ord.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4.5 font-medium text-slate-500 font-mono">
                          {ord.orderDate}
                        </td>
                        <td className="px-6 py-4.5">
                          <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold border ${getStatusBadge(ord.status)}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              title="Mark Paid"
                              onClick={() => {
                                setOrders(orders.map(o => o.id === ord.id ? { ...o, status: 'Paid' } : o));
                              }}
                              disabled={ord.status === 'Paid'}
                              className={`p-1.5 rounded-lg border transition-all ${
                                ord.status === 'Paid' 
                                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' 
                                  : 'bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border-slate-200'
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              title="Delete Order"
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-1.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-lg transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              {/* Entries count selection */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-800"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>

              {/* Pagination buttons */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1 select-none">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        currentPage === i + 1 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Informational counter */}
              <div className="text-xs text-slate-400 font-semibold font-mono">
                Showing {totalEntries === 0 ? 0 : indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, totalEntries)} of {totalEntries} orders
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        //             CREATE ORDER VIEW
        // ==========================================
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in max-w-4xl mx-auto">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Create Corporate Invoice / Order</h3>
              <p className="text-xs text-slate-400">Specify line items, taxes, billing metadata, and discount credits.</p>
            </div>
            <button
              onClick={() => setView('list')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>

          {/* Validation Warnings */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl space-y-1 animate-pulse">
              <div className="flex items-center gap-2 font-bold text-xs uppercase">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Validation Errors</span>
              </div>
              <ul className="list-disc pl-5 text-[11px] font-semibold space-y-0.5">
                {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}

          <form onSubmit={handleCreateOrderSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Number */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Order Number</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50/70 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold font-mono"
                  value={newOrderNum}
                  onChange={(e) => setNewOrderNum(e.target.value)}
                />
              </div>

              {/* Client Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Client Organization</label>
                <div className="flex gap-2">
                  <select
                    required
                    className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                    value={selectedClient}
                    onChange={(e) => handleClientChange(e.target.value)}
                  >
                    <option value="">-- Select Client Organization --</option>
                    {clients.map(cli => (
                      <option key={cli.id} value={cli.name}>{cli.name} ({cli.company})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Associated */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Associated Project</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">-- Pick Client Project (Optional) --</option>
                  {projects.filter(p => !selectedClient || p.clientName === selectedClient).map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Addresses & Generated By */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Billing Address */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Billing Address</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street address, city, country..."
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                />
              </div>

              {/* Shipping Address */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Shipping Address</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Destination delivery location..."
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>

              {/* Generated By & Status */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Generated By</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                    value={generatedBy}
                    onChange={(e) => setGeneratedBy(e.target.value)}
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} ({emp.designation})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Order Status</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as any)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Paid">Paid</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Catalog quick-loader */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-indigo-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Corporate Product Catalog</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Quick load standard item bundles into this invoice.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {catalogProducts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleFastSelectProduct(idx)}
                    className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-[10px] font-bold rounded-lg transition-all"
                  >
                    + {p.name.split(' ')[0]} (${p.price})
                  </button>
                ))}
              </div>
            </div>

            {/* ORDER ITEMS TABLE */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Order / Invoice Line Items</h4>
                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100 flex items-center gap-1 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Custom Item Row</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                      <th className="px-4 py-2.5 w-1/2">Item Name / Description</th>
                      <th className="px-4 py-2.5">Unit Price ($)</th>
                      <th className="px-4 py-2.5">Quantity</th>
                      <th className="px-4 py-2.5">Tax (%)</th>
                      <th className="px-4 py-2.5 text-right">Amount ($)</th>
                      <th className="px-4 py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {orderItems.map((item, index) => {
                      const itemSub = Number(item.price) * Number(item.quantity);
                      const itemTaxVal = itemSub * (Number(item.tax) / 100);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/20">
                          {/* Name */}
                          <td className="p-3">
                            <input
                              type="text"
                              required
                              placeholder="e.g. Worksuite Core Platform Seat License"
                              className="w-full bg-transparent text-slate-800 font-semibold py-1 focus:outline-none focus:border-b focus:border-indigo-500"
                              value={item.name}
                              onChange={(e) => handleUpdateItemRow(item.id, 'name', e.target.value)}
                            />
                          </td>
                          {/* Unit Price */}
                          <td className="p-3">
                            <input
                              type="number"
                              required
                              min="0"
                              className="w-20 bg-transparent text-slate-800 font-bold py-1 focus:outline-none focus:border-b focus:border-indigo-500"
                              value={item.price}
                              onChange={(e) => handleUpdateItemRow(item.id, 'price', Number(e.target.value))}
                            />
                          </td>
                          {/* Quantity */}
                          <td className="p-3">
                            <input
                              type="number"
                              required
                              min="1"
                              className="w-12 bg-transparent text-slate-800 font-semibold py-1 focus:outline-none focus:border-b focus:border-indigo-500"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItemRow(item.id, 'quantity', Number(e.target.value))}
                            />
                          </td>
                          {/* Tax */}
                          <td className="p-3">
                            <input
                              type="number"
                              required
                              min="0"
                              max="100"
                              className="w-12 bg-transparent text-slate-500 font-mono py-1 focus:outline-none focus:border-b focus:border-indigo-500"
                              value={item.tax}
                              onChange={(e) => handleUpdateItemRow(item.id, 'tax', Number(e.target.value))}
                            />
                          </td>
                          {/* Row Total */}
                          <td className="p-3 text-right font-bold text-slate-900">
                            ${(itemSub + itemTaxVal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          {/* Action */}
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(item.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CALCULATION DRAWER AND CLIENT NOTE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* Client Note */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Internal / Client Note</label>
                <textarea
                  rows={4}
                  placeholder="Terms & conditions, bank routing information, or delivery exceptions..."
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                />
              </div>

              {/* Aggregation Panel */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-3 text-xs font-semibold">
                <div className="flex justify-between text-slate-500">
                  <span>Line Items Subtotal:</span>
                  <span className="font-mono font-bold">${itemsSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                {/* Global Discount input */}
                <div className="flex justify-between items-center text-slate-500 gap-4">
                  <span>Discount Credit ($):</span>
                  <input
                    type="number"
                    min="0"
                    className="w-24 bg-white text-slate-800 text-right text-xs px-2.5 py-1 border border-slate-200 rounded focus:outline-none font-bold"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Calculated Tax Sum:</span>
                  <span className="font-mono font-bold text-slate-600">+ ${itemsTaxTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="border-t border-slate-200/80 my-2" />

                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Grand Total Authorized:</span>
                  <span className="font-mono text-base font-black text-indigo-700">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON PANEL */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Submit & Generate Order</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
