import React, { useState } from 'react';
import { 
  TrendingUp, Plus, Edit2, Trash2, X, Check, Bell, MessageSquare, ShieldAlert, Sliders, PlayCircle
} from 'lucide-react';

interface PerformanceSettingsProps {
  onNotify: (message: string) => void;
}

interface GoalType {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

interface KeyResultMetric {
  id: string;
  name: string;
  unit: string;
  calculation: 'Sum' | 'Average' | 'Last Value';
  status: 'Active' | 'Inactive';
}

interface DiscussionQuestion {
  id: string;
  question: string;
}

export default function PerformanceSettings({ onNotify }: PerformanceSettingsProps) {
  const [activeTab, setActiveTab] = useState<'goal_types' | 'metrics' | 'notifications' | 'meetings'>('goal_types');

  // 1. Goal Types State & Modal
  const [goalTypes, setGoalTypes] = useState<GoalType[]>([
    { id: '1', name: 'Core Performance Goal', description: 'Quarterly company OKRs mapped to core team delivery.', status: 'Active' },
    { id: '2', name: 'Professional Development', description: 'Personal growth, training courses, and certification milestones.', status: 'Active' },
    { id: '3', name: 'Operational Efficiency', description: 'Infrastructure quality improvements, speed optimization, and process refinements.', status: 'Active' }
  ]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalType | null>(null);
  const [goalForm, setGoalForm] = useState({
    name: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });
  const [goalError, setGoalError] = useState('');

  // 2. Key Results Metrics State & Modal
  const [metrics, setMetrics] = useState<KeyResultMetric[]>([
    { id: '1', name: 'Sales Revenue', unit: '$ USD', calculation: 'Sum', status: 'Active' },
    { id: '2', name: 'Task Completion Rate', unit: '%', calculation: 'Average', status: 'Active' },
    { id: '3', name: 'Software Bug Count Reductions', unit: 'Bugs count', calculation: 'Last Value', status: 'Active' }
  ]);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState<KeyResultMetric | null>(null);
  const [metricForm, setMetricForm] = useState({
    name: '',
    unit: '',
    calculation: 'Sum' as 'Sum' | 'Average' | 'Last Value',
    status: 'Active' as 'Active' | 'Inactive'
  });
  const [metricError, setMetricError] = useState('');

  // 3. Notification Settings State
  const [notifyAppraisals, setNotifyAppraisals] = useState(true);
  const [reminderDays, setReminderDays] = useState(15);
  const [notifyFrequency, setNotifyFrequency] = useState<'Daily' | 'Weekly' | 'Once'>('Weekly');
  const [notifyPeerFeedback, setNotifyPeerFeedback] = useState(true);
  const [notifyApprovals, setNotifyApprovals] = useState(true);

  // 4. 1:1 Meetings State & Modal
  const [meetingCadence, setMeetingCadence] = useState<'Weekly' | 'Bi-weekly' | 'Monthly'>('Bi-weekly');
  const [meetingTemplate, setMeetingTemplate] = useState('Standard 3-Question');
  const [meetingAutoReminders, setMeetingAutoReminders] = useState(true);
  const [discussionQuestions, setDiscussionQuestions] = useState<DiscussionQuestion[]>([
    { id: '1', question: 'What has been your main highlight or achievement since we last spoke?' },
    { id: '2', question: 'What is currently your biggest blocker, and how can I help you resolve it?' },
    { id: '3', question: 'Are you satisfied with your current progress towards your active OKRs?' }
  ]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<DiscussionQuestion | null>(null);
  const [questionText, setQuestionText] = useState('');

  // --- GOAL TYPES HANDLERS ---
  const handleOpenGoalModal = (goal: GoalType | null = null) => {
    if (goal) {
      setEditingGoal(goal);
      setGoalForm({ name: goal.name, description: goal.description, status: goal.status });
    } else {
      setEditingGoal(null);
      setGoalForm({ name: '', description: '', status: 'Active' });
    }
    setGoalError('');
    setShowGoalModal(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.name.trim()) {
      setGoalError('Goal Type Name is required');
      return;
    }

    if (editingGoal) {
      setGoalTypes(prev => prev.map(g => g.id === editingGoal.id ? { ...g, ...goalForm } : g));
      onNotify(`Goal Type "${goalForm.name}" updated.`);
    } else {
      const newGoal: GoalType = {
        id: Date.now().toString(),
        ...goalForm
      };
      setGoalTypes(prev => [...prev, newGoal]);
      onNotify(`Goal Type "${goalForm.name}" created.`);
    }
    setShowGoalModal(false);
  };

  const handleDeleteGoal = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete Goal Type "${name}"?`)) {
      setGoalTypes(prev => prev.filter(g => g.id !== id));
      onNotify(`Goal Type "${name}" deleted.`);
    }
  };

  const handleToggleGoalStatus = (id: string) => {
    setGoalTypes(prev => prev.map(g => {
      if (g.id === id) {
        const nextStatus = g.status === 'Active' ? 'Inactive' : 'Active';
        onNotify(`Status for "${g.name}" updated to ${nextStatus}.`);
        return { ...g, status: nextStatus };
      }
      return g;
    }));
  };

  // --- KEY RESULTS METRIC HANDLERS ---
  const handleOpenMetricModal = (metric: KeyResultMetric | null = null) => {
    if (metric) {
      setEditingMetric(metric);
      setMetricForm({ name: metric.name, unit: metric.unit, calculation: metric.calculation, status: metric.status });
    } else {
      setEditingMetric(null);
      setMetricForm({ name: '', unit: '', calculation: 'Sum', status: 'Active' });
    }
    setMetricError('');
    setShowMetricModal(true);
  };

  const handleSaveMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricForm.name.trim()) {
      setMetricError('Metric Name is required');
      return;
    }
    if (!metricForm.unit.trim()) {
      setMetricError('Target Unit is required');
      return;
    }

    if (editingMetric) {
      setMetrics(prev => prev.map(m => m.id === editingMetric.id ? { ...m, ...metricForm } : m));
      onNotify(`Metric "${metricForm.name}" updated.`);
    } else {
      const newMetric: KeyResultMetric = {
        id: Date.now().toString(),
        ...metricForm
      };
      setMetrics(prev => [...prev, newMetric]);
      onNotify(`Metric "${metricForm.name}" created.`);
    }
    setShowMetricModal(false);
  };

  const handleDeleteMetric = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete Key Results Metric "${name}"?`)) {
      setMetrics(prev => prev.filter(m => m.id !== id));
      onNotify(`Key Results Metric "${name}" deleted.`);
    }
  };

