/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Search, Filter, ArrowUpDown, 
  Download, Trash2, CheckCircle, Clock, Eye, X, User, Users, 
  Landmark, HelpCircle, ChevronLeft, ChevronRight, Settings, 
  MapPin, PlusCircle, Check, Briefcase, Info, List, RefreshCw, AlertCircle
} from 'lucide-react';
import { Client, Project, Employee } from '../../types';

interface CalendarEventRecord {
  id: string;
  name: string;
  labelColor: string; // e.g. bg-indigo-500, bg-emerald-500, bg-amber-500, bg-rose-500
  where: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  department: string;
  attendees: string[]; // employee names
  clientName?: string;
  host: string;
  status: 'Scheduled' | 'Completed' | 'Canceled';
  sendReminder: boolean;
  eventLink?: string;
  isRecurring: boolean;
  recurrence?: string; // e.g. Weekly, Monthly, Bi-weekly
}

interface EventsViewProps {
  subTab: 'calendar' | 'events';
  clients: Client[];
  projects: Project[];
  employees: Employee[];
}

export default function EventsView({ subTab, clients, projects, employees }: EventsViewProps) {
  // --- LOCAL CALENDAR STATE ---
  const [events, setEvents] = useState<CalendarEventRecord[]>([
    {
      id: 'EVT-401',
      name: 'Q3 Product Strategy Alignment Session',
      labelColor: '#6366f1', // Indigo
      where: 'Conference Room Alpha / Google Meet',
      description: 'Strategic planning for mapping our main full-stack server container node capabilities.',
      startDate: '2026-07-03',
      startTime: '11:00 AM',
      endDate: '2026-07-03',
      endTime: '12:30 PM',
      department: 'Technology',
      attendees: ['Zara Khan', 'Elena Rostova'],
      clientName: 'Cyberdyne Systems',
      host: 'Zara Khan',
      status: 'Scheduled',
      sendReminder: true,
      eventLink: 'https://meet.google.com/abc-defg-hij',
      isRecurring: false
    },
    {
      id: 'EVT-402',
      name: 'Independence Day Social BBQ & Drinks',
      labelColor: '#10b981', // Emerald
      where: 'Corporate Garden Terrace',
      description: 'Catered food, drinks, and team-building games with families welcome.',
      startDate: '2026-07-04',
      startTime: '05:00 PM',
      endDate: '2026-07-04',
      endTime: '09:00 PM',
      department: 'Human Resources',
      attendees: ['Elena Rostova', 'John Doe', 'Elena Rostova'],
      host: 'Elena Rostova',
      status: 'Scheduled',
      sendReminder: false,
      isRecurring: false
    },
    {
      id: 'EVT-403',
      name: 'Weekly Sprint Kickoff & Review',
      labelColor: '#f59e0b', // Amber
      where: 'Dev Ops Portal Slack Channel',
      description: 'Weekly review of task backlogs, timer logs, and active client proposals.',
      startDate: '2026-07-06',
      startTime: '09:30 AM',
      endDate: '2026-07-06',
      endTime: '10:30 AM',
      department: 'Technology',
      attendees: ['Zara Khan', 'John Doe'],
      clientName: 'Wayne Enterprises',
      host: 'John Doe',
      status: 'Scheduled',
      sendReminder: true,
      isRecurring: true,
      recurrence: 'Weekly'
    },
    {
      id: 'EVT-404',
      name: 'Monthly Ledger Reconciliation & Audits',
      labelColor: '#3b82f6', // Blue
      where: 'Accounting Annex / Zoom',
      description: 'Detailed deep-dive of invoices, payments received, and business bank accounts.',
      startDate: '2026-07-15',
      startTime: '02:00 PM',
      endDate: '2026-07-15',
      endTime: '04:00 PM',
      department: 'Finance',
      attendees: ['Zara Khan'],
      clientName: 'Acme Corporation',
      host: 'Zara Khan',
      status: 'Scheduled',
      sendReminder: true,
      isRecurring: true,
      recurrence: 'Monthly'
    },
    {
      id: 'EVT-405',
      name: 'Biometric Badges Calibration Session',
      labelColor: '#ec4899', // Pink
      where: 'Lobby Hardware Terminal Port',
      description: 'Calibrating local biometric nodes to handle real-time handshakes.',
      startDate: '2026-07-08',
      startTime: '02:00 PM',
      endDate: '2026-07-08',
      endTime: '03:30 PM',
      department: 'Operations',
      attendees: ['Zara Khan', 'Elena Rostova'],
      host: 'Elena Rostova',
      status: 'Scheduled',
      sendReminder: false,
      isRecurring: false
    }
  ]);

  // View states
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [formMode, setFormMode] = useState<'view' | 'add_event' | 'add_recurring_event'>('view');
  
  // Navigation Calendar Dates (Focusing on July 2026 as per our app metadata)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 6 = July (0-indexed)

  // Filters State
  const [searchFilter, setSearchFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination for Recurring listing
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Month metadata
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // --- ADD FORM STATE ---
  const [formName, setFormName] = useState('');
  const [formLabelColor, setFormLabelColor] = useState('#6366f1');
  const [formWhere, setFormWhere] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStartDate, setFormStartDate] = useState('2026-07-05');
  const [formStartTime, setFormStartTime] = useState('09:00 AM');
  const [formEndDate, setFormEndDate] = useState('2026-07-05');
  const [formEndTime, setFormEndTime] = useState('10:00 AM');
  const [formDept, setFormDept] = useState('Technology');
  const [formAttendees, setFormAttendees] = useState<string[]>([]);
  const [formClient, setFormClient] = useState('');
  const [formHost, setFormHost] = useState('');
  const [formStatus, setFormStatus] = useState<'Scheduled' | 'Completed' | 'Canceled'>('Scheduled');
  const [formReminder, setFormReminder] = useState(true);
  const [formLink, setFormLink] = useState('');
  const [formRecurrence, setFormRecurrence] = useState('Weekly');

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Navigation handlers
  const handlePrev = () => {
    if (calendarViewMode === 'month') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      // simulate week/day slide
      alert('Previous date range loaded.');
    }
  };

  const handleNext = () => {
    if (calendarViewMode === 'month') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    } else {
      // simulate week/day slide
      alert('Next date range loaded.');
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(6); // July
  };

  // Toggle multi-select attendee
  const handleToggleAttendee = (empName: string) => {
    if (formAttendees.includes(empName)) {
      setFormAttendees(formAttendees.filter(name => name !== empName));
    } else {
      setFormAttendees([...formAttendees, empName]);
    }
  };

  // Form Submit Action
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!formName.trim()) errors.push('Event Name is required.');
    if (!formWhere.trim()) errors.push('Location / Where info is required.');
    if (!formStartDate) errors.push('Starts On Date is required.');
    if (!formHost) errors.push('Please specify an Event Host.');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    const newRecord: CalendarEventRecord = {
      id: `EVT-${Date.now()}`,
      name: formName,
      labelColor: formLabelColor,
      where: formWhere,
      description: formDesc,
      startDate: formStartDate,
      startTime: formStartTime,
      endDate: formEndDate || formStartDate,
      endTime: formEndTime,
      department: formDept,
      attendees: formAttendees.length > 0 ? formAttendees : ['Zara Khan'],
      clientName: formClient || undefined,
      host: formHost,
      status: formStatus,
      sendReminder: formReminder,
      eventLink: formLink || undefined,
      isRecurring: formMode === 'add_recurring_event',
      recurrence: formMode === 'add_recurring_event' ? formRecurrence : undefined
    };

    setEvents([newRecord, ...events]);
    setFormMode('view');
    
    // reset fields
    setFormName('');
    setFormWhere('');
    setFormDesc('');
    setFormAttendees([]);
    setFormClient('');
    setFormLink('');
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(evt => evt.id !== id));
    }
  };

  // Filter Event Logs
  const filteredEvents = events.filter(evt => {
    // subtab page constraint: standard subTab 'calendar' shows everything; subTab 'events' lists only recurring events
    const matchesPage = subTab === 'calendar' ? true : evt.isRecurring;

    // text search
    const matchesSearch = evt.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          evt.where.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          evt.description.toLowerCase().includes(searchFilter.toLowerCase());

    // attendee filter
    const matchesEmployee = employeeFilter === 'All' || evt.attendees.includes(employeeFilter) || evt.host === employeeFilter;

    // client filter
    const matchesClient = clientFilter === 'All' || evt.clientName === clientFilter;

    // status filter
    const matchesStatus = statusFilter === 'All' || evt.status === statusFilter;

    return matchesPage && matchesSearch && matchesEmployee && matchesClient && matchesStatus;
  });

  // Export Recurring CSV
  const handleExportRecurring = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Event Name,Where,Recurrence,Start Date,Start Time,End Date,Attendees,Status\n";
    filteredEvents.forEach(evt => {
      csvContent += `"${evt.name}","${evt.where}","${evt.recurrence || 'None'}","${evt.startDate}","${evt.startTime}","${evt.endDate}","${evt.attendees.join('; ')}","${evt.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `recurring_events_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for grid calendar layout (July 2026 defaults)
  // July 1st, 2026 is a Wednesday. (Wednesday is index 3 in Sunday-indexed array)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDayOfWeek = getStartDayOfWeek(currentYear, currentMonth);

  return (
    <div className="space-y-6">
      {formMode === 'view' ? (
        // ==========================================
        //             CALENDAR MAIN / LISTINGS
        // ==========================================
        <div className="space-y-4 animate-fade-in">
          {/* Quick Stats Toolbar / Filters Grid */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Left Search input */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events by keywords..."
                  className="w-full bg-slate-50/50 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>

              {/* View Switches (Standard Calendar) */}
              {subTab === 'calendar' && (
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit self-start sm:self-auto select-none">
                  {(['month', 'week', 'day', 'list'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setCalendarViewMode(mode)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                        calendarViewMode === mode ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all ${
                    showFilters 
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>

                {subTab === 'events' && (
                  <button
                    onClick={handleExportRecurring}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                )}

                <button
                  onClick={() => setFormMode('add_event')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Event</span>
                </button>

                <button
                  onClick={() => setFormMode('add_recurring_event')}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Recurring Event</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {(showFilters || employeeFilter !== 'All' || clientFilter !== 'All' || statusFilter !== 'All') && (
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-slide-down">
                {/* Employee attendee */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Staff Employee</label>
                  <select
                    className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={employeeFilter}
                    onChange={(e) => setEmployeeFilter(e.target.value)}
                  >
                    <option value="All">All Staff</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                {/* Client filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Client Partner</label>
                  <select
                    className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                  >
                    <option value="All">All Clients</option>
                    {clients.map(cli => (
                      <option key={cli.id} value={cli.name}>{cli.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Event Status</label>
                  <select
                    className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>

                {/* Reset Buttons */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchFilter('');
                      setEmployeeFilter('All');
                      setClientFilter('All');
                      setStatusFilter('All');
                    }}
                    className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg text-center"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ==========================================
              SUBTAB CALENDAR PAGE
              ========================================== */}
          {subTab === 'calendar' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              
              {/* Calendar Heading & Month Nav */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight font-mono">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                </div>

                {/* Arrow navigation buttons */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200/60 rounded-xl select-none">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleToday}
                    className="px-3 py-1.5 hover:bg-white text-slate-700 hover:text-slate-950 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-lg transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* MONTH VIEW CALENDAR GRID */}
              {calendarViewMode === 'month' && (
                <div className="space-y-2">
                  {/* Calendar Days Header */}
                  <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] uppercase text-slate-400 tracking-wider">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>

                  {/* Calendar Month Grid Cells */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Dummy padding cells of previous month */}
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                      <div key={`prev-${i}`} className="min-h-[75px] sm:min-h-[105px] p-2 bg-slate-50/50 border border-slate-100 rounded-xl text-xs text-slate-300 font-medium select-none">
                        {28 - startDayOfWeek + 1 + i}
                      </div>
                    ))}

                    {/* July Active Cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      
                      // Filter events occurring on this specific date
                      const dayEvents = filteredEvents.filter(evt => evt.startDate === dayString);

                      return (
                        <div
                          key={`day-${dayNum}`}
                          className="min-h-[75px] sm:min-h-[105px] p-2 bg-white hover:bg-indigo-50/10 border border-slate-200 hover:border-indigo-400 rounded-xl transition-all flex flex-col justify-between cursor-pointer group"
                          onClick={() => {
                            setFormStartDate(dayString);
                            setFormEndDate(dayString);
                            setFormMode('add_event');
                          }}
                        >
                          <span className="text-xs sm:text-sm font-extrabold text-slate-700 group-hover:text-indigo-600 font-mono">
                            {dayNum}
                          </span>

                          {/* Event bullet/lines inside grid */}
                          <div className="space-y-1 overflow-y-auto max-h-[50px] sm:max-h-[70px] scrollbar-none mt-1">
                            {dayEvents.map(evt => (
                              <div
                                key={evt.id}
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded leading-tight truncate border"
                                style={{
                                  backgroundColor: `${evt.labelColor}15`,
                                  color: evt.labelColor,
                                  borderColor: `${evt.labelColor}40`
                                }}
                                title={`${evt.startTime} - ${evt.name}`}
                              >
                                {evt.startTime} {evt.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Next Month filler cells */}
                    {Array.from({ length: (42 - daysInMonth - startDayOfWeek) % 7 }).map((_, i) => (
                      <div key={`next-${i}`} className="min-h-[75px] sm:min-h-[105px] p-2 bg-slate-50/50 border border-slate-100 rounded-xl text-xs text-slate-300 font-medium select-none">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LIST / WEEK / DAY VIEW SIMULATIONS */}
              {calendarViewMode !== 'month' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Info className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span>Displaying schedule events in list/agenda layout below.</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {filteredEvents.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <CalendarIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                        <p>No strategic events scheduled for this view range.</p>
                      </div>
                    ) : (
                      filteredEvents.map(evt => (
                        <div key={evt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                          <div className="flex items-start gap-4">
                            <div 
                              className="w-2.5 h-10 rounded-full shrink-0"
                              style={{ backgroundColor: evt.labelColor }}
                            />
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {evt.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-semibold font-mono">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {evt.startDate} ({evt.startTime} - {evt.endTime})
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {evt.where}
                                </span>
                                {evt.isRecurring && (
                                  <span className="bg-amber-50 text-amber-700 px-1.5 rounded">
                                    Recurring: {evt.recurrence}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="p-1.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              SUBTAB RECURRING EVENTS PAGE
              ========================================== */}
          {subTab === 'events' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider select-none">
                        <th className="px-6 py-4">Event Name</th>
                        <th className="px-6 py-4">Where</th>
                        <th className="px-6 py-4">Recurrence</th>
                        <th className="px-6 py-4">Start Date</th>
                        <th className="px-6 py-4">Start Time</th>
                        <th className="px-6 py-4">End Time</th>
                        <th className="px-6 py-4">Attendees</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center text-slate-400 font-medium">
                            <RefreshCw className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                            <p>No active recurring schedules found in database.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map(evt => (
                          <tr key={evt.id} className="hover:bg-slate-50/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: evt.labelColor }} />
                                <span className="font-extrabold text-slate-800 leading-snug">{evt.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-600">{evt.where}</td>
                            <td className="px-6 py-4 font-bold text-amber-700 font-mono">
                              <span className="bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                                {evt.recurrence || 'Weekly'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-500 font-medium">{evt.startDate}</td>
                            <td className="px-6 py-4 font-mono font-medium text-slate-500">{evt.startTime}</td>
                            <td className="px-6 py-4 font-mono font-medium text-slate-500">{evt.endTime}</td>
                            <td className="px-6 py-4 font-semibold text-indigo-600">
                              {evt.attendees.slice(0, 2).join(', ')}
                              {evt.attendees.length > 2 && ` (+${evt.attendees.length - 2} more)`}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                evt.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {evt.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="p-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg transition-all"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                      className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <span>entries</span>
                  </div>

                  <span className="font-mono text-slate-400">
                    Displaying 1 - {filteredEvents.length} of {filteredEvents.length} schedules
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // ==========================================
        //             ADD EVENT FORM (Standard & Recurring)
        // ==========================================
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {formMode === 'add_recurring_event' ? 'Add Recurring Corporate Event' : 'Add Corporate Calendar Event'}
              </h3>
              <p className="text-xs text-slate-400">Establish corporate meetings, design layout reminders, and bind attendee groups.</p>
            </div>
            <button
              onClick={() => setFormMode('view')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>

          {/* Validation Banner */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs uppercase text-rose-900">
                <AlertCircle className="h-4 w-4" />
                <span>Form Submission Errors</span>
              </div>
              <ul className="list-disc pl-5 text-[11px] font-semibold space-y-0.5">
                {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}

          <form onSubmit={handleSaveEvent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Event Name (7 cols) */}
              <div className="md:col-span-8">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Server cluster node validation"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              {/* Label Color picker (4 cols) */}
              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Visual Label Color</label>
                <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200 h-[42px] px-3">
                  {['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ef4444'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormLabelColor(color)}
                      className={`h-6 w-6 rounded-full border transition-all flex items-center justify-center shrink-0`}
                      style={{ backgroundColor: color }}
                    >
                      {formLabelColor === color && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Starts & Ends Date/Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Starts On Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none font-semibold font-mono"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Starts On Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 11:00 AM"
                  className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none font-semibold font-mono"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ends On Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none font-semibold font-mono"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ends On Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12:30 PM"
                  className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none font-semibold font-mono"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Recurrence Pattern selector */}
            {formMode === 'add_recurring_event' && (
              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Recurrence Frequency</label>
                  <select
                    className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none font-bold"
                    value={formRecurrence}
                    onChange={(e) => setFormRecurrence(e.target.value)}
                  >
                    <option value="Daily">Daily Recurring Pattern</option>
                    <option value="Weekly">Weekly (Every 7 days)</option>
                    <option value="Bi-weekly">Bi-weekly (Every 14 days)</option>
                    <option value="Monthly">Monthly Repeating Grid</option>
                  </select>
                </div>
                <div className="flex items-center text-xs text-amber-700 font-semibold leading-relaxed">
                  <Info className="h-5 w-5 shrink-0 mr-2" />
                  <span>The system will automatically extrapolate calendar instances spanning the next 12 calendar months.</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Where Location */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Where / Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meeting Room Beta / Zoom link"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={formWhere}
                  onChange={(e) => setFormWhere(e.target.value)}
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department Routing</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                >
                  <option value="Technology">Technology & Development</option>
                  <option value="Human Resources">Human Resources (HR)</option>
                  <option value="Finance">Finance & Ledger Audit</option>
                  <option value="Sales / Marketing">Sales / Marketing</option>
                  <option value="Operations">Operations Space</option>
                </select>
              </div>

              {/* Event Host */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Event Host (Organizer)</label>
                <select
                  required
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  value={formHost}
                  onChange={(e) => setFormHost(e.target.value)}
                >
                  <option value="">-- Pick Organizer Host --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Client Associate (Optional)</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                >
                  <option value="">-- No Client Partner Linked --</option>
                  {clients.map(cli => (
                    <option key={cli.id} value={cli.name}>{cli.name}</option>
                  ))}
                </select>
              </div>

              {/* Event link */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Meeting / Event URL</label>
                <input
                  type="url"
                  placeholder="e.g. https://meet.google.com/abc"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                />
              </div>
            </div>

            {/* Employee Attendees Multiselect */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendees (Select Corporate Employees)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                {employees.map(emp => {
                  const isChecked = formAttendees.includes(emp.name);
                  return (
                    <div
                      key={emp.id}
                      onClick={() => handleToggleAttendee(emp.name)}
                      className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                        isChecked 
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate leading-none mb-0.5">{emp.name}</p>
                        <p className="text-[9px] text-slate-400 font-semibold font-mono leading-none truncate">{emp.designation}</p>
                      </div>
                      {isChecked && <Check className="h-4 w-4 text-indigo-700 shrink-0 ml-1" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description Mock Editor */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detailed Description / Memo</label>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-bold font-mono">
                  <span>Bold</span>
                  <span>Italic</span>
                  <span>Underline</span>
                  <span>Code</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Strategic agenda, presentation outlines, or guest details..."
                  className="w-full bg-white p-4 text-xs font-semibold focus:outline-none text-slate-800"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>
            </div>

            {/* File Upload & Send reminder toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* File Attachment Mock */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-all">
                <CalendarIcon className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-700">Attach files or slide decks</p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">PDF, PPTX (Limit 20MB)</p>
              </div>

              {/* Status and reminder */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">Broadcast Slack Reminder</p>
                    <p className="text-[10px] text-slate-400 font-medium">Auto notification to all selected attendees.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formReminder}
                    onChange={(e) => setFormReminder(e.target.checked)}
                    className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Initial Event Status</span>
                  <select
                    className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded-lg text-slate-700 focus:outline-none font-bold"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form submissions */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setFormMode('view')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Save Event Configuration</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
