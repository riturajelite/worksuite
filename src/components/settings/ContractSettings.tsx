import React, { useState } from 'react';
import { 
  HelpCircle, Save, FileText, Plus, Trash2, Edit, Check, Settings, 
  ShieldCheck, Mail, Info, Clock, Calendar, Lock, Shield, UserCheck 
} from 'lucide-react';

interface ContractSettingsProps {
  onNotify: (message: string) => void;
}

interface ContractTemplate {
  id: string;
  title: string;
  type: string;
  description: string;
  lastUpdated: string;
  signatureType: 'draw' | 'type' | 'otp';
  autoReminder: boolean;
  terms: string;
  workHoursPerDay: number;
  workDaysPerWeek: number;
  probationPeriod: string;
  terminationNotice: string;
  confidentiality: string;
  ipOwnership: string;
}

const INITIAL_TEMPLATES: ContractTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Standard Non-Disclosure Agreement (NDA)',
    type: 'NDA',
    description: 'Enforces two-way confidentiality obligations on contractors, employees, or clients.',
    lastUpdated: '2026-07-01',
    signatureType: 'draw',
    autoReminder: true,
    terms: 'This Nondisclosure Agreement (the "Agreement") is entered into by and between [Client Name] ("Receiving Party") and Worksuite ("Disclosing Party"). The Receiving Party agrees to treat all proprietary information disclosed by Disclosing Party with the highest standard of care and shall not disclose or publish such details without written permission.',
    workHoursPerDay: 8,
    workDaysPerWeek: 5,
    probationPeriod: 'None',
    terminationNotice: 'Immediate',
    confidentiality: 'Strict Confidentiality',
    ipOwnership: 'Immediate Transfer'
  },
  {
    id: 'tpl-2',
    title: 'Freelance Services Agreement',
    type: 'Freelance',
    description: 'Agreement for individual contractors working on specific task/project deliverables.',
    lastUpdated: '2026-06-15',
    signatureType: 'type',
    autoReminder: false,
    terms: 'This Services Agreement outlines the project terms under which [Client Name] is hiring Worksuite as an independent contractor. All work deliverables specified under [Payment Terms] will be completed by [Start Date]. Intellectual property ownership transfers completely upon full invoice completion.',
    workHoursPerDay: 8,
    workDaysPerWeek: 5,
    probationPeriod: 'None',
    terminationNotice: '15 Days Notice',
    confidentiality: 'Standard Confidentiality',
    ipOwnership: 'Transfer on Paid Invoice'
  },
  {
    id: 'tpl-3',
    title: 'General Consulting Agreement',
    type: 'Consulting',
    description: 'Outlines consulting scopes, advisory board structures, and advisory fee options.',
    lastUpdated: '2026-05-20',
    signatureType: 'otp',
    autoReminder: true,
    terms: 'Under this Consulting Agreement, Worksuite shall perform high-level advisory and system analysis services. The client agrees to compensate the advisor with fees outlined in [Payment Terms], subject to net-15 terms from the delivery date.',
    workHoursPerDay: 8,
    workDaysPerWeek: 5,
    probationPeriod: '3 Months',
    terminationNotice: '30 Days Notice',
    confidentiality: 'Highly Confidential',
    ipOwnership: 'Immediate Transfer'
  }
];

