/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, CheckSquare, Clock, TrendingUp, Plus, Search, 
  Play, Square, ChevronRight, ChevronLeft, List, CheckCircle, Circle, User, Calendar,
  FileText, Download, MoreVertical, X, Check, HelpCircle, Filter, Trash2, Edit, Layers,
  MoreHorizontal, Lock, Upload
} from 'lucide-react';
import { Project, Task, Contract, ContractTemplate, INITIAL_CONTRACTS } from '../types';

interface ProjectsTabProps {
  subTab: string;
  projects: Project[];
  tasks: Task[];
  activeTimer: { isRunning: boolean; elapsedSeconds: number; taskId: string } | null;
  onStartTimer: (taskId: string, taskTitle: string, projectName: string) => void;
  onStopTimer: () => void;
  onAddTask: (task: { projectId: string; title: string; assignedTo: string; priority: 'High' | 'Medium' | 'Low'; dueDate: string }) => void;
  onToggleTaskComplete: (taskId: string) => void;
}

export default function ProjectsTab({
  subTab,
  projects,
  tasks,
  activeTimer,
  onStartTimer,
  onStopTimer,
  onAddTask,
  onToggleTaskComplete
}: ProjectsTabProps) {
  const [showTaskModal, setShowTaskModal] = useState(false);

  // New task view, filters, search, and form state variables
  const [taskViewMode, setTaskViewMode] = useState<'list' | 'board' | 'calendar' | 'private'>('list');
  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('Hide Completed Task');
  const [taskDuration, setTaskDuration] = useState('Start Date To End Date');
  const [taskProjectFilter, setTaskProjectFilter] = useState('All');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [taskSortField, setTaskSortField] = useState<string>('code');
  const [taskSortOrder, setTaskSortOrder] = useState<'asc' | 'desc'>('asc');
  const [taskEntriesPerPage, setTaskEntriesPerPage] = useState(10);
  const [taskCurrentPage, setTaskCurrentPage] = useState(1);
  const [activeTaskRowDropdownId, setActiveTaskRowDropdownId] = useState<string | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  // Form fields for create / edit task
  const [formTaskTitle, setFormTaskTitle] = useState('');
  const [formTaskProject, setFormTaskProject] = useState(projects[0]?.id || '');
  const [formTaskAssignee, setFormTaskAssignee] = useState('Elena Rostova');
  const [formTaskPriority, setFormTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [formTaskStartDate, setFormTaskStartDate] = useState('2026-07-05');
  const [formTaskDueDate, setFormTaskDueDate] = useState('2026-07-15');
  const [formTaskEstimatedTime, setFormTaskEstimatedTime] = useState('2h');
  const [formTaskStatus, setFormTaskStatus] = useState<'Incomplete' | 'To Do' | 'Doing' | 'Completed'>('To Do');
  const [formTaskIsPrivate, setFormTaskIsPrivate] = useState(false);
  const [formTaskDescription, setFormTaskDescription] = useState('');

  // Calendar states
  const [taskCalendarMode, setTaskCalendarMode] = useState<'month' | 'week' | 'day' | 'list'>('week');
  const [taskCalendarDate, setTaskCalendarDate] = useState<Date>(() => new Date('2026-07-05'));

  // Import / Export states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');

  // =========================================================================
  // TIMESHEET SUBMODULE STATE
  // =========================================================================
  const [timesheetViewMode, setTimesheetViewMode] = useState<'list' | 'week' | 'calendar' | 'summary' | 'lifecycle'>('list');
  const [timesheetDuration, setTimesheetDuration] = useState('All');
  const [timesheetEmployeeFilter, setTimesheetEmployeeFilter] = useState('All');
  const [timesheetDepartmentFilter, setTimesheetDepartmentFilter] = useState('All');
  const [timesheetSearch, setTimesheetSearch] = useState('');
  const [timesheetStartDate, setTimesheetStartDate] = useState('');
  const [timesheetEndDate, setTimesheetEndDate] = useState('');
  const [timesheetSortField, setTimesheetSortField] = useState('id');
  const [timesheetSortOrder, setTimesheetSortOrder] = useState<'asc' | 'desc'>('desc');
  const [timesheetEntriesPerPage, setTimesheetEntriesPerPage] = useState(10);
  const [timesheetCurrentPage, setTimesheetCurrentPage] = useState(1);
  const [activeTimesheetDropdownId, setActiveTimesheetDropdownId] = useState<string | null>(null);
  const [showLogTimeModal, setShowLogTimeModal] = useState(false);
  const [showLifecycleModal, setShowLifecycleModal] = useState(false);
  
  // Log Time Form Fields
  const [logTimeProject, setLogTimeProject] = useState('PR-301');
  const [logTimeTask, setLogTimeTask] = useState('TSK-401');
  const [logTimeEmployee, setLogTimeEmployee] = useState('Elena Rostova');
  const [logTimeStartDate, setLogTimeStartDate] = useState('2026-07-05');
  const [logTimeStartTime, setLogTimeStartTime] = useState('09:00 AM');
  const [logTimeEndDate, setLogTimeEndDate] = useState('2026-07-05');
  const [logTimeEndTime, setLogTimeEndTime] = useState('11:00 AM');
  const [logTimeMemo, setLogTimeMemo] = useState('');

  // Weekly Timesheet States
  const [weeklyStartDate, setWeeklyStartDate] = useState<Date>(() => new Date('2026-06-29')); // June 29 - July 5 week
  const [weeklyApprovalStatus, setWeeklyApprovalStatus] = useState<'Draft' | 'Pending' | 'Approved'>('Draft');
  const [approveTimesheetsCount, setApproveTimesheetsCount] = useState(0);
  const [weeklyRows, setWeeklyRows] = useState<any[]>([
    {
      id: 'row-1',
      taskId: 'TSK-401',
      projectName: 'SaaS Platform Redesign',
      taskTitle: 'Design system tokens mapping',
      hours: [8, 8, 4, 0, 0, 0, 0] // Mon - Sun
    },
    {
      id: 'row-2',
      taskId: 'TSK-402',
      projectName: 'SaaS Platform Redesign',
      taskTitle: 'Set up Vite + Tailwind 4',
      hours: [0, 0, 4, 8, 8, 0, 0] // Mon - Sun
    }
  ]);

  // Timesheets Mock Dataset (SaaS Style)
  const [timesheets, setTimesheets] = useState<any[]>([
    {
      id: 'TIM-001',
      code: 'TSK-SAD-28',
      taskTitle: "I think?' 'I had.",
      projectName: 'Survey and data collection tool',
      employeeName: 'Bryon Ondricka',
      employeeRole: 'Trainee',
      employeeAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      startDate: '2026-07-03',
      startTime: '05:30 AM',
      endDate: '2026-07-03',
      endTime: '06:30 AM',
      totalHours: 1.0,
      earnings: 98.00,
      status: 'Approved',
      department: 'Engineering',
      memo: 'Refactoring survey and data collection tool code.'
    },
    {
      id: 'TIM-002',
      code: 'TSK-404',
      taskTitle: 'QA regression for database API',
      projectName: 'Cyberdyne Portal V2',
      employeeName: 'Demetrius McClure',
      employeeRole: 'Trainee',
      employeeAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
      startDate: '2026-07-02',
      startTime: '08:00 AM',
      endDate: '2026-07-02',
      endTime: '01:00 PM',
      totalHours: 5.0,
      earnings: 490.00,
      status: 'Approved',
      department: 'QA',
      memo: 'Setting up testing suite with regression tests.'
    },
    {
      id: 'TIM-003',
      code: 'TSK-401',
      taskTitle: 'Design system tokens mapping',
      projectName: 'SaaS Platform Redesign',
      employeeName: 'James Carter',
      employeeRole: 'Senior Designer',
      employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      startDate: '2026-07-04',
      startTime: '10:00 AM',
      endDate: '2026-07-04',
      endTime: '02:00 PM',
      totalHours: 4.0,
      earnings: 312.00,
      status: 'Approved',
      department: 'Design',
      memo: 'Establishing tailwind token configurations.'
    },
    {
      id: 'TIM-004',
      code: 'TSK-402',
      taskTitle: 'Set up Vite + Tailwind 4',
      projectName: 'SaaS Platform Redesign',
      employeeName: 'Elena Rostova',
      employeeRole: 'Lead Engineer',
      employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      startDate: '2026-07-05',
      startTime: '09:00 AM',
      endDate: '2026-07-05',
      endTime: '12:00 PM',
      totalHours: 3.0,
      earnings: 294.00,
      status: 'Pending',
      department: 'Engineering',
      memo: 'Vite config setup and asset structure check.'
    }
  ]);

  // =========================================================================
  // ROADMAP SUBMODULE STATE
  // =========================================================================
  const [roadmapViewMode, setRoadmapViewMode] = useState<'list' | 'gantt'>('list');
  const [roadmapDuration, setRoadmapDuration] = useState('All');
  const [roadmapStatusFilter, setRoadmapStatusFilter] = useState('All');
  const [roadmapProgressFilter, setRoadmapProgressFilter] = useState('All');
  const [roadmapSearch, setRoadmapSearch] = useState('');
  const [roadmapSortField, setRoadmapSortField] = useState('code');
  const [roadmapSortOrder, setRoadmapSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showRoadmapFilterSidebar, setShowRoadmapFilterSidebar] = useState(false);

  // Advanced Filters Sidebar State for Roadmap
  const [advRoadmapDateOn, setAdvRoadmapDateOn] = useState('All');
  const [advRoadmapClient, setAdvRoadmapClient] = useState('All');
  const [advRoadmapCategory, setAdvRoadmapCategory] = useState('All');
  const [advRoadmapMember, setAdvRoadmapMember] = useState('All');
  const [advRoadmapDepartment, setAdvRoadmapDepartment] = useState('All');
  const [advRoadmapPublic, setAdvRoadmapPublic] = useState('All');
  const [advRoadmapStatus, setAdvRoadmapStatus] = useState('All');
  const [advRoadmapProgress, setAdvRoadmapProgress] = useState('All');
  const [advRoadmapDeadline, setAdvRoadmapDeadline] = useState('All');

  // Dynamic hours calculation helper
  const calculateTotalHours = (sDate: string, sTime: string, eDate: string, eTime: string) => {
    try {
      if (!sDate || !sTime || !eDate || !eTime) return 0;
      const startStr = `${sDate}T${sTime}`;
      const endStr = `${eDate}T${eTime}`;
      const diff = (new Date(endStr).getTime() - new Date(startStr).getTime()) / 1000 / 60 / 60;
      return diff > 0 ? Number(diff.toFixed(2)) : 0;
    } catch {
      return 0;
    }
  };

  const handleLogTime = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTask = localTasks.find(t => t.id === logTimeTask);
    const hrs = calculateTotalHours(logTimeStartDate, logTimeStartTime, logTimeEndDate, logTimeEndTime) || 2.0;
    const rate = logTimeEmployee.includes('Elena') ? 98 : logTimeEmployee.includes('James') ? 78 : 50;
    const earned = hrs * rate;

    const newLog = {
      id: `TIM-${String(timesheets.length + 1).padStart(3, '0')}`,
      code: logTimeTask,
      taskTitle: targetTask ? targetTask.title : 'Dynamic Dev Log Session',
      projectName: targetTask ? targetTask.projectName : 'General Workspace Support',
      employeeName: logTimeEmployee,
      employeeRole: logTimeEmployee === 'Elena Rostova' ? 'Lead' : 'Trainee',
      employeeAvatar: logTimeEmployee === 'Elena Rostova' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      startDate: logTimeStartDate,
      startTime: logTimeStartTime,
      endDate: logTimeEndDate,
      endTime: logTimeEndTime,
      totalHours: hrs,
      earnings: earned,
      status: 'Approved',
      department: logTimeEmployee === 'Elena Rostova' ? 'Engineering' : 'Design',
      memo: logTimeMemo || 'Working on milestone deliverables.'
    };

    setTimesheets([newLog, ...timesheets]);
    setShowLogTimeModal(false);
    setTimesheetCurrentPage(1);

    // Reset fields
    setLogTimeMemo('');
  };

  // Initialize local tasks state with screenshot-accurate dataset (SAD-28)
  const [localTasks, setLocalTasks] = useState<any[]>(() => {
    const initial = [
      {
        id: 'TSK-SAD-28',
        code: 'SAD-28',
        projectId: 'PR-303',
        projectName: 'Survey and data collection tool',
        title: "I think?' 'I had.",
        assignedTo: 'Elena Rostova',
        assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        startDate: '2026-06-19',
        dueDate: '2026-06-25',
        priority: 'High',
        status: 'Doing',
        estimatedTime: '0s',
        hoursLogged: '0s',
        completedOn: '--',
        isPrivate: false,
        description: 'Survey and data collection tool initialization and mapping.'
      },
      ...tasks.map((t) => {
        let status = t.status;
        if (status as any === 'In Progress') status = 'Doing' as any;
        if (status as any === 'Review') status = 'Incomplete' as any;
        return {
          id: t.id,
          code: t.id.replace('TSK-', 'TSK#'),
          projectId: t.projectId,
          projectName: t.projectName,
          title: t.title,
          assignedTo: t.assignedTo,
          assignedAvatar: t.assignedAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          startDate: '2026-07-01',
          dueDate: t.dueDate,
          priority: t.priority,
          status: status,
          estimatedTime: '4h',
          hoursLogged: '0s',
          completedOn: status === 'Completed' ? '2026-07-05' : '--',
          isPrivate: false,
          description: t.title
        };
      })
    ];
    return initial;
  });

  // Handle outside prop updates smoothly
  React.useEffect(() => {
    setLocalTasks(prev => {
      const merged = [...prev];
      tasks.forEach(t => {
        const idx = merged.findIndex(m => m.id === t.id);
        let status = t.status;
        if (status as any === 'In Progress') status = 'Doing' as any;
        if (status as any === 'Review') status = 'Incomplete' as any;
        
        if (idx > -1) {
          merged[idx] = { ...merged[idx], ...t, status };
        } else {
          merged.push({
            id: t.id,
            code: t.id.replace('TSK-', 'TSK#'),
            projectId: t.projectId,
            projectName: t.projectName,
            title: t.title,
            assignedTo: t.assignedTo,
            assignedAvatar: t.assignedAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            startDate: '2026-07-01',
            dueDate: t.dueDate,
            priority: t.priority,
            status: status,
            estimatedTime: '4h',
            hoursLogged: '0s',
            completedOn: status === 'Completed' ? '2026-07-05' : '--',
            isPrivate: false,
            description: t.title
          });
        }
      });
      return merged;
    });
  }, [tasks]);

  // Task management helper functions (Add, Edit, Delete, Toggle Status, Export, Import)
  const handleOpenAddTaskModal = (status?: 'Incomplete' | 'To Do' | 'Doing' | 'Completed', isPrivate?: boolean) => {
    setEditingTask(null);
    setFormTaskTitle('');
    setFormTaskProject(projects[0]?.id || '');
    setFormTaskAssignee('Elena Rostova');
    setFormTaskPriority('Medium');
    setFormTaskStartDate('2026-07-05');
    setFormTaskDueDate('2026-07-15');
    setFormTaskEstimatedTime('2h');
    setFormTaskStatus(status || 'To Do');
    setFormTaskIsPrivate(isPrivate || false);
    setFormTaskDescription('');
    setShowAddTaskModal(true);
  };

  const handleOpenEditTaskModal = (task: any) => {
    setEditingTask(task);
    setFormTaskTitle(task.title);
    setFormTaskProject(task.projectId);
    setFormTaskAssignee(task.assignedTo);
    setFormTaskPriority(task.priority);
    setFormTaskStartDate(task.startDate || '2026-07-05');
    setFormTaskDueDate(task.dueDate);
    setFormTaskEstimatedTime(task.estimatedTime || '2h');
    setFormTaskStatus(task.status);
    setFormTaskIsPrivate(task.isPrivate || false);
    setFormTaskDescription(task.description || '');
    setShowAddTaskModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setLocalTasks(prev => prev.filter(t => t.id !== taskId));
    setActiveTaskRowDropdownId(null);
  };

  // Filter and search logic for localTasks
  const getFilteredTasks = (isPrivateView: boolean) => {
    return localTasks.filter(t => {
      // 1. Privacy filter
      if (isPrivateView) {
        if (!t.isPrivate) return false;
      } else {
        if (t.isPrivate) return false;
      }

      // 2. Search filter
      if (taskSearch.trim()) {
        const query = taskSearch.toLowerCase();
        const matchesCode = t.code?.toLowerCase().includes(query) || t.id.toLowerCase().includes(query);
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesAssignee = t.assignedTo.toLowerCase().includes(query);
        const matchesProject = t.projectName.toLowerCase().includes(query);
        if (!matchesCode && !matchesTitle && !matchesAssignee && !matchesProject) {
          return false;
        }
      }

      // 3. Status filter
      if (taskStatusFilter === 'Hide Completed Task') {
        if (t.status === 'Completed') return false;
      } else if (taskStatusFilter !== 'All') {
        if (t.status !== taskStatusFilter) return false;
      }

      // 4. Project Filter
      if (taskProjectFilter !== 'All') {
        if (t.projectId !== taskProjectFilter && t.projectName !== taskProjectFilter) return false;
      }

      // 5. Custom Date / Duration Filter
      if (taskStartDate) {
        if (t.dueDate < taskStartDate) return false;
      }
      if (taskEndDate) {
        if (t.dueDate > taskEndDate) return false;
      }

      return true;
    });
  };

  // Sorting logic for localTasks list
  const getSortedTasks = (filteredList: any[]) => {
    return [...filteredList].sort((a, b) => {
      let valA = a[taskSortField] || '';
      let valB = b[taskSortField] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return taskSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return taskSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'Incomplete' | 'To Do' | 'Doing' | 'Completed') => {
    setLocalTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          completedOn: newStatus === 'Completed' ? '2026-07-05' : '--'
        };
      }
      return t;
    }));
  };

  const handleToggleTaskRowComplete = (taskId: string) => {
    setLocalTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isCurrentlyCompleted = t.status === 'Completed';
        const nextStatus = isCurrentlyCompleted ? 'To Do' : 'Completed';
        return {
          ...t,
          status: nextStatus,
          completedOn: nextStatus === 'Completed' ? '2026-07-05' : '--'
        };
      }
      return t;
    }));
    // Trigger callback if defined
    if (onToggleTaskComplete) {
      onToggleTaskComplete(taskId);
    }
  };

  const handleTaskFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const linkedProject = projects.find(p => p.id === formTaskProject);
    const projectName = linkedProject ? linkedProject.name : 'SaaS Platform Redesign';
    const projectCode = linkedProject?.code || 'TSK';

    const avatarMap: Record<string, string> = {
      'Elena Rostova': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      'James Carter': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      'Daniel Park': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      'Zara Khan': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      'Aria Montgomery': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    };

    if (editingTask) {
      setLocalTasks(prev => prev.map(t => {
        if (t.id === editingTask.id) {
          return {
            ...t,
            title: formTaskTitle,
            projectId: formTaskProject,
            projectName,
            assignedTo: formTaskAssignee,
            assignedAvatar: avatarMap[formTaskAssignee] || t.assignedAvatar,
            priority: formTaskPriority,
            startDate: formTaskStartDate,
            dueDate: formTaskDueDate,
            estimatedTime: formTaskEstimatedTime,
            status: formTaskStatus,
            isPrivate: formTaskIsPrivate,
            description: formTaskDescription,
            completedOn: formTaskStatus === 'Completed' ? '2026-07-05' : '--'
          };
        }
        return t;
      }));
    } else {
      const newId = `TSK-${Math.floor(100 + Math.random() * 900)}`;
      const randomNum = Math.floor(10 + Math.random() * 90);
      const code = `${projectCode}-${randomNum}`;
      const newTask = {
        id: newId,
        code,
        projectId: formTaskProject,
        projectName,
        title: formTaskTitle,
        assignedTo: formTaskAssignee,
        assignedAvatar: avatarMap[formTaskAssignee] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        startDate: formTaskStartDate,
        dueDate: formTaskDueDate,
        priority: formTaskPriority,
        status: formTaskStatus,
        estimatedTime: formTaskEstimatedTime,
        hoursLogged: '0s',
        completedOn: formTaskStatus === 'Completed' ? '2026-07-05' : '--',
        isPrivate: formTaskIsPrivate,
        description: formTaskDescription
      };
      setLocalTasks(prev => [newTask, ...prev]);

      if (onAddTask) {
        onAddTask({
          projectId: formTaskProject,
          title: formTaskTitle,
          assignedTo: formTaskAssignee,
          priority: formTaskPriority,
          dueDate: formTaskDueDate
        });
      }
    }

    setShowAddTaskModal(false);
  };

  const handleExportTasks = () => {
    const headers = ['Code', 'Task', 'Completed On', 'Start Date', 'Due Date', 'Estimated Time', 'Hours Logged', 'Assigned To', 'Priority', 'Status', 'Private'];
    const rows = localTasks.map(t => [
      t.code,
      `"${t.title.replace(/"/g, '""')}"`,
      t.completedOn || '--',
      t.startDate || '--',
      t.dueDate,
      t.estimatedTime || '--',
      t.hoursLogged || '0s',
      t.assignedTo,
      t.priority,
      t.status,
      t.isPrivate ? 'Yes' : 'No'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Worksuite_Tasks_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportTasks = () => {
    if (!importCsvText.trim()) return;
    try {
      if (importCsvText.trim().startsWith('[') || importCsvText.trim().startsWith('{')) {
        const parsed = JSON.parse(importCsvText);
        const arrayToProcess = Array.isArray(parsed) ? parsed : [parsed];
        const newTasks = arrayToProcess.map((item: any, idx: number) => {
          const newId = `TSK-IMP-${Math.floor(100 + Math.random() * 900)}`;
          return {
            id: newId,
            code: item.code || `IMP-${10 + idx}`,
            projectId: item.projectId || projects[0]?.id || 'PR-301',
            projectName: item.projectName || 'Imported Task Project',
            title: item.title || item.task || 'Untitled Imported Task',
            assignedTo: item.assignedTo || 'Elena Rostova',
            assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
            startDate: item.startDate || '2026-07-05',
            dueDate: item.dueDate || '2026-07-15',
            priority: item.priority || 'Medium',
            status: item.status || 'To Do',
            estimatedTime: item.estimatedTime || '2h',
            hoursLogged: '0s',
            completedOn: item.completedOn || '--',
            isPrivate: item.isPrivate === true || item.isPrivate === 'Yes',
            description: item.description || ''
          };
        });
        setLocalTasks(prev => [...newTasks, ...prev]);
        setShowImportModal(false);
        setImportCsvText('');
        return;
      }

      const lines = importCsvText.split('\n');
      const newTasks: any[] = [];
      lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return;
        const cols = line.split(',');
        if (cols.length >= 2) {
          const newId = `TSK-IMP-${Math.floor(100 + Math.random() * 900)}`;
          newTasks.push({
            id: newId,
            code: cols[0]?.trim() || `CSV-${index}`,
            projectId: projects[0]?.id || 'PR-301',
            projectName: 'Imported Task Project',
            title: cols[1]?.trim().replace(/^"|"$/g, '') || 'Imported CSV Task',
            assignedTo: cols[2]?.trim() || 'Elena Rostova',
            assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
            startDate: cols[3]?.trim() || '2026-07-05',
            dueDate: cols[4]?.trim() || '2026-07-15',
            priority: (cols[5]?.trim() as any) || 'Medium',
            status: (cols[6]?.trim() as any) || 'To Do',
            estimatedTime: cols[7]?.trim() || '2h',
            hoursLogged: '0s',
            completedOn: '--',
            isPrivate: cols[8]?.trim() === 'Yes',
            description: cols[9]?.trim() || ''
          });
        }
      });

      if (newTasks.length > 0) {
        setLocalTasks(prev => [...newTasks, ...prev]);
        setShowImportModal(false);
        setImportCsvText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Local state for projects to allow interactive additions, edits, and deletions
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  React.useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  // Project subTab view and filter options
  const [projectsView, setProjectsView] = useState<'list' | 'calendar' | 'gantt'>('list');
  const [projStatusFilter, setProjStatusFilter] = useState<string>('All');
  const [projProgressFilter, setProjProgressFilter] = useState<string>('All');
  const [projClientFilter, setProjClientFilter] = useState<string>('All');
  const [projSearchQuery, setProjSearchQuery] = useState<string>('');
  const [projDurationFilter, setProjDurationFilter] = useState<string>('');
  const [projEntriesPerPage, setProjEntriesPerPage] = useState<number>(10);
  const [projCurrentPage, setProjCurrentPage] = useState<number>(1);
  const [activeProjectDropdownId, setActiveProjectDropdownId] = useState<string | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Form states for Create Project
  const [newProjName, setNewProjName] = useState('');
  const [newProjCode, setNewProjCode] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjCompany, setNewProjCompany] = useState('');
  const [newProjStartDate, setNewProjStartDate] = useState('');
  const [newProjEndDate, setNewProjEndDate] = useState('');
  const [newProjBudget, setNewProjBudget] = useState('');
  const [newProjProgress, setNewProjProgress] = useState(0);

  // Calendar week state - defaults to Jul 5, 2026 to match screenshot
  const [currentCalendarWeekStart, setCurrentCalendarWeekStart] = useState<Date>(() => new Date('2026-07-05'));

  // Contracts management state
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [contractsView, setContractsView] = useState<'list' | 'templates' | 'add-template' | 'create-contract'>('list');
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [contractTypes, setContractTypes] = useState<string[]>([
    'Service Level Agreement', 'NDA', 'Retainer', 'Hourly Contract', 'Fixed Price'
  ]);

  // Contracts Filters
  const [selectedClient, setSelectedClient] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [durationFilter, setDurationFilter] = useState<string>('');

  // Pagination state
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Form states for "Create Contract"
  const [cSubject, setCSubject] = useState('');
  const [cClientName, setCClientName] = useState('');
  const [cClientCompany, setCClientCompany] = useState('');
  const [cProjectName, setCProjectName] = useState('--');
  const [cAmount, setCAmount] = useState('');
  const [cStartDate, setCStartDate] = useState('');
  const [cEndDate, setCEndDate] = useState('');
  const [cType, setCType] = useState('Service Level Agreement');
  const [cDescription, setCDescription] = useState('');

  // Form states for "Add Template"
  const [tSubject, setTSubject] = useState('');
  const [tDescription, setTDescription] = useState('');
  const [tType, setTType] = useState('Service Level Agreement');
  const [tAmount, setTAmount] = useState('');
  const [tCurrency, setTCurrency] = useState('USD ($)');

  // Modal states & active row action dropdowns
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [newContractTypeName, setNewContractTypeName] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // New Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProject, setTaskProject] = useState(projects[0]?.id || '');
  const [taskAssignee, setTaskAssignee] = useState('Elena Rostova');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [taskDueDate, setTaskDueDate] = useState('2026-07-15');

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    onAddTask({
      projectId: taskProject,
      title: taskTitle,
      assignedTo: taskAssignee,
      priority: taskPriority,
      dueDate: taskDueDate
    });
    setTaskTitle('');
    setShowTaskModal(false);
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjClient) return;

    const created: Project = {
      id: `PR-${Date.now().toString().slice(-3)}`,
      code: newProjCode.toUpperCase(),
      name: newProjName,
      clientId: `CL-${Date.now().toString().slice(-3)}`,
      clientName: newProjClient,
      clientCompany: newProjCompany,
      clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      status: 'In Progress',
      budget: Number(newProjBudget) || 25000,
      spent: 0,
      startDate: newProjStartDate || new Date().toISOString().split('T')[0],
      endDate: newProjEndDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      progress: newProjProgress || 0,
      members: ['Elena Rostova', 'James Carter']
    };

    setLocalProjects([created, ...localProjects]);
    setNewProjName('');
    setNewProjCode('');
    setNewProjClient('');
    setNewProjCompany('');
    setNewProjStartDate('');
    setNewProjEndDate('');
    setNewProjBudget('');
    setNewProjProgress(0);
    setShowAddProjectModal(false);
  };

  const handleDeleteProject = (id: string) => {
    setLocalProjects(localProjects.filter(p => p.id !== id));
    setActiveProjectDropdownId(null);
  };

  const getMemberAvatar = (memberName: string) => {
    const memberAvatars: Record<string, string> = {
      'Elena Rostova': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      'James Carter': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      'Aria Montgomery': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      'Daniel Park': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      'Zara Khan': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
    };
    return memberAvatars[memberName] || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face';
  };

  const formatDateDMY = (dateStr: string) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Timeline / Gantt mockup events
  const roadmapMilestones = [
    { title: 'Project Scoping & Discovery', start: 'W1', duration: 'W2', progress: 100, status: 'Completed', color: 'bg-emerald-500' },
    { title: 'Interactive UX Architecture & Design', start: 'W2', duration: 'W3', progress: 85, status: 'In Progress', color: 'bg-indigo-500' },
    { title: 'Vite + React Core Compiling', start: 'W4', duration: 'W4', progress: 40, status: 'In Progress', color: 'bg-indigo-500' },
    { title: 'Quality Assurance Handshake & UAT', start: 'W7', duration: 'W2', progress: 0, status: 'Not Started', color: 'bg-slate-300' },
    { title: 'SaaS Container Delivery to Cloud Run', start: 'W8', duration: 'W2', progress: 0, status: 'Not Started', color: 'bg-slate-300' },
  ];

  // Filtered contracts
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = searchQuery === '' || 
      contract.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clientCompany.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClient = selectedClient === 'All' || contract.clientName === selectedClient;
    const matchesType = selectedType === 'All' || contract.contractType === selectedType;

    return matchesSearch && matchesClient && matchesType;
  });

  // Pagination calculations
  const totalEntries = filteredContracts.length;
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredContracts.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;

  const handleCreateContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cSubject || !cClientName) return;
    
    const newContract: Contract = {
      id: `CONT#${String(contracts.length + 1).padStart(3, '0')}`,
      subject: cSubject,
      clientName: cClientName,
      clientCompany: cClientCompany || 'Self-Employed',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      projectName: cProjectName || '--',
      amount: Number(cAmount) || 0,
      startDate: cStartDate || new Date().toISOString().split('T')[0],
      endDate: cEndDate || new Date().toISOString().split('T')[0],
      contractType: cType,
      description: cDescription
    };

    setContracts([newContract, ...contracts]);
    setContractsView('list');
    setCurrentPage(1);

    // Reset form
    setCSubject('');
    setCClientName('');
    setCClientCompany('');
    setCProjectName('--');
    setCAmount('');
    setCStartDate('');
    setCEndDate('');
    setCType('Service Level Agreement');
    setCDescription('');
  };

  const handleAddTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tSubject) return;

    const newTemplate: ContractTemplate = {
      id: `TMP#${String(templates.length + 1).padStart(3, '0')}`,
      subject: tSubject,
      description: tDescription,
      contractType: tType,
      amount: Number(tAmount) || 0,
      currency: tCurrency
    };

    setTemplates([newTemplate, ...templates]);
    setContractsView('templates');

    // Reset form
    setTSubject('');
    setTDescription('');
    setTType('Service Level Agreement');
    setTAmount('');
    setTCurrency('USD ($)');
  };

  const handleAddContractType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContractTypeName && !contractTypes.includes(newContractTypeName)) {
      setContractTypes([...contractTypes, newContractTypeName]);
      setCType(newContractTypeName);
      setTType(newContractTypeName);
      setNewContractTypeName('');
      setShowAddTypeModal(false);
    }
  };

  const handleDeleteContract = (id: string) => {
    setContracts(contracts.filter(c => c.id !== id));
    setActiveDropdownId(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Subject', 'Client', 'Company', 'Project', 'Amount', 'Start Date', 'End Date', 'Type'];
    const rows = contracts.map(c => [
      c.id,
      `"${c.subject.replace(/"/g, '""')}"`,
      `"${c.clientName.replace(/"/g, '""')}"`,
      `"${c.clientCompany.replace(/"/g, '""')}"`,
      c.projectName,
      c.amount,
      c.startDate,
      c.endDate,
      c.contractType
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contracts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get unique client names for filter dropdown
  const uniqueClientNames = Array.from(new Set(contracts.map(c => c.clientName)));

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight capitalize flex items-center gap-2">
            {subTab === 'contracts' ? (
              <span>
                Contracts <span className="text-xs font-normal text-slate-400 ml-2">Home • Contracts</span>
              </span>
            ) : subTab === 'projects' ? (
              <span>
                {projectsView === 'calendar' ? 'Project Calendar' : 'Projects'} <span className="text-xs font-normal text-slate-400 ml-2">Home • Projects {projectsView === 'calendar' ? '• Project Calendar' : ''}</span>
              </span>
            ) : (
              <span>
                Work: {subTab === 'tasks' ? 'Tasks Kanban Board' : 
                       subTab === 'timesheet' ? 'Timesheet tracker' : 'Roadmap Timeline'}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {subTab === 'contracts' ? 'Manage legal agreements, client scopes, and contract templates.' : 'Deliver enterprise assets, monitor schedules, and log timesheets.'}
          </p>
        </div>
        <div>
          {subTab === 'tasks' && (
            <button
              id="work-add-task-btn"
              onClick={() => setShowTaskModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* 0. CONTRACTS SUBMODULE */}
      {subTab === 'contracts' && (
        <div className="space-y-6">
          {/* VIEW 1: MAIN LISTING OF CONTRACTS */}
          {contractsView === 'list' && (
            <div className="space-y-6">
              {/* FILTERS & CONTROLS ROW */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Duration Filter */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Duration</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Start Date To End Date"
                        readOnly
                        className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer font-sans"
                        onClick={() => alert("Date picker simulation: Enter dates in create contract form to add durations.")}
                      />
                    </div>
                  </div>

                  {/* Client Filter */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Client</label>
                    <select
                      value={selectedClient}
                      onChange={(e) => { setSelectedClient(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
                    >
                      <option value="All">All Clients</option>
                      {uniqueClientNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Contract Type Filter */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Contract Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
                    >
                      <option value="All">All Types</option>
                      {contractTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Start typing to search"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS ROW */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setContractsView('create-contract')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors font-sans"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Contract</span>
                </button>
                <button
                  onClick={() => setContractsView('templates')}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors font-sans"
                >
                  <Layers className="h-4 w-4 text-slate-400" />
                  <span>Contract Template</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors font-sans"
                >
                  <Download className="h-4 w-4 text-slate-400" />
                  <span>Export</span>
                </button>
              </div>

              {/* TABLE CONTAINER */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider font-sans">
                        <th className="px-5 py-4 w-12 text-center">
                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                        </th>
                        <th className="px-4 py-4 w-20">#</th>
                        <th className="px-5 py-4">Subject</th>
                        <th className="px-5 py-4">Client</th>
                        <th className="px-5 py-4">Project</th>
                        <th className="px-5 py-4">Amount</th>
                        <th className="px-5 py-4">Start Date</th>
                        <th className="px-5 py-4">End Date</th>
                        <th className="px-5 py-4 text-center w-16">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
                      {currentEntries.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-5 py-10 text-center text-slate-400 font-medium font-sans">
                            No contracts match the selected filter criteria.
                          </td>
                        </tr>
                      ) : (
                        currentEntries.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="px-5 py-4 text-center">
                              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                            </td>
                            <td className="px-4 py-4 font-mono font-bold text-slate-400">{c.id}</td>
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => {
                                alert(`Contract Terms for ${c.id}:\n\nSubject: ${c.subject}\nType: ${c.contractType}\nValue: $${c.amount}\nPeriod: ${c.startDate} to ${c.endDate}\n\nDescription: ${c.description || 'No description provided.'}`);
                              }}>{c.subject}</div>
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block">{c.contractType}</span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img src={c.clientAvatar} alt={c.clientName} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover border border-slate-100" />
                                <div>
                                  <div className="font-bold text-slate-800">{c.clientName}</div>
                                  <div className="text-[10px] text-slate-400 font-medium">{c.clientCompany}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-medium text-slate-500">{c.projectName}</td>
                            <td className="px-5 py-4 font-bold text-slate-900">${c.amount.toFixed(2)}</td>
                            <td className="px-5 py-4 font-mono text-slate-500">{c.startDate.split('-').reverse().join('-')}</td>
                            <td className="px-5 py-4 font-mono text-slate-500">{c.endDate.split('-').reverse().join('-')}</td>
                            <td className="px-5 py-4 text-center relative">
                              <button
                                onClick={() => setActiveDropdownId(activeDropdownId === c.id ? null : c.id)}
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {/* Row action dropdown */}
                              {activeDropdownId === c.id && (
                                <div className="absolute right-6 top-10 bg-white rounded-xl border border-slate-100 shadow-xl py-1.5 w-36 text-left z-50 animate-fade-in">
                                  <button
                                    onClick={() => {
                                      alert(`Detailed View:\nContract: ${c.subject}\nClient: ${c.clientName}\nType: ${c.contractType}\nValue: $${c.amount}\nPeriod: ${c.startDate} to ${c.endDate}\n\nDescription: ${c.description || 'No description provided.'}`);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete contract ${c.id}?`)) {
                                        handleDeleteContract(c.id);
                                      }
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION / FOOTER ROW */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                      className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-xs"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Showing {totalEntries === 0 ? 0 : indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-slate-50 disabled:hover:bg-white cursor-pointer transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          currentPage === pageNum 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-slate-50 disabled:hover:bg-white cursor-pointer transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: CONTRACT TEMPLATES */}
          {contractsView === 'templates' && (
            <div className="space-y-6">
              {/* BACK BUTTON AND HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 font-sans">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setContractsView('list')}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Contract Template</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Home • Contract Template</p>
                  </div>
                </div>
                <button
                  onClick={() => setContractsView('add-template')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Contract Template</span>
                </button>
              </div>

              {/* SEARCH FIELD */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs max-w-sm font-sans">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Start typing to search"
                    className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* TEMPLATE TABLE CONTAINER */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden font-sans">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider">
                        <th className="px-5 py-4 w-12 text-center">
                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                        </th>
                        <th className="px-5 py-4">Subject</th>
                        <th className="px-5 py-4">Amount</th>
                        <th className="px-5 py-4 text-center w-24">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {templates.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-12 text-center text-slate-400 font-medium">
                            No data available in table
                          </td>
                        </tr>
                      ) : (
                        templates.map(tmp => (
                          <tr key={tmp.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="px-5 py-4 text-center">
                              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                            </td>
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-900">{tmp.subject}</div>
                              <span className="text-[10px] text-indigo-600 font-semibold mt-0.5 inline-block">{tmp.contractType}</span>
                            </td>
                            <td className="px-5 py-4 font-bold text-slate-900">
                              {tmp.amount > 0 ? `${tmp.currency.split(' ')[0]} ${tmp.amount.toFixed(2)}` : 'Not Specified'}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => handleDeleteTemplate(tmp.id)}
                                className="text-xs text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* TEMPLATE TABLE FOOTER */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Show</span>
                    <select className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-semibold focus:outline-none cursor-pointer text-xs">
                      <option value="10">10</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Showing 0 to {templates.length} of {templates.length} entries
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="bg-white border border-slate-200 text-slate-400 text-xs font-bold px-3 py-1.5 rounded-lg cursor-not-allowed">Previous</button>
                    <button className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">1</button>
                    <button className="bg-white border border-slate-200 text-slate-400 text-xs font-bold px-3 py-1.5 rounded-lg cursor-not-allowed">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: ADD CONTRACT TEMPLATE */}
          {contractsView === 'add-template' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 font-sans">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setContractsView('templates')}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Add Contract Template</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Create a layout for fast contracts deployment</p>
                  </div>
                </div>
              </div>

              {/* CARD CONTAINER */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                <div className="pb-3 border-b border-slate-100 font-sans">
                  <h4 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">Contract Details</h4>
                </div>

                <form onSubmit={handleAddTemplateSubmit} className="space-y-6 font-sans">
                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Subject <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design Consulting Scope"
                      value={tSubject}
                      onChange={(e) => setTSubject(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Description WYSIWYG Toolbar */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Description</label>
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      {/* WYSIWYG Mock Toolbar */}
                      <div className="bg-white border-b border-slate-200 p-2 flex flex-wrap gap-1.5 items-center">
                        <select className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-600 focus:outline-none cursor-pointer">
                          <option>Normal</option>
                          <option>Heading 1</option>
                          <option>Heading 2</option>
                          <option>Heading 3</option>
                        </select>
                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                        {['B', 'I', 'U', 'S'].map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => alert(`Format applied: ${btn}`)}
                            className="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 cursor-pointer"
                          >
                            {btn}
                          </button>
                        ))}
                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                        {['•', '1.', 'Indent', 'Outdent'].map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => alert(`List format: ${btn}`)}
                            className="px-1.5 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 cursor-pointer animate-none"
                          >
                            {btn}
                          </button>
                        ))}
                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                        <button
                          type="button"
                          onClick={() => alert('Insert Image URL')}
                          className="px-1.5 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 cursor-pointer"
                        >
                          Image
                        </button>
                        <button
                          type="button"
                          onClick={() => alert('Insert Hyperlink')}
                          className="px-1.5 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 cursor-pointer"
                        >
                          Link
                        </button>
                      </div>
                      {/* Rich Text area */}
                      <textarea
                        rows={6}
                        placeholder="Define template agreement paragraphs..."
                        value={tDescription}
                        onChange={(e) => setTDescription(e.target.value)}
                        className="w-full bg-transparent text-slate-800 text-xs p-4 focus:outline-none resize-y"
                      />
                    </div>
                  </div>

                  {/* BOTTOM ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Contract Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contract Type <span className="text-rose-500">*</span></label>
                      <div className="flex gap-2">
                        <select
                          value={tType}
                          onChange={(e) => setTType(e.target.value)}
                          className="flex-1 bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {contractTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowAddTypeModal(true)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 rounded-xl border border-slate-200 cursor-pointer transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Contract Value */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <span>Contract Value <span className="text-rose-500">*</span></span>
                        <div className="group relative">
                          <HelpCircle className="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-pointer" />
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-5 bg-slate-900 text-white text-[9px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-32 text-center z-50">
                            Set standard baseline contract amount
                          </div>
                        </div>
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 5000"
                        value={tAmount}
                        onChange={(e) => setTAmount(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Currency */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Currency</label>
                      <select
                        value={tCurrency}
                        onChange={(e) => setTCurrency(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="USD ($)">USD ($)</option>
                        <option value="EUR (€)">EUR (€)</option>
                        <option value="GBP (£)">GBP (£)</option>
                        <option value="INR (₹)">INR (₹)</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContractsView('templates')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* VIEW 4: CREATE CONTRACT */}
          {contractsView === 'create-contract' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 font-sans">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setContractsView('list')}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Create Contract</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Draft a new legally binding agreement</p>
                  </div>
                </div>
              </div>

              {/* CARD CONTAINER */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                <div className="pb-3 border-b border-slate-100 font-sans">
                  <h4 className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">Contract Scope Details</h4>
                </div>

                <form onSubmit={handleCreateContractSubmit} className="space-y-6 font-sans">
                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Subject <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q3 Mobile App Development Agreement"
                      value={cSubject}
                      onChange={(e) => setCSubject(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Client and Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Client Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Edyth Moore I"
                        value={cClientName}
                        onChange={(e) => setCClientName(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Client Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ledner-Tremblay"
                        value={cClientCompany}
                        onChange={(e) => setCClientCompany(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Dates & Amount */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Start Date <span className="text-rose-500">*</span></label>
                      <input
                        type="date"
                        required
                        value={cStartDate}
                        onChange={(e) => setCStartDate(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">End Date <span className="text-rose-500">*</span></label>
                      <input
                        type="date"
                        required
                        value={cEndDate}
                        onChange={(e) => setCEndDate(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contract Value ($) <span className="text-rose-500">*</span></label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 15000"
                        value={cAmount}
                        onChange={(e) => setCAmount(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Project & Contract Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Linked Project</label>
                      <select
                        value={cProjectName}
                        onChange={(e) => setCProjectName(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="--">No Project Linked (--)</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contract Type <span className="text-rose-500">*</span></label>
                      <div className="flex gap-2">
                        <select
                          value={cType}
                          onChange={(e) => setCType(e.target.value)}
                          className="flex-1 bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {contractTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowAddTypeModal(true)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 rounded-xl border border-slate-200 cursor-pointer transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description WYSIWYG Toolbar */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contract Terms & Description</label>
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      {/* WYSIWYG Mock Toolbar */}
                      <div className="bg-white border-b border-slate-200 p-2 flex flex-wrap gap-1.5 items-center">
                        <select className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-600 focus:outline-none cursor-pointer">
                          <option>Normal</option>
                          <option>Heading 1</option>
                          <option>Heading 2</option>
                          <option>Heading 3</option>
                        </select>
                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                        {['B', 'I', 'U', 'S'].map((btn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => alert(`Format applied: ${btn}`)}
                            className="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 cursor-pointer font-sans"
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                      {/* Rich Text area */}
                      <textarea
                        rows={6}
                        placeholder="State complete contract specifications, milestones, and payment schedule terms..."
                        value={cDescription}
                        onChange={(e) => setCDescription(e.target.value)}
                        className="w-full bg-transparent text-slate-800 text-xs p-4 focus:outline-none resize-y"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContractsView('list')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. PROJECTS MODULE */}
      {subTab === 'projects' && (() => {
        const filteredProjects = localProjects.filter(p => {
          const matchesSearch = projSearchQuery === '' || 
            p.name.toLowerCase().includes(projSearchQuery.toLowerCase()) ||
            (p.code && p.code.toLowerCase().includes(projSearchQuery.toLowerCase())) ||
            p.clientName.toLowerCase().includes(projSearchQuery.toLowerCase());

          const matchesStatus = projStatusFilter === 'All' || 
            p.status.toLowerCase() === projStatusFilter.toLowerCase() ||
            (projStatusFilter === 'In Progress' && p.status === 'In Progress') ||
            (projStatusFilter === 'Finished' && p.status === 'Finished');

          let matchesProgress = true;
          if (projProgressFilter !== 'All') {
            const progress = p.progress;
            if (projProgressFilter === '0-20') matchesProgress = progress >= 0 && progress <= 20;
            else if (projProgressFilter === '21-50') matchesProgress = progress >= 21 && progress <= 50;
            else if (projProgressFilter === '51-75') matchesProgress = progress >= 51 && progress <= 75;
            else if (projProgressFilter === '76-100') matchesProgress = progress >= 76 && progress <= 100;
          }

          const matchesClient = projClientFilter === 'All' || p.clientName === projClientFilter;

          return matchesSearch && matchesStatus && matchesProgress && matchesClient;
        });

        const projTotalEntries = filteredProjects.length;
        const projIndexOfLastEntry = projCurrentPage * projEntriesPerPage;
        const projIndexOfFirstEntry = projIndexOfLastEntry - projEntriesPerPage;
        const projCurrentEntries = filteredProjects.slice(projIndexOfFirstEntry, projIndexOfLastEntry);
        const projTotalPages = Math.ceil(projTotalEntries / projEntriesPerPage) || 1;

        // Get unique clients for projects filter
        const uniqueProjectClients = Array.from(new Set(localProjects.map(p => p.clientName)));

        const getProgressBarColor = (progress: number) => {
          if (progress >= 85) return 'bg-emerald-500';
          if (progress >= 60) return 'bg-amber-500';
          if (progress >= 50) return 'bg-yellow-500';
          return 'bg-rose-500';
        };

        const getWeekDates = (startDate: Date) => {
          const dates = [];
          const temp = new Date(startDate);
          for (let i = 0; i < 7; i++) {
            dates.push(new Date(temp));
            temp.setDate(temp.getDate() + 1);
          }
          return dates;
        };

        return (
          <div className="space-y-6">
            {/* SEARCH AND FILTERS TOOLBAR */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Dynamic Leftmost Filter */}
                {projectsView === 'calendar' ? (
                  /* Client Name Filter for Calendar View */
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Client Name</label>
                    <select
                      value={projClientFilter}
                      onChange={(e) => { setProjClientFilter(e.target.value); setProjCurrentPage(1); }}
                      className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
                    >
                      <option value="All">All</option>
                      {uniqueProjectClients.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  /* Duration Filter for List View */
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Duration</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Start Date To End Date"
                        value={projDurationFilter}
                        onChange={(e) => setProjDurationFilter(e.target.value)}
                        className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none font-sans"
                      />
                    </div>
                  </div>
                )}

                {/* Status Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Status</label>
                  <select
                    value={projStatusFilter}
                    onChange={(e) => { setProjStatusFilter(e.target.value); setProjCurrentPage(1); }}
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
                  >
                    <option value="All">All</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Finished">Finished</option>
                    <option value="Not Started">Not Started</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                {/* Progress Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Progress</label>
                  <select
                    value={projProgressFilter}
                    onChange={(e) => { setProjProgressFilter(e.target.value); setProjCurrentPage(1); }}
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-sans"
                  >
                    <option value="All">0% - 20%, 21% - 50%, 51%...</option>
                    <option value="0-20">0% - 20%</option>
                    <option value="21-50">21% - 50%</option>
                    <option value="51-75">51% - 75%</option>
                    <option value="76-100">76% - 100%</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Start typing to search"
                      value={projSearchQuery}
                      onChange={(e) => { setProjSearchQuery(e.target.value); setProjCurrentPage(1); }}
                      className="w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION ROW & VIEW SWITCHER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors font-sans"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Project</span>
                </button>
                <button
                  onClick={() => alert("Projects exported successfully as Excel/CSV.")}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors font-sans"
                >
                  <Download className="h-4 w-4 text-slate-400" />
                  <span>Export</span>
                </button>
              </div>

              {/* View Switcher Icons matching screenshots exactly */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setProjectsView('list')}
                  className={`p-2 transition-colors cursor-pointer border-r border-slate-200 ${
                    projectsView === 'list' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setProjectsView('calendar')}
                  className={`p-2 transition-colors cursor-pointer border-r border-slate-200 ${
                    projectsView === 'calendar' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Calendar View"
                >
                  <Calendar className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setProjectsView('gantt')}
                  className={`p-2 transition-colors cursor-pointer ${
                    projectsView === 'gantt' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Gantt Timeline"
                >
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* LIST VIEW (TABLE) */}
            {projectsView === 'list' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden font-sans">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider font-sans">
                        <th className="px-5 py-4 w-12 text-center">
                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                        </th>
                        <th className="px-4 py-4 w-20">Code</th>
                        <th className="px-5 py-4">Project Name</th>
                        <th className="px-5 py-4">Members</th>
                        <th className="px-5 py-4">Start Date</th>
                        <th className="px-5 py-4">Deadline</th>
                        <th className="px-5 py-4">Client</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-center w-16">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
                      {projCurrentEntries.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-5 py-10 text-center text-slate-400 font-medium font-sans">
                            No projects match the selected filter criteria.
                          </td>
                        </tr>
                      ) : (
                        projCurrentEntries.map(p => {
                          const isOverdue = p.endDate < '2026-07-05' && p.status !== 'Finished';
                          
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="px-5 py-4 text-center">
                                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                              </td>
                              <td className="px-4 py-4 font-mono font-bold text-slate-400">{p.code || p.id.substring(0, 3)}</td>
                              <td className="px-5 py-4">
                                <div 
                                  className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                                  onClick={() => alert(`Project detail:\n\nName: ${p.name}\nBudget: $${p.budget}\nSpent: $${p.spent}`)}
                                >
                                  {p.name}
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex -space-x-1.5 overflow-hidden">
                                  {p.members.slice(0, 3).map((memberName, idx) => (
                                    <img
                                      key={idx}
                                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                                      src={getMemberAvatar(memberName)}
                                      alt={memberName}
                                      title={memberName}
                                      referrerPolicy="no-referrer"
                                    />
                                  ))}
                                  {p.members.length > 3 && (
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 ring-2 ring-white text-[9px] font-bold text-slate-500 font-sans">
                                      +{p.members.length - 3}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-4 font-medium text-slate-500 font-sans">{formatDateDMY(p.startDate)}</td>
                              <td className={`px-5 py-4 font-medium font-sans ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                                {formatDateDMY(p.endDate)}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                  <img 
                                    src={p.clientAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'} 
                                    alt={p.clientName} 
                                    referrerPolicy="no-referrer"
                                    className="h-7 w-7 rounded-full object-cover border border-slate-100" 
                                  />
                                  <div>
                                    <div className="font-bold text-slate-800 text-xs">{p.clientName}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">{p.clientCompany || 'Stroman LLC'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 w-44">
                                <div className="space-y-1">
                                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor(p.progress)}`} 
                                      style={{ width: `${p.progress}%` }} 
                                    />
                                  </div>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                                    <div className="flex items-center gap-1">
                                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                                      <span className="lowercase">{p.status}</span>
                                    </div>
                                    <span className="text-slate-600">{p.progress}%</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-center relative">
                                <button 
                                  onClick={() => setActiveProjectDropdownId(activeProjectDropdownId === p.id ? null : p.id)}
                                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                
                                {activeProjectDropdownId === p.id && (
                                  <>
                                    <div className="fixed inset-0 z-10" onClick={() => setActiveProjectDropdownId(null)} />
                                    <div className="absolute right-4 top-12 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-20 min-w-[120px] text-left animate-fade-in font-sans">
                                      <button 
                                        onClick={() => {
                                          alert(`Editing simulated for project ${p.name}`);
                                          setActiveProjectDropdownId(null);
                                        }}
                                        className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                      >
                                        <Edit className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Edit Project</span>
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteProject(p.id)}
                                        className="w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-semibold"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* TABLE FOOTER */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Show</span>
                    <select 
                      value={projEntriesPerPage}
                      onChange={(e) => { setProjEntriesPerPage(Number(e.target.value)); setProjCurrentPage(1); }}
                      className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-semibold focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Showing {projTotalEntries === 0 ? 0 : projIndexOfFirstEntry + 1} to {Math.min(projIndexOfLastEntry, projTotalEntries)} of {projTotalEntries} entries
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setProjCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={projCurrentPage === 1}
                      className={`bg-white border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg ${
                        projCurrentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: projTotalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setProjCurrentPage(idx + 1)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                          projCurrentPage === idx + 1 ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setProjCurrentPage(prev => Math.min(prev + 1, projTotalPages))}
                      disabled={projCurrentPage === projTotalPages}
                      className={`bg-white border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg ${
                        projCurrentPage === projTotalPages ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CALENDAR VIEW */}
            {projectsView === 'calendar' && (() => {
              const weekDates = getWeekDates(currentCalendarWeekStart);
              const startMonthStr = weekDates[0].toLocaleString('en-US', { month: 'short' });
              const startDay = weekDates[0].getDate();
              const endMonthStr = weekDates[6].toLocaleString('en-US', { month: 'short' });
              const endDay = weekDates[6].getDate();
              const yearStr = weekDates[0].getFullYear();
              
              const dateRangeStr = `${startMonthStr} ${startDay} – ${endMonthStr === startMonthStr ? '' : endMonthStr + ' '}${endDay}, ${yearStr}`;

              return (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden font-sans">
                  {/* Week Calendar Navigation Toolbar */}
                  <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => {
                            const prev = new Date(currentCalendarWeekStart);
                            prev.setDate(prev.getDate() - 7);
                            setCurrentCalendarWeekStart(prev);
                          }}
                          className="p-2 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200 cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const next = new Date(currentCalendarWeekStart);
                            next.setDate(next.getDate() + 7);
                            setCurrentCalendarWeekStart(next);
                          }}
                          className="p-2 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => setCurrentCalendarWeekStart(new Date('2026-07-05'))}
                        className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-white"
                      >
                        today
                      </button>
                    </div>

                    <div className="text-xs font-extrabold text-slate-800 tracking-wider font-sans">
                      {dateRangeStr}
                    </div>

                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white text-[11px] font-bold">
                      {['month', 'week', 'day', 'list'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => alert(`Calendar mode "${mode}" simulated.`)}
                          className={`px-3 py-1.5 border-r last:border-r-0 border-slate-200 transition-colors uppercase ${
                            mode === 'list' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Days List */}
                  <div className="divide-y divide-slate-100">
                    {weekDates.map((date, dateIdx) => {
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                      const fullDateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                      const formattedYMD = date.toISOString().split('T')[0];
                      
                      // Find projects active on this date
                      const activeProjectsOnDay = filteredProjects.filter(p => {
                        return p.startDate <= formattedYMD && p.endDate >= formattedYMD;
                      });

                      return (
                        <div key={dateIdx} className="p-4 space-y-2 hover:bg-slate-50/20 transition-colors">
                          <div className="flex items-baseline justify-between">
                            <h4 className="text-xs font-extrabold text-slate-800">{dayName}</h4>
                            <span className="text-[10px] text-slate-400 font-medium font-sans">{fullDateStr}</span>
                          </div>

                          <div className="space-y-1.5 pl-2">
                            {activeProjectsOnDay.length === 0 ? (
                              <p className="text-[10px] text-slate-400 italic font-medium">No projects scheduled</p>
                            ) : (
                              activeProjectsOnDay.map((p) => (
                                <div key={p.id} className="flex items-center gap-3 py-1 text-xs">
                                  <span className="text-[10px] text-slate-400 font-semibold w-12">all-day</span>
                                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                                  <span 
                                    className="font-bold text-slate-800 hover:text-indigo-600 cursor-pointer transition-colors" 
                                    onClick={() => alert(`Project Name: ${p.name}\nClient: ${p.clientName}\nStatus: ${p.status}\nProgress: ${p.progress}%`)}
                                  >
                                    {p.name}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* GANTT VIEW (TIMELINE VISUALIZER) */}
            {projectsView === 'gantt' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-950">Gantt Milestone Roadmap</h4>
                  <p className="text-xs text-slate-500">Visual weekly progression path across fiscal quarters</p>
                </div>

                <div className="space-y-4">
                  {roadmapMilestones.map((milestone, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{milestone.title}</span>
                        <div className="flex gap-2 items-center text-[10px] font-mono text-slate-500">
                          <span>Timeline: {milestone.start} to {milestone.duration}</span>
                          <span className="font-bold text-indigo-600">({milestone.progress}% Done)</span>
                        </div>
                      </div>

                      {/* Progress track */}
                      <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden border border-slate-200/50 flex">
                        <div className={`h-full bg-transparent ${
                          milestone.start === 'W2' ? 'w-1/12' :
                          milestone.start === 'W4' ? 'w-3/12' :
                          milestone.start === 'W7' ? 'w-6/12' :
                          milestone.start === 'W8' ? 'w-7/12' : ''
                        }`} />
                        <div className={`h-full ${milestone.color} rounded-lg flex items-center pl-3 text-[9px] font-bold text-white shadow-xs`} style={{
                          width: milestone.duration === 'W2' ? '20%' :
                                 milestone.duration === 'W3' ? '30%' :
                                 milestone.duration === 'W4' ? '40%' : '15%'
                        }}>
                          {milestone.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* 2. RECREATED ADVANCED TASK MODULE */}
      {subTab === 'tasks' && (
        <div className="space-y-6 font-sans">
          {/* HEADER ROW */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {taskViewMode === 'list' && 'Tasks'}
                {taskViewMode === 'board' && 'Task Board'}
                {taskViewMode === 'calendar' && 'Task Calendar'}
                {taskViewMode === 'private' && 'Tasks'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {taskViewMode === 'list' && 'Tasks Home • Tasks'}
                {taskViewMode === 'board' && 'Home • Tasks • Task Board'}
                {taskViewMode === 'calendar' && 'Home • Tasks • Task Calendar'}
                {taskViewMode === 'private' && 'Tasks Home • Tasks'}
              </p>
            </div>
            
            {/* View Switchers on Top-Right */}
            <div className="flex items-center gap-1 border border-slate-200 bg-slate-50 p-1 rounded-xl">
              <button
                onClick={() => { setTaskViewMode('list'); setTaskStatusFilter('Hide Completed Task'); }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${taskViewMode === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setTaskViewMode('board'); setTaskStatusFilter('All'); }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${taskViewMode === 'board' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                title="Kanban Board"
              >
                <Layers className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setTaskViewMode('calendar'); }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${taskViewMode === 'calendar' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                title="Task Calendar"
              >
                <Calendar className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setTaskViewMode('private'); setTaskStatusFilter('All'); }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${taskViewMode === 'private' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                title="Private Tasks View"
              >
                <div className="relative">
                  <Lock className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-2 h-2" />
                </div>
              </button>
            </div>
          </div>

          {/* CONTROL BAR (FILTERS) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Duration / Date Filter */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration</label>
              <select
                className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                value={taskDuration}
                onChange={(e) => {
                  setTaskDuration(e.target.value);
                  if (e.target.value === 'Overdue') {
                    setTaskStartDate('');
                    setTaskEndDate('2026-07-04'); // Before current day
                  } else if (e.target.value === 'This Week') {
                    setTaskStartDate('2026-07-05');
                    setTaskEndDate('2026-07-11');
                  } else {
                    setTaskStartDate('');
                    setTaskEndDate('');
                  }
                }}
              >
                <option value="Start Date To End Date">Start Date To End Date</option>
                <option value="All">All Duration</option>
                <option value="This Week">This Week (Jul 5 - Jul 11)</option>
                <option value="This Month">This Month (July)</option>
                <option value="Overdue">Overdue Tasks</option>
              </select>
            </div>

            {/* Project filter (Or Custom Date pickers if Duration mode matches) */}
            {taskDuration === 'Start Date To End Date' ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">From</label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={taskStartDate}
                    onChange={(e) => setTaskStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">To</label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={taskEndDate}
                    onChange={(e) => setTaskEndDate(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  value={taskProjectFilter}
                  onChange={(e) => setTaskProjectFilter(e.target.value)}
                >
                  <option value="All">All Projects</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Dropdown */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <select
                className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
              >
                <option value="Hide Completed Task">Hide Completed Task</option>
                <option value="All">All Statuses</option>
                <option value="Incomplete">Incomplete</option>
                <option value="To Do">To Do</option>
                <option value="Doing">Doing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="space-y-1 relative">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Start typing to search"
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTON BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-wrap gap-2">
              {taskViewMode !== 'private' ? (
                <>
                  <button
                    onClick={() => handleOpenAddTaskModal()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Task</span>
                  </button>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Upload className="h-4 w-4 text-slate-500" />
                    <span>Import</span>
                  </button>
                  <button
                    onClick={handleExportTasks}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Download className="h-4 w-4 text-slate-500" />
                    <span>Export</span>
                  </button>
                  {taskViewMode === 'board' && (
                    <button
                      onClick={() => setTaskSearch('Elena Rostova')}
                      className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      <span>My Tasks</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={handleExportTasks}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <Download className="h-4 w-4 text-slate-500" />
                  <span>Export</span>
                </button>
              )}
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Active Filters: <span className="text-indigo-600 font-bold">{getFilteredTasks(taskViewMode === 'private').length}</span> matching tasks
            </div>
          </div>

          {/* WARNING NOTE BANNER FOR KANBAN BOARD */}
          {taskViewMode === 'board' && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-800 font-medium leading-relaxed shadow-2xs">
              Note: You cannot move the task to or from the 'Waiting for Approval' column. To update the task status, please go to the Tasks menu.
            </div>
          )}

          {/* VIEW RENDERERS */}

          {/* 1. LIST VIEW */}
          {(taskViewMode === 'list' || taskViewMode === 'private') && (() => {
            const isPrivate = taskViewMode === 'private';
            const filtered = getFilteredTasks(isPrivate);
            const sorted = getSortedTasks(filtered);

            // Pagination calculations
            const totalEntries = sorted.length;
            const totalPages = Math.ceil(totalEntries / taskEntriesPerPage) || 1;
            const indexOfLastEntry = taskCurrentPage * taskEntriesPerPage;
            const indexOfFirstEntry = indexOfLastEntry - taskEntriesPerPage;
            const currentEntries = sorted.slice(indexOfFirstEntry, indexOfLastEntry);

            return (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="px-5 py-4 w-12 text-center">
                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                        </th>
                        {[
                          { label: 'Code', field: 'code' },
                          { label: 'Task', field: 'title' },
                          { label: 'Completed On', field: 'completedOn' },
                          { label: 'Start Date', field: 'startDate' },
                          { label: 'Due Date', field: 'dueDate' },
                          { label: 'Estimated Time', field: 'estimatedTime' },
                          { label: 'Hours Logged', field: 'hoursLogged' },
                          { label: 'Assigned To', field: 'assignedTo' },
                          { label: 'Status', field: 'status' }
                        ].map((col) => (
                          <th 
                            key={col.field} 
                            className="px-5 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                            onClick={() => {
                              if (taskSortField === col.field) {
                                setTaskSortOrder(taskSortOrder === 'asc' ? 'desc' : 'asc');
                              } else {
                                setTaskSortField(col.field);
                                setTaskSortOrder('asc');
                              }
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{col.label}</span>
                              <span className="text-[9px] text-slate-400">
                                {taskSortField === col.field ? (taskSortOrder === 'asc' ? '▲' : '▼') : '↕'}
                              </span>
                            </div>
                          </th>
                        ))}
                        <th className="px-5 py-4 text-center w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {currentEntries.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="px-5 py-16 text-center text-slate-400 font-medium">
                            <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-bold text-slate-600">No tasks available</p>
                            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria, or add a new task.</p>
                          </td>
                        </tr>
                      ) : (
                        currentEntries.map((task) => {
                          const isTaskBeingTracked = activeTimer?.isRunning && activeTimer?.taskId === task.id;
                          const isOverdue = task.status !== 'Completed' && task.dueDate < '2026-07-05';

                          return (
                            <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-5 py-4 text-center">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                                  checked={task.status === 'Completed'}
                                  onChange={() => handleToggleTaskRowComplete(task.id)}
                                />
                              </td>
                              <td className="px-5 py-4">
                                <div className="space-y-1.5">
                                  <div className="font-bold text-slate-900">{task.code || task.id}</div>
                                  
                                  {/* Micro Timer play/pause indicator */}
                                  {task.status !== 'Completed' && (
                                    <div>
                                      {isTaskBeingTracked ? (
                                        <button
                                          onClick={onStopTimer}
                                          className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-all flex items-center gap-1 text-[9px] font-black cursor-pointer animate-pulse"
                                        >
                                          <Square className="h-2.5 w-2.5 fill-current" />
                                          <span>TICKING</span>
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => onStartTimer(task.id, task.title, task.projectName)}
                                          className="p-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg border border-indigo-100 transition-all flex items-center gap-1 text-[9px] font-bold cursor-pointer opacity-80 group-hover:opacity-100"
                                        >
                                          <Play className="h-2.5 w-2.5 fill-current" />
                                          <span>TRACK</span>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span 
                                      onClick={() => handleOpenEditTaskModal(task)}
                                      className={`font-black text-slate-900 hover:text-indigo-600 cursor-pointer hover:underline transition-colors ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}
                                    >
                                      {task.title}
                                    </span>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                                      task.priority === 'High' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                      'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-semibold">{task.projectName}</div>
                                </div>
                              </td>
                              <td className="px-5 py-4 font-mono font-medium text-slate-500">
                                {task.completedOn || '--'}
                              </td>
                              <td className="px-5 py-4 font-mono font-medium text-slate-500">
                                {task.startDate ? task.startDate.split('-').reverse().join('-') : '--'}
                              </td>
                              <td className={`px-5 py-4 font-mono font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-500'}`}>
                                {task.dueDate.split('-').reverse().join('-')}
                              </td>
                              <td className="px-5 py-4 font-mono font-semibold text-slate-700">
                                {task.estimatedTime || '0s'}
                              </td>
                              <td className="px-5 py-4 font-mono font-semibold text-slate-500">
                                {task.hoursLogged || '0s'}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  {task.assignedAvatar ? (
                                    <img 
                                      src={task.assignedAvatar} 
                                      alt={task.assignedTo} 
                                      referrerPolicy="no-referrer"
                                      className="w-6 h-6 rounded-full object-cover border border-slate-200" 
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-extrabold text-slate-700">
                                      {task.assignedTo.substring(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                  <span className="font-medium text-slate-800 text-[11px] whitespace-nowrap">{task.assignedTo}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <span className={`w-2 h-2 rounded-full ${
                                    task.status === 'Completed' ? 'bg-emerald-500' :
                                    task.status === 'Doing' ? 'bg-sky-400' :
                                    task.status === 'To Do' ? 'bg-yellow-400' :
                                    'bg-rose-500'
                                  }`} />
                                  <span className="text-slate-800">{task.status}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-center relative">
                                <button
                                  onClick={() => setActiveTaskRowDropdownId(activeTaskRowDropdownId === task.id ? null : task.id)}
                                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>

                                {activeTaskRowDropdownId === task.id && (
                                  <div className="absolute right-6 top-10 bg-white rounded-xl border border-slate-100 shadow-xl py-1.5 w-36 text-left z-50 animate-fade-in font-sans">
                                    <button
                                      onClick={() => handleOpenEditTaskModal(task)}
                                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
                                    >
                                      Edit Task
                                    </button>
                                    <button
                                      onClick={() => handleToggleTaskRowComplete(task.id)}
                                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                                    >
                                      {task.status === 'Completed' ? 'Mark Incomplete' : 'Mark Completed'}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setLocalTasks(prev => prev.map(t => t.id === task.id ? { ...t, isPrivate: !t.isPrivate } : t));
                                        setActiveTaskRowDropdownId(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                                    >
                                      {task.isPrivate ? 'Make Public' : 'Make Private'}
                                    </button>
                                    <hr className="my-1 border-slate-100" />
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
                                          handleDeleteTask(task.id);
                                        }
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 font-black cursor-pointer"
                                    >
                                      Delete Task
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* TABLE FOOTER / PAGINATION */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Show</span>
                    <select
                      value={taskEntriesPerPage}
                      onChange={(e) => { setTaskEntriesPerPage(Number(e.target.value)); setTaskCurrentPage(1); }}
                      className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="text-xs text-slate-500 font-semibold">
                    Showing {totalEntries === 0 ? 0 : indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
                  </div>

                  <div className="flex items-center gap-1 font-sans">
                    <button
                      disabled={taskCurrentPage === 1}
                      onClick={() => setTaskCurrentPage(taskCurrentPage - 1)}
                      className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-slate-50 disabled:hover:bg-white cursor-pointer transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setTaskCurrentPage(pageNum)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          taskCurrentPage === pageNum 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      disabled={taskCurrentPage === totalPages}
                      onClick={() => setTaskCurrentPage(taskCurrentPage + 1)}
                      className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-slate-50 disabled:hover:bg-white cursor-pointer transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. BOARD (KANBAN) VIEW */}
          {taskViewMode === 'board' && (() => {
            const columns: ('Incomplete' | 'To Do' | 'Doing' | 'Completed')[] = ['Incomplete', 'To Do', 'Doing', 'Completed'];
            const columnStyles = {
              Incomplete: { dot: 'bg-rose-500', text: 'text-rose-600' },
              'To Do': { dot: 'bg-yellow-500', text: 'text-yellow-600' },
              Doing: { dot: 'bg-sky-400', text: 'text-sky-600' },
              Completed: { dot: 'bg-emerald-500', text: 'text-emerald-600' }
            };

            const tasksForBoard = getFilteredTasks(false);

            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
                {columns.map((columnStatus) => {
                  const columnTasks = tasksForBoard.filter(t => t.status === columnStatus);

                  return (
                    <div 
                      key={columnStatus} 
                      className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col gap-4 min-h-[500px]"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const taskId = e.dataTransfer.getData('text/plain');
                        handleUpdateTaskStatus(taskId, columnStatus);
                      }}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 font-sans">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${columnStyles[columnStatus].dot}`} />
                          <h4 className="text-xs font-bold text-slate-900 tracking-wide">{columnStatus}</h4>
                          <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                            {columnTasks.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <button className="p-1 hover:text-slate-600 cursor-pointer">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Task cards list */}
                      <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[600px] scrollbar-thin">
                        {columnTasks.length === 0 ? (
                          <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-[10px] text-slate-400 italic">
                            No tasks in this stage
                          </div>
                        ) : (
                          columnTasks.map((task) => {
                            const isTaskBeingTracked = activeTimer?.isRunning && activeTimer?.taskId === task.id;
                            const isOverdue = task.status !== 'Completed' && task.dueDate < '2026-07-05';

                            return (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                                className={`bg-white p-4 rounded-xl border shadow-sm transition-all relative cursor-grab active:cursor-grabbing hover:shadow-md ${
                                  isTaskBeingTracked ? 'border-red-400 ring-2 ring-red-50' : 'border-slate-200 hover:border-indigo-400'
                                }`}
                              >
                                {/* Left priority border */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                                  task.priority === 'High' ? 'bg-rose-500' :
                                  task.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                                }`} />

                                <div className="pl-1.5 space-y-3">
                                  {/* Code and Toggle complete */}
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="text-[9px] font-black text-slate-400 tracking-wider">
                                      #{task.code || task.id}
                                    </span>
                                    <button
                                      onClick={() => handleToggleTaskRowComplete(task.id)}
                                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                      {task.status === 'Completed' ? (
                                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 fill-current" />
                                      ) : (
                                        <Circle className="h-4.5 w-4.5" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Title & Description */}
                                  <div className="space-y-1">
                                    <h5 
                                      onClick={() => handleOpenEditTaskModal(task)}
                                      className={`text-xs font-bold text-slate-900 leading-snug cursor-pointer hover:text-indigo-600 hover:underline ${
                                        task.status === 'Completed' ? 'line-through text-slate-400' : ''
                                      }`}
                                    >
                                      {task.title}
                                    </h5>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                      <Briefcase className="h-3 w-3 text-slate-300" />
                                      <span className="truncate max-w-[150px]">{task.projectName}</span>
                                    </div>
                                  </div>

                                  {/* Bottom Section */}
                                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                    {/* Assigned Member */}
                                    <div className="flex items-center gap-1.5">
                                      {task.assignedAvatar ? (
                                        <img 
                                          src={task.assignedAvatar} 
                                          alt={task.assignedTo} 
                                          referrerPolicy="no-referrer"
                                          className="w-5.5 h-5.5 rounded-full object-cover border border-slate-100" 
                                        />
                                      ) : (
                                        <div className="w-5.5 h-5.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-extrabold text-slate-600">
                                          {task.assignedTo.substring(0, 2).toUpperCase()}
                                        </div>
                                      )}
                                      <span className="text-[9px] text-slate-500 font-bold whitespace-nowrap">{task.assignedTo.split(' ')[0]}</span>
                                    </div>

                                    {/* Due Date & Overdue Highlight */}
                                    <div className="flex items-center gap-1 font-mono text-[9px] font-bold">
                                      <Calendar className={`h-3 w-3 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
                                      <span className={isOverdue ? 'text-rose-600' : 'text-slate-500'}>
                                        {task.dueDate.split('-').reverse().slice(0, 2).join('-')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Dash add block at bottom of stage column */}
                      <button
                        onClick={() => handleOpenAddTaskModal(columnStatus)}
                        className="w-full py-2.5 border border-dashed border-slate-300 hover:border-indigo-400 rounded-xl bg-white hover:bg-slate-50/50 text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Task</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* 3. CALENDAR VIEW */}
          {taskViewMode === 'calendar' && (() => {
            const startOfWeek = new Date(taskCalendarDate);
            const dayOffset = startOfWeek.getDay();
            const sunday = new Date(startOfWeek.setDate(taskCalendarDate.getDate() - dayOffset));
            
            const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
              const d = new Date(sunday);
              d.setDate(sunday.getDate() + i);
              return d;
            });

            const dateRangeStr = `${daysOfWeek[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${daysOfWeek[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

            const tasksForCalendar = getFilteredTasks(false);

            return (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden font-sans">
                {/* Navigation Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <button 
                        onClick={() => {
                          const prev = new Date(taskCalendarDate);
                          prev.setDate(prev.getDate() - 7);
                          setTaskCalendarDate(prev);
                        }}
                        className="p-2 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200 cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const next = new Date(taskCalendarDate);
                          next.setDate(next.getDate() + 7);
                          setTaskCalendarDate(next);
                        }}
                        className="p-2 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => setTaskCalendarDate(new Date('2026-07-05'))}
                      className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-white"
                    >
                      today
                    </button>
                  </div>

                  <div className="text-xs font-extrabold text-slate-800 tracking-wider">
                    {dateRangeStr}
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white text-[11px] font-bold">
                    {['month', 'week', 'day', 'list'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setTaskCalendarMode(mode as any)}
                        className={`px-3 py-1.5 border-r last:border-r-0 border-slate-200 transition-all uppercase ${
                          mode === taskCalendarMode ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendar body render */}
                <div className="divide-y divide-slate-100">
                  {daysOfWeek.map((date, idx) => {
                    const fullDateYMD = date.toISOString().split('T')[0];
                    const dayTasks = tasksForCalendar.filter(t => t.dueDate === fullDateYMD);
                    const isToday = fullDateYMD === '2026-07-05';

                    return (
                      <div key={idx} className={`p-4 space-y-3 transition-colors hover:bg-slate-50/20 ${isToday ? 'bg-indigo-50/10' : ''}`}>
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-800 bg-slate-100'}`}>
                              {date.toLocaleDateString('en-US', { day: 'numeric' })}
                            </span>
                            <span className="text-xs font-black text-slate-700">{date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">
                            {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Task items for this day */}
                        <div className="pl-8 space-y-2">
                          {dayTasks.length === 0 ? (
                            <p className="text-[10px] text-slate-400 italic">No tasks due on this day</p>
                          ) : (
                            dayTasks.map(task => (
                              <div 
                                key={task.id} 
                                onClick={() => handleOpenEditTaskModal(task)}
                                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/60 bg-white hover:border-indigo-400 cursor-pointer shadow-3xs hover:shadow-xs transition-all max-w-2xl"
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`w-2 h-2 rounded-full ${
                                    task.priority === 'High' ? 'bg-rose-500' :
                                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                                  }`} />
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-900">{task.title}</h5>
                                    <p className="text-[9px] text-indigo-600 font-semibold">{task.projectName}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded">
                                    {task.status}
                                  </span>
                                  <img 
                                    src={task.assignedAvatar} 
                                    alt={task.assignedTo} 
                                    referrerPolicy="no-referrer"
                                    className="w-5 h-5 rounded-full object-cover border" 
                                  />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. TIMESHEET WORK logs */}
      {subTab === 'timesheet' && (() => {
        // Filter and Search logic for timesheets
        const filteredTimesheets = timesheets.filter(t => {
          // Employee Filter
          if (timesheetEmployeeFilter !== 'All' && t.employeeName !== timesheetEmployeeFilter) return false;
          
          // Department Filter
          if (timesheetDepartmentFilter !== 'All' && t.department !== timesheetDepartmentFilter) return false;
          
          // Search Filter
          if (timesheetSearch) {
            const s = timesheetSearch.toLowerCase();
            const match = t.taskTitle.toLowerCase().includes(s) || 
                          t.projectName.toLowerCase().includes(s) || 
                          t.employeeName.toLowerCase().includes(s) || 
                          (t.memo && t.memo.toLowerCase().includes(s));
            if (!match) return false;
          }
          
          // Duration Filter
          if (timesheetDuration === 'This Week') {
            return t.startDate >= '2026-06-29' && t.startDate <= '2026-07-05';
          } else if (timesheetDuration === 'This Month') {
            return t.startDate.startsWith('2026-07') || t.startDate.startsWith('2026-06');
          } else if (timesheetDuration === 'Start Date To End Date') {
            if (timesheetStartDate && t.startDate < timesheetStartDate) return false;
            if (timesheetEndDate && t.startDate > timesheetEndDate) return false;
          }
          return true;
        });

        // Sorting logic
        const sortedTimesheets = [...filteredTimesheets].sort((a, b) => {
          let valA = a[timesheetSortField];
          let valB = b[timesheetSortField];
          if (typeof valA === 'string') {
            return timesheetSortOrder === 'asc' 
              ? valA.localeCompare(valB) 
              : valB.localeCompare(valA);
          } else {
            return timesheetSortOrder === 'asc' 
              ? (valA > valB ? 1 : -1) 
              : (valA < valB ? 1 : -1);
          }
        });

        // Pagination
        const totalEntries = sortedTimesheets.length;
        const totalPages = Math.ceil(totalEntries / timesheetEntriesPerPage) || 1;
        const indexOfLastEntry = timesheetCurrentPage * timesheetEntriesPerPage;
        const indexOfFirstEntry = indexOfLastEntry - timesheetEntriesPerPage;
        const currentEntries = sortedTimesheets.slice(indexOfFirstEntry, indexOfLastEntry);

        // Grand Totals for summary cards
        const totalHoursLogged = filteredTimesheets.reduce((sum, t) => sum + t.totalHours, 0);
        const totalEarnings = filteredTimesheets.reduce((sum, t) => sum + t.earnings, 0);

        const handleExportTimesheetsCSV = () => {
          const headers = ['ID', 'Task Code', 'Task Title', 'Project', 'Employee', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Total Hours', 'Earnings', 'Status'];
          const rows = timesheets.map(t => [
            t.id,
            t.code,
            `"${t.taskTitle.replace(/"/g, '""')}"`,
            `"${t.projectName.replace(/"/g, '""')}"`,
            t.employeeName,
            t.startDate,
            t.startTime,
            t.endDate,
            t.endTime,
            t.totalHours,
            t.earnings,
            t.status
          ]);
          const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "timesheets_export.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        // Approve pending timesheets
        const handleApproveAllPending = () => {
          setTimesheets(prev => prev.map(t => t.status === 'Pending' ? { ...t, status: 'Approved' } : t));
          setApproveTimesheetsCount(0);
          setWeeklyApprovalStatus('Approved');
          alert('All submitted timesheet logs have been reviewed and approved successfully.');
        };

        // Submit weekly timesheet
        const handleSubmitWeeklyTimesheet = () => {
          setWeeklyApprovalStatus('Pending');
          setApproveTimesheetsCount(prev => prev + 1);
          alert('Weekly timesheet has been submitted to management for approval.');
        };

        // Interactive weekly row hour updates
        const handleWeeklyHourChange = (rowId: string, dayIdx: number, val: string) => {
          const num = Number(val) || 0;
          setWeeklyRows(prev => prev.map(row => {
            if (row.id === rowId) {
              const updatedHours = [...row.hours];
              updatedHours[dayIdx] = num;
              return { ...row, hours: updatedHours };
            }
            return row;
          }));
        };

        const handleAddWeeklyRow = () => {
          const newRow = {
            id: `row-${Date.now()}`,
            taskId: 'TSK-403',
            projectName: 'SaaS Platform Redesign',
            taskTitle: 'Connect Gemini client integrations',
            hours: [0, 0, 0, 0, 0, 0, 0]
          };
          setWeeklyRows([...weeklyRows, newRow]);
        };

        return (
          <div className="space-y-6 font-sans">
            {/* TIMESHEET HEADER CARD */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Timesheet</span>
                  <span className="text-xs font-normal text-slate-400">Home • Timesheet</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Track project hours, log time, submit weekly work sheets, and manage billable project earnings.
                </p>
              </div>

              {/* View Switchers */}
              <div className="flex items-center gap-1 border border-slate-200 bg-slate-50 p-1 rounded-xl">
                <button
                  onClick={() => setTimesheetViewMode('list')}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${timesheetViewMode === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Timesheet List"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTimesheetViewMode('week')}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${timesheetViewMode === 'week' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Weekly Timesheet"
                >
                  <Layers className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTimesheetViewMode('calendar')}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${timesheetViewMode === 'calendar' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Calendar View"
                >
                  <Calendar className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTimesheetViewMode('summary')}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${timesheetViewMode === 'summary' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Employee Summary"
                >
                  <User className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTimesheetViewMode('lifecycle')}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${timesheetViewMode === 'lifecycle' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Timesheet Lifecycle"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* TOTALS OVERVIEW ROW (Only shown in List, Summary and Calendar) */}
            {timesheetViewMode !== 'lifecycle' && timesheetViewMode !== 'week' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="p-3.5 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100/50">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Logged Time</div>
                    <div className="text-2xl font-black text-slate-900 font-sans mt-0.5">{totalHoursLogged.toFixed(1)} <span className="text-xs text-slate-500 font-bold">hrs</span></div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Logged Earnings</div>
                    <div className="text-2xl font-black text-slate-900 font-sans mt-0.5">${totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                </div>
              </div>
            )}

            {/* CONTROL FILTERS BAR */}
            {timesheetViewMode !== 'lifecycle' && timesheetViewMode !== 'week' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Duration */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer font-sans font-medium"
                    value={timesheetDuration}
                    onChange={(e) => setTimesheetDuration(e.target.value)}
                  >
                    <option value="All">All Duration</option>
                    <option value="This Week">This Week (Jun 29 - Jul 05)</option>
                    <option value="This Month">This Month (July 2026)</option>
                    <option value="Start Date To End Date">Start Date To End Date</option>
                  </select>
                </div>

                {/* Custom Date Inputs */}
                {timesheetDuration === 'Start Date To End Date' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">From</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none font-sans"
                        value={timesheetStartDate}
                        onChange={(e) => setTimesheetStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">To</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none font-sans"
                        value={timesheetEndDate}
                        onChange={(e) => setTimesheetEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee</label>
                    <select
                      className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer font-sans font-medium"
                      value={timesheetEmployeeFilter}
                      onChange={(e) => setTimesheetEmployeeFilter(e.target.value)}
                    >
                      <option value="All">All Employees</option>
                      <option value="Bryon Ondricka">Bryon Ondricka</option>
                      <option value="Demetrius McClure">Demetrius McClure</option>
                      <option value="Elena Rostova">Elena Rostova</option>
                      <option value="James Carter">James Carter</option>
                      <option value="Daniel Park">Daniel Park</option>
                    </select>
                  </div>
                )}

                {/* Department Filter */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer font-sans font-medium"
                    value={timesheetDepartmentFilter}
                    onChange={(e) => setTimesheetDepartmentFilter(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="QA">QA</option>
                  </select>
                </div>

                {/* Search */}
                <div className="space-y-1 relative">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Start typing to search"
                      className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                      value={timesheetSearch}
                      onChange={(e) => setTimesheetSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ACTION ROW (Log Time, Export, etc.) */}
            {timesheetViewMode !== 'lifecycle' && timesheetViewMode !== 'week' && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setLogTimeProject(projects[0]?.id || 'PR-301');
                      setLogTimeTask(localTasks[0]?.id || 'TSK-401');
                      setLogTimeEmployee('Elena Rostova');
                      setShowLogTimeModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Log Time</span>
                  </button>
                  <button
                    onClick={handleExportTimesheetsCSV}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
                  >
                    <Download className="h-4 w-4 text-slate-400" />
                    <span>Export</span>
                  </button>
                  {timesheets.some(t => t.status === 'Pending') && (
                    <button
                      onClick={handleApproveAllPending}
                      className="bg-yellow-50 hover:bg-yellow-100 text-yellow-800 text-xs font-black px-4 py-2.5 rounded-xl border border-yellow-200 flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
                    >
                      <Check className="h-4 w-4 text-yellow-600" />
                      <span>Approve Logs ({timesheets.filter(t => t.status === 'Pending').length})</span>
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-400 font-bold">
                  Active Filter Match: <span className="text-indigo-600 font-black">{filteredTimesheets.length}</span> logs
                </div>
              </div>
            )}

            {/* ==================== VIEW 1: TIMESHEET LIST ==================== */}
            {timesheetViewMode === 'list' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-black tracking-wider">
                        <th className="px-5 py-4 w-12 text-center">
                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                        </th>
                        {[
                          { label: 'Id', field: 'id' },
                          { label: 'Code', field: 'code' },
                          { label: 'Task', field: 'taskTitle' },
                          { label: 'Employee', field: 'employeeName' },
                          { label: 'Start Time', field: 'startDate' },
                          { label: 'End Time', field: 'endDate' },
                          { label: 'Total Hours', field: 'totalHours' },
                          { label: 'Earnings', field: 'earnings' },
                          { label: 'Status', field: 'status' }
                        ].map((col) => (
                          <th
                            key={col.field}
                            className="px-5 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                            onClick={() => {
                              if (timesheetSortField === col.field) {
                                setTimesheetSortOrder(timesheetSortOrder === 'asc' ? 'desc' : 'asc');
                              } else {
                                setTimesheetSortField(col.field);
                                setTimesheetSortOrder('asc');
                              }
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{col.label}</span>
                              <span className="text-[9px] text-slate-400">
                                {timesheetSortField === col.field ? (timesheetSortOrder === 'asc' ? '▲' : '▼') : '↕'}
                              </span>
                            </div>
                          </th>
                        ))}
                        <th className="px-5 py-4 text-center w-16">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {currentEntries.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="px-5 py-16 text-center text-slate-400 font-medium">
                            <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-bold text-slate-600">No time log sessions found</p>
                            <p className="text-xs text-slate-400 mt-1">Try expanding filters or log a new time entry.</p>
                          </td>
                        </tr>
                      ) : (
                        currentEntries.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-4 text-center">
                              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                            </td>
                            <td className="px-5 py-4 font-mono font-bold text-slate-400">{log.id}</td>
                            <td className="px-5 py-4 font-mono font-bold text-slate-700">{log.code || '--'}</td>
                            <td className="px-5 py-4">
                              <div className="space-y-0.5">
                                <div className="font-bold text-slate-900">{log.taskTitle}</div>
                                <div className="text-[10px] text-indigo-600 font-bold">{log.projectName}</div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={log.employeeAvatar}
                                  alt={log.employeeName}
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-full object-cover border border-slate-100"
                                />
                                <div>
                                  <div className="font-bold text-slate-800">{log.employeeName}</div>
                                  <div className="text-[9px] text-slate-400 font-extrabold uppercase">{log.employeeRole}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-mono font-semibold text-slate-500 whitespace-nowrap">
                              {log.startDate.split('-').reverse().join('-')} <span className="text-[10px] font-normal text-slate-400">{log.startTime}</span>
                            </td>
                            <td className="px-5 py-4 font-mono font-semibold text-slate-500 whitespace-nowrap">
                              {log.endDate.split('-').reverse().join('-')} <span className="text-[10px] font-normal text-slate-400">{log.endTime}</span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1 font-mono font-black text-slate-800">
                                <span>{log.totalHours.toFixed(1)}h</span>
                                <CheckCircle className="h-3.5 w-3.5 text-indigo-500 fill-indigo-50" />
                              </div>
                            </td>
                            <td className="px-5 py-4 font-mono font-bold text-slate-900">
                              ${log.earnings.toFixed(2)}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                log.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center relative">
                              <button
                                onClick={() => setActiveTimesheetDropdownId(activeTimesheetDropdownId === log.id ? null : log.id)}
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {activeTimesheetDropdownId === log.id && (
                                <div className="absolute right-6 top-10 bg-white rounded-xl border border-slate-100 shadow-xl py-1.5 w-36 text-left z-50 animate-fade-in font-sans">
                                  {log.status === 'Pending' && (
                                    <button
                                      onClick={() => {
                                        setTimesheets(prev => prev.map(t => t.id === log.id ? { ...t, status: 'Approved' } : t));
                                        setActiveTimesheetDropdownId(null);
                                        alert('Time log approved.');
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs text-emerald-600 hover:bg-emerald-50 font-bold cursor-pointer"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete log ${log.id}?`)) {
                                        setTimesheets(prev => prev.filter(t => t.id !== log.id));
                                      }
                                      setActiveTimesheetDropdownId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 font-black cursor-pointer"
                                  >
                                    Delete Log
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION / FOOTER ROW */}
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Show</span>
                    <select
                      value={timesheetEntriesPerPage}
                      onChange={(e) => { setTimesheetEntriesPerPage(Number(e.target.value)); setTimesheetCurrentPage(1); }}
                      className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <div className="text-xs text-slate-500 font-bold">
                    Showing {totalEntries === 0 ? 0 : indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={timesheetCurrentPage === 1}
                      onClick={() => setTimesheetCurrentPage(timesheetCurrentPage - 1)}
                      className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-slate-50 disabled:hover:bg-white cursor-pointer transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setTimesheetCurrentPage(pageNum)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          timesheetCurrentPage === pageNum 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      disabled={timesheetCurrentPage === totalPages}
                      onClick={() => setTimesheetCurrentPage(timesheetCurrentPage + 1)}
                      className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 hover:bg-slate-50 disabled:hover:bg-white cursor-pointer transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== VIEW 2: WEEKLY TIMESHEETS ==================== */}
            {timesheetViewMode === 'week' && (
              <div className="space-y-6">
                {/* Weekly toolbar navigation */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <button 
                        onClick={() => {
                          const prev = new Date(weeklyStartDate);
                          prev.setDate(prev.getDate() - 7);
                          setWeeklyStartDate(prev);
                        }}
                        className="p-2.5 hover:bg-slate-50 text-slate-600 border-r border-slate-200 cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const next = new Date(weeklyStartDate);
                          next.setDate(next.getDate() + 7);
                          setWeeklyStartDate(next);
                        }}
                        className="p-2.5 hover:bg-slate-50 text-slate-600 cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setWeeklyStartDate(new Date('2026-06-29'))}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold bg-white cursor-pointer"
                    >
                      today
                    </button>

                    <span className="text-xs font-black text-slate-800 tracking-wider">
                      29 Jun – 05 Jul 2026
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                      weeklyApprovalStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      weeklyApprovalStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {weeklyApprovalStatus}
                    </span>

                    {approveTimesheetsCount > 0 && (
                      <button
                        onClick={handleApproveAllPending}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve Timesheets ({approveTimesheetsCount})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Hourly Input Grid Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-black tracking-wider">
                          <th className="px-5 py-4 w-72">Task / Project</th>
                          <th className="px-3 py-4 text-center">Mon <span className="text-slate-400 block font-normal text-[9px]">29 Jun</span></th>
                          <th className="px-3 py-4 text-center">Tue <span className="text-slate-400 block font-normal text-[9px]">30 Jun</span></th>
                          <th className="px-3 py-4 text-center">Wed <span className="text-slate-400 block font-normal text-[9px]">01 Jul</span></th>
                          <th className="px-3 py-4 text-center">Thu <span className="text-slate-400 block font-normal text-[9px]">02 Jul</span></th>
                          <th className="px-3 py-4 text-center">Fri <span className="text-slate-400 block font-normal text-[9px]">03 Jul</span></th>
                          <th className="px-3 py-4 text-center">Sat <span className="text-slate-400 block font-normal text-[9px]">04 Jul</span></th>
                          <th className="px-3 py-4 text-center">Sun <span className="text-slate-400 block font-normal text-[9px]">05 Jul</span></th>
                          <th className="px-5 py-4 text-center w-28">Total Hours</th>
                          <th className="px-3 py-4 text-center w-12">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {weeklyRows.map((row) => {
                          const rowTotal = row.hours.reduce((sum: number, h: number) => sum + h, 0);

                          return (
                            <tr key={row.id} className="hover:bg-slate-50/25">
                              <td className="px-5 py-4 font-sans">
                                <div className="font-bold text-slate-900">{row.taskTitle}</div>
                                <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">{row.projectName}</div>
                              </td>
                              {row.hours.map((hr: number, idx: number) => (
                                <td key={idx} className="px-2 py-4">
                                  <input
                                    type="text"
                                    className="w-12 mx-auto bg-slate-50 text-slate-800 text-center text-xs font-bold p-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono focus:bg-white"
                                    value={hr === 0 ? '' : hr}
                                    placeholder="0"
                                    onChange={(e) => handleWeeklyHourChange(row.id, idx, e.target.value)}
                                  />
                                </td>
                              ))}
                              <td className="px-5 py-4 text-center">
                                <div className="font-mono font-black text-slate-800 text-xs bg-slate-100/80 px-2 py-1 rounded-lg inline-block">{rowTotal} hrs</div>
                              </td>
                              <td className="px-3 py-4 text-center">
                                <button
                                  onClick={() => setWeeklyRows(prev => prev.filter(r => r.id !== row.id))}
                                  className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                  title="Delete task row"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                        {/* SUM TOTALS ROW */}
                        <tr className="bg-slate-50/50 font-black text-slate-900 border-t border-slate-200">
                          <td className="px-5 py-4 uppercase text-[10px] tracking-wider text-slate-500">Totals</td>
                          {Array.from({ length: 7 }).map((_, idx) => {
                            const colTotal = weeklyRows.reduce((sum, r) => sum + (r.hours[idx] || 0), 0);
                            return (
                              <td key={idx} className="px-2 py-4 text-center font-mono">
                                {colTotal}h
                              </td>
                            );
                          })}
                          <td className="px-5 py-4 text-center">
                            <div className="font-mono text-sm text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg inline-block">
                              {weeklyRows.reduce((grandSum, r) => grandSum + r.hours.reduce((s: number, h: number) => s + h, 0), 0)} hrs
                            </div>
                          </td>
                          <td className="px-3 py-4" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* BOTTOM OPERATIONS BAR */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <button
                    onClick={handleAddWeeklyRow}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-black px-4.5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
                  >
                    <Plus className="h-4 w-4 text-slate-500" />
                    <span>Add More</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setWeeklyApprovalStatus('Draft');
                        alert('Draft has been saved successfully in memory.');
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-2xs transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleSubmitWeeklyTimesheet}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Submit For Approval
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== VIEW 3: TIMESHEET CALENDAR ==================== */}
            {timesheetViewMode === 'calendar' && (() => {
              const startOfWeek = new Date(taskCalendarDate);
              const dayOffset = startOfWeek.getDay();
              const sunday = new Date(startOfWeek.setDate(taskCalendarDate.getDate() - dayOffset));
              
              const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(sunday);
                d.setDate(sunday.getDate() + i);
                return d;
              });

              return (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  {/* Navigation Toolbar */}
                  <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => {
                            const prev = new Date(taskCalendarDate);
                            prev.setDate(prev.getDate() - 7);
                            setTaskCalendarDate(prev);
                          }}
                          className="p-2 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200 cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const next = new Date(taskCalendarDate);
                            next.setDate(next.getDate() + 7);
                            setTaskCalendarDate(next);
                          }}
                          className="p-2 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => setTaskCalendarDate(new Date('2026-07-05'))}
                        className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-white"
                      >
                        today
                      </button>
                    </div>

                    <div className="text-xs font-extrabold text-slate-800 tracking-wider">
                      July 2026
                    </div>

                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white text-[11px] font-bold">
                      <span className="px-3 py-1.5 bg-slate-950 text-white uppercase select-none">
                        month
                      </span>
                      <span className="px-3 py-1.5 text-slate-400 bg-slate-100/50 cursor-not-allowed uppercase select-none border-l border-slate-200">
                        week
                      </span>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 border-b border-slate-100 text-center bg-slate-50 text-[10px] uppercase font-black text-slate-500 tracking-wider py-2">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                  </div>

                  <div className="grid grid-cols-7 grid-rows-5 divide-x divide-y divide-slate-100 bg-slate-50/10 min-h-[400px]">
                    {/* Render empty offset grids for June overflow (e.g. June ends on Tuesday) */}
                    <div className="p-2 bg-slate-50/30 text-right text-slate-300 font-bold font-mono text-[10px]">28</div>
                    <div className="p-2 bg-slate-50/30 text-right text-slate-300 font-bold font-mono text-[10px]">29</div>
                    <div className="p-2 bg-slate-50/30 text-right text-slate-300 font-bold font-mono text-[10px]">30</div>

                    {/* July Days */}
                    {Array.from({ length: 31 }, (_, dayIdx) => {
                      const dayNum = dayIdx + 1;
                      const dateStr = `2026-07-${String(dayNum).padStart(2, '0')}`;
                      const logsOnThisDay = timesheets.filter(t => t.startDate === dateStr);
                      const hoursOnThisDay = logsOnThisDay.reduce((sum, t) => sum + t.totalHours, 0);

                      return (
                        <div 
                          key={dayNum} 
                          onClick={() => {
                            setLogTimeStartDate(dateStr);
                            setLogTimeEndDate(dateStr);
                            setShowLogTimeModal(true);
                          }}
                          className="p-3 bg-white min-h-[90px] flex flex-col justify-between hover:bg-slate-50/80 transition-all cursor-pointer group"
                        >
                          <span className="text-right text-slate-700 font-black font-mono text-xs block group-hover:text-indigo-600 transition-colors">
                            {dayNum}
                          </span>

                          {hoursOnThisDay > 0 && (
                            <div className="bg-indigo-600 text-white rounded-lg p-1.5 text-center font-mono text-[9px] font-black tracking-wider shadow-2xs animate-fade-in">
                              {String(Math.floor(hoursOnThisDay)).padStart(2, '0')}hrs {String(Math.round((hoursOnThisDay % 1) * 60)).padStart(2, '0')}mins
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* August empty padding grids */}
                    <div className="p-2 bg-slate-50/30 text-right text-slate-300 font-bold font-mono text-[10px]">1</div>
                  </div>
                </div>
              );
            })()}

            {/* ==================== VIEW 4: EMPLOYEE SUMMARY ==================== */}
            {timesheetViewMode === 'summary' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { name: 'Elena Rostova', role: 'Lead Engineer', dept: 'Engineering', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
                  { name: 'James Carter', role: 'Senior Designer', dept: 'Design', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
                  { name: 'Daniel Park', role: 'QA Specialist', dept: 'QA', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
                  { name: 'Bryon Ondricka', role: 'Trainee', dept: 'Engineering', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
                  { name: 'Demetrius McClure', role: 'Trainee', dept: 'QA', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face' },
                ].map((emp, i) => {
                  const empLogs = timesheets.filter(t => t.employeeName === emp.name);
                  const empHours = empLogs.reduce((sum, t) => sum + t.totalHours, 0);
                  const empEarnings = empLogs.reduce((sum, t) => sum + t.earnings, 0);

                  return (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border border-slate-100"
                        />
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{emp.name}</h4>
                          <div className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">{emp.role} • {emp.dept}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-100 py-3 text-center">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Logged Hours</div>
                          <div className="font-mono text-xs font-black text-slate-800 mt-0.5">{empHours.toFixed(1)} hrs</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Earnings</div>
                          <div className="font-mono text-xs font-black text-slate-800 mt-0.5">${empEarnings.toFixed(2)}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setTimesheetEmployeeFilter(emp.name);
                          setTimesheetViewMode('list');
                        }}
                        className="w-full text-center py-2 border border-slate-200 hover:border-indigo-400 text-[10px] text-slate-500 hover:text-indigo-600 font-bold rounded-xl transition-all hover:bg-indigo-50/20 cursor-pointer"
                      >
                        View Log History
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ==================== VIEW 5: TIMESHEET LIFECYCLE ==================== */}
            {timesheetViewMode === 'lifecycle' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="max-w-md mx-auto text-center space-y-2 pb-2">
                  <h4 className="text-base font-black text-slate-900">Timesheet Life Cycle</h4>
                  <p className="text-xs text-slate-500 font-medium">How client project hours are recorded, validated, approved, and billed.</p>
                </div>

                {/* Flow Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative py-6 text-center">
                  {[
                    { title: 'Work', desc: 'Agent completes task scope', icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                    { title: 'Time Sheet', desc: 'Weekly work hours log', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                    { title: 'Log Time', desc: 'Time is registered', icon: Clock, color: 'text-violet-600 bg-violet-50 border-violet-100' },
                    { title: 'Billable Log', desc: 'Overhead is segregated', icon: Layers, color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100' },
                    { title: 'Invoice Sync', desc: 'Billable logs added', icon: Download, color: 'text-pink-600 bg-pink-50 border-pink-100' },
                    { title: 'Get Paid', desc: 'Client cleared payment', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                  ].map((step, idx) => {
                    const StepIcon = step.icon;

                    return (
                      <div key={idx} className="flex flex-col items-center space-y-3 p-4 rounded-2xl border border-slate-100 shadow-3xs relative bg-slate-50/30">
                        {/* Step Number Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm">
                          {idx + 1}
                        </div>

                        <div className={`p-3 rounded-xl border ${step.color} shadow-xs`}>
                          <StepIcon className="w-5 h-5" />
                        </div>

                        <div>
                          <h5 className="text-xs font-black text-slate-900">{step.title}</h5>
                          <p className="text-[10px] text-slate-400 font-medium mt-1 leading-snug">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-5 flex justify-end">
                  <button
                    onClick={() => setTimesheetViewMode('list')}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-all"
                  >
                    Close & Go to List
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. PROJECT ROADMAP (GANTT VISUALIZER AND ADVANCED LIST) */}
      {subTab === 'roadmap' && (() => {
        // Roadmaps can be filtered by:
        // - Status
        // - Progress Range
        // - Search Query
        // - Advanced Sidebar filters
        const filteredProjects = localProjects.filter(p => {
          // Status filter
          if (roadmapStatusFilter !== 'All' && p.status !== roadmapStatusFilter) return false;
          
          // Progress filter
          if (roadmapProgressFilter !== 'All') {
            if (roadmapProgressFilter === '0-20' && p.progress > 20) return false;
            if (roadmapProgressFilter === '21-50' && (p.progress < 21 || p.progress > 50)) return false;
            if (roadmapProgressFilter === '51-80' && (p.progress < 51 || p.progress > 80)) return false;
            if (roadmapProgressFilter === '81-100' && p.progress < 81) return false;
          }

          // Search
          if (roadmapSearch) {
            const s = roadmapSearch.toLowerCase();
            const match = p.name.toLowerCase().includes(s) || 
                          (p.code && p.code.toLowerCase().includes(s)) || 
                          p.clientName.toLowerCase().includes(s);
            if (!match) return false;
          }

          // Advanced Sidebar Filters
          if (advRoadmapClient !== 'All' && p.clientName !== advRoadmapClient) return false;
          if (advRoadmapStatus !== 'All' && p.status !== advRoadmapStatus) return false;
          if (advRoadmapProgress !== 'All') {
            if (advRoadmapProgress === '0-20' && p.progress > 20) return false;
            if (advRoadmapProgress === '21-50' && (p.progress < 21 || p.progress > 50)) return false;
            if (advRoadmapProgress === '51-80' && (p.progress < 51 || p.progress > 80)) return false;
            if (advRoadmapProgress === '81-100' && p.progress < 81) return false;
          }

          return true;
        });

        // Sort projects
        const sortedProjects = [...filteredProjects].sort((a, b) => {
          let valA = a[roadmapSortField as keyof Project] || '';
          let valB = b[roadmapSortField as keyof Project] || '';
          
          if (typeof valA === 'string') {
            return roadmapSortOrder === 'asc' 
              ? valA.localeCompare(valB as string) 
              : (valB as string).localeCompare(valA);
          } else {
            return roadmapSortOrder === 'asc' 
              ? (valA > valB ? 1 : -1) 
              : (valA < valB ? 1 : -1);
          }
        });

        // Trigger Excel / CSV Export
        const handleExportRoadmapCSV = () => {
          const headers = ['Code', 'Project Name', 'Start Date', 'Deadline', 'Client Name', 'Client Company', 'Spent', 'Budget', 'Progress', 'Status'];
          const rows = localProjects.map(p => [
            p.code || p.id,
            `"${p.name.replace(/"/g, '""')}"`,
            p.startDate,
            p.endDate,
            `"${p.clientName.replace(/"/g, '""')}"`,
            `"${p.clientCompany?.replace(/"/g, '""') || ''}"`,
            p.spent,
            p.budget,
            p.progress,
            p.status
          ]);
          const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "roadmap_export.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        return (
          <div className="space-y-6 font-sans relative">
            {/* HEADER PANEL */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Project Roadmap</span>
                  <span className="text-xs font-normal text-slate-400">Home • Project Roadmap</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Visual milestone schedules, quarter progressions, delivery deadlines, and project statuses.
                </p>
              </div>

              {/* View Switches */}
              <div className="flex items-center gap-1 border border-slate-200 bg-slate-50 p-1 rounded-xl">
                <button
                  onClick={() => setRoadmapViewMode('list')}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${roadmapViewMode === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Roadmap Grid List"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setRoadmapViewMode('gantt')}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${roadmapViewMode === 'gantt' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Gantt Timeline Chart"
                >
                  <Layers className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CONTROL BAR */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-end">
              {/* Duration Date placeholder */}
              <div className="space-y-1 flex-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer font-sans font-medium"
                  value={roadmapDuration}
                  onChange={(e) => setRoadmapDuration(e.target.value)}
                >
                  <option value="All">All Durations</option>
                  <option value="Start Date To End Date">Start Date To End Date</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1 w-full md:w-48">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer font-sans font-medium"
                  value={roadmapStatusFilter}
                  onChange={(e) => setRoadmapStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Finished">Finished</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              {/* Progress Filter */}
              <div className="space-y-1 w-full md:w-48">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progress</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer font-sans font-medium"
                  value={roadmapProgressFilter}
                  onChange={(e) => setRoadmapProgressFilter(e.target.value)}
                >
                  <option value="All">All Progress</option>
                  <option value="0-20">0% – 20%</option>
                  <option value="21-50">21% – 50%</option>
                  <option value="51-80">51% – 80%</option>
                  <option value="81-100">81% – 100%</option>
                </select>
              </div>

              {/* Search */}
              <div className="space-y-1 relative flex-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Start typing to search"
                    className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                    value={roadmapSearch}
                    onChange={(e) => setRoadmapSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Advanced Filter Sidebar Toggle */}
              <button
                onClick={() => setShowRoadmapFilterSidebar(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-all h-[38px] shadow-2xs font-sans"
              >
                <Filter className="h-4 w-4 text-slate-500" />
                <span>Filters</span>
              </button>
            </div>

            {/* ACTION ROW (Export) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <button
                onClick={handleExportRoadmapCSV}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
              >
                <Download className="h-4 w-4 text-slate-400" />
                <span>Export</span>
              </button>

              <div className="text-xs text-slate-400 font-bold">
                Matches Found: <span className="text-indigo-600 font-black">{sortedProjects.length}</span> projects
              </div>
            </div>

            {/* ==================== SUB-VIEW 1: GRID ROADMAP LIST ==================== */}
            {roadmapViewMode === 'list' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-black tracking-wider">
                        {[
                          { label: 'Code', field: 'code' },
                          { label: 'Project Name', field: 'name' },
                          { label: 'Members', field: 'members' },
                          { label: 'Start Date', field: 'startDate' },
                          { label: 'Deadline', field: 'endDate' },
                          { label: 'Client', field: 'clientName' },
                          { label: 'Status & Progress', field: 'progress' }
                        ].map((col) => (
                          <th
                            key={col.field}
                            className="px-5 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                            onClick={() => {
                              if (roadmapSortField === col.field) {
                                setRoadmapSortOrder(roadmapSortOrder === 'asc' ? 'desc' : 'asc');
                              } else {
                                setRoadmapSortField(col.field);
                                setRoadmapSortOrder('asc');
                              }
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{col.label}</span>
                              <span className="text-[9px] text-slate-400">
                                {roadmapSortField === col.field ? (roadmapSortOrder === 'asc' ? '▲' : '▼') : '↕'}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
                      {sortedProjects.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-16 text-center text-slate-400 font-medium">
                            <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-bold text-slate-600">No projects found</p>
                            <p className="text-xs text-slate-400 mt-1">Try resetting advanced filters.</p>
                          </td>
                        </tr>
                      ) : (
                        sortedProjects.map((proj) => {
                          const isOverdue = proj.status !== 'Finished' && proj.endDate < '2026-07-05';
                          const isToday = proj.endDate === '2026-07-05';

                          return (
                            <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                              {/* Code */}
                              <td className="px-5 py-4 font-mono font-extrabold text-indigo-600">
                                {proj.code || proj.id.replace('PR-', '')}
                              </td>

                              {/* Project Name */}
                              <td className="px-5 py-4 font-black text-slate-900 max-w-xs leading-relaxed">
                                {proj.name}
                              </td>

                              {/* Members avatar groups */}
                              <td className="px-5 py-4">
                                <div className="flex items-center -space-x-2">
                                  {proj.members.slice(0, 3).map((memberName, i) => {
                                    const avatarUrl = memberName.includes('Elena') 
                                      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
                                      : memberName.includes('James')
                                      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                                      : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face';

                                    return (
                                      <img
                                        key={i}
                                        src={avatarUrl}
                                        alt={memberName}
                                        title={memberName}
                                        referrerPolicy="no-referrer"
                                        className="w-6.5 h-6.5 rounded-full object-cover border-2 border-white shadow-3xs"
                                      />
                                    );
                                  })}
                                  {proj.members.length > 3 && (
                                    <div className="w-6.5 h-6.5 rounded-full bg-slate-950 text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-white shadow-3xs" title={`${proj.members.length - 3} more members`}>
                                      +{proj.members.length - 3}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Start Date */}
                              <td className="px-5 py-4 font-mono font-semibold text-slate-500">
                                {proj.startDate.split('-').reverse().join('-')}
                              </td>

                              {/* Deadline */}
                              <td className="px-5 py-4 font-mono">
                                {isToday ? (
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-lg font-black text-[10px]">
                                    TODAY
                                  </span>
                                ) : (
                                  <span className={`font-black ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                                    {proj.endDate.split('-').reverse().join('-')}
                                  </span>
                                )}
                              </td>

                              {/* Client info with avatar */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={proj.clientAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'}
                                    alt={proj.clientName}
                                    referrerPolicy="no-referrer"
                                    className="w-7 h-7 rounded-full object-cover border border-slate-100"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-800">{proj.clientName}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">{proj.clientCompany || 'Stroman LLC'}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Progress bar and status indicator */}
                              <td className="px-5 py-4">
                                <div className="space-y-1.5 w-44">
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                      proj.status === 'Finished' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                      proj.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                      proj.status === 'On Hold' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                      'bg-slate-50 text-slate-600 border border-slate-200'
                                    }`}>
                                      {proj.status}
                                    </span>
                                    <span className="font-mono font-black text-slate-800">{proj.progress}%</span>
                                  </div>

                                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        proj.progress > 80 ? 'bg-emerald-500' :
                                        proj.progress > 40 ? 'bg-indigo-500' : 'bg-rose-500'
                                      }`}
                                      style={{ width: `${proj.progress}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== SUB-VIEW 2: MILESTONE GANTT VIEW ==================== */}
            {roadmapViewMode === 'gantt' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-950">Gantt Milestone Roadmap</h4>
                  <p className="text-xs text-slate-500">Visual weekly progression path across fiscal quarters</p>
                </div>

                <div className="space-y-4">
                  {roadmapMilestones.map((milestone, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{milestone.title}</span>
                        <div className="flex gap-2 items-center text-[10px] font-mono text-slate-500">
                          <span>Timeline: {milestone.start} to {milestone.duration}</span>
                          <span className="font-bold text-indigo-600">({milestone.progress}% Done)</span>
                        </div>
                      </div>

                      {/* Progress track */}
                      <div className="w-full bg-slate-100 h-4 rounded-lg overflow-hidden border border-slate-200/50 flex">
                        {/* Left dummy spacing to offset timeline start */}
                        <div className={`h-full bg-transparent ${
                          milestone.start === 'W2' ? 'w-1/12' :
                          milestone.start === 'W4' ? 'w-3/12' :
                          milestone.start === 'W7' ? 'w-6/12' :
                          milestone.start === 'W8' ? 'w-7/12' : ''
                        }`} />
                        {/* Real duration indicator */}
                        <div className={`h-full ${milestone.color} rounded-lg flex items-center pl-3 text-[9px] font-bold text-white shadow-xs`} style={{
                          width: milestone.duration === 'W2' ? '20%' :
                                 milestone.duration === 'W3' ? '30%' :
                                 milestone.duration === 'W4' ? '40%' : '15%'
                        }}>
                          {milestone.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLIDE-OUT ADVANCED FILTERS PANEL */}
            {showRoadmapFilterSidebar && (
              <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans">
                {/* Backdrop overlay */}
                <div 
                  onClick={() => setShowRoadmapFilterSidebar(false)}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
                />

                {/* Sidebar container */}
                <div className="relative w-80 max-w-full bg-white h-full shadow-2xl border-l border-slate-100 flex flex-col justify-between z-10 p-6 animate-slide-in">
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-500" />
                        <span>Filters</span>
                      </h4>
                      <button 
                        onClick={() => setShowRoadmapFilterSidebar(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Filter Fields */}
                    <div className="space-y-4 overflow-y-auto max-h-[75vh] pr-1">
                      {/* Date Filter */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Filter On</label>
                        <select
                          className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                          value={advRoadmapDateOn}
                          onChange={(e) => setAdvRoadmapDateOn(e.target.value)}
                        >
                          <option value="All">All Dates</option>
                          <option value="Start Date">Start Date</option>
                          <option value="Deadline">Deadline</option>
                        </select>
                      </div>

                      {/* Client */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Name</label>
                        <select
                          className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                          value={advRoadmapClient}
                          onChange={(e) => setAdvRoadmapClient(e.target.value)}
                        >
                          <option value="All">All Clients</option>
                          <option value="Miss Sienna Miller">Miss Sienna Miller</option>
                          <option value="Mrs. Justina Larson I">Mrs. Justina Larson I</option>
                        </select>
                      </div>

                      {/* Project Member */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Member</label>
                        <select
                          className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                          value={advRoadmapMember}
                          onChange={(e) => setAdvRoadmapMember(e.target.value)}
                        >
                          <option value="All">All Members</option>
                          <option value="Elena Rostova">Elena Rostova</option>
                          <option value="James Carter">James Carter</option>
                          <option value="Daniel Park">Daniel Park</option>
                        </select>
                      </div>

                      {/* Project Public/Private */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public / Private</label>
                        <select
                          className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                          value={advRoadmapPublic}
                          onChange={(e) => setAdvRoadmapPublic(e.target.value)}
                        >
                          <option value="All">All Statuses</option>
                          <option value="Public">Public Projects</option>
                          <option value="Private">Private Projects</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                        <select
                          className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                          value={advRoadmapStatus}
                          onChange={(e) => setAdvRoadmapStatus(e.target.value)}
                        >
                          <option value="All">All Statuses</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Not Started">Not Started</option>
                          <option value="Finished">Finished</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </div>

                      {/* Progress */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress Range</label>
                        <select
                          className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                          value={advRoadmapProgress}
                          onChange={(e) => setAdvRoadmapProgress(e.target.value)}
                        >
                          <option value="All">All Ranges</option>
                          <option value="0-20">0% – 20%</option>
                          <option value="21-50">21% – 50%</option>
                          <option value="51-80">51% – 80%</option>
                          <option value="81-100">81% – 100%</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Operations Footer */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setAdvRoadmapDateOn('All');
                        setAdvRoadmapClient('All');
                        setAdvRoadmapCategory('All');
                        setAdvRoadmapMember('All');
                        setAdvRoadmapDepartment('All');
                        setAdvRoadmapPublic('All');
                        setAdvRoadmapStatus('All');
                        setAdvRoadmapProgress('All');
                        setAdvRoadmapDeadline('All');
                        setShowRoadmapFilterSidebar(false);
                      }}
                      className="w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowRoadmapFilterSidebar(false)}
                      className="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* MODALS */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create Project Task</h3>
            <form onSubmit={handleTaskSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Project</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                  value={taskProject}
                  onChange={(e) => setTaskProject(e.target.value)}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Task Summary / Title</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                  placeholder="Describe development milestone..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Assignee Representative</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                  >
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="James Carter">James Carter</option>
                    <option value="Daniel Park">Daniel Park</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Priority Degree</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Due Date</label>
                <input
                  type="date" required
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Generate Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG TIME */}
      {showLogTimeModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                <span>Log Time Session</span>
              </h3>
              <button onClick={() => setShowLogTimeModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleLogTime} className="space-y-4">
              {/* Project Selection */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Name *</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  value={logTimeProject}
                  onChange={(e) => {
                    setLogTimeProject(e.target.value);
                    const matchingTasks = localTasks.filter(t => t.projectId === e.target.value);
                    if (matchingTasks.length > 0) {
                      setLogTimeTask(matchingTasks[0].id);
                    }
                  }}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Task Selection */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Task Title *</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  value={logTimeTask}
                  onChange={(e) => setLogTimeTask(e.target.value)}
                >
                  {localTasks.filter(t => t.projectId === logTimeProject || !t.projectId).map(t => (
                    <option key={t.id} value={t.id}>[{t.id}] {t.title}</option>
                  ))}
                </select>
              </div>

              {/* Employee Selection */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Employee *</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                  value={logTimeEmployee}
                  onChange={(e) => setLogTimeEmployee(e.target.value)}
                >
                  <option value="Elena Rostova">Elena Rostova (Lead)</option>
                  <option value="James Carter">James Carter (Senior)</option>
                  <option value="Daniel Park">Daniel Park (Developer)</option>
                </select>
              </div>

              {/* Start Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    value={logTimeStartDate}
                    onChange={(e) => setLogTimeStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Time *</label>
                  <input
                    type="time"
                    required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono"
                    value={logTimeStartTime}
                    onChange={(e) => setLogTimeStartTime(e.target.value)}
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    value={logTimeEndDate}
                    onChange={(e) => setLogTimeEndDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Time *</label>
                  <input
                    type="time"
                    required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono"
                    value={logTimeEndTime}
                    onChange={(e) => setLogTimeEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Memo */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Memo / Work Notes</label>
                <textarea
                  placeholder="Notes on achievements..."
                  rows={2}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  value={logTimeMemo}
                  onChange={(e) => setLogTimeMemo(e.target.value)}
                />
              </div>

              {/* Live calculated summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs font-bold text-slate-700 font-mono">
                <span>Calculated Hours:</span>
                <span className="text-indigo-600">
                  {calculateTotalHours(logTimeStartDate, logTimeStartTime, logTimeEndDate, logTimeEndTime)} hrs
                </span>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLogTimeModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CONTRACT TYPE */}
      {showAddTypeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Add Contract Type</h3>
              <button onClick={() => setShowAddTypeModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddContractType} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contract Type Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Referral Agreement"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  value={newContractTypeName}
                  onChange={(e) => setNewContractTypeName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTypeModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Save Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROJECT */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Create New Project</h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EPA"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={newProjCode}
                    onChange={(e) => setNewProjCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Design Consulting"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Miss Sienna Miller"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={newProjClient}
                    onChange={(e) => setNewProjClient(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Client Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stroman LLC"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={newProjCompany}
                    onChange={(e) => setNewProjCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={newProjStartDate}
                    onChange={(e) => setNewProjStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={newProjEndDate}
                    onChange={(e) => setNewProjEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Budget ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45000"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Initial Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 10"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={newProjProgress}
                    onChange={(e) => setNewProjProgress(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TASK */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                {editingTask ? `Edit Task: ${editingTask.code}` : 'Create New Task'}
              </h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleTaskFormSubmit} className="space-y-4 text-xs text-slate-700">
              {/* Task Title */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design primary explorer visual layout"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  value={formTaskTitle}
                  onChange={(e) => setFormTaskTitle(e.target.value)}
                />
              </div>

              {/* Project Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Project *</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                    value={formTaskProject}
                    onChange={(e) => setFormTaskProject(e.target.value)}
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Assignee */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assigned Agent *</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                    value={formTaskAssignee}
                    onChange={(e) => setFormTaskAssignee(e.target.value)}
                  >
                    <option value="Elena Rostova">Elena Rostova (Lead)</option>
                    <option value="James Carter">James Carter (Senior)</option>
                    <option value="Daniel Park">Daniel Park (Developer)</option>
                    <option value="Zara Khan">Zara Khan (Designer)</option>
                    <option value="Aria Montgomery">Aria Montgomery (Writer)</option>
                  </select>
                </div>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority Level *</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                    value={formTaskPriority}
                    onChange={(e) => setFormTaskPriority(e.target.value as any)}
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">⚪ Low Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Task Status *</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
                    value={formTaskStatus}
                    onChange={(e) => setFormTaskStatus(e.target.value as any)}
                  >
                    <option value="Incomplete">Incomplete</option>
                    <option value="To Do">To Do</option>
                    <option value="Doing">Doing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={formTaskStartDate}
                    onChange={(e) => setFormTaskStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={formTaskDueDate}
                    onChange={(e) => setFormTaskDueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Est. Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 4h, 2d"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={formTaskEstimatedTime}
                    onChange={(e) => setFormTaskEstimatedTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Private Task Toggle */}
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="formTaskIsPrivate"
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                  checked={formTaskIsPrivate}
                  onChange={(e) => setFormTaskIsPrivate(e.target.checked)}
                />
                <label htmlFor="formTaskIsPrivate" className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5 select-none">
                  <Lock className="h-3.5 w-3.5 text-amber-500" />
                  <span>This is a Private Task (only visible in Private Tasks view)</span>
                </label>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="Provide scope, specifications or milestones of the task..."
                  rows={2}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  value={formTaskDescription}
                  onChange={(e) => setFormTaskDescription(e.target.value)}
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT TASKS */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Import Tasks (CSV or JSON)</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>Paste comma-separated rows or a JSON array of tasks to instantly append them.</p>
              
              <div className="bg-slate-50 p-3 rounded-lg font-mono text-[9px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700 uppercase">CSV format header example:</p>
                <p>Code,Task,AssignedTo,StartDate,DueDate,Priority,Status,EstimatedTime,Private,Description</p>
                <p>TSK-410,Implement billing widgets,Elena Rostova,2026-07-01,2026-07-15,High,To Do,4h,No,Task info</p>
              </div>

              <textarea
                placeholder='Paste CSV or JSON array here... e.g. [{"title": "Dynamic clock", "dueDate": "2026-07-10"}]'
                rows={6}
                className="w-full bg-slate-50 text-slate-800 text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                value={importCsvText}
                onChange={(e) => setImportCsvText(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportTasks}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Parse & Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
