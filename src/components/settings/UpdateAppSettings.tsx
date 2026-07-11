import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, Check, CheckCircle2, AlertTriangle, AlertCircle, X, Download, Upload, 
  Play, ArrowLeft, History, FileText, Terminal, ArrowRight, Settings, ShieldAlert, 
  Info, Calendar, ChevronRight, Eye, Undo, HelpCircle, HardDrive, FileCode, CheckSquare, RefreshCcw
} from 'lucide-react';

interface UpdateAppSettingsProps {
  onNotify: (message: string) => void;
}

interface VersionRecord {
  version: string;
  releaseDate: string;
  buildNumber: string;
  releaseType: 'Major' | 'Minor' | 'Patch' | 'Security';
  installedDate: string;
  installedBy: string;
  status: 'Active' | 'Superseded' | 'Available';
  notes: string;
  changelogUrl?: string;
  bugFixes: string[];
  newFeatures: string[];
  improvements: string[];
  securityFixes: string[];
  dbChanges: string[];
  filesModified: string[];
  rollbackAvailable: boolean;
}

interface UpdateLog {
  version: string;
  date: string;
  installedBy: string;
  status: 'Success' | 'Failed' | 'In Progress';
  duration: string;
  logFile: string;
}

export default function UpdateAppSettings({ onNotify }: UpdateAppSettingsProps) {
  // Demo configurations toggle
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [forceFailInstall, setForceFailInstall] = useState(false);

  // Core App Version States
  const [currentVersion, setCurrentVersion] = useState('6.0.10');
  const [releaseDate, setReleaseDate] = useState('Jul 10, 2026');
  const [licenseStatus, setLicenseStatus] = useState('Active');
  const [environment, setEnvironment] = useState('Production');
  const [lastChecked, setLastChecked] = useState('Jul 11, 2026, 01:45 AM');
  const [autoUpdate, setAutoUpdate] = useState(true);
  
  // Available update state
  const [updateAvailable, setUpdateAvailable] = useState(true);
  const [latestVersion, setLatestVersion] = useState('6.1.0');
  const [latestReleaseDate, setLatestReleaseDate] = useState('Jul 11, 2026');
  const [updateSize, setUpdateSize] = useState('42.8 MB');
  const [minPhpVersion, setMinPhpVersion] = useState('8.2.0');
  const [minDbVersion, setMinDbVersion] = useState('MariaDB 10.6+ / MySQL 8.0+');
  const [compatibilityStatus, setCompatibilityStatus] = useState('Fully Compatible');

  // Backup state
  const [createBackup, setCreateBackup] = useState(true);
  const [lastBackupDate, setLastBackupDate] = useState('Jul 10, 2026 04:00 AM');
  const [backupLocation, setBackupLocation] = useState('/storage/app/backups/');
  const [backupStatus, setBackupStatus] = useState('System holds 2 local backups');

  // UI state overlays/swaps
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedVersionDetail, setSelectedVersionDetail] = useState<VersionRecord | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRollbackConfirm, setShowRollbackConfirm] = useState<string | null>(null);
  const [selectedLogText, setSelectedLogText] = useState<{ version: string; text: string } | null>(null);

  // Update installation process state
  const [updateStep, setUpdateStep] = useState<'idle' | 'checking' | 'downloading' | 'ready-to-install' | 'installing' | 'success' | 'failed'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [installProgress, setInstallProgress] = useState(0);
  const [installStepName, setInstallStepName] = useState('');
  const [installLogMessages, setInstallLogMessages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // System Verification list
  const [systemChecks, setSystemChecks] = useState([
    { name: 'PHP Version', requirement: '>= 8.2.0 (Current: 8.3.25)', status: 'passed' },
    { name: 'Extensions (mbstring, zip, curl, gd, openssl, pdo)', requirement: 'All 16 extensions verified', status: 'passed' },
    { name: 'Storage Permission', requirement: 'Writable (/storage)', status: 'passed' },
    { name: 'Database Connection', requirement: 'Stable connectivity', status: 'passed' },
    { name: 'Queue Status', requirement: 'Queue runner active', status: 'passed' },
    { name: 'Cache Permission', requirement: 'Writable (/bootstrap/cache)', status: 'passed' },
    { name: 'Writable Directories', requirement: 'Root web server writable', status: 'passed' }
  ]);

  // Version History Data - matches screenshot details perfectly!
  const [versionHistoryList, setVersionHistoryList] = useState<VersionRecord[]>([
    {
      version: '6.0.10',
      releaseDate: 'Jul 10, 2026',
      buildNumber: '260710',
      releaseType: 'Patch',
      installedDate: 'Jul 10, 2026 11:24 AM',
      installedBy: 'Administrator Augustus',
      status: 'Active',
      notes: 'Added support for the new module - Employee monitoring module. This module adds a complete employee monitoring layer on top of Worksuite — screenshots, app & website usage, keyboard/mouse activity, idle detection, and task-level time tracking.',
      bugFixes: [
        'Resolved layout fickers on slow network connections',
        'Fixed timezone parsing issue inside Gantt calendar',
        'Resolved billing invoice duplication on stripe webhook retry'
      ],
      newFeatures: [
        'Employee Monitoring module compatibility layer',
        'Direct connection mapping for remote agents'
      ],
      improvements: [
        'Optimized file asset loading speed by 24%',
        'Upgraded database index pointers for faster CRM lookups'
      ],
      securityFixes: [
        'Patched path traversal vulnerability in document library',
        'Upgraded CSRF token renewal timers'
      ],
      dbChanges: [
        'ALTER TABLE employee_details ADD COLUMN monitoring_consent TINYINT DEFAULT 0',
        'CREATE TABLE employee_monitoring_snapshots (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, snapshot_path VARCHAR(255))'
      ],
      filesModified: [
        '/app/Http/Controllers/EmployeeController.php',
        '/app/Models/EmployeeDetails.php',
        '/resources/views/employees/index.blade.php'
      ],
      rollbackAvailable: true
    },
    {
      version: '6.0.09',
      releaseDate: 'Jun 30, 2026',
      buildNumber: '260630',
      releaseType: 'Minor',
      installedDate: 'Jun 30, 2026 09:12 AM',
      installedBy: 'System Auto',
      status: 'Superseded',
      notes: 'General bug fixes and platform stabilization release.',
      bugFixes: [
        'Fixed ticket response markdown translation logic',
        'Resolved attendance geo-location offset calibration'
      ],
      newFeatures: [],
      improvements: [
        'Cleaned up redundant database session pools'
      ],
      securityFixes: [
        'Enhanced validation sanitization in candidate portal fields'
      ],
      dbChanges: [],
      filesModified: [
        '/app/Http/Controllers/TicketController.php',
        '/app/Services/GeoLocationService.php'
      ],
      rollbackAvailable: true
    },
    {
      version: '6.0.08',
      releaseDate: 'Jun 01, 2026',
      buildNumber: '260601',
      releaseType: 'Patch',
      installedDate: 'Jun 01, 2026 02:40 PM',
      installedBy: 'Administrator Augustus',
      status: 'Superseded',
      notes: 'Payfast gateway related bug fixes and other minor core fixes.',
      bugFixes: [
        'Fixed Payfast verification checksum callback mismatch',
        'Resolved task description file attachments listing'
      ],
      newFeatures: [
        'Added option to enforce MFA for specific tenant roles'
      ],
      improvements: [
        'Improved translation keys coverage for French & Spanish locales'
      ],
      securityFixes: [],
      dbChanges: [
        'ALTER TABLE payment_gateways ADD COLUMN webhook_signature_secret VARCHAR(255) NULL'
      ],
      filesModified: [
        '/app/Services/Payment/PayfastService.php',
        '/resources/lang/fr/app.php'
      ],
      rollbackAvailable: false
    },
    {
      version: '6.0.07',
      releaseDate: 'May 06, 2026',
      buildNumber: '260506',
      releaseType: 'Patch',
      installedDate: 'May 06, 2026 06:15 PM',
      installedBy: 'Administrator Augustus',
      status: 'Superseded',
      notes: 'Routine core bug fixes and security check updates.',
      bugFixes: [
        'Resolved dashboard summary counts mismatch for non-admin managers',
        'Fixed custom field date picker locale binding'
      ],
      newFeatures: [],
      improvements: [],
      securityFixes: [
        'Updated dependency packages for nodes vulnerabilities'
      ],
      dbChanges: [],
      filesModified: [
        '/app/Http/Controllers/DashboardController.php'
      ],
      rollbackAvailable: false
    }
  ]);

  // Update Logs Data
  const [updateLogs, setUpdateLogs] = useState<UpdateLog[]>([
    {
      version: '6.0.10',
      date: '2026-07-10 11:24 AM',
      installedBy: 'Administrator Augustus',
      status: 'Success',
      duration: '42 seconds',
      logFile: `[2026-07-10 11:23:18] Starting update to v6.0.10...\n[2026-07-10 11:23:20] Backup generated: backup_pre_6.0.10_1720610600.zip\n[2026-07-10 11:23:25] Extracting package files...\n[2026-07-10 11:23:35] Migrating database schemas...\n[2026-07-10 11:23:38] Seeding system records...\n[2026-07-10 11:23:55] Clearing file cache, routing cache, view caches...\n[2026-07-10 11:24:00] Running directory optimization mappings...\n[2026-07-10 11:24:00] SUCCESS: Update to v6.0.10 complete!`
    },
    {
      version: '6.0.09',
      date: '2026-06-30 09:12 AM',
      installedBy: 'System Auto',
      status: 'Success',
      duration: '31 seconds',
      logFile: `[2026-06-30 09:11:30] Starting update to v6.0.09...\n[2026-06-30 09:11:32] Skipping backup (Auto-update schedule, backup bypassed)\n[2026-06-30 09:11:35] Extracting package files...\n[2026-06-30 09:11:45] Migrating database schemas...\n[2026-06-30 09:11:58] Clearing file cache...\n[2026-06-30 09:12:01] SUCCESS: Update to v6.0.09 complete!`
    },
    {
      version: '6.0.08',
      date: '2026-06-01 02:40 PM',
      installedBy: 'Administrator Augustus',
      status: 'Success',
      duration: '59 seconds',
      logFile: `[2026-06-01 14:39:01] Starting update to v6.0.08...\n[2026-06-01 14:39:03] Backup generated: backup_pre_6.0.08_1717252740.zip\n[2026-06-01 14:39:15] Extracting package files...\n[2026-06-01 14:39:35] Migrating database schemas...\n[2026-06-01 14:39:48] Seeding system records...\n[2026-06-01 14:39:55] Clearing file cache...\n[2026-06-01 14:40:00] SUCCESS: Update to v6.0.08 complete!`
    }
  ]);

  // Action: Check for Updates
  const handleCheckUpdates = () => {
    setUpdateStep('checking');
    onNotify('Connecting to update server...');
    setTimeout(() => {
      if (isDemoMode) {
        setUpdateAvailable(true);
        setLatestVersion('6.1.0');
        setLatestReleaseDate('Jul 11, 2026');
        setUpdateStep('idle');
        onNotify('Update Available! v6.1.0 is ready for download.');
      } else {
        setUpdateAvailable(false);
        setUpdateStep('idle');
        onNotify('Your application is already up to date!');
      }
    }, 1200);
  };

  // Action: Download Update
  const handleDownloadUpdate = () => {
    setUpdateStep('downloading');
    setDownloadProgress(0);
    onNotify('Download started for v6.1.0...');
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setDownloadProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUpdateStep('ready-to-install');
        onNotify('Download complete! Update package is ready to install.');
      }
    }, 200);
  };

  // Action: Install Update
  const handleInstallUpdate = () => {
    setUpdateStep('installing');
    setInstallProgress(0);
    setInstallStepName('Initializing environment...');
    setInstallLogMessages(['[START] Installing Worksuite Enterprise update...']);
    onNotify('Installation started. Please do not close this tab.');

    const steps = [
      { name: 'Creating Backup', percentage: 15, msg: 'Generating SQL schema backup & web assets snapshot...' },
      { name: 'Extracting Files', percentage: 35, msg: 'Unzipping archive package in core directory...' },
      { name: 'Database Migration', percentage: 65, msg: 'Running database migrations (applying ALTER/CREATE queries)...' },
      { name: 'Cache Clear', percentage: 80, msg: 'Clearing application cache, configs, views, and routing tables...' },
      { name: 'Optimization', percentage: 95, msg: 'Regenerating composer optimized files and vendor routes...' },
      { name: 'Completed', percentage: 100, msg: 'Worksuite updated successfully!' }
    ];

    let currentStepIndex = 0;

    const runStep = () => {
      if (currentStepIndex >= steps.length) {
        // Success
        setUpdateStep('success');
        const oldVer = currentVersion;
        setCurrentVersion(latestVersion);
        setReleaseDate(latestReleaseDate);
        setUpdateAvailable(false);

        // Add to logs
        const newLog: UpdateLog = {
          version: latestVersion,
          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          installedBy: 'Administrator Augustus',
          status: 'Success',
          duration: '18 seconds',
          logFile: `[${new Date().toISOString()}] Started update from ${oldVer} to ${latestVersion}\n` + 
                   installLogMessages.join('\n') + `\n[SUCCESS] Update to ${latestVersion} completed successfully!`
        };
        setUpdateLogs(prev => [newLog, ...prev]);

        // Add to version history
        const newHistoryRecord: VersionRecord = {
          version: latestVersion,
          releaseDate: latestReleaseDate,
          buildNumber: '260711',
          releaseType: 'Minor',
          installedDate: new Date().toLocaleString(),
          installedBy: 'Administrator Augustus',
          status: 'Active',
          notes: 'Successful upgrade to Worksuite v6.1.0. Incorporates advanced notification sockets and unified payroll parameters.',
          bugFixes: ['Fixed database lock constraints during bulk updates', 'Resolved timezone calibration offsets'],
          newFeatures: ['Real-time socket dispatcher for quick messages'],
          improvements: ['Increased API gateway throughput by 30%'],
          securityFixes: ['Reinforced parameter validation protocols'],
          dbChanges: ['ALTER TABLE companies ADD COLUMN realtime_dispatcher_token VARCHAR(255) NULL'],
          filesModified: ['/app/Http/Controllers/UpdateController.php', '/config/services.php'],
          rollbackAvailable: true
        };

        setVersionHistoryList(prev => {
          const updated = prev.map(v => v.version === oldVer ? { ...v, status: 'Superseded' as const } : v);
          return [newHistoryRecord, ...updated];
        });

        onNotify('Installation Successful! WorkSuite is now running v' + latestVersion);
        return;
      }

      const step = steps[currentStepIndex];

      // If user toggled "force fail", let's fail during Database Migration
      if (forceFailInstall && step.name === 'Database Migration') {
        setTimeout(() => {
          setUpdateStep('failed');
          setInstallStepName('Database Migration Failed');
          setInstallLogMessages(prev => [
            ...prev,
            `[ERROR] Failed to run database migrations:`,
            `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'realtime_dispatcher_token' in 'field list'`,
            `Transaction rolled back automatically. Installation halted.`
          ]);
          onNotify('Installation Failed. Database migration encountered an error.');
        }, 1200);
        return;
      }

      // If skipping backup
      if (step.name === 'Creating Backup' && !createBackup) {
        setInstallLogMessages(prev => [...prev, '[SKIP] Backup creation disabled by user settings. Skipping...']);
        currentStepIndex++;
        setTimeout(runStep, 400);
        return;
      }

      setInstallStepName(step.name);
      setInstallProgress(step.percentage);
      setInstallLogMessages(prev => [...prev, `[STEP: ${step.name}] ${step.msg}`]);

      currentStepIndex++;
      setTimeout(runStep, 800);
    };

    // Begin sequence
    setTimeout(runStep, 400);
  };

  // Action: Upload Update Package
  const handleUploadClick = () => {
    setShowUploadModal(true);
    setUploadError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processUploadedFile = (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setUploadError('Validation Failed: Only ZIP files (.zip) are allowed.');
      onNotify('Validation Failed: Invalid file type');
      return;
    }
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setUploadError('Validation Failed: Zip file size exceeds the 100MB environment limit.');
      onNotify('Validation Failed: File size exceeds limit');
      return;
    }

    // Simulate validation checks
    onNotify('Uploading and validating ZIP archive package...');
    setShowUploadModal(false);
    setUpdateStep('ready-to-install');
    setUpdateAvailable(true);
    setLatestVersion('6.1.1-custom');
    setLatestReleaseDate('Jul 11, 2026 (Uploaded)');
    setUpdateSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    setCompatibilityStatus('Verified Compatibility');
    onNotify('ZIP package uploaded and validated! Ready for installation.');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  // Action: Rollback
  const handleRollbackClick = (ver: string) => {
    setShowRollbackConfirm(ver);
  };

  const confirmRollback = () => {
    const ver = showRollbackConfirm;
    setShowRollbackConfirm(null);
    if (!ver) return;

    onNotify('Rollback initiated for v' + ver + '...');
    
    // Simulate rollback
    setTimeout(() => {
      setCurrentVersion(ver);
      setUpdateAvailable(true);
      setLatestVersion('6.1.0');
      
      // Update history list statuses
      setVersionHistoryList(prev => {
        return prev.map(v => {
          if (v.version === ver) {
            return { ...v, status: 'Active' as const };
          } else if (v.status === 'Active') {
            return { ...v, status: 'Available' as const };
          }
          return v;
        });
      });

      onNotify('Rollback Successful! App restored to version v' + ver);
    }, 1500);
  };

  // Helper: Get Badge classes
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Up to Date':
      case 'Active':
      case 'passed':
      case 'Success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-150 font-bold';
      case 'Update Available':
      case 'Warning':
      case 'warning':
      case 'Available':
        return 'bg-amber-50 text-amber-700 border-amber-150 font-bold';
      case 'Maintenance Mode':
      case 'Failed':
      case 'failed':
      case 'Superseded':
        return 'bg-rose-50 text-rose-700 border-rose-150 font-bold';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-150';
    }
  };

  return (
    <div className="space-y-6" id="update-app-settings-view">
      
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-150 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <RefreshCw className={`h-5 w-5 text-blue-600 ${updateStep === 'checking' || updateStep === 'downloading' || updateStep === 'installing' ? 'animate-spin' : ''}`} />
            <span>Update Application Settings</span>
          </h2>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            <span>System Configuration</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">Home</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">Settings</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-400 font-medium">Update App</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!showVersionHistory && (
            <>
              <button 
                onClick={handleCheckUpdates}
                disabled={updateStep === 'checking' || updateStep === 'downloading' || updateStep === 'installing'}
                className="bg-[#1d82f5] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${updateStep === 'checking' ? 'animate-spin' : ''}`} />
                <span>Check for Updates</span>
              </button>

              <button 
                onClick={handleUploadClick}
                disabled={updateStep === 'checking' || updateStep === 'downloading' || updateStep === 'installing'}
                className="bg-white hover:bg-slate-50 disabled:opacity-50 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Upload Update ZIP</span>
              </button>
            </>
          )}

          <button 
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
          >
            <History className="h-3.5 w-3.5 text-slate-600" />
            <span>{showVersionHistory ? 'Back to Update Panel' : 'Version History Logs'}</span>
          </button>

          {/* Simulation Tools */}
          <div className="flex items-center gap-3 border border-dashed border-slate-200 px-3 py-1 rounded-md text-[10px] bg-slate-50">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-500">Force Fail:</span>
              <input 
                type="checkbox" 
                checked={forceFailInstall} 
                onChange={(e) => setForceFailInstall(e.target.checked)}
                className="h-3 w-3 rounded text-blue-600 border-slate-300 cursor-pointer"
                title="Force Database Migration step to fail to inspect error screens"
              />
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-500">Demo Mode:</span>
              <input 
                type="checkbox" 
                checked={isDemoMode} 
                onChange={(e) => setIsDemoMode(e.target.checked)}
                className="h-3 w-3 rounded text-blue-600 border-slate-300 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showVersionHistory ? (
          /* VERSION HISTORY VIEW OVERLAY */
          <motion.div 
            key="version-history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-blue-50/50 border border-blue-150 p-4 rounded-xl flex items-start gap-3.5 text-xs">
              <History className="h-4.5 w-4.5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-blue-800 block">Version History Logs & Changelogs</span>
                <p className="text-blue-700 font-medium mt-1 leading-relaxed">
                  Below is the deployment log archive of previously applied updates to this WorkSuite server. You can audit details, view full logs, or restore back to stable superseded states.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Archived Versions ({versionHistoryList.length})</span>
                <button 
                  onClick={() => setShowVersionHistory(false)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-extrabold flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Return to Main Dashboard</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="px-4 py-3">Version Number</th>
                      <th className="px-4 py-3">Release Date</th>
                      <th className="px-4 py-3">Build</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Installed Time</th>
                      <th className="px-4 py-3">Installed By</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-semibold text-slate-600">
                    {versionHistoryList.map(v => (
                      <tr key={v.version} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => setSelectedVersionDetail(v)}
                            className="font-bold text-blue-600 hover:underline text-left cursor-pointer"
                          >
                            v{v.version}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{v.releaseDate}</td>
                        <td className="px-4 py-3 font-mono text-slate-400 text-[10px]">{v.buildNumber}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] border ${
                            v.releaseType === 'Security' ? 'bg-rose-50 text-rose-600 border-rose-150' :
                            v.releaseType === 'Major' ? 'bg-purple-50 text-purple-600 border-purple-150' :
                            v.releaseType === 'Minor' ? 'bg-blue-50 text-blue-600 border-blue-150' :
                            'bg-slate-50 text-slate-600 border-slate-150'
                          }`}>
                            {v.releaseType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{v.installedDate}</td>
                        <td className="px-4 py-3 text-slate-600">{v.installedBy}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${getBadgeStyle(v.status)}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button 
                            onClick={() => setSelectedVersionDetail(v)}
                            className="text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/75 px-2.5 py-1 rounded cursor-pointer"
                          >
                            Details
                          </button>
                          {v.rollbackAvailable && v.status !== 'Active' && (
                            <button 
                              onClick={() => handleRollbackClick(v.version)}
                              className="text-[11px] text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/75 px-2.5 py-1 rounded cursor-pointer"
                            >
                              Rollback
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          /* MAIN UPDATE APP CONTENT */
          <motion.div 
            key="main-update-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Status alerts */}
            {updateAvailable && updateStep === 'idle' && (
              <div className="bg-amber-50/70 border border-amber-150 p-4 rounded-xl flex items-center justify-between text-xs animate-pulse">
                <div className="flex items-start gap-3.5">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-extrabold text-amber-800">A new update v{latestVersion} is available for installation!</span>
                    <p className="text-amber-700 font-semibold mt-1">Please review compatibility checks and backup requirements before downloading.</p>
                  </div>
                </div>
                <button 
                  onClick={handleDownloadUpdate}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-1.5 rounded-lg shrink-0 shadow-3xs cursor-pointer transition-colors"
                >
                  Get Update
                </button>
              </div>
            )}

            {!updateAvailable && updateStep === 'idle' && (
              <div className="bg-emerald-50/70 border border-emerald-150 p-4 rounded-xl flex items-start gap-3.5 text-xs">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold text-emerald-800">Your Worksuite App is completely up to date.</span>
                  <p className="text-emerald-700 font-semibold mt-1">Running the stable enterprise branch: v{currentVersion}. Last checked on {lastChecked}.</p>
                </div>
              </div>
            )}

            {/* Current Version Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-3xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Current Installation</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getBadgeStyle(updateAvailable ? 'Update Available' : 'Up to Date')}`}>
                    {updateAvailable ? 'Update Available' : 'Up to Date'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">App Version:</span>
                    <button 
                      onClick={() => setShowVersionHistory(true)}
                      className="text-blue-600 font-black hover:underline cursor-pointer flex items-center gap-1"
                      title="Click to view Version History"
                    >
                      <span>v{currentVersion}</span>
                      <History className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Release Date:</span>
                    <span className="text-slate-700 font-bold">{releaseDate}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">License Status:</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="h-3 w-3 stroke-[3]" />
                      <span>{licenseStatus}</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Environment:</span>
                    <span className="text-slate-700 font-bold">{environment}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Last Checked:</span>
                    <span className="text-slate-500 font-medium">{lastChecked}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-semibold">Auto-Update:</span>
                    <button 
                      onClick={() => {
                        setAutoUpdate(!autoUpdate);
                        onNotify(`Auto-update schedule is now ${!autoUpdate ? 'Enabled' : 'Disabled'}`);
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      {autoUpdate ? 'Enabled (Check daily)' : 'Disabled'}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setShowVersionHistory(true)}
                  className="w-full text-center text-xs font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-100/70 border border-blue-100 py-2.5 rounded-lg cursor-pointer transition-colors block"
                >
                  Previous Updates / Version History
                </button>
              </div>

              {/* Latest available card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-3xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Latest Release Parameters</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-100 font-bold">
                    Official Branch
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Latest Version:</span>
                    <span className="text-slate-800 font-extrabold">v{latestVersion}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Release Date:</span>
                    <span className="text-slate-700 font-bold">{latestReleaseDate}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Package Size:</span>
                    <span className="text-slate-700 font-bold">{updateSize}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Min PHP:</span>
                    <span className="text-slate-700 font-bold">{minPhpVersion}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Min SQL db:</span>
                    <span className="text-slate-700 font-bold truncate max-w-[150px]">{minDbVersion}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Compatibility:</span>
                    <span className="text-indigo-600 font-bold">{compatibilityStatus}</span>
                  </div>
                </div>

                <div className="pt-2">
                  {updateStep === 'idle' && updateAvailable && (
                    <button 
                      onClick={handleDownloadUpdate}
                      className="w-full text-center text-xs font-bold text-white bg-[#1d82f5] hover:bg-blue-600 py-2.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Download Update Package
                    </button>
                  )}

                  {updateStep === 'ready-to-install' && (
                    <button 
                      onClick={handleInstallUpdate}
                      className="w-full text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Install Update Now
                    </button>
                  )}

                  {updateStep === 'downloading' && (
                    <div className="text-center text-xs text-slate-500 font-bold animate-pulse">
                      Downloading package... {downloadProgress}%
                    </div>
                  )}

                  {updateStep === 'installing' && (
                    <div className="text-center text-xs text-indigo-600 font-bold animate-pulse">
                      Installing update... {installProgress}%
                    </div>
                  )}

                  {!updateAvailable && (
                    <div className="text-center text-xs text-slate-400 font-bold bg-slate-50 border border-slate-150 py-2.5 rounded-lg">
                      No Updates Pending
                    </div>
                  )}
                </div>
              </div>

              {/* Backup configuration */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-3xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Automated Backup Buffer</span>
                    <HardDrive className="h-4 w-4 text-slate-400" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="backup-before-update"
                        checked={createBackup}
                        onChange={(e) => setCreateBackup(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="backup-before-update" className="text-xs font-bold text-slate-700 cursor-pointer">
                        Create Backup Before Updating
                      </label>
                    </div>

                    <div className="text-[11px] space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-slate-500 font-semibold leading-relaxed">
                      <div>
                        <span className="text-slate-400 block uppercase text-[8px] font-black">Storage Path</span>
                        <code className="text-blue-600 font-mono text-[9px]">{backupLocation}</code>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase text-[8px] font-black">Last Backup Timestamp</span>
                        <span>{lastBackupDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase text-[8px] font-black">Buffer Status</span>
                        <span className="text-slate-700">{backupStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 lg:pt-0">
                  <button 
                    onClick={() => {
                      onNotify('Generating manual backup archive...');
                      setTimeout(() => {
                        setLastBackupDate(new Date().toLocaleString());
                        setBackupStatus('System holds 3 local backups');
                        onNotify('Manual backup generated successfully!');
                      }, 1000);
                    }}
                    className="w-full text-center text-xs font-bold text-slate-700 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Generate Backup Now
                  </button>
                </div>
              </div>

            </div>

            {/* If installation running, failed, or completed */}
            {(updateStep === 'downloading' || updateStep === 'installing' || updateStep === 'failed' || updateStep === 'success' || updateStep === 'ready-to-install') && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-3xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-indigo-600" />
                    <span>Active Installer Pipeline & Progress</span>
                  </h4>
                  <div className="text-[10px] font-bold text-slate-400">
                    Status: <span className="uppercase text-indigo-600 font-black">{updateStep}</span>
                  </div>
                </div>

                {updateStep === 'downloading' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Downloading v{latestVersion} Package...</span>
                      <span className="text-blue-600">{downloadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 font-semibold">Pulling update archives from stable release server network.</p>
                  </div>
                )}

                {updateStep === 'ready-to-install' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-lg text-emerald-800 text-xs font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600 stroke-[3]" />
                        <span>Package download and validation checksums matched successfully!</span>
                      </div>
                      <button 
                        onClick={handleInstallUpdate}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded text-xs cursor-pointer shadow-3xs"
                      >
                        Install Now
                      </button>
                    </div>
                  </div>
                )}

                {updateStep === 'installing' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700">Installing: <span className="text-indigo-600 font-black">{installStepName}</span></span>
                      <span className="text-indigo-600">{installProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${installProgress}%` }} />
                    </div>
                    
                    {/* Live console-like log */}
                    <div className="bg-slate-900 rounded-lg p-3 font-mono text-[10px] text-slate-300 space-y-1.5 max-h-[140px] overflow-y-auto">
                      {installLogMessages.map((m, i) => (
                        <div key={i} className="leading-relaxed">
                          <span className="text-indigo-400 font-bold">&gt;&gt;</span> {m}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {updateStep === 'success' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-xs flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-emerald-800 text-sm block">Installation Completed Successfully!</span>
                        <p className="text-emerald-700 font-medium mt-1 leading-relaxed">
                          Worksuite has been upgraded to v{currentVersion} successfully. All cache matrices regenerated, database scripts updated, and modules synchronized.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button 
                            onClick={() => {
                              setUpdateStep('idle');
                              onNotify('Changelogs acknowledged.');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded cursor-pointer shadow-3xs"
                          >
                            Dismiss & Close Pipeline
                          </button>
                          <button 
                            onClick={() => setShowVersionHistory(true)}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded cursor-pointer shadow-3xs"
                          >
                            View Version Logs
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {updateStep === 'failed' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-rose-50 border border-rose-150 rounded-xl text-xs flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-rose-800 text-sm block">Installation Failed!</span>
                        <p className="text-rose-700 font-medium mt-1 leading-relaxed">
                          Installer caught database constraint failures. Automated transactions rolled back to preserve business state stability.
                        </p>
                        <div className="mt-2 bg-slate-950 p-2.5 rounded text-rose-300 font-mono text-[9px] leading-relaxed max-h-[80px] overflow-y-auto">
                          {installLogMessages[installLogMessages.length - 1]}
                        </div>
                        <div className="mt-3 flex gap-2.5">
                          <button 
                            onClick={() => {
                              setForceFailInstall(false); // remove force fail for simulation
                              handleInstallUpdate();
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-3.5 py-1.5 rounded-lg cursor-pointer shadow-3xs"
                          >
                            Retry Installation
                          </button>
                          <button 
                            onClick={() => {
                              setUpdateStep('idle');
                              onNotify('Installation aborted by administrator');
                            }}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3.5 py-1.5 rounded-lg cursor-pointer shadow-3xs"
                          >
                            Cancel & Abort
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* System Verification */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-3xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Pre-flight System Verification</span>
                <span className="text-[10px] text-slate-400 font-bold">Checks verified automatically</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemChecks.map((check, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-700 block">{check.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{check.requirement}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                        <Check className="h-3 w-3 stroke-[3]" />
                        <span>Passed</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Release notes format requirement */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-3xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Release Notes Template Preview</span>
                <span className="text-[10px] text-slate-400 font-bold">WorkSuite formatting template</span>
              </div>
              <div className="text-xs space-y-3 leading-relaxed text-slate-600 font-medium">
                <h4 className="text-sm font-extrabold text-slate-900 border-l-4 border-blue-500 pl-2">v6.1.0 Feature Addendum</h4>
                <p>This release delivers core structural updates matching the latest security and performance requirements.</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Integrated Websocket Layer:</strong> Realtime notification support for attendance updates.</li>
                    <li><strong>Upgraded CSRF Validators:</strong> Prevent replay requests inside the payroll dispatch engine.</li>
                    <li><strong>Optimized Indexes:</strong> Decreased lookup queries duration across task mapping sheets.</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-blue-600 hover:underline font-bold cursor-pointer pt-1" onClick={() => setShowVersionHistory(true)}>
                  <span>View version history catalog for complete developer changelogs</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* Update Logs Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Installer Update Logs Logs</span>
                <span className="text-[10px] text-slate-400 font-bold">Auditing deployment sequences</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="px-4 py-3">Version</th>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Operator</th>
                      <th className="px-4 py-3">Execution Time</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-semibold text-slate-600">
                    {updateLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-800">v{log.version}</td>
                        <td className="px-4 py-3 text-slate-400">{log.date}</td>
                        <td className="px-4 py-3 text-slate-600">{log.installedBy}</td>
                        <td className="px-4 py-3 text-slate-500">{log.duration}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${getBadgeStyle(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button 
                            onClick={() => setSelectedLogText({ version: log.version, text: log.logFile })}
                            className="text-[11px] text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/75 px-2.5 py-1 rounded cursor-pointer"
                          >
                            View Log
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VERSION DETAIL MODAL */}
      {selectedVersionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
            <div className="p-5 border-b border-slate-150 bg-slate-50 flex justify-between items-center shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-400 font-black block">Release Changelog Details</span>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <span>WorkSuite Release v{selectedVersionDetail.version}</span>
                  <span className={`text-[9px] font-extrabold border px-2 py-0.5 rounded-full ${
                    selectedVersionDetail.releaseType === 'Security' ? 'bg-rose-50 text-rose-600 border-rose-150' :
                    selectedVersionDetail.releaseType === 'Major' ? 'bg-purple-50 text-purple-600 border-purple-150' :
                    'bg-blue-50 text-blue-600 border-blue-150'
                  }`}>
                    {selectedVersionDetail.releaseType} Release
                  </span>
                </h3>
              </div>
              <button 
                onClick={() => setSelectedVersionDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto text-xs leading-relaxed text-slate-600 font-medium">
              <div>
                <h4 className="text-[10px] uppercase text-slate-400 font-black mb-1.5 tracking-wider">Release Summary</h4>
                <p className="bg-slate-50 border border-slate-150 rounded-lg p-3.5 text-slate-700 italic">
                  &ldquo;{selectedVersionDetail.notes}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-semibold">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-black">Release Date</span>
                  <span className="text-slate-800">{selectedVersionDetail.releaseDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-black">Build Number</span>
                  <span className="text-slate-800 font-mono">{selectedVersionDetail.buildNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-black">Installed Date</span>
                  <span className="text-slate-800">{selectedVersionDetail.installedDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-black">Installed By</span>
                  <span className="text-slate-800">{selectedVersionDetail.installedBy}</span>
                </div>
              </div>

              {selectedVersionDetail.newFeatures.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-slate-400 font-black mb-1.5 tracking-wider">★ New Features Introduced</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {selectedVersionDetail.newFeatures.map((f, idx) => <li key={idx}>{f}</li>)}
                  </ul>
                </div>
              )}

              {selectedVersionDetail.bugFixes.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-slate-400 font-black mb-1.5 tracking-wider">✔ Bug Fixes Included</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {selectedVersionDetail.bugFixes.map((f, idx) => <li key={idx}>{f}</li>)}
                  </ul>
                </div>
              )}

              {selectedVersionDetail.improvements.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-slate-400 font-black mb-1.5 tracking-wider">📈 Performance Improvements</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {selectedVersionDetail.improvements.map((f, idx) => <li key={idx}>{f}</li>)}
                  </ul>
                </div>
              )}

              {selectedVersionDetail.securityFixes.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-slate-400 font-black mb-1.5 tracking-wider">🛡 Security Vulnerability Fixes</h4>
                  <ul className="list-disc pl-5 space-y-1 text-rose-700">
                    {selectedVersionDetail.securityFixes.map((f, idx) => <li key={idx} className="flex items-center gap-1.5">
                      <ShieldAlert className="h-3 w-3 shrink-0" />
                      <span>{f}</span>
                    </li>)}
                  </ul>
                </div>
              )}

              {selectedVersionDetail.dbChanges.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-slate-400 font-black mb-1.5 tracking-wider">🗄 Relational Database Migrations</h4>
                  <div className="bg-slate-900 text-slate-200 font-mono text-[10px] p-2.5 rounded-lg space-y-1 overflow-x-auto">
                    {selectedVersionDetail.dbChanges.map((c, idx) => <div key={idx} className="whitespace-nowrap">&gt; {c}</div>)}
                  </div>
                </div>
              )}

              {selectedVersionDetail.filesModified.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase text-slate-400 font-black mb-1.5 tracking-wider">📁 File Directory Alterations</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-mono text-slate-500 space-y-1">
                    {selectedVersionDetail.filesModified.map((f, idx) => <div key={idx}>{f}</div>)}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-150 pt-4 flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                  <span>Rollback capability status: {selectedVersionDetail.rollbackAvailable ? 'Available' : 'Bypassed'}</span>
                </div>
                {selectedVersionDetail.rollbackAvailable && selectedVersionDetail.status !== 'Active' && (
                  <button 
                    onClick={() => {
                      setSelectedVersionDetail(null);
                      handleRollbackClick(selectedVersionDetail.version);
                    }}
                    className="bg-rose-50 hover:bg-rose-100 border border-rose-150 text-rose-600 font-bold px-3 py-1.5 rounded cursor-pointer shadow-3xs"
                  >
                    Restore This Version
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-end gap-2 shrink-0">
              <button 
                onClick={() => {
                  onNotify('Downloading Release Changelog pdf...');
                }}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-2 rounded text-xs cursor-pointer shadow-3xs flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Download Changelog</span>
              </button>
              <button 
                onClick={() => setSelectedVersionDetail(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded text-xs cursor-pointer shadow-3xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZIP FILE UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-xl flex flex-col">
            <div className="p-5 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-400 font-black block">System Integration</span>
                <h3 className="text-sm font-extrabold text-slate-800">Upload Manual Update ZIP</h3>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <Upload className={`h-10 w-10 mx-auto mb-3 ${isDragging ? 'text-blue-500 animate-bounce' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-700 block">Drag & drop your update ZIP file here</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">Or browse to pick from directories</span>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".zip"
                  className="hidden" 
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-3xs cursor-pointer"
                >
                  Browse Files
                </button>
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-150 rounded-lg text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-150 rounded-lg text-blue-700 text-[11px] font-semibold space-y-1">
                <span className="font-extrabold block text-blue-800">Verification & Validation Checks:</span>
                <p>The system automatically decodes parameters, verifies PHP/SQL compatibility, and validates manifest credentials before staging.</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-150 bg-slate-50 flex justify-end gap-2 shrink-0">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-2 rounded text-xs cursor-pointer shadow-3xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLLBACK CONFIRM DIALOG */}
      {showRollbackConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full shadow-lg p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Confirm Rollback Sequence?</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  You are preparing to restore the application server back to version v{showRollbackConfirm}.
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-150 rounded-lg p-3 text-rose-700 text-xs font-bold space-y-1.5">
              <span className="block text-rose-800 uppercase text-[9px] font-black">CRITICAL BACKUP WARNING</span>
              <p className="font-medium text-[11px] leading-relaxed">
                Rollbacks may reverse database schemas. Any new transactions, time clock registers, or client leads logged after the update timestamp will be permanently deleted unless you have an isolated backup.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowRollbackConfirm(null)}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRollback}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-lg cursor-pointer shadow-3xs"
              >
                I Understand, Rollback Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE EXECUTION LOG MODAL */}
      {selectedLogText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full shadow-xl flex flex-col">
            <div className="p-4 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-600" />
                <h3 className="text-xs font-extrabold text-slate-800">Installer Log: Update to v{selectedLogText.version}</h3>
              </div>
              <button 
                onClick={() => setSelectedLogText(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 text-slate-200 font-mono text-[10px] leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap select-all">
              {selectedLogText.text}
            </div>

            <div className="p-3 border-t border-slate-150 bg-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
              <span>Click inside log panel to copy records</span>
              <button 
                onClick={() => setSelectedLogText(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded cursor-pointer text-xs"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
