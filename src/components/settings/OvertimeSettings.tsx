import React, { useState } from 'react';
import { 
  Activity, Plus, Edit2, Trash2, X, Check, Search, ToggleLeft, ToggleRight, DollarSign, UserCheck, ShieldAlert
} from 'lucide-react';

interface OvertimeSettingsProps {
  onNotify: (message: string) => void;
}

interface PayCode {
  id: string;
  code: string;
  multiplier: number;
  description: string;
  status: 'Active' | 'Inactive';
}

interface OvertimePolicy {
  id: string;
  name: string;
  dailyThreshold: number; // in hours
  weeklyThreshold: number; // in hours
  payCodeId: string;
  doubleTimeThreshold: number; // in hours
  doubleTimePayCodeId: string;
}

interface EmployeePolicy {
  id: string;
  employeeName: string;
  designation: string;
  policyId: string; // empty string means "None"
}

interface EmployeeRate {
  id: string;
  employeeName: string;
  baseRate: number;
}

export default function OvertimeSettings({ onNotify }: OvertimeSettingsProps) {
  const [activeTab, setActiveTab] = useState<'pay_code' | 'policy' | 'employee_policy' | 'hourly_rate'>('pay_code');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Pay Code States
  const [payCodes, setPayCodes] = useState<PayCode[]>([
    { id: '1', code: 'OT150', multiplier: 1.5, description: 'Regular Overtime (150% Rate)', status: 'Active' },
    { id: '2', code: 'OT200', multiplier: 2.0, description: 'Holiday & Sunday Overtime (200% Rate)', status: 'Active' },
    { id: '3', code: 'OT120', multiplier: 1.2, description: 'Minor Shift Extension Multiplier', status: 'Active' },
  ]);
  const [showPayCodeModal, setShowPayCodeModal] = useState(false);
  const [editingPayCode, setEditingPayCode] = useState<PayCode | null>(null);
  const [payCodeForm, setPayCodeForm] = useState({
    code: '',
    multiplier: 1.5,
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });
  const [payCodeError, setPayCodeError] = useState('');

  // 2. Overtime Policy States
  const [policies, setPolicies] = useState<OvertimePolicy[]>([
    { id: '1', name: 'Standard 8-40 Policy', dailyThreshold: 8, weeklyThreshold: 40, payCodeId: '1', doubleTimeThreshold: 12, doubleTimePayCodeId: '2' },
    { id: '2', name: 'Weekend Special Policy', dailyThreshold: 0, weeklyThreshold: 0, payCodeId: '2', doubleTimeThreshold: 8, doubleTimePayCodeId: '2' },
    { id: '3', name: 'Part-time Custom Policy', dailyThreshold: 6, weeklyThreshold: 30, payCodeId: '3', doubleTimeThreshold: 10, doubleTimePayCodeId: '1' }
  ]);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<OvertimePolicy | null>(null);
  const [policyForm, setPolicyForm] = useState({
    name: '',
    dailyThreshold: 8,
    weeklyThreshold: 40,
    payCodeId: '1',
    doubleTimeThreshold: 12,
    doubleTimePayCodeId: '2'
  });
  const [policyError, setPolicyError] = useState('');

  // 3. Employee Policy Assignment States
  const [employeePolicies, setEmployeePolicies] = useState<EmployeePolicy[]>([
    { id: '1', employeeName: 'Aria Montgomery', designation: 'Product Manager', policyId: '1' },
    { id: '2', employeeName: 'Augustus Sterling', designation: 'Director of Operations', policyId: '1' },
    { id: '3', employeeName: 'Hanna Marin', designation: 'Backend Engineer', policyId: '1' },
    { id: '4', employeeName: 'Spencer Hastings', designation: 'UI/UX Designer', policyId: '2' },
    { id: '5', employeeName: 'Emily Fields', designation: 'Support Representative', policyId: '' }
  ]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmpPolicy, setSelectedEmpPolicy] = useState<EmployeePolicy | null>(null);
  const [assignedPolicyId, setAssignedPolicyId] = useState('');

  // 4. Employee Hourly Rate States
  const [employeeRates, setEmployeeRates] = useState<EmployeeRate[]>([
    { id: '1', employeeName: 'Aria Montgomery', baseRate: 45 },
    { id: '2', employeeName: 'Augustus Sterling', baseRate: 65 },
    { id: '3', employeeName: 'Hanna Marin', baseRate: 40 },
    { id: '4', employeeName: 'Spencer Hastings', baseRate: 38 },
    { id: '5', employeeName: 'Emily Fields', baseRate: 22 }
  ]);
  const [showRateModal, setShowRateModal] = useState(false);
  const [editingRate, setEditingRate] = useState<EmployeeRate | null>(null);
  const [rateForm, setRateForm] = useState({
    baseRate: 0
  });

  // --- HANDLERS: PAY CODE ---
  const handleOpenPayCodeModal = (code: PayCode | null = null) => {
    if (code) {
      setEditingPayCode(code);
      setPayCodeForm({
        code: code.code,
        multiplier: code.multiplier,
        description: code.description,
        status: code.status
      });
    } else {
      setEditingPayCode(null);
      setPayCodeForm({
        code: '',
        multiplier: 1.5,
        description: '',
        status: 'Active'
      });
    }
    setPayCodeError('');
    setShowPayCodeModal(true);
  };

  const handleSavePayCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payCodeForm.code.trim()) {
      setPayCodeError('Pay Code name is required');
      return;
    }
    if (payCodeForm.multiplier <= 0 || isNaN(payCodeForm.multiplier)) {
      setPayCodeError('Multiplier must be a valid positive number');
      return;
    }

    if (editingPayCode) {
      setPayCodes(prev => prev.map(c => c.id === editingPayCode.id ? { ...c, ...payCodeForm } : c));
      onNotify(`Pay Code "${payCodeForm.code}" updated successfully.`);
    } else {
      const newCode: PayCode = {
        id: Date.now().toString(),
        ...payCodeForm
      };
      setPayCodes(prev => [...prev, newCode]);
      onNotify(`Pay Code "${payCodeForm.code}" created successfully.`);
    }
    setShowPayCodeModal(false);
  };

  const handleDeletePayCode = (id: string, codeName: string) => {
    if (confirm(`Are you sure you want to delete pay code "${codeName}"?`)) {
      setPayCodes(prev => prev.filter(c => c.id !== id));
      onNotify(`Pay Code "${codeName}" deleted successfully.`);
    }
  };

  const handleTogglePayCodeStatus = (id: string) => {
    setPayCodes(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Inactive' : 'Active';
        onNotify(`Status for "${c.code}" updated to ${nextStatus}.`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // --- HANDLERS: OVERTIME POLICY ---
  const handleOpenPolicyModal = (policy: OvertimePolicy | null = null) => {
    if (policy) {
      setEditingPolicy(policy);
      setPolicyForm({
        name: policy.name,
        dailyThreshold: policy.dailyThreshold,
        weeklyThreshold: policy.weeklyThreshold,
        payCodeId: policy.payCodeId,
        doubleTimeThreshold: policy.doubleTimeThreshold,
        doubleTimePayCodeId: policy.doubleTimePayCodeId
      });
    } else {
      setEditingPolicy(null);
      setPolicyForm({
        name: '',
        dailyThreshold: 8,
        weeklyThreshold: 40,
        payCodeId: payCodes[0]?.id || '',
        doubleTimeThreshold: 12,
        doubleTimePayCodeId: payCodes[1]?.id || ''
      });
    }
    setPolicyError('');
    setShowPolicyModal(true);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyForm.name.trim()) {
      setPolicyError('Policy Name is required');
      return;
    }

    if (editingPolicy) {
      setPolicies(prev => prev.map(p => p.id === editingPolicy.id ? { ...p, ...policyForm } : p));
      onNotify(`Overtime Policy "${policyForm.name}" updated.`);
    } else {
      const newPolicy: OvertimePolicy = {
        id: Date.now().toString(),
        ...policyForm
      };
      setPolicies(prev => [...prev, newPolicy]);
      onNotify(`Overtime Policy "${policyForm.name}" created successfully.`);
    }
    setShowPolicyModal(false);
  };

  const handleDeletePolicy = (id: string, policyName: string) => {
    if (confirm(`Are you sure you want to delete policy "${policyName}"?`)) {
      setPolicies(prev => prev.filter(p => p.id !== id));
      onNotify(`Policy "${policyName}" removed.`);
    }
  };

  // --- HANDLERS: ASSIGN EMPLOYEE POLICY ---
  const handleOpenAssignModal = (empPolicy: EmployeePolicy) => {
    setSelectedEmpPolicy(empPolicy);
    setAssignedPolicyId(empPolicy.policyId);
    setShowAssignModal(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpPolicy) return;

    setEmployeePolicies(prev => prev.map(ep => ep.id === selectedEmpPolicy.id ? { ...ep, policyId: assignedPolicyId } : ep));
    const policyObj = policies.find(p => p.id === assignedPolicyId);
    onNotify(`Assigned policy for ${selectedEmpPolicy.employeeName} to: ${policyObj ? policyObj.name : 'None'}`);
    setShowAssignModal(false);
  };

  // --- HANDLERS: HOURLY RATES ---
  const handleOpenRateModal = (rate: EmployeeRate) => {
    setEditingRate(rate);
    setRateForm({ baseRate: rate.baseRate });
    setShowRateModal(true);
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRate) return;
    if (rateForm.baseRate <= 0 || isNaN(rateForm.baseRate)) {
      return;
    }

    setEmployeeRates(prev => prev.map(r => r.id === editingRate.id ? { ...r, baseRate: rateForm.baseRate } : r));
    onNotify(`Hourly rate updated for ${editingRate.employeeName}`);
    setShowRateModal(false);
  };

  // Filters
  const filteredEmployeePolicies = employeePolicies.filter(ep => 
    ep.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRates = employeeRates.filter(er => 
    er.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="overtime-settings-view">
      
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Overtime Settings</span>
          </h2>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            <span>Settings</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">HR</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-400 font-medium">Overtime Settings</span>
          </div>
        </div>

        {/* Dynamic Button Based on Tab */}
        <div>
          {activeTab === 'pay_code' && (
            <button 
              onClick={() => handleOpenPayCodeModal()}
              className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors shrink-0"
            >
              <span className="font-extrabold text-sm leading-none">+</span>
              <span>Add Overtime Pay Code</span>
            </button>
          )}
          {activeTab === 'policy' && (
            <button 
              onClick={() => handleOpenPolicyModal()}
              className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors shrink-0"
            >
              <span className="font-extrabold text-sm leading-none">+</span>
              <span>Add Overtime Policy</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex flex-wrap border-b border-slate-200">
        {[
          { key: 'pay_code', label: 'Pay Code' },
          { key: 'policy', label: 'Overtime Policy' },
          { key: 'employee_policy', label: 'Overtime Policy Employee' },
          { key: 'hourly_rate', label: 'Employee Hourly Rate' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              setSearchQuery('');
            }}
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
        
        {/* TAB 1: PAY CODES */}
        {activeTab === 'pay_code' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-5 py-3.5 w-16">#</th>
                  <th className="px-5 py-3.5">Pay Code</th>
                  <th className="px-5 py-3.5">Multiplier</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right w-44">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payCodes.map((code, index) => (
                  <tr key={code.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-semibold">{index + 1}</td>
                    <td className="px-5 py-4 text-slate-800 font-bold">{code.code}</td>
                    <td className="px-5 py-4 text-indigo-600 font-extrabold">{code.multiplier.toFixed(2)}x</td>
                    <td className="px-5 py-4 text-slate-600 font-semibold">{code.description}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleTogglePayCodeStatus(code.id)}
                        className="cursor-pointer transition-transform duration-200 active:scale-95"
                      >
                        {code.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenPayCodeModal(code)}
                          className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeletePayCode(code.id, code.code)}
                          className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: OVERTIME POLICY */}
        {activeTab === 'policy' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-5 py-3.5 w-16">#</th>
                  <th className="px-5 py-3.5">Policy Name</th>
                  <th className="px-5 py-3.5">Daily Limit</th>
                  <th className="px-5 py-3.5">Weekly Limit</th>
                  <th className="px-5 py-3.5">OT Pay Code</th>
                  <th className="px-5 py-3.5">Double Time Limit</th>
                  <th className="px-5 py-3.5">Double Time Code</th>
                  <th className="px-5 py-3.5 text-right w-44">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {policies.map((p, index) => {
                  const payCodeObj = payCodes.find(pc => pc.id === p.payCodeId);
                  const dtPayCodeObj = payCodes.find(pc => pc.id === p.doubleTimePayCodeId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-5 py-4 text-slate-400 font-semibold">{index + 1}</td>
                      <td className="px-5 py-4 text-slate-800 font-bold">{p.name}</td>
                      <td className="px-5 py-4 text-slate-600 font-semibold">{p.dailyThreshold > 0 ? `${p.dailyThreshold} hrs` : 'None'}</td>
                      <td className="px-5 py-4 text-slate-600 font-semibold">{p.weeklyThreshold > 0 ? `${p.weeklyThreshold} hrs` : 'None'}</td>
                      <td className="px-5 py-4 text-indigo-600 font-extrabold">{payCodeObj ? payCodeObj.code : 'None'}</td>
                      <td className="px-5 py-4 text-slate-600 font-semibold">{p.doubleTimeThreshold > 0 ? `${p.doubleTimeThreshold} hrs` : 'None'}</td>
                      <td className="px-5 py-4 text-rose-600 font-extrabold">{dtPayCodeObj ? dtPayCodeObj.code : 'None'}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenPolicyModal(p)}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeletePolicy(p.id, p.name)}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: OVERTIME POLICY EMPLOYEE */}
        {activeTab === 'employee_policy' && (
          <div className="space-y-4">
            {/* Search filter bar */}
            <div className="relative max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input 
                type="text" 
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md bg-slate-50/50 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="px-5 py-3.5 w-16">#</th>
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Designation</th>
                    <th className="px-5 py-3.5">Assigned Policy</th>
                    <th className="px-5 py-3.5 text-right w-44">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployeePolicies.map((ep, index) => {
                    const assignedPolicyObj = policies.find(p => p.id === ep.policyId);
                    return (
                      <tr key={ep.id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="px-5 py-4 text-slate-400 font-semibold">{index + 1}</td>
                        <td className="px-5 py-4 text-slate-800 font-bold">{ep.employeeName}</td>
                        <td className="px-5 py-4 text-slate-500 font-semibold">{ep.designation}</td>
                        <td className="px-5 py-4">
                          {assignedPolicyObj ? (
                            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                              {assignedPolicyObj.name}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                              No Policy Assigned
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleOpenAssignModal(ep)}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <UserCheck className="h-3.5 w-3.5 text-slate-400 stroke-[2.5]" />
                            <span>Assign Policy</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEmployeePolicies.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-14 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                          <Search className="h-8 w-8 text-slate-200 stroke-[1.5]" />
                          <span className="text-xs font-semibold">- No employees found matching "{searchQuery}" -</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: EMPLOYEE HOURLY RATE */}
        {activeTab === 'hourly_rate' && (
          <div className="space-y-4">
            {/* Search filter bar */}
            <div className="relative max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input 
                type="text" 
                placeholder="Search employee rate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md bg-slate-50/50 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="px-5 py-3.5 w-16">#</th>
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Base Hourly Rate</th>
                    <th className="px-5 py-3.5">OT150 Overtime Rate</th>
                    <th className="px-5 py-3.5">OT200 Holiday Rate</th>
                    <th className="px-5 py-3.5 text-right w-44">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRates.map((rate, index) => {
                    const ot150Rate = rate.baseRate * 1.5;
                    const ot200Rate = rate.baseRate * 2.0;
                    return (
                      <tr key={rate.id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="px-5 py-4 text-slate-400 font-semibold">{index + 1}</td>
                        <td className="px-5 py-4 text-slate-800 font-bold">{rate.employeeName}</td>
                        <td className="px-5 py-4 text-slate-700 font-bold font-mono">${rate.baseRate.toFixed(2)}/hr</td>
                        <td className="px-5 py-4 text-indigo-600 font-bold font-mono">${ot150Rate.toFixed(2)}/hr</td>
                        <td className="px-5 py-4 text-rose-600 font-bold font-mono">${ot200Rate.toFixed(2)}/hr</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleOpenRateModal(rate)}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <DollarSign className="h-3.5 w-3.5 text-slate-400 stroke-[2.5]" />
                            <span>Edit Rate</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRates.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-14 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                          <Search className="h-8 w-8 text-slate-200 stroke-[1.5]" />
                          <span className="text-xs font-semibold">- No employees found matching "{searchQuery}" -</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: PAY CODE MODAL (ADD / EDIT) */}
      {showPayCodeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="paycode-modal">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800">
                {editingPayCode ? 'Edit Overtime Pay Code' : 'Add Overtime Pay Code'}
              </h3>
              <button 
                onClick={() => setShowPayCodeModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSavePayCode} className="p-5 space-y-4 text-xs font-semibold">
              {payCodeError && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-700 rounded-md flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{payCodeError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Pay Code Name *</label>
                <input 
                  type="text" 
                  value={payCodeForm.code}
                  onChange={(e) => setPayCodeForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g. OT150"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Pay Multiplier *</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={payCodeForm.multiplier}
                  onChange={(e) => setPayCodeForm(prev => ({ ...prev, multiplier: parseFloat(e.target.value) || 0 }))}
                  placeholder="e.g. 1.50"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Description</label>
                <textarea 
                  value={payCodeForm.description}
                  onChange={(e) => setPayCodeForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe when this pay rate applies..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Status</label>
                <select
                  value={payCodeForm.status}
                  onChange={(e) => setPayCodeForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowPayCodeModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1d82f5] hover:bg-blue-600 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: OVERTIME POLICY MODAL */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="policy-modal">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800">
                {editingPolicy ? 'Edit Overtime Policy' : 'Add Overtime Policy'}
              </h3>
              <button 
                onClick={() => setShowPolicyModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSavePolicy} className="p-5 space-y-4 text-xs font-semibold">
              {policyError && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-700 rounded-md flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{policyError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Policy Name *</label>
                <input 
                  type="text" 
                  value={policyForm.name}
                  onChange={(e) => setPolicyForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Standard 8-40 Policy"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-600 block">Daily OT Threshold (Hours)</label>
                  <input 
                    type="number" 
                    value={policyForm.dailyThreshold}
                    onChange={(e) => setPolicyForm(prev => ({ ...prev, dailyThreshold: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                  />
                  <p className="text-[10px] text-slate-400">Hours worked before OT starts daily</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 block">Weekly OT Threshold (Hours)</label>
                  <input 
                    type="number" 
                    value={policyForm.weeklyThreshold}
                    onChange={(e) => setPolicyForm(prev => ({ ...prev, weeklyThreshold: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                  />
                  <p className="text-[10px] text-slate-400">Hours worked before OT starts weekly</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Primary OT Pay Code</label>
                <select
                  value={policyForm.payCodeId}
                  onChange={(e) => setPolicyForm(prev => ({ ...prev, payCodeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700 bg-white"
                >
                  {payCodes.map(code => (
                    <option key={code.id} value={code.id}>{code.code} ({code.multiplier}x Multiplier)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-slate-600 block">Double Time Threshold (Hours)</label>
                  <input 
                    type="number" 
                    value={policyForm.doubleTimeThreshold}
                    onChange={(e) => setPolicyForm(prev => ({ ...prev, doubleTimeThreshold: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                  />
                  <p className="text-[10px] text-slate-400">Hours worked before Double Time starts daily</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 block">Double Time Pay Code</label>
                  <select
                    value={policyForm.doubleTimePayCodeId}
                    onChange={(e) => setPolicyForm(prev => ({ ...prev, doubleTimePayCodeId: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700 bg-white"
                  >
                    {payCodes.map(code => (
                      <option key={code.id} value={code.id}>{code.code} ({code.multiplier}x Multiplier)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowPolicyModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1d82f5] hover:bg-blue-600 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN EMPLOYEE POLICY */}
      {showAssignModal && selectedEmpPolicy && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="assign-modal">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800">
                Assign Overtime Policy
              </h3>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAssignment} className="p-5 space-y-4 text-xs font-semibold">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-md space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Employee</span>
                <p className="text-sm text-slate-800 font-extrabold">{selectedEmpPolicy.employeeName}</p>
                <p className="text-slate-500 font-bold text-[11px]">{selectedEmpPolicy.designation}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Select Overtime Policy</label>
                <select
                  value={assignedPolicyId}
                  onChange={(e) => setAssignedPolicyId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700 bg-white"
                >
                  <option value="">None (No Overtime Multipliers)</option>
                  {policies.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1d82f5] hover:bg-blue-600 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Assign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT EMPLOYEE HOURLY RATE */}
      {showRateModal && editingRate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="rate-modal">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800">
                Edit Employee Base Rate
              </h3>
              <button 
                onClick={() => setShowRateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveRate} className="p-5 space-y-4 text-xs font-semibold">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-md space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Employee</span>
                <p className="text-sm text-slate-800 font-extrabold">{editingRate.employeeName}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Base Hourly Rate ($/hr) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={rateForm.baseRate}
                    onChange={(e) => setRateForm({ baseRate: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-md space-y-2">
                <span className="text-indigo-600 text-[10px] uppercase font-extrabold block">Calculated Overtime Previews</span>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-bold">Regular OT (OT150 - 1.5x):</span>
                  <span className="text-indigo-700 font-extrabold font-mono">${(rateForm.baseRate * 1.5).toFixed(2)}/hr</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-bold">Holiday OT (OT200 - 2.0x):</span>
                  <span className="text-rose-700 font-extrabold font-mono">${(rateForm.baseRate * 2.0).toFixed(2)}/hr</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowRateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1d82f5] hover:bg-blue-600 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Rates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
