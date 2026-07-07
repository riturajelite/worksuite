/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Define standard types for our SaaS Worksuite Application

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Won' | 'Lost';
  value: number;
  createdDate: string;
}

export interface Deal {
  id: string;
  title: string;
  leadId: string;
  value: number;
  stage: 'Lead' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  closeDate: string;
  owner: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'Active' | 'Inactive';
  projectsCount: number;
  totalBilled: number;
  mobile?: string;
  category?: string;
  subCategory?: string;
  createdDate?: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  status: 'Present' | 'Absent' | 'On Leave' | 'Late';
  joiningDate: string;
  avatar: string;
  salary: number;
}

export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Casual' | 'Sick' | 'Earned' | 'Maternity';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shiftType: 'Day Shift (09:00 - 18:00)' | 'Night Shift (21:00 - 06:00)' | 'Evening Shift (14:00 - 22:00)';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: 'On Time' | 'Late' | 'Half Day' | 'Absent';
  device: string;
}

export interface OvertimeRequest {
  id: string;
  employeeName: string;
  date: string;
  hours: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: 'In Progress' | 'Not Started' | 'Finished' | 'On Hold';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  progress: number; // 0 to 100
  members: string[];
  code?: string;
  clientCompany?: string;
  clientAvatar?: string;
}

export interface Task {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  assignedTo: string;
  assignedAvatar?: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
}

export interface TimeLog {
  id: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string | null;
  durationHours: number; // calculated
  isTracking: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  amount: number;
  issuedDate: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Draft';
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  clientName: string;
  amount: number;
  validTill: string;
  status: 'Accepted' | 'Pending' | 'Declined';
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  leadName: string;
  amount: number;
  date: string;
  status: 'Accepted' | 'Waiting' | 'Declined';
}

