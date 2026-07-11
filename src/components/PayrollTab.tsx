/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Search, Plus, Filter, Download, ArrowUpRight, CheckCircle, 
  Clock, XCircle, FileText, ToggleLeft, ToggleRight, Edit3, Settings, 
  Trash2, Briefcase, Eye, Percent, ChevronRight, HelpCircle, RefreshCw, Calendar, Sparkles, X
} from 'lucide-react';

interface PayrollRecord {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  role: string;
  netSalary: number;
  ctc: number;
  duration: string;
  paidOn: string;
  status: 'Paid' | 'Unpaid' | 'Processing';
}

interface SalaryConfig {
  employeeId: string;
  name: string;
  avatar: string;
  role: string;
  salaryCycle: string;
  salaryGroup: string;
  allowPayroll: boolean;
  basic: number;
  hra: number;
  medical: number;
  pf: number;
  tax: number;
  bonus: number;
}

interface PayrollExpense {
  id: string;
  item: string;
  price: number;
  employee: string;
  purchasedFrom: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

interface OvertimeRequest {
  id: string;
  employeeName: string;
  avatar: string;
  requestDate: string;
  overtimeDate: string;
  duration: string; // "e.g. 4 hrs 30 mins"
  hours: number;
  reason: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const INITIAL_PAYROLLS: PayrollRecord[] = [
  { id: 'PAY-101', employeeId: 'EM-01', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', role: 'Senior React Engineer', netSalary: 8450, ctc: 11200, duration: 'June 2026', paidOn: '2026-06-30', status: 'Paid' },
  { id: 'PAY-102', employeeId: 'EM-02', name: 'James Carter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', role: 'UI/UX Lead', netSalary: 7200, ctc: 9500, duration: 'June 2026', paidOn: '2026-06-30', status: 'Paid' },
  { id: 'PAY-103', employeeId: 'EM-03', name: 'Aria Montgomery', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', role: 'Product Architect', netSalary: 9100, ctc: 12400, duration: 'June 2026', paidOn: 'Pending', status: 'Unpaid' },
  { id: 'PAY-104', employeeId: 'EM-04', name: 'Daniel Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', role: 'Quality Assurance Head', netSalary: 5500, ctc: 7200, duration: 'June 2026', paidOn: 'Pending', status: 'Processing' },
];

const INITIAL_SALARIES: SalaryConfig[] = [
  { employeeId: 'EM-01', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', role: 'Senior React Engineer', salaryCycle: 'Monthly', salaryGroup: 'Tech Band A', allowPayroll: true, basic: 6000, hra: 1800, medical: 400, pf: 600, tax: 450, bonus: 500 },
  { employeeId: 'EM-02', name: 'James Carter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', role: 'UI/UX Lead', salaryCycle: 'Monthly', salaryGroup: 'Creative Band B', allowPayroll: true, basic: 5200, hra: 1500, medical: 350, pf: 500, tax: 350, bonus: 300 },
  { employeeId: 'EM-03', name: 'Aria Montgomery', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', role: 'Product Architect', salaryCycle: 'Monthly', salaryGroup: 'Tech Band A', allowPayroll: true, basic: 6500, hra: 2000, medical: 500, pf: 700, tax: 600, bonus: 400 },
  { employeeId: 'EM-04', name: 'Daniel Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', role: 'Quality Assurance Head', salaryCycle: 'Monthly', salaryGroup: 'QA Band C', allowPayroll: true, basic: 4000, hra: 1200, medical: 300, pf: 400, tax: 250, bonus: 200 },
  { employeeId: 'EM-05', name: 'Zara Khan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', role: 'HR Lead Specialist', salaryCycle: 'Monthly', salaryGroup: 'Operations Band B', allowPayroll: false, basic: 4500, hra: 1300, medical: 300, pf: 450, tax: 280, bonus: 150 },
];

const INITIAL_EXPENSES: PayrollExpense[] = [
  { id: 'EXP-401', item: 'AWS Production Host Proxy Instance', price: 450, employee: 'Elena Rostova', purchasedFrom: 'Amazon Web Services', date: '2026-06-12', status: 'Approved' },
  { id: 'EXP-402', item: 'Figma Team Professional Plan Renewal', price: 180, employee: 'James Carter', purchasedFrom: 'Figma Inc', date: '2026-06-18', status: 'Approved' },
  { id: 'EXP-403', item: 'Ergonomic Standing Office Desk', price: 620, employee: 'Aria Montgomery', purchasedFrom: 'Fully Corp', date: '2026-06-25', status: 'Pending' },
];

const INITIAL_OVERTIME: OvertimeRequest[] = [
  { id: 'OVT-701', employeeName: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', requestDate: '2026-06-20', overtimeDate: '2026-06-19', duration: '4 hrs 30 mins', hours: 4.5, reason: 'Dispatched firmware hotfix to terminal readers', amount: 180, status: 'Approved' },
  { id: 'OVT-702', employeeName: 'Daniel Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', requestDate: '2026-06-22', overtimeDate: '2026-06-21', duration: '2 hrs 0 mins', hours: 2, reason: 'Assisting server migration testing schedules', amount: 80, status: 'Pending' },
  { id: 'OVT-703', employeeName: 'James Carter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', requestDate: '2026-06-24', overtimeDate: '2026-06-23', duration: '3 hrs 15 mins', hours: 3.25, reason: 'Overnight layout design refresh deliverables', amount: 130, status: 'Rejected' },
];

interface PayrollTabProps {
  subTab: string;
}

export default function PayrollTab({ subTab }: PayrollTabProps) {
  // Database States
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(INITIAL_PAYROLLS);
  const [salaries, setSalaries] = useState<SalaryConfig[]>(INITIAL_SALARIES);
  const [expenses, setExpenses] = useState<PayrollExpense[]>(INITIAL_EXPENSES);
  const [overtimes, setOvertimes] = useState<OvertimeRequest[]>(INITIAL_OVERTIME);

  // General Filter / Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('06'); // June default for metrics representation
  const [yearFilter, setYearFilter] = useState('2026');

  // Modals Visibility
  const [showAddSalaryModal, setShowAddSalaryModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddOvertimeModal, setShowAddOvertimeModal] = useState(false);

  // Track landing screen status for each subTab - bypassed to show list directly
  const [hasOpenedList, setHasOpenedList] = useState<Record<string, boolean>>({
    'payroll': true,
    'payroll-salary': true,
    'payroll-expenses': true,
    'payroll-overtime': true,
    'payroll-reports': true,
  });

  React.useEffect(() => {
    // subtab changed
  }, [subTab]);

  // Active configurations in editing
  const [activeSalaryConfig, setActiveSalaryConfig] = useState<SalaryConfig | null>(null);

  // Salary Form live states
  const [salBasic, setSalBasic] = useState(0);
  const [salHra, setSalHra] = useState(0);
  const [salMedical, setSalMedical] = useState(0);
  const [salPf, setSalPf] = useState(0);
  const [salTax, setSalTax] = useState(0);
  const [salBonus, setSalBonus] = useState(0);

  // New Expense form
  const [expItem, setExpItem] = useState('');
  const [expPrice, setExpPrice] = useState(0);
  const [expEmployee, setExpEmployee] = useState('Elena Rostova');
  const [expVendor, setExpVendor] = useState('');
  const [expDate, setExpDate] = useState('');

  // New Overtime form
  const [ovtEmployee, setOvtEmployee] = useState('Elena Rostova');
  const [ovtDate, setOvtDate] = useState('');
  const [ovtType, setOvtType] = useState<'Normal' | 'Double'>('Normal');
  const [ovtHours, setOvtHours] = useState(1);
  const [ovtMinutes, setOvtMinutes] = useState(0);
  const [ovtReason, setOvtReason] = useState('');

  // Reports view active sub-tab
  const [reportsSubtab, setReportsSubtab] = useState<'export' | 'company-tds' | 'employee-tds'>('export');

  // Notification Toast System
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ----------------------------------------------------
  // COMPUTED CALCULATIONS
  // ----------------------------------------------------

  // Salary Live Computations
  const computedGross = useMemo(() => {
    return salBasic + salHra + salMedical + salBonus;
  }, [salBasic, salHra, salMedical, salBonus]);

  const computedDeductions = useMemo(() => {
    return salPf + salTax;
  }, [salPf, salTax]);

  const computedNetSalary = useMemo(() => {
    return computedGross - computedDeductions;
  }, [computedGross, computedDeductions]);

  // Overtime rate calculations (Hourly default = $40/hr. Double = $80/hr)
  const computedOvtAmount = useMemo(() => {
    const totalHours = ovtHours + (ovtMinutes / 60);
    const hourlyRate = ovtType === 'Double' ? 80 : 40;
    return Math.round(totalHours * hourlyRate);
  }, [ovtHours, ovtMinutes, ovtType]);

  // Overtime Metrics Aggregator
  const overtimeMetrics = useMemo(() => {
    const approved = overtimes.filter(o => o.status === 'Approved');
    const pending = overtimes.filter(o => o.status === 'Pending');
    const rejected = overtimes.filter(o => o.status === 'Rejected');
    
    const totalHours = overtimes.reduce((sum, curr) => sum + curr.hours, 0);
    const totalPaid = approved.reduce((sum, curr) => sum + curr.amount, 0);

    return {
      totalRequested: overtimes.length,
      approvedCount: approved.length,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
      totalHours,
      totalPaid,
    };
  }, [overtimes]);

  // ----------------------------------------------------
  // PAYROLL DIR ACTIONS
  // ----------------------------------------------------
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [payrolls, searchQuery]);

  const handleGenerateMonthlyPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    // Recreate / populate fresh records from active configs with allowPayroll: true
    const activeStaff = salaries.filter(s => s.allowPayroll);
    const freshlyGenerated: PayrollRecord[] = activeStaff.map(staff => {
      const gross = staff.basic + staff.hra + staff.medical + staff.bonus;
      const net = gross - (staff.pf + staff.tax);
      return {
        id: `PAY-0${Math.floor(100 + Math.random() * 900)}`,
        employeeId: staff.employeeId,
        name: staff.name,
        avatar: staff.avatar,
        role: staff.role,
        netSalary: net,
        ctc: Math.round(gross * 1.3), // Simulated CTC
        duration: 'July 2026',
        paidOn: 'Pending',
        status: 'Unpaid',
      };
    });

    setPayrolls([...freshlyGenerated, ...payrolls.filter(p => p.duration !== 'July 2026')]);
    showToast(`Monthly payroll batch for ${freshlyGenerated.length} employees compiled and queued!`);
  };

  const handleMarkPayrollPaid = (id: string) => {
    setPayrolls(payrolls.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Paid',
          paidOn: new Date().toISOString().slice(0, 10),
        };
      }
      return p;
    }));
    showToast(`Payroll record ${id} marked as Paid.`);
  };

