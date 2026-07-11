/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, Settings, Plus, RefreshCw, Trash2, Check, X, Shield,
  Search, Users, Key, CheckSquare, Square, ChevronDown, ChevronRight
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  members: number;
  unsyncedUsers: number;
  isDefault: boolean;
}

interface PermissionGroup {
  name: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
    import: boolean;
  };
}

interface RolesPermissionsSettingsProps {
  onNotify: (msg: string) => void;
}

const INITIAL_ROLES: Role[] = [
  { id: '1', name: 'App Administrator', members: 1, unsyncedUsers: 0, isDefault: true },
  { id: '2', name: 'Employee', members: 9, unsyncedUsers: 0, isDefault: true },
  { id: '3', name: 'Client', members: 9, unsyncedUsers: 0, isDefault: true },
  { id: '4', name: 'Manager', members: 0, unsyncedUsers: 0, isDefault: false }
];

const PERMISSION_GROUPS = [
  'Dashboard', 'HR', 'Projects', 'Tasks', 'Finance', 'Clients', 
  'Leads', 'Tickets', 'Assets', 'Messages', 'Reports', 'Knowledge Base'
];

export default function RolesPermissionsSettings({ onNotify }: RolesPermissionsSettingsProps) {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role>(INITIAL_ROLES[1]); // Default to Employee for active edit
  const [searchPermission, setSearchPermission] = useState('');
  
  // Modals
  const [isManageRolesOpen, setIsManageRolesOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [importFromRole, setImportFromRole] = useState('');

  // Matrix of active permission states (grouped by group name and action)
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const initialState: Record<string, Record<string, boolean>> = {};
    PERMISSION_GROUPS.forEach(group => {
      initialState[group] = {
        view: true,
        create: group !== 'Dashboard' && group !== 'Reports',
        edit: group !== 'Dashboard' && group !== 'Reports',
        delete: false,
        export: group === 'Finance' || group === 'Leads',
        import: false
      };
    });
    return initialState;
  });

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      onNotify('Role name is required.');
      return;
    }

    const isDuplicate = roles.some(r => r.name.toLowerCase() === newRoleName.trim().toLowerCase());
    if (isDuplicate) {
      onNotify(`Role name "${newRoleName}" already exists.`);
      return;
    }

    const newRole: Role = {
      id: Date.now().toString(),
      name: newRoleName.trim(),
      members: 0,
      unsyncedUsers: 0,
      isDefault: false
    };

    setRoles(prev => [...prev, newRole]);
    onNotify(`Role "${newRoleName}" created successfully.`);
    setNewRoleName('');
    setImportFromRole('');
  };

  const handleDeleteRole = (id: string) => {
    const roleToDelete = roles.find(r => r.id === id);
    if (roleToDelete?.isDefault) {
      onNotify('Default role cannot be deleted.');
      return;
    }
    setRoles(prev => prev.filter(r => r.id !== id));
    if (roleToDelete) {
      onNotify(`Role "${roleToDelete.name}" deleted successfully.`);
    }
    if (selectedRole.id === id) {
      setSelectedRole(roles[1]); // Default back to Employee
    }
  };

  const handleResetPermissions = (roleName: string) => {
    onNotify(`Permissions reset to standard layout for ${roleName}.`);
  };

  const handleTogglePermission = (group: string, action: string) => {
    if (selectedRole.name === 'App Administrator') return; // Cannot modify admin
    
    setPermissions(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [action]: !prev[group][action]
      }
    }));
  };

  const handleSelectAllForGroup = (group: string, selectAll: boolean) => {
    if (selectedRole.name === 'App Administrator') return;
    setPermissions(prev => ({
      ...prev,
      [group]: {
        view: selectAll,
        create: selectAll,
        edit: selectAll,
        delete: selectAll,
        export: selectAll,
        import: selectAll
      }
    }));
  };

  const handleBulkToggleAll = (select: boolean) => {
    if (selectedRole.name === 'App Administrator') return;
    const nextPermissions = { ...permissions };
    Object.keys(nextPermissions).forEach(group => {
      nextPermissions[group] = {
        view: select,
        create: select,
        edit: select,
        delete: select,
        export: select,
        import: select
      };
    });
    setPermissions(nextPermissions);
    onNotify(select ? 'All permissions enabled.' : 'All permissions cleared.');
  };

  const handleSavePermissions = () => {
    onNotify(`Permissions updated for role: ${selectedRole.name}`);
  };

  const filteredGroups = PERMISSION_GROUPS.filter(g => 
    g.toLowerCase().includes(searchPermission.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner and Manage roles button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600" />
            <span>Roles & Permissions</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure enterprise access control matrices and page permission limits.
          </p>
        </div>
        <button
          onClick={() => setIsManageRolesOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Settings className="h-4 w-4" />
          <span>Manage Roles</span>
        </button>
      </div>

      {/* Role Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {roles.map((role) => {
          const isActive = selectedRole.id === role.id;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`border rounded-2xl p-5 space-y-4 cursor-pointer transition-all ${
                isActive 
                  ? 'bg-indigo-50/40 border-indigo-500 shadow-sm' 
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-3xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                  <Shield className="h-5 w-5" />
                </div>
                {role.isDefault && (
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black uppercase">
                    System Default
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-900">{role.name}</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{role.members} Member{role.members !== 1 && 's'}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                {role.name === 'App Administrator' ? (
                  <span className="text-[10px] text-slate-400 font-semibold italic">
                    Permissions cannot be modified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRole(role);
                    }}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-3xs' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Permissions Matrix
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Settings Matrix Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
        {/* Module Header */}
        <div className="p-5 border-b border-slate-150 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="h-4 w-4 text-indigo-600" />
              <span>Permission Matrix ({selectedRole.name})</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Specify feature accessibility limits below. Admin has full override rights automatically.
            </p>
          </div>

          {selectedRole.name !== 'App Administrator' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkToggleAll(true)}
                className="text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Select All
              </button>
              <button
                onClick={() => handleBulkToggleAll(false)}
                className="text-[11px] font-bold text-slate-500 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Search bar inside Matrix */}
        <div className="p-4 border-b border-slate-100 bg-white flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search permission groups..."
              value={searchPermission}
              onChange={(e) => setSearchPermission(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white placeholder-slate-400 font-semibold transition-all"
            />
          </div>
        </div>

        {/* Permission Groups Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                <th className="px-6 py-3.5 w-60">Module Scope</th>
                <th className="px-6 py-3.5 text-center">View</th>
                <th className="px-6 py-3.5 text-center">Create</th>
                <th className="px-6 py-3.5 text-center">Edit</th>
                <th className="px-6 py-3.5 text-center">Delete</th>
                <th className="px-6 py-3.5 text-center">Export</th>
                <th className="px-6 py-3.5 text-center">Import</th>
                <th className="px-6 py-3.5 text-right">Quick Select</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
              {filteredGroups.map((group) => {
                const isAllSelected = 
                  permissions[group]?.view && 
                  permissions[group]?.create && 
                  permissions[group]?.edit && 
                  permissions[group]?.delete && 
                  permissions[group]?.export && 
                  permissions[group]?.import;

                return (
                  <tr key={group} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-900 font-bold flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-slate-400" />
                      <span>{group}</span>
                    </td>
                    {['view', 'create', 'edit', 'delete', 'export', 'import'].map((action) => {
                      const isActive = permissions[group]?.[action] || false;
                      const isDisabled = selectedRole.name === 'App Administrator';
                      return (
                        <td key={action} className="px-6 py-4 text-center">
                          <button
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleTogglePermission(group, action)}
                            className={`p-1 rounded cursor-pointer ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            {isActive ? (
                              <CheckSquare className="h-4 w-4 text-indigo-600 mx-auto" />
                            ) : (
                              <Square className="h-4 w-4 text-slate-300 hover:text-slate-400 mx-auto" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-right">
                      {selectedRole.name !== 'App Administrator' ? (
                        <button
                          type="button"
                          onClick={() => handleSelectAllForGroup(group, !isAllSelected)}
                          className="text-[10px] text-indigo-600 hover:underline font-black cursor-pointer"
                        >
                          {isAllSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Locked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Matrix Action Panel */}
        {selectedRole.name !== 'App Administrator' && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-2">
            <button
              onClick={() => onNotify('Permissions changes reverted.')}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleSavePermissions}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Permission Settings
            </button>
          </div>
        )}
      </div>

      {/* Manage Roles Dialog */}
      {isManageRolesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-sm font-black text-slate-900">Manage Roles</h4>
              <button onClick={() => setIsManageRolesOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Table of active roles */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-12">#</th>
                      <th className="p-3">User Role</th>
                      <th className="p-3">Unsynced Users</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {roles.map((role, idx) => (
                      <tr key={role.id}>
                        <td className="p-3 text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">{role.name}</td>
                        <td className="p-3">
                          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                            {role.unsyncedUsers} Unsynced
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {role.isDefault ? (
                            <div className="flex justify-end items-center gap-2">
                              <span className="text-[10px] text-slate-400 italic font-medium">Default role</span>
                              {role.name !== 'App Administrator' && (
                                <button
                                  onClick={() => handleResetPermissions(role.name)}
                                  className="text-[10px] bg-slate-100 text-slate-600 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-bold inline-flex items-center gap-1"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  <span>Reset Permissions</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-[10px] bg-rose-50 text-rose-600 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-bold inline-flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Delete</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Role Bottom Form */}
              <form onSubmit={handleCreateRole} className="pt-4 border-t border-slate-150 space-y-4">
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">Create Custom Role</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Role Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 block font-black">Role Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. HR Representative"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Import from existing */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 block font-black">Import Permissions From</label>
                    <select
                      value={importFromRole}
                      onChange={(e) => setImportFromRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">-- Don't Import (Empty) --</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsManageRolesOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Save Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