  const handleToggleMetricStatus = (id: string) => {
    setMetrics(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'Active' ? 'Inactive' : 'Active';
        onNotify(`Status for "${m.name}" updated to ${nextStatus}.`);
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  // --- NOTIFICATION HANDLERS ---
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Performance notifications configurations saved successfully.');
  };

  // --- 1:1 MEETING QUESTIONS HANDLERS ---
  const handleOpenQuestionModal = (q: DiscussionQuestion | null = null) => {
    if (q) {
      setEditingQuestion(q);
      setQuestionText(q.question);
    } else {
      setEditingQuestion(null);
      setQuestionText('');
    }
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    if (editingQuestion) {
      setDiscussionQuestions(prev => prev.map(q => q.id === editingQuestion.id ? { ...q, question: questionText.trim() } : q));
      onNotify('1:1 meeting discussion prompt updated.');
    } else {
      const newQ: DiscussionQuestion = {
        id: Date.now().toString(),
        question: questionText.trim()
      };
      setDiscussionQuestions(prev => [...prev, newQ]);
      onNotify('Added new 1:1 meeting discussion prompt.');
    }
    setShowQuestionModal(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Delete this 1:1 meeting discussion prompt?')) {
      setDiscussionQuestions(prev => prev.filter(q => q.id !== id));
      onNotify('1:1 discussion prompt removed.');
    }
  };

  const handleSaveMeetingsConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('1:1 meeting configuration parameters saved.');
  };

