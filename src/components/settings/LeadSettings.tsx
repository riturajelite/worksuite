/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Check, X,
  AlertCircle, Shield, HelpCircle, User, Settings, Layers, ListFilter
} from 'lucide-react';

interface LeadSource {
  id: string;
  name: string;
  status: string;
  created: string;
}

interface DealStage {
  id: string;
  name: string;
  probability: number;
  color: string;
  order: number;
  isDefault: boolean;
}

interface Pipeline {
  id: string;
  name: string;
  stagesCount: number;
  isDefault: boolean;
  stages: DealStage[];
}

interface DealAgent {
  id: string;
  name: string;
  role: string;
  category: string;
  status: 'Enabled' | 'Disabled';
  avatar: string;
}

interface DealCategory {
  id: string;
  name: string;
  isDefault: boolean;
}

interface LeadSettingsProps {
  onNotify: (msg: string) => void;
}

export default function LeadSettings({ onNotify }: LeadSettingsProps) {
  const [activeTab, setActiveTab] = useState<'source' | 'pipeline' | 'agent' | 'category' | 'robin'>('source');

  // Lead Sources States
  const [sources, setSources] = useState<LeadSource[]>([
    { id: '1', name: 'Email', status: 'Active', created: '2026-05-10' },
    { id: '2', name: 'Google', status: 'Active', created: '2026-05-12' },
    { id: '3', name: 'Facebook', status: 'Active', created: '2026-05-15' },
    { id: '4', name: 'Friend', status: 'Active', created: '2026-06-01' },
    { id: '5', name: 'Direct', status: 'Active', created: '2026-06-10' },
    { id: '6', name: 'Tv', status: 'Active', created: '2026-06-25' }
  ]);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

  // Pipelines & Stages States
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: 'p1',
      name: 'Sales Pipeline',
      stagesCount: 4,
      isDefault: true,
      stages: [
        { id: 's1', name: 'New Lead', probability: 10, color: '#6366f1', order: 1, isDefault: true },
        { id: 's2', name: 'Contacted', probability: 30, color: '#3b82f6', order: 2, isDefault: false },
        { id: 's3', name: 'Proposal Sent', probability: 60, color: '#f59e0b', order: 3, isDefault: false },
        { id: 's4', name: 'Contract Signed', probability: 100, color: '#10b981', order: 4, isDefault: false }
      ]
    }
  ]);
  const [activePipelineId, setActivePipelineId] = useState('p1');
  const [showStagesList, setShowStagesList] = useState(true);
  const [pipelineModalOpen, setPipelineModalOpen] = useState(false);
  const [pipelineName, setPipelineName] = useState('');
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [stageName, setStageName] = useState('');
  const [stageProbability, setStageProbability] = useState(50);
  const [stageColor, setStageColor] = useState('#6366f1');

  // Deal Agents States
  const [agents, setAgents] = useState<DealAgent[]>([
    { id: 'a1', name: 'Louie Skiles Sr.', role: 'Junior Agent', category: 'Best Case', status: 'Enabled', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80' },
    { id: 'a2', name: 'Talia Krajcik', role: 'Team Lead', category: 'Best Case, Closed', status: 'Enabled', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop&q=80' },
    { id: 'a3', name: 'Prof. Leta Nicolas II', role: 'Project Manager', category: 'Closed', status: 'Enabled', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80' }
  ]);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [agentSearchName, setAgentSearchName] = useState('');
  const [agentRole, setAgentRole] = useState('Junior Agent');

  // Deal Categories States
  const [categories, setCategories] = useState<DealCategory[]>([
    { id: 'c1', name: 'Best Case', isDefault: true },
    { id: 'c2', name: 'Closed', isDefault: false },
    { id: 'c3', name: 'Commit', isDefault: false }
  ]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Round Robin States
  const [enableRobin, setEnableRobin] = useState(false);
  const [assignmentRule, setAssignmentRule] = useState('Equal Distribution');
  const [maxLeads, setMaxLeads] = useState(10);
  const [skipOffline, setSkipOffline] = useState(true);
  const [holidayHandling, setHolidayHandling] = useState(true);
  const [workingHoursOnly, setWorkingHoursOnly] = useState(false);

  // Global delete states
  const [deleteId, setDeleteId] = useState<{ type: string; id: string } | null>(null);

  // --- HANDLERS ---

  // Lead Source handlers
  const handleSaveSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim()) return;

    if (editingSourceId) {
      setSources(prev => prev.map(s => s.id === editingSourceId ? { ...s, name: sourceName.trim() } : s));
      onNotify(`Lead source updated to "${sourceName}"`);
    } else {
      const newSrc: LeadSource = {
        id: Date.now().toString(),
        name: sourceName.trim(),
        status: 'Active',
        created: new Date().toISOString().split('T')[0]
      };
      setSources(prev => [...prev, newSrc]);
      onNotify(`Lead source "${sourceName}" created.`);
    }
    setSourceModalOpen(false);
    setSourceName('');
    setEditingSourceId(null);
  };

  // Pipeline handlers
  const handleSavePipeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pipelineName.trim()) return;

    const newPipe: Pipeline = {
      id: Date.now().toString(),
      name: pipelineName.trim(),
      stagesCount: 0,
      isDefault: false,
      stages: []
    };
    setPipelines(prev => [...prev, newPipe]);
    onNotify(`New pipeline "${pipelineName}" created.`);
    setPipelineModalOpen(false);
    setPipelineName('');
  };

  const handleSaveStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName.trim()) return;

    setPipelines(prev => prev.map(p => {
      if (p.id === activePipelineId) {
        const newStage: DealStage = {
          id: Date.now().toString(),
          name: stageName.trim(),
          probability: stageProbability,
          color: stageColor,
          order: p.stages.length + 1,
          isDefault: p.stages.length === 0
        };
        const nextStages = [...p.stages, newStage];
        return {
          ...p,
          stages: nextStages,
          stagesCount: nextStages.length
        };
      }
      return p;
    }));

    onNotify(`Deal Stage "${stageName}" added.`);
    setStageModalOpen(false);
    setStageName('');
    setStageProbability(50);
  };

  // Deal Agents handlers
  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentSearchName.trim()) return;

    const newAgent: DealAgent = {
      id: Date.now().toString(),
      name: agentSearchName.trim(),
      role: agentRole,
      category: 'Best Case',
      status: 'Enabled',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop&q=80'
    };
    setAgents(prev => [...prev, newAgent]);
    onNotify(`Agent "${agentSearchName}" assigned successfully.`);
    setAgentModalOpen(false);
    setAgentSearchName('');
  };

  const handleAgentCategoryChange = (agentId: string, value: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, category: value } : a));
    onNotify(`Updated category mapping for agent.`);
  };

  const handleAgentStatusChange = (agentId: string, value: 'Enabled' | 'Disabled') => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: value } : a));
    onNotify(`Agent state updated to ${value}.`);
  };

  // Deal Category handlers
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategoryId) {
      setCategories(prev => prev.map(c => c.id === editingCategoryId ? { ...c, name: categoryName.trim() } : c));
      onNotify(`Category updated to "${categoryName}"`);
    } else {
      const newCat: DealCategory = {
        id: Date.now().toString(),
        name: categoryName.trim(),
        isDefault: categories.length === 0
      };
      setCategories(prev => [...prev, newCat]);
      onNotify(`Category "${categoryName}" added.`);
    }
    setCategoryModalOpen(false);
    setCategoryName('');
    setEditingCategoryId(null);
  };

  const handleSetDefaultCategory = (id: string) => {
    setCategories(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    const target = categories.find(c => c.id === id);
    if (target) {
      onNotify(`"${target.name}" is now the default deal category.`);
    }
  };

  // Generic Deletion
  const performDelete = () => {
    if (!deleteId) return;
    const { type, id } = deleteId;

    if (type === 'source') {
      setSources(prev => prev.filter(s => s.id !== id));
      onNotify('Lead source deleted.');
    } else if (type === 'agent') {
      setAgents(prev => prev.filter(a => a.id !== id));
      onNotify('Agent unassigned.');
    } else if (type === 'category') {
      const cat = categories.find(c => c.id === id);
      if (cat?.isDefault) {
        onNotify('Cannot delete default deal category.');
      } else {
        setCategories(prev => prev.filter(c => c.id !== id));
        onNotify('Deal category deleted.');
      }
    } else if (type === 'stage') {
      setPipelines(prev => prev.map(p => {
        if (p.id === activePipelineId) {
          const filtered = p.stages.filter(s => s.id !== id);
          return { ...p, stages: filtered, stagesCount: filtered.length };
        }
        return p;
      }));
      onNotify('Deal stage deleted.');
    }

    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <Target className="h-6 w-6 text-indigo-600" />
        <div>
          <h3 className="text-base font-extrabold text-slate-950">Lead Settings</h3>
          <p className="text-xs text-slate-500 font-medium">Customize lead pipeline stages, assign deal agents, categories, and rotators.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex flex-wrap -mb-px gap-2">
          {[
            { id: 'source', label: 'Lead Source' },
            { id: 'pipeline', label: 'Pipeline' },
            { id: 'agent', label: 'Deal Agent' },
            { id: 'category', label: 'Deal Category' },
            { id: 'robin', label: 'Round Robin' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-4 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tab Panels */}
      <div className="space-y-4">
        
        {/* TAB 1: LEAD SOURCE */}
        {activeTab === 'source' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => { setEditingSourceId(null); setSourceName(''); setSourceModalOpen(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-3xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Lead Source</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 w-12 text-center">#</th>
                    <th className="p-3.5">Lead Source</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Created</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {sources.map((src, idx) => (
                    <tr key={src.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 text-slate-400 text-center">{idx + 1}</td>
                      <td className="p-3.5 font-bold text-slate-900">{src.name}</td>
                      <td className="p-3.5">
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 text-[10px] px-2 py-0.5 rounded font-black">
                          {src.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">{src.created}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => { setEditingSourceId(src.id); setSourceName(src.name); setSourceModalOpen(true); }}
                          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1.5 rounded-lg cursor-pointer inline-flex"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId({ type: 'source', id: src.id })}
                          className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer inline-flex"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setPipelineName(''); setPipelineModalOpen(true); }}
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-150 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Pipeline</span>
              </button>
              <button
                onClick={() => { setStageName(''); setStageModalOpen(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-3xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Deal Stage</span>
              </button>
            </div>

            {/* Pipeline list and deal stages summary cards */}
            <div className="space-y-4">
              {pipelines.map(pipe => {
                const isActive = activePipelineId === pipe.id;
                return (
                  <div key={pipe.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                          <span>{pipe.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-md">
                            {pipe.stages.length} Deal Stages
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Primary sales roadmap settings.</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="default-pipeline"
                            checked={pipe.isDefault}
                            onChange={() => {
                              setPipelines(prev => prev.map(p => ({ ...p, isDefault: p.id === pipe.id })));
                              onNotify(`"${pipe.name}" set as default pipeline.`);
                            }}
                            className="accent-indigo-600"
                          />
                          <span>Default</span>
                        </label>
                        <button
                          onClick={() => {
                            setActivePipelineId(pipe.id);
                            setShowStagesList(!showStagesList);
                          }}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-lg border border-indigo-100 cursor-pointer"
                        >
                          {showStagesList && isActive ? 'Hide Deal Stages' : 'Deal Stages'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Stages List */}
                    {showStagesList && isActive && (
                      <div className="border border-slate-200/80 rounded-xl overflow-hidden mt-2 text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-200">
                            <tr>
                              <th className="p-3 w-16 text-center">Order</th>
                              <th className="p-3">Stage Name</th>
                              <th className="p-3 text-center">Probability</th>
                              <th className="p-3 text-center">Accent Color</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {pipe.stages.map((stage, sIdx) => (
                              <tr key={stage.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-3 text-slate-400 text-center">{stage.order}</td>
                                <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: stage.color }} />
                                  <span>{stage.name}</span>
                                </td>
                                <td className="p-3 text-center text-indigo-600 font-mono font-bold">{stage.probability}%</td>
                                <td className="p-3 text-center font-mono text-[10px] text-slate-400">{stage.color}</td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => setDeleteId({ type: 'stage', id: stage.id })}
                                    className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1 rounded transition-colors cursor-pointer inline-flex"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DEAL AGENT */}
        {activeTab === 'agent' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => { setAgentSearchName(''); setAgentModalOpen(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-3xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Deal Agent</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 w-12 text-center">#</th>
                    <th className="p-3.5">Agent Details</th>
                    <th className="p-3.5">Category Mapping</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {agents.map((agent, idx) => (
                    <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 text-slate-400 text-center">{idx + 1}</td>
                      <td className="p-3.5 flex items-center gap-3">
                        <img src={agent.avatar} alt={agent.name} referrerPolicy="no-referrer" className="h-8 w-8 rounded-full border border-slate-200 object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{agent.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{agent.role}</p>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={agent.category}
                          onChange={(e) => handleAgentCategoryChange(agent.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="Best Case">Best Case</option>
                          <option value="Best Case, Closed">Best Case, Closed</option>
                          <option value="Closed">Closed</option>
                          <option value="Commit">Commit</option>
                        </select>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={agent.status}
                          onChange={(e) => handleAgentStatusChange(agent.id, e.target.value as any)}
                          className={`border rounded-lg px-2.5 py-1 text-xs font-black focus:outline-none cursor-pointer ${
                            agent.status === 'Enabled'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="Enabled">Enabled</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setDeleteId({ type: 'agent', id: agent.id })}
                          className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer inline-flex"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DEAL CATEGORY */}
        {activeTab === 'category' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => { setEditingCategoryId(null); setCategoryName(''); setCategoryModalOpen(true); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-3xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Deal Category</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 w-12 text-center">#</th>
                    <th className="p-3.5">Category Name</th>
                    <th className="p-3.5">Default Policy</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {categories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 text-slate-400 text-center">{idx + 1}</td>
                      <td className="p-3.5 font-bold text-slate-900">{cat.name}</td>
                      <td className="p-3.5">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-black text-slate-700">
                          <input
                            type="radio"
                            name="default-category"
                            checked={cat.isDefault}
                            onChange={() => handleSetDefaultCategory(cat.id)}
                            className="accent-indigo-600"
                          />
                          <span>{cat.isDefault ? 'Primary Default' : 'Set as Default'}</span>
                        </label>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => { setEditingCategoryId(cat.id); setCategoryName(cat.name); setCategoryModalOpen(true); }}
                          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1.5 rounded-lg cursor-pointer inline-flex"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId({ type: 'category', id: cat.id })}
                          disabled={cat.isDefault}
                          className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer inline-flex disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ROUND ROBIN */}
        {activeTab === 'robin' && (
          <div className="space-y-5">
            {/* Info Box */}
            <div className="bg-amber-50/55 border border-amber-200 rounded-2xl p-6 space-y-3 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-black uppercase text-[10px] text-amber-800">
                <HelpCircle className="h-4.5 w-4.5 text-amber-500" />
                <span>Round-Robin Method Information</span>
              </div>
              <ul className="space-y-1.5 list-disc pl-5">
                <li><strong className="text-amber-950">Equal Distribution:</strong> Tasks are evenly distributed among active team agents.</li>
                <li><strong className="text-amber-950">Sequential Assignment:</strong> Each incoming lead is assigned to the next teammate in rotation.</li>
                <li><strong className="text-amber-950">Fair Rotation:</strong> Prevents team fatigue and guarantees even pipeline pipelines.</li>
              </ul>
              <div className="p-3.5 bg-white border border-amber-200/80 rounded-xl font-mono text-[11px] text-slate-600">
                <span className="font-bold text-slate-900 block mb-1">Queue Loop Example</span>
                Incoming lead #1 → Agent A, Lead #2 → Agent B, Lead #3 → Agent C, Lead #4 → Loop restarts (Agent A).
              </div>
            </div>

            {/* Toggle switch with high-fidelity inputs */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-3xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Enable Round Robin Rotations</h4>
                  <p className="text-[11px] text-slate-400 font-semibold">Distribute newly logged leads automatically.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEnableRobin(!enableRobin);
                    onNotify(`Lead rotator ${!enableRobin ? 'activated' : 'deactivated'}.`);
                  }}
                  className="cursor-pointer"
                >
                  <span className={`block w-14 h-7 rounded-full relative transition-colors ${enableRobin ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    <span className={`block w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-md ${enableRobin ? 'right-1' : 'left-1'}`} />
                  </span>
                </button>
              </div>

              {enableRobin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 space-y-2 md:space-y-0 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 block font-black">Assignment Rule</label>
                    <select
                      value={assignmentRule}
                      onChange={(e) => setAssignmentRule(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="Equal Distribution">Equal Distribution</option>
                      <option value="Sequential Assignment">Sequential Assignment</option>
                      <option value="Fair Rotation">Fair Rotation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 block font-black">Maximum Leads per Agent</label>
                    <input
                      type="number"
                      value={maxLeads}
                      onChange={(e) => setMaxLeads(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-2 pt-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skipOffline}
                        onChange={(e) => setSkipOffline(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                      />
                      <span>Skip Offline Agents</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={holidayHandling}
                        onChange={(e) => setHolidayHandling(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                      />
                      <span>Skip agents currently on approved leaves/holidays</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingHoursOnly}
                        onChange={(e) => setWorkingHoursOnly(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                      />
                      <span>Rotate only during established office hours (09:00 - 18:00)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => onNotify('Round robin scheduler settings saved successfully.')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-3xs cursor-pointer"
              >
                Save Rotator Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS SECTION */}

      {/* Lead Source Modal */}
      {sourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form onSubmit={handleSaveSource} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-sm font-black text-slate-900">{editingSourceId ? 'Edit Lead Source' : 'Add Lead Source'}</h4>
              <button type="button" onClick={() => setSourceModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 block font-black">Lead Source Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Google Adwords"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button type="button" onClick={() => setSourceModalOpen(false)} className="px-3.5 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-3xs cursor-pointer">Save Source</button>
            </div>
          </form>
        </div>
      )}

      {/* Pipeline Creation Modal */}
      {pipelineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form onSubmit={handleSavePipeline} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-sm font-black text-slate-900">Add Pipeline</h4>
              <button type="button" onClick={() => setPipelineModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 block font-black">Pipeline Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sales Pipeline"
                  value={pipelineName}
                  onChange={(e) => setPipelineName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button type="button" onClick={() => setPipelineModalOpen(false)} className="px-3.5 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-3xs cursor-pointer">Save Pipeline</button>
            </div>
          </form>
        </div>
      )}

      {/* Deal Stage Modal */}
      {stageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form onSubmit={handleSaveStage} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-sm font-black text-slate-900">Add Deal Stage</h4>
              <button type="button" onClick={() => setStageModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 block font-black">Stage Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Negotiation"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-black">Win Probability %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stageProbability}
                    onChange={(e) => setStageProbability(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-black">Accent Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={stageColor}
                      onChange={(e) => setStageColor(e.target.value)}
                      className="h-8 w-8 rounded border border-slate-200 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-500 uppercase">{stageColor}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button type="button" onClick={() => setStageModalOpen(false)} className="px-3.5 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-3xs cursor-pointer">Save Stage</button>
            </div>
          </form>
        </div>
      )}

      {/* Deal Agent Assigning Modal */}
      {agentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form onSubmit={handleAddAgent} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-sm font-black text-slate-900">Add Deal Agent</h4>
              <button type="button" onClick={() => setAgentModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 block font-black">Agent Name *</label>
                <input
                  type="text"
                  placeholder="Search team member name..."
                  value={agentSearchName}
                  onChange={(e) => setAgentSearchName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 block font-black">Assign Role</label>
                <select
                  value={agentRole}
                  onChange={(e) => setAgentRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="Junior Agent">Junior Agent</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Project Manager">Project Manager</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button type="button" onClick={() => setAgentModalOpen(false)} className="px-3.5 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-3xs cursor-pointer">Assign Agent</button>
            </div>
          </form>
        </div>
      )}

      {/* Deal Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <form onSubmit={handleSaveCategory} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-sm font-black text-slate-900">{editingCategoryId ? 'Edit Deal Category' : 'Add Deal Category'}</h4>
              <button type="button" onClick={() => setCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400 block font-black">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Commitment"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button type="button" onClick={() => setCategoryModalOpen(false)} className="px-3.5 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-3xs cursor-pointer">Save Category</button>
            </div>
          </form>
        </div>
      )}

      {/* Deletion Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="text-center space-y-2">
              <span className="text-3xl block">⚠️</span>
              <h4 className="text-sm font-extrabold text-slate-950">Confirm Deletion</h4>
              <p className="text-xs text-slate-500">
                Are you absolutely sure you want to remove this setting? New lead pipelines depend on active configurations.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={performDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
