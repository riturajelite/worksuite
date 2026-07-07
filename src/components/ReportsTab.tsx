/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import TaskReport from './reports/TaskReport';
import TimeLogReport from './reports/TimeLogReport';
import WeeklyTimesheetReport from './reports/WeeklyTimesheetReport';
import FinanceReport from './reports/FinanceReport';
import IncomeExpenseReport from './reports/IncomeExpenseReport';
import LeaveReport from './reports/LeaveReport';
import AttendanceReport from './reports/AttendanceReport';
import ExpenseReport from './reports/ExpenseReport';
import DealReport from './reports/DealReport';
import SalesReport from './reports/SalesReport';

interface ReportsTabProps {
  subTab: string;
}

export default function ReportsTab({ subTab }: ReportsTabProps) {
  // Render sub-report component based on route subTab ID
  switch (subTab) {
    case 'report-task':
      return <TaskReport />;
    case 'report-time':
      return <TimeLogReport />;
    case 'report-weekly-timesheet':
      return <WeeklyTimesheetReport />;
    case 'report-finance':
      return <FinanceReport />;
    case 'report-income-expense':
      return <IncomeExpenseReport />;
    case 'report-leave':
      return <LeaveReport />;
    case 'report-attendance':
      return <AttendanceReport />;
    case 'report-expense':
      return <ExpenseReport />;
    case 'report-deal':
      return <DealReport />;
    case 'report-sales':
      return <SalesReport />;
    default:
      return (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <h2 className="text-sm font-bold text-slate-800">No Report Selected</h2>
          <p className="text-xs text-slate-500 mt-1">Please select an item from the Reports menu in the sidebar.</p>
        </div>
      );
  }
}
