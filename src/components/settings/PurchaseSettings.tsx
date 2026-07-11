import React, { useState } from 'react';
import { 
  ShoppingBag, Plus, Edit2, Trash2, X, Check, Bell, ShieldCheck, ShieldAlert, Coins, Percent, Landmark
} from 'lucide-react';

interface PurchaseSettingsProps {
  onNotify: (message: string) => void;
}

interface AuthorizedSignatory {
  id: string;
  name: string;
  role: string;
  limit: number; // 0 means Unlimited
  initials: string;
  status: 'Active' | 'Inactive';
}

export default function PurchaseSettings({ onNotify }: PurchaseSettingsProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'notifications' | 'signatures'>('settings');

  // 1. General Purchase Settings Form States
  const [poPrefix, setPoPrefix] = useState('PO-');
  const [reqPrefix, setReqPrefix] = useState('REQ-');
  const [startingPo, setStartingPo] = useState(1001);
  const [startingReq, setStartingReq] = useState(5001);
  const [vpThreshold, setVpThreshold] = useState(10000);
  const [autoInventoryUpdate, setAutoInventoryUpdate] = useState(true);
  const [negativeInventory, setNegativeInventory] = useState(false);
  const [defaultTaxRate, setDefaultTaxRate] = useState(8.5);

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poPrefix.trim()) {
      onNotify('Error: PO Prefix cannot be empty.');
      return;
    }
    onNotify('Purchase flow control settings updated successfully.');
  };

  // 2. Notification Settings States
  const [notifyNewReq, setNotifyNewReq] = useState(true);
  const [notifyPoApproved, setNotifyPoApproved] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [slackIntegration, setSlackIntegration] = useState(false);
  const [teamsIntegration, setTeamsIntegration] = useState(false);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Purchase notification rules saved successfully.');
  };

  // 3. Purchase Signature Settings States & Modal
  const [signatories, setSignatories] = useState<AuthorizedSignatory[]>([
    { id: '1', name: 'Aria Montgomery', role: 'Chief Financial Officer', limit: 0, initials: 'AM', status: 'Active' },
    { id: '2', name: 'Augustus Sterling', role: 'VP of Procurement', limit: 25000, initials: 'AS', status: 'Active' },
    { id: '3', name: 'Spencer Hastings', role: 'Director of IT Systems', limit: 10000, initials: 'SH', status: 'Active' }
  ]);
  const [showSignatoryModal, setShowSignatoryModal] = useState(false);
  const [editingSignatory, setEditingSignatory] = useState<AuthorizedSignatory | null>(null);
  const [sigForm, setSigForm] = useState({
    name: '',
    role: '',
    limit: 10000,
    initials: '',
    status: 'Active' as 'Active' | 'Inactive'
  });
  const [sigError, setSigError] = useState('');

  const handleOpenSigModal = (sig: AuthorizedSignatory | null = null) => {
    if (sig) {
      setEditingSignatory(sig);
      setSigForm({
        name: sig.name,
        role: sig.role,
        limit: sig.limit,
        initials: sig.initials,
        status: sig.status
      });
    } else {
      setEditingSignatory(null);
      setSigForm({
        name: '',
        role: '',
        limit: 10000,
        initials: '',
        status: 'Active'
      });
    }
    setSigError('');
    setShowSignatoryModal(true);
  };

  const handleSaveSignatory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sigForm.name.trim()) {
      setSigError('Name is required');
      return;
    }
    if (!sigForm.role.trim()) {
      setSigError('Authorized role is required');
      return;
    }
    if (!sigForm.initials.trim()) {
      setSigError('Digital signature initials are required');
      return;
    }

    if (editingSignatory) {
      setSignatories(prev => prev.map(s => s.id === editingSignatory.id ? { ...s, ...sigForm } : s));
      onNotify(`Authorized signatory "${sigForm.name}" updated.`);
    } else {
      const newSig: AuthorizedSignatory = {
        id: Date.now().toString(),
        ...sigForm
      };
      setSignatories(prev => [...prev, newSig]);
      onNotify(`Authorized signatory "${sigForm.name}" added successfully.`);
    }
    setShowSignatoryModal(false);
  };

  const handleDeleteSignatory = (id: string, name: string) => {
    if (confirm(`Are you sure you want to revoke purchase signing authority for "${name}"?`)) {
      setSignatories(prev => prev.filter(s => s.id !== id));
      onNotify(`Authority revoked for "${name}".`);
    }
  };

  const handleToggleSignatoryStatus = (id: string) => {
    setSignatories(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Inactive' : 'Active';
        onNotify(`Authority status for "${s.name}" is now ${nextStatus}.`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6" id="purchase-settings-view">
      
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
            <span>Purchase Settings</span>
          </h2>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            <span>Settings</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">Finance</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-400 font-medium">Purchase Settings</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {activeTab === 'signatures' && (
            <button 
              onClick={() => handleOpenSigModal()}
              className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors shrink-0"
            >
              <span className="font-extrabold text-sm leading-none">+</span>
              <span>Add Signatory Authority</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex flex-wrap border-b border-slate-200">
        {[
          { key: 'settings', label: 'Purchase Settings' },
          { key: 'notifications', label: 'Purchase Notification Settings' },
          { key: 'signatures', label: 'Purchase Signature Settings' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.key 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-3xs overflow-hidden p-5">
        
        {/* TAB 1: GENERAL PURCHASE SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveGeneralSettings} className="space-y-6 max-w-3xl text-xs font-semibold">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-slate-600 block">Purchase Order Prefix *</label>
                <input 
                  type="text" 
                  value={poPrefix}
                  onChange={(e) => setPoPrefix(e.target.value)}
                  placeholder="e.g. PO-"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Requisition Prefix *</label>
                <input 
                  type="text" 
                  value={reqPrefix}
                  onChange={(e) => setReqPrefix(e.target.value)}
                  placeholder="e.g. REQ-"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Starting PO Number</label>
                <input 
                  type="number" 
                  value={startingPo}
                  onChange={(e) => setStartingPo(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Starting Requisition Number</label>
                <input 
                  type="number" 
                  value={startingReq}
                  onChange={(e) => setStartingReq(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Threshold Requiring VP Sign-off ($)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={vpThreshold}
                    onChange={(e) => setVpThreshold(parseInt(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">Purchase amounts above this limit mandate double-auth stamp verification.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Default Purchasing Tax/VAT Rate (%)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 font-bold">%</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full pr-7 pl-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-slate-800 font-extrabold text-[12px]">Auto-Update Inventory Ledger</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Automatically add stock levels inside warehouses as soon as purchase order lines are stamped Received.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoInventoryUpdate(!autoInventoryUpdate)}
                  className="text-slate-700 cursor-pointer"
                >
                  <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${autoInventoryUpdate ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${autoInventoryUpdate ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </button>
              </div>

              <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-slate-800 font-extrabold text-[12px]">Allow Negative Inventory Ledger Levels</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Permit inventory assets and products to be issued below zero before purchase restocks clear.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNegativeInventory(!negativeInventory)}
                  className="text-slate-700 cursor-pointer"
                >
                  <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${negativeInventory ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${negativeInventory ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-150 flex justify-end">
              <button 
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Save General Purchase Controls</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: PURCHASE NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleSaveNotifications} className="space-y-6 max-w-2xl text-xs font-semibold">
            
            <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
              <div className="space-y-0.5">
                <h4 className="text-slate-800 font-extrabold text-[12px] flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-emerald-500" />
                  <span>Email on Purchase Requisition</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">Send automatic email notifications to inventory heads and department leads when new requisitions are submitted.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyNewReq(!notifyNewReq)}
                className="text-slate-700 cursor-pointer"
              >
                <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${notifyNewReq ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${notifyNewReq ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
              <div className="space-y-0.5">
                <h4 className="text-slate-800 font-extrabold text-[12px] flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  <span>Email on PO Approvals / Sign-off</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">Send confirmation alert emails to vendors and requesters as soon as a Purchase Order is fully signed.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyPoApproved(!notifyPoApproved)}
                className="text-slate-700 cursor-pointer"
              >
                <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${notifyPoApproved ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${notifyPoApproved ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
              <div className="space-y-0.5">
                <h4 className="text-slate-800 font-extrabold text-[12px] flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  <span>Inventory Low-Stock Warning Alerts</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">Dispatch automatic in-app critical warning flags as soon as warehouse stock counts dip below safety bounds.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyLowStock(!notifyLowStock)}
                className="text-slate-700 cursor-pointer"
              >
                <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${notifyLowStock ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${notifyLowStock ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>

            {notifyLowStock && (
              <div className="pl-6 border-l-2 border-slate-100 space-y-1.5 animate-fade-in max-w-sm">
                <label className="text-slate-600 block">Critical Low-Stock Limit (Units)</label>
                <input 
                  type="number" 
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
              </div>
            )}

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h4 className="text-slate-800 font-extrabold text-[13px] tracking-tight">Connected Team Messaging Alerts</h4>
              
              <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-slate-800 font-extrabold text-[12px]">Slack Webhook Integration</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Broadcast low-stock and requisition alerts directly to integrated corporate Slack channels.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSlackIntegration(!slackIntegration)}
                  className="text-slate-700 cursor-pointer"
                >
                  <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${slackIntegration ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${slackIntegration ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </button>
              </div>

              <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-slate-800 font-extrabold text-[12px]">Microsoft Teams Webhook</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Broadcast requisition approvals and updates to designated Microsoft Teams channels.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTeamsIntegration(!teamsIntegration)}
                  className="text-slate-700 cursor-pointer"
                >
                  <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${teamsIntegration ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${teamsIntegration ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-150 flex justify-end">
              <button 
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Save Notification Rules</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SIGNATURES */}
        {activeTab === 'signatures' && (
          <div className="space-y-5">
            <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl text-slate-700 text-xs">
              <p className="font-bold mb-1 flex items-center gap-1 text-indigo-700">
                <ShieldCheck className="h-4.5 w-4.5" />
                <span>Authorized Signatory Control Rules</span>
              </p>
              <p className="font-medium text-slate-500 leading-relaxed">Authorized signatories listed below possess authorization keys to sign-off and seal Purchase Orders. Each stamp is bound to predefined discretionary spending thresholds.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="px-5 py-3.5 w-16">#</th>
                    <th className="px-5 py-3.5">Authorized Officer</th>
                    <th className="px-5 py-3.5">Designated Role</th>
                    <th className="px-5 py-3.5">Max Spending Limit</th>
                    <th className="px-5 py-3.5">Digital Stamp</th>
                    <th className="px-5 py-3.5">Authority Status</th>
                    <th className="px-5 py-3.5 text-right w-44">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {signatories.map((sig, index) => (
                    <tr key={sig.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-5 py-4 text-slate-400 font-semibold">{index + 1}</td>
                      <td className="px-5 py-4 text-slate-800 font-bold">{sig.name}</td>
                      <td className="px-5 py-4 text-slate-500 font-bold">{sig.role}</td>
                      <td className="px-5 py-4 text-indigo-600 font-extrabold font-mono">
                        {sig.limit > 0 ? `$${sig.limit.toLocaleString()} USD` : 'Unlimited'}
                      </td>
                      <td className="px-5 py-4">
                        {/* Beautiful custom digital cursive signature display */}
                        <span className="inline-block font-serif text-[15px] italic text-indigo-700/80 tracking-widest bg-indigo-50/60 px-3.5 py-1 border border-indigo-100/40 rounded-sm select-none shadow-3xs cursor-default">
                          {sig.initials}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleSignatoryStatus(sig.id)}
                          className="cursor-pointer"
                        >
                          {sig.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                              Revoked
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenSigModal(sig)}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSignatory(sig.id, sig.name)}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                            <span>Revoke</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD/EDIT SIGNATORY MODAL */}
      {showSignatoryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="signatory-modal">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800">
                {editingSignatory ? 'Edit Signatory Authority' : 'Add Signatory Authority'}
              </h3>
              <button 
                onClick={() => setShowSignatoryModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveSignatory} className="p-5 space-y-4 text-xs font-semibold">
              {sigError && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-700 rounded-md flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{sigError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Signatory Full Name *</label>
                <input 
                  type="text" 
                  value={sigForm.name}
                  onChange={(e) => setSigForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. William Hastings"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Designated Purchasing Role *</label>
                <input 
                  type="text" 
                  value={sigForm.role}
                  onChange={(e) => setSigForm(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g. Finance VP, Chief Purchasing Lead"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Authorized Limit Cap ($ USD) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={sigForm.limit}
                    onChange={(e) => setSigForm(prev => ({ ...prev, limit: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Specify 0 for Unlimited purchasing authorization authority.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Digital Signature Stamp (Initials) *</label>
                <input 
                  type="text" 
                  value={sigForm.initials}
                  onChange={(e) => setSigForm(prev => ({ ...prev, initials: e.target.value.toUpperCase().slice(0, 4) }))}
                  placeholder="e.g. WH"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-serif font-bold text-center text-lg italic text-indigo-700 uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Authority Status</label>
                <select
                  value={sigForm.status}
                  onChange={(e) => setSigForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700 bg-white"
                >
                  <option value="Active">Active / Approved</option>
                  <option value="Inactive">Revoked / Suspended</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowSignatoryModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1d82f5] hover:bg-blue-600 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Signatory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
