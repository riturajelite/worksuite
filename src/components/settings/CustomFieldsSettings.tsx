/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, Search, Trash2, Edit2, ShieldAlert, FileText, Settings, Layers,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, X
} from 'lucide-react';

interface CustomField {
  id: string;
  label: string;
  module: string;
  type: string;
  required: boolean;
  showInTable: boolean;
  allowExport: boolean;
  createdDate: string;
}

interface CustomFieldsSettingsProps {
  onNotify: (msg: string) => void;
}

const INITIAL_FIELDS: CustomField[] = [
  {
    id: '1',
    label: 'Client Skype ID',
    module: 'Client',
    type: 'Text',
    required: false,
    showInTable: true,
    allowExport: true,
    createdDate: '2026-06-15'
  },
  {
    id: '2',
    label: 'Hardware MAC ID',
    module: 'Asset',
    type: 'Text',
    required: true,
    showInTable: true,
    allowExport: false,
    createdDate: '2026-07-02'
  },
  {
    id: '3',
    label: 'Contract Sign Date',
    module: 'Contract',
    type: 'Date',
    required: true,
    showInTable: true,
    allowExport: true,
    createdDate: '2026-07-05'
  }
];

const MODULE_OPTIONS = ['Client', 'Employee', 'Lead', 'Project', 'Task', 'Invoice', 'Proposal', 'Contract'];
const FIELD_TYPES = [
  'Text', 'Textarea', 'Number', 'Email', 'Phone', 'Date', 'Date Time', 
  'Checkbox', 'Radio', 'Dropdown', 'File Upload', 'URL', 'Color Picker', 
  'Currency', 'Rating', 'Tags', 'Toggle'
];