export interface Expense {
  id: string;
  itemName: string;
  purchaseFrom: string;
  amount: number;
  purchaseDate: string;
  employeeName: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Ticket {
  id: string;
  subject: string;
  raisedBy: string;
  assignedTo: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdDate: string;
}

export interface Asset {
  id: string;
  name: string;
  code: string;
  type: 'Hardware' | 'Software' | 'Office Supply' | 'Other';
  status: 'Active' | 'Under Repair' | 'Damaged' | 'Lost';
  assignedTo: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  department: string;
}

export interface Server {
  id: string;
  name: string;
  ip: string;
  provider: string;
  hostingType: string;
  domain: string;
  status: 'Active' | 'Offline' | 'Restarting';
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  event: string;
  status: 'Active' | 'Inactive';
}

export interface WebhookLog {
  id: string;
  webhookName: string;
  event: string;
  timestamp: string;
  responseCode: number;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  openings: number;
  status: 'Active' | 'Closed';
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  candidateName: string;
  email: string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Offered' | 'Rejected';
  appliedDate: string;
}

export interface InterviewSchedule {
  id: string;
  candidateName: string;
  jobTitle: string;
  date: string;
  time: string;
  interviewer: string;
}

// Initial High-Quality Mock Data
export const INITIAL_LEADS: Lead[] = [
  { id: '11', name: 'Ms. Ashly Klocko', company: 'Vandervort Ltd', email: 'fake@example.com', phone: '+1 555-0111', status: 'New', value: 15000, createdDate: '04-07-2026' },
  { id: '10', name: 'Dr. Kaleigh Schmeler Jr.', company: 'Mraz Ltd', email: 'fake@example.com', phone: '+1-458-685-4940', status: 'Contacted', value: 13431, createdDate: '04-07-2026' },
  { id: '9', name: 'Miss Myra Bauch', company: 'Hintz, Weimann and Dietrich', email: 'fake@example.com', phone: '+1 555-0109', status: 'New', value: 20000, createdDate: '04-07-2026' },
  { id: '8', name: 'Hal Bechtelar', company: 'Cummings Ltd', email: 'fake@example.com', phone: '+1 555-0108', status: 'New', value: 12000, createdDate: '04-07-2026' },
  { id: '7', name: 'Pascale O\'Conner', company: 'Pacocha-Ritchie', email: 'fake@example.com', phone: '+1-507-701-5835', status: 'Proposal Sent', value: 17017, createdDate: '04-07-2026' },
  { id: '6', name: 'Liliana Dickinson DDS', company: 'Bergstrom-Carroll', email: 'fake@example.com', phone: '+1 555-0106', status: 'New', value: 30174, createdDate: '04-07-2026' },
  { id: '5', name: 'Franz Conroy', company: 'Hahn, Upton and Nicolas', email: 'fake@example.com', phone: '+1 555-0105', status: 'New', value: 8000, createdDate: '04-07-2026' },
  { id: '4', name: 'Kristin Hirthe', company: 'Gleichner, Johnson and Ruecker', email: 'fake@example.com', phone: '+1 555-0104', status: 'New', value: 18000, createdDate: '04-07-2026' },
  { id: '3', name: 'Elias Hauck', company: 'Witting Group', email: 'fake@example.com', phone: '+15012148979', status: 'Lost', value: 93763, createdDate: '04-07-2026' },
  { id: '2', name: 'Delphia Cormier', company: 'Hyatt Inc', email: 'fake@example.com', phone: '+19804255669', status: 'Won', value: 64890, createdDate: '04-07-2026' }
];

export const INITIAL_CLIENTS: Client[] = [
  { id: '9', name: 'Magdalena Morissette', company: 'Armstrong PLC', email: 'anika.kub@example.org4', status: 'Active', projectsCount: 2, totalBilled: 34000, mobile: '--', category: '--', createdDate: '04-07-2026', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { id: '8', name: 'Mr. Richmond Schmeler', company: 'Kling Group', email: 'lonzo57@example.net7', status: 'Active', projectsCount: 1, totalBilled: 12500, mobile: '--', category: '--', createdDate: '04-07-2026', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: '7', name: 'Stephen Rogahn', company: 'Barrows, Schoen and Corkery', email: 'maudie.ullrich@example.net8', status: 'Active', projectsCount: 3, totalBilled: 89000, mobile: '--', category: '--', createdDate: '04-07-2026', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { id: '6', name: 'Adelia Konopelski', company: 'Hirthe PLC', email: 'dare.gustave@example.com5', status: 'Active', projectsCount: 0, totalBilled: 0, mobile: '--', category: '--', createdDate: '04-07-2026', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { id: '5', name: 'Dr. Gabriella Johnson', company: 'Aufderhar-Walsh', email: 'sboyle@example.org5', status: 'Active', projectsCount: 0, totalBilled: 0, mobile: '--', category: '--', createdDate: '04-07-2026', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
  { id: '4', name: 'Antonina Hodkiewicz', company: 'Weissnat Group', email: 'ibalistreri@example.org5', status: 'Active', projectsCount: 0, totalBilled: 0, mobile: '--', category: '--', createdDate: '04-07-2026', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face' },
  { id: '3', name: 'Dianna Ondrickka', company: 'Johnston, Roberts and Runolfsson', email: 'hodkiewicz.ambrose@example.com8', status: 'Active', projectsCount: 0, totalBilled: 0, mobile: '--', category: '--', createdDate: '04-07-2026', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: '2', name: 'Damon Haley', company: 'Renner, Johnson and Adams', email: 'sporer.modesto@example.org8', status: 'Active', projectsCount: 0, totalBilled: 0, mobile: '--', category: '--', createdDate: '04-07-2026', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: '1', name: 'Hazle Tillman Sr.', company: 'Kuvalis LLC', email: 'client@example.com', status: 'Active', projectsCount: 0, totalBilled: 0, mobile: '--', category: '--', createdDate: '04-07-2026', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face' }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'EM-01', name: 'Elena Rostova', email: 'elena@worksuite.biz', designation: 'Senior Developer', department: 'Engineering', status: 'Present', joiningDate: '2024-03-12', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', salary: 8500 },
  { id: 'EM-02', name: 'James Carter', email: 'james@worksuite.biz', designation: 'UI/UX Designer', department: 'Design', status: 'Present', joiningDate: '2024-06-01', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', salary: 6200 },
  { id: 'EM-03', name: 'Aria Montgomery', email: 'aria@worksuite.biz', designation: 'Product Manager', department: 'Product', status: 'On Leave', joiningDate: '2023-11-15', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', salary: 9200 },
  { id: 'EM-04', name: 'Daniel Park', email: 'daniel@worksuite.biz', designation: 'QA Specialist', department: 'QA', status: 'Late', joiningDate: '2025-01-10', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', salary: 4800 },
  { id: 'EM-05', name: 'Zara Khan', email: 'zara@worksuite.biz', designation: 'HR Lead', department: 'HR', status: 'Present', joiningDate: '2023-05-20', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', salary: 5500 },
];

export const INITIAL_PROJECTS: Project[] = [
  { 
    id: 'PR-301', 
    code: 'EPA',
    name: 'Event planning and coordination service', 
    clientId: 'CL-203', 
    clientName: 'Miss Sienna Miller', 
    clientCompany: 'Stroman LLC',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    status: 'In Progress', 
    budget: 45000, 
    spent: 23000, 
    startDate: '2026-05-05', 
    endDate: '2026-09-05', 
    progress: 95, 
    members: ['Elena Rostova', 'James Carter', 'Aria Montgomery', 'Daniel Park'] 
  },
  { 
    id: 'PR-302', 
    code: 'VEA',
    name: 'Video editing and animation service', 
    clientId: 'CL-202', 
    clientName: 'Miss Sienna Miller', 
    clientCompany: 'Stroman LLC',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    status: 'In Progress', 
    budget: 25000, 
    spent: 12500, 
    startDate: '2026-05-04', 
    endDate: '2026-08-05', 
    progress: 72, 
    members: ['Daniel Park', 'Elena Rostova', 'James Carter', 'Zara Khan'] 
  },
  { 
    id: 'PR-303', 
    code: 'SAD',
    name: 'Survey and data collection tool', 
    clientId: 'CL-201', 
    clientName: 'Miss Sienna Miller', 
    clientCompany: 'Stroman LLC',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    status: 'In Progress', 
    budget: 18000, 
    spent: 17500, 
    startDate: '2026-05-04', 
    endDate: '2026-08-05', 
    progress: 59, 
    members: ['Aria Montgomery', 'Elena Rostova', 'Zara Khan', 'James Carter'] 
  },
  { 
    id: 'PR-304', 
    code: 'OMF',
    name: 'Opinion mining for social networking platforms', 
    clientId: 'CL-204', 
    clientName: 'Mrs. Justina Larson I', 
    clientCompany: "O'Connell, Gleichner and...",
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    status: 'In Progress', 
    budget: 32000, 
    spent: 13000, 
    startDate: '2026-05-01', 
    endDate: '2026-05-05', 
    progress: 40, 
    members: ['Zara Khan', 'Daniel Park', 'Elena Rostova', 'James Carter'] 
  }
];

export const INITIAL_TASKS: Task[] = [
  { id: 'TSK-401', projectId: 'PR-301', projectName: 'SaaS Platform Redesign', title: 'Design system tokens mapping', assignedTo: 'James Carter', assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', dueDate: '2026-07-10', priority: 'High', status: 'In Progress' },
  { id: 'TSK-402', projectId: 'PR-301', projectName: 'SaaS Platform Redesign', title: 'Set up Vite + Tailwind 4', assignedTo: 'Elena Rostova', assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', dueDate: '2026-07-05', priority: 'High', status: 'Completed' },
  { id: 'TSK-403', projectId: 'PR-301', projectName: 'SaaS Platform Redesign', title: 'Connect Gemini client integrations', assignedTo: 'Elena Rostova', assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', dueDate: '2026-07-25', priority: 'Medium', status: 'To Do' },
  { id: 'TSK-404', projectId: 'PR-302', projectName: 'Cyberdyne Portal V2', title: 'QA regression for database API', assignedTo: 'Daniel Park', assignedAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', dueDate: '2026-07-12', priority: 'Medium', status: 'Review' },
  { id: 'TSK-405', projectId: 'PR-302', projectName: 'Cyberdyne Portal V2', title: 'Implement biometric data logs', assignedTo: 'Elena Rostova', assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', dueDate: '2026-07-20', priority: 'High', status: 'To Do' },
];

export const INITIAL_LEAVES: Leave[] = [
  { id: 'LV-501', employeeId: 'EM-03', employeeName: 'Aria Montgomery', leaveType: 'Casual', startDate: '2026-07-02', endDate: '2026-07-05', status: 'Approved', reason: 'Family trip' },
  { id: 'LV-502', employeeId: 'EM-04', employeeName: 'Daniel Park', leaveType: 'Sick', startDate: '2026-07-04', endDate: '2026-07-04', status: 'Pending', reason: 'Dental appointment' },
];

export const INITIAL_SHIFTS: Shift[] = [
  { id: 'SH-601', employeeId: 'EM-01', employeeName: 'Elena Rostova', date: '2026-07-03', shiftType: 'Day Shift (09:00 - 18:00)' },
  { id: 'SH-602', employeeId: 'EM-02', employeeName: 'James Carter', date: '2026-07-03', shiftType: 'Day Shift (09:00 - 18:00)' },
  { id: 'SH-603', employeeId: 'EM-04', employeeName: 'Daniel Park', date: '2026-07-03', shiftType: 'Evening Shift (14:00 - 22:00)' },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'AT-701', employeeId: 'EM-01', employeeName: 'Elena Rostova', date: '2026-07-03', clockIn: '08:55 AM', clockOut: null, status: 'On Time', device: 'Main Biometric Port 1' },
  { id: 'AT-702', employeeId: 'EM-02', employeeName: 'James Carter', date: '2026-07-03', clockIn: '08:58 AM', clockOut: null, status: 'On Time', device: 'Main Biometric Port 1' },
  { id: 'AT-703', employeeId: 'EM-04', employeeName: 'Daniel Park', date: '2026-07-03', clockIn: '09:12 AM', clockOut: null, status: 'Late', device: 'Secondary Lobby Port' },
];

export const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-801', invoiceNumber: 'INV-2026-001', clientName: 'Wayne Enterprises', projectName: 'SaaS Platform Redesign', amount: 23000, issuedDate: '2026-06-15', dueDate: '2026-07-15', status: 'Paid' },
  { id: 'INV-802', invoiceNumber: 'INV-2026-002', clientName: 'Cyberdyne Systems', projectName: 'Cyberdyne Portal V2', amount: 12500, issuedDate: '2026-06-28', dueDate: '2026-07-28', status: 'Unpaid' },
  { id: 'INV-803', invoiceNumber: 'INV-2026-003', clientName: 'Miller Enterprises', projectName: 'E-commerce Checkout Optimization', amount: 18000, issuedDate: '2026-05-10', dueDate: '2026-06-10', status: 'Paid' },
  { id: 'INV-804', invoiceNumber: 'INV-2026-004', clientName: 'Wayne Enterprises', projectName: 'SaaS Platform Redesign', amount: 22000, issuedDate: '2026-07-01', dueDate: '2026-08-01', status: 'Draft' },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'EXP-901', itemName: 'Vercel Pro Hosting Annual', purchaseFrom: 'Vercel Inc.', amount: 240, purchaseDate: '2026-06-10', employeeName: 'Elena Rostova', status: 'Approved' },
  { id: 'EXP-902', itemName: 'Herman Miller Office Chair', purchaseFrom: 'Office Depot', amount: 899, purchaseDate: '2026-06-18', employeeName: 'Zara Khan', status: 'Approved' },
  { id: 'EXP-903', itemName: 'Gemini Advanced Team API Credits', purchaseFrom: 'Google Cloud', amount: 450, purchaseDate: '2026-07-01', employeeName: 'Elena Rostova', status: 'Pending' },
];

export const INITIAL_TICKETS: Ticket[] = [
  { id: 'TC-110', subject: 'LDAP integration login handshake failure', raisedBy: 'John Miller', assignedTo: 'Elena Rostova', priority: 'Urgent', status: 'Open', createdDate: '2026-07-02' },
  { id: 'TC-111', subject: 'Broken CSS alignment on invoice settings page', raisedBy: 'Zara Khan', assignedTo: 'James Carter', priority: 'Low', status: 'In Progress', createdDate: '2026-07-02' },
  { id: 'TC-112', subject: 'Biometric fingerprint scanner calibration drift', raisedBy: 'Zara Khan', assignedTo: 'Daniel Park', priority: 'Medium', status: 'Resolved', createdDate: '2026-06-29' },
];

export const INITIAL_ASSETS: Asset[] = [
  { id: 'AST-501', name: 'MacBook Pro M3 Max 16"', code: 'WS-LAP-051', type: 'Hardware', status: 'Active', assignedTo: 'Elena Rostova' },
  { id: 'AST-502', name: 'Dell UltraSharp 32" 4K Monitor', code: 'WS-MON-023', type: 'Hardware', status: 'Active', assignedTo: 'James Carter' },
  { id: 'AST-503', name: 'Figma Enterprise Workspace Seat', code: 'WS-SFT-009', type: 'Software', status: 'Active', assignedTo: 'James Carter' },
  { id: 'AST-504', name: 'Biometric Terminal G2 Pro', code: 'WS-DEV-102', type: 'Hardware', status: 'Under Repair', assignedTo: 'Unassigned' },
];

export const INITIAL_NOTICES: Notice[] = [
  { id: 'NT-301', title: 'Q3 Product Vision Roadmap Review Session', content: 'Join us on Friday at 11:00 AM for our Q3 planning session. We will cover the upcoming multi-tenant capabilities and customer integrations.', date: '2026-07-02', department: 'Product' },
  { id: 'NT-302', title: 'Biometric System Mapping Required for New Badges', content: 'All engineers and designers must complete fingerprint recalibration. Contact Daniel Park in QA to register your device token.', date: '2026-06-30', department: 'HR / IT' },
];

export const INITIAL_SERVERS: Server[] = [
  { id: 'SRV-01', name: 'Worksuite APAC Cloud Run Engine', ip: '104.198.22.8', provider: 'Google Cloud Platform', hostingType: 'Docker Container', domain: 'demo.worksuite.biz', status: 'Active' },
  { id: 'SRV-02', name: 'Wayne Corp Sandbox Integration Host', ip: '35.210.155.90', provider: 'Google Cloud Platform', hostingType: 'Compute Engine VM', domain: 'wayne-sandbox.worksuite.io', status: 'Active' },
  { id: 'SRV-03', name: 'Backup Biometric Logging Service', ip: '192.168.10.45', provider: 'AWS EC2', hostingType: 'Micro VM', domain: 'bio-backup.worksuite.net', status: 'Offline' },
];

export const INITIAL_WEBHOOKS: Webhook[] = [
  { id: 'WH-01', name: 'Slack Alerts on Paid Invoice', url: 'https://hooks.slack.com/services/T000/B000/XXXXXX', event: 'invoice.paid', status: 'Active' },
  { id: 'WH-02', name: 'Jira Sync on New Support Ticket', url: 'https://worksuite.atlassian.net/webhooks/v1/trigger', event: 'ticket.created', status: 'Active' },
];

export const INITIAL_WEBHOOK_LOGS: WebhookLog[] = [
  { id: 'WHL-901', webhookName: 'Slack Alerts on Paid Invoice', event: 'invoice.paid', timestamp: '2026-07-03 09:12:44', responseCode: 200 },
  { id: 'WHL-902', webhookName: 'Jira Sync on New Support Ticket', event: 'ticket.created', timestamp: '2026-07-02 14:22:10', responseCode: 200 },
  { id: 'WHL-903', webhookName: 'Slack Alerts on Paid Invoice', event: 'invoice.paid', timestamp: '2026-06-20 11:05:03', responseCode: 200 },
];

export const INITIAL_JOBS: Job[] = [
  { id: 'JB-01', title: 'Senior Backend Engineer (Node/TS)', department: 'Engineering', location: 'Remote / Bangalore', type: 'Full-time', openings: 2, status: 'Active' },
  { id: 'JB-02', title: 'Product Marketing Manager', department: 'Marketing', location: 'Singapore', type: 'Full-time', openings: 1, status: 'Active' },
  { id: 'JB-03', title: 'DevOps & Site Reliability Engineer', department: 'Engineering', location: 'Remote / US East', type: 'Full-time', openings: 1, status: 'Closed' },
];

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [
  { id: 'AP-501', jobTitle: 'Senior Backend Engineer (Node/TS)', candidateName: 'Michael Corleone', email: 'michael@corleone.org', status: 'Shortlisted', appliedDate: '2026-06-28' },
  { id: 'AP-502', jobTitle: 'Senior Backend Engineer (Node/TS)', candidateName: 'Harry Potter', email: 'harry@hogwarts.edu', status: 'Interview', appliedDate: '2026-06-30' },
  { id: 'AP-503', jobTitle: 'Product Marketing Manager', candidateName: 'Lois Lane', email: 'lois@dailyplanet.com', status: 'Applied', appliedDate: '2026-07-02' },
];

export const INITIAL_INTERVIEWS: InterviewSchedule[] = [
  { id: 'INT-81', candidateName: 'Harry Potter', jobTitle: 'Senior Backend Engineer (Node/TS)', date: '2026-07-05', time: '14:00', interviewer: 'Elena Rostova & Daniel Park' },
];

export interface Contract {
  id: string;
  subject: string;
  clientName: string;
  clientCompany: string;
  clientAvatar: string;
  projectName: string;
  amount: number;
  startDate: string;
  endDate: string;
  contractType: string;
  description: string;
}

export interface ContractTemplate {
  id: string;
  subject: string;
  description: string;
  contractType: string;
  amount: number;
  currency: string;
}

export const INITIAL_CONTRACTS: Contract[] = [
  { id: 'CONT#008', subject: 'King and Queen of.', clientName: 'Edyth Moore I', clientCompany: 'Ledner-Tremblay', clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', projectName: '--', amount: 848, startDate: '2026-06-28', endDate: '2026-11-05', contractType: 'Service Level Agreement', description: 'Agreement covering server level support and uptime guarantees.' },
  { id: 'CONT#007', subject: 'It was high time.', clientName: 'Lonnie Schmitt DVM', clientCompany: 'Abbott, Mante and Connelly', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', projectName: '--', amount: 773, startDate: '2026-06-13', endDate: '2026-11-05', contractType: 'NDA', description: 'Non-disclosure agreement for intellectual property protections.' },
  { id: 'CONT#006', subject: 'Dormouse went on.', clientName: 'Celia Lang', clientCompany: 'Sawayn-Lakin', clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', projectName: '--', amount: 838, startDate: '2026-06-18', endDate: '2026-11-05', contractType: 'Retainer', description: 'Design services retainer agreement.' },
  { id: 'CONT#005', subject: "Alice. 'You did,'.", clientName: "Mr. Mathias O'Kon", clientCompany: 'Jerde, Okuneva and Klein', clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', projectName: '--', amount: 129, startDate: '2026-06-21', endDate: '2026-08-05', contractType: 'Hourly Contract', description: 'Consultation contract for architectural reviews.' },
  { id: 'CONT#004', subject: 'Mock Turtle in the.', clientName: 'Lonnie Schmitt DVM', clientCompany: 'Abbott, Mante and Connelly', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', projectName: '--', amount: 534, startDate: '2026-06-18', endDate: '2026-08-05', contractType: 'Service Level Agreement', description: 'Maintenance and patching schedule support.' },
  { id: 'CONT#003', subject: 'By the time when.', clientName: 'Lonnie Schmitt DVM', clientCompany: 'Abbott, Mante and Connelly', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', projectName: '--', amount: 875, startDate: '2026-06-09', endDate: '2026-10-05', contractType: 'Retainer', description: 'Monthly digital marketing support services.' },
  { id: 'CONT#002', subject: "I hadn't begun my.", clientName: 'Celia Lang', clientCompany: 'Sawayn-Lakin', clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', projectName: '--', amount: 379, startDate: '2026-07-04', endDate: '2026-08-05', contractType: 'NDA', description: 'Mutual non-disclosure agreement before scoping.' },
  { id: 'CONT#001', subject: 'I can do without.', clientName: 'Lonnie Schmitt DVM', clientCompany: 'Abbott, Mante and Connelly', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', projectName: '--', amount: 176, startDate: '2026-06-23', endDate: '2026-10-05', contractType: 'Fixed Price', description: 'Landing page integration fixed-cost agreement.' },
];
