/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { 
  Mail, Search, Plus, FileText, Download, Printer, Settings, Info, 
  Sparkles, Trash2, Edit3, Eye, ChevronRight, CheckCircle, Clock, 
  X, HelpCircle, FileSpreadsheet, List, AlignLeft
} from 'lucide-react';

interface GeneratedLetter {
  id: string;
  candidateName: string;
  type: string;
  createdDate: string;
  status: 'Accepted' | 'Pending Review' | 'Declined';
  salary: string;
  jobTitle: string;
  content: string;
  margins: { top: number; bottom: number; left: number; right: number };
}

interface LetterTemplate {
  id: string;
  title: string;
  type: string;
  content: string;
  variables: string[];
}

const INITIAL_LETTERS: GeneratedLetter[] = [
  { 
    id: 'LTR-901', 
    candidateName: 'Michael Corleone', 
    type: 'Employment Offer Letter', 
    createdDate: '2026-07-01', 
    status: 'Accepted', 
    salary: '$120,000 / Yr', 
    jobTitle: 'Senior Backend Engineer (Node/TS)',
    content: 'Dear [employee_name],\n\nWe are absolutely thrilled to offer you the position of [job_title] at Worksuite Corp! This offer is contingent upon successful biometric mapping setup.\n\nYour annual base remuneration is set at [salary], payable bi-monthly in equal installments via our secure payroll ledger. Your scheduled join date is July 20, 2026.\n\nPlease sign and scan this document to secure your starting date.',
    margins: { top: 20, bottom: 20, left: 20, right: 20 }
  },
  { 
    id: 'LTR-902', 
    candidateName: 'Harry Potter', 
    type: 'Employment Offer Letter', 
    createdDate: '2026-07-03', 
    status: 'Pending Review', 
    salary: '$110,000 / Yr', 
    jobTitle: 'Junior DevOps Associate',
    content: 'Dear [employee_name],\n\nWe are absolutely thrilled to offer you the position of [job_title] at Worksuite Corp! This offer is contingent upon successful biometric mapping setup.\n\nYour annual base remuneration is set at [salary], payable bi-monthly in equal installments via our secure payroll ledger. Your scheduled join date is July 20, 2026.\n\nPlease sign and scan this document to secure your starting date.',
    margins: { top: 25, bottom: 25, left: 20, right: 20 }
  },
  { 
    id: 'LTR-903', 
    candidateName: 'Elena Rostova', 
    type: 'Performance Appraisal Letter', 
    createdDate: '2026-06-15', 
    status: 'Accepted', 
    salary: '$105,000 / Yr', 
    jobTitle: 'Lead Engineering Partner',
    content: 'Dear [employee_name],\n\nBased on your exceptional performance and dedication to the [job_title] role at Worksuite, we are delighted to adjust your standard salary structure to [salary] effective immediately.\n\nThank you for your continuous contributions to our platform scaling efforts.',
    margins: { top: 20, bottom: 20, left: 20, right: 20 }
  }
];

const INITIAL_TEMPLATES: LetterTemplate[] = [
  {
    id: 'TMP-01',
    title: 'Standard Employment Offer Letter',
    type: 'Offer Letter',
    content: 'Dear [employee_name],\n\nWe are absolutely thrilled to offer you the position of [job_title] at Worksuite Corp! This offer is contingent upon successful biometric mapping setup.\n\nYour annual base remuneration is set at [salary], payable bi-monthly in equal installments via our secure payroll ledger. Your scheduled join date is July 20, 2026.\n\nPlease sign and scan this document to secure your starting date.',
    variables: ['employee_name', 'job_title', 'salary', 'company_name']
  },
  {
    id: 'TMP-02',
    title: 'Performance Appraisal Letter',
    type: 'Appraisal Letter',
    content: 'Dear [employee_name],\n\nBased on your exceptional performance and dedication to the [job_title] role at Worksuite, we are delighted to adjust your standard salary structure to [salary] effective immediately.\n\nThank you for your continuous contributions to our platform scaling efforts.',
    variables: ['employee_name', 'job_title', 'salary']
  },
  {
    id: 'TMP-03',
    title: 'Standard Warning Notice',
    type: 'Warning Notice',
    content: 'Dear [employee_name],\n\nThis letter serves as a formal warning regarding attendance discrepancies logged on corporate biometric terminals.\n\nPlease ensure your device keys are synced properly.',
    variables: ['employee_name', 'company_name']
  }
];

