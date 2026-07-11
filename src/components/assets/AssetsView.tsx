import React, { useState, useRef } from 'react';
import { 
  Monitor, Search, Plus, Download, Settings, MoreVertical, 
  Trash2, Eye, Edit2, CheckCircle, Ban, AlertTriangle, 
  RefreshCw, UserCheck, UserMinus, X, Camera, Paperclip
} from 'lucide-react';
import { Employee } from '../../types';

interface Asset {
  id: string; // e.g. AST-001
  name: string;
  type: string;
  serialNumber: string;
  value: string;
  location: string;
  status: 'Available' | 'Deployed' | 'Non Functional' | 'Lost' | 'Damaged' | 'Under Maintenance';
  lentTo: string; // Employee name or "None"
  dateAdded: string;
  dateLent?: string;
  pictureUrl: string;
  description: string;
}

const INITIAL_ASSETS: Asset[] = [
  {
    id: 'AST-001',
    name: 'MacBook Pro 16" M3 Max (64GB, 2TB)',
    type: 'Laptops',
    serialNumber: 'SN-M3X-982109',
    value: '$3,800',
    location: 'Main HQ Office',
    status: 'Deployed',
    lentTo: 'Elena Rostova',
    dateAdded: '2026-01-10',
    dateLent: '2026-02-15',
    pictureUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100',
    description: 'Corporate laptop issued to engineering team lead for development build operations.'
  },
  {
    id: 'AST-002',
    name: 'Dell UltraSharp 32" 4K Thunderbolt Monitor',
    type: 'Monitors',
    serialNumber: 'SN-DEL-401290',
    value: '$850',
    location: 'Remote Worksuite Office',
    status: 'Deployed',
    lentTo: 'Daniel Park',
    dateAdded: '2026-02-20',
    dateLent: '2026-03-01',
    pictureUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100',
    description: 'High-definition developer desktop expansion monitor mapped to biometric clock terminal.'
  },
  {
    id: 'AST-003',
    name: 'iPhone 15 Pro Max 512GB Space Black',
    type: 'Mobile Phones',
    serialNumber: 'SN-IPH-771234',
    value: '$1,399',
    location: 'Lobby Port terminal',
    status: 'Available',
    lentTo: 'None',
    dateAdded: '2026-03-12',
    pictureUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100',
    description: 'Mobile authentication device for webhook verification and multi-factor testing.'
  },
  {
    id: 'AST-004',
    name: 'Asus ROG Zephyrus G16 Gaming Laptop',
    type: 'Laptops',
    serialNumber: 'SN-ROG-321156',
    value: '$2,200',
    location: 'IT Labs Depot',
    status: 'Under Maintenance',
    lentTo: 'None',
    dateAdded: '2026-04-05',
    pictureUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100',
    description: 'Assigned for standard operating GPU shader analysis. Hardware fan replacement in progress.'
  },
  {
    id: 'AST-005',
    name: 'ThinkPad X1 Carbon Gen 11',
    type: 'Laptops',
    serialNumber: 'SN-THK-890212',
    value: '$1,900',
    location: 'Main HQ Office',
    status: 'Damaged',
    lentTo: 'James Carter',
    dateAdded: '2026-01-15',
    dateLent: '2026-05-10',
    pictureUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100',
    description: 'Broken display hinge following office desk relocation.'
  }
];

interface AssetsViewProps {
  employees: Employee[];
}