  return (
    <div className="space-y-6" id="performance-settings-view">
      
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>Performance Settings</span>
          </h2>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            <span>Settings</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">HR</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-400 font-medium">Performance Settings</span>
          </div>
        </div>

        {/* Dynamic Add Buttons */}
        <div>
          {activeTab === 'goal_types' && (
            <button 
              onClick={() => handleOpenGoalModal()}
              className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors shrink-0"
            >
              <span className="font-extrabold text-sm leading-none">+</span>
              <span>Add Goal Type</span>
            </button>
          )}
          {activeTab === 'metrics' && (
            <button 
              onClick={() => handleOpenMetricModal()}
              className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors shrink-0"
            >
              <span className="font-extrabold text-sm leading-none">+</span>
              <span>Add Key Result Metric</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex flex-wrap border-b border-slate-200">
        {[
          { key: 'goal_types', label: 'Goal Type Settings' },
          { key: 'metrics', label: 'Key Results Metrics' },
          { key: 'notifications', label: 'Notification Settings' },
          { key: 'meetings', label: '1:1 Meeting Settings' }
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
        
        {/* TAB 1: GOAL TYPES */}
        {activeTab === 'goal_types' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-5 py-3.5 w-16">#</th>
                  <th className="px-5 py-3.5">Goal Type Name</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right w-44">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {goalTypes.map((goal, index) => (
                  <tr key={goal.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-semibold">{index + 1}</td>
                    <td className="px-5 py-4 text-slate-800 font-bold">{goal.name}</td>
                    <td className="px-5 py-4 text-slate-500 font-semibold leading-relaxed">{goal.description}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleGoalStatus(goal.id)}
                        className="cursor-pointer"
                      >
                        {goal.status === 'Active' ? (
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
                          onClick={() => handleOpenGoalModal(goal)}
                          className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id, goal.name)}
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

        {/* TAB 2: KEY RESULTS METRICS */}
        {activeTab === 'metrics' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-5 py-3.5 w-16">#</th>
                  <th className="px-5 py-3.5">Metric Name</th>
                  <th className="px-5 py-3.5">Target Unit</th>
                  <th className="px-5 py-3.5">Calculation Mode</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right w-44">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map((metric, index) => (
                  <tr key={metric.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-semibold">{index + 1}</td>
                    <td className="px-5 py-4 text-slate-800 font-bold">{metric.name}</td>
                    <td className="px-5 py-4 text-slate-600 font-semibold font-mono">{metric.unit}</td>
                    <td className="px-5 py-4 text-indigo-600 font-bold">{metric.calculation}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleMetricStatus(metric.id)}
                        className="cursor-pointer"
                      >
                        {metric.status === 'Active' ? (
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
                          onClick={() => handleOpenMetricModal(metric)}
                          className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMetric(metric.id, metric.name)}
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

        {/* TAB 3: NOTIFICATION SETTINGS */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleSaveNotifications} className="space-y-6 max-w-2xl text-xs font-semibold">
            <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
              <div className="space-y-0.5">
                <h4 className="text-slate-800 font-extrabold text-[13px] flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <span>Appraisal Trigger Alerts</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">Send automatic email prompts ahead of annual employee performance review cycles.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyAppraisals(!notifyAppraisals)}
                className="text-slate-700 cursor-pointer"
              >
                <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${notifyAppraisals ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${notifyAppraisals ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>

            {notifyAppraisals && (
              <div className="pl-6 border-l-2 border-slate-100 space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 block">Lead Days to Notify Before Appraisal Ends</label>
                    <input 
                      type="number" 
                      value={reminderDays}
                      onChange={(e) => setReminderDays(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-600 block">Self-Assessment Reminder Frequency</label>
                    <select
                      value={notifyFrequency}
                      onChange={(e) => setNotifyFrequency(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold bg-white"
                    >
                      <option value="Daily">Daily Reminders</option>
                      <option value="Weekly">Weekly Reminders</option>
                      <option value="Once">Once Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
              <div className="space-y-0.5">
                <h4 className="text-slate-800 font-extrabold text-[13px] flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-indigo-500" />
                  <span>Peer-to-Peer Feedback Prompts</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">Enable employee peer reviews and send daily digest emails to supervisors when feedback is submitted.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyPeerFeedback(!notifyPeerFeedback)}
                className="text-slate-700 cursor-pointer"
              >
                <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${notifyPeerFeedback ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${notifyPeerFeedback ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
              <div className="space-y-0.5">
                <h4 className="text-slate-800 font-extrabold text-[13px] flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Manager Performance Approvals</span>
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">Send real-time alerts to managers when an employee submits their objective results for review.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyApprovals(!notifyApprovals)}
                className="text-slate-700 cursor-pointer"
              >
                <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${notifyApprovals ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${notifyApprovals ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-150 flex justify-end">
              <button 
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Save Notification Configurations</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: 1:1 MEETING SETTINGS */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveMeetingsConfig} className="space-y-4 max-w-2xl text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-600 block">Default 1:1 Meeting Cadence</label>
                  <select
                    value={meetingCadence}
                    onChange={(e) => setMeetingCadence(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold bg-white text-slate-700"
                  >
                    <option value="Weekly">Weekly (Every 7 days)</option>
                    <option value="Bi-weekly">Bi-weekly (Every 14 days)</option>
                    <option value="Monthly">Monthly (Every 30 days)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 block">Active Feedback Template</label>
                  <select
                    value={meetingTemplate}
                    onChange={(e) => setMeetingTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold bg-white text-slate-700"
                  >
                    <option value="Standard 3-Question">Standard 3-Question Cadence</option>
                    <option value="Executive Review">Executive Review Milestones</option>
                    <option value="Career Goal Discovery">Career Goal Discovery</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-slate-50/50 border border-slate-150 rounded-xl gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-slate-800 font-extrabold text-[12px]">Auto-remind Facilitators & Attendees</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Send automatic Google Calendar & in-app alerts 2 hours prior to scheduled continuous feedback loops.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMeetingAutoReminders(!meetingAutoReminders)}
                  className="text-slate-700 cursor-pointer"
                >
                  <div className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ${meetingAutoReminders ? 'bg-[#1d82f5]' : 'bg-slate-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-xs transform transition-transform duration-200 ${meetingAutoReminders ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="h-4.5 w-4.5 text-blue-500" />
                  <span>Structured Discussion Questions</span>
                </h3>
                <button 
                  type="button"
                  onClick={() => handleOpenQuestionModal()}
                  className="px-2.5 py-1.5 bg-[#1d82f5] hover:bg-blue-600 text-white font-bold rounded flex items-center gap-1 cursor-pointer shadow-3xs"
                >
                  <span className="font-extrabold leading-none">+</span>
                  <span>Add Question</span>
                </button>
              </div>
            </form>

            <div className="bg-slate-50/30 rounded-lg border border-slate-200 p-4 space-y-3">
              {discussionQuestions.map((q, index) => (
                <div key={q.id} className="flex justify-between items-start p-3 bg-white border border-slate-150 rounded-md gap-4">
                  <div className="flex items-start gap-2.5">
                    <span className="font-extrabold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-mono shrink-0">Q{index + 1}</span>
                    <span className="text-slate-700 text-xs font-bold leading-relaxed">{q.question}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenQuestionModal(q)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                      title="Edit Question"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-150 flex justify-end">
              <button 
                type="button"
                onClick={handleSaveMeetingsConfig}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Save Performance Meetings Config</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: GOAL TYPE MODAL */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="goal-modal">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800">
                {editingGoal ? 'Edit Goal Type Settings' : 'Add Goal Type Settings'}
              </h3>
              <button 
                onClick={() => setShowGoalModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveGoal} className="p-5 space-y-4 text-xs font-semibold">
              {goalError && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-700 rounded-md flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{goalError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Goal Type Name *</label>
                <input 
                  type="text" 
                  value={goalForm.name}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Sales KPI Goal"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Description</label>
                <textarea 
                  value={goalForm.description}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the target audience or objective type..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Status</label>
                <select
                  value={goalForm.status}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1d82f5] hover:bg-blue-600 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Goal Type</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: KEY RESULT METRIC MODAL */}
      {showMetricModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="metric-modal">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800">
                {editingMetric ? 'Edit Key Results Metric' : 'Add Key Results Metric'}
              </h3>
              <button 
                onClick={() => setShowMetricModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveMetric} className="p-5 space-y-4 text-xs font-semibold">
              {metricError && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-700 rounded-md flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" />
                  <span>{metricError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Metric Name *</label>
                <input 
                  type="text" 
                  value={metricForm.name}
                  onChange={(e) => setMetricForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Sales Revenue Milestone"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Target Unit / Symbol *</label>
                <input 
                  type="text" 
                  value={metricForm.unit}
                  onChange={(e) => setMetricForm(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g. %, $ USD, Tasks, hours"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Calculation Method</label>
                <select
                  value={metricForm.calculation}
                  onChange={(e) => setMetricForm(prev => ({ ...prev, calculation: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700 bg-white"
                >
                  <option value="Sum">Sum (Aggregate incremental updates)</option>
                  <option value="Average">Average (Average rating milestones)</option>
                  <option value="Last Value">Last Value (Latest recorded milestone status)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-600 block">Status</label>
                <select
                  value={metricForm.status}
                  onChange={(e) => setMetricForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowMetricModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1d82f5] hover:bg-blue-600 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Metric</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DISCUSSION QUESTION MODAL */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="question-modal">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800">
                {editingQuestion ? 'Edit Discussion Prompt' : 'Add Discussion Prompt'}
              </h3>
              <button 
                onClick={() => setShowQuestionModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveQuestion} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-600 block">Structured Question Text *</label>
                <textarea 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter standard question prompt to guide reviews..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold rounded cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#1d82f5] hover:bg-blue-600 text-white font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Prompt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
