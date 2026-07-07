/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Filter, ArrowUpDown, MoreVertical, 
  Check, X, Upload, Landmark, DollarSign, ChevronLeft, ChevronRight,
  HelpCircle, Trash, Sparkles, Edit, Trash2, Shield, PlusCircle, CreditCard
} from 'lucide-react';
import { BankAccountRecord } from './types';

export default function BankAccountView() {
  // --- MOCK INITIAL BANK ACCOUNTS ---
  const [accounts, setAccounts] = useState<BankAccountRecord[]>([
    {
      id: 'ACC-501',
      name: 'SVB Operating Checking',
      bankName: 'Silicon Valley Bank',
      accountHolder: 'Worksuite Inc.',
      accountNumber: '•••• 8910',
      sortCode: 'SV-9210-09',
      accountType: 'Checking',
      currency: 'USD',
      openingBalance: 125000,
      currentBalance: 148500,
      contactNumber: '+1 (415) 555-8910',
      status: 'Active',
      logoUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?w=120&auto=format&fit=crop&q=60'
    },
    {
      id: 'ACC-502',
      name: 'HSBC Offshore Savings',
      bankName: 'HSBC Holdings PLC',
      accountHolder: 'Worksuite UK Ltd',
      accountNumber: '•••• 1220',
      sortCode: 'HS-4420-99',
      accountType: 'Savings',
      currency: 'USD',
      openingBalance: 450000,
      currentBalance: 450000,
      contactNumber: '+44 20 7991 1220',
      status: 'Active',
      logoUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=120&auto=format&fit=crop&q=60'
    },
    {
      id: 'ACC-503',
      name: 'Stripe Merchant Vault',
      bankName: 'Stripe Clearing Account',
      accountHolder: 'Worksuite Inc.',
      accountNumber: '•••• 0092',
      sortCode: 'ST-GATEWAY',
      accountType: 'Cash / Vault',
      currency: 'USD',
      openingBalance: 5000,
      currentBalance: 41000,
      contactNumber: '+1 (800) 555-STRIPE',
      status: 'Active'
    }
  ]);

  // --- FILTER & STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // --- PAGINATION & SORT ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState<keyof BankAccountRecord>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // --- FORM STATE ---
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedAccount, setSelectedAccount] = useState<BankAccountRecord | null>(null);

  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [accountType, setAccountType] = useState<BankAccountRecord['accountType']>('Checking');
  const [currency, setCurrency] = useState('USD');
  const [openingBalance, setOpeningBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [contactNumber, setContactNumber] = useState('');
  const [status, setStatus] = useState<BankAccountRecord['status']>('Active');
  const [logoUrl, setLogoUrl] = useState('');

  // --- ACTIONS ---
  const handleSort = (field: keyof BankAccountRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !bankName || !accountNumber) {
      alert('Please fill out account name, bank name, and account number fields.');
      return;
    }

    if (viewMode === 'create') {
      const newAcc: BankAccountRecord = {
        id: `ACC-${Date.now().toString().slice(-3)}`,
        name,
        bankName,
        accountHolder,
        accountNumber,
        sortCode,
        accountType,
        currency,
        openingBalance,
        currentBalance: currentBalance || openingBalance,
        contactNumber,
        status,
        logoUrl: logoUrl || undefined
      };
      setAccounts([...accounts, newAcc]);
    } else {
      if (!selectedAccount) return;
      setAccounts(accounts.map(item => {
        if (item.id === selectedAccount.id) {
          return {
            ...item,
            name,
            bankName,
            accountHolder,
            accountNumber,
            sortCode,
            accountType,
            currency,
            openingBalance,
            currentBalance,
            contactNumber,
            status,
            logoUrl: logoUrl || undefined
          };
        }
        return item;
      }));
    }

    setViewMode('list');
    setSelectedAccount(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this bank account registry?')) {
      setAccounts(accounts.filter(item => item.id !== id));
    }
  };

  const handleOpenEdit = (acc: BankAccountRecord) => {
    setSelectedAccount(acc);
    setName(acc.name);
    setBankName(acc.bankName);
    setAccountHolder(acc.accountHolder);
    setAccountNumber(acc.accountNumber);
    setSortCode(acc.sortCode);
    setAccountType(acc.accountType);
    setCurrency(acc.currency);
    setOpeningBalance(acc.openingBalance);
    setCurrentBalance(acc.currentBalance);
    setContactNumber(acc.contactNumber);
    setStatus(acc.status);
    setLogoUrl(acc.logoUrl || '');
    setViewMode('edit');
  };

  // --- FILTERING ---
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acc.accountHolder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || acc.accountType === typeFilter;
    return matchesSearch && matchesType;
  });

  // --- SORTING ---
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <>
          {/* Quick Treasury Balance summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Corporate Liquid Cash</span>
              <p className="text-2xl font-black text-slate-900">
                ${accounts.filter(a => a.status === 'Active').reduce((sum, item) => sum + item.currentBalance, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <Shield className="h-4 w-4" />
                <span>Secured in tier-1 institutions</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Accounts Registered</span>
              <p className="text-2xl font-extrabold text-slate-900">{accounts.length}</p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                <Landmark className="h-4 w-4" />
                <span>Operating checking, savings & vaults</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Inactive Reserves</span>
              <p className="text-2xl font-extrabold text-slate-400">
                ${accounts.filter(a => a.status === 'Inactive').reduce((sum, item) => sum + item.currentBalance, 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <X className="h-4 w-4" />
                <span>Frozen or closed bank entities</span>
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
                  placeholder="Search bank name, account holder, sort code..."
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
                    setName('');
                    setBankName('');
                    setAccountHolder('Worksuite Inc.');
                    setAccountNumber('');
                    setSortCode('');
                    setAccountType('Checking');
                    setCurrency('USD');
                    setOpeningBalance(0);
                    setCurrentBalance(0);
                    setContactNumber('');
                    setStatus('Active');
                    setLogoUrl('');
                    setViewMode('create');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Bank Account</span>
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 bg-slate-50 border-b border-slate-100 animate-fade-in text-xs">
                <div className="max-w-xs">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Account Sourced Type</label>
                  <select
                    className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="All">All accounts</option>
                    <option value="Checking">Checking Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash / Vault">Cash / Vault Sourced</option>
                  </select>
                </div>
              </div>
            )}

            {/* Bank accounts Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        <span>Corporate Account Name</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Account Sourced Type</th>
                    <th className="px-6 py-3.5 cursor-pointer" onClick={() => handleSort('bankName')}>
                      <div className="flex items-center gap-1">
                        <span>Bank Name</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3.5">Sort Code / Route</th>
                    <th className="px-6 py-3.5 text-right">Ledger Sourced Balance</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {sortedAccounts.length > 0 ? (
                    sortedAccounts.map(acc => (
                      <tr key={acc.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {acc.logoUrl ? (
                              <img src={acc.logoUrl} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-slate-100 object-cover" alt="Bank logo" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                {acc.bankName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-800">{acc.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono font-bold">{acc.accountNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-600">{acc.accountType}</td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{acc.bankName}</td>
                        <td className="px-6 py-4 font-mono text-slate-500 text-[10px]">{acc.sortCode || '--'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-extrabold text-slate-900">${acc.currentBalance.toLocaleString()}</div>
                          <div className="text-[9px] text-slate-400 font-medium">Opening: ${acc.openingBalance.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            acc.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {acc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(acc)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 cursor-pointer"
                              title="Edit Registry details"
                            >
                              <Edit className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(acc.id)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
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
                        <Landmark className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                        <span>No registered treasury accounts found.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {viewMode === 'create' ? 'Register Corporate Bank Account' : 'Revise Registered Bank Details'}
              </h3>
              <p className="text-[10px] text-slate-500">Record banking credentials, contact coordinates, opening ledger sums, and institution logo links.</p>
            </div>
            <button type="button" onClick={() => setViewMode('list')} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Corporate Account Name *</label>
                <input
                  type="text" required
                  placeholder="e.g. SVB Operating Checking"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bank Institution Name *</label>
                <input
                  type="text" required
                  placeholder="e.g. Silicon Valley Bank"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Account Holder Name *</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Account Number *</label>
                <input
                  type="text" required
                  placeholder="e.g. •••• 8910"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sort Code / ACH Route</label>
                <input
                  type="text"
                  placeholder="e.g. SV-9210-09"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-mono"
                  value={sortCode}
                  onChange={(e) => setSortCode(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Account Type *</label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-semibold"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as any)}
                >
                  <option value="Checking">Checking Account</option>
                  <option value="Savings">Savings Account</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash / Vault">Cash / Vault Sourced</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Base Currency</label>
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Opening Balance Sum ($) *</label>
                <input
                  type="number" required min={0}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-extrabold"
                  value={openingBalance}
                  onChange={(e) => {
                    setOpeningBalance(Number(e.target.value));
                    if (viewMode === 'create') setCurrentBalance(Number(e.target.value));
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {viewMode === 'edit' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Current Ledger Balance ($) *</label>
                  <input
                    type="number" required min={0}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-extrabold text-emerald-600"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bank Branch Contact Number</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (415) 555-8910"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Account Status</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none font-semibold"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="Active">Active / Operating</option>
                  <option value="Inactive">Inactive / Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Logo URL Link</label>
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
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
              Save Registry Account
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
