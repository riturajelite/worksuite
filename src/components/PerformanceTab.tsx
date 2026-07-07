/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Target, Search, Plus, Calendar, Filter, Download, CheckCircle, 
  Clock, XCircle, AlertCircle, Edit3, Settings, Trash2, ArrowUpRight, 
  Percent, ChevronDown, ChevronUp, UserCheck, HelpCircle, Sparkles, 
  Info, Users, List, FileSpreadsheet, PlusCircle, CheckSquare, Paperclip, MessageSquare, X
} from 'lucide-react';

interface KeyResult {
  id: string;
  title: string;
  target: string;
  progress: number;
}

interface CheckInLog {
  date: string;
  user: string;
  comment: string;
  status: 'Ahead' | 'On Track' | 'At Risk';
}

interface Objective {
  id: string;
  title: string;
  description: string;
  owner: string;
  avatar: string;
  department: string;
  project: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'On Track' | 'Behind' | 'At Risk' | 'Completed';
  keyResults: KeyResult[];
  checkIns: CheckInLog[];
}

interface OneToOneMeeting {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  managerName: string;
  managerAvatar: string;
  date: string;
  time: string;
  agenda: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes: string;
  actionItems: { text: string; done: boolean }[];
  attachments: string[];
}

const INITIAL_OBJECTIVES: Objective[] = [
  {
    id: 'OBJ-201',
    title: 'Migrate Terminal Authentication to Cryptographic Tokens',
    description: 'Establish standard end-to-end SSL handshakes between physical lobby scanners and company databases.',
    owner: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    department: 'Engineering',
    project: 'Security Overhaul 2026',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    progress: 75,
    status: 'On Track',
    keyResults: [
      { id: 'KR-201-1', title: 'Complete G3/G4 chipset hardware handshake code', target: '100%', progress: 100 },
      { id: 'KR-201-2', title: 'Achieve < 40ms API query response latency on lobbies', target: '< 40ms', progress: 80 },
      { id: 'KR-201-3', title: 'De-register obsolete plaintext user credentials', target: '100%', progress: 45 }
    ],
    checkIns: [
      { date: '2026-06-25', user: 'Elena Rostova', comment: 'Lobby scanner tests completed successfully. Low latency achieved.', status: 'On Track' },
      { date: '2026-06-12', user: 'Daniel Park', comment: 'Encountered some firewall ports block on warehouse gate DEV-03.', status: 'At Risk' }
    ]
  },
  {
    id: 'OBJ-202',
    title: 'Modernize Standard Remuneration & Payroll Ledger Compliance',
    description: 'Ensure automated TDS slices and provident fund pension calculations adhere to updated legal benchmarks.',
    owner: 'Zara Khan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    department: 'Operations',
    project: 'Financial Compliance Audit',
    startDate: '2026-06-15',
    endDate: '2026-07-31',
    progress: 40,
    status: 'Behind',
    keyResults: [
      { id: 'KR-202-1', title: 'Incorporate Medical Reimbursement formulas', target: '100%', progress: 100 },
      { id: 'KR-202-2', title: 'Automate Form-16 cryptographic signing logs', target: '100%', progress: 15 },
      { id: 'KR-202-3', title: 'Draft individual tax reports PDF exporter modules', target: '100%', progress: 5 }
    ],
    checkIns: [
      { date: '2026-06-28', user: 'Zara Khan', comment: 'Base earnings and HRA calculations are verified. PDF exporter requires dev help.', status: 'Ahead' }
    ]
  },
  {
    id: 'OBJ-203',
    title: 'Deploy Interactive Worksuite SaaS Experience Portals',
    description: 'Unify company notice boards, biolinks builders, support tickets, and review grids into a responsive dashboard.',
    owner: 'James Carter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    department: 'Creative Design',
    project: 'Corporate Hub Refresh',
    startDate: '2026-05-01',
    endDate: '2026-07-15',
    progress: 95,
    status: 'Completed',
    keyResults: [
      { id: 'KR-203-1', title: 'Design pixel-perfect layout shells with fluid grid systems', target: '100%', progress: 100 },
      { id: 'KR-203-2', title: 'Connect active timer modules with global punch clock rules', target: '100%', progress: 100 },
      { id: 'KR-203-3', title: 'Implement offline-first local storage backup systems', target: '100%', progress: 85 }
    ],
    checkIns: [
      { date: '2026-06-20', user: 'James Carter', comment: 'All modules integrated perfectly. Staggered animations rendering nicely.', status: 'On Track' }
    ]
  }
];