export default function CustomFieldsSettings({ onNotify }: CustomFieldsSettingsProps) {
  const [fields, setFields] = useState<CustomField[]>(INITIAL_FIELDS);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof CustomField>('createdDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields State
  const [module, setModule] = useState('Client');
  const [label, setLabel] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [fieldType, setFieldType] = useState('Text');
  const [showInTable, setShowInTable] = useState(true);
  const [allowExport, setAllowExport] = useState(true);

  // Validation state
  const [error, setError] = useState('');

  const itemsPerPage = 5;

  const handleOpenAddModal = () => {
    setEditingField(null);
    setModule('Client');
    setLabel('');
    setIsRequired(false);
    setFieldType('Text');
    setShowInTable(true);
    setAllowExport(true);
    setError('');
    setIsOpen(true);
  };

  const handleOpenEditModal = (field: CustomField) => {
    setEditingField(field);
    setModule(field.module);
    setLabel(field.label);
    setIsRequired(field.required);
    setFieldType(field.type);
    setShowInTable(field.showInTable);
    setAllowExport(field.allowExport);
    setError('');
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!label.trim()) {
      setError('Field Label is required');
      return;
    }

    // Duplicate Prevention
    const isDuplicate = fields.some(f => 
      f.label.toLowerCase() === label.trim().toLowerCase() && 
      f.module === module &&
      f.id !== editingField?.id
    );

    if (isDuplicate) {
      setError(`A custom field named "${label}" already exists in the ${module} module.`);
      return;
    }

    if (editingField) {
      // Edit mode
      setFields(prev => prev.map(f => f.id === editingField.id ? {
        ...f,
        module,
        label: label.trim(),
        required: isRequired,
        type: fieldType,
        showInTable,
        allowExport
      } : f));
      onNotify(`Custom field "${label}" updated successfully.`);
    } else {
      // Create mode
      const newField: CustomField = {
        id: Date.now().toString(),
        label: label.trim(),
        module,
        type: fieldType,
        required: isRequired,
        showInTable,
        allowExport,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setFields(prev => [newField, ...prev]);
      onNotify(`Custom field "${label}" added successfully.`);
    }

    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    const target = fields.find(f => f.id === id);
    setFields(prev => prev.filter(f => f.id !== id));
    if (target) {
      onNotify(`Custom field "${target.label}" deleted.`);
    }
    setDeleteConfirmId(null);
  };

  // Sorting
  const toggleSort = (column: keyof CustomField) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredFields = fields.filter(f => 
    f.label.toLowerCase().includes(search.toLowerCase()) ||
    f.module.toLowerCase().includes(search.toLowerCase()) ||
    f.type.toLowerCase().includes(search.toLowerCase())
  );

  const sortedFields = [...filteredFields].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === 'boolean') {
      aVal = aVal ? 1 : 0;
      bVal = bVal ? 1 : 0;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedFields.length / itemsPerPage) || 1;
  const paginatedFields = sortedFields.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <span>Custom Fields</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Design and append custom data parameters across WorkSuite systems.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Field</span>
        </button>
      </div>

      {/* Search and control box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Custom Fields..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white placeholder-slate-400 font-medium transition-all"
          />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {paginatedFields.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('label')}>
                    <div className="flex items-center gap-1">
                      <span>Field Label</span>
                      {sortBy === 'label' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('module')}>
                    <div className="flex items-center gap-1">
                      <span>Module</span>
                      {sortBy === 'module' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('type')}>
                    <div className="flex items-center gap-1">
                      <span>Field Type</span>
                      {sortBy === 'type' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('required')}>
                    <div className="flex items-center gap-1">
                      <span>Required</span>
                      {sortBy === 'required' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-4">Table View</th>
                  <th className="px-6 py-4">Export</th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('createdDate')}>
                    <div className="flex items-center gap-1">
                      <span>Created Date</span>
                      {sortBy === 'createdDate' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                {paginatedFields.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-900 font-bold">{field.label}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-md font-extrabold uppercase">
                        {field.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-indigo-600 font-extrabold text-[11px]">{field.type}</td>
                    <td className="px-6 py-4">
                      {field.required ? (
                        <span className="text-rose-600 bg-rose-50 border border-rose-100 text-[10px] px-2 py-0.5 rounded font-black">Yes</span>
                      ) : (
                        <span className="text-slate-400 bg-slate-50 border border-slate-100 text-[10px] px-2 py-0.5 rounded">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {field.showInTable ? (
                        <span className="text-emerald-600 text-[10px] font-bold">Enabled</span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Disabled</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {field.allowExport ? (
                        <span className="text-emerald-600 text-[10px] font-bold">Allowed</span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-[11px] font-mono">{field.createdDate}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(field)}
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors cursor-pointer inline-flex"
                        title="Edit Field"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(field.id)}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer inline-flex"
                        title="Delete Field"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state */
          <div className="py-16 text-center">
            <span className="text-4xl block mb-3">📄</span>
            <h4 className="text-sm font-bold text-slate-800">No Custom Fields Found</h4>
            <p className="text-xs text-slate-400 mt-1">Create your first custom database field configuration.</p>
            <button
              onClick={handleOpenAddModal}
              className="mt-4 inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3.5 py-2 rounded-lg border border-indigo-150 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Custom Field</span>
            </button>
          </div>
        )}

        {/* Pagination controls */}
        {sortedFields.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3 flex items-center justify-between text-xs font-bold text-slate-600">
            <div>
              Showing <span className="text-slate-900">{Math.min(sortedFields.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
              <span className="text-slate-900">{Math.min(sortedFields.length, currentPage * itemsPerPage)}</span> of{' '}
              <span className="text-slate-900">{sortedFields.length}</span> entries
            </div>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-2.5 py-1.5 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 cursor-pointer text-xs"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-2.5 py-1.5 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 cursor-pointer text-xs"
              >
                Next
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-sm font-black text-slate-900">{editingField ? 'Edit Field' : 'Add Field'}</h4>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Module */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-black">Module</label>
                  <select
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    {MODULE_OPTIONS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Field Label */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-black">
                    Field Label <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Client Skype ID"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Is Required */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-black">Is Required</label>
                  <div className="flex gap-4 py-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={isRequired}
                        onChange={() => setIsRequired(true)}
                        className="accent-indigo-600"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isRequired}
                        onChange={() => setIsRequired(false)}
                        className="accent-indigo-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* Field Type */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-black">Field Type</label>
                  <select
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    {FIELD_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Display Options */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInTable}
                    onChange={(e) => setShowInTable(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span>Show in Table View</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowExport}
                    onChange={(e) => setAllowExport(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span>Allow export in table view</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-2">
              <span className="text-3xl block">⚠️</span>
              <h4 className="text-sm font-extrabold text-slate-950">Confirm Delete</h4>
              <p className="text-xs text-slate-500">
                Are you absolutely sure you want to delete this custom field? This parameter mapping cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
