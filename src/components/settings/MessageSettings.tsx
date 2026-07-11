/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, Save, ToggleLeft, ToggleRight, Check, Play, AlertCircle, Volume2
} from 'lucide-react';

interface MessageSettingsProps {
  onNotify: (msg: string) => void;
}

export default function MessageSettings({ onNotify }: MessageSettingsProps) {
  const [allowClientEmployeeChat, setAllowClientEmployeeChat] = useState(true);
  const [allowClientAdminChat, setAllowClientAdminChat] = useState(true);
  const [soundNotificationAlert, setSoundNotificationAlert] = useState('Default');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API saving
    setTimeout(() => {
      setSaving(false);
      onNotify('Message settings saved successfully!');
    }, 800);
  };

  const playSoundSample = () => {
    onNotify(`Playing trial audio: [${soundNotificationAlert} alert tone] 🔊`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
          <Mail className="h-5 w-5 text-indigo-600" />
          <span>Message Settings</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Configure real-time communication scopes, participant limits, and notification alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-150 bg-slate-50/50">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Chat & Communication Permissions</h4>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Allow channels and scope access boundaries between user accounts.</p>
          </div>

          {/* Settings Grid */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Client Employee Chat */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60 transition-all hover:bg-slate-100/50">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Allow chat between client and employees?</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">Clients can message assigned staff members directly.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowClientEmployeeChat(!allowClientEmployeeChat)}
                  className="cursor-pointer transition-transform"
                >
                  {allowClientEmployeeChat ? (
                    <ToggleRight className="h-9 w-9 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Client Admin Chat */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60 transition-all hover:bg-slate-100/50">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Allow chat between client and admin?</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">Allow direct communication between clients and team administrators.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowClientAdminChat(!allowClientAdminChat)}
                  className="cursor-pointer transition-transform"
                >
                  {allowClientAdminChat ? (
                    <ToggleRight className="h-9 w-9 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="h-9 w-9 text-slate-400" />
                  )}
                </button>
              </div>

            </div>

            {/* Sound alert section */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 block font-black flex items-center gap-1">
                  <Volume2 className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Send Sound Notification Alert</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={soundNotificationAlert}
                    onChange={(e) => setSoundNotificationAlert(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="No">No</option>
                    <option value="Default">Default sound</option>
                    <option value="Beep">Beep sound</option>
                    <option value="Modern">Modern tone</option>
                  </select>
                  {soundNotificationAlert !== 'No' && (
                    <button
                      type="button"
                      onClick={playSoundSample}
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 p-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Play className="h-4 w-4" />
                      <span>Test Sound</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
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

      {/* Advisory Card */}
      <div className="bg-blue-50 border border-blue-150 rounded-2xl p-4 flex gap-3 text-xs text-blue-800">
        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
        <div>
          <span className="font-bold block">Developer Advisory</span>
          <p className="mt-0.5">
            Internal chat alerts use browser audio components which may be restricted unless the user opens the application in a new tab or actively interacts with the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
