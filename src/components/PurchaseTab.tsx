/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Download, Edit2, Trash2, Eye, Check, X, 
  Layers, Tag, FileText, Receipt, CreditCard, Percent, 
  Archive, TrendingUp, BarChart3, Filter, PlusCircle, 
  Calendar, DollarSign, Sliders, CheckCircle2, AlertTriangle, 
  Trash, ArrowLeft, ArrowUpRight, HelpCircle, Users, ShoppingCart,
  Wallet, HardDrive
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, LineChart, Line, 
  PieChart as RePie, Pie, Cell 
} from 'recharts';

// --- TYPES & INTERFACES ---
interface Vendor {
  id: string;
  code: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  taxNumber: string;
  paymentTerms: string;
  status: 'Active' | 'Inactive';
}

interface Product {
  id: string;
  code: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  unit: string;
  taxRate: number;
  description: string;
}

interface POItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  taxRate: number;
  subtotal: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  vendorId: string;
  items: POItem[];
  subtotal: number;
  discount: number;
  taxAmount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Ordered' | 'Received';
  deliveryNotes: string;
}

interface Bill {
  id: string;
  billNumber: string;
  poId: string;
  vendorId: string;
  billDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  status: 'Unpaid' | 'Partially Paid' | 'Paid';
}

interface Payment {
  id: string;
  transactionId: string;
  billId: string;
  vendorId: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'PayPal' | 'Cash';
  notes: string;
}

interface Credit {
  id: string;
  creditNumber: string;
  vendorId: string;
  date: string;
  amount: number;
  status: 'Open' | 'Applied' | 'Closed';
  reason: string;
}

interface StockAdjustment {
  productId: string;
  type: 'Add' | 'Subtract';
  quantity: number;
  reason: string;
  date: string;
}