export default function ContractSettings({ onNotify }: ContractSettingsProps) {
  const [templates, setTemplates] = useState<ContractTemplate[]>(INITIAL_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-1');
  const [activeTab, setActiveTab] = useState<'content' | 'work-terms' | 'workflow' | 'reminders'>('content');

  // Form states for adding template
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('General');
  const [newDesc, setNewDesc] = useState('');

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const updateTemplateField = (field: keyof ContractTemplate, value: any) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === selectedTemplateId) {
        return { ...t, [field]: value, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return t;
    }));
  };

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTpl: ContractTemplate = {
      id: `tpl-${Date.now()}`,
      title: newTitle,
      type: newType,
      description: newDesc || 'Custom generated agreements format.',
      lastUpdated: new Date().toISOString().split('T')[0],
      signatureType: 'draw',
      autoReminder: true,
      terms: 'Insert your contract clauses here. Double click placeholders above to inject fields.',
      workHoursPerDay: 8,
      workDaysPerWeek: 5,
      probationPeriod: '3 Months',
      terminationNotice: '30 Days Notice',
      confidentiality: 'Standard Confidentiality',
      ipOwnership: 'Immediate Transfer'
    };

    setTemplates(prev => [...prev, newTpl]);
    setSelectedTemplateId(newTpl.id);
    setIsAdding(false);
    setNewTitle('');
    setNewType('General');
    setNewDesc('');
    onNotify(`Created template "${newTpl.title}"!`);
  };

  const handleDeleteTemplate = (id: string) => {
    if (templates.length <= 1) {
      onNotify('Cannot delete the last remaining template.');
      return;
    }
    const filtered = templates.filter(t => t.id !== id);
    setTemplates(filtered);
    setSelectedTemplateId(filtered[0].id);
    onNotify('Template deleted.');
  };

  const handleSaveAll = () => {
    onNotify('Contract Templates and Settings Saved successfully!');
  };

  const injectPlaceholder = (placeholder: string) => {
    const updatedTerms = selectedTemplate.terms + ' ' + placeholder;
    updateTemplateField('terms', updatedTerms);
  };

  const injectWorkTermsToContractBody = () => {
    const summary = `\n\n[WORK TERMS AND AGREEMENT PROVISIONS]\n- Standard Daily Working Hours: ${selectedTemplate.workHoursPerDay} Hours/Day\n- Expected Workdays Schedule: ${selectedTemplate.workDaysPerWeek} Days/Week\n- Probationary Evaluation Period: ${selectedTemplate.probationPeriod}\n- Separation / Termination Notice: ${selectedTemplate.terminationNotice}\n- Intellectual Property Rights: ${selectedTemplate.ipOwnership}\n- Information Confidentiality Standard: ${selectedTemplate.confidentiality}`;
    const updatedTerms = selectedTemplate.terms + summary;
    updateTemplateField('terms', updatedTerms);
    onNotify('Injected current Work Terms directly into Contract Editor!');
  };

  return (
    <div className="space-y-6" id="contract-settings-root">
      {/* Title block */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • System Settings • Contract Settings
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Contract Settings</h2>
            <p className="text-xs text-slate-500 font-semibold font-medium">Configure legally-binding documents, electronic signatures, and work terms configurations.</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="self-start sm:self-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-2 cursor-pointer shadow-3xs transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Templates List Column */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-3xs overflow-hidden">
          <div className="p-4 bg-slate-50/50 border-b border-slate-150 flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Templates ({templates.length})</span>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {templates.map(tpl => {
              const isActive = tpl.id === selectedTemplateId;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-4 text-left cursor-pointer transition-all ${
                    isActive ? 'bg-indigo-50/40 border-l-[3px] border-indigo-600' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-xs font-bold block ${isActive ? 'text-indigo-900 font-extrabold' : 'text-slate-800'}`}>
                      {tpl.title}
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                      {tpl.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 font-medium leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100/50">
                    <span className="text-[10px] text-slate-400 font-semibold">Updated: {tpl.lastUpdated}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(tpl.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
                      title="Delete Template"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Template Detail Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-3xs p-6 space-y-5">
            {/* Tabs for active template */}
            <div className="flex flex-wrap border-b border-slate-150 gap-2 sm:gap-4">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'content' ? 'border-indigo-600 text-indigo-700 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                1. Edit Terms & Content
              </button>
              <button
                onClick={() => setActiveTab('work-terms')}
                className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'work-terms' ? 'border-indigo-600 text-indigo-700 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                2. Roster & Work Terms
              </button>
              <button
                onClick={() => setActiveTab('workflow')}
                className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'workflow' ? 'border-indigo-600 text-indigo-700 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                3. Sign-off Workflow
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'reminders' ? 'border-indigo-600 text-indigo-700 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                4. Auto-Reminders
              </button>
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Template Title</label>
                    <input
                      type="text"
                      className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                      value={selectedTemplate.title}
                      onChange={(e) => updateTemplateField('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Contract Scope Type</label>
                    <input
                      type="text"
                      className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                      value={selectedTemplate.type}
                      onChange={(e) => updateTemplateField('type', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Template Short Summary</label>
                  <input
                    type="text"
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    value={selectedTemplate.description}
                    onChange={(e) => updateTemplateField('description', e.target.value)}
                  />
                </div>

                {/* Variable Injections */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Inject Variable Field Placeholders</span>
                  <div className="flex flex-wrap gap-2">
                    {['[Client Name]', '[Company Name]', '[Start Date]', '[End Date]', '[Payment Terms]', '[Contract Fee]'].map((p) => (
                      <button
                        key={p}
                        onClick={() => injectPlaceholder(p)}
                        type="button"
                        className="bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-all shadow-3xs"
                      >
                        + {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">Contract Legal Terms Document Editor</label>
                    <button
                      type="button"
                      onClick={injectWorkTermsToContractBody}
                      className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded border border-indigo-150 transition-all"
                    >
                      + Inject Current Work Terms Provision
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    className="w-full bg-white text-slate-850 text-xs p-4 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                    value={selectedTemplate.terms}
                    onChange={(e) => updateTemplateField('terms', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Work Terms Config Tab (High-Fidelity WORK TERM BUTTONS) */}
            {activeTab === 'work-terms' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Employment & Work Terms</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Configure corporate rosters, working days, probation terms, notice period limits, and legal IP rights clauses.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Standard Work Hours per Day */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      Daily Work Hours Constraint
                    </label>
                    <div className="flex gap-2">
                      {[6, 8, 10].map((hours) => {
                        const isSel = selectedTemplate.workHoursPerDay === hours;
                        return (
                          <button
                            key={hours}
                            type="button"
                            onClick={() => updateTemplateField('workHoursPerDay', hours)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                              isSel 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            {hours} Hours
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Standard Work Days per Week */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      Expected Weekly Workdays
                    </label>
                    <div className="flex gap-2">
                      {[4, 5, 6].map((days) => {
                        const isSel = selectedTemplate.workDaysPerWeek === days;
                        return (
                          <button
                            key={days}
                            type="button"
                            onClick={() => updateTemplateField('workDaysPerWeek', days)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                              isSel 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            {days} Days
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Probation Notice */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
                      Probation Evaluation Notice
                    </label>
                    <div className="flex gap-2">
                      {['None', '1 Month', '3 Months', '6 Months'].map((prob) => {
                        const isSel = selectedTemplate.probationPeriod === prob;
                        return (
                          <button
                            key={prob}
                            type="button"
                            onClick={() => updateTemplateField('probationPeriod', prob)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all border ${
                              isSel 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            {prob}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Termination Notice Period */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-indigo-500" />
                      Notice Period Separation
                    </label>
                    <div className="flex gap-2">
                      {['Immediate', '15 Days', '30 Days', '60 Days'].map((notice) => {
                        const isSel = selectedTemplate.terminationNotice === notice;
                        return (
                          <button
                            key={notice}
                            type="button"
                            onClick={() => updateTemplateField('terminationNotice', notice)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all border ${
                              isSel 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            {notice}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Intellectual Property Rights Transfer */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-indigo-500" />
                      Intellectual Property Assignment
                    </label>
                    <div className="flex flex-col gap-2">
                      {[
                        'Immediate Transfer', 
                        'Transfer on Paid Invoice', 
                        'Shared Joint Ownership', 
                        'No Property Transfer'
                      ].map((ip) => {
                        const isSel = selectedTemplate.ipOwnership === ip;
                        return (
                          <button
                            key={ip}
                            type="button"
                            onClick={() => updateTemplateField('ipOwnership', ip)}
                            className={`w-full py-2 px-3 rounded-lg text-left text-xs font-bold transition-all border flex justify-between items-center ${
                              isSel 
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-extrabold' 
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100/70 border-slate-200'
                            }`}
                          >
                            <span>{ip}</span>
                            {isSel && <Check className="h-4 w-4 text-indigo-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Confidentiality Tiers */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                      Confidentiality Obligation
                    </label>
                    <div className="flex flex-col gap-2">
                      {[
                        'Standard Confidentiality', 
                        'Highly Confidential', 
                        'Strict 2-Way NDA Bound', 
                        'No Disclosure Restrictions'
                      ].map((conf) => {
                        const isSel = selectedTemplate.confidentiality === conf;
                        return (
                          <button
                            key={conf}
                            type="button"
                            onClick={() => updateTemplateField('confidentiality', conf)}
                            className={`w-full py-2 px-3 rounded-lg text-left text-xs font-bold transition-all border flex justify-between items-center ${
                              isSel 
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-extrabold' 
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100/70 border-slate-200'
                            }`}
                          >
                            <span>{conf}</span>
                            {isSel && <Check className="h-4 w-4 text-indigo-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs text-amber-800 mt-4">
                  <Info className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="space-y-1 font-semibold leading-relaxed">
                    <span className="font-extrabold text-amber-900 block">Work Terms Automation</span>
                    <p className="text-[11px]">These default rosters and legal provisions will be auto-attached when drafting a new job profile or hiring a candidate inside the ATS/Recruit module.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Workflow Tab */}
            {activeTab === 'workflow' && (
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800">1. Signature Authentication Method</h4>
                  <p className="text-[11px] text-slate-400">Configure how signees authorize and verify contract validity.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                      onClick={() => updateTemplateField('signatureType', 'draw')}
                      className={`p-4 border rounded-xl cursor-pointer text-center transition-all space-y-1.5 ${
                        selectedTemplate.signatureType === 'draw' 
                          ? 'border-indigo-500 bg-indigo-50/20' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold block text-slate-800">Draw Signature</span>
                      <p className="text-[10px] text-slate-400">Signees draw or upload handwritten digital graphics.</p>
                    </div>

                    <div
                      onClick={() => updateTemplateField('signatureType', 'type')}
                      className={`p-4 border rounded-xl cursor-pointer text-center transition-all space-y-1.5 ${
                        selectedTemplate.signatureType === 'type' 
                          ? 'border-indigo-500 bg-indigo-50/20' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold block text-slate-800">Text-Typed Initials</span>
                      <p className="text-[10px] text-slate-400">Type initials with secure cryptographic timestamp.</p>
                    </div>

                    <div
                      onClick={() => updateTemplateField('signatureType', 'otp')}
                      className={`p-4 border rounded-xl cursor-pointer text-center transition-all space-y-1.5 ${
                        selectedTemplate.signatureType === 'otp' 
                          ? 'border-indigo-500 bg-indigo-50/20' 
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold block text-slate-800">SMS / OTP Verified</span>
                      <p className="text-[10px] text-slate-400">Two-factor mobile passcode required for authorization.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-150 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">2. Sign-off Multi-Step Workflow Sequence</h4>
                  <div className="space-y-2.5">
                    {[
                      { step: 1, label: 'Document Authoring', role: 'Contract Manager / Creator' },
                      { step: 2, label: 'Client Approvals & Signatures', role: 'External Customer / Contractor' },
                      { step: 3, label: 'Executive Counter-Sign Off', role: 'Internal Legal Representative / CEO' }
                    ].map((stepObj) => (
                      <div key={stepObj.step} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-150/60 text-xs">
                        <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                          {stepObj.step}
                        </span>
                        <div>
                          <span className="font-bold text-slate-700 block">{stepObj.label}</span>
                          <span className="text-[10px] text-slate-400">Assigned: {stepObj.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reminders Tab */}
            {activeTab === 'reminders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-700 block">Automatic Reminders Trigger</span>
                    <p className="text-[11px] text-slate-400">Ping signees automatically if contract is left pending.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateTemplateField('autoReminder', !selectedTemplate.autoReminder)}
                    className="text-indigo-600 hover:text-indigo-700 cursor-pointer p-1"
                  >
                    <div className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      selectedTemplate.autoReminder ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform transform ${
                        selectedTemplate.autoReminder ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Reminder Frequency</label>
                    <select className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold">
                      <option>Every 2 days</option>
                      <option>Every 3 days (Recommended)</option>
                      <option>Every 5 days</option>
                      <option>Weekly</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Maximum Reminders Limit</label>
                    <select className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold">
                      <option>3 attempts max</option>
                      <option>5 attempts max</option>
                      <option>10 attempts max</option>
                      <option>Unlimited pings</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save bar */}
            <div className="flex justify-end border-t border-slate-150 pt-4">
              <button
                type="button"
                onClick={handleSaveAll}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-3xs hover:shadow-2xs transition-all"
              >
                <Save className="h-4 w-4" />
                Save Contract Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Template Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Create Agreement Template</span>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddTemplate} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Template Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Marketing Retainer Agreement"
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Agreement Category Type</label>
                <select
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option>NDA</option>
                  <option>Freelance</option>
                  <option>Consulting</option>
                  <option>Employment</option>
                  <option>Sales</option>
                  <option>General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe when to issue this document."
                  className="w-full bg-white text-slate-800 text-xs p-3 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer shadow-3xs"
                >
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
