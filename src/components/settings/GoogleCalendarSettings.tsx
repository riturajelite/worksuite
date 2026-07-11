import React, { useState } from 'react';
import { 
  Calendar, Save, Info, RefreshCw, Key, ToggleLeft, ToggleRight, Check, HelpCircle
} from 'lucide-react';

interface GoogleCalendarSettingsProps {
  onNotify: (message: string) => void;
}

export default function GoogleCalendarSettings({ onNotify }: GoogleCalendarSettingsProps) {
  const [enabled, setEnabled] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [saving, setSaving] = useState(false);

  // Notification / Sync Settings checklist
  const [notifications, setNotifications] = useState({
    leads: true,
    leaves: true,
    invoices: false,
    contracts: false,
    tasks: true,
    events: true,
    holiday: true
  });

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onNotify('Google Calendar synchronizations configurations saved successfully!');
    }, 1000);
  };

  const redirectUri = "https://yourdomain.com/api/auth/google-calendar/callback";

  return (
    <div className="space-y-6" id="google-calendar-settings-view">
      {/* Title */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Integrations & Sync</span>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="h-5.5 w-5.5 text-indigo-600" />
          <span>Google Calendar Settings</span>
        </h2>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Connection Settings (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/85 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Key className="h-4 w-4 text-indigo-600" />
              <span>Google Calendar Credentials</span>
            </h3>
            
            <button
              type="button"
              onClick={() => {
                setEnabled(!enabled);
                onNotify(`Google Calendar status toggled to ${!enabled ? 'Enabled' : 'Disabled'}`);
              }}
              className="cursor-pointer focus:outline-none"
            >
              {enabled ? (
                <ToggleRight className="h-8 w-8 text-indigo-600" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-slate-400" />
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Google Client ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required={enabled}
                disabled={!enabled}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Google Client ID from Google API Console"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Google Client Secret <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required={enabled}
                disabled={!enabled}
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Google Client Secret from Google API Console"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono disabled:opacity-50"
              />
            </div>

            {/* Callback Redirect URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 block text-[10px] uppercase">Authorized redirect URI</label>
                <span className="text-[10px] text-slate-400 font-bold block">Whitelisted Endpoint</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono text-indigo-600 select-all font-semibold flex items-center justify-between">
                <span>{redirectUri}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(redirectUri);
                    onNotify('Redirect URI copied to clipboard!');
                  }}
                  className="text-[10px] text-indigo-700 font-black tracking-wider uppercase hover:underline cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Connection Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Sync / Notifications Settings (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/85 shadow-xs p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>Notification Sync Settings</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Select models to push calendar events automatically</p>
          </div>

          <div className="space-y-2">
            {[
              { id: 'leads', label: 'Leads events sync' },
              { id: 'leaves', label: 'Leaves approved sync' },
              { id: 'invoices', label: 'Invoices due-dates sync' },
              { id: 'contracts', label: 'Contracts renewal sync' },
              { id: 'tasks', label: 'Tasks deadline events sync' },
              { id: 'events', label: 'Company events calendar sync' },
              { id: 'holiday', label: 'Public holidays events sync' }
            ].map((item) => {
              const key = item.id as keyof typeof notifications;
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleNotification(key)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-150/80 bg-slate-50/30 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  <div className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                    notifications[key]
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-300 text-transparent'
                  }`}>
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </form>
    </div>
  );
}