interface LetterTabProps {
  subTab: string;
}

export default function LetterTab({ subTab }: LetterTabProps) {
  const [letters, setLetters] = useState<GeneratedLetter[]>(INITIAL_LETTERS);
  const [templates, setTemplates] = useState<LetterTemplate[]>(INITIAL_TEMPLATES);

  // Search filter states
  const [letterSearch, setLetterSearch] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');

  // Navigation Sub-states
  const [currentView, setCurrentView] = useState<'list' | 'add-letter' | 'add-template'>('list');
  const [selectedLetterForPreview, setSelectedLetterForPreview] = useState<GeneratedLetter | null>(INITIAL_LETTERS[0]);

  // Track landing screen status for each subTab - bypassed to show list directly
  const [hasOpenedList, setHasOpenedList] = useState<Record<string, boolean>>({
    'recruit-offers': true,
    'letter-templates': true,
    'letter-generator': true,
  });

  React.useEffect(() => {
    setCurrentView('list');
  }, [subTab]);

  // Form states
  const [letterType, setLetterType] = useState('Employment Offer Letter');
  const [candidateName, setCandidateName] = useState('John Doe');
  const [jobTitle, setJobTitle] = useState('Senior Product Designer');
  const [salary, setSalary] = useState('$115,000 / Yr');
  const [editorContent, setEditorContent] = useState(INITIAL_TEMPLATES[0].content);
  const [margins, setMargins] = useState({ top: 20, bottom: 20, left: 20, right: 20 });

  // Template Form states
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateType, setNewTemplateType] = useState('Offer Letter');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  // Pagination
  const [letterPage, setLetterPage] = useState(1);
  const [templatePage, setTemplatePage] = useState(1);
  const itemsPerPage = 5;

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Variables panel mapping
  const availableVariables = [
    { label: 'Employee Name', token: '[employee_name]', placeholder: candidateName },
    { label: 'Job Title', token: '[job_title]', placeholder: jobTitle },
    { label: 'Annual Salary', token: '[salary]', placeholder: salary },
    { label: 'Company Name', token: '[company_name]', placeholder: 'Worksuite S.R.L' }
  ];

  const handleInsertVariable = (token: string, isTemplate: boolean = false) => {
    if (isTemplate) {
      setNewTemplateContent(prev => prev + ' ' + token);
    } else {
      setEditorContent(prev => prev + ' ' + token);
    }
    showToast(`Inserted variable tag: ${token}`);
  };

  // Live content replacement logic for preview rendering
  const renderedPreviewContent = useMemo(() => {
    let replaced = editorContent;
    replaced = replaced.replaceAll('[employee_name]', candidateName || 'John Doe');
    replaced = replaced.replaceAll('[job_title]', jobTitle || 'Senior Product Designer');
    replaced = replaced.replaceAll('[salary]', salary || '$115,000 / Yr');
    replaced = replaced.replaceAll('[company_name]', 'Worksuite S.R.L');
    return replaced;
  }, [editorContent, candidateName, jobTitle, salary]);

  // Letter List filtering
  const filteredLetters = useMemo(() => {
    return letters.filter(l => {
      const matchSearch = l.candidateName.toLowerCase().includes(letterSearch.toLowerCase()) || 
                          l.jobTitle.toLowerCase().includes(letterSearch.toLowerCase()) ||
                          l.type.toLowerCase().includes(letterSearch.toLowerCase());
      return matchSearch;
    });
  }, [letters, letterSearch]);

  const paginatedLetters = useMemo(() => {
    const startIndex = (letterPage - 1) * itemsPerPage;
    return filteredLetters.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLetters, letterPage]);

  // Template List filtering
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
                          t.type.toLowerCase().includes(templateSearch.toLowerCase());
      return matchSearch;
    });
  }, [templates, templateSearch]);

  const paginatedTemplates = useMemo(() => {
    const startIndex = (templatePage - 1) * itemsPerPage;
    return filteredTemplates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTemplates, templatePage]);

  const handleCreateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    const created: GeneratedLetter = {
      id: `LTR-0${letters.length + 1}`,
      candidateName,
      type: letterType,
      createdDate: new Date().toISOString().slice(0, 10),
      status: 'Pending Review',
      salary,
      jobTitle,
      content: editorContent,
      margins
    };

    setLetters([created, ...letters]);
    setSelectedLetterForPreview(created);
    setCurrentView('list');
    showToast(`Official Letter for "${candidateName}" drafted successfully!`);
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle || !newTemplateContent) {
      alert("Please fill in template title and content draft.");
      return;
    }

    const created: LetterTemplate = {
      id: `TMP-0${templates.length + 1}`,
      title: newTemplateTitle,
      type: newTemplateType,
      content: newTemplateContent,
      variables: ['employee_name', 'job_title', 'salary', 'company_name']
    };

    setTemplates([created, ...templates]);
    setNewTemplateTitle('');
    setNewTemplateContent('');
    setCurrentView('list');
    showToast(`Corporate Letter Template "${created.title}" configured!`);
  };

  const handleDeleteLetter = (id: string) => {
    if (confirm("Are you sure you want to delete this drafted letter record?")) {
      setLetters(letters.filter(l => l.id !== id));
      if (selectedLetterForPreview?.id === id) {
        setSelectedLetterForPreview(null);
      }
      showToast("Drafted letter deleted.");
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template layout?")) {
      setTemplates(templates.filter(t => t.id !== id));
      showToast("Template deleted.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div id="letter-toast" className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold py-3 px-5 rounded-xl border border-slate-700 flex items-center gap-2.5 shadow-2xl animate-fade-in">
          <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400/20" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Mail className="h-6 w-6 text-indigo-600 animate-pulse" />
            <span className="capitalize">
              {subTab === 'recruit-offers' ? 'Employment Offer Letters' :
               subTab === 'letter-templates' ? 'Corporate Letter Templates' : 'Standard Letter Generator'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {subTab === 'recruit-offers' ? 'Generate, review, and print official candidate employment contract offers.' :
             subTab === 'letter-templates' ? 'Edit or design standardized letterheads, warnings, and evaluation structures.' :
             'Customize margin metrics, drag variables, and print real-time letter layouts.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasOpenedList[subTab] && (
            <>
              {currentView === 'list' ? (
                subTab === 'letter-templates' ? (
                  <button
                    id="btn-add-template-view"
                    onClick={() => setCurrentView('add-template')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Configure Template</span>
                  </button>
                ) : (
                  <button
                    id="btn-add-letter-view"
                    onClick={() => {
                      setEditorContent(INITIAL_TEMPLATES[0].content);
                      setCurrentView('add-letter');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Generate Official Letter</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => setCurrentView('list')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200"
                >
                  Back to Directory
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* LANDING SCREEN (If list is not opened and forms are closed) */}
      {/* ========================================================= */}
      {!hasOpenedList[subTab] && currentView === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm my-8 space-y-6 animate-fade-in">
          {/* Branded Icon Frame */}
          <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
            <Mail className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {subTab === 'recruit-offers' && 'Offer Letter Directory'}
              {subTab === 'letter-templates' && 'Standardized Letter Templates'}
              {subTab === 'letter-generator' && 'Standard Letter Generator'}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              {subTab === 'recruit-offers' && 'Draft, review, map, and approve binding employment offer letter contracts for upcoming hires and contractors.'}
              {subTab === 'letter-templates' && 'Organize, edit, and store standard templates for warnings, promotions, job offers, or termination documents.'}
              {subTab === 'letter-generator' && 'A powerful, variable-enabled drag and drop compiler to produce polished and printable formal letters in real time.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setHasOpenedList(prev => ({ ...prev, [subTab]: true }));
                if (subTab === 'letter-templates') {
                  setCurrentView('add-template');
                } else {
                  setEditorContent(INITIAL_TEMPLATES[0].content);
                  setCurrentView('add-letter');
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>
                {subTab === 'letter-templates' ? 'Create New Template' : 'Draft Offer Letter'}
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
          TAB 1 & 3: GENERATE / OFFERS TAB - DIRECTORY & ADD VIEW
          ---------------------------------------------------- */}
      {(subTab === 'recruit-offers' || subTab === 'letter-generator') && (hasOpenedList[subTab] || currentView !== 'list') && (
        <div className="space-y-6">
          {currentView === 'add-letter' ? (
            /* GENERATOR WORKSPACE */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form & Editor controls */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs h-fit">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">Configure Remuneration & Details</h4>
                  <p className="text-xs text-slate-400">Fill in details and use variables to update the letter preview live.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 font-mono">Letter Template Category</label>
                    <select 
                      className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                      value={letterType}
                      onChange={(e) => {
                        setLetterType(e.target.value);
                        // Bind default editor contents matching template
                        const match = INITIAL_TEMPLATES.find(t => t.title.toLowerCase().includes(e.target.value.toLowerCase().split(' ')[0]));
                        if (match) setEditorContent(match.content);
                      }}
                    >
                      <option value="Employment Offer Letter">Employment Offer Letter</option>
                      <option value="Performance Appraisal Letter">Performance Appraisal Letter</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 font-mono">Candidate Name</label>
                      <input 
                        type="text"
                        className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-semibold"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 font-mono">Job Title</label>
                      <input 
                        type="text"
                        className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-semibold"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 font-mono">Offered Remuneration</label>
                      <input 
                        type="text"
                        className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-semibold"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 font-mono">Letter Expiry Date</label>
                      <input 
                        type="date"
                        defaultValue="2026-07-15"
                        className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Margins Settings */}
                  <div className="border-t border-slate-100 pt-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <Settings className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Print Margins Settings (mm)</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">Top</span>
                        <input type="number" className="w-full bg-slate-50 text-slate-800 p-1.5 rounded-lg border border-slate-200 focus:outline-none font-mono text-center font-bold" value={margins.top} onChange={(e) => setMargins({...margins, top: parseInt(e.target.value) || 0})} />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">Bottom</span>
                        <input type="number" className="w-full bg-slate-50 text-slate-800 p-1.5 rounded-lg border border-slate-200 focus:outline-none font-mono text-center font-bold" value={margins.bottom} onChange={(e) => setMargins({...margins, bottom: parseInt(e.target.value) || 0})} />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">Left</span>
                        <input type="number" className="w-full bg-slate-50 text-slate-800 p-1.5 rounded-lg border border-slate-200 focus:outline-none font-mono text-center font-bold" value={margins.left} onChange={(e) => setMargins({...margins, left: parseInt(e.target.value) || 0})} />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">Right</span>
                        <input type="number" className="w-full bg-slate-50 text-slate-800 p-1.5 rounded-lg border border-slate-200 focus:outline-none font-mono text-center font-bold" value={margins.right} onChange={(e) => setMargins({...margins, right: parseInt(e.target.value) || 0})} />
                      </div>
                    </div>
                  </div>

                  {/* Variables selector */}
                  <div className="border-t border-slate-100 pt-3 space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Available Tokens (Click to Insert)</label>
                    <div className="flex flex-wrap gap-1">
                      {availableVariables.map((v, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleInsertVariable(v.token)}
                          className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          {v.token}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Standardized rich text editor simulation */}
                  <div className="border-t border-slate-100 pt-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Standardized Body Content Editor</label>
                    <textarea 
                      className="w-full h-44 bg-slate-50 text-slate-800 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-xs leading-relaxed"
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2.5 pt-3">
                    <button
                      type="button"
                      onClick={() => setCurrentView('list')}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-center"
                    >
                      Discard Draft
                    </button>
                    <button
                      onClick={handleCreateLetter}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-center shadow-md shadow-indigo-600/10"
                    >
                      Approve and Draft
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time PDF Printable view representation */}
              <div className="lg:col-span-7 bg-slate-100 rounded-2xl p-6 flex flex-col justify-between border border-slate-200 overflow-y-auto max-h-[720px] shadow-inner">
                {/* Print layout representation with exact MM padding constraints */}
                <div 
                  className="bg-white rounded-lg shadow-2xl border border-slate-200 p-8 flex flex-col justify-between font-serif relative overflow-hidden"
                  style={{
                    paddingTop: `${margins.top}mm`,
                    paddingBottom: `${margins.bottom}mm`,
                    paddingLeft: `${margins.left}mm`,
                    paddingRight: `${margins.right}mm`,
                  }}
                >
                  {/* Watermark brand icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100 opacity-20 pointer-events-none text-9xl font-black font-sans select-none tracking-widest leading-none">
                    WORKSUITE
                  </div>

                  <div className="border-b-2 border-indigo-100 pb-5 mb-5 flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="text-lg font-black tracking-wider text-slate-900 font-sans">WORKSUITE S.R.L</h4>
                      <p className="text-[10px] text-slate-400 font-mono">100 Pine Street, San Francisco, CA 94111</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-black text-lg font-sans shadow-sm select-none">
                      W
                    </div>
                  </div>

                  <div className="space-y-4 text-xs text-slate-800 leading-relaxed min-h-[300px]">
                    <p className="font-mono text-slate-400 text-[10px]">Reference Code: WS-LTR-DRAFT</p>
                    <p className="font-bold font-sans">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <div className="space-y-0.5 font-sans text-slate-700">
                      <p className="font-bold">To: {candidateName || '[candidate_name]'}</p>
                      <p className="text-slate-400 text-[10px]">Candidate Pool ID: CAND-001X</p>
                    </div>

                    <h3 className="text-xs font-bold text-indigo-700 bg-indigo-50/50 border-l-2 border-indigo-600 px-2 py-1 uppercase tracking-wide font-sans">
                      Subject: Official correspondence regarding {jobTitle}
                    </h3>

                    <p className="whitespace-pre-line font-serif text-slate-800 leading-relaxed text-xs">
                      {renderedPreviewContent}
                    </p>

                    <div className="pt-8 flex justify-between items-end font-sans text-[11px] text-slate-500">
                      <div>
                        <div className="h-8 w-24 border-b border-slate-200 italic text-slate-300 flex items-end pb-1 text-[10px]">Authorized Signature</div>
                        <p className="font-bold text-slate-900 mt-2">Zara Khan</p>
                        <p className="text-[10px] text-slate-400">Executive Director HR</p>
                      </div>
                      <div className="text-right">
                        <div className="h-8 w-24 border-b border-slate-200 ml-auto"></div>
                        <p className="font-bold text-slate-900 mt-2">{candidateName || '[candidate_signature]'}</p>
                        <p className="text-[10px] text-slate-400">Recipient Signature</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => alert('PDF Export downloaded to local drive.')} className="flex-1 bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 rounded-xl text-center text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Download className="h-4 w-4 text-slate-300" />
                    <span>Download PDF Document</span>
                  </button>
                  <button onClick={() => window.print()} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-2 rounded-xl text-center text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Printer className="h-4 w-4 text-slate-500" />
                    <span>Print Correspondence</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* DIRECTORY / LIST SCREEN */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              {/* Directory List Table */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <List className="h-4.5 w-4.5 text-indigo-500" />
                    <span>Letter Records Directory</span>
                  </h3>
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search candidate name, title..."
                      className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                      value={letterSearch}
                      onChange={(e) => { setLetterSearch(e.target.value); setLetterPage(1); }}
                    />
                  </div>
                </div>

                {/* Letters Table */}
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="px-4 py-3">Employee/Candidate</th>
                        <th className="px-4 py-3">Letter Type</th>
                        <th className="px-4 py-3 font-mono">Date Sourced</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {paginatedLetters.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-12 text-center text-slate-400 italic">No letters matching your search directory.</td>
                        </tr>
                      ) : (
                        paginatedLetters.map(l => (
                          <tr key={l.id} className={`hover:bg-slate-50/30 font-semibold cursor-pointer ${selectedLetterForPreview?.id === l.id ? 'bg-indigo-50/20 border-l-2 border-indigo-500' : ''}`} onClick={() => setSelectedLetterForPreview(l)}>
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-900 leading-tight">{l.candidateName}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{l.jobTitle}</p>
                            </td>
                            <td className="px-4 py-3 text-indigo-600 truncate max-w-[150px]">{l.type}</td>
                            <td className="px-4 py-3 font-mono text-slate-400 text-[10px]">{l.createdDate}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLetter(l.id);
                                }}
                                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredLetters.length > itemsPerPage && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-400">
                    <span>Page {letterPage} of {Math.ceil(filteredLetters.length / itemsPerPage)}</span>
                    <div className="flex gap-1">
                      <button disabled={letterPage === 1} onClick={() => setLetterPage(letterPage - 1)} className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded disabled:opacity-50">Prev</button>
                      <button disabled={letterPage * itemsPerPage >= filteredLetters.length} onClick={() => setLetterPage(letterPage + 1)} className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded disabled:opacity-50">Next</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Side Live Rendered Preview Pane */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs h-fit min-h-[400px]">
                {selectedLetterForPreview ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{selectedLetterForPreview.id}</span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">SaaS Portal Document Preview</h4>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => alert('PDF report exported.')} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors" title="Export PDF"><Download className="h-4 w-4" /></button>
                        <button onClick={() => window.print()} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors" title="Print Letter"><Printer className="h-4 w-4" /></button>
                      </div>
                    </div>

                    {/* Miniature interactive letter card */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 font-serif text-[11px] leading-relaxed text-slate-800">
                      <div className="border-b border-slate-200 pb-2 flex justify-between items-start font-sans">
                        <span className="font-bold text-slate-900 text-[10px]">WORKSUITE S.R.L</span>
                        <span className="text-indigo-600 font-black text-xs">W</span>
                      </div>
                      <p className="font-mono text-[9px] text-slate-400">Date: {selectedLetterForPreview.createdDate}</p>
                      <p className="font-bold font-sans">To: {selectedLetterForPreview.candidateName}</p>
                      <p className="font-bold text-slate-900 font-sans border-l-2 border-indigo-500 pl-1.5">Subject: {selectedLetterForPreview.type}</p>
                      
                      <p className="whitespace-pre-line text-slate-600 font-serif leading-relaxed text-[11px]">
                        {selectedLetterForPreview.content
                          .replaceAll('[employee_name]', selectedLetterForPreview.candidateName)
                          .replaceAll('[job_title]', selectedLetterForPreview.jobTitle)
                          .replaceAll('[salary]', selectedLetterForPreview.salary)
                          .replaceAll('[company_name]', 'Worksuite S.R.L')}
                      </p>
                      
                      <div className="pt-4 flex justify-between font-sans text-[9px] text-slate-400">
                        <div>
                          <p className="font-bold text-slate-800">Zara Khan</p>
                          <p>Executive HR</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">{selectedLetterForPreview.candidateName}</p>
                          <p>Recipient Sign</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 italic py-16">
                    <Mail className="h-8 w-8 mb-2 text-slate-300" />
                    <span>Select a letter row to preview corporate layout.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: LETTER TEMPLATES TAB - DIRECTORY & ADD VIEW
          ---------------------------------------------------- */}
      {subTab === 'letter-templates' && (hasOpenedList[subTab] || currentView !== 'list') && (
        <div className="space-y-6">
          {currentView === 'add-template' ? (
            /* CONFIGURE TEMPLATE FORM */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900">Configure Standard Letterhead Template</h3>
                  <p className="text-xs text-slate-400">Add corporate guidelines and standardized text blocks with customizable tokens.</p>
                </div>

                <form onSubmit={handleCreateTemplate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 font-mono">Template Title *</label>
                      <input 
                        type="text" required
                        placeholder="e.g. Standard Relocation Appraisal Letter"
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                        value={newTemplateTitle}
                        onChange={(e) => setNewTemplateTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 font-mono">Template Category *</label>
                      <select 
                        className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                        value={newTemplateType}
                        onChange={(e) => setNewTemplateType(e.target.value)}
                      >
                        <option value="Offer Letter">Offer Letter Template</option>
                        <option value="Appraisal Letter">Appraisal Letter Template</option>
                        <option value="Warning Notice">Warning Notice Template</option>
                        <option value="Standard Ledger Notification">Standard Ledger Notification</option>
                      </select>
                    </div>
                  </div>

                  {/* Template body textarea */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex justify-between items-center">
                      <span>Standardized Body Layout Content *</span>
                      <span className="text-[10px] text-indigo-600 font-mono">Variables allowed: employee_name, job_title, salary</span>
                    </label>
                    <textarea 
                      required
                      placeholder="Dear [employee_name],\n\nWe are pleased to transition your corporate seat..."
                      className="w-full h-60 bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                      value={newTemplateContent}
                      onChange={(e) => setNewTemplateContent(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCurrentView('list')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl"
                    >
                      Cancel Setup
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
                    >
                      Save Template Layout
                    </button>
                  </div>
                </form>
              </div>

              {/* Side Guide panel with insertion click triggers */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs h-fit">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlignLeft className="h-4.5 w-4.5 text-indigo-500" />
                  <span>Insert Variable Tokens</span>
                </h4>
                <p className="text-xs text-slate-400">Click any token below to append it directly to your template body content editor area.</p>
                <div className="space-y-2">
                  {availableVariables.map((v, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInsertVariable(v.token, true)}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-150 rounded-xl text-left cursor-pointer transition-all"
                    >
                      <span className="text-xs font-bold text-slate-700">{v.label}</span>
                      <span className="font-mono text-[10px] bg-white border border-slate-200 text-indigo-700 font-black px-2 py-0.5 rounded">{v.token}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* TEMPLATE DIRECTORY TABLE */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600 animate-pulse" />
                  <span>Active Corporate Contract Templates</span>
                </h3>
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search template title, type..."
                    className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                    value={templateSearch}
                    onChange={(e) => { setTemplateSearch(e.target.value); setTemplatePage(1); }}
                  />
                </div>
              </div>

              {/* Templates table */}
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="px-6 py-3.5">Template Name</th>
                      <th className="px-6 py-3.5">Template Type / Group</th>
                      <th className="px-6 py-3.5">Approved System Tokens</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {paginatedTemplates.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No templates registered yet.</td>
                      </tr>
                    ) : (
                      paginatedTemplates.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/40">
                          <td className="px-6 py-4 font-bold text-slate-900">{t.title}</td>
                          <td className="px-6 py-4">
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-100">
                              {t.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-400 text-[10px]">
                            <div className="flex flex-wrap gap-1">
                              {t.variables.map((v, i) => (
                                <span key={i} className="bg-slate-100 border border-slate-200/50 text-slate-600 px-1.5 py-0.5 rounded">
                                  [{v}]
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditorContent(t.content);
                                  setLetterType(t.title.includes('Offer') ? 'Employment Offer Letter' : 'Performance Appraisal Letter');
                                  setCurrentView('add-letter');
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 cursor-pointer"
                              >
                                Draft with Template
                              </button>
                              <button
                                onClick={() => handleDeleteTemplate(t.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
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
              {filteredTemplates.length > itemsPerPage && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-400">
                  <span>Showing {((templatePage - 1) * itemsPerPage) + 1} - {Math.min(templatePage * itemsPerPage, filteredTemplates.length)} of {filteredTemplates.length} Templates</span>
                  <div className="flex gap-1">
                    <button disabled={templatePage === 1} onClick={() => setTemplatePage(templatePage - 1)} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs">Prev</button>
                    <button disabled={templatePage * itemsPerPage >= filteredTemplates.length} onClick={() => setTemplatePage(templatePage + 1)} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