  // ----------------------------------------------------
  // SALARY DIR ACTIONS
  // ----------------------------------------------------
  const filteredSalaries = useMemo(() => {
    return salaries.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [salaries, searchQuery]);

  const handleToggleAllowPayroll = (empId: string, currentVal: boolean) => {
    setSalaries(salaries.map(s => {
      if (s.employeeId === empId) {
        return { ...s, allowPayroll: !currentVal };
      }
      return s;
    }));
    showToast(`Toggled payroll allowance for employee.`);
  };

  const handleOpenSalaryConfig = (config: SalaryConfig) => {
    setActiveSalaryConfig(config);
    setSalBasic(config.basic);
    setSalHra(config.hra);
    setSalMedical(config.medical);
    setSalPf(config.pf);
    setSalTax(config.tax);
    setSalBonus(config.bonus);
    setShowAddSalaryModal(true);
  };

  const handleSaveSalaryConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSalaryConfig) return;

    setSalaries(salaries.map(s => {
      if (s.employeeId === activeSalaryConfig.employeeId) {
        return {
          ...s,
          basic: salBasic,
          hra: salHra,
          medical: salMedical,
          pf: salPf,
          tax: salTax,
          bonus: salBonus,
        };
      }
      return s;
    }));

    setShowAddSalaryModal(false);
    showToast(`Salary configuration for "${activeSalaryConfig.name}" updated successfully.`);
  };

