import React, { useState } from 'react';
import { HelpCircle, Save, Plus, Trash2, FolderKanban, Check, Sliders, ToggleLeft, ToggleRight, LayoutGrid } from 'lucide-react';

interface ProjectSettingsProps {
  onNotify: (message: string) => void;
}

interface ProjectStatus {
  id: string;
  name: string;
  color: string;
  isClosed: boolean;
  order: number;
}

interface ProjectCategory {
  id: string;
  name: string;
}

export default function ProjectSettings({ onNotify }: ProjectSettingsProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'categories' | 'defaults'>('status');

  // Project Status state
  const [statuses, setStatuses] = useState<ProjectStatus[]>( [
    { id: 'st-1', name: 'Planning', color: '#6366f1', isClosed: false, order: 1 },
    { id: 'st-2', name: 'In Progress', color: '#0ea5e9', isClosed: false, order: 2 },
    { id: 'st-3', name: 'Under Review', color: '#f59e0b', isClosed: false, order: 3 },
    { id: 'st-4', name: 'On Hold', color: '#64748b', isClosed: false, order: 4 },
    { id: 'st-5', name: 'Completed', color: '#10b981', isClosed: true, order: 5 },
    { id: 'st-6', name: 'Cancelled', color: '#ef4444', isClosed: true, order: 6 }
  ]);

  // Project Categories state
  const [categories, setCategories] = useState<ProjectCategory[]>([
    { id: 'cat-1', name: 'Web Application Development' },
    { id: 'cat-2', name: 'Mobile Application (iOS/Android)' },
    { id: 'cat-3', name: 'Enterprise SaaS Consulting' },
    { id: 'cat-4', name: 'SEO & Content Marketing Campaigns' },
    { id: 'cat-5', name: 'Cloud Infrastructure & DevOps Auditing' }
  ]);

  // Default settings
  const [defaultViewMode, setDefaultViewMode] = useState('Kanban Board');
  const [clientTimesheetVisibility, setClientTimesheetVisibility] = useState(true);
  const [ganttTimelineMilestones, setGanttTimelineMilestones] = useState(true);

  // Form states
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#6366f1');
  const [newStatusIsClosed, setNewStatusIsClosed] = useState(false);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName.trim()) return;

    const newSt: ProjectStatus = {
      id: `st-${Date.now()}`,
      name: newStatusName,
      color: newStatusColor,
      isClosed: newStatusIsClosed,
      order: statuses.length + 1
    };

    setStatuses(prev => [...prev, newSt]);
    setIsAddingStatus(false);
    setNewStatusName('');
    setNewStatusColor('#6366f1');
    setNewStatusIsClosed(false);
    onNotify(`Created Project Status "${newSt.name}"!`);
  };

  const handleDeleteStatus = (id: string) => {
    if (statuses.length <= 2) {
      onNotify('Must maintain at least two project status stages.');
      return;
    }
    setStatuses(prev => prev.filter(s => s.id !== id));
    onNotify('Project status deleted.');
  };

  const toggleStatusClosed = (id: string) => {
    setStatuses(prev => prev.map(s => {
      if (s.id === id) {
        const updatedClosed = !s.isClosed;
        onNotify(`Status "${s.name}" is now marked as ${updatedClosed ? 'Closed/Completed' : 'Active'}.`);
        return { ...s, isClosed: updatedClosed };
      }
      return s;
    }));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCat: ProjectCategory = {
      id: `cat-${Date.now()}`,
      name: newCategoryName
    };

    setCategories(prev => [...prev, newCat]);
    setIsAddingCategory(false);
    setNewCategoryName('');
    onNotify(`Project category "${newCat.name}" added successfully!`);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    onNotify('Category removed.');
  };

  const handleSaveAll = () => {
    onNotify('Project configuration rules updated!');
  };

  return (
    <div className="space-y-6" id="project-settings-root">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • System Settings • Project Settings
        </div>
        <h2 className="text-xl font-bold text-slate-800">Project Settings</h2>
        <p className="text-xs text-slate-500 font-medium font-semibold">Customize workflow status pipelines, manage corporate project categories, and configure view dashboards.</p>
      </div>

      {/* Subtab selection */}
      <div className="flex gap-2 border-b border-slate-150 pb-2">
        <button
          onClick={() => setActiveTab('status')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'status' 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
              : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          Project Status Stages
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'categories' 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
              : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
          }`}
        >
          <FolderKanban className="h-3.5 w-3.5" />
          Project Categories
        </button>
        <button
          onClick={() => setActiveTab('defaults')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'defaults' 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
              : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Default Configurations
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-3xs p-6 space-y-6">
        
        {/* PANEL 1: Project Status */}
        {activeTab === 'status' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Project Kanban Status Stages</h3>
                <p className="text-[11px] text-slate-500 font-semibold">Map stages to track project pipelines. Columns marked as closed count towards completed milestones.</p>
              </div>
              <button
                onClick={() => setIsAddingStatus(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                Add Status Stage
              </button>
            </div>

            <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-150 text-[10px] text-slate-400 font-black uppercase">
                    <th className="p-3.5 pl-6">Order</th>
                    <th className="p-3.5">Status Stage Name</th>
                    <th className="p-3.5">Visual Label Theme</th>
                    <th className="p-3.5 text-center">Closes Project</th>
                    <th className="p-3.5 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {statuses.map((s, index) => (
                    <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 pl-6 text-[11px] text-slate-400 font-mono">#{index + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/5 flex-shrink-0" style={{ backgroundColor: s.color, boxShadow: `0 0 0 2px ${s.color}20` }} />
                          <span className="font-extrabold text-slate-800 text-[13px]">{s.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-500" style={{ color: s.color }}>
                          {s.color}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleStatusClosed(s.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer border transition-all ${
                            s.isClosed 
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/55' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/55'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${s.isClosed ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {s.isClosed ? 'Closed State' : 'Active State'}
                        </button>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => handleDeleteStatus(s.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Stage"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL 2: Categories */}
        {activeTab === 'categories' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Business Project Categories</h3>
                <p className="text-[11px] text-slate-500 font-semibold font-medium">Categorize client tasks & scopes to filter workload metrics in financial sheets.</p>
              </div>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>

            <div className="divide-y divide-slate-150 border border-slate-150 rounded-xl overflow-hidden bg-white">
              {categories.map(c => (
                <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50/20 text-xs font-bold text-slate-700">
                  <span className="text-slate-800 font-extrabold">{c.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 3: Default configurations */}
        {activeTab === 'defaults' && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Project Initialization Defaults</h3>
              <p className="text-[11px] text-slate-500 font-semibold font-medium">Auto-apply default settings when initializing new project boards.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Default Team Workspace Layout</label>
                <select
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                  value={defaultViewMode}
                  onChange={(e) => setDefaultViewMode(e.target.value)}
                >
                  <option>Kanban Board</option>
                  <option>Gantt Timeline Chart</option>
                  <option>Flat List View</option>
                  <option>Calendar Milestones</option>
                </select>
              </div>
            </div>

            <div className="border-t border-slate-150 pt-4 space-y-3.5 text-xs font-semibold">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/40 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-800 font-bold block">Timesheet Client Visibility</span>
                  <span className="text-[10px] text-slate-400 font-medium font-semibold">Allow client logs to see recorded task timesheets automatically.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setClientTimesheetVisibility(!clientTimesheetVisibility)}
                  className="w-11 h-6 rounded-full transition-colors relative p-0.5 bg-slate-300"
                  style={{ backgroundColor: clientTimesheetVisibility ? '#4f46e5' : '#cbd5e1' }}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${clientTimesheetVisibility ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/40 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-800 font-bold block">Gantt Timeline Milestones Tracking</span>
                  <span className="text-[10px] text-slate-400 font-medium font-semibold">Display timeline charts and milestones targets on the projects overview tab.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setGanttTimelineMilestones(!ganttTimelineMilestones)}
                  className="w-11 h-6 rounded-full transition-colors relative p-0.5 bg-slate-300"
                  style={{ backgroundColor: ganttTimelineMilestones ? '#4f46e5' : '#cbd5e1' }}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${ganttTimelineMilestones ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end border-t border-slate-150 pt-5">
          <button
            type="button"
            onClick={handleSaveAll}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
          >
            <Save className="h-4 w-4" />
            Save Project Settings
          </button>
        </div>
      </div>

      {/* MODAL: Add Status Stage */}
      {isAddingStatus && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Add Status Stage</span>
              <button onClick={() => setIsAddingStatus(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddStatus} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Stage Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Quality Assurance"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Visual Label Theme (Hex Color)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="w-10 h-10 p-0.5 rounded border border-slate-200 cursor-pointer"
                    value={newStatusColor}
                    onChange={(e) => setNewStatusColor(e.target.value)}
                  />
                  <input
                    type="text"
                    required
                    className="flex-1 bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold font-mono"
                    value={newStatusColor}
                    onChange={(e) => setNewStatusColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <input
                  type="checkbox"
                  id="new_st_closed"
                  className="rounded border-slate-300 text-indigo-600 cursor-pointer"
                  checked={newStatusIsClosed}
                  onChange={(e) => setNewStatusIsClosed(e.target.checked)}
                />
                <label htmlFor="new_st_closed" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Closes/Completes Project when in this stage
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setIsAddingStatus(false)} className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-3xs">Create Stage</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Category */}
      {isAddingCategory && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Add Project Category</span>
              <button onClick={() => setIsAddingCategory(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Marketing Retainer"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setIsAddingCategory(false)} className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-3xs">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
