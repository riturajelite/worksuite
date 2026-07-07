/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Fingerprint, Search, Plus, RefreshCw, HelpCircle, ChevronRight, 
  Trash2, Edit3, CheckCircle, Clock, ShieldAlert, XCircle, ChevronDown, 
  ChevronUp, Sliders, Calendar, Download, Play, ShieldCheck, Info, Sparkles, UserCheck, AlertTriangle
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  serialNumber: string;
  ip: string;
  port: string;
  username: string;
  branch: string;
  type: 'Fingerprint Scanner' | 'Retinal Reader' | 'RFID Gate' | 'Facial Recognizer';
  timezone: string;
  location: string;
  status: 'Online' | 'Offline' | 'Syncing';
  lastPing: string;
}

interface AttendanceLog {
  id: string;
  employeeId: string;
  employeeName: string;
  avatar: string;
  deviceName: string;
  status: 'Clock In' | 'Clock Out' | 'Access Granted' | 'Access Denied';
  timestamp: string;
  date: string;
}

interface EmployeeMapping {
  employeeId: string;
  employeeName: string;
  avatar: string;
  department: string;
  deviceToken: string;
  mappedDevices: string[];
  calibrationStatus: 'Calibrated' | 'Pending Setup' | 'Recalibration Needed';
  lastSynced: string;
}

interface Command {
  id: string;
  employeeName: string;
  deviceName: string;
  type: 'Force Sync' | 'Reboot Terminal' | 'Reset Keys' | 'Flash Firmware' | 'Toggle Lock';
  status: 'Pending' | 'Sent' | 'Executed' | 'Failed';
  created: string;
  sent?: string;
  executed?: string;
  failed?: string;
}

// Prepopulate realistic initial data
const INITIAL_DEVICES: Device[] = [
  { id: 'DEV-01', name: 'Main Lobby Fingerprint Scanner', serialNumber: 'FP-99214-X8', ip: '192.168.1.104', port: '8080', username: 'admin', branch: 'San Francisco HQ', type: 'Fingerprint Scanner', timezone: 'GMT-8 (PST)', location: 'Lobby Entrance Floor 1', status: 'Online', lastPing: '10 seconds ago' },
  { id: 'DEV-02', name: 'Engineering Door Retinal Gate', serialNumber: 'RT-88412-A3', ip: '192.168.1.105', port: '8080', username: 'admin', branch: 'San Francisco HQ', type: 'Retinal Reader', timezone: 'GMT-8 (PST)', location: 'R&D Lab Entrance Floor 3', status: 'Online', lastPing: '1 minute ago' },
  { id: 'DEV-03', name: 'Warehouse RFID Security Gate', serialNumber: 'RF-77213-W2', ip: '192.168.2.112', port: '8081', username: 'wh_admin', branch: 'Oakland Logistics', type: 'RFID Gate', timezone: 'GMT-8 (PST)', location: 'Loading Bay 2', status: 'Offline', lastPing: '2 days ago' },
];