  // ----------------------------------------------------
  // EXPENSES ACTIONS
  // ----------------------------------------------------
  const filteredExpenses = useMemo(() => {
    return expenses.filter(ex => {
      return ex.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
             ex.employee.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [expenses, searchQuery]);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expItem || expPrice <= 0 || !expVendor) {
      alert("Please provide Item details, correct price, and Vendor origin.");
      return;
    }

    const created: PayrollExpense = {
      id: `EXP-0${expenses.length + 1}`,
      item: expItem,
      price: expPrice,
      employee: expEmployee,
      purchasedFrom: expVendor,
      date: expDate || new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };

    setExpenses([created, ...expenses]);
    setExpItem('');
    setExpPrice(0);
    setExpVendor('');
    setShowAddExpenseModal(false);
    showToast(`Expense claim for "${created.item}" logged!`);
  };

  const handleApproveRejectExpense = (id: string, decision: 'Approved' | 'Rejected') => {
    setExpenses(expenses.map(ex => {
      if (ex.id === id) {
        return { ...ex, status: decision };
      }
      return ex;
    }));
    showToast(`Claim ${id} status updated to: ${decision}`);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Are you sure you want to retract this logged expense?")) {
      setExpenses(expenses.filter(ex => ex.id !== id));
      showToast("Expense entry cleared.");
    }
  };

