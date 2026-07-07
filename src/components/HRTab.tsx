/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Calendar, Award, Briefcase, Heart, Plus, Search, 
  Check, X, Sparkles, Smile, Star, Gift, ShieldAlert,
  Filter, Grid, List, Trash2, Edit, MoreVertical, Building,
  MapPin, Mail, DollarSign, CalendarPlus, Trash, ArrowRight,
  UserCheck, CheckCircle2, RefreshCw, ThumbsUp, HelpCircle, Clock
} from 'lucide-react';
import { Employee, Leave } from '../types';

interface HRTabProps {
  subTab: string;
  employees: Employee[];
  leaves: Leave[];
  onApproveLeave: (id: string, status: 'Approved' | 'Rejected') => void;
  onAddEmployee: (employee: Omit<Employee, 'id' | 'status' | 'joiningDate' | 'avatar'>) => void;
  onDeleteEmployee?: (id: string) => void;
  onUpdateEmployee?: (updatedEmp: Employee) => void;
  onApplyLeave?: (newLeave: Omit<Leave, 'id' | 'status'>) => void;
}

export default function HRTab({
  subTab,
  employees,
  leaves,
  onApproveLeave,
  onAddEmployee,
  onDeleteEmployee,
  onUpdateEmployee,
  onApplyLeave
}: HRTabProps) {
  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterDesig, setFilterDesig] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals & Slidover Triggers
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [showApprModal, setShowApprModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showDesigModal, setShowDesigModal] = useState(false);

  // Profile View Drawer
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // New Employee Form State
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDesignation, setEmpDesignation] = useState('Senior Developer');
  const [empDepartment, setEmpDepartment] = useState('Engineering');
  const [empSalary, setEmpSalary] = useState(6000);

  // New Leave Request State
  const [leaveEmployeeId, setLeaveEmployeeId] = useState(employees[0]?.id || '');
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Earned' | 'Maternity'>('Casual');
  const [leaveStart, setLeaveStart] = useState('2026-07-06');
  const [leaveEnd, setLeaveEnd] = useState('2026-07-08');
  const [leaveReason, setLeaveReason] = useState('');

  // Local Custom State Lists
  const [appreciations, setAppreciations] = useState([
    { id: 'ap-1', sender: 'Elena Rostova', receiver: 'James Carter', badge: 'Design Mastermind', content: 'The new UI tokens layout guidelines are pristine. Incredible work on the dark modes!', likes: 5, date: '2026-07-02', color: 'indigo' },
    { id: 'ap-2', sender: 'Zara Khan', receiver: 'Elena Rostova', badge: 'Continuous Excellence', content: 'Elena optimized our background esbuild server bundle. The hot-reloading speed has tripled!', likes: 12, date: '2026-07-01', color: 'emerald' },
    { id: 'ap-3', sender: 'Daniel Park', receiver: 'Zara Khan', badge: 'Rockstar Teamwork', content: 'Huge props to Zara for streamlining the onboarding logs and biometric mappings this week!', likes: 8, date: '2026-06-29', color: 'rose' }
  ]);

  const [departments, setDepartments] = useState([
    { name: 'Engineering', leadName: 'Elena Rostova' },
    { name: 'Design', leadName: 'James Carter' },
    { name: 'Product', leadName: 'Aria Montgomery' },
    { name: 'QA', leadName: 'Daniel Park' },
    { name: 'HR', leadName: 'Zara Khan' },
  ]);

  const [designations, setDesignations] = useState([
    { title: 'Senior Developer', department: 'Engineering' },
    { title: 'UI/UX Designer', department: 'Design' },
    { title: 'Product Manager', department: 'Product' },
    { title: 'QA Specialist', department: 'QA' },
    { title: 'HR Lead', department: 'HR' },
    { title: 'Backend Architect', department: 'Engineering' }
  ]);

  const [holidays, setHolidays] = useState([
    { id: 'hol-1', name: 'Independence Day', date: '2026-07-04', type: 'National Holiday' },
    { id: 'hol-2', name: 'Labor Day Weekend', date: '2026-09-07', type: 'Public Holiday' },
    { id: 'hol-3', name: 'Thanksgiving', date: '2026-11-26', type: 'Company Holiday' },
    { id: 'hol-4', name: 'Winter Solstice Recess', date: '2026-12-25', type: 'Federal Rest Day' },
    { id: 'hol-5', name: 'New Year Celebration', date: '2027-01-01', type: 'National Holiday' }
  ]);

  // Appreciation Form State
  const [apprFrom, setApprFrom] = useState(employees[0]?.name || 'Elena Rostova');
  const [apprTo, setApprTo] = useState(employees[1]?.name || 'Zara Khan');
  const [apprBadge, setApprBadge] = useState('Rockstar Teamwork');
  const [apprMsg, setApprMsg] = useState('');
  const [apprColor, setApprColor] = useState('indigo');

  // Add Department State
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptLead, setNewDeptLead] = useState('Elena Rostova');

  // Add Designation State
  const [newDesigTitle, setNewDesigTitle] = useState('');
  const [newDesigDept, setNewDesigDept] = useState('Engineering');

  // Add Holiday State
  const [newHolName, setNewHolName] = useState('');
  const [newHolDate, setNewHolDate] = useState('2026-08-15');
  const [newHolType, setNewHolType] = useState('National Holiday');

  // Shift Roster Custom States
  const [roster, setRoster] = useState([
    { employeeId: 'EMP-01', employeeName: 'Elena Rostova', shiftName: 'Day Shift', timings: '09:00 - 18:00', color: 'indigo' },
    { employeeId: 'EMP-02', employeeName: 'Zara Khan', shiftName: 'Day Shift', timings: '09:00 - 18:00', color: 'indigo' },
    { employeeId: 'EMP-03', employeeName: 'James Carter', shiftName: 'Evening Shift', timings: '14:00 - 23:00', color: 'amber' },
    { employeeId: 'EMP-04', employeeName: 'Daniel Park', shiftName: 'Night Shift', timings: '22:00 - 06:00', color: 'rose' },
    { employeeId: 'EMP-05', employeeName: 'Aria Montgomery', shiftName: 'Day Shift', timings: '09:00 - 18:00', color: 'indigo' },
  ]);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftEmployeeId, setShiftEmployeeId] = useState('EMP-01');
  const [shiftName, setShiftName] = useState('Day Shift');

  // Attendance Records Custom States
  const [attendanceLogs, setAttendanceLogs] = useState([
    { id: 'att-1', employeeName: 'Elena Rostova', date: '2026-07-04', clockIn: '08:52 AM', clockOut: '06:05 PM', hours: 9.2, status: 'On Time', ip: '192.168.1.45', device: 'Web Chrome' },
    { id: 'att-2', employeeName: 'Zara Khan', date: '2026-07-04', clockIn: '08:45 AM', clockOut: '06:00 PM', hours: 9.25, status: 'On Time', ip: '192.168.1.12', device: 'Web Firefox' },
    { id: 'att-3', employeeName: 'James Carter', date: '2026-07-04', clockIn: '09:15 AM', clockOut: '05:45 PM', hours: 8.5, status: 'Late', ip: '192.168.1.88', device: 'Web Safari' },
    { id: 'att-4', employeeName: 'Daniel Park', date: '2026-07-04', clockIn: '08:58 AM', clockOut: '06:02 PM', hours: 9.0, status: 'On Time', ip: '192.168.1.101', device: 'Desktop App' },
    { id: 'att-5', employeeName: 'Aria Montgomery', date: '2026-07-04', clockIn: '10:05 AM', clockOut: '05:30 PM', hours: 7.4, status: 'Late', ip: '192.168.1.5', device: 'Web Chrome' }
  ]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attEmployeeName, setAttEmployeeName] = useState('Elena Rostova');
  const [attDate, setAttDate] = useState('2026-07-04');
  const [attClockIn, setAttClockIn] = useState('09:00 AM');
  const [attClockOut, setAttClockOut] = useState('06:00 PM');
  const [attStatus, setAttStatus] = useState('On Time');

  // Helper: Retrieve employee metadata safely by name
  const getEmployeeByName = (name: string) => {
    return employees.find(e => e.name.toLowerCase() === name.toLowerCase()) || {
      name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      designation: 'Staff Associate',
      department: 'Corporate Support',
      status: 'Present' as const,
      email: 'team@worksuite.biz',
      joiningDate: '2025-01-01',
      salary: 5000
    };
  };

  // Helper: Get avatar safely for names
  const getAvatarForName = (name: string) => {
    return getEmployeeByName(name).avatar;
  };

  // Submits
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empEmail) return;
    onAddEmployee({
      name: empName,
      email: empEmail,
      designation: empDesignation,
      department: empDepartment,
      salary: Number(empSalary) || 5000,
    });
    setEmpName('');
    setEmpEmail('');
    setEmpSalary(6000);
    setShowEmpModal(false);
  };

  const handleEditEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee && onUpdateEmployee) {
      onUpdateEmployee(editingEmployee);
      setEditingEmployee(null);
    }
  };

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveEmployeeId || !leaveReason) return;
    
    const targetEmp = employees.find(e => e.id === leaveEmployeeId);
    if (!targetEmp) return;

    if (onApplyLeave) {
      onApplyLeave({
        employeeId: targetEmp.id,
        employeeName: targetEmp.name,
        leaveType,
        startDate: leaveStart,
        endDate: leaveEnd,
        reason: leaveReason
      });
    }
    setLeaveReason('');
    setShowLeaveModal(false);
  };

  const handleAddAppreciation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apprMsg) return;
    const newAppr = {
      id: `ap-${Date.now()}`,
      sender: apprFrom,
      receiver: apprTo,
      badge: apprBadge,
      content: apprMsg,
      likes: 0,
      date: new Date().toISOString().split('T')[0],
      color: apprColor
    };
    setAppreciations([newAppr, ...appreciations]);
    setApprMsg('');
    setShowApprModal(false);
  };

  const handleAddDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;
    setDepartments([...departments, { name: newDeptName, leadName: newDeptLead }]);
    setNewDeptName('');
    setShowDeptModal(false);
  };

  const handleAddDesigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesigTitle) return;
    setDesignations([...designations, { title: newDesigTitle, department: newDesigDept }]);
    setNewDesigTitle('');
    setShowDesigModal(false);
  };

  const handleAddHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolName) return;
    const newHoliday = {
      id: `hol-${Date.now()}`,
      name: newHolName,
      date: newHolDate,
      type: newHolType
    };
    setHolidays([...holidays, newHoliday]);
    setNewHolName('');
    setShowHolidayModal(false);
  };

  const handleAddShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmp = employees.find(emp => emp.id === shiftEmployeeId);
    if (!targetEmp) return;
    
    const timings = shiftName === 'Day Shift' ? '09:00 - 18:00' :
                    shiftName === 'Evening Shift' ? '14:00 - 23:00' :
                    shiftName === 'Night Shift' ? '22:00 - 06:00' : 'Flexible Hours';
    const color = shiftName === 'Day Shift' ? 'indigo' :
                  shiftName === 'Evening Shift' ? 'amber' :
                  shiftName === 'Night Shift' ? 'rose' : 'emerald';

    setRoster(prev => {
      const exists = prev.some(r => r.employeeId === targetEmp.id);
      if (exists) {
        return prev.map(r => r.employeeId === targetEmp.id ? { ...r, shiftName, timings, color } : r);
      } else {
        return [...prev, { employeeId: targetEmp.id, employeeName: targetEmp.name, shiftName, timings, color }];
      }
    });
    setShowShiftModal(false);
  };

  const handleLogAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inHour = parseInt(attClockIn.split(':')[0]) || 9;
    const outHour = parseInt(attClockOut.split(':')[0]) || 18;
    const totalHours = Math.max(1, outHour - inHour + (outHour < inHour ? 24 : 0));

    const newLog = {
      id: `att-${Date.now()}`,
      employeeName: attEmployeeName,
      date: attDate,
      clockIn: attClockIn,
      clockOut: attClockOut,
      hours: totalHours,
      status: attStatus,
      ip: '192.168.1.' + Math.floor(Math.random() * 254 + 1),
      device: 'Simulator Port'
    };
    setAttendanceLogs([newLog, ...attendanceLogs]);
    setShowAttendanceModal(false);
  };

  const likeAppreciation = (id: string) => {
    setAppreciations(prev => prev.map(ap => ap.id === id ? { ...ap, likes: ap.likes + 1 } : ap));
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to remove this employee from the corporate records? This action is irreversible.")) {
      if (onDeleteEmployee) {
        onDeleteEmployee(id);
      }
    }
  };

  // Filter Logic for Employee Database
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDept === 'All' || emp.department === filterDept;
    const matchesDesig = filterDesig === 'All' || emp.designation === filterDesig;
    const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;

    return matchesSearch && matchesDept && matchesDesig && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. COMPREHENSIVE PANEL HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-950 tracking-tight capitalize">
                {subTab === 'employees' ? 'Staff Directory' :
                 subTab === 'leaves' ? 'Leaves Registry' :
                 subTab === 'shift-roster' ? 'Shift Roster' :
                 subTab === 'attendance' ? 'Attendance Records' :
                 subTab === 'designations' ? 'Job Designations' :
                 subTab === 'departments' ? 'Departments Structure' :
                 subTab === 'holidays' ? 'Corporate Holiday Calendar' : 'Appreciation Wall'}
              </h2>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                HR Core
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {subTab === 'employees' ? 'Manage and update team listings, corporate salaries, and live attendance states.' :
               subTab === 'leaves' ? 'Administer time-off records, review pending absence requests, and monitor leave balances.' :
               subTab === 'shift-roster' ? 'Configure shift allocations, manage weekly employee schedules, and track rosters.' :
               subTab === 'attendance' ? 'View live clock-in history, daily active duty states, and monitor punctuality logs.' :
               subTab === 'designations' ? 'Review active corporate titles and job positions dynamically tied to active staff.' :
               subTab === 'departments' ? 'Explore org units, view assigned leads, and track cumulative department budgets.' :
               subTab === 'holidays' ? 'Configure non-working federal, company-wide rest, and paid public holiday slots.' : 
               'Foster a recognition culture. Post praises, issue performance badges, and praise team achievements.'}
            </p>
          </div>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="flex gap-2.5 w-full md:w-auto self-stretch md:self-auto justify-end">
          {subTab === 'employees' && (
            <button
              id="hr-add-employee-btn"
              onClick={() => setShowEmpModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          )}

          {subTab === 'leaves' && (
            <button
              id="hr-apply-leave-btn"
              onClick={() => {
                if (employees.length > 0) {
                  setLeaveEmployeeId(employees[0].id);
                  setShowLeaveModal(true);
                } else {
                  alert("Please add at least one employee before logging a leave request.");
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <CalendarPlus className="h-4 w-4" />
              <span>Request Leave</span>
            </button>
          )}

          {subTab === 'shift-roster' && (
            <button
              id="hr-assign-shift-btn"
              onClick={() => {
                if (employees.length > 0) {
                  setShiftEmployeeId(employees[0].id);
                  setShowShiftModal(true);
                } else {
                  alert("Please add at least one employee before configuring shift roster.");
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <Clock className="h-4 w-4" />
              <span>Assign Shift</span>
            </button>
          )}

          {subTab === 'attendance' && (
            <button
              id="hr-log-attendance-btn"
              onClick={() => {
                if (employees.length > 0) {
                  setAttEmployeeName(employees[0].name);
                  setShowAttendanceModal(true);
                } else {
                  alert("Please add at least one employee before logging attendance.");
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <UserCheck className="h-4 w-4" />
              <span>Log Daily Attendance</span>
            </button>
          )}

          {subTab === 'appreciations' && (
            <button
              id="hr-add-appreciation-btn"
              onClick={() => {
                if (employees.length > 0) {
                  setApprFrom(employees[0].name);
                  setApprTo(employees[1]?.name || employees[0].name);
                  setShowApprModal(true);
                } else {
                  alert("You need active employees to record praises.");
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <Smile className="h-4 w-4" />
              <span>Praise Colleague</span>
            </button>
          )}

          {subTab === 'departments' && (
            <button
              id="hr-add-dept-btn"
              onClick={() => setShowDeptModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>New Department</span>
            </button>
          )}

          {subTab === 'designations' && (
            <button
              id="hr-add-desig-btn"
              onClick={() => setShowDesigModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>New Designation</span>
            </button>
          )}

          {subTab === 'holidays' && (
            <button
              id="hr-add-holiday-btn"
              onClick={() => setShowHolidayModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Holiday</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          SUB-TAB 1: STAFF DIRECTORY (EMPLOYEES)
          ========================================================= */}
      {subTab === 'employees' && (
        <div className="space-y-6">
          {/* Executive Analytics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Staff</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{employees.length}</h3>
              </div>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Present</span>
                <h3 className="text-xl font-black text-emerald-700 mt-0.5">
                  {employees.filter(e => e.status === 'Present').length}
                </h3>
              </div>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">On Leave</span>
                <h3 className="text-xl font-black text-amber-700 mt-0.5">
                  {employees.filter(e => e.status === 'On Leave').length}
                </h3>
              </div>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Late Arrivals</span>
                <h3 className="text-xl font-black text-sky-700 mt-0.5">
                  {employees.filter(e => e.status === 'Late').length}
                </h3>
              </div>
            </div>
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 md:col-span-1 flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Absent</span>
                <h3 className="text-xl font-black text-rose-700 mt-0.5">
                  {employees.filter(e => e.status === 'Absent').length}
                </h3>
              </div>
            </div>
          </div>

          {/* Interactive Filtering and Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search database by name, email, designation..."
                className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-2 md:flex items-center gap-2 text-xs">
              {/* Department Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 hidden md:inline ml-1 font-semibold">Dept:</span>
                <select
                  className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-1"
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  {departments.map((d, i) => (
                    <option key={i} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Designation Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 hidden md:inline ml-1 font-semibold">Role:</span>
                <select
                  className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-1"
                  value={filterDesig}
                  onChange={(e) => setFilterDesig(e.target.value)}
                >
                  <option value="All">All Designations</option>
                  {designations.map((d, i) => (
                    <option key={i} value={d.title}>{d.title}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 hidden md:inline ml-1 font-semibold">Duty:</span>
                <select
                  className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-1"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Late">Late</option>
                </select>
              </div>

              {/* Grid vs List Toggle */}
              <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50 self-stretch justify-center">
                <button
                  id="hr-view-grid-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                  title="Card Grid View"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  id="hr-view-list-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                  title="Compact List Table"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Core Employee List/Grid Views */}
          {filteredEmployees.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No matching employees found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Try relaxing your search terms or adjusting the filters for department and duty status.</p>
              <button
                onClick={() => { setSearchTerm(''); setFilterDept('All'); setFilterDesig('All'); setFilterStatus('All'); }}
                className="text-indigo-600 text-xs font-bold hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Card Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map(emp => (
                <div 
                  key={emp.id} 
                  className="bg-white rounded-2xl border border-slate-200/85 hover:border-indigo-400/80 hover:shadow-md transition-all duration-250 p-6 flex flex-col justify-between group relative"
                >
                  {/* Floating Action Dots */}
                  <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      id={`edit-emp-${emp.id}`}
                      onClick={() => setEditingEmployee(emp)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer bg-white shadow-2xs border border-slate-100"
                      title="Edit Profile"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      id={`delete-emp-${emp.id}`}
                      onClick={() => handleDeleteStaff(emp.id)}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer bg-white shadow-2xs border border-slate-100"
                      title="Remove Employee"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-100 shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="text-sm font-black text-slate-900 truncate hover:text-indigo-600 text-left block w-full cursor-pointer"
                        >
                          {emp.name}
                        </button>
                        <p className="text-xs text-indigo-600 font-bold truncate mt-0.5">{emp.designation}</p>
                        <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-md mt-1">
                          {emp.department}
                        </span>
                      </div>
                    </div>

                    {/* Meta stats block */}
                    <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Corporate Email:</span>
                        <span className="font-semibold text-slate-800 font-mono text-[11px] truncate max-w-[150px]" title={emp.email}>
                          {emp.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Contract Wage:</span>
                        <span className="font-bold text-slate-950">${emp.salary.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Joining Date:</span>
                        <span className="font-medium text-slate-500 font-mono text-[11px]">{emp.joiningDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer status bar */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4 text-[11px] font-bold">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Duty Status</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                      emp.status === 'Present' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15' :
                      emp.status === 'Absent' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/15' :
                      emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/15' :
                      'bg-sky-50 text-sky-700 ring-1 ring-sky-600/15'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        emp.status === 'Present' ? 'bg-emerald-500' :
                        emp.status === 'Absent' ? 'bg-rose-500' :
                        emp.status === 'On Leave' ? 'bg-amber-500' : 'bg-sky-500'
                      }`} />
                      {emp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Compact List View (Table) */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/85 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Department & Role</th>
                      <th className="px-6 py-4">Salary Tariff</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                    {filteredEmployees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                            />
                            <div>
                              <button
                                onClick={() => setSelectedEmployee(emp)}
                                className="font-bold text-slate-900 hover:text-indigo-600 text-left block cursor-pointer"
                              >
                                {emp.name}
                              </button>
                              <span className="text-[10px] text-slate-400 font-mono">{emp.id} • {emp.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="font-bold text-slate-800">{emp.designation}</div>
                          <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5">
                            {emp.department}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-bold text-slate-900 font-mono">
                          ${emp.salary.toLocaleString()}/mo
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-500">
                          {emp.joiningDate}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            emp.status === 'Present' ? 'bg-emerald-50 text-emerald-700' :
                            emp.status === 'Absent' ? 'bg-rose-50 text-rose-700' :
                            emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              emp.status === 'Present' ? 'bg-emerald-500' :
                              emp.status === 'Absent' ? 'bg-rose-500' :
                              emp.status === 'On Leave' ? 'bg-amber-500' : 'bg-sky-500'
                            }`} />
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              id={`list-edit-${emp.id}`}
                              onClick={() => setEditingEmployee(emp)}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              id={`list-delete-${emp.id}`}
                              onClick={() => handleDeleteStaff(emp.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
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
      )}

      {/* =========================================================
          SUB-TAB 2: LEAVES REGISTRY (LEAVES)
          ========================================================= */}
      {subTab === 'leaves' && (
        <div className="space-y-6 animate-fade-in">
          {/* Leaves Analytics Strips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Filed Requests</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{leaves.length} Applications</h3>
              <p className="text-[10px] text-indigo-600 font-semibold mt-1">Overall historic metrics</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Approvals</span>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {leaves.filter(l => l.status === 'Pending').length} Pending
              </h3>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Require immediate sign-off</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Approved Offs</span>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                {leaves.filter(l => l.status === 'Approved').length} Granted
              </h3>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">Active time-off calendars</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rejected Leaves</span>
              <h3 className="text-2xl font-black text-rose-600 mt-1">
                {leaves.filter(l => l.status === 'Rejected').length} Refused
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Dismissed with comments</p>
            </div>
          </div>

          {/* Table list */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Leave Applications Registry</h4>
              <span className="text-xs text-slate-500 font-mono">Sync state: live connection</span>
            </div>
            {leaves.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic text-xs">
                No leave requests filed in this portal yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="px-6 py-3.5">Employee Name</th>
                      <th className="px-6 py-3.5">Leave Type</th>
                      <th className="px-6 py-3.5">Date Range</th>
                      <th className="px-6 py-3.5">Reason Submitted</th>
                      <th className="px-6 py-3.5">Approval Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {leaves.map(lv => {
                      const empAvatar = getAvatarForName(lv.employeeName);
                      return (
                        <tr key={lv.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={empAvatar}
                                alt={lv.employeeName}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-100"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{lv.employeeName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">ID: {lv.employeeId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold px-2.5 py-1 rounded text-[10px] ${
                              lv.leaveType === 'Sick' ? 'bg-rose-50 text-rose-700' :
                              lv.leaveType === 'Casual' ? 'bg-indigo-50 text-indigo-700' :
                              lv.leaveType === 'Maternity' ? 'bg-pink-50 text-pink-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {lv.leaveType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-mono font-medium">
                            {lv.startDate} to {lv.endDate}
                          </td>
                          <td className="px-6 py-4 italic text-slate-600 max-w-xs truncate" title={lv.reason}>
                            "{lv.reason}"
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              lv.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              lv.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {lv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {lv.status === 'Pending' ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  id={`approve-leave-yes-${lv.id}`}
                                  onClick={() => onApproveLeave(lv.id, 'Approved')}
                                  className="p-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                                  title="Approve Leave"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  id={`approve-leave-no-${lv.id}`}
                                  onClick={() => onApproveLeave(lv.id, 'Rejected')}
                                  className="p-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                                  title="Reject Leave"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Processed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 3: JOB DESIGNATIONS
          ========================================================= */}
      {subTab === 'designations' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs text-slate-500 font-medium">
            💡 <span className="font-bold text-slate-800">Dynamic Mapping Enabled:</span> Positions count and staff lists below are calculated dynamically in real-time from active directory profiles.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designations.map((desig, idx) => {
              const matchedEmployees = employees.filter(e => e.designation.toLowerCase() === desig.title.toLowerCase());
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 hover:border-indigo-400 transition-all group">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-black text-slate-900 leading-tight">{desig.title}</h4>
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full shrink-0">
                        {matchedEmployees.length} Position{matchedEmployees.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                      Org Unit: {desig.department}
                    </p>
                  </div>

                  {/* Employee avatars listing inside role */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Active Team</span>
                    {matchedEmployees.length === 0 ? (
                      <span className="text-[10px] font-semibold text-slate-400 italic">No assigned staff</span>
                    ) : (
                      <div className="flex -space-x-2 overflow-hidden">
                        {matchedEmployees.map(emp => (
                          <img
                            key={emp.id}
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
                            title={`${emp.name} - ${emp.department}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 4: DEPARTMENTS STRUCTURE
          ========================================================= */}
      {subTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {departments.map((dept, idx) => {
            const deptStaff = employees.filter(e => e.department.toLowerCase() === dept.name.toLowerCase());
            const totalDeptSalary = deptStaff.reduce((sum, current) => sum + current.salary, 0);
            const lead = getEmployeeByName(dept.leadName);

            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-400 transition-all flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-black text-slate-950 leading-tight">{dept.name}</h4>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                      {deptStaff.length} Member{deptStaff.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {/* Leader details */}
                  <div className="flex items-center gap-3 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <img
                      src={lead.avatar}
                      alt={lead.name}
                      className="w-9 h-9 rounded-lg object-cover ring-2 ring-indigo-50"
                    />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black leading-none">Dept Lead</p>
                      <h5 className="text-xs font-bold text-slate-800 mt-1">{lead.name}</h5>
                    </div>
                  </div>

                  {/* Department Salaries dynamic budget rollups! */}
                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>Monthly Payroll Cap:</span>
                    <span className="font-bold text-slate-900">${totalDeptSalary.toLocaleString()}/mo</span>
                  </div>
                </div>

                {/* Group photo pile */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Subdivision Staff</span>
                  {deptStaff.length === 0 ? (
                    <span className="text-[10px] font-semibold text-slate-400 italic">No members assigned</span>
                  ) : (
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {deptStaff.map(emp => (
                        <img
                          key={emp.id}
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-6.5 h-6.5 rounded-full border-2 border-white object-cover shadow-2xs"
                          title={emp.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================
          SUB-TAB 5: APPRECIATION WALL
          ========================================================= */}
      {subTab === 'appreciations' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appreciations.map(ap => {
              const sender = getEmployeeByName(ap.sender);
              const receiver = getEmployeeByName(ap.receiver);

              return (
                <div 
                  key={ap.id} 
                  className={`bg-white p-6 rounded-2xl border-l-4 shadow-xs space-y-4 relative transition-all duration-200 hover:shadow-md ${
                    ap.color === 'indigo' ? 'border-indigo-500 border-y border-r border-slate-200' :
                    ap.color === 'emerald' ? 'border-emerald-500 border-y border-r border-slate-200' :
                    ap.color === 'rose' ? 'border-rose-500 border-y border-r border-slate-200' :
                    'border-amber-500 border-y border-r border-slate-200'
                  }`}
                >
                  {/* Heart badge float */}
                  <div className={`absolute right-6 top-6 ${
                    ap.color === 'indigo' ? 'text-indigo-400' :
                    ap.color === 'emerald' ? 'text-emerald-400' :
                    ap.color === 'rose' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    <Heart className="h-5 w-5 fill-current opacity-30 group-hover:opacity-100" />
                  </div>

                  {/* Sender & Receiver display */}
                  <div className="flex items-center gap-4.5">
                    {/* Receiver Visual Big */}
                    <div className="relative">
                      <img
                        src={receiver.avatar}
                        alt={receiver.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-2xs"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-2xs">
                        <img
                          src={sender.avatar}
                          alt={sender.name}
                          className="w-5 h-5 rounded-full object-cover"
                          title={`Praised by ${sender.name}`}
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-black text-indigo-600 truncate">{receiver.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">from {sender.name}</span>
                      </div>
                      
                      {/* Custom Badge Pill */}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-1.5 ${
                        ap.color === 'indigo' ? 'bg-indigo-50 text-indigo-700' :
                        ap.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                        ap.color === 'rose' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        <Sparkles className="h-3 w-3" />
                        <span>{ap.badge}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content paragraph */}
                  <p className="text-xs text-slate-700 font-medium italic leading-relaxed pl-1 pt-1">
                    "{ap.content}"
                  </p>

                  {/* Likes and Date metrics */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 text-xs">
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">{ap.date}</span>
                    <button
                      id={`like-appreciation-${ap.id}`}
                      onClick={() => likeAppreciation(ap.id)}
                      className="flex items-center gap-1 text-[10px] font-black text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200/60 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      👍 <span>{ap.likes} Appreciation Likes</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 6: HOLIDAY CALENDAR
          ========================================================= */}
      {subTab === 'holidays' && (
        <div className="space-y-6 animate-fade-in">
          {/* Calendar Display Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {holidays.map((hol, idx) => {
              const holMonth = new Date(hol.date).toLocaleString('en-US', { month: 'short' });
              const holDay = new Date(hol.date).getDate();

              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-indigo-400 transition-all">
                  {/* Calendar Icon Layout */}
                  <div className="bg-indigo-650 text-white rounded-xl p-2.5 text-center shrink-0 min-w-[65px] bg-indigo-600">
                    <p className="text-[10px] font-extrabold uppercase font-mono tracking-wider">{holMonth}</p>
                    <p className="text-2xl font-black font-mono leading-none mt-1">{holDay}</p>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-900 truncate" title={hol.name}>{hol.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono font-semibold">{hol.date}</p>
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                      hol.type === 'National Holiday' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-500/10' :
                      hol.type === 'Company Holiday' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/10' :
                      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/10'
                    }`}>
                      {hol.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 7: SHIFT ROSTER
          ========================================================= */}
      {subTab === 'shift-roster' && (
        <div className="space-y-6 animate-fade-in">
          {/* Shift Analytics cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Day Shift Staff</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {roster.filter(r => r.shiftName === 'Day Shift').length} Members
              </h3>
              <p className="text-[10px] text-indigo-600 font-semibold mt-1">09:00 AM - 06:00 PM</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Evening Shift Staff</span>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {roster.filter(r => r.shiftName === 'Evening Shift').length} Members
              </h3>
              <p className="text-[10px] text-amber-600 font-semibold mt-1">02:00 PM - 11:00 PM</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Night Shift Staff</span>
              <h3 className="text-2xl font-black text-rose-600 mt-1">
                {roster.filter(r => r.shiftName === 'Night Shift').length} Members
              </h3>
              <p className="text-[10px] text-rose-600 font-semibold mt-1">10:00 PM - 06:00 AM</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Flexible Staff</span>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                {roster.filter(r => r.shiftName === 'Flexible Shift').length} Members
              </h3>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">Dynamic Scheduling</p>
            </div>
          </div>

          {/* Roster Calendar Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Weekly Corporate Shift Allocations</h4>
              <span className="text-xs text-slate-500 font-mono">Current Cycle: Mon - Fri</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Employee</th>
                    <th className="px-6 py-3.5">Assigned Shift</th>
                    <th className="px-6 py-3.5">Working Hours</th>
                    <th className="px-6 py-3.5">Mon</th>
                    <th className="px-6 py-3.5">Tue</th>
                    <th className="px-6 py-3.5">Wed</th>
                    <th className="px-6 py-3.5">Thu</th>
                    <th className="px-6 py-3.5">Fri</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {employees.map(emp => {
                    const empShift = roster.find(r => r.employeeId === emp.id) || roster.find(r => r.employeeName === emp.name) || {
                      shiftName: 'Day Shift',
                      timings: '09:00 - 18:00',
                      color: 'indigo'
                    };
                    const colorClass = empShift.color === 'indigo' ? 'indigo' :
                                       empShift.color === 'amber' ? 'amber' :
                                       empShift.color === 'rose' ? 'rose' : 'emerald';
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-100"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{emp.name}</div>
                              <div className="text-[10px] text-slate-400">{emp.designation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-${colorClass}-50 text-${colorClass}-700 border border-${colorClass}-100`}>
                            {empShift.shiftName}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500 text-[11px]">
                          {empShift.timings}
                        </td>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                          <td key={day} className="px-6 py-4">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                              colorClass === 'indigo' ? 'bg-indigo-500' :
                              colorClass === 'amber' ? 'bg-amber-500' :
                              colorClass === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'
                            }`} title={empShift.shiftName} />
                          </td>
                        ))}
                        <td className="px-6 py-4 text-right">
                          <button
                            id={`change-shift-${emp.id}`}
                            onClick={() => {
                              setShiftEmployeeId(emp.id);
                              setShiftName(empShift.shiftName);
                              setShowShiftModal(true);
                            }}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                          >
                            Modify Shift
                          </button>
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

      {/* =========================================================
          SUB-TAB 8: ATTENDANCE
          ========================================================= */}
      {subTab === 'attendance' && (
        <div className="space-y-6 animate-fade-in">
          {/* Attendance Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">On-Time Attendance</span>
                <h3 className="text-xl font-black text-emerald-700 mt-0.5">
                  {attendanceLogs.filter(l => l.status === 'On Time').length} Logged
                </h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Late Arrival Incidents</span>
                <h3 className="text-xl font-black text-amber-700 mt-0.5">
                  {attendanceLogs.filter(l => l.status === 'Late').length} Incidents
                </h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <X className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Absent Listings</span>
                <h3 className="text-xl font-black text-rose-700 mt-0.5">
                  {attendanceLogs.filter(l => l.status === 'Absent').length} Absent
                </h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Work Hours</span>
                <h3 className="text-xl font-black text-slate-700 mt-0.5">8.67 Hrs/Day</h3>
              </div>
            </div>
          </div>

          {/* Attendance Daily Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Punctuality & Clock-In Log</h4>
              <span className="text-xs text-slate-500 font-mono">Simulated Gate IP: 192.168.1.1</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Employee Name</th>
                    <th className="px-6 py-3.5">Duty Date</th>
                    <th className="px-6 py-3.5">Clock In</th>
                    <th className="px-6 py-3.5">Clock Out</th>
                    <th className="px-6 py-3.5">Total Hours</th>
                    <th className="px-6 py-3.5">Punctuality</th>
                    <th className="px-6 py-3.5">Network IP</th>
                    <th className="px-6 py-3.5">User Agent</th>
                    <th className="px-6 py-3.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {attendanceLogs.map(log => {
                    const empAvatar = getAvatarForName(log.employeeName);
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={empAvatar}
                              alt={log.employeeName}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-100"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{log.employeeName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-slate-500">
                          {log.date}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {log.clockIn}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {log.clockOut}
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold text-indigo-600">
                          {log.hours} Hours
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'On Time' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            log.status === 'Late' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                          {log.ip}
                        </td>
                        <td className="px-6 py-4 text-[10px] text-slate-400">
                          {log.device}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            id={`delete-att-log-${log.id}`}
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this log entry?")) {
                                setAttendanceLogs(attendanceLogs.filter(item => item.id !== log.id));
                              }
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {/* =========================================================
          MODALS ZONE
          ========================================================= */}

      {/* MODAL 1: ADD STAFF MEMBER */}
      {showEmpModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Add Staff Member</h3>
              <button onClick={() => setShowEmpModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Employee Full Name</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="e.g. Eldora Mann"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Work Email Address</label>
                <input
                  type="email" required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="e.g. eldora@worksuite.biz"
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Org Department</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={empDepartment}
                    onChange={(e) => setEmpDepartment(e.target.value)}
                  >
                    {departments.map((d, i) => (
                      <option key={i} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title / Role</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={empDesignation}
                    onChange={(e) => setEmpDesignation(e.target.value)}
                  >
                    {designations.map((d, i) => (
                      <option key={i} value={d.title}>{d.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Contract Salary ($)</label>
                <input
                  type="number" required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  value={empSalary}
                  onChange={(e) => setEmpSalary(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEmpModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STAFF MEMBER */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Edit Staff Profile</h3>
              <button onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleEditEmployeeSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Corporate Email</label>
                <input
                  type="email" required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={editingEmployee.department}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                  >
                    {departments.map((d, i) => (
                      <option key={i} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Role Title</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={editingEmployee.designation}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, designation: e.target.value })}
                  >
                    {designations.map((d, i) => (
                      <option key={i} value={d.title}>{d.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Wage ($)</label>
                  <input
                    type="number" required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    value={editingEmployee.salary}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Duty Status</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={editingEmployee.status}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value as any })}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Update Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW EMPLOYEE DETAILED PROFILE DRAWER */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setSelectedEmployee(null)} 
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer bg-slate-100 p-1.5 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Profile Hero section */}
            <div className="flex items-center gap-4.5 border-b border-slate-100 pb-5">
              <img
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50"
              />
              <div>
                <h3 className="text-lg font-black text-slate-950">{selectedEmployee.name}</h3>
                <p className="text-xs text-indigo-600 font-bold">{selectedEmployee.designation}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">ID Code: {selectedEmployee.id}</p>
              </div>
            </div>

            {/* Structured details blocks */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Corporate Subdivision</p>
                <p className="font-bold text-slate-800">{selectedEmployee.department}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Hired Since</p>
                <p className="font-semibold text-slate-800 font-mono">{selectedEmployee.joiningDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Corporate Email</p>
                <p className="font-semibold text-indigo-600 font-mono break-all">{selectedEmployee.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Salary Tariff</p>
                <p className="font-black text-slate-900">${selectedEmployee.salary.toLocaleString()}/month</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Shift Hours</p>
                <p className="font-medium text-slate-600">Standard Day (09:00 - 18:00)</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Duty Status</p>
                <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedEmployee.status === 'Present' ? 'bg-emerald-50 text-emerald-700' :
                  selectedEmployee.status === 'Absent' ? 'bg-rose-50 text-rose-700' :
                  selectedEmployee.status === 'On Leave' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'
                }`}>
                  {selectedEmployee.status}
                </span>
              </div>
            </div>

            {/* Performance and Hardware stats */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-slate-800">Job Performance Index</h4>
                  <div className="flex items-center gap-1 text-amber-500 mt-1">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-[11px] font-bold text-slate-700 ml-1">4.9 / 5.0 (Exceptional)</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200/60 pt-3 flex justify-between items-center text-[11px] text-slate-500 font-medium">
                <span>Company Laptop Asset:</span>
                <span className="font-bold text-slate-800 font-mono">WS-LAP-M3-0{selectedEmployee.id.slice(-1)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                <span>Calculated Sick Leaves Left:</span>
                <span className="font-bold text-slate-800">8 Days left / 15 Total</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => { setSelectedEmployee(null); setEditingEmployee(selectedEmployee); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Modify Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: REQUEST LEAVE */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Request Leave Allowance</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleApplyLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">For Employee</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  value={leaveEmployeeId}
                  onChange={(e) => setLeaveEmployeeId(e.target.value)}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                  <input
                    type="date" required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">End Date</label>
                  <input
                    type="date" required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Leave Classification</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                >
                  <option value="Casual">Casual Time Off</option>
                  <option value="Sick">Medical Leave (Sick)</option>
                  <option value="Earned">Earned Privilege Off</option>
                  <option value="Maternity">Maternity/Paternity</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Justification Reason</label>
                <textarea
                  required rows={3}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="Provide details about your absence justification..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  File Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PRAISE COLLEAGUE */}
      {showApprModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Award Colleague Recognition</h3>
              <button onClick={() => setShowApprModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddAppreciation} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sender</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                    value={apprFrom}
                    onChange={(e) => setApprFrom(e.target.value)}
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Recipient</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                    value={apprTo}
                    onChange={(e) => setApprTo(e.target.value)}
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Badge Award</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  value={apprBadge}
                  onChange={(e) => setApprBadge(e.target.value)}
                >
                  <option value="Design Mastermind">Design Mastermind</option>
                  <option value="Continuous Excellence">Continuous Excellence</option>
                  <option value="Rockstar Teamwork">Rockstar Teamwork</option>
                  <option value="Incredible Leadership">Incredible Leadership</option>
                  <option value="Bug Squashing Champion">Bug Squashing Champion</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Appreciation Theme Color</label>
                <div className="flex gap-2 pt-1">
                  {['indigo', 'emerald', 'rose', 'amber'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setApprColor(color)}
                      className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform ${
                        apprColor === color ? 'border-slate-900 scale-110' : 'border-transparent'
                      } ${
                        color === 'indigo' ? 'bg-indigo-500' :
                        color === 'emerald' ? 'bg-emerald-500' :
                        color === 'rose' ? 'bg-rose-500' : 'bg-amber-550 bg-amber-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Praise Message</label>
                <textarea
                  required rows={3}
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="Share a short note on why this employee is stellar..."
                  value={apprMsg}
                  onChange={(e) => setApprMsg(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApprModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Post to Appreciation Wall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: NEW DEPARTMENT */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Add Org Unit Department</h3>
              <button onClick={() => setShowDeptModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddDeptSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Department Name</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="e.g. Sales, DevOps, Legal"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Department Lead</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  value={newDeptLead}
                  onChange={(e) => setNewDeptLead(e.target.value)}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: NEW DESIGNATION */}
      {showDesigModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Add Corporate Designation</h3>
              <button onClick={() => setShowDesigModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddDesigSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Designation Title</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="e.g. Lead Devops Architect"
                  value={newDesigTitle}
                  onChange={(e) => setNewDesigTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Belongs to Department</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  value={newDesigDept}
                  onChange={(e) => setNewDesigDept(e.target.value)}
                >
                  {departments.map((d, i) => (
                    <option key={i} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDesigModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Create Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: NEW HOLIDAY */}
      {showHolidayModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Add Corporate Holiday</h3>
              <button onClick={() => setShowHolidayModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddHolidaySubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Holiday Label Name</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="e.g. Christmas Recess"
                  value={newHolName}
                  onChange={(e) => setNewHolName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date</label>
                  <input
                    type="date" required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={newHolDate}
                    onChange={(e) => setNewHolDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Holiday Type</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={newHolType}
                    onChange={(e) => setNewHolType(e.target.value)}
                  >
                    <option value="National Holiday">National Holiday</option>
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="Company Holiday">Company Holiday</option>
                    <option value="Federal Rest Day">Federal Rest Day</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHolidayModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: CONFIG SHIFT ROSTER */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Configure Staff Work Shift</h3>
              <button onClick={() => setShowShiftModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddShiftSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Employee</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  value={shiftEmployeeId}
                  onChange={(e) => setShiftEmployeeId(e.target.value)}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Shift Configuration</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                >
                  <option value="Day Shift">Day Shift (09:00 AM - 06:00 PM)</option>
                  <option value="Evening Shift">Evening Shift (02:00 PM - 11:00 PM)</option>
                  <option value="Night Shift">Night Shift (10:00 PM - 06:00 AM)</option>
                  <option value="Flexible Shift">Flexible Shift (Dynamic Scheduling)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowShiftModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Save Shift Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 10: LOG DAILY ATTENDANCE */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Log Daily Attendance</h3>
              <button onClick={() => setShowAttendanceModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleLogAttendanceSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Employee</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  value={attEmployeeName}
                  onChange={(e) => setAttEmployeeName(e.target.value)}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date</label>
                  <input
                    type="date" required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duty Status</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={attStatus}
                    onChange={(e) => setAttStatus(e.target.value)}
                  >
                    <option value="On Time">On Time</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Clock In Time</label>
                  <input
                    type="text" required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 08:45 AM"
                    value={attClockIn}
                    onChange={(e) => setAttClockIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Clock Out Time</label>
                  <input
                    type="text" required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 06:15 PM"
                    value={attClockOut}
                    onChange={(e) => setAttClockOut(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAttendanceModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