export default function AssetsView({ employees }: AssetsViewProps) {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);

  // Filters State
  const [filterType, setFilterType] = useState('All');
  const [filterEmployee, setFilterEmployee] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination bounds
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Layout Views: 'list' | 'add' | 'edit'
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);

  // Active Modals state
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  const [assigningAsset, setAssigningAsset] = useState<Asset | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  // Dropdown contexts
  const [assetTypes, setAssetTypes] = useState<string[]>(['Laptops', 'Monitors', 'Mobile Phones', 'Printers', 'Access Cards']);

  // Add/Edit Form state
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Laptops');
  const [formSerial, setFormSerial] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formStatus, setFormStatus] = useState<'Available' | 'Deployed' | 'Non Functional' | 'Lost' | 'Damaged' | 'Under Maintenance'>('Available');
  const [formDesc, setFormDesc] = useState('');
  const [formPicture, setFormPicture] = useState('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100');

  // Actions Dropdowns mapping (for row click or three-dot click)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Search and Filter logic
  const filteredAssets = assets.filter(asset => {
    // Search
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Type filter
    if (filterType !== 'All' && asset.type !== filterType) return false;

    // Employee filter
    if (filterEmployee !== 'All' && asset.lentTo !== filterEmployee) return false;

    // Status filter
    if (filterStatus !== 'All' && asset.status !== filterStatus) return false;

    return true;
  });

  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + entriesPerPage);
  const totalPages = Math.ceil(filteredAssets.length / entriesPerPage);

  // Total valuation calculation
  const totalValuation = assets.reduce((acc, current) => {
    const numeric = parseFloat(current.value.replace(/[^0-9.]/g, '')) || 0;
    return acc + numeric;
  }, 0);

  // File Picture Selector Mock
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handlePictureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormPicture(url);
    }
  };

  // Add Asset action
  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSerial.trim()) return;

    if (currentView === 'add') {
      const newAsset: Asset = {
        id: `AST-00${assets.length + 1}`,
        name: formName,
        type: formType,
        serialNumber: formSerial,
        value: formValue.startsWith('$') ? formValue : `$${formValue}`,
        location: formLocation || 'IT Labs Depot',
        status: formStatus,
        lentTo: 'None',
        dateAdded: new Date().toISOString().split('T')[0],
        pictureUrl: formPicture,
        description: formDesc
      };
      setAssets([newAsset, ...assets]);
    } else if (currentView === 'edit' && editingAssetId) {
      setAssets(prev => prev.map(item => {
        if (item.id === editingAssetId) {
          return {
            ...item,
            name: formName,
            type: formType,
            serialNumber: formSerial,
            value: formValue,
            location: formLocation,
            status: formStatus,
            description: formDesc,
            pictureUrl: formPicture
          };
        }
        return item;
      }));
    }

    // Reset Form & View
    setFormName('');
    setFormSerial('');
    setFormValue('');
    setFormLocation('');
    setFormStatus('Available');
    setFormDesc('');
    setFormPicture('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100');
    setCurrentView('list');
    setEditingAssetId(null);
  };

  // Trigger Edit Form
  const triggerEditAsset = (asset: Asset) => {
    setEditingAssetId(asset.id);
    setFormName(asset.name);
    setFormType(asset.type);
    setFormSerial(asset.serialNumber);
    setFormValue(asset.value);
    setFormLocation(asset.location);
    setFormStatus(asset.status);
    setFormDesc(asset.description);
    setFormPicture(asset.pictureUrl);
    setCurrentView('edit');
    setActiveMenuId(null);
  };

  // Delete asset
  const handleDeleteAsset = (id: string) => {
    if (confirm(`Are you sure you want to retire and delete Asset ${id}?`)) {
      setAssets(prev => prev.filter(item => item.id !== id));
      setActiveMenuId(null);
    }
  };

  // Assign asset to employee
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningAsset || !selectedAssignee) return;

    setAssets(prev => prev.map(item => {
      if (item.id === assigningAsset.id) {
        return {
          ...item,
          lentTo: selectedAssignee,
          status: 'Deployed',
          dateLent: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    setSelectedAssignee('');
    setAssigningAsset(null);
    setActiveMenuId(null);
  };

  // Return asset to pool
  const handleReturnAsset = (asset: Asset) => {
    if (confirm(`Are you sure you want to mark Asset ${asset.id} returned to available IT pool?`)) {
      setAssets(prev => prev.map(item => {
        if (item.id === asset.id) {
          return {
            ...item,
            lentTo: 'None',
            status: 'Available',
            dateLent: undefined
          };
        }
        return item;
      }));
      setActiveMenuId(null);
    }
  };

  // Mark asset as in maintenance
  const handleMarkMaintenance = (asset: Asset) => {
    setAssets(prev => prev.map(item => {
      if (item.id === asset.id) {
        return {
          ...item,
          status: 'Under Maintenance',
          lentTo: 'None' // Reset assignment if entering maintenance
        };
      }
      return item;
    }));
    setActiveMenuId(null);
    alert(`Asset ${asset.id} has been moved to Under Maintenance.`);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Asset ID,Name,Type,Serial Number,Value,Location,Status,Lent To"].join(",") + "\n"
      + filteredAssets.map(a => `"${a.id}","${a.name}","${a.type}","${a.serialNumber}","${a.value}","${a.location}","${a.status}","${a.lentTo}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Asset_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* STATS OVERVIEW CARDS */}
      {currentView === 'list' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="asset-stats-cards">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Hardware Ledger Valuation</span>
            <h3 className="text-xl font-black text-slate-900 mt-1 font-mono">${totalValuation.toLocaleString()} USD</h3>
            <p className="text-xs text-indigo-600 font-bold mt-1">Total Assets count: {assets.length} items</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assigned / In Active Use</span>
            <h3 className="text-xl font-bold text-emerald-600 mt-1">
              {assets.filter(a => a.status === 'Deployed').length} Items Deployed
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Issued to certified staff members.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Damaged / In Maintenance</span>
            <h3 className="text-xl font-bold text-amber-600 mt-1">
              {assets.filter(a => ['Damaged', 'Under Maintenance', 'Non Functional'].includes(a.status)).length} Items Flagged
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Repair and configuration logs pending.</p>
          </div>
        </div>
      )}

      {/* 1. ASSETS LEDGER LISTING VIEW */}
      {currentView === 'list' && (
        <div className="space-y-6">
          {/* Action / Filtering Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-indigo-600" />
                  <span>Hardware Assets Management</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Track deployment registries, serial numbers, and lending histories.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="btn-export-assets"
                  onClick={handleExportCSV}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  id="btn-add-asset"
                  onClick={() => {
                    setCurrentView('add');
                    setFormStatus('Available');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Asset</span>
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Asset Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="All">All Types</option>
                  {assetTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Lent / Assigned To</label>
                <select
                  value={filterEmployee}
                  onChange={(e) => setFilterEmployee(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="All">All Employees</option>
                  <option value="None">Available Pool (None)</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Deployed">Deployed</option>
                  <option value="Non Functional">Non Functional</option>
                  <option value="Lost">Lost</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>

              <div className="relative self-end">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or S/N..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table Element */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Asset Image</th>
                    <th className="px-6 py-4">Asset Name</th>
                    <th className="px-6 py-4">Lent To</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Lent / Added Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        <Monitor className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-bold">No Record Found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedAssets.map(asset => (
                      <tr key={asset.id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-500">{asset.id}</td>
                        <td className="px-6 py-4">
                          <img
                            src={asset.pictureUrl}
                            alt={asset.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">{asset.name}</h4>
                            <p className="text-[11px] text-slate-400 font-mono">S/N: {asset.serialNumber} • Val: {asset.value}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-indigo-700">
                          {asset.lentTo === 'None' ? (
                            <span className="text-slate-400 font-medium">Available Depot</span>
                          ) : (
                            <span>{asset.lentTo}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black ${
                            asset.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            asset.status === 'Deployed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            asset.status === 'Under Maintenance' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            asset.status === 'Damaged' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500 font-medium">
                          {asset.dateLent || asset.dateAdded}
                        </td>
                        <td className="px-6 py-4 text-right relative">
                          <div className="flex justify-end items-center gap-1.5">
                            <button
                              onClick={() => setViewingAsset(asset)}
                              className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded border border-slate-200"
                            >
                              View
                            </button>
                            <div className="relative">
                              <button
                                onClick={() => setActiveMenuId(activeMenuId === asset.id ? null : asset.id)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {/* Interactive Inline Action Popover Menu */}
                              {activeMenuId === asset.id && (
                                <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 text-left">
                                  <button
                                    onClick={() => triggerEditAsset(asset)}
                                    className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 text-[11px] font-bold text-slate-700 flex items-center gap-2"
                                  >
                                    <Edit2 className="h-3 w-3 text-slate-400" />
                                    <span>Edit Details</span>
                                  </button>
                                  {asset.lentTo === 'None' ? (
                                    <button
                                      onClick={() => setAssigningAsset(asset)}
                                      className="w-full text-left px-3.5 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] font-bold text-slate-700 flex items-center gap-2"
                                    >
                                      <UserCheck className="h-3 w-3 text-indigo-500" />
                                      <span>Assign To Staff</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleReturnAsset(asset)}
                                      className="w-full text-left px-3.5 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] font-bold text-slate-700 flex items-center gap-2"
                                    >
                                      <UserMinus className="h-3 w-3 text-red-500" />
                                      <span>Return Asset</span>
                                    </button>
                                  )}
                                  {asset.status !== 'Under Maintenance' && (
                                    <button
                                      onClick={() => handleMarkMaintenance(asset)}
                                      className="w-full text-left px-3.5 py-1.5 hover:bg-amber-50 hover:text-amber-700 text-[11px] font-bold text-slate-700 flex items-center gap-2"
                                    >
                                      <RefreshCw className="h-3 w-3 text-amber-500" />
                                      <span>Maintenance</span>
                                    </button>
                                  )}
                                  <div className="h-px bg-slate-100 my-1" />
                                  <button
                                    onClick={() => handleDeleteAsset(asset.id)}
                                    className="w-full text-left px-3.5 py-1.5 hover:bg-red-50 text-[11px] font-bold text-red-600 flex items-center gap-2"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    <span>Delete / Retire</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg text-xs p-1 font-bold text-slate-700 focus:outline-none"
                >
                  <option value="5">5 entries</option>
                  <option value="10">10 entries</option>
                  <option value="25">25 entries</option>
                </select>
                <span className="text-xs text-slate-500 font-medium">
                  showing {filteredAssets.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredAssets.length)} of {filteredAssets.length} assets
                </span>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        currentPage === i + 1 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD / EDIT ASSET PAGE */}
      {(currentView === 'add' || currentView === 'edit') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                {currentView === 'add' ? 'Register New Hardware Asset' : 'Modify Asset Details'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Log newly acquired computing rigs or mapping devices.</p>
            </div>
            <button
              onClick={() => {
                setCurrentView('list');
                setEditingAssetId(null);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl"
            >
              Back to ledger
            </button>
          </div>

          <form onSubmit={handleSaveAsset} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Asset Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell UltraSharp 32, iPad Pro..."
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              {/* Asset Type Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Asset Type</label>
                <div className="flex gap-2">
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="flex-1 bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  >
                    {assetTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const value = prompt("Enter custom Asset Type Name:");
                      if (value && value.trim()) {
                        setAssetTypes([...assetTypes, value.trim()]);
                        setFormType(value.trim());
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl border border-slate-200 flex items-center justify-center"
                    title="Add Asset Type"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Serial Number */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Serial Number (S/N)</label>
                <input
                  type="text"
                  required
                  placeholder="SN-XXX-XXXXXX"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  value={formSerial}
                  onChange={(e) => setFormSerial(e.target.value)}
                />
              </div>

              {/* Est Value */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Asset Value (Remuneration)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. $1,500"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Storage Depot Location</label>
                <input
                  type="text"
                  placeholder="e.g. Main HQ Office, IT Depot"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Status selection Radios */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Initial Asset Status</label>
              <div className="flex flex-wrap gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {['Available', 'Non Functional', 'Lost', 'Damaged', 'Under Maintenance'].map(stat => (
                  <label key={stat} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                    <input
                      type="radio"
                      name="formStatus"
                      checked={formStatus === stat}
                      onChange={() => setFormStatus(stat as any)}
                      className="accent-indigo-600 h-4 w-4"
                    />
                    <span>{stat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Picture upload workspace with preview */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Asset Graphic Image</label>
              <div className="flex items-center gap-4">
                <img
                  src={formPicture}
                  alt="Asset Preview"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 shadow-sm"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl px-5 py-3 text-center cursor-pointer bg-slate-50 hover:bg-indigo-50/10 transition-colors flex items-center gap-2"
                >
                  <Camera className="h-4.5 w-4.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Choose Graphic file or photo</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePictureSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Description Notes</label>
              <textarea
                rows={4}
                placeholder="Include custom specifications, accessories issued, or warranty expiration logs..."
                className="w-full bg-slate-50 text-slate-800 text-xs p-3 focus:outline-none rounded-xl border border-slate-200 font-medium leading-relaxed resize-none"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>

            {/* Form Footer */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 font-sans">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('list');
                  setEditingAssetId(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer shadow-sm"
              >
                Save Asset Registry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW ASSET DETAIL MODAL */}
      {viewingAsset && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4 mx-4">
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={viewingAsset.pictureUrl}
                  alt={viewingAsset.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                />
                <div>
                  <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                    {viewingAsset.type}
                  </span>
                  <h3 className="text-xs font-black text-slate-900 leading-snug pt-0.5">{viewingAsset.name}</h3>
                </div>
              </div>
              <button 
                onClick={() => setViewingAsset(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Asset Specs and Ledger Meta */}
            <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-bold">
              <div>
                <span className="text-slate-400">Asset S/N:</span>{' '}
                <span className="font-mono text-slate-800">{viewingAsset.serialNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">Valuation:</span>{' '}
                <span className="text-indigo-600">{viewingAsset.value}</span>
              </div>
              <div>
                <span className="text-slate-400">Depot:</span>{' '}
                <span className="text-slate-800">{viewingAsset.location}</span>
              </div>
              <div>
                <span className="text-slate-400">Registered:</span>{' '}
                <span className="font-mono text-slate-800">{viewingAsset.dateAdded}</span>
              </div>
              <div className="col-span-2 border-t border-slate-200/60 pt-2 flex justify-between">
                <span>Lent Status: <strong className="text-indigo-700">{viewingAsset.lentTo}</strong></span>
                {viewingAsset.dateLent && (
                  <span>Lent Date: <strong className="font-mono text-slate-700">{viewingAsset.dateLent}</strong></span>
                )}
              </div>
            </div>

            {/* Description block */}
            <div className="text-xs text-slate-500 leading-relaxed font-medium">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Description / Spec Sheet</h5>
              <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-sans italic">"{viewingAsset.description}"</p>
            </div>

            {/* Footer action buttons */}
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full ${
                viewingAsset.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
              }`}>
                Current State: {viewingAsset.status}
              </span>
              <button
                onClick={() => setViewingAsset(null)}
                className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN ASSET TO EMPLOYEE MODAL */}
      {assigningAsset && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-100 shadow-2xl space-y-4 mx-4">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 font-mono uppercase tracking-wide">
                Assign Asset: {assigningAsset.id}
              </h3>
              <button 
                onClick={() => setAssigningAsset(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Target select form */}
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                Select an active, biometric-certified staff member to issue <strong className="text-slate-800 font-bold">"{assigningAsset.name}"</strong>.
              </p>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Select Staff Member</label>
                <select
                  required
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="">-- Choose active employee directory --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningAsset(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer shadow-sm"
                >
                  Authorize Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