export default function PurchaseTab({ subTab }: { subTab: string }) {
  // --- LOCAL STORAGE SYNCHRONIZED STATES ---
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('purchase_vendors');
    return saved ? JSON.parse(saved) : [
      { id: '1', code: 'VND-001', companyName: 'Global Tech Suppliers', contactPerson: 'Alex Rivera', email: 'sales@globaltech.com', phone: '+1-555-0199', address: '742 Evergreen Terrace', website: 'globaltech.com', taxNumber: 'TX-99881', paymentTerms: 'Net 30', status: 'Active' },
      { id: '2', code: 'VND-002', companyName: 'Office Depot Solutions', contactPerson: 'Sarah Jenkins', email: 'sarah.j@officedepot.com', phone: '+1-555-0144', address: '120 Red Wood Lane', website: 'officedepot.com', taxNumber: 'TX-11223', paymentTerms: 'Net 15', status: 'Active' },
      { id: '3', code: 'VND-003', companyName: 'Acme Hardware Inc.', contactPerson: 'Bill Peterson', email: 'bill@acmehardware.com', phone: '+1-555-0166', address: '50 Industrial Pkwy', website: 'acmehardware.com', taxNumber: 'TX-55443', paymentTerms: 'Due on Receipt', status: 'Inactive' }
    ];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('purchase_products');
    return saved ? JSON.parse(saved) : [
      { id: '1', code: 'PRD-001', name: 'Worksuite Edge Router Enterprise', sku: 'SKU-WSE-RT9', category: 'Hardware', purchasePrice: 450, sellingPrice: 750, unit: 'pcs', taxRate: 18, description: 'Dual-core enterprise firewall and dynamic routing unit.' },
      { id: '2', code: 'PRD-002', name: 'Premium Office Ergonomic Chair', sku: 'SKU-OFC-CHR1', category: 'Office Supplies', purchasePrice: 150, sellingPrice: 280, unit: 'pcs', taxRate: 10, description: 'Adjustable high-back mesh chair with lumbar support.' },
      { id: '3', code: 'PRD-003', name: 'Kubernetes Cloud Seat Annual', sku: 'SKU-KUB-YR5', category: 'Software', purchasePrice: 1200, sellingPrice: 1800, unit: 'box', taxRate: 15, description: 'Corporate scale application hosting cluster license.' }
    ];
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('purchase_orders');
    return saved ? JSON.parse(saved) : [
      { id: '1', poNumber: 'PO-2026-001', date: '2026-07-01', vendorId: '1', items: [{ productId: '1', name: 'Worksuite Edge Router Enterprise', sku: 'SKU-WSE-RT9', quantity: 5, price: 450, taxRate: 18, subtotal: 2250 }], subtotal: 2250, discount: 100, taxAmount: 387, total: 2537, status: 'Ordered', deliveryNotes: 'Deliver directly to Server Node Rack Room B.' }
    ];
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('purchase_bills');
    return saved ? JSON.parse(saved) : [
      { id: '1', billNumber: 'BIL-99812', poId: '1', vendorId: '1', billDate: '2026-07-02', dueDate: '2026-08-02', subtotal: 2250, taxAmount: 387, total: 2537, paidAmount: 2537, status: 'Paid' }
    ];
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('purchase_payments');
    return saved ? JSON.parse(saved) : [
      { id: '1', transactionId: 'TXN-449102', billId: '1', vendorId: '1', paymentDate: '2026-07-03', amount: 2537, paymentMethod: 'Bank Transfer', notes: 'Corporate wire transfer clearance #WT-9921.' }
    ];
  });

  const [credits, setCredits] = useState<Credit[]>(() => {
    const saved = localStorage.getItem('purchase_credits');
    return saved ? JSON.parse(saved) : [
      { id: '1', creditNumber: 'VCN-001', vendorId: '2', date: '2026-07-04', amount: 350, status: 'Open', reason: 'Returned defective desks items during logistics review.' }
    ];
  });

  const [stock, setStock] = useState<Record<string, { current: number; safety: number; reorder: number }>>(() => {
    const saved = localStorage.getItem('purchase_stock');
    return saved ? JSON.parse(saved) : {
      '1': { current: 18, safety: 5, reorder: 8 },
      '2': { current: 3, safety: 10, reorder: 15 },
      '3': { current: 150, safety: 20, reorder: 30 }
    };
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => { localStorage.setItem('purchase_vendors', JSON.stringify(vendors)); }, [vendors]);
  useEffect(() => { localStorage.setItem('purchase_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('purchase_orders', JSON.stringify(purchaseOrders)); }, [purchaseOrders]);
  useEffect(() => { localStorage.setItem('purchase_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('purchase_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('purchase_credits', JSON.stringify(credits)); }, [credits]);
  useEffect(() => { localStorage.setItem('purchase_stock', JSON.stringify(stock)); }, [stock]);

  // --- UI STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Modals & Form Displays
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Track landing screen status for each subTab - bypassed to show list directly
  const [hasOpenedList, setHasOpenedList] = useState<Record<string, boolean>>({
    'purchase-vendors': true,
    'purchase-products': true,
    'purchase-orders': true,
    'purchase-bills': true,
    'purchase-payments': true,
    'purchase-credits': true,
    'purchase-inventory': true,
    'purchase-reports': true,
  });

  useEffect(() => {
    setShowForm(false);
  }, [subTab]);
  
  // Stock Adjustment modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [adjustType, setAdjustType] = useState<'Add' | 'Subtract'>('Add');
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState('Stock Count Correction');

  // Success Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- VENDOR FORM BINDINGS ---
  const [vName, setVName] = useState('');
  const [vContact, setVContact] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vAddress, setVAddress] = useState('');
  const [vWebsite, setVWebsite] = useState('');
  const [vTax, setVTax] = useState('');
  const [vTerms, setVTerms] = useState('Net 30');
  const [vStatus, setVStatus] = useState<'Active' | 'Inactive'>('Active');

  // --- PRODUCT FORM BINDINGS ---
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pCat, setPCat] = useState('Hardware');
  const [pPurchase, setPPurchase] = useState(100);
  const [pSelling, setPSelling] = useState(180);
  const [pUnit, setPUnit] = useState('pcs');
  const [pTax, setPTax] = useState(18);
  const [pDesc, setPDesc] = useState('');

  // --- PO FORM BINDINGS ---
  const [poVendorId, setPoVendorId] = useState('');
  const [poStatus, setPoStatus] = useState<'Draft' | 'Sent' | 'Ordered' | 'Received'>('Draft');
  const [poNotes, setPoNotes] = useState('');
  const [poDiscount, setPoDiscount] = useState(0);
  const [poItems, setPoItems] = useState<{ productId: string; quantity: number; price: number; taxRate: number }[]>([]);

  // --- BILL FORM BINDINGS ---
  const [billPoId, setBillPoId] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billDue, setBillDue] = useState('');

  // --- PAYMENT FORM BINDINGS ---
  const [payBillId, setPayBillId] = useState('');
  const [payDate, setPayDate] = useState('');
  const [payAmount, setPayAmount] = useState(0);
  const [payMethod, setPayMethod] = useState<'Bank Transfer' | 'Credit Card' | 'PayPal' | 'Cash'>('Bank Transfer');
  const [payNotes, setPayNotes] = useState('');

  // --- CREDIT FORM BINDINGS ---
  const [creditVendorId, setCreditVendorId] = useState('');
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState('');

  // --- ACTION TRIGGER CLEANUPS ---
  const openAddForm = () => {
    setEditingId(null);
    setShowForm(true);
    // Reset forms
    setVName(''); setVContact(''); setVEmail(''); setVPhone(''); setVAddress(''); setVWebsite(''); setVTax(''); setVTerms('Net 30'); setVStatus('Active');
    setPName(''); setPSku(`SKU-PRD-${Date.now().toString().slice(-4)}`); setPCat('Hardware'); setPPurchase(100); setPSelling(180); setPUnit('pcs'); setPTax(18); setPDesc('');
    setPoVendorId(vendors[0]?.id || ''); setPoStatus('Draft'); setPoNotes(''); setPoDiscount(0); setPoItems([]);
    setBillPoId(purchaseOrders[0]?.id || ''); setBillDate(new Date().toISOString().split('T')[0]); setBillDue(new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
    setPayBillId(bills[0]?.id || ''); setPayDate(new Date().toISOString().split('T')[0]); setPayAmount(0); setPayMethod('Bank Transfer'); setPayNotes('');
    setCreditVendorId(vendors[0]?.id || ''); setCreditAmount(0); setCreditReason('');
  };

  // --- HANDLERS (CRUD & OPERATIONAL ACTIONS) ---

  // VENDOR CRUD
  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim()) return alert('Company Name is required');
    if (vEmail && !vEmail.includes('@')) return alert('Please enter a valid email address');

    if (editingId) {
      setVendors(prev => prev.map(v => v.id === editingId ? {
        ...v, companyName: vName, contactPerson: vContact, email: vEmail, phone: vPhone, address: vAddress, website: vWebsite, taxNumber: vTax, paymentTerms: vTerms, status: vStatus
      } : v));
      triggerToast('Vendor profile updated successfully!');
    } else {
      const newV: Vendor = {
        id: `v-${Date.now()}`,
        code: `VND-${Math.floor(100 + Math.random() * 900)}`,
        companyName: vName, contactPerson: vContact, email: vEmail, phone: vPhone, address: vAddress, website: vWebsite, taxNumber: vTax, paymentTerms: vTerms, status: vStatus
      };
      setVendors([newV, ...vendors]);
      triggerToast('New vendor onboarded successfully!');
    }
    setShowForm(false);
  };

  const deleteVendor = (id: string) => {
    if (confirm('Are you sure you want to offboard this vendor?')) {
      setVendors(prev => prev.filter(v => v.id !== id));
      triggerToast('Vendor record deleted.');
    }
  };

  const startEditVendor = (v: Vendor) => {
    setEditingId(v.id);
    setVName(v.companyName); setVContact(v.contactPerson); setVEmail(v.email); setVPhone(v.phone); setVAddress(v.address); setVWebsite(v.website); setVTax(v.taxNumber); setVTerms(v.paymentTerms); setVStatus(v.status);
    setShowForm(true);
  };

  // PRODUCT CRUD
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return alert('Product Name is required');

    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? {
        ...p, name: pName, sku: pSku, category: pCat, purchasePrice: Number(pPurchase), sellingPrice: Number(pSelling), unit: pUnit, taxRate: Number(pTax), description: pDesc
      } : p));
      triggerToast('Product details updated successfully!');
    } else {
      const newP: Product = {
        id: `p-${Date.now()}`,
        code: `PRD-${Math.floor(100 + Math.random() * 900)}`,
        name: pName, sku: pSku, category: pCat, purchasePrice: Number(pPurchase), sellingPrice: Number(pSelling), unit: pUnit, taxRate: Number(pTax), description: pDesc
      };
      setProducts([newP, ...products]);
      setStock(prev => ({
        ...prev,
        [newP.id]: { current: 0, safety: 5, reorder: 10 }
      }));
      triggerToast('Product added and mapped onto stock.');
    }
    setShowForm(false);
  };

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product catalog item?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      triggerToast('Product deleted.');
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingId(p.id);
    setPName(p.name); setPSku(p.sku); setPCat(p.category); setPPurchase(p.purchasePrice); setPSelling(p.sellingPrice); setPUnit(p.unit); setPTax(p.taxRate); setPDesc(p.description);
    setShowForm(true);
  };

  // PURCHASE ORDER CRUD
  const handlePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poVendorId) return alert('Select a Vendor');
    if (poItems.length === 0) return alert('Add at least one product item onto order list');

    let subtotal = 0;
    let taxAmount = 0;
    const itemsWithDetails: POItem[] = poItems.map(item => {
      const prodDetails = products.find(p => p.id === item.productId)!;
      const itemSubtotal = item.quantity * item.price;
      const itemTax = itemSubtotal * (item.taxRate / 100);
      subtotal += itemSubtotal;
      taxAmount += itemTax;
      return {
        productId: item.productId,
        name: prodDetails.name,
        sku: prodDetails.sku,
        quantity: item.quantity,
        price: item.price,
        taxRate: item.taxRate,
        subtotal: itemSubtotal
      };
    });

    const finalTotal = subtotal + taxAmount - Number(poDiscount);

    if (editingId) {
      setPurchaseOrders(prev => prev.map(po => po.id === editingId ? {
        ...po, vendorId: poVendorId, items: itemsWithDetails, subtotal, discount: Number(poDiscount), taxAmount, total: finalTotal, status: poStatus, deliveryNotes: poNotes
      } : po));
      triggerToast('Purchase Order updated.');
    } else {
      const newPO: PurchaseOrder = {
        id: `po-${Date.now()}`,
        poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().split('T')[0],
        vendorId: poVendorId,
        items: itemsWithDetails,
        subtotal,
        discount: Number(poDiscount),
        taxAmount,
        total: finalTotal,
        status: poStatus,
        deliveryNotes: poNotes
      };
      setPurchaseOrders([newPO, ...purchaseOrders]);
      triggerToast('Purchase Order generated and logged.');
    }
    setShowForm(false);
  };

  // BILLS CRUD
  const handleBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billPoId) return alert('Select reference PO');

    const po = purchaseOrders.find(p => p.id === billPoId)!;

    const newBill: Bill = {
      id: `bl-${Date.now()}`,
      billNumber: `BIL-${Math.floor(10000 + Math.random() * 90000)}`,
      poId: billPoId,
      vendorId: po.vendorId,
      billDate,
      dueDate: billDue,
      subtotal: po.subtotal,
      taxAmount: po.taxAmount,
      total: po.total,
      paidAmount: 0,
      status: 'Unpaid'
    };

    setBills([newBill, ...bills]);
    triggerToast('Inbound bill captured from Purchase Order.');
    setShowForm(false);
  };

  // VENDOR PAYMENTS
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payBillId) return alert('Select an outstanding invoice bill');
    if (Number(payAmount) <= 0) return alert('Enter payment clearance amount');

    const targetBill = bills.find(b => b.id === payBillId)!;
    const newlyPaid = Number(payAmount);

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      billId: payBillId,
      vendorId: targetBill.vendorId,
      paymentDate: payDate,
      amount: newlyPaid,
      paymentMethod: payMethod,
      notes: payNotes
    };

    // Update Bill paid amount and state
    setBills(prev => prev.map(b => {
      if (b.id === payBillId) {
        const totalPaid = b.paidAmount + newlyPaid;
        return {
          ...b,
          paidAmount: totalPaid,
          status: totalPaid >= b.total ? 'Paid' : totalPaid > 0 ? 'Partially Paid' : 'Unpaid'
        };
      }
      return b;
    }));

    setPayments([newPayment, ...payments]);
    triggerToast('Payment cleared and balanced on ledger.');
    setShowForm(false);
  };

  // CREDITS NOTE CRUD
  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditVendorId) return alert('Select a vendor');
    if (Number(creditAmount) <= 0) return alert('Credit amount must be greater than zero');

    const newC: Credit = {
      id: `cr-${Date.now()}`,
      creditNumber: `VCN-${Math.floor(100 + Math.random() * 900)}`,
      vendorId: creditVendorId,
      date: new Date().toISOString().split('T')[0],
      amount: Number(creditAmount),
      status: 'Open',
      reason: creditReason
    };

    setCredits([newC, ...credits]);
    triggerToast('Vendor credit voucher registered.');
    setShowForm(false);
  };

  // ADJUST STOCK
  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return alert('Select Product');
    
    setStock(prev => {
      const currentVal = prev[selectedProductId]?.current || 0;
      const updatedVal = adjustType === 'Add' 
        ? currentVal + Number(adjustQty) 
        : Math.max(0, currentVal - Number(adjustQty));
      
      return {
        ...prev,
        [selectedProductId]: {
          ...prev[selectedProductId],
          current: updatedVal
        }
      };
    });

    triggerToast(`Inventory stock adjusted successfully.`);
    setShowAdjustModal(false);
  };

  // EXPORT CSV UTILITY
  const exportToCSV = (dataset: any[], filename: string) => {
    if (dataset.length === 0) return alert('Dataset is empty');
    const headers = Object.keys(dataset[0]).join(',');
    const rows = dataset.map(item => {
      return Object.values(item).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
    }).join('\n');
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete generic item from any list
  const deletePO = (id: string) => {
    if (confirm('Delete this Purchase Order?')) {
      setPurchaseOrders(prev => prev.filter(po => po.id !== id));
      triggerToast('PO deleted');
    }
  };

  const deleteBill = (id: string) => {
    if (confirm('Delete this bill?')) {
      setBills(prev => prev.filter(b => b.id !== id));
      triggerToast('Bill deleted');
    }
  };

  const deletePayment = (id: string) => {
    if (confirm('Delete this payment transaction?')) {
      setPayments(prev => prev.filter(p => p.id !== id));
      triggerToast('Payment entry deleted.');
    }
  };

  const deleteCredit = (id: string) => {
    if (confirm('Delete this credit note?')) {
      setCredits(prev => prev.filter(c => c.id !== id));
      triggerToast('Credit note deleted.');
    }
  };

  // --- FILTERS & PAGINATION WRAPPERS ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Get filtered items for tables
  const getFilteredData = () => {
    const q = searchQuery.toLowerCase();
    switch (subTab) {
      case 'purchase-vendors':
        return vendors.filter(v => 
          (v.companyName.toLowerCase().includes(q) || v.contactPerson.toLowerCase().includes(q) || v.email.toLowerCase().includes(q)) &&
          (filterStatus === 'All' || v.status === filterStatus)
        );
      case 'purchase-products':
        return products.filter(p => 
          (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) &&
          (filterStatus === 'All' || p.category === filterStatus)
        );
      case 'purchase-orders':
        return purchaseOrders.filter(po => {
          const v = vendors.find(vend => vend.id === po.vendorId);
          return (po.poNumber.toLowerCase().includes(q) || (v?.companyName || '').toLowerCase().includes(q)) &&
            (filterStatus === 'All' || po.status === filterStatus);
        });
      case 'purchase-bills':
        return bills.filter(b => {
          const v = vendors.find(vend => vend.id === b.vendorId);
          return (b.billNumber.toLowerCase().includes(q) || (v?.companyName || '').toLowerCase().includes(q)) &&
            (filterStatus === 'All' || b.status === filterStatus);
        });
      case 'purchase-payments':
        return payments.filter(p => {
          const v = vendors.find(vend => vend.id === p.vendorId);
          return (p.transactionId.toLowerCase().includes(q) || (v?.companyName || '').toLowerCase().includes(q)) &&
            (filterStatus === 'All' || p.paymentMethod === filterStatus);
        });
      case 'purchase-credits':
        return credits.filter(c => {
          const v = vendors.find(vend => vend.id === c.vendorId);
          return (c.creditNumber.toLowerCase().includes(q) || (v?.companyName || '').toLowerCase().includes(q)) &&
            (filterStatus === 'All' || c.status === filterStatus);
        });
      case 'purchase-inventory':
        return products.filter(p => {
          const s = stock[p.id] || { current: 0 };
          const level = s.current === 0 ? 'Out of Stock' : s.current < s.reorder ? 'Low Stock' : 'In Stock';
          return (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
            (filterStatus === 'All' || level === filterStatus);
        });
      default:
        return [];
    }
  };

  const dataList = getFilteredData();
  const totalEntries = dataList.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = dataList.slice(startIndex, startIndex + itemsPerPage);

  // --- REPORT METRIC AGGREGATORS ---
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.total, 0);
  const totalPaidBills = bills.reduce((sum, b) => sum + b.paidAmount, 0);
  const outstandingDues = bills.reduce((sum, b) => sum + (b.total - b.paidAmount), 0);

  const getMonthlyTrendData = () => {
    return [
      { name: 'May', Spend: totalSpend * 0.4, Bills: totalPaidBills * 0.3 },
      { name: 'Jun', Spend: totalSpend * 0.7, Bills: totalPaidBills * 0.6 },
      { name: 'Jul', Spend: totalSpend, Bills: totalPaidBills }
    ];
  };

  const getSpendByVendorData = () => {
    return vendors.map((v, i) => {
      const spend = purchaseOrders.filter(po => po.vendorId === v.id).reduce((sum, po) => sum + po.total, 0);
      return {
        name: v.companyName,
        value: spend || 1200 * (i + 1)
      };
    });
  };

  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d'];

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* FLOATING SUCCESS TOAST */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 border border-slate-800 text-white text-xs font-semibold px-4.5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-fade-in">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {subTab === 'purchase-vendors' && 'Vendors Directory'}
              {subTab === 'purchase-products' && 'Product & Asset Catalog'}
              {subTab === 'purchase-orders' && 'Purchase Orders'}
              {subTab === 'purchase-bills' && 'Inbound Invoices & Bills'}
              {subTab === 'purchase-payments' && 'Vendor Payments Ledger'}
              {subTab === 'purchase-credits' && 'Vendor Credit Notes'}
              {subTab === 'purchase-inventory' && 'Inventory Stock Management'}
              {subTab === 'purchase-reports' && 'Purchase Reporting Console'}
            </h1>
            <p className="text-xs text-slate-400 font-medium font-mono select-none">
              Home • Purchase • {subTab.split('-')[1]}
            </p>
          </div>
        </div>
        
        {/* ACTION BUTTONS (Unless form is visible or we are in Reports, or on landing screen) */}
        {!showForm && hasOpenedList[subTab] && subTab !== 'purchase-reports' && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {subTab === 'purchase-inventory' ? (
              <button
                onClick={() => {
                  setSelectedProductId(products[0]?.id || '');
                  setShowAdjustModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Sliders className="h-4 w-4" />
                <span>Adjust Stock Levels</span>
              </button>
            ) : (
              <button
                onClick={openAddForm}
                className="bg-[#1890ff] hover:bg-[#40a9ff] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>
                  {subTab === 'purchase-vendors' && 'Add Vendor'}
                  {subTab === 'purchase-products' && 'Create Product'}
                  {subTab === 'purchase-orders' && 'Create Purchase Order'}
                  {subTab === 'purchase-bills' && 'Capture Bill'}
                  {subTab === 'purchase-payments' && 'Clear Invoice Payment'}
                  {subTab === 'purchase-credits' && 'Log Vendor Credit'}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                const targetDataset = 
                  subTab === 'purchase-vendors' ? vendors :
                  subTab === 'purchase-products' ? products :
                  subTab === 'purchase-orders' ? purchaseOrders :
                  subTab === 'purchase-bills' ? bills :
                  subTab === 'purchase-payments' ? payments : credits;
                exportToCSV(targetDataset, subTab);
              }}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. REPORTING SUBTAB DASHBOARD (SPECIAL RENDER) */}
      {/* ========================================================= */}
      {subTab === 'purchase-reports' && (
        <div className="space-y-6">
          {/* TOP METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wide">Total Corporate Spend</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">${totalSpend.toLocaleString()}</h3>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1.5">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.4% vs Q2 Ledger</span>
                </span>
              </div>
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wide">Invoices Paid</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">${totalPaidBills.toLocaleString()}</h3>
                <span className="text-[10px] text-indigo-500 font-bold flex items-center gap-1 mt-1.5 font-mono">
                  <span>{bills.filter(b => b.status === 'Paid').length} invoices settled</span>
                </span>
              </div>
              <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wide">Outstanding Dues</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">${outstandingDues.toLocaleString()}</h3>
                <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-1.5 font-mono">
                  <span>{bills.filter(b => b.status !== 'Paid').length} pending bills</span>
                </span>
              </div>
              <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* CHARTS CONTAINER SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-black text-slate-855 uppercase font-mono">Monthly Purchase Spend Trend</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getMonthlyTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                    <YAxis fontSize={11} stroke="#94a3b8" />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line type="monotone" dataKey="Spend" stroke="#1890ff" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Bills" stroke="#52c41a" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spend by vendor donut */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-black text-slate-855 uppercase font-mono">Spend Distribution by Vendor</h4>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePie>
                    <Pie
                      data={getSpendByVendorData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getSpendByVendorData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                  </RePie>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RECENT OUTSTANDING SUMMARY TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-900 font-mono uppercase tracking-wide">Outstanding Inbound Bills Ledger</h4>
              <span className="text-[10px] text-slate-400 font-bold font-mono">Real-time balances</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-3">Bill Number</th>
                    <th className="px-6 py-3">Vendor</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3 text-right">Total</th>
                    <th className="px-6 py-3 text-right">Settled Balance</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono font-medium text-slate-600">
                  {bills.map(b => {
                    const v = vendors.find(vend => vend.id === b.vendorId);
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-bold text-slate-800">{b.billNumber}</td>
                        <td className="px-6 py-3.5 font-sans">{v?.companyName || 'Unknown Vendor'}</td>
                        <td className="px-6 py-3.5 text-slate-400">{b.dueDate}</td>
                        <td className="px-6 py-3.5 text-right font-bold text-slate-900">${b.total.toLocaleString()}</td>
                        <td className="px-6 py-3.5 text-right text-emerald-600">${b.paidAmount.toLocaleString()}</td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                            b.status === 'Partially Paid' ? 'bg-indigo-50 text-indigo-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LANDING SCREEN (If list is not opened and form is closed) */}
      {/* ========================================================= */}
      {!hasOpenedList[subTab] && !showForm && subTab !== 'purchase-reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm my-8 space-y-6 animate-fade-in">
          {/* Branded Icon Frame */}
          <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            {subTab === 'purchase-vendors' && <Users className="h-8 w-8" />}
            {subTab === 'purchase-products' && <ShoppingCart className="h-8 w-8 animate-pulse" />}
            {subTab === 'purchase-orders' && <Layers className="h-8 w-8" />}
            {subTab === 'purchase-bills' && <FileText className="h-8 w-8" />}
            {subTab === 'purchase-payments' && <CreditCard className="h-8 w-8" />}
            {subTab === 'purchase-credits' && <Wallet className="h-8 w-8" />}
            {subTab === 'purchase-inventory' && <HardDrive className="h-8 w-8" />}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {subTab === 'purchase-vendors' && 'Onboard & Manage Vendors'}
              {subTab === 'purchase-products' && 'Product & Asset Catalog'}
              {subTab === 'purchase-orders' && 'Generate Purchase Orders'}
              {subTab === 'purchase-bills' && 'Inbound Invoices & Bills'}
              {subTab === 'purchase-payments' && 'Vendor Payments Ledger'}
              {subTab === 'purchase-credits' && 'Vendor Credit Notes'}
              {subTab === 'purchase-inventory' && 'Inventory Stock Ledger'}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              {subTab === 'purchase-vendors' && 'Establish relationships with your raw material suppliers. Register contact credentials, corporate websites, tax registration details, and default payment clearance terms.'}
              {subTab === 'purchase-products' && 'Maintain a secure centralized inventory of SaaS licenses, development nodes, cloud seats, and physical hardware. Manage sales/purchase prices, tax brackets, and SKUs.'}
              {subTab === 'purchase-orders' && 'Draft formal Purchase Orders mapping catalog items onto vendor agreements. Track draft, sent, and received logistics status in real-time.'}
              {subTab === 'purchase-bills' && 'Track incoming merchant invoices matching issued Purchase Orders. Log due dates, aggregate invoice totals, and manage payment milestones.'}
              {subTab === 'purchase-payments' && 'Clear your corporate bills with bank wire transfers, credit transactions, or PayPal business proxy. Maintain high-fidelity settlement records.'}
              {subTab === 'purchase-credits' && 'Log returned materials, logistics adjustments, and defective inventory credit notes issued by onboarded suppliers. Apply open credits onto bills.'}
              {subTab === 'purchase-inventory' && 'Monitor live warehouse stock levels, adjust unit quantities, configure safety thresholds, and keep track of reorder level triggers.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setHasOpenedList(prev => ({ ...prev, [subTab]: true }));
                if (subTab === 'purchase-inventory') {
                  setSelectedProductId(products[0]?.id || '');
                  setShowAdjustModal(true);
                } else {
                  openAddForm();
                }
              }}
              className="bg-[#1890ff] hover:bg-[#40a9ff] text-white text-xs font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>
                {subTab === 'purchase-vendors' && 'Onboard First Vendor'}
                {subTab === 'purchase-products' && 'Create Catalog Item'}
                {subTab === 'purchase-orders' && 'Create Purchase Order'}
                {subTab === 'purchase-bills' && 'Capture Inbound Bill'}
                {subTab === 'purchase-payments' && 'Clear Invoice Payment'}
                {subTab === 'purchase-credits' && 'Log Vendor Credit'}
                {subTab === 'purchase-inventory' && 'Adjust Stock Levels'}
              </span>
            </button>
            <button
              onClick={() => {
                setHasOpenedList(prev => ({ ...prev, [subTab]: true }));
                setShowForm(false);
              }}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold px-6 py-3 rounded-lg border border-slate-200 transition-all cursor-pointer w-full sm:w-auto"
            >
              Go to General Page
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. FORMS FOR CREATING / EDITING RESOURCES */}
      {/* ========================================================= */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Sliders className="h-5 w-5 text-indigo-600" />
              <span>
                {editingId ? 'Edit Profile & Details' : 'Capture New Record Parameters'}
              </span>
            </h3>
            <button 
              onClick={() => setShowForm(false)} 
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* A. VENDORS SUBMISSION FORM */}
          {subTab === 'purchase-vendors' && (
            <form onSubmit={handleVendorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Company Name *</label>
                  <input type="text" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold" value={vName} onChange={e => setVName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Contact Person</label>
                  <input type="text" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500" value={vContact} onChange={e => setVContact(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Tax Registration Number</label>
                  <input type="text" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono" value={vTax} onChange={e => setVTax(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                  <input type="email" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono" value={vEmail} onChange={e => setVEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Contact Phone</label>
                  <input type="text" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono" value={vPhone} onChange={e => setVPhone(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Website URL</label>
                  <input type="text" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none" value={vWebsite} onChange={e => setVWebsite(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Address Details</label>
                  <input type="text" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none" value={vAddress} onChange={e => setVAddress(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Payment Terms</label>
                  <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold" value={vTerms} onChange={e => setVTerms(e.target.value)}>
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 60">Net 60 Days</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Status Indicator</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" checked={vStatus === 'Active'} onChange={() => setVStatus('Active')} className="accent-blue-600" />
                    <span>Active Onboarded</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input type="radio" checked={vStatus === 'Inactive'} onChange={() => setVStatus('Inactive')} className="accent-blue-600" />
                    <span>Suspended / Inactive</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 font-sans">
                <button type="button" onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#1890ff] text-white text-xs font-black px-4 py-2 rounded-lg">Onboard Vendor</button>
              </div>
            </form>
          )}

          {/* B. PRODUCTS SUBMISSION FORM */}
          {subTab === 'purchase-products' && (
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Product Name *</label>
                  <input type="text" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-bold" value={pName} onChange={e => setPName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">SKU Code</label>
                  <input type="text" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono" value={pSku} onChange={e => setPSku(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Category Group</label>
                  <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold" value={pCat} onChange={e => setPCat(e.target.value)}>
                    <option value="Hardware">Hardware Node Dev</option>
                    <option value="Software">SaaS / Software License</option>
                    <option value="Office Supplies">Office Furniture & Supplies</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Purchase Cost ($)</label>
                  <input type="number" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono" value={pPurchase} onChange={e => setPPurchase(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Selling Price ($)</label>
                  <input type="number" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono" value={pSelling} onChange={e => setPSelling(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Unit of Measure</label>
                  <input type="text" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none" value={pUnit} onChange={e => setPUnit(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Applied Tax Rate (%)</label>
                  <input type="number" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono" value={pTax} onChange={e => setPTax(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Item Specifications / Description</label>
                <textarea rows={3} className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none resize-none font-medium leading-relaxed" value={pDesc} onChange={e => setPDesc(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 font-sans">
                <button type="button" onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#1890ff] text-white text-xs font-black px-4 py-2 rounded-lg">Save Asset Catalog Item</button>
              </div>
            </form>
          )}

          {/* C. PURCHASE ORDER FORM */}
          {subTab === 'purchase-orders' && (
            <form onSubmit={handlePOSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Vendor Supplier *</label>
                  <select required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold" value={poVendorId} onChange={e => setPoVendorId(e.target.value)}>
                    <option value="">Select Target Vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Order Status</label>
                  <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold" value={poStatus} onChange={e => setPoStatus(e.target.value as any)}>
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received & Unloaded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Discount Amount ($)</label>
                  <input type="number" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono font-bold text-red-600" value={poDiscount} onChange={e => setPoDiscount(Number(e.target.value))} />
                </div>
              </div>

              {/* DYNAMIC ORDER ITEMS ADDITION LIST */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[10px] font-black text-slate-700 font-mono uppercase tracking-widest">Selected Item Ledger Rows</h4>
                  <button
                    type="button"
                    onClick={() => {
                      if (products.length === 0) return alert('No products registered in the asset catalog');
                      setPoItems([...poItems, { productId: products[0].id, quantity: 1, price: products[0].purchasePrice, taxRate: products[0].taxRate }]);
                    }}
                    className="text-xs text-indigo-600 font-black flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add Item Row</span>
                  </button>
                </div>

                {poItems.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-bold text-center py-4">No order lines added yet. Add a row to attach products.</p>
                ) : (
                  <div className="space-y-2">
                    {poItems.map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-[8px] font-bold text-slate-400 uppercase">Product</label>
                          <select 
                            className="w-full bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none font-semibold mt-0.5"
                            value={item.productId}
                            onChange={(e) => {
                              const selProd = products.find(p => p.id === e.target.value)!;
                              const updated = [...poItems];
                              updated[index] = { ...updated[index], productId: e.target.value, price: selProd.purchasePrice, taxRate: selProd.taxRate };
                              setPoItems(updated);
                            }}
                          >
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                          </select>
                        </div>

                        <div className="w-20">
                          <label className="block text-[8px] font-bold text-slate-400 uppercase">Qty</label>
                          <input 
                            type="number" 
                            className="w-full bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono text-center mt-0.5"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...poItems];
                              updated[index].quantity = Number(e.target.value);
                              setPoItems(updated);
                            }}
                          />
                        </div>

                        <div className="w-28">
                          <label className="block text-[8px] font-bold text-slate-400 uppercase">Unit Price ($)</label>
                          <input 
                            type="number" 
                            className="w-full bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono mt-0.5"
                            value={item.price}
                            onChange={(e) => {
                              const updated = [...poItems];
                              updated[index].price = Number(e.target.value);
                              setPoItems(updated);
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPoItems(poItems.filter((_, idx) => idx !== index));
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 self-end sm:self-center transition-colors border border-red-100"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Delivery Notes / Specific Terms</label>
                <textarea rows={2} className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none resize-none font-medium leading-relaxed" value={poNotes} onChange={e => setPoNotes(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 font-sans">
                <button type="button" onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#1890ff] text-white text-xs font-black px-4 py-2 rounded-lg">Generate Purchase Order</button>
              </div>
            </form>
          )}

          {/* D. BILL CAPTURE FORM */}
          {subTab === 'purchase-bills' && (
            <form onSubmit={handleBillSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Purchase Order Reference *</label>
                  <select required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold" value={billPoId} onChange={e => setBillPoId(e.target.value)}>
                    <option value="">Select Reference PO</option>
                    {purchaseOrders.map(po => <option key={po.id} value={po.id}>{po.poNumber} (${po.total})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Bill Date</label>
                  <input type="date" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono" value={billDate} onChange={e => setBillDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Payment Due Date</label>
                  <input type="date" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono" value={billDue} onChange={e => setBillDue(e.target.value)} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 font-sans">
                <button type="button" onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#1890ff] text-white text-xs font-black px-4 py-2 rounded-lg">Log Inbound Bill</button>
              </div>
            </form>
          )}

          {/* E. VENDOR PAYMENTS FORM */}
          {subTab === 'purchase-payments' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Target Inbound Bill *</label>
                  <select required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold" value={payBillId} onChange={e => {
                    setPayBillId(e.target.value);
                    const b = bills.find(bill => bill.id === e.target.value);
                    if (b) setPayAmount(b.total - b.paidAmount);
                  }}>
                    <option value="">Select Bill to Clear</option>
                    {bills.map(b => {
                      const v = vendors.find(vend => vend.id === b.vendorId);
                      return <option key={b.id} value={b.id}>{b.billNumber} - {v?.companyName || 'Vendor'} (Balance: ${b.total - b.paidAmount})</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Payment Value ($) *</label>
                  <input type="number" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono font-bold text-emerald-600" value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Payment Method</label>
                  <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold" value={payMethod} onChange={e => setPayMethod(e.target.value as any)}>
                    <option value="Bank Transfer">Bank Wire Transfer</option>
                    <option value="Credit Card">Corporate Credit Card</option>
                    <option value="PayPal">PayPal Business Proxy</option>
                    <option value="Cash">Cash Clearing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Payment Execution Date</label>
                  <input type="date" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono" value={payDate} onChange={e => setPayDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Reference Notes / Wire Codes</label>
                  <input type="text" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none" value={payNotes} onChange={e => setPayNotes(e.target.value)} placeholder="Transaction reference code" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 font-sans">
                <button type="button" onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#1890ff] text-white text-xs font-black px-4 py-2 rounded-lg">Execute Settle Clearance</button>
              </div>
            </form>
          )}

          {/* F. VENDOR CREDITS FORM */}
          {subTab === 'purchase-credits' && (
            <form onSubmit={handleCreditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Vendor Beneficiary *</label>
                  <select required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold" value={creditVendorId} onChange={e => setCreditVendorId(e.target.value)}>
                    <option value="">Select Vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Credit Amount ($) *</label>
                  <input type="number" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono font-bold text-amber-600" value={creditAmount} onChange={e => setCreditAmount(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Reason for Credit Notes Issue</label>
                <textarea rows={2} className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none resize-none font-medium leading-relaxed" value={creditReason} onChange={e => setCreditReason(e.target.value)} placeholder="Specify returning reason or ledger balance adjustment description" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 font-sans">
                <button type="button" onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#1890ff] text-white text-xs font-black px-4 py-2 rounded-lg">Register Credit Note</button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* 3. GRID CONTROLS, SEARCH, FILTERS & TABLES */}
      {/* ========================================================= */}
      {!showForm && hasOpenedList[subTab] && subTab !== 'purchase-reports' && (
        <div className="space-y-4">
          
          {/* SEARCH, STATUS FILTER FILTER ROWS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono mr-1">Quick Filters:</span>
              
              <button 
                onClick={() => setFilterStatus('All')} 
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  filterStatus === 'All' 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Records
              </button>

              {subTab === 'purchase-vendors' && (
                <>
                  <button onClick={() => setFilterStatus('Active')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'Active' ? 'bg-[#1890ff] border-[#1890ff] text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Active Onboarded</button>
                  <button onClick={() => setFilterStatus('Inactive')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'Inactive' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Suspended</button>
                </>
              )}

              {subTab === 'purchase-products' && (
                <>
                  <button onClick={() => setFilterStatus('Hardware')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'Hardware' ? 'bg-[#1890ff] border-[#1890ff] text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Hardware</button>
                  <button onClick={() => setFilterStatus('Software')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'Software' ? 'bg-[#52c41a] border-[#52c41a] text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Software</button>
                </>
              )}

              {subTab === 'purchase-orders' && (
                <>
                  <button onClick={() => setFilterStatus('Draft')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'Draft' ? 'bg-slate-500 border-slate-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Draft</button>
                  <button onClick={() => setFilterStatus('Ordered')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'Ordered' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Ordered</button>
                  <button onClick={() => setFilterStatus('Received')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'Received' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Received</button>
                </>
              )}

              {subTab === 'purchase-inventory' && (
                <>
                  <button onClick={() => setFilterStatus('In Stock')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'In Stock' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>In Stock</button>
                  <button onClick={() => setFilterStatus('Low Stock')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'Low Stock' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Low Stock Alerts</button>
                  <button onClick={() => setFilterStatus('Out of Stock')} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${filterStatus === 'Out of Stock' ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Out of Stock</button>
                </>
              )}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Start typing to search..."
                className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* TABLE CONTAINER GRID */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                
                {/* A. VENDORS TABLE */}
                {subTab === 'purchase-vendors' && (
                  <>
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Vendor Code</th>
                        <th className="px-6 py-4">Company Name</th>
                        <th className="px-6 py-4">Contact Person</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Payment Terms</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedList.map((v: Vendor) => (
                        <tr key={v.id} className="hover:bg-slate-50/40">
                          <td className="px-6 py-4 font-mono font-bold text-indigo-600">{v.code}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{v.companyName}</td>
                          <td className="px-6 py-4 font-medium">{v.contactPerson}</td>
                          <td className="px-6 py-4 font-mono text-slate-500">{v.email || 'N/A'}</td>
                          <td className="px-6 py-4 font-mono text-slate-500">{v.phone || 'N/A'}</td>
                          <td className="px-6 py-4 font-bold text-slate-500">{v.paymentTerms}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${v.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${v.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span>{v.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => startEditVendor(v)} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-950 transition-all cursor-pointer"><Edit2 className="h-3.5 w-3.5" /></button>
                              <button onClick={() => deleteVendor(v.id)} className="p-1.5 hover:bg-red-50 border border-red-100 rounded-lg text-red-400 hover:text-red-600 transition-all cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* B. PRODUCTS TABLE */}
                {subTab === 'purchase-products' && (
                  <>
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Product Code</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">SKU</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4 text-right">Purchase Price</th>
                        <th className="px-6 py-4 text-right">Selling Price</th>
                        <th className="px-6 py-4">Unit</th>
                        <th className="px-6 py-4 text-right">Tax Rate</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedList.map((p: Product) => (
                        <tr key={p.id} className="hover:bg-slate-50/40">
                          <td className="px-6 py-4 font-mono font-bold text-indigo-600">{p.code}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                          <td className="px-6 py-4 font-mono font-medium text-slate-500">{p.sku}</td>
                          <td className="px-6 py-4 font-bold text-slate-500">{p.category}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">${p.purchasePrice}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">${p.sellingPrice}</td>
                          <td className="px-6 py-4 text-slate-400 font-mono font-bold">{p.unit}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-red-500">{p.taxRate}%</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => startEditProduct(p)} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-950 transition-all cursor-pointer"><Edit2 className="h-3.5 w-3.5" /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-red-50 border border-red-100 rounded-lg text-red-400 hover:text-red-600 transition-all cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* C. PURCHASE ORDER TABLE */}
                {subTab === 'purchase-orders' && (
                  <>
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">PO Number</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Vendor Supplier</th>
                        <th className="px-6 py-4 text-right">Subtotal</th>
                        <th className="px-6 py-4 text-right">Discount</th>
                        <th className="px-6 py-4 text-right">Total Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedList.map((po: PurchaseOrder) => {
                        const v = vendors.find(vend => vend.id === po.vendorId);
                        return (
                          <tr key={po.id} className="hover:bg-slate-50/40">
                            <td className="px-6 py-4 font-mono font-bold text-indigo-600">{po.poNumber}</td>
                            <td className="px-6 py-4 font-mono">{po.date}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{v?.companyName || 'Unknown Vendor'}</td>
                            <td className="px-6 py-4 text-right font-mono">${po.subtotal.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right font-mono text-red-500">-${po.discount}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">${po.total.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                po.status === 'Received' ? 'bg-emerald-50 text-emerald-700' :
                                po.status === 'Ordered' ? 'bg-blue-50 text-blue-700' :
                                po.status === 'Sent' ? 'bg-indigo-50 text-indigo-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                <span>{po.status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button onClick={() => alert(`Reviewing details for PO: ${po.poNumber}\nItems count: ${po.items.length}\nSpecial instructions: ${po.deliveryNotes}`)} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"><Eye className="h-3.5 w-3.5" /></button>
                                <button onClick={() => deletePO(po.id)} className="p-1.5 hover:bg-red-50 border border-red-100 rounded-lg text-red-400 hover:text-red-600 transition-all cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}

                {/* D. BILLS TABLE */}
                {subTab === 'purchase-bills' && (
                  <>
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Bill Number</th>
                        <th className="px-6 py-4">PO Ref</th>
                        <th className="px-6 py-4">Vendor Supplier</th>
                        <th className="px-6 py-4">Bill Date</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4 text-right">Total Amount</th>
                        <th className="px-6 py-4 text-right">Paid Balance</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedList.map((b: Bill) => {
                        const v = vendors.find(vend => vend.id === b.vendorId);
                        const po = purchaseOrders.find(p => p.id === b.poId);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50/40">
                            <td className="px-6 py-4 font-mono font-bold text-slate-900">{b.billNumber}</td>
                            <td className="px-6 py-4 font-mono text-indigo-600 font-bold">{po?.poNumber || 'N/A'}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{v?.companyName || 'Unknown Vendor'}</td>
                            <td className="px-6 py-4 font-mono text-slate-400">{b.billDate}</td>
                            <td className="px-6 py-4 font-mono text-slate-400">{b.dueDate}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">${b.total.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">${b.paidAmount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                b.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                                b.status === 'Partially Paid' ? 'bg-indigo-50 text-indigo-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                                <span>{b.status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button onClick={() => deleteBill(b.id)} className="p-1.5 hover:bg-red-50 border border-red-100 rounded-lg text-red-400 hover:text-red-600 transition-all cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}

                {/* E. VENDOR PAYMENTS TABLE */}
                {subTab === 'purchase-payments' && (
                  <>
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Bill Number</th>
                        <th className="px-6 py-4">Vendor Name</th>
                        <th className="px-6 py-4">Payment Date</th>
                        <th className="px-6 py-4">Payment Method</th>
                        <th className="px-6 py-4 text-right">Cleared Amount</th>
                        <th className="px-6 py-4">Notes</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedList.map((p: Payment) => {
                        const v = vendors.find(vend => vend.id === p.vendorId);
                        const b = bills.find(bill => bill.id === p.billId);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/40">
                            <td className="px-6 py-4 font-mono font-bold text-slate-900">{p.transactionId}</td>
                            <td className="px-6 py-4 font-mono text-indigo-600 font-bold">{b?.billNumber || 'N/A'}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{v?.companyName || 'Unknown Vendor'}</td>
                            <td className="px-6 py-4 font-mono text-slate-400">{p.paymentDate}</td>
                            <td className="px-6 py-4 font-bold text-slate-500">{p.paymentMethod}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">${p.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-slate-400 font-medium truncate max-w-[140px]">{p.notes || 'No reference codes logged'}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button onClick={() => deletePayment(p.id)} className="p-1.5 hover:bg-red-50 border border-red-100 rounded-lg text-red-400 hover:text-red-600 transition-all cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}

                {/* F. VENDOR CREDITS TABLE */}
                {subTab === 'purchase-credits' && (
                  <>
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Credit Note Code</th>
                        <th className="px-6 py-4">Vendor Supplier</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Credit Amount</th>
                        <th className="px-6 py-4">Reason Details</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedList.map((c: Credit) => {
                        const v = vendors.find(vend => vend.id === c.vendorId);
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/40">
                            <td className="px-6 py-4 font-mono font-bold text-indigo-600">{c.creditNumber}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{v?.companyName || 'Unknown Vendor'}</td>
                            <td className="px-6 py-4 font-mono text-slate-400">{c.date}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-amber-600">${c.amount}</td>
                            <td className="px-6 py-4 text-slate-400 font-medium truncate max-w-[140px]">{c.reason}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                c.status === 'Open' ? 'bg-blue-50 text-blue-700' :
                                c.status === 'Applied' ? 'bg-emerald-50 text-emerald-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                <span>{c.status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button onClick={() => deleteCredit(c.id)} className="p-1.5 hover:bg-red-50 border border-red-100 rounded-lg text-red-400 hover:text-red-600 transition-all cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}

                {/* G. INVENTORY STOCK MANAGEMENT TABLE */}
                {subTab === 'purchase-inventory' && (
                  <>
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Product Code</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4 text-right">Current Stock</th>
                        <th className="px-6 py-4 text-right">Safety Limit</th>
                        <th className="px-6 py-4 text-right">Reorder Threshold</th>
                        <th className="px-6 py-4 text-right">Inventory Asset Value</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Logistics Adjustment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedList.map((p: Product) => {
                        const s = stock[p.id] || { current: 0, safety: 5, reorder: 8 };
                        const assetVal = s.current * p.purchasePrice;
                        const status = s.current === 0 ? 'Out of Stock' : s.current < s.reorder ? 'Low Stock' : 'In Stock';
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/40">
                            <td className="px-6 py-4 font-mono font-bold text-indigo-600">{p.code}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                            <td className="px-6 py-4 text-right font-mono font-black text-slate-900">{s.current} {p.unit}</td>
                            <td className="px-6 py-4 text-right font-mono text-slate-400">{s.safety}</td>
                            <td className="px-6 py-4 text-right font-mono text-slate-400">{s.reorder}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">${assetVal.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' :
                                status === 'Low Stock' ? 'bg-amber-50 text-amber-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${status === 'In Stock' ? 'bg-emerald-500' : status === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                <span>{status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedProductId(p.id);
                                  setShowAdjustModal(true);
                                }}
                                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ml-auto cursor-pointer"
                              >
                                <Sliders className="h-3.5 w-3.5 text-indigo-500" />
                                <span>Adjust Stock</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}

              </table>
            </div>

            {/* PAGINATION WRAPPER ROW */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border-t border-slate-100 font-sans">
              <div className="text-xs text-slate-400 font-bold font-mono">
                Showing {totalEntries > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, totalEntries)} of {totalEntries} entries
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`text-xs font-black px-3 py-1.5 rounded-lg border ${
                      currentPage === idx + 1
                        ? 'bg-[#1890ff] border-[#1890ff] text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODALS (ADJUST STOCK LEVELS EXPLICIT MODAL) */}
      {/* ========================================================= */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-6 relative">
            <button 
              onClick={() => setShowAdjustModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4">Adjust Stock Ledger Levels</h3>

            <form onSubmit={handleAdjustStock} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Select Product *</label>
                <select 
                  required 
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold"
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Current: {stock[p.id]?.current || 0})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Adjustment Type</label>
                  <select 
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-bold"
                    value={adjustType}
                    onChange={e => setAdjustType(e.target.value as any)}
                  >
                    <option value="Add">Add (+) Stock</option>
                    <option value="Subtract">Subtract (-) Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Quantity</label>
                  <input 
                    type="number" 
                    required 
                    min={1} 
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none font-mono font-bold"
                    value={adjustQty}
                    onChange={e => setAdjustQty(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">Reason for correction</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAdjustModal(false)} className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl">Cancel</button>
                <button type="submit" className="bg-[#1890ff] text-white text-xs font-black px-4 py-2 rounded-lg">Execute Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
