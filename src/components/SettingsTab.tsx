/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Save, Shield, HelpCircle, Bell, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsTabProps {
  onSaveSettings: (settings: { name: string; currency: string; timezone: string }) => void;
  appFontSize?: 'standard' | 'large' | 'long';
  onChangeFontSize?: (size: 'standard' | 'large' | 'long') => void;
}

export default function SettingsTab({ 
  onSaveSettings,
  appFontSize = 'standard',
  onChangeFontSize
}: SettingsTabProps) {
  const [companyName, setCompanyName] = useState('Worksuite Enterprise Solutions Ltd.');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('UTC (GMT+0)');
  
  // Toggles
  const [punchClock, setPunchClock] = useState(true);
  const [retinalScan, setRetinalScan] = useState(false);
  const [whAuto, setWhAuto] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      name: companyName,
      currency,
      timezone
    });
    alert('System settings updated successfully inside secure container registry!');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-150 pb-4">
        <Settings className="h-6 w-6 text-indigo-600" />
        <div>
          <h3 className="text-base font-bold text-slate-900">Worksuite Configuration Space</h3>
          <p className="text-xs text-slate-500 font-medium">Configure core SaaS attributes, workspace variables, and feature scopes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company Registered Name</label>
            <input
              type="text" required
              className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Functional Currency</label>
            <select
              className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD ($)">USD - US Dollar ($)</option>
              <option value="EUR (€)">EUR - Euro (€)</option>
              <option value="INR (₹)">INR - Indian Rupee (₹)</option>
              <option value="SGD ($)">SGD - Singapore Dollar ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">System Timezone</label>
            <select
              className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="UTC (GMT+0)">Coordinated Universal Time (UTC)</option>
              <option value="IST (GMT+5:30)">Indian Standard Time (IST)</option>
              <option value="SGT (GMT+8)">Singapore Standard Time (SGT)</option>
              <option value="EST (GMT-5)">Eastern Standard Time (EST)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Application Font Size Scale</label>
            <select
              className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none font-bold text-indigo-600"
              value={appFontSize}
              onChange={(e) => onChangeFontSize && onChangeFontSize(e.target.value as any)}
            >
              <option value="standard">Standard Size (Compact Layout)</option>
              <option value="large">Large Size (Enhanced Readability)</option>
              <option value="long">Long Size (Extra Large Typography & Spacing)</option>
            </select>
          </div>
        </div>

        {/* Feature toggles */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Workspace Capability Toggles</h4>
          
          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Allow Web Attendance Clock</p>
                <p className="text-[10px] text-slate-400">Let employees clock-in/out via the browser Header.</p>
              </div>
              <button
                type="button"
                id="toggle-clock-btn"
                onClick={() => setPunchClock(!punchClock)}
                className="text-slate-600"
              >
                {punchClock ? <ToggleRight className="h-9 w-9 text-indigo-600 fill-current" /> : <ToggleLeft className="h-9 w-9 text-slate-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Force Retinal Retrying Handshake</p>
                <p className="text-[10px] text-slate-400">Lock engineering doors unless double biometrics mappings are calibrated.</p>
              </div>
              <button
                type="button"
                id="toggle-retinal-scan-btn"
                onClick={() => setRetinalScan(!retinalScan)}
                className="text-slate-600"
              >
                {retinalScan ? <ToggleRight className="h-9 w-9 text-indigo-600 fill-current" /> : <ToggleLeft className="h-9 w-9 text-slate-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">Auto-trigger Registered API Webhooks</p>
                <p className="text-[10px] text-slate-400">Simulate payload delivery logs on payment received, invoice settled, and leave approvals.</p>
              </div>
              <button
                type="button"
                id="toggle-webhook-auto-btn"
                onClick={() => setWhAuto(!whAuto)}
                className="text-slate-600"
              >
                {whAuto ? <ToggleRight className="h-9 w-9 text-indigo-600 fill-current" /> : <ToggleLeft className="h-9 w-9 text-slate-400" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="submit"
            id="save-settings-submit-btn"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Secure Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
