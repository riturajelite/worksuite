/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Clock, Camera, ToggleLeft, ToggleRight, CheckSquare, Square, 
  Save, AlertCircle, Play, Sliders, ShieldCheck
} from 'lucide-react';

interface TimeLogSettingsProps {
  onNotify: (msg: string) => void;
}

export default function TimeLogSettings({ onNotify }: TimeLogSettingsProps) {
  const [randomScreenshot, setRandomScreenshot] = useState(false);
  const [screenshotFrequency, setScreenshotFrequency] = useState('10m');
  const [saving, setSaving] = useState(false);

  // Active tracking scopes
  const [scopes, setScopes] = useState({
    projects: true,
    tasks: true,
    clients: false,
    workflows: false
  });

  const toggleScope = (key: keyof typeof scopes) => {
    setScopes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      onNotify('Time log settings updated successfully.');
    }, 850);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          <span>Time Log Settings</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Configure tracking methods, random screenshot capturing policies, and active telemetry modules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-150 bg-slate-50/50">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-indigo-600" />
              <span>Time Tracker & Capture Policies</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Specify active scopes and screenshot rules for employee work sessions.</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Random Screenshot Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60 hover:bg-slate-100/50 transition-all">
                <div className="space-y-0.5 max-w-[78%]">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Camera className="h-4 w-4 text-slate-400" />
                    <span>Capture Random Screenshots?</span>
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Unannounced screen captures are taken randomly throughout active employee timesheet logs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRandomScreenshot(!randomScreenshot);
                    onNotify(`Screenshot capture ${!randomScreenshot ? 'enabled' : 'disabled'}.`);
                  }}
                  className="cursor-pointer transition-transform"
                >
                  {randomScreenshot ? (
                    <ToggleRight className="h-9 w-9 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Frequency Selector */}
              {randomScreenshot && (
                <div className="space-y-1 bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-center animate-in fade-in duration-250">
                  <label className="text-[10px] uppercase text-slate-400 block font-black">Screenshot Telemetry Frequency</label>
                  <p className="text-[10px] text-slate-400 font-medium mb-2">Configure average frequency intervals between random captures.</p>
                  <select
                    value={screenshotFrequency}
                    onChange={(e) => setScreenshotFrequency(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer w-full"
                  >
                    <option value="5m">Every 5 Minutes (High density)</option>
                    <option value="10m">Every 10 Minutes (Standard)</option>
                    <option value="15m">Every 15 Minutes</option>
                    <option value="30m">Every 30 Minutes</option>
                    <option value="1h">Every 1 Hour (Low density)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Scope selectors checkboxes */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-[10px] uppercase text-slate-400 block font-black">Active Logging Scopes</label>
              <p className="text-[11px] text-slate-400 font-semibold">Check modules where automated time captures are active:</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  { key: 'projects', label: 'Workspaces & Projects' },
                  { key: 'tasks', label: 'Tasks & Milestones' },
                  { key: 'clients', label: 'Clients Meetings' },
                  { key: 'workflows', label: 'Custom Workflows' }
                ].map((item) => {
                  const isChecked = scopes[item.key as keyof typeof scopes];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleScope(item.key as any)}
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
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Save panel */}
          <div className="p-5 border-t border-slate-150 bg-slate-50/50 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Updating...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Security Check Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex gap-4 text-xs font-semibold text-slate-600 items-start">
        <ShieldCheck className="h-5.5 w-5.5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-800 block">Privacy & Security Notice</span>
          <p className="text-[11px] text-slate-400 font-medium">
            Random capturing stores files securely inside private AWS S3 containers. Ensure your employee contractual terms comply with local state telemetry privacy mandates before enabling random screen grabs.
          </p>
        </div>
      </div>
    </div>
  );
}
