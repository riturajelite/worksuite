import React, { useState } from 'react';
import { Save, Mail, AlertTriangle, Info, Check, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';

interface NotificationSettingsProps {
  onNotify: (message: string) => void;
}

const CHECKLIST_ITEMS = [
  { id: 'exp_admin', label: 'New Expense/Added by Admin', checked: true },
  { id: 'exp_member', label: 'New Expense/Added by Member', checked: true },
  { id: 'exp_status', label: 'Expense Status Changed', checked: false },
  { id: 'ticket_req', label: 'New Support Ticket Request', checked: true },
  { id: 'task_assigned', label: 'Task Assigned To Me', checked: true },
  { id: 'leave_req', label: 'Leave Approval Request', checked: true },
  { id: 'pay_rcvd', label: 'Payment Received Confirmation', checked: false },
  { id: 'contract_signed', label: 'Contract Signed Notification', checked: true },
];

export default function NotificationSettings({ onNotify }: NotificationSettingsProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'slack' | 'push' | 'pusher'>('email');

  // Checklist items state
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);

  // Email Config
  const [mailFromName, setMailFromName] = useState('Worksuite');
  const [mailFromEmail, setMailFromEmail] = useState('from@email.com');
  const [emailQueue, setEmailQueue] = useState('No');
  const [mailDriver, setMailDriver] = useState<'mail' | 'smtp'>('smtp');
  const [mailHost, setMailHost] = useState('smtp.gmail.com');
  const [mailPort, setMailPort] = useState('465');
  const [mailEncryption, setMailEncryption] = useState('ssl');
  const [mailUsername, setMailUsername] = useState('myemail@gmail.com');
  const [mailPassword, setMailPassword] = useState('MailPassword');
  const [showMailPass, setShowMailPass] = useState(false);

  // Slack Config
  const [slackStatus, setSlackStatus] = useState(false);

  // Push Config
  const [beamsStatus, setBeamsStatus] = useState(false);
  const [oneSignalStatus, setOneSignalStatus] = useState(false);

  // Pusher Config
  const [pusherStatus, setPusherStatus] = useState(false);
  const [pusherTaskBoard, setPusherTaskBoard] = useState(true);
  const [pusherMessages, setPusherMessages] = useState(true);

  const handleToggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    }));
  };

  const handleSelectAll = () => {
    const allChecked = checklist.every(i => i.checked);
    setChecklist(prev => prev.map(item => ({ ...item, checked: !allChecked })));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Notification preferences updated successfully!');
  };

  const handleSendTest = () => {
    onNotify('Test email queued. Please verify your SMTP logs.');
  };

  return (
    <div className="space-y-6" id="notification-settings-root">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • Settings • Notification Settings
        </div>
        <h2 className="text-xl font-bold text-slate-800">Notification Settings</h2>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1.5 scrollbar-thin">
        {[
          { key: 'email', label: 'Email' },
          { key: 'slack', label: 'Slack' },
          { key: 'push', label: 'Push Notification' },
          { key: 'pusher', label: 'Pusher' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-xs font-bold -mb-px border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl">
        
        {/* Left Column: Config Form (7 cols) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs lg:col-span-7 space-y-6">
          
          {/* TAB 1: EMAIL */}
          {activeTab === 'email' && (
            <form onSubmit={handleSave} className="space-y-5 animate-fadeIn">
              {/* Red SMTP warning banner */}
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex gap-3 text-xs leading-normal font-medium">
                <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                <p>Your SMTP details are not correct. Please update to the correct one.</p>
              </div>

              {/* SMTP Recommendation */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Recommendation for SMTP</span>
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  We highly recommend utilizing specialized email transactional relays:
                </p>
                <div className="flex gap-4 text-xs font-bold text-indigo-600 pt-1">
                  <a href="https://www.smtp2go.com" target="_blank" rel="noopener noreferrer" className="hover:underline">1. SMTP2GO.COM</a>
                  <a href="https://www.smtp.com" target="_blank" rel="noopener noreferrer" className="hover:underline">2. SMTP.COM</a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Mail From Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
                    value={mailFromName}
                    onChange={(e) => setMailFromName(e.target.value)}
                  />
                </div>

                {/* From Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Mail From Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
                    value={mailFromEmail}
                    onChange={(e) => setMailFromEmail(e.target.value)}
                  />
                </div>

                {/* Queue */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Enable Email Queue</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                    value={emailQueue}
                    onChange={(e) => setEmailQueue(e.target.value)}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* Driver */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Mail Driver</label>
                  <div className="flex gap-4 p-2">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="mailDriver"
                        checked={mailDriver === 'mail'}
                        onChange={() => setMailDriver('mail')}
                        className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>Mail</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="mailDriver"
                        checked={mailDriver === 'smtp'}
                        onChange={() => setMailDriver('smtp')}
                        className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>SMTP</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SMTP Credentials (Render if SMTP is selected) */}
              {mailDriver === 'smtp' && (
                <div className="border-t border-slate-150 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* SMTP Host */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Mail Host *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
                      value={mailHost}
                      onChange={(e) => setMailHost(e.target.value)}
                    />
                  </div>

                  {/* SMTP Port */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Mail Port *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
                      value={mailPort}
                      onChange={(e) => setMailPort(e.target.value)}
                    />
                  </div>

                  {/* Encryption */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Mail Encryption</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                      value={mailEncryption}
                      onChange={(e) => setMailEncryption(e.target.value)}
                    >
                      <option value="ssl">ssl</option>
                      <option value="tls">tls</option>
                      <option value="none">none</option>
                    </select>
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Mail Username *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
                      value={mailUsername}
                      onChange={(e) => setMailUsername(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block">Mail Password</label>
                    <div className="relative">
                      <input
                        type={showMailPass ? 'text' : 'password'}
                        required
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pr-10 text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
                        value={mailPassword}
                        onChange={(e) => setMailPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowMailPass(!showMailPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showMailPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-start pt-3 border-t border-slate-150">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={handleSendTest}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-3xs"
                >
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span>Send Test Email</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SLACK */}
          {activeTab === 'slack' && (
            <form onSubmit={handleSave} className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">Status</span>
                    <p className="text-[11px] text-slate-500">Enable Slack instant notifications integrations.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    checked={slackStatus}
                    onChange={(e) => setSlackStatus(e.target.checked)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNotify('Simulated Slack payload dispatched!')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all"
                >
                  Send Test Notification
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PUSH NOTIFICATION */}
          {activeTab === 'push' && (
            <form onSubmit={handleSave} className="space-y-5 animate-fadeIn">
              {/* Alert */}
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex gap-3 text-xs leading-normal font-medium">
                <Info className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
                <p>Only one push notification service can be active at a time.</p>
              </div>

              <div className="space-y-3.5">
                {/* Pusher Beams */}
                <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/60 transition-all select-none">
                  <input
                    type="checkbox"
                    className="h-4.5 w-4.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-0.5"
                    checked={beamsStatus}
                    onChange={(e) => {
                      setBeamsStatus(e.target.checked);
                      if (e.target.checked) setOneSignalStatus(false);
                    }}
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">Enable Beams Push Notification (Recommended)</span>
                    <p className="text-[10px] text-slate-450 leading-tight">Use official Pusher Beams API triggers for browser push alerts.</p>
                  </div>
                </label>

                {/* One Signal */}
                <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/60 transition-all select-none">
                  <input
                    type="checkbox"
                    className="h-4.5 w-4.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-0.5"
                    checked={oneSignalStatus}
                    onChange={(e) => {
                      setOneSignalStatus(e.target.checked);
                      if (e.target.checked) setBeamsStatus(false);
                    }}
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">Enable One Signal Push Notification</span>
                    <p className="text-[10px] text-slate-450 leading-tight">Use OneSignal SDK client endpoint integration.</p>
                  </div>
                </label>
              </div>

              {/* Submit */}
              <div className="flex pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: PUSHER */}
          {activeTab === 'pusher' && (
            <form onSubmit={handleSave} className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">Status</span>
                    <p className="text-[11px] text-slate-500">Enable Pusher web sockets real-time alerts sync.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    checked={pusherStatus}
                    onChange={(e) => setPusherStatus(e.target.checked)}
                  />
                </div>
              </div>

              {/* Enable Pusher For */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700">Enable Pusher For</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 select-none">
                    <input
                      type="checkbox"
                      className="h-4.5 w-4.5 text-indigo-600 rounded border-slate-300"
                      checked={pusherTaskBoard}
                      onChange={(e) => setPusherTaskBoard(e.target.checked)}
                    />
                    <span className="text-xs font-semibold text-slate-700">Task Board</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 select-none">
                    <input
                      type="checkbox"
                      className="h-4.5 w-4.5 text-indigo-600 rounded border-slate-300"
                      checked={pusherMessages}
                      onChange={(e) => setPusherMessages(e.target.checked)}
                    />
                    <span className="text-xs font-semibold text-slate-700">Messages</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Right Column: Preferences Checklist (5 cols) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-150">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              {activeTab === 'email' ? 'Email Notification Settings' : 
               activeTab === 'slack' ? 'Slack Notification Settings' :
               activeTab === 'push' ? 'Push Notification Settings' :
               'Websocket Channels'}
            </h3>
            
            {/* Select All */}
            {activeTab !== 'pusher' && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Select All</span>
              </button>
            )}
          </div>

          {/* Checklist Toggles list */}
          {activeTab !== 'pusher' ? (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/40 transition-all cursor-pointer select-none text-xs font-semibold"
                >
                  <span className="text-slate-700">{item.label}</span>
                  {item.checked ? (
                    <CheckSquare className="h-5 w-5 text-indigo-600 shrink-0" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-300 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-150 text-[11px] text-indigo-700 font-medium leading-relaxed">
              Realtime web sockets Pusher channel broadcasts logs, project board card drags, and live chat state events immediately to connected client tabs. Use credentials under REST API section for custom payloads.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