const INITIAL_MEETINGS: OneToOneMeeting[] = [
  {
    id: 'MTG-801',
    employeeName: 'Elena Rostova',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    managerName: 'Zara Khan',
    managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    date: '2026-07-10',
    time: '11:00 AM',
    agenda: 'Quarterly objective reviews and biometric device mapping setups',
    status: 'Scheduled',
    notes: 'Elena will present the cryptographic handshakes payload on G4 terminals. Discuss any design limitations regarding firewall locks.',
    actionItems: [
      { text: 'Deploy cryptographic token code on Engineering Gate DEV-02', done: true },
      { text: 'Validate latency is below 40ms target metric', done: false },
      { text: 'Help HR test standard PDF exports parameters', done: false }
    ],
    attachments: ['cryptographic_tokens_rfc.pdf']
  },
  {
    id: 'MTG-802',
    employeeName: 'James Carter',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    managerName: 'Zara Khan',
    managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    date: '2026-07-12',
    time: '02:30 PM',
    agenda: 'Remuneration layout approvals and Figma file audits',
    status: 'Scheduled',
    notes: 'Verify the interactive styling parameters. Discuss performance appraisals and compensation structures.',
    actionItems: [
      { text: 'Complete final layout audit of salary modal specs', done: false },
      { text: 'Sync workspace assets directory with AWS cloud bucket', done: false }
    ],
    attachments: []
  },
  {
    id: 'MTG-803',
    employeeName: 'Daniel Park',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    managerName: 'Zara Khan',
    managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    date: '2026-07-03',
    time: '04:00 PM',
    agenda: 'Assessing terminal command bugs and QA schedules',
    status: 'Completed',
    notes: 'Daniel highlighted that terminal commands on DEV-03 failed during firmware over-the-air flashes because of a lack of static IP parameters.',
    actionItems: [
      { text: 'Configure static IP parameters on Warehouse Gate DEV-03', done: true },
      { text: 'Retest firmware push remote instruction pipeline', done: true }
    ],
    attachments: ['dev03_ping_telemetry.log']
  }
];

interface PerformanceTabProps {
  subTab: string;
}

