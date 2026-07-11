import React, { useState } from 'react';
import { Save, HelpCircle, AlertCircle, Info, X } from 'lucide-react';

interface AppSettingsProps {
  onNotify: (message: string) => void;
}

export default function AppSettings({ onNotify }: AppSettingsProps) {
  const [activeTab, setActiveTab] = useState<'app' | 'signup' | 'upload' | 'map'>('app');

  // App Settings States
  const [dateFormat, setDateFormat] = useState('Y-m-d');
  const [timeFormat, setTimeFormat] = useState('12-Hour');
  const [timezone, setTimezone] = useState('UTC');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [sessionDriver, setSessionDriver] = useState('file');
  const [appDebug, setAppDebug] = useState(true);
  const [appUpdate, setAppUpdate] = useState(false);
  const [enableCache, setEnableCache] = useState(false);
  const [rowLimit, setRowLimit] = useState('10');
  const [employeeExport, setEmployeeExport] = useState(true);

  // Client Sign up States
  const [allowSignup, setAllowSignup] = useState(true);

  // File Upload States
  const [maxFileSize, setMaxFileSize] = useState('100');
  const [maxFiles, setMaxFiles] = useState('10');
  const [fileTypes, setFileTypes] = useState<string[]>([
    'image/*',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/pdf',
    'text/plain',
  ]);
  const [newFileType, setNewFileType] = useState('');

  // Google Map States
  const [mapKey, setMapKey] = useState('AlzaSyDsl2bG7XXXXXXXXXXXXXXXXXXXXXXX');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('App Settings Saved Successfully!');
  };

  const handleAddFileType = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newFileType.trim()) {
      e.preventDefault();
      if (!fileTypes.includes(newFileType.trim())) {
        setFileTypes(prev => [...prev, newFileType.trim()]);
      }
      setNewFileType('');
    }
  };

  const handleRemoveFileType = (type: string) => {
    setFileTypes(prev => prev.filter(t => t !== type));
  };

  return (
    <div className="space-y-6" id="app-settings-root">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • Settings • App Settings
        </div>
        <h2 className="text-xl font-bold text-slate-800">App Settings</h2>
      </div>

      {/* Sub-tabs horizontal bar */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1.5 scrollbar-thin">
        {[
          { key: 'app', label: 'App Settings' },
          { key: 'signup', label: 'Client Sign up Settings' },
          { key: 'upload', label: 'File Upload Settings' },
          { key: 'map', label: 'Google Map Settings' },
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

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* TAB 1: App Settings */}
          {activeTab === 'app' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Date Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Date Format</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    <option value="Y-m-d">Y-m-d (2026-07-10)</option>
                    <option value="d-m-Y">d-m-Y (10-07-2026)</option>
                    <option value="m-d-Y">m-d-Y (07-10-2026)</option>
                  </select>
                </div>

                {/* Time Format */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Time Format</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                  >
                    <option value="12-Hour">12-Hour (e.g. 05:30 PM)</option>
                    <option value="24-Hour">24-Hour (e.g. 17:30)</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Default Timezone</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                    <option value="America/New_York">America/New_York (GMT-5:00)</option>
                    <option value="Europe/London">Europe/London (GMT+0:00)</option>
                  </select>
                </div>

                {/* Default Currency */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <span>Default Currency</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD ($ - Dollars)</option>
                    <option value="EUR">EUR (€ - Euros)</option>
                    <option value="INR">INR (₹ - Rupees)</option>
                    <option value="GBP">GBP (£ - Pounds)</option>
                  </select>
                </div>

                {/* Language */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <span>Language</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">🇺🇸 English</option>
                    <option value="Spanish">🇪🇸 Spanish</option>
                    <option value="French">🇫🇷 French</option>
                    <option value="German">🇩🇪 German</option>
                  </select>
                </div>

                {/* Session Driver */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <span>Session Driver</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={sessionDriver}
                    onChange={(e) => setSessionDriver(e.target.value)}
                  >
                    <option value="file">File</option>
                    <option value="database">Database</option>
                    <option value="cookie">Cookie</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="border-t border-slate-150 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-800">Advanced Config</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* App Debug */}
                  <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/60 transition-all select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-0.5"
                      checked={appDebug}
                      onChange={(e) => setAppDebug(e.target.checked)}
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>App Debug</span>
                        <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                      </span>
                      <p className="text-[10px] text-slate-450 leading-tight">Show stack trace logs during errors.</p>
                    </div>
                  </label>

                  {/* App Update */}
                  <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/60 transition-all select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-0.5"
                      checked={appUpdate}
                      onChange={(e) => setAppUpdate(e.target.checked)}
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>App Update</span>
                        <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                      </span>
                      <p className="text-[10px] text-slate-450 leading-tight">Enable notification of application updates.</p>
                    </div>
                  </label>

                  {/* Cache */}
                  <label className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/60 transition-all select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-0.5"
                      checked={enableCache}
                      onChange={(e) => setEnableCache(e.target.checked)}
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-700">Enable Cache</span>
                      <p className="text-[10px] text-slate-450 leading-tight">Force server-side query optimizations caching.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Limit & Export */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-150 pt-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <span>Datatable Row Limit</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={rowLimit}
                    onChange={(e) => setRowLimit(e.target.value)}
                  >
                    <option value="10">10 Rows</option>
                    <option value="25">25 Rows</option>
                    <option value="50">50 Rows</option>
                    <option value="100">100 Rows</option>
                  </select>
                </div>

                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="h-4.5 w-4.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      checked={employeeExport}
                      onChange={(e) => setEmployeeExport(e.target.checked)}
                    />
                    <span className="text-xs font-bold text-slate-700">Employee can export data</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Client Sign up Settings */}
          {activeTab === 'signup' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>Allow Client Signup</span>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                    </span>
                    <p className="text-[11px] text-slate-500">Allow customers to self-register their tenant accounts on public portals.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    checked={allowSignup}
                    onChange={(e) => setAllowSignup(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: File Upload Settings */}
          {activeTab === 'upload' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Max limits labels banner */}
              <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3.5 text-xs text-cyan-800 font-bold flex justify-between">
                <span>Server upload_max_filesize = 100 MB</span>
                <span>Server post_max_size = 100 MB</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Max size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Max File size for upload *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pr-12 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                      value={maxFileSize}
                      onChange={(e) => setMaxFileSize(e.target.value)}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">MB</span>
                  </div>
                </div>

                {/* Max files count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Max number of files for upload *</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                    value={maxFiles}
                    onChange={(e) => setMaxFiles(e.target.value)}
                  />
                </div>
              </div>

              {/* File Types Multi-select Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Allowed file types for upload *</label>
                <div className="border border-slate-200 rounded-lg p-3 space-y-3 bg-white">
                  <div className="flex flex-wrap gap-1.5">
                    {fileTypes.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFileType(tag)}
                          className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. application/x-zip-compressed (Press Enter to add)"
                    className="w-full border-0 border-t border-slate-100 pt-2 text-xs focus:ring-0 focus:outline-none placeholder-slate-400"
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value)}
                    onKeyDown={handleAddFileType}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Google Map Settings */}
          {activeTab === 'map' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Alert */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-xs text-slate-600 font-medium leading-normal">
                <Info className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                <p>You can add the location on to map in Business Address once Google Map setting is configured.</p>
              </div>

              {/* Map Key Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Google map key</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. AIzaSyDsl2bG7..."
                  value={mapKey}
                  onChange={(e) => setMapKey(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 font-medium">Leave blank to remove a Google map key</p>
              </div>

              {/* Console Link */}
              <div>
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Visit Google Cloud Console to get the keys
                </a>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-start pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
