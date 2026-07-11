import React, { useState } from 'react';
import { HelpCircle, Save, Plus, Trash2, Receipt, AlertCircle, Edit2, ToggleLeft, ToggleRight, DollarSign } from 'lucide-react';

interface TaxSettingsProps {
  onNotify: (message: string) => void;
}

interface TaxRule {
  id: string;
  name: string;
  rate: number;
  scope: 'Domestic' | 'International' | 'State' | 'EU-VAT';
  status: 'active' | 'inactive';
}

const INITIAL_TAXES: TaxRule[] = [
  { id: 'tax-1', name: 'VAT Standard Rate', rate: 15.00, scope: 'EU-VAT', status: 'active' },
  { id: 'tax-2', name: 'Federal Sales Tax', rate: 8.25, scope: 'Domestic', status: 'active' },
  { id: 'tax-3', name: 'California State Tax', rate: 7.25, scope: 'State', status: 'active' },
  { id: 'tax-4', name: 'Service Tax Levy', rate: 5.00, scope: 'International', status: 'inactive' }
];

export default function TaxSettings({ onNotify }: TaxSettingsProps) {
  const [taxes, setTaxes] = useState<TaxRule[]>(INITIAL_TAXES);
  const [taxIdNumber, setTaxIdNumber] = useState('TX-890-551-A');
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState(10.00);
  const [newScope, setNewScope] = useState<'Domestic' | 'International' | 'State' | 'EU-VAT'>('Domestic');

  // Active edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState(10.00);

  const handleAddTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newRule: TaxRule = {
      id: `tax-${Date.now()}`,
      name: newName,
      rate: Number(newRate),
      scope: newScope,
      status: 'active'
    };

    setTaxes(prev => [...prev, newRule]);
    setIsAdding(false);
    setNewName('');
    setNewRate(10.00);
    setNewScope('Domestic');
    onNotify(`Tax Rule "${newRule.name}" created at ${newRule.rate}%!`);
  };

  const handleDeleteTax = (id: string) => {
    setTaxes(prev => prev.filter(t => t.id !== id));
    onNotify('Tax rule deleted.');
  };

  const toggleTaxStatus = (id: string) => {
    setTaxes(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'active' ? 'inactive' : 'active';
        onNotify(`"${t.name}" status changed to ${nextStatus}.`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleSaveTaxId = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Corporate Tax Registration ID updated.');
  };

  return (
    <div className="space-y-6" id="tax-settings-root">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • System Settings • Tax Settings
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tax Settings</h2>
            <p className="text-xs text-slate-500 font-medium">Register corporate Tax/VAT modules, scope percentages, and automatic calculation triggers.</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="self-start sm:self-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-3xs"
          >
            <Plus className="h-4 w-4" />
            Add Tax Rate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tax Rules Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-3xs overflow-hidden">
          <div className="p-4 bg-slate-50/50 border-b border-slate-150 flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Active Registered Tax Rates</span>
            <Receipt className="h-4 w-4 text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50/20 text-[10px] text-slate-400 uppercase font-black">
                  <th className="p-4 font-bold">Tax Name</th>
                  <th className="p-4 font-bold">Scope</th>
                  <th className="p-4 font-bold">Percentage Rate</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {taxes.map(t => {
                  // Region-specific visual badge themes
                  let scopeBadgeClass = 'bg-slate-50 text-slate-600 border-slate-200';
                  if (t.scope === 'EU-VAT') {
                    scopeBadgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-150';
                  } else if (t.scope === 'Domestic') {
                    scopeBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-150';
                  } else if (t.scope === 'State') {
                    scopeBadgeClass = 'bg-amber-50 text-amber-700 border-amber-150';
                  } else if (t.scope === 'International') {
                    scopeBadgeClass = 'bg-purple-50 text-purple-700 border-purple-150';
                  }

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/40 transition-all">
                      <td className="p-4 pl-5">
                        <div className="font-extrabold text-slate-800">{t.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.id}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${scopeBadgeClass}`}>
                          {t.scope}
                        </span>
                      </td>
                      <td className="p-4">
                        {editingId === t.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.01"
                              className="w-16 bg-white border border-indigo-300 rounded p-1 text-xs font-bold text-slate-800 focus:outline-none"
                              value={editRate}
                              onChange={(e) => setEditRate(Number(e.target.value))}
                            />
                            <button
                              onClick={() => {
                                setTaxes(prev => prev.map(item => item.id === t.id ? { ...item, rate: editRate } : item));
                                setEditingId(null);
                                onNotify(`Updated rate of ${t.name} to ${editRate}%`);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono font-extrabold text-slate-900 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded">
                            {t.rate.toFixed(2)}%
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleTaxStatus(t.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer border transition-colors ${
                            t.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50' 
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-150/40'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {t.status}
                        </button>
                      </td>
                      <td className="p-4 text-right pr-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingId(t.id);
                              setEditRate(t.rate);
                            }}
                            className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            title="Edit Rate"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTax(t.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete Tax"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Tax ID Configuration & Auto Options */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tax ID Box */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-3xs p-6 space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Corporate Tax Registration</h4>
            <form onSubmit={handleSaveTaxId} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Registration Number (EIN/VAT)</label>
                <input
                  type="text"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                  value={taxIdNumber}
                  onChange={(e) => setTaxIdNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Registered Legal State Address</label>
                <select className="w-full bg-white text-slate-850 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:border-indigo-500">
                  <option>California Office Hub (FST 7.25%)</option>
                  <option>Delaware Holding Shell</option>
                  <option>Frankfurt Logistics Branch (VAT 19%)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
              >
                <Save className="h-3.5 w-3.5" />
                Update Tax ID
              </button>
            </form>
          </div>

          {/* Tax Rules & Buttons */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-3xs p-6 space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Tax Calculation Policy</h4>
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Default Calculation Method</span>
              <div className="flex gap-2">
                {['Standard', 'Compound'].map((method) => {
                  const isSel = method === 'Standard'; // Mock state or standard
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => onNotify(`Calculations set to ${method} Tax mode!`)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        isSel 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {method} Tax
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Auto-Apply to New Estimates</span>
              <div className="flex gap-2">
                {['Always Apply', 'Manual Only'].map((opt) => {
                  const isSel = opt === 'Always Apply';
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onNotify(`New Estimates default policy updated: ${opt}`)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        isSel 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs text-amber-800">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
            <div className="space-y-1 font-semibold leading-relaxed">
              <span className="font-extrabold text-amber-900 block">Automated EU Tax Scopes</span>
              <p className="text-[11px]">EU-VAT rates utilize reverse-charge triggers based on client legal addresses. Ensure company address is complete inside Business Address tab.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Tax Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Add New Tax Rate Rule</span>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddTax} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Tax Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., UK Standard VAT"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Tax Scope Region</label>
                <select
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                  value={newScope}
                  onChange={(e: any) => setNewScope(e.target.value)}
                >
                  <option value="Domestic">Domestic (FST)</option>
                  <option value="EU-VAT">EU Value Added Tax (VAT)</option>
                  <option value="State">Local State / County Tax</option>
                  <option value="International">International Levy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Percentage Rate (%) *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:border-indigo-500 pr-8"
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer shadow-3xs"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