export default function PerformanceTab({ subTab }: PerformanceTabProps) {
  // Database States
  const [objectives, setObjectives] = useState<Objective[]>(INITIAL_OBJECTIVES);
  const [meetings, setMeetings] = useState<OneToOneMeeting[]>(INITIAL_MEETINGS);

  // Expanded objectives for viewing key results & check-ins
  const [expandedObjectiveId, setExpandedObjectiveId] = useState<string | null>(INITIAL_OBJECTIVES[0].id);

  // Filters and Queries
  const [objSearch, setObjSearch] = useState('');
  const [objStatusFilter, setObjStatusFilter] = useState('');
  const [objDeptFilter, setObjDeptFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('Q3-2026');

  // One-to-one filters
  const [meetingSearch, setMeetingSearch] = useState('');
  const [meetingStatusFilter, setMeetingStatusFilter] = useState('');

  // Modals / sub-pages visibility
  const [showAddObjectivePage, setShowAddObjectivePage] = useState(false);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false);
  const [selectedMeetingForDetails, setSelectedMeetingForDetails] = useState<OneToOneMeeting | null>(INITIAL_MEETINGS[0]);

  // Track landing screen status for each subTab - bypassed to show list directly
  const [hasOpenedList, setHasOpenedList] = useState<Record<string, boolean>>({
    'perf-dashboard': true,
    'perf-objectives': true,
    'perf-scoring': true,
    'perf-meetings': true,
  });

  React.useEffect(() => {
    setShowAddObjectivePage(false);
  }, [subTab]);

  // Add Objective Form
  const [newObjTitle, setNewObjTitle] = useState('');
  const [newObjDesc, setNewObjDesc] = useState('');
  const [newObjDept, setNewObjDept] = useState('Engineering');
  const [newObjOwner, setNewObjOwner] = useState('Elena Rostova');
  const [newObjProject, setNewObjProject] = useState('Security Overhaul 2026');
  const [newObjStartDate, setNewObjStartDate] = useState('');
  const [newObjEndDate, setNewObjEndDate] = useState('');

  // Schedule Meeting Form
  const [newMtgEmployee, setNewMtgEmployee] = useState('Elena Rostova');
  const [newMtgDate, setNewMtgDate] = useState('');
  const [newMtgTime, setNewMtgTime] = useState('');
  const [newMtgAgenda, setNewMtgAgenda] = useState('');
  const [newMtgNotes, setNewMtgNotes] = useState('');

  // Custom action items inside Schedule modal
  const [mtgActionInput, setMtgActionInput] = useState('');
  const [mtgActionItems, setMtgActionItems] = useState<string[]>([]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ----------------------------------------------------
  // COMPUTED CALCULATIONS
  // ----------------------------------------------------
  const objectiveMetrics = useMemo(() => {
    const total = objectives.length;
    const completed = objectives.filter(o => o.status === 'Completed').length;
    const behind = objectives.filter(o => o.status === 'Behind').length;
    const onTrack = objectives.filter(o => o.status === 'On Track').length;
    const atRisk = objectives.filter(o => o.status === 'At Risk').length;
    
    const averageProgress = Math.round(objectives.reduce((sum, curr) => sum + curr.progress, 0) / total) || 0;

    return { total, completed, behind, onTrack, atRisk, averageProgress };
  }, [objectives]);

  const meetingMetrics = useMemo(() => {
    const total = meetings.length;
    const scheduled = meetings.filter(m => m.status === 'Scheduled').length;
    const completed = meetings.filter(m => m.status === 'Completed').length;
    return { total, scheduled, completed };
  }, [meetings]);

  // ----------------------------------------------------
  // OBJECTIVES ACTIONS
  // ----------------------------------------------------
  const filteredObjectives = useMemo(() => {
    return objectives.filter(o => {
      const matchSearch = o.title.toLowerCase().includes(objSearch.toLowerCase()) ||
                          o.owner.toLowerCase().includes(objSearch.toLowerCase());
      const matchStatus = objStatusFilter === '' || o.status === objStatusFilter;
      const matchDept = objDeptFilter === '' || o.department === objDeptFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [objectives, objSearch, objStatusFilter, objDeptFilter]);

  const handleAddObjectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjTitle || !newObjStartDate || !newObjEndDate) {
      alert("Please fill out Objective Title, Start Date, and End Date.");
      return;
    }

    const avatarMap: Record<string, string> = {
      'Elena Rostova': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      'Zara Khan': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      'James Carter': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    };

    const created: Objective = {
      id: `OBJ-0${objectives.length + 1}`,
      title: newObjTitle,
      description: newObjDesc,
      owner: newObjOwner,
      avatar: avatarMap[newObjOwner] || avatarMap['Elena Rostova'],
      department: newObjDept,
      project: newObjProject,
      startDate: newObjStartDate,
      endDate: newObjEndDate,
      progress: 0,
      status: 'On Track',
      keyResults: [
        { id: `KR-${objectives.length + 1}-1`, title: `Complete milestones specification draft`, target: '100%', progress: 0 }
      ],
      checkIns: [
        { date: new Date().toISOString().slice(0, 10), user: 'System Core', comment: 'Objective formulated onto Worksuite ledger.', status: 'On Track' }
      ]
    };

    setObjectives([created, ...objectives]);
    setNewObjTitle('');
    setNewObjDesc('');
    setShowAddObjectivePage(false);
    setExpandedObjectiveId(created.id);
    showToast(`New Company Objective "${created.title}" configured!`);
  };

  const handleDeleteObjective = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete objective "${title}"? This clears all nested key results.`)) {
      setObjectives(objectives.filter(o => o.id !== id));
      if (expandedObjectiveId === id) setExpandedObjectiveId(null);
      showToast("Objective and associated Key Results deleted.");
    }
  };

  const handleToggleActionItem = (meetingId: string, itemIdx: number) => {
    setMeetings(meetings.map(m => {
      if (m.id === meetingId) {
        const items = [...m.actionItems];
        items[itemIdx].done = !items[itemIdx].done;
        return { ...m, actionItems: items };
      }
      return m;
    }));
    // Synchronize detail panel state
    setTimeout(() => {
      const match = meetings.find(m => m.id === meetingId);
      if (match) setSelectedMeetingForDetails(match);
    }, 100);
  };

  // ----------------------------------------------------
  // ONE TO ONE MEETINGS ACTIONS
  // ----------------------------------------------------
  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      const matchSearch = m.employeeName.toLowerCase().includes(meetingSearch.toLowerCase()) ||
                          m.agenda.toLowerCase().includes(meetingSearch.toLowerCase());
      const matchStatus = meetingStatusFilter === '' || m.status === meetingStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [meetings, meetingSearch, meetingStatusFilter]);

  const handleAddMtgActionInput = () => {
    if (mtgActionInput.trim()) {
      setMtgActionItems([...mtgActionItems, mtgActionInput.trim()]);
      setMtgActionInput('');
    }
  };

  const handleScheduleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMtgDate || !newMtgTime || !newMtgAgenda) {
      alert("Please configure date, scheduled time, and review agenda.");
      return;
    }

    const avatarMap: Record<string, string> = {
      'Elena Rostova': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      'Daniel Park': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      'James Carter': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    };

    const actionItemsFormatted = mtgActionItems.map(text => ({ text, done: false }));

    const created: OneToOneMeeting = {
      id: `MTG-0${meetings.length + 1}`,
      employeeName: newMtgEmployee,
      employeeAvatar: avatarMap[newMtgEmployee] || avatarMap['Elena Rostova'],
      managerName: 'Zara Khan',
      managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      date: newMtgDate,
      time: newMtgTime,
      agenda: newMtgAgenda,
      status: 'Scheduled',
      notes: newMtgNotes || 'Routine quarterly evaluation.',
      actionItems: actionItemsFormatted.length > 0 ? actionItemsFormatted : [{ text: 'Complete planned task items list', done: false }],
      attachments: []
    };

    setMeetings([created, ...meetings]);
    setNewMtgAgenda('');
    setNewMtgNotes('');
    setMtgActionItems([]);
    setSelectedMeetingForDetails(created);
    setShowScheduleMeetingModal(false);
    showToast(`1-to-1 review meeting scheduled for ${newMtgEmployee}!`);
  };

  const handleCancelMeeting = (id: string) => {
    if (confirm("Are you sure you want to cancel this review meeting?")) {
      setMeetings(meetings.map(m => {
        if (m.id === id) return { ...m, status: 'Cancelled' };
        return m;
      }));
      showToast("Meeting marked as Cancelled.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div id="perf-toast" className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold py-3 px-5 rounded-xl border border-slate-700 flex items-center gap-2.5 shadow-2xl animate-fade-in">
          <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400/20" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Target className="h-6 w-6 text-indigo-600 animate-pulse" />
            <span className="capitalize">
              {subTab === 'perf-dashboard' ? 'Performance OKR Dashboard' : 
               subTab === 'perf-objectives' ? 'Company Objectives Directory' : 
               subTab === 'perf-scoring' ? 'OKR Metric Scoring' : 'Corporate Review & One-To-Ones'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {subTab === 'perf-dashboard' ? 'Measure department targets, analyze key results frequencies, and review overall health.' :
             subTab === 'perf-objectives' ? 'Establish quarterly targets, nested key results, and live check-in logs.' :
             subTab === 'perf-scoring' ? 'Evaluate company targets scores and export audited performance structures.' :
             'Organize scheduled manager touchpoints, list agendas, and complete touchpoint action lists.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasOpenedList[subTab] && (
            <>
              {subTab === 'perf-objectives' && !showAddObjectivePage && (
                <button
                  id="btn-add-objective"
                  onClick={() => setShowAddObjectivePage(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>Configure New Objective</span>
                </button>
              )}

              {subTab === 'perf-meetings' && (
                <button
                  id="btn-schedule-meeting"
                  onClick={() => setShowScheduleMeetingModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>Schedule 1-to-1 Meeting</span>
                </button>
              )}

              {subTab === 'perf-scoring' && (
                <button
                  onClick={() => {
                    alert('OKR Scoresheet spreadsheet downloaded.');
                  }}
                  className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="h-4 w-4 text-slate-300" />
                  <span>Download Scoresheet</span>
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
          <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100">
            <Target className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {subTab === 'perf-dashboard' && 'Company OKR Metrics Dashboard'}
              {subTab === 'perf-objectives' && 'Performance Objectives & Key Results'}
              {subTab === 'perf-scoring' && 'Quarterly OKR Metric Scoring'}
              {subTab === 'perf-meetings' && 'Corporate Review & 1-on-1 Touchpoints'}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              {subTab === 'perf-dashboard' && 'Evaluate collective objectives, measure milestone fulfillment rates, and track organizational velocity trends.'}
              {subTab === 'perf-objectives' && 'Define quarterly strategic priorities, map nested key results, and log regular team status check-ins.'}
              {subTab === 'perf-scoring' && 'Assess performance metrics, compile weighted compliance scoresheets, and export completed reviews.'}
              {subTab === 'perf-meetings' && 'Schedule and log recurring touchpoints between engineering teams and supervisors to unblock active projects.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setHasOpenedList(prev => ({ ...prev, [subTab]: true }));
                if (subTab === 'perf-objectives') {
                  setShowAddObjectivePage(true);
                } else if (subTab === 'perf-meetings') {
                  setShowScheduleMeetingModal(true);
                } else if (subTab === 'perf-dashboard') {
                  showToast("Loading OKR Metrics Dashboard workspaces...");
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>
                {subTab === 'perf-dashboard' && 'Create Metric Entry'}
                {subTab === 'perf-objectives' && 'Configure Objective'}
                {subTab === 'perf-scoring' && 'Configure Scoring Framework'}
                {subTab === 'perf-meetings' && 'Schedule Meeting'}
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
          TAB 1: OKR METRICS DASHBOARD
          ---------------------------------------------------- */}
      {subTab === 'perf-dashboard' && hasOpenedList[subTab] && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-800">Review Cycle Period:</span>
            <select 
              className="bg-slate-50 text-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none font-bold"
              value={durationFilter}
              onChange={(e)=>setDurationFilter(e.target.value)}
            >
              <option value="Q3-2026">Q3 2026 (July - September)</option>
              <option value="Q2-2026">Q2 2026 (April - June)</option>
            </select>
          </div>

          {/* Core Metrics Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Progress Circle Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Overall OKR Milestones Fulfilled</span>
              
              {/* Responsive SVG Progress Ring */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-slate-100 fill-none" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    className="stroke-indigo-600 fill-none" 
                    strokeWidth="8" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * objectiveMetrics.averageProgress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center space-y-0.5">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{objectiveMetrics.averageProgress}%</span>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Weighted Avg</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  You have logged <strong className="text-slate-800">{objectiveMetrics.completed} completed</strong> objective segments across {objectiveMetrics.total} tracked lines.
                </p>
              </div>
            </div>

            {/* Custom Responsive SVG Bar Chart and Metrics */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-900">Objectives Status Breakdown</h4>
                <span className="text-[10px] text-slate-400 font-mono">Real-time Sourced Metrics</span>
              </div>

              {/* Status sliders bar representation */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>On Track & Completed</span>
                    </span>
                    <span className="font-mono text-slate-900">{objectiveMetrics.onTrack + objectiveMetrics.completed} Objectives</span>
                  </div>
                  <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${((objectiveMetrics.onTrack + objectiveMetrics.completed) / objectiveMetrics.total) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Behind Schedule</span>
                    </span>
                    <span className="font-mono text-slate-900">{objectiveMetrics.behind} Objectives</span>
                  </div>
                  <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${(objectiveMetrics.behind / objectiveMetrics.total) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>Critical At Risk</span>
                    </span>
                    <span className="font-mono text-slate-900">{objectiveMetrics.atRisk} Objectives</span>
                  </div>
                  <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${(objectiveMetrics.atRisk / objectiveMetrics.total) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Tips cards */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3 text-indigo-950 text-xs font-semibold leading-relaxed">
                <Info className="h-5 w-5 text-indigo-500 shrink-0" />
                <p>
                  <strong>Compliance Tip:</strong> Objective "Modernize Standard Remuneration" is currently flagged as <strong className="text-rose-700">Behind</strong>. Make sure to schedule a 1-to-1 touchpoint review to address PDF exports dependencies block.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: COMPANY OBJECTIVES DIRECTORY
          ---------------------------------------------------- */}
      {subTab === 'perf-objectives' && (hasOpenedList[subTab] || showAddObjectivePage) && (
        <div className="space-y-6">
          {showAddObjectivePage ? (
            /* CONFIGURE OBJECTIVE FORM */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">Configure Corporate Objective Target</h3>
                <p className="text-xs text-slate-400">Establish standard high-level targets, owner associations, and start dates.</p>
              </div>

              <form onSubmit={handleAddObjectiveSubmit} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Objective Title *</label>
                    <input type="text" required placeholder="e.g. Unify AWS docker container proxies" className="w-full bg-slate-50 text-slate-850 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={newObjTitle} onChange={(e)=>setNewObjTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Corporate Department</label>
                    <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={newObjDept} onChange={(e)=>setNewObjDept(e.target.value)}>
                      <option value="Engineering">Engineering Department</option>
                      <option value="Operations">Operations / HR</option>
                      <option value="Creative Design">Creative Design</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Description / Goal Scope</label>
                  <textarea placeholder="Describe key result parameters or technical milestone schedules..." className="w-full h-20 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={newObjDesc} onChange={(e)=>setNewObjDesc(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Primary Owner Assignment</label>
                    <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={newObjOwner} onChange={(e)=>setNewObjOwner(e.target.value)}>
                      <option value="Elena Rostova">Elena Rostova</option>
                      <option value="Zara Khan">Zara Khan</option>
                      <option value="James Carter">James Carter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">SaaS Project Association</label>
                    <input type="text" placeholder="e.g. Security Overhaul 2026" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={newObjProject} onChange={(e)=>setNewObjProject(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Start Date *</label>
                      <input type="date" required className="w-full bg-slate-50 p-2 rounded-xl border border-slate-200 focus:outline-none font-mono" value={newObjStartDate} onChange={(e)=>setNewObjStartDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">End Date *</label>
                      <input type="date" required className="w-full bg-slate-50 p-2 rounded-xl border border-slate-200 focus:outline-none font-mono" value={newObjEndDate} onChange={(e)=>setNewObjEndDate(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                  <button type="button" onClick={()=>setShowAddObjectivePage(false)} className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl">Cancel</button>
                  <button type="submit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10">Save and Launch Objective</button>
                </div>
              </form>
            </div>
          ) : (
            /* OBJECTIVES LISTING DIRECTORY */
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search objectives, owner..."
                    className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                    value={objSearch}
                    onChange={(e)=>setObjSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    className="bg-slate-50 text-slate-850 text-xs p-2 rounded-xl border border-slate-200 font-bold focus:outline-none"
                    value={objStatusFilter}
                    onChange={(e)=>setObjStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="On Track">On Track</option>
                    <option value="Behind">Behind</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <select 
                    className="bg-slate-50 text-slate-850 text-xs p-2 rounded-xl border border-slate-200 font-bold focus:outline-none"
                    value={objDeptFilter}
                    onChange={(e)=>setObjDeptFilter(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Creative Design">Creative Design</option>
                  </select>
                </div>
              </div>

              {/* Table of Objectives */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="px-6 py-3.5">Objective Goal Title</th>
                        <th className="px-6 py-3.5">Responsible Owner</th>
                        <th className="px-6 py-3.5">Department</th>
                        <th className="px-6 py-3.5">Target Period</th>
                        <th className="px-6 py-3.5">Progress Progress</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-750 font-semibold">
                      {filteredObjectives.map(obj => {
                        const isExpanded = expandedObjectiveId === obj.id;
                        return (
                          <React.Fragment key={obj.id}>
                            <tr className={`hover:bg-slate-50/20 cursor-pointer ${isExpanded ? 'bg-indigo-50/10' : ''}`} onClick={() => setExpandedObjectiveId(isExpanded ? null : obj.id)}>
                              <td className="px-6 py-4 max-w-xs">
                                <p className="font-bold text-slate-900 leading-snug">{obj.title}</p>
                                <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: {obj.id} | Project: {obj.project}</p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                  <img src={obj.avatar} className="w-7 h-7 rounded-full border border-slate-100" />
                                  <span className="font-bold text-slate-800">{obj.owner}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-indigo-600">{obj.department}</td>
                              <td className="px-6 py-4 font-mono text-slate-450 text-[10px]">
                                {obj.startDate} <span className="text-slate-300">to</span> {obj.endDate}
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <span className="font-mono text-[10px] font-black text-slate-900">{obj.progress}%</span>
                                  <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${obj.progress}%` }} />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                                  obj.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  obj.status === 'On Track' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                  obj.status === 'Behind' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                  'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse'
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${obj.status === 'Completed' ? 'bg-emerald-500' : obj.status === 'On Track' ? 'bg-indigo-500' : obj.status === 'Behind' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                  <span>{obj.status}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right" onClick={(e)=>e.stopPropagation()}>
                                <div className="flex justify-end items-center gap-2">
                                  {isExpanded ? <ChevronUp className="h-4.5 w-4.5 text-slate-400" /> : <ChevronDown className="h-4.5 w-4.5 text-slate-400" />}
                                  <button onClick={()=>handleDeleteObjective(obj.id, obj.title)} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>

                            {/* NESTED EXPANDED KEY RESULTS & CHECK-INS LIST */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={7} className="px-6 py-4 bg-slate-50 border-t border-b border-slate-200">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                                    {/* Nested Column 1: Key Results Progress */}
                                    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                                      <h5 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
                                        <span>Tracked Key Results Breakdown</span>
                                        <span className="text-[10px] text-slate-400 font-normal">Weighted Milestones</span>
                                      </h5>
                                      <div className="space-y-3">
                                        {obj.keyResults.map(kr => (
                                          <div key={kr.id} className="space-y-1">
                                            <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                                              <span>{kr.title}</span>
                                              <span className="font-mono text-slate-900">{kr.progress}% / {kr.target}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${kr.progress}%` }} />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Nested Column 2: Check-In Logs */}
                                    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                                      <h5 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
                                        <span>Live Check-In Logs History</span>
                                        <span className="text-[10px] text-indigo-600 font-mono">Recent Updates</span>
                                      </h5>
                                      <div className="space-y-3.5 max-h-[160px] overflow-y-auto">
                                        {obj.checkIns.map((ci, idx) => (
                                          <div key={idx} className="border-l-2 border-indigo-100 pl-3 space-y-1">
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                              <span className="text-slate-800">{ci.user} on {ci.date}</span>
                                              <span className={`px-1.5 py-0.5 rounded font-black uppercase text-[8px] ${
                                                ci.status === 'Ahead' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                ci.status === 'On Track' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                                'bg-rose-50 text-rose-700 border border-rose-100'
                                              }`}>{ci.status}</span>
                                            </div>
                                            <p className="text-slate-600 font-semibold leading-relaxed text-[11px]">{ci.comment}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: OKR SCORING LEDGER
          ---------------------------------------------------- */}
      {subTab === 'perf-scoring' && hasOpenedList[subTab] && (
        <div className="space-y-6 animate-fade-in">
          {/* Informative Banner */}
          <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl flex items-start gap-4 border border-slate-800 font-serif leading-relaxed">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Percent className="h-5 w-5" />
            </div>
            <div className="space-y-1 font-sans text-xs">
              <h4 className="text-sm font-bold text-white tracking-wide">OKR Key Results Score Calculation Logic</h4>
              <p className="text-slate-400 font-semibold">
                Worksuite OKR scores are calibrated from 0.0 to 1.0 based on percentage of target key results hit. An overall average weight of <strong>0.7 - 0.8 represents prime performance efficiency</strong>.
              </p>
            </div>
          </div>

          {/* Table representing scores */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900">Quarterly Goals Final Audited Scores</h4>
            
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-5 py-3.5">Objective Goal Name</th>
                    <th className="px-5 py-3.5">Responsible Owner</th>
                    <th className="px-5 py-3.5 text-right font-mono">Weighted Hits</th>
                    <th className="px-5 py-3.5 text-right font-mono">Calibrated Score (0 - 1.0)</th>
                    <th className="px-5 py-3.5 text-center">Status Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-750 font-semibold">
                  {objectives.map(o => {
                    const score = (o.progress / 100).toFixed(2);
                    return (
                      <tr key={o.id} className="hover:bg-slate-50/40">
                        <td className="px-5 py-4 font-bold text-slate-900">{o.title}</td>
                        <td className="px-5 py-4">{o.owner}</td>
                        <td className="px-5 py-4 text-right font-mono text-slate-500">{o.progress}%</td>
                        <td className="px-5 py-4 text-right font-mono font-black text-indigo-600 text-sm">{score}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            parseFloat(score) >= 0.7 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            parseFloat(score) >= 0.4 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {parseFloat(score) >= 0.7 ? 'HIGH PERFORMANCE' : parseFloat(score) >= 0.4 ? 'AVERAGE MARGIN' : 'CRITICAL TARGET'}
                          </span>
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

      {/* ----------------------------------------------------
          TAB 4: TOUCHPOINT 1-TO-1 MEETINGS
          ---------------------------------------------------- */}
      {subTab === 'perf-meetings' && hasOpenedList[subTab] && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Calendar touchpoint grid list */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="h-5 w-5 text-indigo-600" />
                <span>Scheduled 1-to-1 Touchpoints Directory</span>
              </h4>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search meeting agendas..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  value={meetingSearch}
                  onChange={(e)=>setMeetingSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Meetings Cards list representation */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredMeetings.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => setSelectedMeetingForDetails(m)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    selectedMeetingForDetails?.id === m.id ? 'bg-indigo-50/20 border-indigo-400/80 shadow-xs' : 'bg-white hover:bg-slate-50/40 border-slate-150'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{m.id}</span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        m.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        m.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 animate-pulse' :
                        'bg-slate-100 text-slate-550'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug">{m.agenda}</h5>
                    
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                      <p className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400" /><span>{m.date} @ {m.time}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100/50 shrink-0">
                    <div className="text-center font-sans">
                      <p className="text-[8px] text-slate-400 font-bold uppercase">Evaluators</p>
                      <div className="flex -space-x-1.5 mt-1">
                        <img src={m.managerAvatar} className="w-5.5 h-5.5 rounded-full border border-white" title={m.managerName} />
                        <img src={m.employeeAvatar} className="w-5.5 h-5.5 rounded-full border border-white" title={m.employeeName} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive touchpoint detailed workspace */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs h-fit min-h-[460px]">
            {selectedMeetingForDetails ? (
              <div className="space-y-4 animate-fade-in text-xs font-semibold">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-sans">Touchpoint Meeting Actions & Notes</h4>
                    <p className="text-[11px] text-slate-400">Review meeting minutes and complete action points below.</p>
                  </div>
                  {selectedMeetingForDetails.status === 'Scheduled' && (
                    <button 
                      onClick={()=>handleCancelMeeting(selectedMeetingForDetails.id)}
                      className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-150 space-y-1.5 text-slate-600 leading-relaxed text-[11px]">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4 text-indigo-500" />
                      <span>Meeting Agenda Context Notes:</span>
                    </p>
                    <p>{selectedMeetingForDetails.notes}</p>
                  </div>

                  {/* Checkable Action Checklist */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide flex items-center gap-1.5">
                      <CheckSquare className="h-4 w-4 text-indigo-500" />
                      <span>Agreed Action Items Checklist:</span>
                    </p>
                    <div className="space-y-1.5 font-sans">
                      {selectedMeetingForDetails.actionItems.map((item, idx) => (
                        <label 
                          key={idx} 
                          className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-700 text-xs font-medium border border-slate-100"
                        >
                          <input 
                            type="checkbox" 
                            checked={item.done} 
                            onChange={() => handleToggleActionItem(selectedMeetingForDetails.id, idx)}
                            className="rounded text-indigo-600 focus:ring-0 w-4 h-4 mt-0.5 cursor-pointer" 
                          />
                          <span className={item.done ? 'line-through text-slate-400 font-normal' : ''}>{item.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sourced attachments */}
                  {selectedMeetingForDetails.attachments.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Sourced Attachments</p>
                      <div className="flex gap-1.5">
                        {selectedMeetingForDetails.attachments.map((file, i) => (
                          <span key={i} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 font-mono font-bold">
                            <Paperclip className="h-3.5 w-3.5" />
                            <span>{file}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 italic py-20">
                <Users className="h-8 w-8 mb-2 text-slate-300 animate-pulse" />
                <span>Select aTouchpoint Row to review meeting details workspace.</span>
              </div>
            )}
          </div>

          {/* SCHEDULE MEETING MODAL */}
          {showScheduleMeetingModal && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">Schedule 1-to-1 touchpoint</h3>
                  <p className="text-xs text-slate-400">Establish formal objectives calibration checkpoints.</p>
                </div>

                <form onSubmit={handleScheduleMeetingSubmit} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Staff Member Candidate *</label>
                    <select className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={newMtgEmployee} onChange={(e)=>setNewMtgEmployee(e.target.value)}>
                      <option value="Elena Rostova">Elena Rostova (Senior Developer)</option>
                      <option value="Daniel Park">Daniel Park (QA Specialist)</option>
                      <option value="James Carter">James Carter (UI Designer)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Touchpoint Date *</label>
                      <input type="date" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono" value={newMtgDate} onChange={(e)=>setNewMtgDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Time Slot *</label>
                      <input type="time" required className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono" value={newMtgTime} onChange={(e)=>setNewMtgTime(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Touchpoint Agenda *</label>
                    <input type="text" required placeholder="e.g. Discuss AWS Docker security policies" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={newMtgAgenda} onChange={(e)=>setNewMtgAgenda(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Context Notes Summary</label>
                    <textarea placeholder="Formulate pre-meeting guidance or checklist parameters..." className="w-full h-16 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none" value={newMtgNotes} onChange={(e)=>setNewMtgNotes(e.target.value)} />
                  </div>

                  {/* Custom Action points adder inside schedule */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Add Agreed Action Milestones</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="e.g. Complete G4 chip firmware retest" className="flex-1 bg-slate-50 p-2 rounded-xl border border-slate-200 focus:outline-none" value={mtgActionInput} onChange={(e)=>setMtgActionInput(e.target.value)} />
                      <button type="button" onClick={handleAddMtgActionInput} className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer">Add</button>
                    </div>
                    {mtgActionItems.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mtgActionItems.map((item, i) => (
                          <span key={i} className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                            <span>{item}</span>
                            <X className="h-3 w-3 cursor-pointer" onClick={() => setMtgActionItems(mtgActionItems.filter((_, idx) => idx !== i))} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-3">
                    <button type="button" onClick={()=>setShowScheduleMeetingModal(false)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl">Discard</button>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl">Save touchpoint</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
