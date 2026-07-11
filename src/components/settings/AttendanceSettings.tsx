import React, { useState } from 'react';
import { HelpCircle, Save, Plus, Trash2, Clock, MapPin, QrCode, RotateCw, Settings, ShieldAlert } from 'lucide-react';

interface AttendanceSettingsProps {
  onNotify: (message: string) => void;
}

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakTime: number; // minutes
}

export default function AttendanceSettings({ onNotify }: AttendanceSettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'shifts' | 'rotation' | 'qr' | 'regularisation'>('general');

  // General settings state
  const [lateThreshold, setLateThreshold] = useState(15); // minutes
  const [halfDayMinutes, setHalfDayMinutes] = useState(240); // 4 hours
  const [hoursMode, setHoursMode] = useState('Cumulative Hours'); // vs First In Last Out

  // Shifts state
  const [shifts, setShifts] = useState<Shift[]>([
    { id: 'sh-1', name: 'Regular Day Shift', startTime: '09:00 AM', endTime: '06:00 PM', breakTime: 60 },
    { id: 'sh-2', name: 'USA Evening Shift', startTime: '06:00 PM', endTime: '03:00 AM', breakTime: 45 },
    { id: 'sh-3', name: 'APAC Early Morning Shift', startTime: '06:00 AM', endTime: '03:00 PM', breakTime: 60 }
  ]);

  // Rotation state
  const [rotationEnabled, setRotationEnabled] = useState(false);
  const [rotationCycle, setRotationCycle] = useState('Every 2 Weeks');

  // QR settings
  const [qrEnabled, setQrEnabled] = useState(true);
  const [qrRadius, setQrRadius] = useState(150); // meters geo-fencing
  const [qrExpiry, setQrExpiry] = useState(30); // token expiry in seconds

  // Regularisation state
  const [regularisationAllowed, setRegularisationAllowed] = useState(true);
  const [maxRegularisations, setMaxRegularisations] = useState(3); // times per month
  const [autoApproveMissingPunch, setAutoApproveMissingPunch] = useState(false);

  // Modals / additions
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [newShiftName, setNewShiftName] = useState('');
  const [newShiftStart, setNewShiftStart] = useState('09:00 AM');
  const [newShiftEnd, setNewShiftEnd] = useState('06:00 PM');
  const [newShiftBreak, setNewShiftBreak] = useState(60);

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftName.trim()) return;

    const newSh: Shift = {
      id: `sh-${Date.now()}`,
      name: newShiftName,
      startTime: newShiftStart,
      endTime: newShiftEnd,
      breakTime: Number(newShiftBreak)
    };

    setShifts(prev => [...prev, newSh]);
    setIsAddingShift(false);
    setNewShiftName('');
    onNotify(`Created Shift Profile "${newSh.name}"!`);
  };

  const handleDeleteShift = (id: string) => {
    if (shifts.length <= 1) {
      onNotify('Must maintain at least one default shift profile.');
      return;
    }
    setShifts(prev => prev.filter(s => s.id !== id));
    onNotify('Shift profile deleted.');
  };

  const handleSaveAll = () => {
    onNotify('Attendance rules and Shifts configured successfully!');
  };

  return (
    <div className="space-y-6" id="attendance-settings-root">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • System Settings • Attendance Settings
        </div>
        <h2 className="text-xl font-bold text-slate-800">Attendance Settings</h2>
        <p className="text-xs text-slate-500 font-medium font-semibold">Establish corporate office shifts, clocking zones, QR authorization codes, and punch regularisation limits.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-150 pb-2">
        {[
          { key: 'general', label: 'General Parameters', icon: Settings },
          { key: 'shifts', label: 'Office Shifts', icon: Clock },
          { key: 'rotation', label: 'Shift Rotation', icon: RotateCw },
          { key: 'qr', label: 'QR Check-In', icon: QrCode },
          { key: 'regularisation', label: 'Punch Regularisation', icon: ShieldAlert }
        ].map(item => {
          const isActive = activeTab === item.key;
          const SubIcon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                isActive 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
                  : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
              }`}
            >
              <SubIcon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-3xs p-6 space-y-6">
        
        {/* PANEL 1: General */}
        {activeTab === 'general' && (
          <div className="space-y-5 max-w-2xl">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Attendance Constraints</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Late Mark Allowance Buffer (Minutes)</label>
                <input
                  type="number"
                  className="w-full bg-white text-slate-850 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                  value={lateThreshold}
                  onChange={(e) => setLateThreshold(Number(e.target.value))}
                />
                <span className="text-[10px] text-slate-400 font-semibold">Grace period minutes after shift start time before marked late.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Half-Day Threshold Duration (Minutes)</label>
                <input
                  type="number"
                  className="w-full bg-white text-slate-850 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                  value={halfDayMinutes}
                  onChange={(e) => setHalfDayMinutes(Number(e.target.value))}
                />
                <span className="text-[10px] text-slate-400 font-semibold">Minimum tracked duration required to count as a half-day.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Total Work Hours Calculation Method</label>
                <select
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                  value={hoursMode}
                  onChange={(e) => setHoursMode(e.target.value)}
                >
                  <option>Cumulative Hours (Sum of all active punch intervals)</option>
                  <option>First-In & Last-Out (Span between initial check-in and final logout)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: Shifts */}
        {activeTab === 'shifts' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Corporate Shift Profiles</h3>
                <p className="text-[11px] text-slate-500 font-semibold">Define operational start, end, and lunch break scopes for rosters.</p>
              </div>
              <button
                onClick={() => setIsAddingShift(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                Add Shift Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {shifts.map(s => (
                <div key={s.id} className="p-5 border border-slate-200 bg-white rounded-xl space-y-4 hover:shadow-2xs transition-all relative group shadow-3xs">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[13px] font-extrabold text-slate-800 block truncate max-w-[130px]">{s.name}</span>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Active Schedule</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteShift(s.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Profile"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400">Shift Window:</span>
                      <span className="text-slate-900 font-extrabold bg-slate-50 border border-slate-200 px-2 py-1 rounded font-mono">
                        {s.startTime} - {s.endTime}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-400">Lunch Duration:</span>
                      <span className="text-slate-700 font-bold bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded text-[10px]">
                        {s.breakTime} Mins
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                      <span>Roster Match: Auto</span>
                      <span className="text-emerald-600 flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 3: Rotation */}
        {activeTab === 'rotation' && (
          <div className="space-y-5 max-w-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 block">Automatic Shift Rotation Cycles</span>
                <p className="text-[11px] text-slate-400 font-semibold font-medium">Re-assign rosters sequentially on scheduled periodic loops.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRotationEnabled(!rotationEnabled);
                  onNotify(`Shift Rotation auto-cycle ${!rotationEnabled ? 'Activated' : 'Suspended'}.`);
                }}
                className="text-indigo-600 hover:text-indigo-700 cursor-pointer p-1"
              >
                <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  rotationEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform transform ${
                    rotationEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </button>
            </div>

            {rotationEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Rotation Loop Frequency</label>
                  <select
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                    value={rotationCycle}
                    onChange={(e) => setRotationCycle(e.target.value)}
                  >
                    <option>Weekly (Mondays)</option>
                    <option>Every 2 Weeks</option>
                    <option>Monthly (1st of Month)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANEL 4: QR */}
        {activeTab === 'qr' && (
          <div className="space-y-5 max-w-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 block">QR Code Authentication (App Clocking)</span>
                <p className="text-[11px] text-slate-400 font-semibold font-medium">Require mobile app users to scan a dynamic, office-exclusive QR code.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQrEnabled(!qrEnabled);
                  onNotify(`QR attendance ${!qrEnabled ? 'Enabled' : 'Disabled'}.`);
                }}
                className="text-indigo-600 hover:text-indigo-700 cursor-pointer p-1"
              >
                <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  qrEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform transform ${
                    qrEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </button>
            </div>

            {qrEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Geofencing Range (Radius in Meters)</label>
                  <input
                    type="number"
                    className="w-full bg-white text-slate-850 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                    value={qrRadius}
                    onChange={(e) => setQrRadius(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400 font-semibold">Scanning is blocked if employee is further than this distance from office Hub coordinates.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Dynamic QR Expiry Token (Seconds)</label>
                  <input
                    type="number"
                    className="w-full bg-white text-slate-850 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                    value={qrExpiry}
                    onChange={(e) => setQrExpiry(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400 font-semibold font-medium">QR regenerates automatically to prevent clock-in spoofing.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANEL 5: Regularisation */}
        {activeTab === 'regularisation' && (
          <div className="space-y-5 max-w-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 block">Allow Punch Regularisation Requests</span>
                <p className="text-[11px] text-slate-400 font-semibold font-medium">Empower staff to request clock-in edits for missed punches.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRegularisationAllowed(!regularisationAllowed);
                  onNotify(`Punch Regularisation ${!regularisationAllowed ? 'Permitted' : 'Suspended'}.`);
                }}
                className="text-indigo-600 hover:text-indigo-700 cursor-pointer p-1"
              >
                <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  regularisationAllowed ? 'bg-indigo-600' : 'bg-slate-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform transform ${
                    regularisationAllowed ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </button>
            </div>

            {regularisationAllowed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Maximum Allowed Requests (Per Month)</label>
                  <input
                    type="number"
                    className="w-full bg-white text-slate-850 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                    value={maxRegularisations}
                    onChange={(e) => setMaxRegularisations(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400 font-medium">Caps regularisation attempts per monthly billing cycle.</span>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <input
                      type="checkbox"
                      id="auto_app_punch"
                      className="rounded border-slate-300 text-indigo-600 cursor-pointer"
                      checked={autoApproveMissingPunch}
                      onChange={(e) => setAutoApproveMissingPunch(e.target.checked)}
                    />
                    <label htmlFor="auto_app_punch" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                      Enable Auto-Approval on first request
                    </label>
                  </div>
                </div>
              </div>
            )}
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
            Save Attendance Settings
          </button>
        </div>
      </div>

      {/* MODAL: Add Shift */}
      {isAddingShift && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Create Shift Profile</span>
              <button onClick={() => setIsAddingShift(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddShift} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Shift Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Night Support Shift"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newShiftName}
                  onChange={(e) => setNewShiftName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Shift Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="09:00 AM"
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                    value={newShiftStart}
                    onChange={(e) => setNewShiftStart(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Shift End Time</label>
                  <input
                    type="text"
                    required
                    placeholder="06:00 PM"
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                    value={newShiftEnd}
                    onChange={(e) => setNewShiftEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Lunch break duration (Minutes)</label>
                <input
                  type="number"
                  required
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newShiftBreak}
                  onChange={(e) => setNewShiftBreak(Number(e.target.value))}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setIsAddingShift(false)} className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-3xs">Create Shift</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
