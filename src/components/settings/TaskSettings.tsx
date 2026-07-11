/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckSquare, Save, Settings, Layers, Star, Play, ClipboardList
} from 'lucide-react';

interface TaskSettingsProps {
  onNotify: (msg: string) => void;
}

export default function TaskSettings({ onNotify }: TaskSettingsProps) {
  const [defaultPriority, setDefaultPriority] = useState('Medium');
  const [defaultStatus, setDefaultStatus] = useState('ToDo');
  const [saving, setSaving] = useState(false);

  // Active view maps
  const [views, setViews] = useState({
    board: true,
    calendar: true,
    list: true,
    gantt: false
  });

  const toggleView = (key: keyof typeof views) => {
    setViews(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      onNotify('Task defaults saved successfully!');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-indigo-600" />
          <span>Task Settings</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Establish default prioritization levels, active dashboard layouts, and standard workflow statuses.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-150 bg-slate-50/50">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-indigo-600" />
              <span>Task Generation Defaults</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Configure fallback fields applied automatically when team members create new tasks.</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Priority */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 block font-black flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <span>Default Priority Level</span>
                </label>
                <select
                  value={defaultPriority}
                  onChange={(e) => setDefaultPriority(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer w-full"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority (Standard)</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent Priority (Escalated)</option>
                </select>
              </div>

              {/* Default Status mapping */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 block font-black flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Default Task Status Mapping</span>
                </label>
                <select
                  value={defaultStatus}
                  onChange={(e) => setDefaultStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer w-full"
                >
                  <option value="ToDo">To Do (Default queue)</option>
                  <option value="In Progress">In Progress (Active development)</option>
                  <option value="Review">In Review (QA / Approval Stage)</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

            </div>

            {/* Active view selectors */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-[10px] uppercase text-slate-400 block font-black">Active Dashboard Layouts</label>
              <p className="text-[11px] text-slate-400 font-semibold">Enable or hide different visual task managers across projects:</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  { key: 'board', label: 'Kanban Board' },
                  { key: 'calendar', label: 'Calendar Planner' },
                  { key: 'list', label: 'List View' },
                  { key: 'gantt', label: 'Gantt Timeline' }
                ].map((view) => {
                  const isChecked = views[view.key as keyof typeof views];
                  return (
                    <button
                      key={view.key}
                      type="button"
                      onClick={() => toggleView(view.key as any)}
                      className={`p-3 border rounded-xl flex items-center gap-2 text-xs font-extrabold cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-indigo-50/50 border-indigo-200 text-indigo-700' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className="shrink-0">
                        {isChecked ? (
                          <span className="w-4 h-4 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                        ) : (
                          <span className="w-4 h-4 border border-slate-300 rounded block" />
                        )}
                      </span>
                      <span>{view.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form action bar */}
          <div className="p-5 border-t border-slate-150 bg-slate-50/50 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
