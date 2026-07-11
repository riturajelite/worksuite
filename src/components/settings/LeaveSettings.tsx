import React, { useState } from 'react';
import { HelpCircle, Save, Plus, Trash2, Calendar, RefreshCw, EyeOff, Archive, Check, Settings, ToggleLeft, ToggleRight } from 'lucide-react';

interface LeaveSettingsProps {
  onNotify: (message: string) => void;
}

interface LeaveType {
  id: string;
  name: string;
  daysAllowed: number;
  rollover: 'accumulative' | 'encashable' | 'none';
  status: 'active' | 'archived';
}

export default function LeaveSettings({ onNotify }: LeaveSettingsProps) {
  const [activeTab, setActiveTab] = useState<'types' | 'general' | 'archived'>('types');

  // Leave Types state
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([
    { id: 'lt-1', name: 'Annual Paid Vacation', daysAllowed: 18, rollover: 'accumulative', status: 'active' },
    { id: 'lt-2', name: 'Sick & Medical Leave', daysAllowed: 12, rollover: 'none', status: 'active' },
    { id: 'lt-3', name: 'Maternity Leave', daysAllowed: 90, rollover: 'none', status: 'active' },
    { id: 'lt-4', name: 'Casual Personal Leave', daysAllowed: 6, rollover: 'encashable', status: 'active' },
    { id: 'lt-5', name: 'Legacy Emergency COVID-19 Leave', daysAllowed: 14, rollover: 'none', status: 'archived' },
    { id: 'lt-6', name: 'Legacy Travel Compensation Leave', daysAllowed: 3, rollover: 'accumulative', status: 'archived' }
  ]);

  // General parameters
  const [cutoffDays, setCutoffDays] = useState(5); // must apply 5 days in advance
  const [includeHolidays, setIncludeHolidays] = useState(false);
  const [multiApproval, setMultiApproval] = useState(true);

  // Form states
  const [isAddingType, setIsAddingType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newDaysAllowed, setNewDaysAllowed] = useState(10);
  const [newRollover, setNewRollover] = useState<'accumulative' | 'encashable' | 'none'>('accumulative');

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    const newT: LeaveType = {
      id: `lt-${Date.now()}`,
      name: newTypeName,
      daysAllowed: Number(newDaysAllowed),
      rollover: newRollover,
      status: 'active'
    };

    setLeaveTypes(prev => [...prev, newT]);
    setIsAddingType(false);
    setNewTypeName('');
    setNewDaysAllowed(10);
    onNotify(`Saved Leave Structure for "${newT.name}"!`);
  };

  const archiveType = (id: string) => {
    setLeaveTypes(prev => prev.map(t => {
      if (t.id === id) {
        onNotify(`Archived Leave Type "${t.name}".`);
        return { ...t, status: 'archived' };
      }
      return t;
    }));
  };

  const restoreType = (id: string) => {
    setLeaveTypes(prev => prev.map(t => {
      if (t.id === id) {
        onNotify(`Restored Active Leave Type "${t.name}"!`);
        return { ...t, status: 'active' };
      }
      return t;
    }));
  };

  const deleteTypePermanently = (id: string) => {
    setLeaveTypes(prev => prev.filter(t => t.id !== id));
    onNotify('Leave type deleted permanently.');
  };

  const handleSaveAll = () => {
    onNotify('Holiday allowances and Entitlements saved successfully!');
  };

  const activeTypes = leaveTypes.filter(t => t.status === 'active');
  const archivedTypes = leaveTypes.filter(t => t.status === 'archived');

  return (
    <div className="space-y-6" id="leave-settings-root">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • System Settings • Leave Settings
        </div>
        <h2 className="text-xl font-bold text-slate-800">Leave Settings</h2>
        <p className="text-xs text-slate-500 font-medium font-semibold">Configure annual holiday limits, sick leave allowances, rollover caps, and manager review buffers.</p>
      </div>

      {/* Tabs selection */}
      <div className="flex gap-2 border-b border-slate-150 pb-2">
        <button
          onClick={() => setActiveTab('types')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'types' 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
              : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          Leave Entitlement Types ({activeTypes.length})
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'general' 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
              : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
          }`}
        >
          <Settings className="h-3.5 w-3.5" />
          General Allowances
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'archived' 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
              : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
          }`}
        >
          <Archive className="h-3.5 w-3.5" />
          Archived Templates ({archivedTypes.length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-3xs p-6 space-y-6">
        
        {/* PANEL 1: Leave Types */}
        {activeTab === 'types' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Leave Entitlement Structures</h3>
                <p className="text-[11px] text-slate-500 font-semibold">Establish annual paid counters and accrual methods.</p>
              </div>
              <button
                onClick={() => setIsAddingType(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                Add Leave Type
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeTypes.map((t, idx) => {
                // Determine theme color and icon representation based on name
                let colorClass = 'border-l-indigo-500 text-indigo-700 bg-indigo-50/10';
                let pillColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                let iconBg = 'bg-indigo-100/60 text-indigo-600';
                
                if (t.name.toLowerCase().includes('annual') || t.name.toLowerCase().includes('vacation')) {
                  colorClass = 'border-l-emerald-500 text-emerald-700 bg-emerald-50/10';
                  pillColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  iconBg = 'bg-emerald-100/60 text-emerald-600';
                } else if (t.name.toLowerCase().includes('sick') || t.name.toLowerCase().includes('medical')) {
                  colorClass = 'border-l-rose-500 text-rose-700 bg-rose-50/10';
                  pillColor = 'bg-rose-50 text-rose-700 border-rose-200';
                  iconBg = 'bg-rose-100/60 text-rose-600';
                } else if (t.name.toLowerCase().includes('maternity') || t.name.toLowerCase().includes('parental')) {
                  colorClass = 'border-l-purple-500 text-purple-700 bg-purple-50/10';
                  pillColor = 'bg-purple-50 text-purple-700 border-purple-200';
                  iconBg = 'bg-purple-100/60 text-purple-600';
                } else if (t.name.toLowerCase().includes('casual') || t.name.toLowerCase().includes('personal')) {
                  colorClass = 'border-l-amber-500 text-amber-700 bg-amber-50/10';
                  pillColor = 'bg-amber-50 text-amber-700 border-amber-200';
                  iconBg = 'bg-amber-100/60 text-amber-600';
                }

                return (
                  <div key={t.id} className={`p-5 border border-slate-200/80 border-l-[4px] ${colorClass} rounded-xl space-y-4 shadow-3xs hover:shadow-2xs transition-all relative group bg-white`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${iconBg}`}>
                          <Calendar className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="text-[13px] font-extrabold text-slate-800 block group-hover:text-indigo-950 transition-colors">
                            {t.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Accrues Monthly • Auto Reset</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => archiveType(t.id)}
                          className="text-slate-400 hover:text-amber-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Archive Structure"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs font-semibold">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Allowance</span>
                        <span className="text-sm font-extrabold text-slate-900">{t.daysAllowed} Days/Year</span>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Rollover Policy</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${pillColor}`}>
                          {t.rollover}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PANEL 2: General */}
        {activeTab === 'general' && (
          <div className="space-y-5 max-w-2xl">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Leave General Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Apply-in-Advance Cutoff Buffer (Days)</label>
                <input
                  type="number"
                  className="w-full bg-white text-slate-850 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                  value={cutoffDays}
                  onChange={(e) => setCutoffDays(Number(e.target.value))}
                />
                <span className="text-[10px] text-slate-400 font-semibold">Minimum advance days required to submit non-emergency leave requests.</span>
              </div>
            </div>

            <div className="border-t border-slate-150 pt-4 space-y-3.5 text-xs font-semibold">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/40 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-800 font-bold block">Include Paid Holidays in Leave Count</span>
                  <span className="text-[10px] text-slate-400 font-medium font-semibold">Subtract weekends and public holidays from applied leave days range.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeHolidays(!includeHolidays)}
                  className="w-11 h-6 rounded-full transition-colors relative p-0.5 bg-slate-300"
                  style={{ backgroundColor: includeHolidays ? '#4f46e5' : '#cbd5e1' }}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${includeHolidays ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/40 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-800 font-bold block">Multi-Level Approval Pipeline</span>
                  <span className="text-[10px] text-slate-400 font-medium font-semibold">Requires authorization from both the direct Line Manager and the HR director.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMultiApproval(!multiApproval)}
                  className="w-11 h-6 rounded-full transition-colors relative p-0.5 bg-slate-300"
                  style={{ backgroundColor: multiApproval ? '#4f46e5' : '#cbd5e1' }}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${multiApproval ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 3: Archived */}
        {activeTab === 'archived' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Archived Entitlements Registry</h3>
              <p className="text-[11px] text-slate-500 font-semibold">Deactivated legacy leave structures. Restoring adds them back to roster options.</p>
            </div>

            {archivedTypes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
                No archived leave structures found.
              </div>
            ) : (
              <div className="divide-y divide-slate-150 border border-slate-150 rounded-xl overflow-hidden bg-white">
                {archivedTypes.map(t => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50/20 text-xs font-bold text-slate-700">
                    <div>
                      <span className="text-slate-800 font-extrabold">{t.name}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">Allotted: {t.daysAllowed} Days/Yr</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => restoreType(t.id)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        title="Restore Active"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Restore
                      </button>
                      <button
                        onClick={() => deleteTypePermanently(t.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100"
                        title="Delete Permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end border-t border-slate-150 pt-5">
          <button
            type="button"
            onClick={handleSaveAll}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
          >
            <Save className="h-4 w-4" />
            Save Leave Settings
          </button>
        </div>
      </div>

      {/* MODAL: Add Leave Type */}
      {isAddingType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Add Leave Category</span>
              <button onClick={() => setIsAddingType(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddType} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Compassionate Bereavement Leave"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Annual Days Allowed *</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                    value={newDaysAllowed}
                    onChange={(e) => setNewDaysAllowed(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Year-End Rollover Policy</label>
                  <select
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                    value={newRollover}
                    onChange={(e: any) => setNewRollover(e.target.value)}
                  >
                    <option value="accumulative">Accumulative (Carry forward)</option>
                    <option value="encashable">Encashable (Paid out)</option>
                    <option value="none">Expired (Lapse/Forfeit)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setIsAddingType(false)} className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-3xs">Create Leave Type</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
