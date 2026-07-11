import React, { useState } from 'react';
import { 
  Calculator, Plus, Edit2, Trash2, X, Check, HelpCircle, ToggleLeft, ToggleRight, Settings, Info, List
} from 'lucide-react';

interface PayrollSettingsProps {
  onNotify: (message: string) => void;
}

// Interfaces
interface SalaryComponent {
  id: string;
  name: string;
  type: 'Earnings' | 'Deduction';
  value: string;
  valueType: 'Fixed' | 'Percentage';
  weeklyValue?: string;
  biWeeklyValue?: string;
  semiMonthlyValue?: string;
}

interface SalaryGroup {
  id: string;
  name: string;
  components: string[];
}

interface SalaryTDS {
  id: string;
  from: string;
  to: string;
  percent: string;
}

interface PaymentMethod {
  id: string;
  name: string;
}

export default function PayrollSettings({ onNotify }: PayrollSettingsProps) {
  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<'components' | 'groups' | 'tds' | 'methods' | 'slip' | 'currency'>('components');

  // --- STATE FOR SALARY COMPONENTS ---
  const [components, setComponents] = useState<SalaryComponent[]>([]);
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [compName, setCompName] = useState('');
  const [compType, setCompType] = useState<'Earnings' | 'Deduction'>('Earnings');
  const [valueType, setValueType] = useState<'Fixed' | 'Percentage'>('Fixed');
  const [compValue, setCompValue] = useState('');
  const [compWeekly, setCompWeekly] = useState('0');
  const [compBiWeekly, setCompBiWeekly] = useState('0');
  const [compSemiMonthly, setCompSemiMonthly] = useState('0');
  const [compError, setCompError] = useState('');

  // --- STATE FOR SALARY GROUPS ---
  const [groups, setGroups] = useState<SalaryGroup[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupSelectedComps, setGroupSelectedComps] = useState<string[]>([]);
  const [groupError, setGroupError] = useState('');

  // --- STATE FOR SALARY TDS ---
  const [tdsList, setTdsList] = useState<SalaryTDS[]>([]);
  const [showTdsModal, setShowTdsModal] = useState(false);
  const [tdsFrom, setTdsFrom] = useState('');
  const [tdsTo, setTdsTo] = useState('');
  const [tdsPercent, setTdsPercent] = useState('');
  const [tdsError, setTdsError] = useState('');

  // TDS Status State & Modal
  const [showTdsStatusModal, setShowTdsStatusModal] = useState(false);
  const [tdsMoreThan, setTdsMoreThan] = useState('50000');
  const [tdsStartMonth, setTdsStartMonth] = useState('April');
  const [tdsStatusEnabled, setTdsStatusEnabled] = useState(true);

  // --- STATE FOR SALARY PAYMENT METHOD ---
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', name: 'Bank Transfer' },
    { id: '2', name: 'Cash' },
    { id: '3', name: 'Cheque' },
    { id: '4', name: 'PayPal' }
  ]);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [methodName, setMethodName] = useState('');
  const [methodError, setMethodError] = useState('');
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null);

  // --- STATE FOR PAYROLL CURRENCY ---
  const [payrollCurrency, setPayrollCurrency] = useState('$ (USD)');

  // ------------------------------------
  // --- SUBMIT HANDLERS & OPERATIONS ---
  // ------------------------------------

  // 1. Component Actions
  const handleSaveComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) {
      setCompError('Salary Component Name is required');
      return;
    }
    if (!compValue.trim() || isNaN(Number(compValue))) {
      setCompError('Valid monthly component value is required');
      return;
    }

    const newComp: SalaryComponent = {
      id: Date.now().toString(),
      name: compName.trim(),
      type: compType,
      value: compValue.trim(),
      valueType: valueType,
      weeklyValue: compWeekly,
      biWeeklyValue: compBiWeekly,
      semiMonthlyValue: compSemiMonthly
    };

    setComponents(prev => [...prev, newComp]);
    setShowComponentModal(false);
    onNotify(`Salary Component "${newComp.name}" added successfully.`);
    
    // Reset Form
    setCompName('');
    setCompValue('');
    setCompWeekly('0');
    setCompBiWeekly('0');
    setCompSemiMonthly('0');
    setCompError('');
  };

  const handleDeleteComponent = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete component "${name}"?`)) {
      setComponents(prev => prev.filter(c => c.id !== id));
      onNotify(`Salary Component "${name}" deleted.`);
    }
  };

  // 2. Group Actions
  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setGroupError('Group name is required');
      return;
    }
    if (groupSelectedComps.length === 0) {
      setGroupError('Please assign at least one salary component');
      return;
    }

    const newGroup: SalaryGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      components: groupSelectedComps
    };

    setGroups(prev => [...prev, newGroup]);
    setShowGroupModal(false);
    onNotify(`Salary Group "${newGroup.name}" created successfully.`);
    
    // Reset Form
    setGroupName('');
    setGroupSelectedComps([]);
    setGroupError('');
  };

  const handleToggleGroupComp = (compName: string) => {
    setGroupSelectedComps(prev => 
      prev.includes(compName) 
        ? prev.filter(c => c !== compName) 
        : [...prev, compName]
    );
  };

  const handleDeleteGroup = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete group "${name}"?`)) {
      setGroups(prev => prev.filter(g => g.id !== id));
      onNotify(`Salary Group "${name}" deleted.`);
    }
  };

  // 3. TDS Actions
  const handleSaveTds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tdsFrom.trim() || isNaN(Number(tdsFrom))) {
      setTdsError('Annual Salary From value must be a valid number');
      return;
    }
    if (!tdsTo.trim() || isNaN(Number(tdsTo))) {
      setTdsError('Annual Salary Upto value must be a valid number');
      return;
    }
    if (!tdsPercent.trim() || isNaN(Number(tdsPercent))) {
      setTdsError('Salary Percent must be a valid number');
      return;
    }

    const newTds: SalaryTDS = {
      id: Date.now().toString(),
      from: tdsFrom.trim(),
      to: tdsTo.trim(),
      percent: tdsPercent.trim()
    };

    setTdsList(prev => [...prev, newTds]);
    setShowTdsModal(false);
    onNotify('Salary TDS record created.');

    // Reset Form
    setTdsFrom('');
    setTdsTo('');
    setTdsPercent('');
    setTdsError('');
  };

  const handleSaveTdsStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTdsStatusModal(false);
    onNotify('Salary TDS Status configuration updated.');
  };

  const handleDeleteTds = (id: string) => {
    if (confirm('Are you sure you want to delete this Salary TDS record?')) {
      setTdsList(prev => prev.filter(t => t.id !== id));
      onNotify('Salary TDS record deleted.');
    }
  };

  // 4. Payment Method Actions
  const handleSaveMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!methodName.trim()) {
      setMethodError('Salary Payment Method name is required');
      return;
    }

    if (editingMethodId) {
      setPaymentMethods(prev => prev.map(m => m.id === editingMethodId ? { ...m, name: methodName.trim() } : m));
      onNotify(`Payment method updated to "${methodName.trim()}"`);
    } else {
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        name: methodName.trim()
      };
      setPaymentMethods(prev => [...prev, newMethod]);
      onNotify(`Payment method "${newMethod.name}" added.`);
    }

    setShowMethodModal(false);
    setMethodName('');
    setEditingMethodId(null);
    setMethodError('');
  };

  const handleEditMethodClick = (method: PaymentMethod) => {
    setEditingMethodId(method.id);
    setMethodName(method.name);
    setMethodError('');
    setShowMethodModal(true);
  };

  const handleDeleteMethod = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete payment method "${name}"?`)) {
      setPaymentMethods(prev => prev.filter(m => m.id !== id));
      onNotify(`Payment method "${name}" deleted.`);
    }
  };

  // 5. Save Currency
  const handleSaveCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify(`Payroll currency locked to ${payrollCurrency}`);
  };


  return (
    <div className="space-y-6" id="payroll-settings-view">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Payroll Settings</span>
          </h2>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            <span>Payroll Settings</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">Home</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-400 font-medium">Payroll Settings</span>
          </div>
        </div>

        {/* Action Buttons based on active tab */}
        <div className="shrink-0 flex items-center gap-2.5">
          {activeTab === 'components' && (
            <button 
              onClick={() => {
                setCompError('');
                setShowComponentModal(true);
              }}
              className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
            >
              <span className="font-extrabold text-sm leading-none">+</span>
              <span>Add New Salary Components</span>
            </button>
          )}

          {activeTab === 'groups' && (
            <button 
              onClick={() => {
                setGroupError('');
                setShowGroupModal(true);
              }}
              className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
            >
              <span className="font-extrabold text-sm leading-none">+</span>
              <span>Add New Salary Groups</span>
            </button>
          )}

          {activeTab === 'tds' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setTdsError('');
                  setShowTdsModal(true);
                }}
                className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <span className="font-extrabold text-sm leading-none">+</span>
                <span>Add New Salary TDS</span>
              </button>
              
              <button 
                onClick={() => setShowTdsStatusModal(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Settings className="h-3.5 w-3.5 text-slate-500" />
                <span>Salary TDS Status</span>
              </button>
            </div>
          )}

          {activeTab === 'methods' && (
            <button 
              onClick={() => {
                setEditingMethodId(null);
                setMethodName('');
                setMethodError('');
                setShowMethodModal(true);
              }}
              className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
            >
              <span className="font-extrabold text-sm leading-none">+</span>
              <span>Add New Salary Payment Method</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex flex-wrap border-b border-slate-200">
        {[
          { key: 'components', label: 'Salary Components' },
          { key: 'groups', label: 'Salary Groups' },
          { key: 'tds', label: 'Salary TDS' },
          { key: 'methods', label: 'Salary Payment Method' },
          { key: 'slip', label: 'Salary Slip Data' },
          { key: 'currency', label: 'Payroll Currency Setting' }
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
        
        {/* TAB 1: SALARY COMPONENTS */}
        {activeTab === 'components' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-5 py-3.5">Component Name</th>
                  <th className="px-5 py-3.5">Component Type</th>
                  <th className="px-5 py-3.5">Component Value</th>
                  <th className="px-5 py-3.5">Value Type</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {components.length > 0 ? (
                  components.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-5 py-4 text-slate-800 font-bold">{comp.name}</td>
                      <td className="px-5 py-4 text-slate-600 font-semibold">{comp.type}</td>
                      <td className="px-5 py-4 text-slate-600 font-semibold">{comp.value}</td>
                      <td className="px-5 py-4 text-slate-600 font-semibold">{comp.valueType}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDeleteComponent(comp.id, comp.name)}
                          className="text-red-500 hover:text-red-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <List className="h-8 w-8 text-slate-200 stroke-[1.5]" />
                        <span className="text-xs font-semibold">- No salary components added. -</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: SALARY GROUPS */}
        {activeTab === 'groups' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Salary Components</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <tr key={group.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-5 py-4 text-slate-800 font-bold">{group.name}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {group.components.map((comp, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDeleteGroup(group.id, group.name)}
                          className="text-red-500 hover:text-red-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <List className="h-8 w-8 text-slate-200 stroke-[1.5]" />
                        <span className="text-xs font-semibold">- No salary group added. -</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: SALARY TDS */}
        {activeTab === 'tds' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-lg flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-blue-800">
                <Info className="h-4 w-4" />
                <span>Annual Threshold Trigger Limit:</span>
              </div>
              <span className="text-blue-900 font-extrabold font-mono">${Number(tdsMoreThan).toLocaleString()} USD (April Start)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="px-5 py-3.5">Annual Salary From</th>
                    <th className="px-5 py-3.5">Annual Salary Upto</th>
                    <th className="px-5 py-3.5">Salary Percent</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tdsList.length > 0 ? (
                    tdsList.map((tds) => (
                      <tr key={tds.id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-slate-800">${Number(tds.from).toLocaleString()}</td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-800">${Number(tds.to).toLocaleString()}</td>
                        <td className="px-5 py-4 text-slate-600 font-bold">{tds.percent}%</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDeleteTds(tds.id)}
                            className="text-red-500 hover:text-red-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-14 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                          <List className="h-8 w-8 text-slate-200 stroke-[1.5]" />
                          <span className="text-xs font-semibold">- No salary tds added. -</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SALARY PAYMENT METHOD */}
        {activeTab === 'methods' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5 text-right w-44">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentMethods.length > 0 ? (
                  paymentMethods.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-5 py-3.5 text-slate-800 font-bold">{m.name}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditMethodClick(m)}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-4xs"
                          >
                            <Edit2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteMethod(m.id, m.name)}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-4xs"
                          >
                            <Trash2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-12 text-center text-slate-400 font-medium italic">
                      No payment methods added.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: SALARY SLIP DATA */}
        {activeTab === 'slip' && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold border-b border-slate-100 pb-3">
              <span>Employee custom field To show In Payslip</span>
              <HelpCircle className="h-4 w-4 text-slate-400 cursor-help hover:text-slate-500" />
            </div>

            <div className="py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                <List className="h-8 w-8 text-slate-200 stroke-[1.5]" />
                <span className="text-xs font-semibold text-slate-400">- No Record -</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PAYROLL CURRENCY SETTING */}
        {activeTab === 'currency' && (
          <form onSubmit={handleSaveCurrency} className="space-y-5 py-2 max-w-lg">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 block">
                Choose Payroll Currency <span className="text-red-500">*</span>
              </label>
              <select
                value={payrollCurrency}
                onChange={(e) => setPayrollCurrency(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
              >
                <option value="$ (USD)">$ (USD)</option>
                <option value="€ (EUR)">€ (EUR)</option>
                <option value="£ (GBP)">£ (GBP)</option>
                <option value="¥ (JPY)">¥ (JPY)</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Save</span>
            </button>
          </form>
        )}

      </div>

      {/* ---------------------------- */}
      {/* --- ADD/EDIT MODAL FORMS --- */}
      {/* ---------------------------- */}

      {/* A. Add Salary Component Modal */}
      {showComponentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSaveComponent} className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Add Salary Components</h3>
              <button 
                type="button"
                onClick={() => setShowComponentModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-left">
              {compError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-[11px] font-bold border border-red-100">
                  {compError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Salary Component Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Salary Components <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Basic Pay, HRA"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>

                {/* Component Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Component Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={compType}
                    onChange={(e) => setCompType(e.target.value as any)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  >
                    <option value="Earnings">Earnings</option>
                    <option value="Deduction">Deduction</option>
                  </select>
                </div>

                {/* Value Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Value Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={valueType}
                    onChange={(e) => setValueType(e.target.value as any)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>

                {/* Monthly Value */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Component Value(Monthly) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="0"
                    value={compValue}
                    onChange={(e) => setCompValue(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>

                {/* Weekly Value */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Component Value(Weekly)
                  </label>
                  <input 
                    type="text"
                    placeholder="0"
                    value={compWeekly}
                    onChange={(e) => setCompWeekly(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>

                {/* Bi-Weekly Value */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Component Value(Bi-Weekly)
                  </label>
                  <input 
                    type="text"
                    placeholder="0"
                    value={compBiWeekly}
                    onChange={(e) => setCompBiWeekly(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>

                {/* Semi-Monthly Value */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Component Value(Semi-monthly)
                  </label>
                  <input 
                    type="text"
                    placeholder="0"
                    value={compSemiMonthly}
                    onChange={(e) => setCompSemiMonthly(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex items-center justify-end gap-3.5">
              <button 
                type="button"
                onClick={() => setShowComponentModal(false)}
                className="text-slate-500 hover:text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
              <button 
                type="submit"
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* B. Add Salary Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSaveGroup} className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Add Salary Group</h3>
              <button 
                type="button"
                onClick={() => setShowGroupModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-left">
              {groupError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-[11px] font-bold border border-red-100">
                  {groupError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Executive Team, Engineering Level 2"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 block">
                  Assign Salary Components <span className="text-red-500">*</span>
                </label>
                
                {/* Multi Select Toggle Area */}
                <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto p-2 bg-slate-50 space-y-1.5">
                  {components.length > 0 ? (
                    components.map((c) => (
                      <label key={c.id} className="flex items-center gap-2.5 p-1.5 hover:bg-white rounded cursor-pointer transition-colors select-none">
                        <input 
                          type="checkbox"
                          checked={groupSelectedComps.includes(c.name)}
                          onChange={() => handleToggleGroupComp(c.name)}
                          className="h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-semibold text-slate-700">{c.name} ({c.type})</span>
                      </label>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 italic text-[11px] font-medium">
                      No components available. Please add components first.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex items-center justify-end gap-3.5">
              <button 
                type="button"
                onClick={() => setShowGroupModal(false)}
                className="text-slate-500 hover:text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
              <button 
                type="submit"
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* C. Add Salary TDS Modal */}
      {showTdsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSaveTds} className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Add Salary TDS</h3>
              <button 
                type="button"
                onClick={() => setShowTdsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-left">
              {tdsError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-[11px] font-bold border border-red-100">
                  {tdsError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Annual Salary From <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. 10000"
                    value={tdsFrom}
                    onChange={(e) => setTdsFrom(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Annual Salary Upto <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. 50000"
                    value={tdsTo}
                    onChange={(e) => setTdsTo(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">
                  Salary Percent <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 10"
                  value={tdsPercent}
                  onChange={(e) => setTdsPercent(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex items-center justify-end gap-3.5">
              <button 
                type="button"
                onClick={() => setShowTdsModal(false)}
                className="text-slate-500 hover:text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
              <button 
                type="submit"
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* D. Salary TDS Status Modal */}
      {showTdsStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSaveTdsStatus} className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Edit Salary TDS</h3>
              <button 
                type="button"
                onClick={() => setShowTdsStatusModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                
                {/* Apply limit */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Apply If Annual Salary is More Than ($ USD) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={tdsMoreThan}
                    onChange={(e) => setTdsMoreThan(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>

                {/* Financial Year Start Month */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Financial Year Start Month ($ USD) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={tdsStartMonth}
                    onChange={(e) => setTdsStartMonth(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                  >
                    <option value="April">April</option>
                    <option value="January">January</option>
                    <option value="July">July</option>
                    <option value="October">October</option>
                  </select>
                </div>

                {/* Status Switch */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Status
                  </label>
                  <div className="flex items-center h-10">
                    <button
                      type="button"
                      onClick={() => setTdsStatusEnabled(!tdsStatusEnabled)}
                      className="cursor-pointer focus:outline-none"
                    >
                      {tdsStatusEnabled ? (
                        <ToggleRight className="h-9 w-9 text-blue-500" />
                      ) : (
                        <ToggleLeft className="h-9 w-9 text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex items-center justify-end gap-3.5">
              <button 
                type="button"
                onClick={() => setShowTdsStatusModal(false)}
                className="text-slate-500 hover:text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
              <button 
                type="submit"
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* E. Add/Edit Salary Payment Method Modal */}
      {showMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSaveMethod} className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {editingMethodId ? 'Edit Salary Payment Method' : 'Add Salary Payment Method'}
              </h3>
              <button 
                type="button"
                onClick={() => setShowMethodModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-left">
              {methodError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-[11px] font-bold border border-red-100">
                  {methodError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">
                  Salary Payment Method <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. UPI, Stripe, Wire Transfer"
                  value={methodName}
                  onChange={(e) => setMethodName(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex items-center justify-end gap-3.5">
              <button 
                type="button"
                onClick={() => setShowMethodModal(false)}
                className="text-slate-500 hover:text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
              <button 
                type="submit"
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
