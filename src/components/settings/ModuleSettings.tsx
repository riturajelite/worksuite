import React, { useState } from 'react';
import { 
  Settings, Puzzle, Shield, Users, Globe, ToggleLeft, ToggleRight, Check, Search, Download, HelpCircle, X, AlertTriangle, Cpu, CreditCard, Layers, Terminal, RefreshCw, Star
} from 'lucide-react';

interface ModuleSettingsProps {
  onNotify: (message: string) => void;
}

interface ModuleItem {
  id: string;
  name: string;
  enabled: boolean;
  category: string;
}

export default function ModuleSettings({ onNotify }: ModuleSettingsProps) {
  const [activeTab, setActiveTab] = useState<'admin' | 'employee' | 'client' | 'custom'>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [purchaseCode, setPurchaseCode] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [installing, setInstalling] = useState(false);
  const [isDemo, setIsDemo] = useState(true); // Demo mode simulation

  // Administrative Panel Modules
  const [adminModules, setAdminModules] = useState<ModuleItem[]>([
    { id: 'projects', name: 'Projects', enabled: true, category: 'Work' },
    { id: 'tickets', name: 'Tickets', enabled: true, category: 'Support' },
    { id: 'invoices', name: 'Invoices', enabled: true, category: 'Finance' },
    { id: 'estimates', name: 'Estimates', enabled: true, category: 'Finance' },
    { id: 'events', name: 'Events', enabled: true, category: 'Core' },
    { id: 'messages', name: 'Messages', enabled: true, category: 'Communication' },
    { id: 'tasks', name: 'Tasks', enabled: true, category: 'Work' },
    { id: 'timelogs', name: 'Time Logs', enabled: true, category: 'Work' },
    { id: 'contracts', name: 'Contracts', enabled: true, category: 'Client' },
    { id: 'notices', name: 'Notices', enabled: true, category: 'Core' },
    { id: 'payments', name: 'Payments', enabled: true, category: 'Finance' },
    { id: 'orders', name: 'Orders', enabled: true, category: 'Finance' },
    { id: 'kb', name: 'Knowledge Base', enabled: true, category: 'Support' },
    { id: 'clients', name: 'Clients', enabled: true, category: 'Client' },
    { id: 'employees', name: 'Employees', enabled: true, category: 'HR' },
    { id: 'attendance', name: 'Attendance', enabled: true, category: 'HR' },
    { id: 'expenses', name: 'Expenses', enabled: true, category: 'Finance' },
    { id: 'leaves', name: 'Leaves', enabled: true, category: 'HR' },
    { id: 'leads', name: 'Leads', enabled: true, category: 'Client' },
    { id: 'holidays', name: 'Holidays', enabled: true, category: 'HR' },
    { id: 'products', name: 'Products', enabled: true, category: 'Finance' },
    { id: 'reports', name: 'Reports', enabled: true, category: 'Finance' },
    { id: 'bankaccount', name: 'Bank Account', enabled: true, category: 'Finance' },
    { id: 'assets', name: 'Assets', enabled: true, category: 'Inventory' },
    { id: 'biolinks', name: 'Biolinks', enabled: true, category: 'Marketing' },
    { id: 'biometric', name: 'Biometric', enabled: true, category: 'HR' },
    { id: 'letter', name: 'Letter', enabled: true, category: 'HR' },
    { id: 'monitor', name: 'Monitor', enabled: true, category: 'Core' },
    { id: 'payroll', name: 'Payroll', enabled: true, category: 'HR' },
    { id: 'performance', name: 'Performance', enabled: true, category: 'HR' },
    { id: 'purchase', name: 'Purchase', enabled: true, category: 'Finance' },
    { id: 'qrcode', name: 'QR Code', enabled: true, category: 'Core' },
    { id: 'recruit', name: 'Recruit', enabled: true, category: 'HR' },
    { id: 'restapi', name: 'RestAPI', enabled: true, category: 'Developer' },
    { id: 'servermanager', name: 'Server Manager', enabled: true, category: 'Developer' },
    { id: 'webhooks', name: 'Webhooks', enabled: true, category: 'Developer' }
  ]);

  // Employee Panel Modules
  const [employeeModules, setEmployeeModules] = useState<ModuleItem[]>([
    { id: 'projects', name: 'Projects', enabled: true, category: 'Work' },
    { id: 'tickets', name: 'Tickets', enabled: true, category: 'Support' },
    { id: 'invoices', name: 'Invoices', enabled: true, category: 'Finance' },
    { id: 'estimates', name: 'Estimates', enabled: true, category: 'Finance' },
    { id: 'events', name: 'Events', enabled: true, category: 'Core' },
    { id: 'messages', name: 'Messages', enabled: true, category: 'Communication' },
    { id: 'tasks', name: 'Tasks', enabled: true, category: 'Work' },
    { id: 'timelogs', name: 'Time Logs', enabled: true, category: 'Work' },
    { id: 'contracts', name: 'Contracts', enabled: true, category: 'Client' },
    { id: 'notices', name: 'Notices', enabled: true, category: 'Core' },
    { id: 'payments', name: 'Payments', enabled: true, category: 'Finance' },
    { id: 'orders', name: 'Orders', enabled: true, category: 'Finance' },
    { id: 'kb', name: 'Knowledge Base', enabled: true, category: 'Support' },
    { id: 'clients', name: 'Clients', enabled: true, category: 'Client' },
    { id: 'employees', name: 'Employees', enabled: true, category: 'HR' },
    { id: 'attendance', name: 'Attendance', enabled: true, category: 'HR' },
    { id: 'expenses', name: 'Expenses', enabled: true, category: 'Finance' },
    { id: 'leaves', name: 'Leaves', enabled: true, category: 'HR' },
    { id: 'leads', name: 'Leads', enabled: true, category: 'Client' },
    { id: 'holidays', name: 'Holidays', enabled: true, category: 'HR' },
    { id: 'products', name: 'Products', enabled: true, category: 'Finance' },
    { id: 'reports', name: 'Reports', enabled: true, category: 'Finance' },
    { id: 'bankaccount', name: 'Bank Account', enabled: true, category: 'Finance' },
    { id: 'assets', name: 'Assets', enabled: true, category: 'Inventory' },
    { id: 'biolinks', name: 'Biolinks', enabled: true, category: 'Marketing' },
    { id: 'biometric', name: 'Biometric', enabled: true, category: 'HR' },
    { id: 'letter', name: 'Letter', enabled: true, category: 'HR' },
    { id: 'monitor', name: 'Monitor', enabled: true, category: 'Core' },
    { id: 'payroll', name: 'Payroll', enabled: true, category: 'HR' },
    { id: 'performance', name: 'Performance', enabled: true, category: 'HR' },
    { id: 'purchase', name: 'Purchase', enabled: true, category: 'Finance' },
    { id: 'qrcode', name: 'QR Code', enabled: true, category: 'Core' }
  ]);

  // Client Panel Modules
  const [clientModules, setClientModules] = useState<ModuleItem[]>([
    { id: 'projects', name: 'Projects', enabled: true, category: 'Work' },
    { id: 'tickets', name: 'Tickets', enabled: true, category: 'Support' },
    { id: 'invoices', name: 'Invoices', enabled: true, category: 'Finance' },
    { id: 'estimates', name: 'Estimates', enabled: true, category: 'Finance' },
    { id: 'events', name: 'Events', enabled: true, category: 'Core' },
    { id: 'messages', name: 'Messages', enabled: true, category: 'Communication' },
    { id: 'tasks', name: 'Tasks', enabled: true, category: 'Work' },
    { id: 'timelogs', name: 'Time Logs', enabled: true, category: 'Work' },
    { id: 'contracts', name: 'Contracts', enabled: true, category: 'Client' },
    { id: 'notices', name: 'Notices', enabled: true, category: 'Core' },
    { id: 'payments', name: 'Payments', enabled: true, category: 'Finance' },
    { id: 'orders', name: 'Orders', enabled: true, category: 'Finance' },
    { id: 'kb', name: 'Knowledge Base', enabled: true, category: 'Support' }
  ]);

  // Custom installed addons
  const [customModules, setCustomModules] = useState([
    { name: 'Asset', purchaseCode: '-', version: '2.1.21' },
    { name: 'Biolinks', purchaseCode: '-', version: '1.0.2' },
    { name: 'Biometric', purchaseCode: '-', version: '1.0.04' },
    { name: 'Letter', purchaseCode: '-', version: '1.0.1' },
    { name: 'Monitor', purchaseCode: '-', version: '1.0.0' },
    { name: 'Payroll', purchaseCode: '-', version: '2.1.9' },
    { name: 'Performance', purchaseCode: '-', version: '1.0.12' }
  ]);

  const handleToggleModule = (id: string, tab: 'admin' | 'employee' | 'client') => {
    const updateFn = (prev: ModuleItem[]) => 
      prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m);

    if (tab === 'admin') {
      setAdminModules(updateFn);
    } else if (tab === 'employee') {
      setEmployeeModules(updateFn);
    } else {
      setClientModules(updateFn);
    }
    
    const moduleName = [adminModules, employeeModules, clientModules]
      .flat()
      .find(m => m.id === id)?.name || id;
    
    onNotify(`Module '${moduleName}' state modified for ${tab.toUpperCase()} profile.`);
  };

  const getFilteredModules = (modules: ModuleItem[]) => {
    return modules.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const handleInstallModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      // Show warning/blocking UI inside modal like in screenshot "Settings cannot be changed in demo version"
      onNotify('Action blocked: Cannot install modules in demo version.');
      return;
    }
    setInstalling(true);
    setTimeout(() => {
      setInstalling(false);
      setShowInstallModal(false);
      onNotify('Custom Module installed successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6" id="module-settings-view">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Configuration Management</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Puzzle className="h-5.5 w-5.5 text-indigo-600 animate-pulse" />
            <span>Module Settings</span>
          </h2>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => setShowInstallModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          <span>Install/Update Module</span>
        </button>
      </div>

      {/* Tabs Menu & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Sub Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'admin', label: 'Admin', count: adminModules.length, icon: Shield },
              { id: 'employee', label: 'Employee', count: employeeModules.length, icon: Users },
              { id: 'client', label: 'Client', count: clientModules.length, icon: Globe },
              { id: 'custom', label: 'Custom Modules', count: customModules.length, icon: Layers }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <TabIcon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar (only show for searchable toggles) */}
          {activeTab !== 'custom' && (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full md:w-64 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6">
          {activeTab === 'admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFilteredModules(adminModules).map(module => (
                <div key={module.id} className="p-4 rounded-xl border border-slate-200/60 hover:border-indigo-200 hover:bg-slate-50/20 transition-all flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 text-xs">{module.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{module.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleModule(module.id, 'admin')}
                    className="cursor-pointer focus:outline-none"
                  >
                    {module.enabled ? (
                      <ToggleRight className="h-8 w-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
              {getFilteredModules(adminModules).length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-400 text-xs font-medium">
                  No modules match your search filter.
                </div>
              )}
            </div>
          )}

          {activeTab === 'employee' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFilteredModules(employeeModules).map(module => (
                <div key={module.id} className="p-4 rounded-xl border border-slate-200/60 hover:border-indigo-200 hover:bg-slate-50/20 transition-all flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 text-xs">{module.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{module.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleModule(module.id, 'employee')}
                    className="cursor-pointer focus:outline-none"
                  >
                    {module.enabled ? (
                      <ToggleRight className="h-8 w-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
              {getFilteredModules(employeeModules).length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-400 text-xs font-medium">
                  No modules match your search filter.
                </div>
              )}
            </div>
          )}

          {activeTab === 'client' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFilteredModules(clientModules).map(module => (
                <div key={module.id} className="p-4 rounded-xl border border-slate-200/60 hover:border-indigo-200 hover:bg-slate-50/20 transition-all flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 text-xs">{module.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{module.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleModule(module.id, 'client')}
                    className="cursor-pointer focus:outline-none"
                  >
                    {module.enabled ? (
                      <ToggleRight className="h-8 w-8 text-indigo-600" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
              {getFilteredModules(clientModules).length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-400 text-xs font-medium">
                  No modules match your search filter.
                </div>
              )}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Purchase Code</th>
                    <th className="py-3 px-4">Version</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {customModules.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{m.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{m.purchaseCode}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 font-mono font-black text-[10px] px-2 py-0.5 rounded-full">
                          {m.version}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* INSTALL/UPDATE MODULE MODAL */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Puzzle className="h-5 w-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-sm">Module Install/Update</h3>
              </div>
              <button 
                onClick={() => setShowInstallModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* DEMO MODE BLOCKING WARNING - To match the screenshots exactly */}
              {isDemo && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs leading-relaxed">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-extrabold text-amber-900 block">Settings cannot be changed in demo version</span>
                    <p className="text-amber-700 font-medium mt-0.5">
                      Module uploads and direct marketplace downloads are disabled in the shared sandbox workspace environment to prevent server memory bloat.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsDemo(false)}
                      className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      Bypass Sandbox Lock
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleInstallModule} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Enter Purchase Code</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isDemo}
                    value={purchaseCode}
                    onChange={(e) => setPurchaseCode(e.target.value)}
                    placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 disabled:opacity-50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Upload Module Bundle zip</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center bg-slate-50/50 hover:border-indigo-400 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".zip"
                      disabled={isDemo}
                      onChange={(e) => setSelectedFile(e.target.files?.[0]?.name || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                    />
                    <Cpu className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    {selectedFile ? (
                      <span className="text-xs font-bold text-indigo-600">{selectedFile}</span>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-slate-600 block">Choose zip archive or drag here</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">Accepts module bundles up to 50MB</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2.5 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInstallModal(false)}
                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isDemo || installing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {installing ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Deploying Bundle...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" />
                        <span>Install Module</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