const INITIAL_LOGS: AttendanceLog[] = [
  { id: 'LOG-301', employeeId: 'EM-01', employeeName: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', deviceName: 'Main Lobby Fingerprint Scanner', status: 'Clock In', timestamp: '08:55 AM', date: '2026-07-03' },
  { id: 'LOG-302', employeeId: 'EM-02', employeeName: 'James Carter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', deviceName: 'Main Lobby Fingerprint Scanner', status: 'Clock In', timestamp: '08:58 AM', date: '2026-07-03' },
  { id: 'LOG-303', employeeId: 'EM-04', employeeName: 'Daniel Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', deviceName: 'Engineering Door Retinal Gate', status: 'Access Granted', timestamp: '09:12 AM', date: '2026-07-03' },
  { id: 'LOG-304', employeeId: 'EM-05', employeeName: 'Zara Khan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', deviceName: 'Main Lobby Fingerprint Scanner', status: 'Clock In', timestamp: '09:02 AM', date: '2026-07-03' },
  { id: 'LOG-305', employeeId: 'EM-01', employeeName: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', deviceName: 'Engineering Door Retinal Gate', status: 'Access Granted', timestamp: '09:15 AM', date: '2026-07-03' },
  { id: 'LOG-306', employeeId: 'EM-03', employeeName: 'Aria Montgomery', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', deviceName: 'Main Lobby Fingerprint Scanner', status: 'Clock In', timestamp: '09:25 AM', date: '2026-07-02' },
  { id: 'LOG-307', employeeId: 'EM-04', employeeName: 'Daniel Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', deviceName: 'Main Lobby Fingerprint Scanner', status: 'Access Denied', timestamp: '11:45 PM', date: '2026-07-02' },
];

const INITIAL_MAPPINGS: EmployeeMapping[] = [
  { employeeId: 'EM-01', employeeName: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', department: 'Engineering', deviceToken: 'TOK-ELENA-99432', mappedDevices: ['Main Lobby Fingerprint Scanner', 'Engineering Door Retinal Gate'], calibrationStatus: 'Calibrated', lastSynced: '2026-07-03 08:30 AM' },
  { employeeId: 'EM-02', employeeName: 'James Carter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', department: 'Design', deviceToken: 'TOK-JAMES-00341', mappedDevices: ['Main Lobby Fingerprint Scanner'], calibrationStatus: 'Calibrated', lastSynced: '2026-07-03 08:45 AM' },
  { employeeId: 'EM-03', employeeName: 'Aria Montgomery', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', department: 'Product', deviceToken: 'TOK-ARIA-88543', mappedDevices: ['Main Lobby Fingerprint Scanner'], calibrationStatus: 'Calibrated', lastSynced: '2026-07-02 10:15 AM' },
  { employeeId: 'EM-04', employeeName: 'Daniel Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', department: 'QA', deviceToken: 'TOK-DANIEL-23114', mappedDevices: ['Main Lobby Fingerprint Scanner', 'Engineering Door Retinal Gate'], calibrationStatus: 'Recalibration Needed', lastSynced: '2026-07-02 11:20 AM' },
  { employeeId: 'EM-05', employeeName: 'Zara Khan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', department: 'HR', deviceToken: 'TOK-ZARA-77124', mappedDevices: [], calibrationStatus: 'Pending Setup', lastSynced: 'Never' },
];

const INITIAL_COMMANDS: Command[] = [
  { id: 'CMD-101', employeeName: 'Elena Rostova', deviceName: 'Engineering Door Retinal Gate', type: 'Force Sync', status: 'Executed', created: '2026-07-03 09:05 AM', sent: '09:05:10 AM', executed: '09:05:12 AM' },
  { id: 'CMD-102', employeeName: 'Daniel Park', deviceName: 'Engineering Door Retinal Gate', type: 'Reboot Terminal', status: 'Executed', created: '2026-07-03 08:00 AM', sent: '08:00:03 AM', executed: '08:01:25 AM' },
  { id: 'CMD-103', employeeName: 'Global Sync', deviceName: 'Main Lobby Fingerprint Scanner', type: 'Reset Keys', status: 'Pending', created: '2026-07-03 10:00 AM' },
  { id: 'CMD-104', employeeName: 'Zara Khan', deviceName: 'Main Lobby Fingerprint Scanner', type: 'Force Sync', status: 'Sent', created: '2026-07-03 09:45 AM', sent: '09:45:15 AM' },
  { id: 'CMD-105', employeeName: 'System Core', deviceName: 'Warehouse RFID Security Gate', type: 'Flash Firmware', status: 'Failed', created: '2026-07-02 04:30 PM', sent: '04:30:20 PM', failed: '04:31:00 PM' },
];

interface BiometricTabProps {
  subTab: string;
}

export default function BiometricTab({ subTab }: BiometricTabProps) {
  // Global States
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [logs, setLogs] = useState<AttendanceLog[]>(INITIAL_LOGS);
  const [mappings, setMappings] = useState<EmployeeMapping[]>(INITIAL_MAPPINGS);
  const [commands, setCommands] = useState<Command[]>(INITIAL_COMMANDS);

  // Search & Filter state for Devices Tab
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceSortField, setDeviceSortField] = useState<'name' | 'branch' | 'status'>('name');
  const [deviceSortOrder, setDeviceSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isGuideExpanded, setIsGuideExpanded] = useState(true);

  // Search & Filter state for Logs Tab
  const [logSearch, setLogSearch] = useState('');
  const [logEmployeeFilter, setLogEmployeeFilter] = useState('');
  const [logMonthFilter, setLogMonthFilter] = useState('07'); // Default July
  const [logYearFilter, setLogYearFilter] = useState('2026');
  const [logDateRangeStart, setLogDateRangeStart] = useState('');
  const [logDateRangeEnd, setLogDateRangeEnd] = useState('');

  // Search & Filter for Mapping Tab
  const [mappingSearch, setMappingSearch] = useState('');
  const [mappingStatusFilter, setMappingStatusFilter] = useState('');

  // Search & Filter for Commands Tab
  const [commandSearch, setCommandSearch] = useState('');
  const [commandStatusFilter, setCommandStatusFilter] = useState('');

  // Form Modals / Sub-pages state
  const [showAddDevicePage, setShowAddDevicePage] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showCommandModal, setShowCommandModal] = useState(false);

  // Track landing screen status for each subTab - bypassed to show list directly
  const [hasOpenedList, setHasOpenedList] = useState<Record<string, boolean>>({
    'bio-devices': true,
    'bio-logs': true,
    'bio-mapping': true,
    'bio-commands': true,
  });

  React.useEffect(() => {
    setShowAddDevicePage(false);
  }, [subTab]);

  // New Device Form state
  const [newDevice, setNewDevice] = useState<Omit<Device, 'id' | 'status' | 'lastPing'>>({
    name: '',
    serialNumber: '',
    ip: '',
    port: '8080',
    username: 'admin',
    branch: 'San Francisco HQ',
    type: 'Fingerprint Scanner',
    timezone: 'GMT-8 (PST)',
    location: '',
  });
  const [deviceFormError, setDeviceFormError] = useState('');

  // New Mapping Form state
  const [selectedMapEmployee, setSelectedMapEmployee] = useState('');
  const [selectedMapDevice, setSelectedMapDevice] = useState('');
  const [customDeviceToken, setCustomDeviceToken] = useState('');
  const [editingMapping, setEditingMapping] = useState<EmployeeMapping | null>(null);

  // New Command Dialog state
  const [selectedCmdEmployee, setSelectedCmdEmployee] = useState('Elena Rostova');
  const [selectedCmdDevice, setSelectedCmdDevice] = useState('Main Lobby Fingerprint Scanner');
  const [selectedCmdType, setSelectedCmdType] = useState<'Force Sync' | 'Reboot Terminal' | 'Reset Keys' | 'Flash Firmware' | 'Toggle Lock'>('Force Sync');
  const [commandSimulActive, setCommandSimulActive] = useState(false);
  const [simulStatusText, setSimulStatusText] = useState('');

  // Pagination states
  const [devicePage, setDevicePage] = useState(1);
  const [logPage, setLogPage] = useState(1);
  const [mappingPage, setMappingPage] = useState(1);
  const [commandPage, setCommandPage] = useState(1);
  const itemsPerPage = 5;

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ----------------------------------------------------
  // DEVICES LOGIC & INTERACTION
  // ----------------------------------------------------
  const handleSortDevices = (field: 'name' | 'branch' | 'status') => {
    if (deviceSortField === field) {
      setDeviceSortOrder(deviceSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setDeviceSortField(field);
      setDeviceSortOrder('asc');
    }
  };

  const filteredDevices = useMemo(() => {
    return devices.filter(dev => {
      const matchSearch = dev.name.toLowerCase().includes(deviceSearch.toLowerCase()) || 
                          dev.serialNumber.toLowerCase().includes(deviceSearch.toLowerCase()) || 
                          dev.ip.toLowerCase().includes(deviceSearch.toLowerCase());
      return matchSearch;
    }).sort((a, b) => {
      let comparison = 0;
      if (a[deviceSortField] < b[deviceSortField]) comparison = -1;
      if (a[deviceSortField] > b[deviceSortField]) comparison = 1;
      return deviceSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [devices, deviceSearch, deviceSortField, deviceSortOrder]);

  const paginatedDevices = useMemo(() => {
    const startIndex = (devicePage - 1) * itemsPerPage;
    return filteredDevices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDevices, devicePage]);

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.name || !newDevice.serialNumber || !newDevice.ip || !newDevice.location) {
      setDeviceFormError('Please fill out all required fields marked with an asterisk (*).');
      return;
    }
    // IP Address simple Validation
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(newDevice.ip)) {
      setDeviceFormError('Please enter a valid IP address (e.g. 192.168.1.15).');
      return;
    }

    const created: Device = {
      ...newDevice,
      id: `DEV-0${devices.length + 1}`,
      status: 'Online',
      lastPing: 'Just Now',
    };

    setDevices([created, ...devices]);
    setNewDevice({
      name: '',
      serialNumber: '',
      ip: '',
      port: '8080',
      username: 'admin',
      branch: 'San Francisco HQ',
      type: 'Fingerprint Scanner',
      timezone: 'GMT-8 (PST)',
      location: '',
    });
    setDeviceFormError('');
    setShowAddDevicePage(false);
    showToast(`Device "${created.name}" configured successfully!`);
  };

  const handleDeleteDevice = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove device "${name}"? This will unlink mapped employees.`)) {
      setDevices(devices.filter(d => d.id !== id));
      showToast(`Device "${name}" has been deleted.`);
    }
  };

  const handlePushEmployees = () => {
    showToast("Broadcasting credentials payload... Employees successfully synchronized with all active terminals.");
  };

  // ----------------------------------------------------
  // ATTENDANCE LOGS LOGIC & INTERACTION
  // ----------------------------------------------------
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = log.employeeName.toLowerCase().includes(logSearch.toLowerCase()) || 
                          log.deviceName.toLowerCase().includes(logSearch.toLowerCase());
      const matchEmployee = logEmployeeFilter === '' || log.employeeName === logEmployeeFilter;
      
      let matchMonth = true;
      if (logMonthFilter) {
        matchMonth = log.date.split('-')[1] === logMonthFilter;
      }
      let matchYear = true;
      if (logYearFilter) {
        matchYear = log.date.split('-')[0] === logYearFilter;
      }

      let matchRange = true;
      if (logDateRangeStart && logDateRangeEnd) {
        const d = new Date(log.date);
        const start = new Date(logDateRangeStart);
        const end = new Date(logDateRangeEnd);
        matchRange = d >= start && d <= end;
      }

      return matchSearch && matchEmployee && matchMonth && matchYear && matchRange;
    });
  }, [logs, logSearch, logEmployeeFilter, logMonthFilter, logYearFilter, logDateRangeStart, logDateRangeEnd]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (logPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, logPage]);

  const handleExportLogs = () => {
    const headers = 'Log ID,Employee Name,Device,Status,Timestamp,Date\n';
    const rows = filteredLogs.map(l => `${l.id},"${l.employeeName}","${l.deviceName}",${l.status},${l.timestamp},${l.date}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Attendance_Biometric_Logs_${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
    showToast("CSV Attendance logs report generated successfully!");
  };

  // ----------------------------------------------------
  // EMPLOYEES MAPPING LOGIC & INTERACTION
  // ----------------------------------------------------
  const filteredMappings = useMemo(() => {
    return mappings.filter(map => {
      const matchSearch = map.employeeName.toLowerCase().includes(mappingSearch.toLowerCase()) ||
                          map.deviceToken.toLowerCase().includes(mappingSearch.toLowerCase()) ||
                          map.department.toLowerCase().includes(mappingSearch.toLowerCase());
      const matchStatus = mappingStatusFilter === '' || map.calibrationStatus === mappingStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [mappings, mappingSearch, mappingStatusFilter]);

  const paginatedMappings = useMemo(() => {
    const startIndex = (mappingPage - 1) * itemsPerPage;
    return filteredMappings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMappings, mappingPage]);

  const handleOpenAddMapping = () => {
    setEditingMapping(null);
    setSelectedMapEmployee('Zara Khan');
    setSelectedMapDevice('Main Lobby Fingerprint Scanner');
    setCustomDeviceToken(`TOK-ZARA-${Math.floor(10000 + Math.random() * 90000)}`);
    setShowMappingModal(true);
  };

  const handleOpenEditMapping = (map: EmployeeMapping) => {
    setEditingMapping(map);
    setSelectedMapEmployee(map.employeeName);
    setSelectedMapDevice(map.mappedDevices[0] || 'Main Lobby Fingerprint Scanner');
    setCustomDeviceToken(map.deviceToken);
    setShowMappingModal(true);
  };

  const handleSaveMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMapping) {
      // Edit
      setMappings(mappings.map(m => {
        if (m.employeeId === editingMapping.employeeId) {
          return {
            ...m,
            deviceToken: customDeviceToken,
            mappedDevices: [selectedMapDevice],
            calibrationStatus: 'Calibrated',
            lastSynced: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return m;
      }));
      showToast(`Mapping for ${selectedMapEmployee} updated successfully.`);
    } else {
      // Add
      const employee = INITIAL_MAPPINGS.find(im => im.employeeName === selectedMapEmployee);
      if (!employee) return;
      
      const newMap: EmployeeMapping = {
        employeeId: employee.employeeId,
        employeeName: selectedMapEmployee,
        avatar: employee.avatar,
        department: employee.department,
        deviceToken: customDeviceToken,
        mappedDevices: [selectedMapDevice],
        calibrationStatus: 'Calibrated',
        lastSynced: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };

      setMappings([newMap, ...mappings.filter(m => m.employeeName !== selectedMapEmployee)]);
      showToast(`Biometric credentials mapped for ${selectedMapEmployee}!`);
    }
    setShowMappingModal(false);
  };

  const handleDeleteMapping = (employeeId: string, name: string) => {
    if (confirm(`Are you sure you want to clear biometric mapping for ${name}?`)) {
      setMappings(mappings.map(m => {
        if (m.employeeId === employeeId) {
          return {
            ...m,
            mappedDevices: [],
            deviceToken: 'Unassigned',
            calibrationStatus: 'Pending Setup',
            lastSynced: 'Never',
          };
        }
        return m;
      }));
      showToast(`Cleared mappings for ${name}.`);
    }
  };

  const handleSyncMapping = (employeeName: string) => {
    showToast(`Requesting device mapping synchronization payload for "${employeeName}"... Done!`);
  };

  // ----------------------------------------------------
  // COMMANDS LOGIC & INTERACTION
  // ----------------------------------------------------
  const commandCounts = useMemo(() => {
    return {
      pending: commands.filter(c => c.status === 'Pending').length,
      sent: commands.filter(c => c.status === 'Sent').length,
      executed: commands.filter(c => c.status === 'Executed').length,
      failed: commands.filter(c => c.status === 'Failed').length,
    };
  }, [commands]);

  const filteredCommands = useMemo(() => {
    return commands.filter(cmd => {
      const matchSearch = cmd.employeeName.toLowerCase().includes(commandSearch.toLowerCase()) ||
                          cmd.deviceName.toLowerCase().includes(commandSearch.toLowerCase()) ||
                          cmd.type.toLowerCase().includes(commandSearch.toLowerCase());
      const matchStatus = commandStatusFilter === '' || cmd.status === commandStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [commands, commandSearch, commandStatusFilter]);

  const paginatedCommands = useMemo(() => {
    const startIndex = (commandPage - 1) * itemsPerPage;
    return filteredCommands.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCommands, commandPage]);

  const triggerExecuteCommandSimul = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCommandModal(false);
    setCommandSimulActive(true);
    setSimulStatusText("1. Initializing handshake with target terminal socket...");
    
    setTimeout(() => {
      setSimulStatusText("2. Packaging cryptographic device mapping payload...");
    }, 1200);

    setTimeout(() => {
      setSimulStatusText(`3. Transmitting command type "${selectedCmdType}" to "${selectedCmdDevice}"...`);
    }, 2400);

    setTimeout(() => {
      // Add the executed command log
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 10);
      const isFailed = selectedCmdDevice.includes('Warehouse RFID'); // Simulate failed on offline devices
      
      const newCmd: Command = {
        id: `CMD-${Math.floor(100 + Math.random() * 900)}`,
        employeeName: selectedCmdEmployee,
        deviceName: selectedCmdDevice,
        type: selectedCmdType,
        status: isFailed ? 'Failed' : 'Executed',
        created: `${dateStr} ${timeStr}`,
        sent: timeStr,
        executed: isFailed ? undefined : timeStr,
        failed: isFailed ? timeStr : undefined,
      };

      setCommands([newCmd, ...commands]);
      setCommandSimulActive(false);
      showToast(isFailed ? `Failed executing "${selectedCmdType}" command.` : `Successfully executed "${selectedCmdType}" command!`);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Toast System */}
      {toastMessage && (
        <div id="biometric-toast" className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold py-3 px-5 rounded-xl border border-slate-700 flex items-center gap-2.5 shadow-2xl animate-fade-in">
          <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400/20" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Fingerprint className="h-6 w-6 text-indigo-600 animate-pulse" />
            <span className="capitalize">
              {subTab === 'bio-devices' ? 'Hardware Terminal Settings' : 
               subTab === 'bio-logs' ? 'Biometric Attendance Registry' : 
               subTab === 'bio-mapping' ? 'Employee Token Mappings' : 'Device Command Pipeline'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {subTab === 'bio-devices' ? 'Configure, test, and register biometric physical terminal scanners.' :
             subTab === 'bio-logs' ? 'Review daily employee check-ins sourced directly from active terminal streams.' :
             subTab === 'bio-mapping' ? 'Associate staff members with unique device credentials and calibrate biometric keys.' :
             'Trigger network commands, recalibrate sensors, or push remote firmware payloads.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasOpenedList[subTab] && (
            <>
              {subTab === 'bio-devices' && !showAddDevicePage && (
                <>
                  <button
                    id="btn-sync-devices"
                    onClick={handlePushEmployees}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all border border-slate-200"
                  >
                    <RefreshCw className="h-4 w-4 text-slate-500" />
                    <span>Sync All Terminals</span>
                  </button>
                  <button
                    id="btn-add-device-view"
                    onClick={() => setShowAddDevicePage(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Configure New Device</span>
                  </button>
                </>
              )}

              {subTab === 'bio-logs' && (
                <button
                  id="btn-export-logs"
                  onClick={handleExportLogs}
                  className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="h-4 w-4 text-slate-300" />
                  <span>Export CSV Logs</span>
                </button>
              )}

              {subTab === 'bio-mapping' && (
                <button
                  id="btn-add-mapping"
                  onClick={handleOpenAddMapping}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Biometric Mapping</span>
                </button>
              )}

              {subTab === 'bio-commands' && (
                <button
                  id="btn-execute-cmd-trigger"
                  onClick={() => setShowCommandModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10 transition-all"
                >
                  <Play className="h-4 w-4" />
                  <span>Dispatch Device Command</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* LANDING SCREEN (If list is not opened and forms are closed) */}
      {/* ========================================================= */}
      {!hasOpenedList[subTab] && !showAddDevicePage && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm my-8 space-y-6 animate-fade-in">
          {/* Branded Icon Frame */}
          <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
            <Fingerprint className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {subTab === 'bio-devices' && 'Hardware Terminal Configuration'}
              {subTab === 'bio-logs' && 'Biometric Attendance Logging Stream'}
              {subTab === 'bio-mapping' && 'Register Employee Token Mappings'}
              {subTab === 'bio-commands' && 'Device Command Execution Pipeline'}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              {subTab === 'bio-devices' && 'Register, calibrate, and oversee physical fingerprint readers, retinal locks, and security terminals. Ensure synchronization across all office locations.'}
              {subTab === 'bio-logs' && 'Query, search, and audit raw employee check-in sequences parsed directly from authorized gate readers and terminal networks.'}
              {subTab === 'bio-mapping' && 'Securely map personnel files onto hardware access credentials. Calibrate biometric sensor profiles and register local verification tokens.'}
              {subTab === 'bio-commands' && 'Broadcast remote recalibration requests, perform terminal reboots, flush credential tables, and transmit firmware payloads.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setHasOpenedList(prev => ({ ...prev, [subTab]: true }));
                if (subTab === 'bio-devices') {
                  setShowAddDevicePage(true);
                } else if (subTab === 'bio-logs') {
                  showToast("Pulling and parsing active streams...");
                } else if (subTab === 'bio-mapping') {
                  handleOpenAddMapping();
                } else if (subTab === 'bio-commands') {
                  setShowCommandModal(true);
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>
                {subTab === 'bio-devices' && 'Configure New Device'}
                {subTab === 'bio-logs' && 'Trigger Logs Pull'}
                {subTab === 'bio-mapping' && 'Register Biometric Mapping'}
                {subTab === 'bio-commands' && 'Dispatch Device Command'}
              </span>
            </button>
            <button
              onClick={() => {
                setHasOpenedList(prev => ({ ...prev, [subTab]: true }));
              }}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold px-6 py-3 rounded-lg border border-slate-200 transition-all cursor-pointer w-full sm:w-auto"
            >
              Go to General Page
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 1: DEVICES VIEW & ADD PAGE
          ---------------------------------------------------- */}
      {subTab === 'bio-devices' && (hasOpenedList[subTab] || showAddDevicePage) && (
        <div className="space-y-6 animate-fade-in">
          {showAddDevicePage ? (
            /* ADD DEVICE SUB-PAGE */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900">Add New Physical Terminal Device</h3>
                  <p className="text-xs text-slate-400">Map a new biometric hardware terminal onto the central Worksuite hub.</p>
                </div>

                {deviceFormError && (
                  <div className="bg-rose-50 text-rose-800 text-xs p-3.5 rounded-xl border border-rose-100 flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    <span>{deviceFormError}</span>
                  </div>
                )}

                <form onSubmit={handleAddDeviceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Device Name *</label>
                      <input 
                        type="text" required
                        placeholder="e.g. Main Lobby Fingerprint Scanner"
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Serial Number / UID *</label>
                      <input 
                        type="text" required
                        placeholder="e.g. FP-99214-X8"
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                        value={newDevice.serialNumber}
                        onChange={(e) => setNewDevice({...newDevice, serialNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Device IP Address *</label>
                      <input 
                        type="text" required
                        placeholder="e.g. 192.168.1.104"
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                        value={newDevice.ip}
                        onChange={(e) => setNewDevice({...newDevice, ip: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Port *</label>
                      <input 
                        type="text" required
                        placeholder="e.g. 8080"
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                        value={newDevice.port}
                        onChange={(e) => setNewDevice({...newDevice, port: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Device Type *</label>
                      <select 
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                        value={newDevice.type}
                        onChange={(e) => setNewDevice({...newDevice, type: e.target.value as any})}
                      >
                        <option value="Fingerprint Scanner">Fingerprint Scanner</option>
                        <option value="Retinal Reader">Retinal Reader</option>
                        <option value="RFID Gate">RFID Gate</option>
                        <option value="Facial Recognizer">Facial Recognizer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Device Admin Username</label>
                      <input 
                        type="text"
                        placeholder="admin"
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                        value={newDevice.username}
                        onChange={(e) => setNewDevice({...newDevice, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Assign To Corporate Branch</label>
                      <select 
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                        value={newDevice.branch}
                        onChange={(e) => setNewDevice({...newDevice, branch: e.target.value})}
                      >
                        <option value="San Francisco HQ">San Francisco HQ</option>
                        <option value="Oakland Logistics">Oakland Logistics</option>
                        <option value="Bangalore R&D Office">Bangalore R&D Office</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Physical Location Description *</label>
                      <input 
                        type="text" required
                        placeholder="e.g. Lobby Entrance Floor 1, Main Glass Door"
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                        value={newDevice.location}
                        onChange={(e) => setNewDevice({...newDevice, location: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Terminal Timezone</label>
                      <select 
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                        value={newDevice.timezone}
                        onChange={(e) => setNewDevice({...newDevice, timezone: e.target.value})}
                      >
                        <option value="GMT-8 (PST)">GMT-8 (PST)</option>
                        <option value="GMT+5:30 (IST)">GMT+5:30 (IST)</option>
                        <option value="GMT+8 (SGT)">GMT+8 (SGT)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddDevicePage(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel Setup
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/15"
                    >
                      Save and Secure Device
                    </button>
                  </div>
                </form>
              </div>

              {/* SIDEBAR INSTRUCTIONAL CARD */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Info className="h-4.5 w-4.5 text-indigo-500" />
                  <span>Setup Requirements</span>
                </h4>
                <div className="space-y-3.5 text-xs text-slate-600">
                  <p>In order for the Worksuite hub to query hardware handshake transactions:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>The scanner must be on a static WAN/LAN IP routing profile.</li>
                    <li>Firewall rules must bind incoming handshakes on selected ports.</li>
                    <li>Ensure <strong>SSL handshakes</strong> are enabled on device parameters if routing through external DNS proxies.</li>
                  </ul>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="font-mono text-[10px] text-slate-600">Firmware validated for G3 & G4 chipsets.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* MAIN DEVICES LISTING SCREEN */
            <div className="space-y-6">
              {/* Devices filters and configuration guide */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                {/* Expandable Configuration Guide */}
                <div className="border-b border-slate-100 pb-3 mb-3">
                  <button 
                    onClick={() => setIsGuideExpanded(!isGuideExpanded)}
                    className="w-full flex items-center justify-between text-left cursor-pointer hover:opacity-80"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-indigo-500" />
                      <span className="text-xs font-bold text-slate-800">Biometric Terminal Configuration Guide</span>
                    </div>
                    {isGuideExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </button>
                  {isGuideExpanded && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-fade-in">
                      <div className="space-y-1">
                        <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-4 h-4 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                          <span>Bind IP & Username</span>
                        </h5>
                        <p className="text-slate-500 text-[11px] pl-5">Configure static address IP on terminal gate, binding login token credentials.</p>
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-4 h-4 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                          <span>Sync Tokens</span>
                        </h5>
                        <p className="text-slate-500 text-[11px] pl-5">Navigate to <strong>Employees Mapping</strong> to bind biometric keys onto scanned records.</p>
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-4 h-4 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                          <span>Simulate Pipeline</span>
                        </h5>
                        <p className="text-slate-500 text-[11px] pl-5">Deploy quick commands or reboot gates directly via <strong>Device Commands</strong>.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search devices name, serial, or IP..."
                      className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                      value={deviceSearch}
                      onChange={(e) => { setDeviceSearch(e.target.value); setDevicePage(1); }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Sliders className="h-4.5 w-4.5 text-slate-400" />
                    <span>Sort By:</span>
                    <button 
                      onClick={() => handleSortDevices('name')}
                      className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${deviceSortField === 'name' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      Device Name
                    </button>
                    <button 
                      onClick={() => handleSortDevices('branch')}
                      className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${deviceSortField === 'branch' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      Branch
                    </button>
                    <button 
                      onClick={() => handleSortDevices('status')}
                      className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${deviceSortField === 'status' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      Status
                    </button>
                  </div>
                </div>
              </div>

              {filteredDevices.length === 0 ? (
                /* EMPTY STATE DEVICE TABLE */
                <div id="devices-empty-state" className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                    <Fingerprint className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className="text-base font-bold text-slate-900">No Physical Devices Registered</h4>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed">Ensure physical gate readers or biometric scanners are configured with correct IP parameters.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddDevicePage(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    Register Your First Device
                  </button>
                </div>
              ) : (
                /* COMPACT GRID DEVICES CARD */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedDevices.map(dev => (
                      <div key={dev.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 hover:border-indigo-400 transition-all group relative">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[9px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">{dev.id}</span>
                              <span className="text-[10px] text-slate-500 font-bold uppercase">{dev.type}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{dev.name}</h4>
                            <p className="text-xs text-slate-400 font-medium">Serial: <span className="font-mono">{dev.serialNumber}</span></p>
                          </div>
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide leading-none ${
                            dev.status === 'Online' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {dev.status}
                          </span>
                        </div>

                        <div className="bg-slate-50 rounded-xl border border-slate-100/80 p-3 space-y-1.5 font-mono text-[11px] text-slate-600">
                          <div className="flex justify-between">
                            <span>Host Address:</span>
                            <span className="font-bold text-slate-800">{dev.ip}:{dev.port}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>HQ Location:</span>
                            <span className="text-slate-500 truncate max-w-[150px]" title={dev.location}>{dev.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Branch:</span>
                            <span className="text-slate-500">{dev.branch}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Handshake:</span>
                            <span className="text-slate-500">{dev.lastPing}</span>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                          <button 
                            onClick={() => {
                              showToast(`Requested handshake echo to ${dev.ip}... OK!`);
                            }}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Test Connection"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDevice(dev.id, dev.name)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                            title="Delete Terminal"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Footer */}
                  {filteredDevices.length > itemsPerPage && (
                    <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-bold text-slate-500">
                      <span>Showing {((devicePage - 1) * itemsPerPage) + 1} - {Math.min(devicePage * itemsPerPage, filteredDevices.length)} of {filteredDevices.length} Devices</span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          disabled={devicePage === 1}
                          onClick={() => setDevicePage(devicePage - 1)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Prev
                        </button>
                        <button 
                          disabled={devicePage * itemsPerPage >= filteredDevices.length}
                          onClick={() => setDevicePage(devicePage + 1)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: ATTENDANCE REGISTER LOGS
          ---------------------------------------------------- */}
      {subTab === 'bio-logs' && hasOpenedList[subTab] && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 animate-fade-in">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Search Keyword</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Employee name, device..."
                  className="w-full bg-white text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                  value={logSearch}
                  onChange={(e) => { setLogSearch(e.target.value); setLogPage(1); }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Employee Filter</label>
              <select 
                className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                value={logEmployeeFilter}
                onChange={(e) => { setLogEmployeeFilter(e.target.value); setLogPage(1); }}
              >
                <option value="">All Employees</option>
                <option value="Elena Rostova">Elena Rostova</option>
                <option value="James Carter">James Carter</option>
                <option value="Daniel Park">Daniel Park</option>
                <option value="Zara Khan">Zara Khan</option>
                <option value="Aria Montgomery">Aria Montgomery</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Month</label>
                <select 
                  className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold font-mono"
                  value={logMonthFilter}
                  onChange={(e) => { setLogMonthFilter(e.target.value); setLogPage(1); }}
                >
                  <option value="">All</option>
                  <option value="01">01 Jan</option>
                  <option value="02">02 Feb</option>
                  <option value="03">03 Mar</option>
                  <option value="04">04 Apr</option>
                  <option value="05">05 May</option>
                  <option value="06">06 Jun</option>
                  <option value="07">07 Jul</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Year</label>
                <select 
                  className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold font-mono"
                  value={logYearFilter}
                  onChange={(e) => { setLogYearFilter(e.target.value); setLogPage(1); }}
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Start Date</label>
              <input 
                type="date"
                className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold font-mono"
                value={logDateRangeStart}
                onChange={(e) => { setLogDateRangeStart(e.target.value); setLogPage(1); }}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">End Date</label>
              <input 
                type="date"
                className="w-full bg-white text-slate-800 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold font-mono"
                value={logDateRangeEnd}
                onChange={(e) => { setLogDateRangeEnd(e.target.value); setLogPage(1); }}
              />
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-3.5">Log ID</th>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Terminal Source</th>
                  <th className="px-6 py-3.5">Event Transaction</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic font-semibold">No logs match your filter options.</td>
                  </tr>
                ) : (
                  paginatedLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/40">
                      <td className="px-6 py-4 font-bold text-slate-900 font-mono">{log.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={log.avatar} alt={log.employeeName} className="w-8 h-8 rounded-full border border-slate-100 object-cover" />
                          <div>
                            <p className="font-bold text-slate-850 leading-none">{log.employeeName}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">{log.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600 flex items-center gap-1.5 mt-2">
                        <Fingerprint className="h-4 w-4 text-indigo-500" />
                        <span>{log.deviceName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status.includes('Denied') 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${log.status.includes('Denied') ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono">
                        <span className="font-bold text-slate-750">{log.date}</span> @ <span className="text-slate-400 font-medium">{log.timestamp}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredLogs.length > itemsPerPage && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
              <span>Showing {((logPage - 1) * itemsPerPage) + 1} - {Math.min(logPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} Log events</span>
              <div className="flex items-center gap-1.5">
                <button 
                  disabled={logPage === 1}
                  onClick={() => setLogPage(logPage - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button 
                  disabled={logPage * itemsPerPage >= filteredLogs.length}
                  onClick={() => setLogPage(logPage + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: EMPLOYEES MAPPING
          ---------------------------------------------------- */}
      {subTab === 'bio-mapping' && hasOpenedList[subTab] && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search staff mappings..."
                className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                value={mappingSearch}
                onChange={(e) => { setMappingSearch(e.target.value); setMappingPage(1); }}
              />
            </div>

            <div>
              <select 
                className="bg-slate-50 text-slate-800 text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                value={mappingStatusFilter}
                onChange={(e) => { setMappingStatusFilter(e.target.value); setMappingPage(1); }}
              >
                <option value="">All Calibration Status</option>
                <option value="Calibrated">Calibrated (2FA Active)</option>
                <option value="Pending Setup">Pending Setup</option>
                <option value="Recalibration Needed">Recalibration Needed</option>
              </select>
            </div>
          </div>

          {/* Mapping Grid or Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-3.5">Staff Employee</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Device Handshake Token</th>
                  <th className="px-6 py-3.5">Mapped Terminals</th>
                  <th className="px-6 py-3.5">Calibration Check</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedMappings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic font-semibold">No mappings found.</td>
                  </tr>
                ) : (
                  paginatedMappings.map(map => (
                    <tr key={map.employeeId} className="hover:bg-slate-50/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={map.avatar} alt={map.employeeName} className="w-8 h-8 rounded-full border border-slate-100 object-cover" />
                          <div>
                            <p className="font-bold text-slate-900 leading-none">{map.employeeName}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {map.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-indigo-600 font-bold">{map.department}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-slate-50 border border-slate-100 rounded px-2 py-1 text-slate-500 select-all font-bold">
                          {map.deviceToken}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        {map.mappedDevices.length === 0 ? (
                          <span className="text-slate-400 italic">No mapped terminals</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {map.mappedDevices.map((devName, i) => (
                              <span key={i} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-semibold border border-slate-200/50">
                                {devName}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide leading-none ${
                          map.calibrationStatus === 'Calibrated' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          map.calibrationStatus === 'Pending Setup' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            map.calibrationStatus === 'Calibrated' ? 'bg-emerald-500' :
                            map.calibrationStatus === 'Pending Setup' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          <span>{map.calibrationStatus}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleSyncMapping(map.employeeName)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Force Re-Sync Credentials"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEditMapping(map)}
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                            title="Modify Mapping"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            disabled={map.deviceToken === 'Unassigned'}
                            onClick={() => handleDeleteMapping(map.employeeId, map.employeeName)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-600 hover:text-rose-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title="De-register credentials"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredMappings.length > itemsPerPage && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
              <span>Showing {((mappingPage - 1) * itemsPerPage) + 1} - {Math.min(mappingPage * itemsPerPage, filteredMappings.length)} of {filteredMappings.length} Records</span>
              <div className="flex items-center gap-1.5">
                <button 
                  disabled={mappingPage === 1}
                  onClick={() => setMappingPage(mappingPage - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button 
                  disabled={mappingPage * itemsPerPage >= filteredMappings.length}
                  onClick={() => setMappingPage(mappingPage + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* MAPPING EDIT/ADD MODAL */}
          {showMappingModal && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">{editingMapping ? 'Edit Biometric Linkage' : 'Map Employee Handshake'}</h3>
                  <p className="text-xs text-slate-400">Establish cryptographically signed hardware keys mapped to staff records.</p>
                </div>

                <form onSubmit={handleSaveMapping} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Select Corporate Employee *</label>
                    <select 
                      disabled={!!editingMapping}
                      className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                      value={selectedMapEmployee}
                      onChange={(e) => setSelectedMapEmployee(e.target.value)}
                    >
                      <option value="Zara Khan">Zara Khan (HR Lead)</option>
                      <option value="Daniel Park">Daniel Park (QA Specialist)</option>
                      <option value="Elena Rostova">Elena Rostova (Senior Developer)</option>
                      <option value="James Carter">James Carter (UI/UX Designer)</option>
                      <option value="Aria Montgomery">Aria Montgomery (Product Manager)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Target Hardware Terminal *</label>
                    <select 
                      className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                      value={selectedMapDevice}
                      onChange={(e) => setSelectedMapDevice(e.target.value)}
                    >
                      <option value="Main Lobby Fingerprint Scanner">Main Lobby Fingerprint Scanner (DEV-01)</option>
                      <option value="Engineering Door Retinal Gate">Engineering Door Retinal Gate (DEV-02)</option>
                      <option value="Warehouse RFID Security Gate">Warehouse RFID Security Gate (DEV-03)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Biometric Device Key (Cryptographic Token) *</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" required
                        className="flex-1 bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono font-bold"
                        value={customDeviceToken}
                        onChange={(e) => setCustomDeviceToken(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setCustomDeviceToken(`TOK-${selectedMapEmployee.split(' ')[0].toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`)}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                      >
                        Roll
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowMappingModal(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      Save Mapping
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: DEVICE COMMANDS
          ---------------------------------------------------- */}
      {subTab === 'bio-commands' && hasOpenedList[subTab] && (
        <div className="space-y-6 animate-fade-in">
          {/* Status Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending Queue</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{commandCounts.pending} Commands</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Dispatched</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{commandCounts.sent} Sent</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-indigo-600 animate-spin" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Executed Successful</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{commandCounts.executed} Passed</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Failed Logs</span>
                <h3 className="text-xl font-bold text-rose-600 mt-1">{commandCounts.failed} Failed</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Active pipeline simulation notification */}
          {commandSimulActive && (
            <div className="bg-indigo-950 text-indigo-200 p-4 rounded-xl border border-indigo-800 flex items-center gap-3 animate-pulse">
              <RefreshCw className="h-5 w-5 text-indigo-400 animate-spin shrink-0" />
              <div className="text-xs font-semibold">
                <p className="font-bold text-white">Dispatched command is propagating live...</p>
                <p className="font-mono text-[11px] text-indigo-300 mt-0.5">{simulStatusText}</p>
              </div>
            </div>
          )}

          {/* Main Table Screen */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search command log..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                  value={commandSearch}
                  onChange={(e) => { setCommandSearch(e.target.value); setCommandPage(1); }}
                />
              </div>

              <div>
                <select 
                  className="bg-slate-50 text-slate-800 text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  value={commandStatusFilter}
                  onChange={(e) => { setCommandStatusFilter(e.target.value); setCommandPage(1); }}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending Queue</option>
                  <option value="Sent">Sent Pipeline</option>
                  <option value="Executed">Executed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Commands Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Command ID</th>
                    <th className="px-6 py-3.5">Staff / Source</th>
                    <th className="px-6 py-3.5">Device Target</th>
                    <th className="px-6 py-3.5">Instruction Type</th>
                    <th className="px-6 py-3.5">Execution Status</th>
                    <th className="px-6 py-3.5">Log Timestamps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedCommands.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic font-semibold">No commands found.</td>
                    </tr>
                  ) : (
                    paginatedCommands.map(cmd => (
                      <tr key={cmd.id} className="hover:bg-slate-50/40 font-semibold text-slate-700">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{cmd.id}</td>
                        <td className="px-6 py-4">{cmd.employeeName}</td>
                        <td className="px-6 py-4 text-indigo-600">{cmd.deviceName}</td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded font-bold text-slate-500 uppercase">
                            {cmd.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide leading-none ${
                            cmd.status === 'Executed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            cmd.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            cmd.status === 'Sent' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              cmd.status === 'Executed' ? 'bg-emerald-500' :
                              cmd.status === 'Pending' ? 'bg-amber-500' :
                              cmd.status === 'Sent' ? 'bg-indigo-500 animate-pulse' : 'bg-rose-500'
                            }`} />
                            <span>{cmd.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono text-[10px] space-y-1">
                          <p>Created: <span className="text-slate-600 font-medium">{cmd.created}</span></p>
                          {cmd.sent && <p>Sent: <span className="text-slate-600 font-medium">{cmd.sent}</span></p>}
                          {cmd.executed && <p>Executed: <span className="text-slate-600 font-medium">{cmd.executed}</span></p>}
                          {cmd.failed && <p className="text-rose-500 font-bold">Failed: {cmd.failed}</p>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredCommands.length > itemsPerPage && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
                <span>Showing {((commandPage - 1) * itemsPerPage) + 1} - {Math.min(commandPage * itemsPerPage, filteredCommands.length)} of {filteredCommands.length} Logs</span>
                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={commandPage === 1}
                    onClick={() => setCommandPage(commandPage - 1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <button 
                    disabled={commandPage * itemsPerPage >= filteredCommands.length}
                    onClick={() => setCommandPage(commandPage + 1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DISPATCH COMMAND MODAL */}
          {showCommandModal && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">Dispatch Hardware Command</h3>
                  <p className="text-xs text-slate-400">Deploy crypotographically signed commands to connected hardware gates.</p>
                </div>

                <form onSubmit={triggerExecuteCommandSimul} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Target Employee / Context *</label>
                    <select 
                      className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                      value={selectedCmdEmployee}
                      onChange={(e) => setSelectedCmdEmployee(e.target.value)}
                    >
                      <option value="Elena Rostova">Elena Rostova</option>
                      <option value="James Carter">James Carter</option>
                      <option value="Daniel Park">Daniel Park</option>
                      <option value="Zara Khan">Zara Khan</option>
                      <option value="Global Sync">Global Sync (Broadcast)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Select Terminal Receiver *</label>
                    <select 
                      className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                      value={selectedCmdDevice}
                      onChange={(e) => setSelectedCmdDevice(e.target.value)}
                    >
                      <option value="Main Lobby Fingerprint Scanner">Main Lobby Fingerprint Scanner (DEV-01)</option>
                      <option value="Engineering Door Retinal Gate">Engineering Door Retinal Gate (DEV-02)</option>
                      <option value="Warehouse RFID Security Gate">Warehouse RFID Security Gate (DEV-03)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Command Type *</label>
                    <select 
                      className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                      value={selectedCmdType}
                      onChange={(e) => setSelectedCmdType(e.target.value as any)}
                    >
                      <option value="Force Sync">Force Sync Credentials</option>
                      <option value="Reboot Terminal">Reboot Device Gate</option>
                      <option value="Reset Keys">Reset Decryption Keys</option>
                      <option value="Flash Firmware">Push Firmware Over-The-Air</option>
                      <option value="Toggle Lock">Toggle Lock Override</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowCommandModal(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10"
                    >
                      Simulate and Dispatch
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
