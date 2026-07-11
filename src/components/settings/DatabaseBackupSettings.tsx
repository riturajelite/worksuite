import React, { useState, useEffect } from 'react';
import { 
  Database, Play, Check, Trash2, ShieldAlert, AlertCircle, Info, Settings, HelpCircle, X, CheckSquare, Download, AlertTriangle
} from 'lucide-react';

interface DatabaseBackupSettingsProps {
  onNotify: (message: string) => void;
}

interface BackupRecord {
  id: string;
  name: string;
  size: string;
  dateTime: string;
}

export default function DatabaseBackupSettings({ onNotify }: DatabaseBackupSettingsProps) {
  // Backups List State
  const [backups, setBackups] = useState<BackupRecord[]>([
    { id: '1', name: 'backup_db_2026_07_10_040001.sql', size: '12.45 MB', dateTime: '10-07-2026 04:00 AM' },
    { id: '2', name: 'backup_db_2026_07_09_040002.sql', size: '12.38 MB', dateTime: '09-07-2026 04:00 AM' }
  ]);

  // Modals & Popups States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDemoError, setShowDemoError] = useState(false);
  const [showAutoBackupModal, setShowAutoBackupModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to demo mode true as per screenshot / prompt rules
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);

  // Backup progress state
  const [backingUp, setBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  // Trigger manual backup
  const handleCreateBackupClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmBackup = () => {
    setShowConfirmModal(false);
    if (isDemoMode) {
      setShowDemoError(true);
    } else {
      // Simulate successful backup
      setBackingUp(true);
      setBackupProgress(0);
      onNotify('Database Backup initialized...');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (backingUp) {
      interval = setInterval(() => {
        setBackupProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setBackingUp(false);
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, '0');
            const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours() % 12 || 12)}:${pad(now.getMinutes())} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
            const fileSuffix = `${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
            
            const newBackup: BackupRecord = {
              id: Date.now().toString(),
              name: `backup_db_${fileSuffix}.sql`,
              size: '12.52 MB',
              dateTime: dateStr
            };
            setBackups(prevList => [newBackup, ...prevList]);
            onNotify('Database Backup created successfully!');
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [backingUp]);

  // Delete Backup
  const handleDeleteBackup = (id: string, name: string) => {
    if (isDemoMode) {
      setShowDemoError(true);
    } else {
      setBackups(prev => prev.filter(b => b.id !== id));
      onNotify(`Backup ${name} deleted successfully!`);
    }
  };

  const handleSaveAutoBackup = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAutoBackupModal(false);
    onNotify(`Auto Backup settings updated (Enabled: ${autoBackupEnabled ? 'Yes' : 'No'})`);
  };

  return (
    <div className="space-y-6" id="database-backup-settings-view">
      
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Database Backup Settings</span>
          </h2>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            <span>Database Backup Settings</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">Home</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">Settings</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-400 font-medium">Database Backup Settings</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={handleCreateBackupClick}
            className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
          >
            <span className="font-extrabold text-sm leading-none">+</span>
            <span>Create Database Backup</span>
          </button>
          
          <button 
            onClick={() => setShowAutoBackupModal(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
          >
            <Settings className="h-3.5 w-3.5 text-slate-500" />
            <span>Auto Backup Settings</span>
          </button>
          
          {/* Simulation Toggle */}
          <div className="flex items-center gap-1.5 border border-dashed border-slate-200 px-2.5 py-1.5 rounded-md text-[10px] bg-slate-50">
            <span className="font-bold text-slate-500">Demo Mode:</span>
            <input 
              type="checkbox" 
              checked={isDemoMode} 
              onChange={(e) => setIsDemoMode(e.target.checked)}
              className="h-3.5 w-3.5 rounded text-blue-600 border-slate-300 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Info Warning Banner */}
      <div className="bg-[#e6f4fe] border border-[#bae0fd] rounded-lg p-4 flex gap-3 text-slate-700 text-xs leading-relaxed animate-fadeIn shadow-3xs">
        <div className="h-5 w-5 rounded-full bg-[#1d82f5]/10 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="h-4 w-4 text-[#1d82f5]" />
        </div>
        <div className="font-medium text-[#1e5d8a]">
          Note: Due to the limited execution time and memory available to PHP, backing up very large databases may not be possible. If your database is very large you might need to backup directly from your SQL server via the command line, or have your server admin do it for you if you do not have root privileges.
        </div>
      </div>

      {/* Backup creation progress bar */}
      {backingUp && (
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2.5 animate-fadeIn">
          <div className="flex justify-between text-xs font-bold text-blue-900">
            <span>Compiling Database Dump...</span>
            <span>{backupProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${backupProgress}%` }} />
          </div>
        </div>
      )}

      {/* Backup Table Section */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-3xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="px-5 py-3.5">Backup</th>
              <th className="px-5 py-3.5">Backup Size</th>
              <th className="px-5 py-3.5">Date & Time</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {backups.length > 0 ? (
              backups.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-800 text-xs">
                    {b.name}
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500 font-bold text-[11px]">
                    {b.size}
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-medium text-xs">
                    {b.dateTime}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button 
                        onClick={() => onNotify(`Downloading ${b.name}...`)}
                        className="text-blue-600 hover:text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                      <span className="text-slate-200">|</span>
                      <button 
                        onClick={() => handleDeleteBackup(b.id, b.name)}
                        className="text-red-500 hover:text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2.5 text-slate-400">
                    <Database className="h-10 w-10 text-slate-200 stroke-[1.5]" />
                    <span className="text-xs font-semibold">- No record found. -</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal (Are you sure?) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center space-y-5 animate-scaleUp">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full border-2 border-amber-300 flex items-center justify-center text-amber-400 animate-pulse">
                <span className="text-3xl font-light font-serif">!</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-800">Are you sure?</h3>
              <p className="text-xs text-slate-500 font-medium">Do you want to create Database Backup!</p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={handleConfirmBackup}
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-md cursor-pointer transition-colors"
              >
                Yes, Create It!
              </button>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-md cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Error Modal */}
      {showDemoError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center space-y-5 animate-scaleUp">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full border-2 border-red-200 flex items-center justify-center text-red-500">
                <X className="h-8 w-8 stroke-[2.5]" />
              </div>
            </div>
            
            <p className="text-sm text-slate-600 font-semibold">Settings cannot be changed in demo version</p>

            <div className="flex justify-center">
              <button 
                onClick={() => setShowDemoError(false)}
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-6 py-2 rounded-md cursor-pointer transition-colors min-w-[70px]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Backup Settings Modal */}
      {showAutoBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSaveAutoBackup} className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Auto Backup Settings</h3>
              <button 
                type="button"
                onClick={() => setShowAutoBackupModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={autoBackupEnabled}
                  onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                  className="h-4.5 w-4.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">Enable (Requires Cron)</span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3.5">
              <button 
                type="button"
                onClick={() => setShowAutoBackupModal(false)}
                className="text-slate-500 hover:text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