  // ----------------------------------------------------
  // OVERTIME ACTIONS
  // ----------------------------------------------------
  const filteredOvertimes = useMemo(() => {
    return overtimes.filter(o => {
      return o.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [overtimes, searchQuery]);

  const handleAddOvertimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const avatarMap: Record<string, string> = {
      'Elena Rostova': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      'Daniel Park': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      'James Carter': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    };

    const created: OvertimeRequest = {
      id: `OVT-0${overtimes.length + 1}`,
      employeeName: ovtEmployee,
      avatar: avatarMap[ovtEmployee] || avatarMap['Elena Rostova'],
      requestDate: new Date().toISOString().slice(0, 10),
      overtimeDate: ovtDate || new Date().toISOString().slice(0, 10),
      duration: `${ovtHours} hrs ${ovtMinutes} mins`,
      hours: ovtHours + (ovtMinutes / 60),
      reason: ovtReason || 'System maintenance support',
      amount: computedOvtAmount,
      status: 'Pending',
    };

    setOvertimes([created, ...overtimes]);
    setOvtReason('');
    setShowAddOvertimeModal(false);
    showToast(`Overtime request of ${created.duration} filed for ${ovtEmployee}!`);
  };

  const handleOvertimeDecision = (id: string, decision: 'Approved' | 'Rejected') => {
    setOvertimes(overtimes.map(o => {
      if (o.id === id) {
        return { ...o, status: decision };
      }
      return o;
    }));
    showToast(`Overtime request ${id} ${decision}`);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Toast System */}
      {toastMessage && (
        <div id="payroll-toast" className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold py-3 px-5 rounded-xl border border-slate-700 flex items-center gap-2.5 shadow-2xl animate-fade-in">
          <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400/20" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Context Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <DollarSign className="h-6 w-6 text-indigo-600 animate-pulse" />
            <span className="capitalize">
              {subTab === 'payroll' ? 'Generate Company Payroll' : 
               subTab === 'payroll-salary' ? 'Employee Salary Structure' : 
               subTab === 'payroll-expenses' ? 'Reclaimable Expenses Audit' :
               subTab === 'payroll-overtime' ? 'Overtime Compensation Requests' : 'Payroll TDS Financial Reports'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {subTab === 'payroll' ? 'Queue salary batches, add attendance deductions, and mark payslips as disbursed.' :
             subTab === 'payroll-salary' ? 'Define core earnings, taxes, and PF deductions on an individual basis.' :
             subTab === 'payroll-expenses' ? 'Track corporate receipts, audit purchases, and authorize staff compensation claims.' :
             subTab === 'payroll-overtime' ? 'Verify extra shifts and manage compensatory hours backed by biometric terminal logs.' :
             'Review tax deductions at source (TDS), export cumulative sheets, and compile reports.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasOpenedList[subTab] && (
            <>
              {subTab === 'payroll-expenses' && (
                <button
                  id="btn-add-expense"
                  onClick={() => {
                    setExpDate(new Date().toISOString().slice(0, 10));
                    setShowAddExpenseModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>Claim New Expense</span>
                </button>
              )}

              {subTab === 'payroll-overtime' && (
                <button
                  id="btn-add-overtime"
                  onClick={() => {
                    setOvtDate(new Date().toISOString().slice(0, 10));
                    setShowAddOvertimeModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>File Overtime Claim</span>
                </button>
              )}

              {subTab === 'payroll-salary' && (
                <button
                  onClick={() => {
                    const headers = 'Employee ID,Name,Designation,Salary Cycle,Group,Allow Payroll,Basic Salary\n';
                    const rows = salaries.map(s => `${s.employeeId},"${s.name}","${s.role}",${s.salaryCycle},"${s.salaryGroup}",${s.allowPayroll},${s.basic}`).join('\n');
                    const blob = new Blob([headers + rows], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', 'Employee_Salary_Structure.csv');
                    a.click();
                    showToast("Salary CSV spreadsheet downloaded.");
                  }}
                  className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="h-4 w-4 text-slate-300" />
                  <span>Export Structures</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* LANDING SCREEN (If list is not opened and forms are closed) */}
      {/* ========================================================= */}
      {!hasOpenedList[subTab] && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm my-8 space-y-6 animate-fade-in">
          {/* Branded Icon Frame */}
          <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <DollarSign className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {subTab === 'payroll' && 'Corporate Monthly Payroll Ledger'}
              {subTab === 'payroll-salary' && 'Employee Salary Structures'}
              {subTab === 'payroll-expenses' && 'Corporate Reclaimable Expenses'}
              {subTab === 'payroll-overtime' && 'Overtime Shifts & Compensation'}
              {subTab === 'payroll-reports' && 'TDS & Payroll Financial Reports'}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              {subTab === 'payroll' && 'Initiate and manage salary dispatch cycles, configure tax withholdings, and disburse pay stubs seamlessly to employee files.'}
              {subTab === 'payroll-salary' && 'Configure custom remuneration templates, HRA allowances, and pension/tax deductions for active and incoming staff.'}
              {subTab === 'payroll-expenses' && 'Submit, process, and audit staff expense reimbursement requests backed by merchant receipts.'}
              {subTab === 'payroll-overtime' && 'Validate supplemental hour contributions cross-referenced with local terminal check-in biometric streams.'}
              {subTab === 'payroll-reports' && 'Compile financial audits, evaluate salary expenditure dashboards, and download quarterly Tax Deducted at Source spreadsheets.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setHasOpenedList(prev => ({ ...prev, [subTab]: true }));
                if (subTab === 'payroll-expenses') {
                  setExpDate(new Date().toISOString().slice(0, 10));
                  setShowAddExpenseModal(true);
                } else if (subTab === 'payroll-overtime') {
                  setOvtDate(new Date().toISOString().slice(0, 10));
                  setShowAddOvertimeModal(true);
                } else if (subTab === 'payroll') {
                  // Run compile modal or focus search
                  showToast("Initializing Monthly Ledger Compile workspace...");
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>
                {subTab === 'payroll' && 'Configure Base Salary'}
                {subTab === 'payroll-salary' && 'Configure Base Salary'}
                {subTab === 'payroll-expenses' && 'Log Payroll Expense'}
                {subTab === 'payroll-overtime' && 'Create Overtime Request'}
                {subTab === 'payroll-reports' && 'Compile Payroll Report'}
              </span>
            </button>
            <button
              onClick={() => {
                setHasOpenedList(prev => ({ ...prev, [subTab]: true }));
              }}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold px-6 py-3 rounded-lg border border-slate-200 transition-all cursor-pointer w-full sm:w-auto"
            >
              Go to General Page
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 1: RUN BATCH PAYROLL
          ---------------------------------------------------- */}
      {subTab === 'payroll' && hasOpenedList[subTab] && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Quick Setup / Generate Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs h-fit">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-indigo-500" />
                <span>Compile Monthly Ledger</span>
              </h4>
              <p className="text-[11px] text-slate-400">Configure parameters to calculate monthly salary structures.</p>
            </div>

            <form onSubmit={handleGenerateMonthlyPayroll} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Select Year</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 focus:outline-none" value={yearFilter} onChange={(e)=>setYearFilter(e.target.value)}>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Select Month</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 focus:outline-none font-mono" value={monthFilter} onChange={(e)=>setMonthFilter(e.target.value)}>
                    <option value="06">06 Jun</option>
                    <option value="07">07 Jul</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Target Department</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 focus:outline-none">
                  <option value="">All Corporate Departments</option>
                  <option value="Engineering">Engineering Department</option>
                  <option value="Operations">Operations / HR</option>
                </select>
              </div>

              {/* Extra Parameters Checkboxes */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="block text-[10px] text-slate-400 uppercase font-bold">Calculation Modifiers</label>
                
                <label className="flex items-center gap-2.5 text-slate-600 font-semibold cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-0 w-4 h-4" />
                  <span>Include Approved Expense Claims</span>
                </label>

                <label className="flex items-center gap-2.5 text-slate-600 font-semibold cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-0 w-4 h-4" />
                  <span>Deduct Lateness from Biometric logs</span>
                </label>

                <label className="flex items-center gap-2.5 text-slate-600 font-semibold cursor-pointer">
                  <input type="checkbox" className="rounded text-indigo-600 focus:ring-0 w-4 h-4" />
                  <span>Include Overtime Request hours</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-center shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                Compile and Generate July Batch
              </button>
            </form>
          </div>

          {/* Directory Listings */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-500 animate-pulse" />
                <span>Corporate Payroll Ledger</span>
              </h4>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search payroll records..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3 text-right">Net Remuneration</th>
                    <th className="px-5 py-3 text-right">CTC Equivalent</th>
                    <th className="px-5 py-3">Duration Cycle</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {filteredPayrolls.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/30">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={p.avatar} className="w-8 h-8 rounded-full border border-slate-100" />
                          <div>
                            <p className="font-bold text-slate-900 leading-none">{p.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{p.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">${p.netSalary.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-slate-400">${p.ctc.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-medium">{p.duration}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                          p.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          p.status === 'Processing' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${p.status === 'Paid' ? 'bg-emerald-500' : p.status === 'Processing' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <span>{p.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {p.status === 'Unpaid' ? (
                          <button
                            onClick={() => handleMarkPayrollPaid(p.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                          >
                            Disburse Cash
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">Payslip Sourced</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: EMPLOYEE SALARY CONFIGURATION LIST & MODAL
          ---------------------------------------------------- */}
      {subTab === 'payroll-salary' && hasOpenedList[subTab] && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Briefcase className="h-5 w-5 text-indigo-500 animate-pulse" />
              <span>Configure Base Structures</span>
            </h4>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search base structures..."
                className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Salary Config table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Salary Group</th>
                  <th className="px-5 py-3.5">Cycle</th>
                  <th className="px-5 py-3.5">Allow Batch Payroll</th>
                  <th className="px-5 py-3.5 text-right">Computed Base Salary</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                {filteredSalaries.map(s => (
                  <tr key={s.employeeId} className="hover:bg-slate-50/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{s.salaryGroup}</td>
                    <td className="px-5 py-4 font-bold text-indigo-600">{s.salaryCycle}</td>
                    <td className="px-5 py-4">
                      <button 
                        onClick={() => handleToggleAllowPayroll(s.employeeId, s.allowPayroll)}
                        className="cursor-pointer text-slate-400 hover:text-slate-600"
                      >
                        {s.allowPayroll ? (
                          <ToggleRight className="h-6 w-6 text-indigo-600 fill-indigo-600/10" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                      ${(s.basic + s.hra + s.medical + s.bonus - (s.pf + s.tax)).toLocaleString()} / Mo
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleOpenSalaryConfig(s)}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 hover:text-indigo-800 rounded-lg cursor-pointer transition-colors"
                        title="Configure Allowances & Taxes"
                      >
                        <Settings className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADD / EDIT SALARY PARAMETERS MODAL */}
          {showAddSalaryModal && activeSalaryConfig && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-150 shadow-2xl space-y-6">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Salary Parameters Configuration</h3>
                    <p className="text-xs text-slate-400">Modify allowances, pensions, and income taxes for <strong>{activeSalaryConfig.name}</strong></p>
                  </div>
                  <button onClick={() => setShowAddSalaryModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-5 w-5" /></button>
                </div>

                <form onSubmit={handleSaveSalaryConfig} className="space-y-6 text-xs">
                  {/* Earnings column vs Deductions Column */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1: Gross Earnings */}
                    <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-2">
                        <ArrowUpRight className="h-4.5 w-4.5 text-emerald-500" />
                        <span>Core Earnings & Allowances</span>
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Basic Base Salary *</label>
                          <input type="number" className="w-full bg-white p-2 border border-slate-200 rounded-xl font-mono text-right font-bold" value={salBasic} onChange={(e)=>setSalBasic(parseInt(e.target.value) || 0)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">House Rent Allowance (HRA)</label>
                          <input type="number" className="w-full bg-white p-2 border border-slate-200 rounded-xl font-mono text-right" value={salHra} onChange={(e)=>setSalHra(parseInt(e.target.value) || 0)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medical Medical Reimbursement</label>
                          <input type="number" className="w-full bg-white p-2 border border-slate-200 rounded-xl font-mono text-right" value={salMedical} onChange={(e)=>setSalMedical(parseInt(e.target.value) || 0)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Performance Bonus Incentive</label>
                          <input type="number" className="w-full bg-white p-2 border border-slate-200 rounded-xl font-mono text-right" value={salBonus} onChange={(e)=>setSalBonus(parseInt(e.target.value) || 0)} />
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Legal Deductions */}
                    <div className="space-y-4 bg-rose-50/20 p-4 rounded-xl border border-rose-100/50">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-2">
                        <Percent className="h-4 w-4 text-rose-500" />
                        <span>Legal Taxes & Deductions</span>
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Provident Fund Contribution (PF)</label>
                          <input type="number" className="w-full bg-white p-2 border border-slate-200 rounded-xl font-mono text-right" value={salPf} onChange={(e)=>setSalPf(parseInt(e.target.value) || 0)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tax Deductions (TDS Base)</label>
                          <input type="number" className="w-full bg-white p-2 border border-slate-200 rounded-xl font-mono text-right" value={salTax} onChange={(e)=>setSalTax(parseInt(e.target.value) || 0)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Automatic Calculations summary */}
                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 grid grid-cols-3 gap-4 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5 font-sans uppercase font-bold">Gross Earnings</span>
                      <span className="text-sm font-bold text-white">${computedGross.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5 font-sans uppercase font-bold">Total Deductions</span>
                      <span className="text-sm font-bold text-rose-400">${computedDeductions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-400 block mb-0.5 font-sans uppercase font-bold">Net Take Home</span>
                      <span className="text-sm font-black text-indigo-300">${computedNetSalary.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddSalaryModal(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Save Parameters Structure
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: RECLAIMABLE EXPENSES AUDIT
          ---------------------------------------------------- */}
      {subTab === 'payroll-expenses' && hasOpenedList[subTab] && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="h-5 w-5 text-indigo-500 animate-pulse" />
              <span>Compensation claims registry</span>
            </h4>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search logged claims..."
                className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Expenses Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-5 py-3.5">Item claimed</th>
                  <th className="px-5 py-3.5 text-right">Price Value</th>
                  <th className="px-5 py-3.5">Purchased From</th>
                  <th className="px-5 py-3.5">Purchased Date</th>
                  <th className="px-5 py-3.5">Logged By</th>
                  <th className="px-5 py-3.5">Status Check</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                {filteredExpenses.map(ex => (
                  <tr key={ex.id} className="hover:bg-slate-50/40">
                    <td className="px-5 py-4 font-bold text-slate-900">{ex.item}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-slate-800">${ex.price.toLocaleString()}</td>
                    <td className="px-5 py-4 text-slate-500">{ex.purchasedFrom}</td>
                    <td className="px-5 py-4 font-mono text-slate-400 text-[11px]">{ex.date}</td>
                    <td className="px-5 py-4 text-slate-600">{ex.employee}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide leading-none ${
                        ex.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        ex.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ex.status === 'Approved' ? 'bg-emerald-500' : ex.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <span>{ex.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ex.status === 'Pending' && (
                          <>
                            <button onClick={() => handleApproveRejectExpense(ex.id, 'Approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-1 rounded hover:scale-105 cursor-pointer transition-all"><CheckCircle className="h-4 w-4" /></button>
                            <button onClick={() => handleApproveRejectExpense(ex.id, 'Rejected')} className="bg-rose-500 hover:bg-rose-600 text-white font-bold p-1 rounded hover:scale-105 cursor-pointer transition-all"><XCircle className="h-4 w-4" /></button>
                          </>
                        )}
                        <button onClick={() => handleDeleteExpense(ex.id)} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LAUNCH ADD EXPENSE MODAL */}
          {showAddExpenseModal && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-base font-black text-slate-900 font-sans">Claim Expense Reimbursement</h3>
                  <p className="text-xs text-slate-400">File standard item purchase receipts to claim salary credit.</p>
                </div>

                <form onSubmit={handleAddExpenseSubmit} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Item Title / Receipt Purpose *</label>
                    <input type="text" required placeholder="e.g. AWS proxy server fees" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={expItem} onChange={(e)=>setExpItem(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Receipt Cost ($) *</label>
                      <input type="number" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono" value={expPrice} onChange={(e)=>setExpPrice(parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Receipt Sourced Date</label>
                      <input type="date" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono" value={expDate} onChange={(e)=>setExpDate(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Sourced Vendor Origin *</label>
                    <input type="text" required placeholder="e.g. Amazon Web Services Inc." className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={expVendor} onChange={(e)=>setExpVendor(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Purchased By Staff Member</label>
                    <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={expEmployee} onChange={(e)=>setExpEmployee(e.target.value)}>
                      <option value="Elena Rostova">Elena Rostova</option>
                      <option value="James Carter">James Carter</option>
                      <option value="Aria Montgomery">Aria Montgomery</option>
                      <option value="Daniel Park">Daniel Park</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-3">
                    <button type="button" onClick={()=>setShowAddExpenseModal(false)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl">Log and Review Claim</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: OVERTIME REQUESTS
          ---------------------------------------------------- */}
      {subTab === 'payroll-overtime' && hasOpenedList[subTab] && (
        <div className="space-y-6 animate-fade-in">
          {/* Overtime summary metrics cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Approved Claims</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{overtimeMetrics.approvedCount} Records</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending Review</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{overtimeMetrics.pendingCount} Claims</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Accumulated Hours</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{overtimeMetrics.totalHours} Hours</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <RefreshCw className="h-4.5 w-4.5 animate-spin" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Compensated Cash</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">${overtimeMetrics.totalPaid.toLocaleString()}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-indigo-300 flex items-center justify-center">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>

          {/* Overtime List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="h-5 w-5 text-indigo-600 animate-pulse" />
                <span>Overtime Compensation Claims Ledger</span>
              </h4>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search overtime registry..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Overtime table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Filing Date</th>
                    <th className="px-5 py-3.5">Shift Date</th>
                    <th className="px-5 py-3.5">Duration Log</th>
                    <th className="px-5 py-3.5">Task Reason</th>
                    <th className="px-5 py-3.5 text-right">Cash Amount</th>
                    <th className="px-5 py-3.5">Audit Check</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {filteredOvertimes.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <img src={o.avatar} className="w-8 h-8 rounded-full" />
                          <span className="font-bold text-slate-900">{o.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-450 text-[11px]">{o.requestDate}</td>
                      <td className="px-5 py-4 font-mono text-slate-450 text-[11px]">{o.overtimeDate}</td>
                      <td className="px-5 py-4 text-indigo-600">{o.duration}</td>
                      <td className="px-5 py-4 text-slate-500 truncate max-w-[150px]">{o.reason}</td>
                      <td className="px-5 py-4 text-right font-mono font-black text-slate-800">${o.amount.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide leading-none ${
                          o.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          o.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${o.status === 'Approved' ? 'bg-emerald-500' : o.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <span>{o.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {o.status === 'Pending' && (
                            <>
                              <button onClick={() => handleOvertimeDecision(o.id, 'Approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-1 rounded hover:scale-105 cursor-pointer transition-all"><CheckCircle className="h-4 w-4" /></button>
                              <button onClick={() => handleOvertimeDecision(o.id, 'Rejected')} className="bg-rose-500 hover:bg-rose-600 text-white font-bold p-1 rounded hover:scale-105 cursor-pointer transition-all"><XCircle className="h-4 w-4" /></button>
                            </>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">Verified</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD OVERTIME REQUEST CLAIM MODAL */}
          {showAddOvertimeModal && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-base font-black text-slate-900 font-sans">File Overtime Shift Claim</h3>
                  <p className="text-xs text-slate-400">File compensatory overtime shifts backed by biometric terminal clocks.</p>
                </div>

                <form onSubmit={handleAddOvertimeSubmit} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Select Employee *</label>
                    <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={ovtEmployee} onChange={(e)=>setOvtEmployee(e.target.value)}>
                      <option value="Elena Rostova">Elena Rostova (Tech Lead)</option>
                      <option value="Daniel Park">Daniel Park (QA Engineer)</option>
                      <option value="James Carter">James Carter (UI Designer)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Shift Overtime Date *</label>
                      <input type="date" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono" value={ovtDate} onChange={(e)=>setOvtDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Shift Multiplier Rate</label>
                      <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={ovtType} onChange={(e)=>setOvtType(e.target.value as any)}>
                        <option value="Normal">Normal Rate (1.5x - $40/Hr)</option>
                        <option value="Double">Double Premium (2.0x - $80/Hr)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Shift Hours *</label>
                      <input type="number" min={0} required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono" value={ovtHours} onChange={(e)=>setOvtHours(parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Shift Minutes</label>
                      <input type="number" min={0} max={59} required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono" value={ovtMinutes} onChange={(e)=>setOvtMinutes(parseInt(e.target.value) || 0)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Detailed Reason / Task Code *</label>
                    <textarea required placeholder="e.g. Critical database firmware update maintenance." className="w-full h-20 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={ovtReason} onChange={(e)=>setOvtReason(e.target.value)} />
                  </div>

                  {/* Calculations summary */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center font-mono">
                    <span className="text-[10px] text-slate-400 block mb-0.5 uppercase font-bold font-sans">Compensatory Credit Generated</span>
                    <span className="text-sm font-black text-emerald-400">${computedOvtAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-3">
                    <button type="button" onClick={()=>setShowAddOvertimeModal(false)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl">File Overtime Claim</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 5: TDS & TAXES REPORTS
          ---------------------------------------------------- */}
      {subTab === 'payroll-reports' && hasOpenedList[subTab] && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs animate-fade-in">
          {/* Subtabs controls inside Reports */}
          <div className="flex border-b border-slate-150 gap-4 text-xs font-bold text-slate-400">
            <button 
              onClick={() => setReportsSubtab('export')}
              className={`pb-3 border-b-2 cursor-pointer transition-all ${reportsSubtab === 'export' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-700'}`}
            >
              Export Monthly Ledger Sheets
            </button>
            <button 
              onClick={() => setReportsSubtab('company-tds')}
              className={`pb-3 border-b-2 cursor-pointer transition-all ${reportsSubtab === 'company-tds' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-700'}`}
            >
              Company TDS Summary
            </button>
            <button 
              onClick={() => setReportsSubtab('employee-tds')}
              className={`pb-3 border-b-2 cursor-pointer transition-all ${reportsSubtab === 'employee-tds' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-700'}`}
            >
              Employee Individual TDS Slices
            </button>
          </div>

          {/* REPORT 1: GENERAL EXPORT SHEET */}
          {reportsSubtab === 'export' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Month Slices</label>
                  <select className="w-full bg-white text-slate-850 p-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none">
                    <option value="06">June 2026</option>
                    <option value="05">May 2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Corporate Department</label>
                  <select className="w-full bg-white text-slate-850 p-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none">
                    <option value="">All Departments</option>
                    <option value="Engineering">Engineering Department</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">TDS Designation</label>
                  <select className="w-full bg-white text-slate-850 p-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none">
                    <option value="">All Designations</option>
                    <option value="Lead">Lead Developer</option>
                  </select>
                </div>
              </div>

              {/* Action layout grids representing sheets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-900">Current Monthly Compensation Sheet</h4>
                      <p className="text-[11px] text-slate-400">Generate a comprehensive summary of individual employee base structures and gross payouts.</p>
                    </div>
                  </div>
                  <button onClick={() => showToast("Monthly Sheet spreadsheet compiled and exported to local desktop.")} className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 rounded-xl text-center text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Download Monthly Spreadsheet</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Download className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-900">Cumulative Year-to-Date Ledger Sheet</h4>
                      <p className="text-[11px] text-slate-400">Export audited tax figures, pensions, and base salaries parsed for corporate financial auditing years.</p>
                    </div>
                  </div>
                  <button onClick={() => showToast("Cumulative ledger compiled and exported.")} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-center text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Download Cumulative Ledger</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REPORT 2: COMPANY TDS VIEW */}
          {reportsSubtab === 'company-tds' && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="bg-slate-900 p-5 rounded-2xl text-slate-300 font-mono space-y-4 border border-slate-850">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-start font-sans">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company Taxes Deducted Slices Summary</h4>
                    <p className="text-[11px] text-slate-400">Corporate tax filings ledger statement for financial cycle 2026</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border border-emerald-100">AUDITED VALID</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-2 border-b border-slate-800">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-sans">Corporate base payouts</span>
                    <p className="text-lg font-bold text-white mt-0.5">$30,250</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-sans">Deducted PF Funds</span>
                    <p className="text-lg font-bold text-white mt-0.5">$2,250</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-indigo-400 uppercase font-sans">TDS Taxes Slices</span>
                    <p className="text-lg font-bold text-indigo-300 mt-0.5">$1,680</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-sans">Company Net Slices</span>
                    <p className="text-lg font-bold text-white mt-0.5">$26,320</p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 italic">Form-16 filing signatures auto-authenticated by cryptographic portal protocols.</p>
              </div>
            </div>
          )}

          {/* REPORT 3: INDIVIDUAL TDS SLICES */}
          {reportsSubtab === 'employee-tds' && (
            <div className="overflow-x-auto border border-slate-100 rounded-xl animate-fade-in text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Salary Group</th>
                    <th className="px-5 py-3.5 text-right">Basic Monthly Earnings</th>
                    <th className="px-5 py-3.5 text-right">Provident Fund (PF)</th>
                    <th className="px-5 py-3.5 text-right font-mono text-indigo-600">Monthly TDS Taxes Slices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-750 font-semibold">
                  {salaries.map(s => (
                    <tr key={s.employeeId} className="hover:bg-slate-50/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <img src={s.avatar} className="w-7 h-7 rounded-full border border-slate-100" />
                          <span className="font-bold text-slate-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{s.salaryGroup}</td>
                      <td className="px-5 py-4 text-right font-mono">${s.basic.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right font-mono text-rose-500">${s.pf.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-indigo-600">${s.tax.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
