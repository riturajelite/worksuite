/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INITIAL_EMPLOYEES, INITIAL_PROJECTS } from '../../types';

// Mock Employees and Projects for lookup
export const EMPLOYEES = [
  ...INITIAL_EMPLOYEES,
  { id: 'EM-06', name: 'Marcus Aurelius', email: 'marcus@worksuite.biz', designation: 'Security Architect', department: 'Engineering', status: 'Present', joiningDate: '2024-01-15', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', salary: 11000 },
  { id: 'EM-07', name: 'Augustus Caesar', email: 'augustus@worksuite.biz', designation: 'Sales Director', department: 'Sales', status: 'Present', joiningDate: '2023-10-10', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', salary: 12000 },
  { id: 'EM-08', name: 'Livia Drusilla', email: 'livia@worksuite.biz', designation: 'Marketing Lead', department: 'Marketing', status: 'Present', joiningDate: '2024-02-20', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', salary: 7500 },
  { id: 'EM-09', name: 'Tiberius Claudius', email: 'tiberius@worksuite.biz', designation: 'QA Engineer', department: 'QA', status: 'Present', joiningDate: '2025-02-01', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face', salary: 5000 },
];

export const PROJECTS = INITIAL_PROJECTS;

// 1. Task Report Data
export interface TaskReportItem {
  id: string;
  project: string;
  task: string;
  assignedTo: string;
  assignedAvatar?: string;
  startDate: string;
  dueDate: string;
  completedOn: string | null;
  status: 'Completed' | 'In Progress' | 'To Do' | 'Review' | 'On Hold';
}

export const MOCK_TASK_REPORTS: TaskReportItem[] = [
  { id: 'TSK-101', project: 'Event planning and coordination service', task: 'Source venue options in downtown area', assignedTo: 'Elena Rostova', assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', startDate: '2026-06-01', dueDate: '2026-06-15', completedOn: '2026-06-14', status: 'Completed' },
  { id: 'TSK-102', project: 'Event planning and coordination service', task: 'Catering vendor contracts final review', assignedTo: 'Zara Khan', assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', startDate: '2026-06-10', dueDate: '2026-06-25', completedOn: '2026-06-24', status: 'Completed' },
  { id: 'TSK-103', project: 'Video editing and animation service', task: 'Storyboard animation sequence for intro', assignedTo: 'James Carter', assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', startDate: '2026-06-12', dueDate: '2026-07-02', completedOn: null, status: 'In Progress' },
  { id: 'TSK-104', project: 'Video editing and animation service', task: 'Record voiceover narrator audio lines', assignedTo: 'Zara Khan', assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', startDate: '2026-06-15', dueDate: '2026-07-05', completedOn: '2026-07-04', status: 'Completed' },
  { id: 'TSK-105', project: 'Survey and data collection tool', task: 'Define survey JSON schema specification', assignedTo: 'Elena Rostova', assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', startDate: '2026-06-18', dueDate: '2026-07-10', completedOn: null, status: 'In Progress' },
  { id: 'TSK-106', project: 'Survey and data collection tool', task: 'Create feedback response summary visualizer', assignedTo: 'Daniel Park', assignedAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', startDate: '2026-06-20', dueDate: '2026-07-15', completedOn: null, status: 'Review' },
  { id: 'TSK-107', project: 'Opinion mining for social networking platforms', task: 'API connection for Twitter search feed', assignedTo: 'Marcus Aurelius', assignedAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', startDate: '2026-06-22', dueDate: '2026-07-20', completedOn: null, status: 'To Do' },
  { id: 'TSK-108', project: 'Opinion mining for social networking platforms', task: 'Train basic sentiment analyser model', assignedTo: 'Elena Rostova', assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', startDate: '2026-06-05', dueDate: '2026-06-25', completedOn: '2026-06-25', status: 'Completed' },
  { id: 'TSK-109', project: 'Event planning and coordination service', task: 'Speaker invitation email drafts dispatch', assignedTo: 'Zara Khan', assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', startDate: '2026-07-01', dueDate: '2026-07-12', completedOn: null, status: 'To Do' },
  { id: 'TSK-110', project: 'Video editing and animation service', task: 'Color grading and grading checklist review', assignedTo: 'James Carter', assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', startDate: '2026-07-02', dueDate: '2026-07-18', completedOn: null, status: 'To Do' },
  { id: 'TSK-111', project: 'Survey and data collection tool', task: 'Database tables migration for multi-choices', assignedTo: 'Tiberius Claudius', assignedAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face', startDate: '2026-07-01', dueDate: '2026-07-08', completedOn: '2026-07-06', status: 'Completed' },
  { id: 'TSK-112', project: 'Opinion mining for social networking platforms', task: 'Build admin analytics control dashboard', assignedTo: 'James Carter', assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', startDate: '2026-07-02', dueDate: '2026-07-22', completedOn: null, status: 'In Progress' },
];

// 2. Time Log Report Data
export interface TimeLogReportItem {
  id: string;
  project: string;
  task: string;
  employee: string;
  date: string;
  hours: number;
  earnings: number;
}

export const MOCK_TIME_LOGS: TimeLogReportItem[] = [
  { id: 'TL-501', project: 'Event planning and coordination service', task: 'Venue scout and review', employee: 'Elena Rostova', date: '2026-07-01', hours: 4.5, earnings: 225 },
  { id: 'TL-502', project: 'Event planning and coordination service', task: 'Draft speaker schedule', employee: 'Zara Khan', date: '2026-07-01', hours: 3.0, earnings: 120 },
  { id: 'TL-503', project: 'Video editing and animation service', task: 'Intro render and color mix', employee: 'James Carter', date: '2026-07-02', hours: 6.0, earnings: 270 },
  { id: 'TL-504', project: 'Survey and data collection tool', task: 'UI layout form fields', employee: 'Elena Rostova', date: '2026-07-02', hours: 5.5, earnings: 275 },
  { id: 'TL-505', project: 'Opinion mining for social networking platforms', task: 'Sentiment dictionary load', employee: 'Marcus Aurelius', date: '2026-07-03', hours: 8.0, earnings: 480 },
  { id: 'TL-506', project: 'Survey and data collection tool', task: 'QA feedback validation', employee: 'Daniel Park', date: '2026-07-03', hours: 4.0, earnings: 140 },
  { id: 'TL-507', project: 'Opinion mining for social networking platforms', task: 'NLP model optimization', employee: 'Elena Rostova', date: '2026-07-04', hours: 7.2, earnings: 360 },
  { id: 'TL-508', project: 'Video editing and animation service', task: 'Subtitles and rendering', employee: 'James Carter', date: '2026-07-05', hours: 2.5, earnings: 112.5 },
  { id: 'TL-509', project: 'Event planning and coordination service', task: 'Marketing materials launch', employee: 'Livia Drusilla', date: '2026-07-05', hours: 5.0, earnings: 200 },
  { id: 'TL-510', project: 'Survey and data collection tool', task: 'Write unit testing suite', employee: 'Tiberius Claudius', date: '2026-07-06', hours: 6.5, earnings: 195 },
];

// 3. Weekly Timesheet Data
export interface WeeklyTimesheetRow {
  employee: string;
  project: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  total: number;
}

export const MOCK_WEEKLY_TIMESHEET: WeeklyTimesheetRow[] = [
  { employee: 'Elena Rostova', project: 'Event planning and coordination service', monday: 4.0, tuesday: 5.0, wednesday: 0, thursday: 2.5, friday: 3.0, saturday: 0, sunday: 0, total: 14.5 },
  { employee: 'Elena Rostova', project: 'Survey and data collection tool', monday: 4.0, tuesday: 3.0, wednesday: 8.0, thursday: 5.5, friday: 5.0, saturday: 0, sunday: 0, total: 25.5 },
  { employee: 'James Carter', project: 'Video editing and animation service', monday: 6.0, tuesday: 7.0, wednesday: 6.5, thursday: 4.0, friday: 6.0, saturday: 0, sunday: 0, total: 29.5 },
  { employee: 'Daniel Park', project: 'Survey and data collection tool', monday: 3.0, tuesday: 4.5, wednesday: 4.0, thursday: 8.0, friday: 4.0, saturday: 2.0, sunday: 0, total: 25.5 },
  { employee: 'Zara Khan', project: 'Event planning and coordination service', monday: 8.0, tuesday: 8.0, wednesday: 8.0, thursday: 0, friday: 0, saturday: 0, sunday: 0, total: 24.0 },
  { employee: 'Marcus Aurelius', project: 'Opinion mining for social networking platforms', monday: 8.0, tuesday: 8.0, wednesday: 8.0, thursday: 8.0, friday: 8.0, saturday: 0, sunday: 0, total: 40.0 },
  { employee: 'Livia Drusilla', project: 'Event planning and coordination service', monday: 2.0, tuesday: 2.0, wednesday: 4.0, thursday: 4.0, friday: 4.0, saturday: 0, sunday: 0, total: 16.0 },
  { employee: 'Tiberius Claudius', project: 'Survey and data collection tool', monday: 5.0, tuesday: 6.0, wednesday: 5.5, thursday: 6.5, friday: 5.0, saturday: 0, sunday: 0, total: 28.0 }
];

// 4. Finance Report Data (Monthly Overview)
export interface FinanceSummaryItem {
  month: string;
  income: number;
  expenses: number;
  profit: number;
  tax: number;
}

export const MOCK_FINANCE_REPORT_SUMMARY: FinanceSummaryItem[] = [
  { month: 'Jan 2026', income: 42000, expenses: 18000, profit: 24000, tax: 4800 },
  { month: 'Feb 2026', income: 38000, expenses: 17500, profit: 20500, tax: 4100 },
  { month: 'Mar 2026', income: 45000, expenses: 19000, profit: 26000, tax: 5200 },
  { month: 'Apr 2026', income: 51000, expenses: 22000, profit: 29000, tax: 5800 },
  { month: 'May 2026', income: 49000, expenses: 21500, profit: 27500, tax: 5500 },
  { month: 'Jun 2026', income: 58000, expenses: 24500, profit: 33500, tax: 6700 },
  { month: 'Jul 2026', income: 64000, expenses: 26000, profit: 38000, tax: 7600 },
];

// 5. Income vs Expense Daily/Monthly comparison list
export interface IncomeExpenseItem {
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  project?: string;
  amount: number;
  paymentMethod: string;
  status: 'Approved' | 'Paid' | 'Pending';
}

export const MOCK_INCOME_EXPENSES_LIST: IncomeExpenseItem[] = [
  { date: '2026-07-01', type: 'Income', category: 'Milestone 1 Payment', project: 'Event planning and coordination service', amount: 15000, paymentMethod: 'Bank Transfer', status: 'Paid' },
  { date: '2026-07-01', type: 'Expense', category: 'Vercel Pro Hosting Annual', project: 'Survey and data collection tool', amount: 240, paymentMethod: 'Credit Card', status: 'Approved' },
  { date: '2026-07-02', type: 'Income', category: 'Consulting Retainer', amount: 4500, paymentMethod: 'Stripe', status: 'Paid' },
  { date: '2026-07-02', type: 'Expense', category: 'Office Supplies and Paper', amount: 125, paymentMethod: 'Petty Cash', status: 'Approved' },
  { date: '2026-07-03', type: 'Expense', category: 'Herman Miller Office Chair', amount: 899, paymentMethod: 'Credit Card', status: 'Approved' },
  { date: '2026-07-03', type: 'Income', category: 'Project Kickoff Phase 1', project: 'Video editing and animation service', amount: 8000, paymentMethod: 'ACH', status: 'Paid' },
  { date: '2026-07-04', type: 'Expense', category: 'Gemini Advance Team API Credits', project: 'Opinion mining for social networking platforms', amount: 450, paymentMethod: 'Google Pay', status: 'Pending' },
  { date: '2026-07-04', type: 'Income', category: 'API Integration Complete', project: 'Survey and data collection tool', amount: 12500, paymentMethod: 'Bank Transfer', status: 'Paid' },
  { date: '2026-07-05', type: 'Expense', category: 'Facebook Ads Campaign', amount: 1500, paymentMethod: 'PayPal', status: 'Approved' },
  { date: '2026-07-05', type: 'Income', category: 'Design Slices Delivery', project: 'Video editing and animation service', amount: 3500, paymentMethod: 'Stripe', status: 'Paid' },
];

// 6. Leave Report Data
export interface LeaveReportItem {
  employee: string;
  department: string;
  casualLeaves: number; // Max 12
  sickLeaves: number; // Max 8
  earnedLeaves: number; // Max 15
  maternityLeaves: number;
  leavesPending: number;
  leavesApproved: number;
}

export const MOCK_LEAVE_REPORT: LeaveReportItem[] = [
  { employee: 'Elena Rostova', department: 'Engineering', casualLeaves: 3, sickLeaves: 1, earnedLeaves: 5, maternityLeaves: 0, leavesPending: 0, leavesApproved: 9 },
  { employee: 'James Carter', department: 'Design', casualLeaves: 2, sickLeaves: 0, earnedLeaves: 4, maternityLeaves: 0, leavesPending: 1, leavesApproved: 6 },
  { employee: 'Aria Montgomery', department: 'Product', casualLeaves: 5, sickLeaves: 4, earnedLeaves: 8, maternityLeaves: 0, leavesPending: 0, leavesApproved: 17 },
  { employee: 'Daniel Park', department: 'QA', casualLeaves: 1, sickLeaves: 2, earnedLeaves: 0, maternityLeaves: 0, leavesPending: 2, leavesApproved: 3 },
  { employee: 'Zara Khan', department: 'HR', casualLeaves: 4, sickLeaves: 1, earnedLeaves: 6, maternityLeaves: 0, leavesPending: 0, leavesApproved: 11 },
  { employee: 'Marcus Aurelius', department: 'Engineering', casualLeaves: 0, sickLeaves: 0, earnedLeaves: 2, maternityLeaves: 0, leavesPending: 0, leavesApproved: 2 },
  { employee: 'Livia Drusilla', department: 'Marketing', casualLeaves: 2, sickLeaves: 1, earnedLeaves: 3, maternityLeaves: 0, leavesPending: 1, leavesApproved: 6 },
  { employee: 'Tiberius Claudius', department: 'QA', casualLeaves: 1, sickLeaves: 0, earnedLeaves: 1, maternityLeaves: 0, leavesPending: 0, leavesApproved: 2 },
];

// 7. Attendance Report Data
export interface AttendanceReportItem {
  employee: string;
  department: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  onLeaveDays: number;
  attendancePercentage: number;
}

export const MOCK_ATTENDANCE_REPORT: AttendanceReportItem[] = [
  { employee: 'Elena Rostova', department: 'Engineering', totalDays: 30, presentDays: 28, absentDays: 0, lateDays: 1, onLeaveDays: 2, attendancePercentage: 96.7 },
  { employee: 'James Carter', department: 'Design', totalDays: 30, presentDays: 29, absentDays: 0, lateDays: 0, onLeaveDays: 1, attendancePercentage: 96.7 },
  { employee: 'Aria Montgomery', department: 'Product', totalDays: 30, presentDays: 22, absentDays: 2, lateDays: 1, onLeaveDays: 5, attendancePercentage: 76.7 },
  { employee: 'Daniel Park', department: 'QA', totalDays: 30, presentDays: 26, absentDays: 1, lateDays: 3, onLeaveDays: 0, attendancePercentage: 86.7 },
  { employee: 'Zara Khan', department: 'HR', totalDays: 30, presentDays: 28, absentDays: 0, lateDays: 1, onLeaveDays: 1, attendancePercentage: 96.7 },
  { employee: 'Marcus Aurelius', department: 'Engineering', totalDays: 30, presentDays: 30, absentDays: 0, lateDays: 0, onLeaveDays: 0, attendancePercentage: 100.0 },
  { employee: 'Livia Drusilla', department: 'Marketing', totalDays: 30, presentDays: 27, absentDays: 0, lateDays: 1, onLeaveDays: 2, attendancePercentage: 93.3 },
  { employee: 'Tiberius Claudius', department: 'QA', totalDays: 30, presentDays: 29, absentDays: 0, lateDays: 0, onLeaveDays: 1, attendancePercentage: 96.7 },
];

// 8. Expense Report Data
export interface ExpenseReportItem {
  id: string;
  item: string;
  merchant: string;
  employee: string;
  date: string;
  category: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export const MOCK_EXPENSE_REPORTS: ExpenseReportItem[] = [
  { id: 'EXP-101', item: 'Vercel Pro Hosting Annual', merchant: 'Vercel Inc.', employee: 'Elena Rostova', date: '2026-06-10', category: 'Hosting Services', amount: 240, status: 'Approved' },
  { id: 'EXP-102', item: 'Herman Miller Office Chair', merchant: 'Office Depot', employee: 'Zara Khan', date: '2026-06-18', category: 'Office Equipment', amount: 899, status: 'Approved' },
  { id: 'EXP-103', item: 'Gemini Advance Team API Credits', merchant: 'Google Cloud', employee: 'Elena Rostova', date: '2026-07-01', category: 'API Licensing', amount: 450, status: 'Pending' },
  { id: 'EXP-104', item: 'UX Research Testing Panel Pay', merchant: 'UserTesting.com', employee: 'James Carter', date: '2026-07-02', category: 'Product Research', amount: 600, status: 'Approved' },
  { id: 'EXP-105', item: 'Node Conf Keynote Ticket', merchant: 'Node Foundation', employee: 'Elena Rostova', date: '2026-07-03', category: 'Professional Development', amount: 350, status: 'Approved' },
  { id: 'EXP-106', item: 'Marketing Press Release Wire', merchant: 'PR Newswire', employee: 'Livia Drusilla', date: '2026-07-04', category: 'Public Relations', amount: 1200, status: 'Approved' },
  { id: 'EXP-107', item: 'Mobile Phone Service Allowance', merchant: 'Verizon Wireless', employee: 'Marcus Aurelius', date: '2026-07-04', category: 'Telecommunications', amount: 80, status: 'Approved' },
  { id: 'EXP-108', item: 'JetBrains IDE Annual Renewal', merchant: 'JetBrains s.r.o.', employee: 'Tiberius Claudius', date: '2026-07-05', category: 'Software Subscriptions', amount: 249, status: 'Approved' },
  { id: 'EXP-109', item: 'Team Dinner after Q2 Release', merchant: 'The Bistro Downtown', employee: 'Aria Montgomery', date: '2026-07-05', category: 'Team Entertaining', amount: 540, status: 'Approved' },
  { id: 'EXP-110', item: 'Coffee Beans Restock Pack x4', merchant: 'Blue Bottle Coffee', employee: 'Zara Khan', date: '2026-07-06', category: 'Office Supplies', amount: 72, status: 'Pending' }
];

// 9. Deal Report Data
export interface DealReportItem {
  id: string;
  title: string;
  leadName: string;
  company: string;
  value: number;
  stage: 'Lead' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  closeDate: string;
  owner: string;
}

export const MOCK_DEAL_REPORTS: DealReportItem[] = [
  { id: 'DEAL-901', title: 'Enterprise Cloud Server Setup', leadName: 'Stephen Rogahn', company: 'Barrows, Schoen and Corkery', value: 45000, stage: 'Proposal', closeDate: '2026-08-15', owner: 'Augustus Caesar' },
  { id: 'DEAL-902', title: 'HR Platform Multi-tenant License', leadName: 'Damon Haley', company: 'Renner, Johnson and Adams', value: 28000, stage: 'Negotiation', closeDate: '2026-08-01', owner: 'Augustus Caesar' },
  { id: 'DEAL-903', title: 'SaaS Design Overhaul Contract', leadName: 'Miss Myra Bauch', company: 'Hintz, Weimann and Dietrich', value: 17500, stage: 'Won', closeDate: '2026-07-05', owner: 'Zara Khan' },
  { id: 'DEAL-904', title: 'Survey App Custom API Addon', leadName: 'Elias Hauck', company: 'Witting Group', value: 12000, stage: 'Lost', closeDate: '2026-07-03', owner: 'Augustus Caesar' },
  { id: 'DEAL-905', title: 'Biometric Integration Support Package', leadName: 'Delphia Cormier', company: 'Hyatt Inc', value: 9500, stage: 'Won', closeDate: '2026-07-04', owner: 'Zara Khan' },
  { id: 'DEAL-906', title: 'Full Suite Migration Service Bundle', leadName: 'Ms. Ashly Klocko', company: 'Vandervort Ltd', value: 65000, stage: 'Contacted', closeDate: '2026-09-10', owner: 'Augustus Caesar' },
  { id: 'DEAL-907', title: 'White-label Mobile App Core Build', leadName: 'Pascale O\'Conner', company: 'Pacocha-Ritchie', value: 38000, stage: 'Proposal', closeDate: '2026-08-20', owner: 'Zara Khan' }
];

// 10. Sales Report Data
export interface SalesReportItem {
  invoiceId: string;
  invoiceNumber: string;
  client: string;
  project: string;
  date: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export const MOCK_SALES_REPORTS: SalesReportItem[] = [
  { invoiceId: 'INV-801', invoiceNumber: 'INV-2026-001', client: 'Wayne Enterprises', project: 'SaaS Platform Redesign', date: '2026-06-15', subtotal: 21000, discount: 500, tax: 2500, total: 23000, status: 'Paid' },
  { invoiceId: 'INV-802', invoiceNumber: 'INV-2026-002', client: 'Cyberdyne Systems', project: 'Cyberdyne Portal V2', date: '2026-06-28', subtotal: 11500, discount: 0, tax: 1000, total: 12500, status: 'Unpaid' },
  { invoiceId: 'INV-803', invoiceNumber: 'INV-2026-003', client: 'Miller Enterprises', project: 'E-commerce Checkout Optimization', date: '2026-05-10', subtotal: 16500, discount: 300, tax: 1800, total: 18000, status: 'Paid' },
  { invoiceId: 'INV-804', invoiceNumber: 'INV-2026-004', client: 'Wayne Enterprises', project: 'SaaS Platform Redesign', date: '2026-07-01', subtotal: 20000, discount: 0, tax: 2000, total: 22000, status: 'Paid' },
  { invoiceId: 'INV-805', invoiceNumber: 'INV-2026-005', client: 'Armstrong PLC', project: 'Event planning and coordination service', date: '2026-07-02', subtotal: 14000, discount: 200, tax: 1200, total: 15000, status: 'Paid' },
  { invoiceId: 'INV-806', invoiceNumber: 'INV-2026-006', client: 'Kling Group', project: 'Video editing and animation service', date: '2026-07-03', subtotal: 7500, discount: 100, tax: 600, total: 8000, status: 'Paid' },
  { invoiceId: 'INV-807', invoiceNumber: 'INV-2026-007', client: 'Barrows, Schoen and Corkery', project: 'Survey and data collection tool', date: '2026-07-04', subtotal: 11500, discount: 0, tax: 1000, total: 12500, status: 'Paid' },
];
