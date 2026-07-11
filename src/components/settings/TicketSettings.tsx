import React, { useState } from 'react';
import { 
  HelpCircle, Save, Plus, Trash2, Users, FolderKanban, Tags, Link2, 
  FileText, RotateCw, Eye, ShieldAlert, Check, PlusCircle, AlertCircle 
} from 'lucide-react';

interface TicketSettingsProps {
  onNotify: (message: string) => void;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  group: string;
  role: 'Agent' | 'Admin' | 'Supervisor';
  status: 'active' | 'away';
}

interface Group {
  id: string;
  name: string;
  leader: string;
  agentsCount: number;
}

interface Type {
  id: string;
  name: string;
  color: string;
}

interface Channel {
  id: string;
  name: string;
  status: 'enabled' | 'disabled';
}

interface ReplyTemplate {
  id: string;
  title: string;
  text: string;
}

export default function TicketSettings({ onNotify }: TicketSettingsProps) {
  // Sub-tabs in Ticket Settings
  const [activeTab, setActiveTab] = useState<'agents' | 'groups' | 'types' | 'channels' | 'templates' | 'roundrobin' | 'visibility'>('agents');

  // Agents state
  const [agents, setAgents] = useState<Agent[]>([
    { id: 'agt-1', name: 'Sophia Loren', email: 'sophia@worksuite.io', group: 'Technical Support', role: 'Agent', status: 'active' },
    { id: 'agt-2', name: 'Augustus Admin', email: 'admin@worksuite.io', group: 'Billing Support', role: 'Admin', status: 'active' },
    { id: 'agt-3', name: 'Marcus Aurelius', email: 'marcus@worksuite.io', group: 'IT Infrastructure', role: 'Supervisor', status: 'away' }
  ]);

  // Groups state
  const [groups, setGroups] = useState<Group[]>([
    { id: 'grp-1', name: 'Technical Support', leader: 'Sophia Loren', agentsCount: 4 },
    { id: 'grp-2', name: 'Billing Support', leader: 'Augustus Admin', agentsCount: 2 },
    { id: 'grp-3', name: 'IT Infrastructure', leader: 'Marcus Aurelius', agentsCount: 3 }
  ]);

  // Types state
  const [types, setTypes] = useState<Type[]>([
    { id: 'typ-1', name: 'Bug Report', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { id: 'typ-2', name: 'Feature Request', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'typ-3', name: 'Billing / Invoice Dispute', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'typ-4', name: 'General Inquiries', color: 'bg-slate-50 text-slate-700 border-slate-200' }
  ]);

  // Channels state
  const [channels, setChannels] = useState<Channel[]>([
    { id: 'ch-1', name: 'Email Gateway (support@worksuite.io)', status: 'enabled' },
    { id: 'ch-2', name: 'Web Portal Form', status: 'enabled' },
    { id: 'ch-3', name: 'Embedded Chat Widget', status: 'enabled' },
    { id: 'ch-4', name: 'REST API Gateway', status: 'disabled' }
  ]);

  // Reply templates state
  const [replyTemplates, setReplyTemplates] = useState<ReplyTemplate[]>([
    { id: 'rt-1', title: 'Standard Greeting & SLA Notification', text: 'Hi [Client Name],\n\nThank you for contacting Worksuite Support. We have logged your ticket under ID #[Ticket ID]. A dedicated agent is reviewing your request and will follow up within [SLA Time].\n\nBest Regards,\nWorksuite Support Team' },
    { id: 'rt-2', title: 'Issue Solved Auto-Closer', text: 'Hi [Client Name],\n\nWe have marked ticket #[Ticket ID] as Solved. If you have any further questions, simply reply to this thread to automatically reopen it.\n\nWarmly,\nWorksuite Support' }
  ]);

  // Round Robin states
  const [roundRobinEnabled, setRoundRobinEnabled] = useState(true);
  const [maxTicketsPerAgent, setMaxTicketsPerAgent] = useState(15);
  const [assignmentFrequency, setAssignmentFrequency] = useState('Immediate');

  // Visibility States
  const [clientCanClose, setClientCanClose] = useState(true);
  const [agentPrivateNotes, setAgentPrivateNotes] = useState(true);
  const [anonymousSubmissions, setAnonymousSubmissions] = useState(false);

  // Add Agent states
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentGroup, setNewAgentGroup] = useState('Technical Support');
  const [newAgentRole, setNewAgentRole] = useState<'Agent' | 'Admin' | 'Supervisor'>('Agent');

  // Add Group, Type, Template, Channel States
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupLeader, setNewGroupLeader] = useState('');

  const [isAddingType, setIsAddingType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('bg-indigo-50 text-indigo-700 border-indigo-200');

  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateText, setNewTemplateText] = useState('');

  // Save changes
  const handleSaveAll = () => {
    onNotify('Ticket Configurations and Routing rules saved!');
  };

  // Add Handlers
  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentEmail.trim()) return;

    const newAgt: Agent = {
      id: `agt-${Date.now()}`,
      name: newAgentName,
      email: newAgentEmail,
      group: newAgentGroup,
      role: newAgentRole,
      status: 'active'
    };

    setAgents(prev => [...prev, newAgt]);
    setIsAddingAgent(false);
    setNewAgentName('');
    setNewAgentEmail('');
    onNotify(`Added support agent "${newAgt.name}" successfully!`);
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    onNotify('Agent removed.');
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const newGrp: Group = {
      id: `grp-${Date.now()}`,
      name: newGroupName,
      leader: newGroupLeader || 'Sophia Loren',
      agentsCount: 1
    };
    setGroups(prev => [...prev, newGrp]);
    setIsAddingGroup(false);
    setNewGroupName('');
    onNotify(`Group "${newGrp.name}" registered!`);
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    const newT: Type = {
      id: `typ-${Date.now()}`,
      name: newTypeName,
      color: newTypeColor
    };
    setTypes(prev => [...prev, newT]);
    setIsAddingType(false);
    setNewTypeName('');
    onNotify(`Ticket Type "${newT.name}" registered!`);
  };

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim() || !newTemplateText.trim()) return;
    const newRT: ReplyTemplate = {
      id: `rt-${Date.now()}`,
      title: newTemplateTitle,
      text: newTemplateText
    };
    setReplyTemplates(prev => [...prev, newRT]);
    setIsAddingTemplate(false);
    setNewTemplateTitle('');
    setNewTemplateText('');
    onNotify(`Saved canned response "${newRT.title}"`);
  };

  return (
    <div className="space-y-6" id="ticket-settings-root">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • System Settings • Ticket Settings
        </div>
        <h2 className="text-xl font-bold text-slate-800">Ticket Settings</h2>
        <p className="text-xs text-slate-500 font-medium">Manage support SLA ticket workflows, canned reply templates, assignment metrics, and agent teams.</p>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-150 pb-2">
        {[
          { key: 'agents', label: 'Support Agents', icon: Users },
          { key: 'groups', label: 'Agent Groups', icon: FolderKanban },
          { key: 'types', label: 'Ticket Types', icon: Tags },
          { key: 'channels', label: 'Channels', icon: Link2 },
          { key: 'templates', label: 'Reply Templates', icon: FileText },
          { key: 'roundrobin', label: 'Round Robin', icon: RotateCw },
          { key: 'visibility', label: 'Client Visibility', icon: Eye }
        ].map(item => {
          const isActive = activeTab === item.key;
          const SubIcon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
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

      {/* Tab Panels */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-3xs p-6 space-y-6">
        
        {/* PANEL 1: Agents */}
        {activeTab === 'agents' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Registered Ticket Agents</h3>
                <p className="text-[11px] text-slate-500">Configure staffing assignments and role levels.</p>
              </div>
              <button
                onClick={() => setIsAddingAgent(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                Add New Agent
              </button>
            </div>

            <div className="border border-slate-150 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase border-b border-slate-150">
                    <th className="p-3.5">Agent Name</th>
                    <th className="p-3.5">System Email</th>
                    <th className="p-3.5">Assigned Group</th>
                    <th className="p-3.5">Auth Role</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {agents.map((a, idx) => {
                    const initials = a.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    const avatarBgs = [
                      'bg-emerald-500 text-white',
                      'bg-indigo-500 text-white',
                      'bg-amber-500 text-white',
                      'bg-rose-500 text-white',
                      'bg-purple-500 text-white',
                      'bg-sky-500 text-white'
                    ];
                    const avatarBg = avatarBgs[idx % avatarBgs.length];

                    return (
                      <tr key={a.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 pl-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black uppercase tracking-wider ${avatarBg}`}>
                              {initials}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-800 text-[13px]">{a.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Agent ID: {a.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-semibold text-xs">{a.email}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 border border-slate-200/60 text-slate-700 text-[10px] px-2.5 py-1 rounded-lg font-bold">
                            {a.group}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider">
                            {a.role}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            a.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                            {a.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-5">
                          <button
                            onClick={() => handleDeleteAgent(a.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove Agent"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL 2: Groups */}
        {activeTab === 'groups' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Helpdesk Departments</h3>
                <p className="text-[11px] text-slate-500">Route tickets dynamically to specific skills directories.</p>
              </div>
              <button
                onClick={() => setIsAddingGroup(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                Add Group
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groups.map(g => (
                <div key={g.id} className="p-4 bg-slate-50/40 border border-slate-200/80 rounded-xl space-y-3 shadow-3xs">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">{g.name}</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{g.agentsCount} agents</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
                    <span>Group Leader:</span>
                    <span className="text-slate-600 font-extrabold">{g.leader}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 3: Types */}
        {activeTab === 'types' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Ticket Types & Classifications</h3>
                <p className="text-[11px] text-slate-500">Map custom ticket issues to optimize SLA priority windows.</p>
              </div>
              <button
                onClick={() => setIsAddingType(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                Add Ticket Type
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {types.map(t => (
                <div key={t.id} className={`px-4 py-2 border rounded-full text-xs font-extrabold flex items-center gap-2.5 ${t.color}`}>
                  <span>{t.name}</span>
                  <button
                    onClick={() => setTypes(prev => prev.filter(item => item.id !== t.id))}
                    className="hover:text-rose-600 p-0.5"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 4: Channels */}
        {activeTab === 'channels' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Submission Channels</h3>
              <p className="text-[11px] text-slate-500">Enable/disable external portals and notification hooks.</p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden">
              {channels.map(c => (
                <div key={c.id} className="p-4 flex items-center justify-between bg-white text-xs font-bold text-slate-700 hover:bg-slate-50/40">
                  <span className="text-slate-800">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setChannels(prev => prev.map(ch => ch.id === c.id ? { ...ch, status: ch.status === 'enabled' ? 'disabled' : 'enabled' } : ch));
                      onNotify(`${c.name} gateway updated.`);
                    }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer border ${
                      c.status === 'enabled' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    {c.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 5: Reply Templates */}
        {activeTab === 'templates' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Canned Reply Templates</h3>
                <p className="text-[11px] text-slate-500">Provide rapid, predefined feedback responses for agents.</p>
              </div>
              <button
                onClick={() => setIsAddingTemplate(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                Add Reply Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {replyTemplates.map(rt => (
                <div key={rt.id} className="p-4 bg-slate-50/40 border border-slate-200/80 rounded-xl space-y-3 relative group">
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-extrabold text-slate-800">{rt.title}</span>
                    <button
                      onClick={() => setReplyTemplates(prev => prev.filter(item => item.id !== rt.id))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <pre className="text-[11px] text-slate-500 font-mono whitespace-pre-wrap leading-relaxed">
                    {rt.text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 6: Round Robin */}
        {activeTab === 'roundrobin' && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 block">Round Robin Auto-Assignment</span>
                <p className="text-[11px] text-slate-400">Direct incoming helpdesk tickets to active agents sequentially.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRoundRobinEnabled(!roundRobinEnabled);
                  onNotify(`Round Robin routing ${!roundRobinEnabled ? 'Enabled' : 'Disabled'}.`);
                }}
                className="text-indigo-600 hover:text-indigo-700 cursor-pointer p-1"
              >
                <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  roundRobinEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform transform ${
                    roundRobinEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </button>
            </div>

            {roundRobinEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Maximum Active Tickets per Agent</label>
                  <input
                    type="number"
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                    value={maxTicketsPerAgent}
                    onChange={(e) => setMaxTicketsPerAgent(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400">Prevents agent burnout when capacity limits are hit.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Re-assignment Interval</label>
                  <select
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold"
                    value={assignmentFrequency}
                    onChange={(e) => setAssignmentFrequency(e.target.value)}
                  >
                    <option>Immediate</option>
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option>Daily Shift Batches</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANEL 7: Visibility */}
        {activeTab === 'visibility' && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Ticket Thread Visibility Settings</h3>
              <p className="text-[11px] text-slate-500">Configure client permissions and privacy levels.</p>
            </div>

            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/40 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-800 font-bold block">Clients Can Close Solved Tickets</span>
                  <span className="text-[10px] text-slate-400 font-medium">Permit clients to manually sign off completed issue threads.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setClientCanClose(!clientCanClose)}
                  className="w-11 h-6 rounded-full transition-colors relative p-0.5 bg-slate-300"
                  style={{ backgroundColor: clientCanClose ? '#4f46e5' : '#cbd5e1' }}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${clientCanClose ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/40 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-800 font-bold block">Internal Private Agent Notes</span>
                  <span className="text-[10px] text-slate-400 font-medium">Allow agents to leave private notes on ticket threads invisible to clients.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAgentPrivateNotes(!agentPrivateNotes)}
                  className="w-11 h-6 rounded-full transition-colors relative p-0.5 bg-slate-300"
                  style={{ backgroundColor: agentPrivateNotes ? '#4f46e5' : '#cbd5e1' }}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${agentPrivateNotes ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/40 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-800 font-bold block">Allow Anonymous Ticket Creation</span>
                  <span className="text-[10px] text-slate-400 font-medium">Clients can submit issues without having an active user account.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAnonymousSubmissions(!anonymousSubmissions)}
                  className="w-11 h-6 rounded-full transition-colors relative p-0.5 bg-slate-300"
                  style={{ backgroundColor: anonymousSubmissions ? '#4f46e5' : '#cbd5e1' }}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${anonymousSubmissions ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
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
            Save Ticket Settings
          </button>
        </div>
      </div>

      {/* MODAL: Add Support Agent */}
      {isAddingAgent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Register New Agent</span>
              <button onClick={() => setIsAddingAgent(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddAgent} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Agent Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sophia Loren"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">System Email *</label>
                <input
                  type="email"
                  required
                  placeholder="agent@worksuite.io"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newAgentEmail}
                  onChange={(e) => setNewAgentEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Assigned Group</label>
                <select
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newAgentGroup}
                  onChange={(e) => setNewAgentGroup(e.target.value)}
                >
                  <option>Technical Support</option>
                  <option>Billing Support</option>
                  <option>IT Infrastructure</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Authorization Role</label>
                <select
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newAgentRole}
                  onChange={(e: any) => setNewAgentRole(e.target.value)}
                >
                  <option value="Agent">Support Agent</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAgent(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer shadow-3xs"
                >
                  Add Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Group */}
      {isAddingGroup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Register Support Group</span>
              <button onClick={() => setIsAddingGroup(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddGroup} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Group/Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Enterprise Sales Support"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Group Team Leader</label>
                <input
                  type="text"
                  placeholder="e.g., Marcus Aurelius"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newGroupLeader}
                  onChange={(e) => setNewGroupLeader(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setIsAddingGroup(false)} className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-3xs">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Type */}
      {isAddingType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Add Ticket Category Type</span>
              <button onClick={() => setIsAddingType(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddType} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Type Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., API Integration Issue"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Aesthetic Visual Theme</label>
                <select
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newTypeColor}
                  onChange={(e) => setNewTypeColor(e.target.value)}
                >
                  <option value="bg-rose-50 text-rose-700 border-rose-200">Rose/Danger Accent</option>
                  <option value="bg-indigo-50 text-indigo-700 border-indigo-200">Indigo/Core Accent</option>
                  <option value="bg-emerald-50 text-emerald-700 border-emerald-200">Emerald/Finance Accent</option>
                  <option value="bg-amber-50 text-amber-700 border-amber-200">Amber/Pending Accent</option>
                </select>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setIsAddingType(false)} className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-3xs">Create Type</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Template */}
      {isAddingTemplate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Save Canned Reply Response</span>
              <button onClick={() => setIsAddingTemplate(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddTemplate} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Template Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Refund Terms Confirmation"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none"
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Message Body Content *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Predefined message content with fields e.g. [Client Name], [Ticket ID]"
                  className="w-full bg-white text-slate-850 text-xs p-3 rounded-lg border border-slate-200 font-medium focus:outline-none font-mono"
                  value={newTemplateText}
                  onChange={(e) => setNewTemplateText(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setIsAddingTemplate(false)} className="bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-3xs">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
