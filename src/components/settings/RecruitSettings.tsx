import React, { useState } from 'react';
import { 
  UserCheck, Plus, Edit2, Trash2, X, Check, Eye, HelpCircle, 
  Upload, Search, ChevronLeft, ChevronRight, Settings, 
  Mail, MessageSquare, AlertCircle, HelpCircle as HelpIcon, FileText,
  Briefcase, CheckSquare, ListPlus, ToggleLeft, ToggleRight,
  ArrowUpDown, MoreVertical
} from 'lucide-react';

interface RecruitSettingsProps {
  onNotify: (message: string) => void;
}

// ------------------------------------
// Core Types definitions
// ------------------------------------
interface FooterLink {
  id: string;
  title: string;
  slug: string;
  status: 'Active' | 'Inactive';
  description: string;
}

interface Recruiter {
  id: string;
  name: string;
  role: string;
  status: 'Enabled' | 'Disabled';
  avatar: string;
}

interface JobStatus {
  id: string;
  name: string;
  category: 'applied' | 'shortlist' | 'interview' | 'hired' | 'rejected';
  color: string;
  position: number;
  applyModelActions: boolean;
}

interface CustomQuestion {
  id: string;
  question: string;
  category: 'Job Application' | 'Interview' | 'Candidate';
  type: string;
  isRequired: 'Yes' | 'No';
  status: 'Enable' | 'Disable';
}

interface CustomField {
  id: string;
  category: string;
  label: string;
  type: string;
  values: string[];
  required: 'Yes' | 'No';
  showInTable: boolean;
  allowExport: boolean;
}

// Simple Rich Text Editor mock for editing About Company & Footer link descriptions
const RICH_TEXT_BUTTONS = [
  { label: 'Normal', value: 'normal', type: 'dropdown' },
  { label: 'B', value: 'bold', style: 'font-bold' },
  { label: 'I', value: 'italic', style: 'italic' },
  { label: 'U', value: 'underline', style: 'underline' },
  { label: 'S', value: 'strike', style: 'line-through' },
  { label: 'Link', value: 'link' },
  { label: 'Image', value: 'image' },
  { label: 'Table', value: 'table' },
  { label: 'Emoji', value: 'emoji' },
  { label: 'Undo', value: 'undo' },
  { label: 'Redo', value: 'redo' }
];

export default function RecruitSettings({ onNotify }: RecruitSettingsProps) {
  // Tabs: General, Footer Settings, Recruiter Settings, Notification, Job Application Status, Custom Question, Custom Fields
  const [activeTab, setActiveTab] = useState<'general' | 'footer' | 'recruiter' | 'notification' | 'status' | 'question' | 'fields'>('general');

  // Search states for lists
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting and Pagination
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ------------------------------------
  // 1. General Tab States
  // ------------------------------------
  const [enableCareerSite, setEnableCareerSite] = useState(true);
  const [googleRecaptcha, setGoogleRecaptcha] = useState(false);
  const [jobAlert, setJobAlert] = useState(false);
  const [companyName, setCompanyName] = useState('Worksuite');
  const [companyWebsite, setCompanyWebsite] = useState('https://worksuite.biz');
  const [companyLogo, setCompanyLogo] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop'); // yellow-orange artistic abstract
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [aboutCompany, setAboutCompany] = useState(
    "A leader in innovative solutions\n\nAbout Us\nDummy Company was founded in 2020 with a mission to provide innovative solutions for a better tomorrow. We have a team of experts in various fields who work together to bring cutting-edge products and services to market. Our focus on quality and customer satisfaction has made us a trusted name in the industry."
  );

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      onNotify('Error: Company Name is required.');
      return;
    }
    onNotify('General Recruit settings saved successfully.');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      onNotify('Logo replaced successfully.');
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setCompanyLogo('');
    onNotify('Logo removed.');
  };

  // ------------------------------------
  // 2. Footer Settings States
  // ------------------------------------
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([
    { id: '1', title: 'Terms of Service', slug: 'terms-of-service', status: 'Active', description: 'Standard terms of service for candidates applying to positions.' },
    { id: '2', title: 'Privacy Policy', slug: 'privacy-policy', status: 'Active', description: 'Privacy policies describing candidate data safety regulations.' },
    { id: '3', title: 'Career FAQs', slug: 'career-faqs', status: 'Active', description: 'Frequently asked questions regarding our application and hiring timeline.' }
  ]);
  const [showFooterModal, setShowFooterModal] = useState(false);
  const [editingFooter, setEditingFooter] = useState<FooterLink | null>(null);
  const [footerForm, setFooterForm] = useState({
    title: '',
    slug: '',
    status: 'Active' as 'Active' | 'Inactive',
    description: ''
  });

  const handleOpenFooterModal = (link: FooterLink | null = null) => {
    if (link) {
      setEditingFooter(link);
      setFooterForm({
        title: link.title,
        slug: link.slug,
        status: link.status,
        description: link.description
      });
    } else {
      setEditingFooter(null);
      setFooterForm({
        title: '',
        slug: '',
        status: 'Active',
        description: ''
      });
    }
    setShowFooterModal(true);
  };

  const handleSaveFooterLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerForm.title.trim()) {
      onNotify('Title is required.');
      return;
    }
    if (!footerForm.slug.trim()) {
      onNotify('Slug is required.');
      return;
    }

    if (editingFooter) {
      setFooterLinks(prev => prev.map(item => item.id === editingFooter.id ? { ...item, ...footerForm } : item));
      onNotify(`Footer link "${footerForm.title}" updated.`);
    } else {
      const newLink: FooterLink = {
        id: Date.now().toString(),
        ...footerForm
      };
      setFooterLinks(prev => [...prev, newLink]);
      onNotify(`Footer link "${footerForm.title}" added successfully.`);
    }
    setShowFooterModal(false);
  };

  const handleDeleteFooterLink = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete footer link "${title}"?`)) {
      setFooterLinks(prev => prev.filter(item => item.id !== id));
      onNotify(`Footer link "${title}" has been deleted.`);
    }
  };

  const handleToggleFooterStatus = (id: string) => {
    setFooterLinks(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
        onNotify(`Status of "${item.title}" changed to ${nextStatus}.`);
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  // ------------------------------------
  // 3. Recruiter Settings States
  // ------------------------------------
  const [recruiters, setRecruiters] = useState<Recruiter[]>([
    { id: '1', name: 'Mathew Crist', role: 'Junior Recruiter', status: 'Enabled', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces' },
    { id: '2', name: 'Aria Montgomery', role: 'Senior Talent Lead', status: 'Enabled', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
    { id: '3', name: 'Augustus Sterling', role: 'Staffing VP', status: 'Enabled', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces' }
  ]);
  const [showRecruiterModal, setShowRecruiterModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const MOCK_EMPLOYEES = [
    { id: 'emp_1', name: 'Spencer Hastings', role: 'HR Generalist', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces' },
    { id: 'emp_2', name: 'Emily Fields', role: 'Technical Screener', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces' },
    { id: 'emp_3', name: 'Hanna Marin', role: 'Employee Relations Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' }
  ];

  const handleAddRecruiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      onNotify('Please select an employee to add as Recruiter.');
      return;
    }
    const emp = MOCK_EMPLOYEES.find(e => e.id === selectedEmployeeId);
    if (emp) {
      // Check if already in recruiters
      if (recruiters.some(r => r.name === emp.name)) {
        onNotify(`${emp.name} is already designated as a recruiter.`);
        return;
      }
      const newRecruiter: Recruiter = {
        id: Date.now().toString(),
        name: emp.name,
        role: emp.role,
        status: 'Enabled',
        avatar: emp.avatar
      };
      setRecruiters(prev => [...prev, newRecruiter]);
      onNotify(`${emp.name} added as a recruiter.`);
    }
    setShowRecruiterModal(false);
    setSelectedEmployeeId('');
  };

  const handleDeleteRecruiter = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from recruiters?`)) {
      setRecruiters(prev => prev.filter(r => r.id !== id));
      onNotify(`Recruiter "${name}" removed.`);
    }
  };

  const handleToggleRecruiterStatus = (id: string, status: 'Enabled' | 'Disabled') => {
    setRecruiters(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    onNotify(`Recruiter status updated.`);
  };

  // ------------------------------------
  // 4. Notification Settings States
  // ------------------------------------
  const [mailApplied, setMailApplied] = useState(true);
  const [mailPhoneScreen, setMailPhoneScreen] = useState(true);
  const [mailInterview, setMailInterview] = useState(true);
  const [mailHired, setMailHired] = useState(true);
  const [mailRejected, setMailRejected] = useState(true);

  const [notifNewJob, setNotifNewJob] = useState(true);
  const [notifNewJobApp, setNotifNewJobApp] = useState(true);
  const [notifInterviewSchedule, setNotifInterviewSchedule] = useState(true);
  const [notifOfferLetter, setNotifOfferLetter] = useState(true);
  const [notifToRecruiter, setNotifToRecruiter] = useState(true);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Mail and email notification options updated.');
  };

  // ------------------------------------
  // 5. Job Application Status States
  // ------------------------------------
  const [jobStatuses, setJobStatuses] = useState<JobStatus[]>([
    { id: '1', name: 'applied', category: 'applied', color: '#2b2b2b', position: 1, applyModelActions: true },
    { id: '2', name: 'phone screen', category: 'shortlist', color: '#f1e52e', position: 2, applyModelActions: true },
    { id: '3', name: 'interview', category: 'interview', color: '#3d8ee8', position: 3, applyModelActions: true },
    { id: '4', name: 'hired', category: 'hired', color: '#32ac16', position: 4, applyModelActions: true },
    { id: '5', name: 'rejected', category: 'rejected', color: '#ee1127', position: 5, applyModelActions: true }
  ]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<JobStatus | null>(null);
  const [statusForm, setStatusForm] = useState({
    category: 'applied' as 'applied' | 'shortlist' | 'interview' | 'hired' | 'rejected',
    name: '',
    color: '#3B82F6',
    position: 1,
    applyModelActions: true
  });

  const handleOpenStatusModal = (statusItem: JobStatus | null = null) => {
    if (statusItem) {
      setEditingStatus(statusItem);
      setStatusForm({
        category: statusItem.category,
        name: statusItem.name,
        color: statusItem.color,
        position: statusItem.position,
        applyModelActions: statusItem.applyModelActions
      });
    } else {
      setEditingStatus(null);
      setStatusForm({
        category: 'applied',
        name: '',
        color: '#3B82F6',
        position: jobStatuses.length + 1,
        applyModelActions: true
      });
    }
    setShowStatusModal(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusForm.name.trim()) {
      onNotify('Status Name is required.');
      return;
    }

    if (editingStatus) {
      setJobStatuses(prev => prev.map(s => s.id === editingStatus.id ? { ...s, ...statusForm } : s));
      onNotify(`Job status "${statusForm.name}" updated.`);
    } else {
      const newStatus: JobStatus = {
        id: Date.now().toString(),
        ...statusForm
      };
      setJobStatuses(prev => [...prev, newStatus]);
      onNotify(`Job status "${statusForm.name}" added.`);
    }
    setShowStatusModal(false);
  };

  const handleDeleteStatus = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete status Column "${name}"?`)) {
      setJobStatuses(prev => prev.filter(s => s.id !== id));
      onNotify(`Job status "${name}" deleted.`);
    }
  };

  // ------------------------------------
  // 6. Custom Question States
  // ------------------------------------
  const [questions, setQuestions] = useState<CustomQuestion[]>([
    { id: '1', question: 'What is your current notice period?', category: 'Job Application', type: 'Dropdown', isRequired: 'Yes', status: 'Enable' },
    { id: '2', question: 'Attach portfolio link (Behance, Dribbble, GitHub)', category: 'Candidate', type: 'Text', isRequired: 'No', status: 'Enable' },
    { id: '3', question: 'Describe your most successful project management challenge.', category: 'Interview', type: 'Textarea', isRequired: 'Yes', status: 'Enable' }
  ]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState({
    category: 'Job Application' as 'Job Application' | 'Interview' | 'Candidate',
    question: '',
    status: 'Enable' as 'Enable' | 'Disable',
    isRequired: 'Yes' as 'Yes' | 'No',
    type: 'Text'
  });

  const handleOpenQuestionModal = (q: CustomQuestion | null = null) => {
    if (q) {
      setEditingQuestion(q);
      setQuestionForm({
        category: q.category,
        question: q.question,
        status: q.status,
        isRequired: q.isRequired,
        type: q.type
      });
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        category: 'Job Application',
        question: '',
        status: 'Enable',
        isRequired: 'Yes',
        type: 'Text'
      });
    }
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.question.trim()) {
      onNotify('Question text is required.');
      return;
    }

    if (editingQuestion) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? { ...q, ...questionForm } : q));
      onNotify(`Question updated successfully.`);
    } else {
      const newQ: CustomQuestion = {
        id: Date.now().toString(),
        ...questionForm
      };
      setQuestions(prev => [...prev, newQ]);
      onNotify(`Custom question added.`);
    }
    setShowQuestionModal(false);
  };

  const handleDeleteQuestion = (id: string, qText: string) => {
    if (confirm(`Are you sure you want to delete question: "${qText.substring(0, 30)}..."?`)) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      onNotify('Question deleted.');
    }
  };

  // ------------------------------------
  // 7. Custom Fields States
  // ------------------------------------
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: '1', category: 'Candidate', label: 'Expected CTC (Per Annum)', type: 'Number', values: [], required: 'Yes', showInTable: true, allowExport: true },
    { id: '2', category: 'Job Application', label: 'Willingness to Relocate', type: 'Select', values: ['Yes', 'No', 'Negotiable'], required: 'No', showInTable: true, allowExport: true }
  ]);
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [fieldsForm, setFieldsForm] = useState({
    category: 'Candidate',
    label: '',
    type: 'Text',
    required: 'Yes' as 'Yes' | 'No',
    showInTable: true,
    allowExport: true,
    options: ['Option 1', 'Option 2']
  });

  const [optionInput, setOptionInput] = useState('');

  const handleOpenFieldsModal = (f: CustomField | null = null) => {
    if (f) {
      setEditingField(f);
      setFieldsForm({
        category: f.category,
        label: f.label,
        type: f.type,
        required: f.required,
        showInTable: f.showInTable,
        allowExport: f.allowExport,
        options: f.values.length > 0 ? f.values : ['Option 1', 'Option 2']
      });
    } else {
      setEditingField(null);
      setFieldsForm({
        category: 'Candidate',
        label: '',
        type: 'Text',
        required: 'Yes',
        showInTable: true,
        allowExport: true,
        options: ['Yes', 'No']
      });
    }
    setShowFieldsModal(true);
    setOptionInput('');
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setFieldsForm(prev => ({
        ...prev,
        options: [...prev.options, optionInput.trim()]
      }));
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setFieldsForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldsForm.label.trim()) {
      onNotify('Field Label is required.');
      return;
    }

    const typeWithOpts = ['Select', 'Multi Select', 'Radio', 'Checkbox'].includes(fieldsForm.type);
    const valuesList = typeWithOpts ? fieldsForm.options : [];

    if (editingField) {
      setCustomFields(prev => prev.map(item => item.id === editingField.id ? {
        ...item,
        category: fieldsForm.category,
        label: fieldsForm.label,
        type: fieldsForm.type,
        values: valuesList,
        required: fieldsForm.required,
        showInTable: fieldsForm.showInTable,
        allowExport: fieldsForm.allowExport
      } : item));
      onNotify(`Custom field "${fieldsForm.label}" updated.`);
    } else {
      const newField: CustomField = {
        id: Date.now().toString(),
        category: fieldsForm.category,
        label: fieldsForm.label,
        type: fieldsForm.type,
        values: valuesList,
        required: fieldsForm.required,
        showInTable: fieldsForm.showInTable,
        allowExport: fieldsForm.allowExport
      };
      setCustomFields(prev => [...prev, newField]);
      onNotify(`Custom field "${fieldsForm.label}" added.`);
    }
    setShowFieldsModal(false);
  };

  const handleDeleteField = (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete custom field: "${label}"?`)) {
      setCustomFields(prev => prev.filter(f => f.id !== id));
      onNotify(`Field "${label}" removed.`);
    }
  };

  // ------------------------------------
  // Helper Sorting and Filtering Functions
  // ------------------------------------
  const handleSort = (field: string) => {
    const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const sortData = (data: any[]) => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  };

  const filterAndPaginate = (data: any[]) => {
    let filtered = data;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = data.filter(item => {
        return Object.values(item).some(val => 
          val && val.toString().toLowerCase().includes(query)
        );
      });
    }
    const sorted = sortData(filtered);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      items: sorted.slice(startIndex, startIndex + itemsPerPage),
      totalItems: sorted.length,
      totalPages: Math.ceil(sorted.length / itemsPerPage)
    };
  };

  return (
    <div className="space-y-6" id="recruit-settings-module">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            <span>Recruit Settings</span>
          </h2>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
            <span>Settings</span>
            <span className="mx-1 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">HR</span>
            <span className="mx-1 text-slate-300">•</span>
            <span className="text-slate-400 font-medium">Recruit Settings</span>
          </div>
        </div>

        {/* Dynamic Context Buttons depending on Tab */}
        <div>
          {activeTab === 'footer' && (
            <button 
              onClick={() => handleOpenFooterModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Footer Link</span>
            </button>
          )}
          {activeTab === 'recruiter' && (
            <button 
              onClick={() => setShowRecruiterModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Recruiter</span>
            </button>
          )}
          {activeTab === 'status' && (
            <button 
              onClick={() => handleOpenStatusModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Status</span>
            </button>
          )}
          {activeTab === 'question' && (
            <button 
              onClick={() => handleOpenQuestionModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          )}
          {activeTab === 'fields' && (
            <button 
              onClick={() => handleOpenFieldsModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Field</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Horizontal Tabs Bar */}
      <div className="flex items-center overflow-x-auto border-b border-slate-200 scrollbar-none">
        {[
          { id: 'general', label: 'General' },
          { id: 'footer', label: 'Footer Settings' },
          { id: 'recruiter', label: 'Recruiter Settings' },
          { id: 'notification', label: 'Notification' },
          { id: 'status', label: 'Job Application Status' },
          { id: 'question', label: 'Custom Question' },
          { id: 'fields', label: 'Custom Fields' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-xs text-slate-400 font-bold tracking-wider uppercase bg-slate-50 px-3 py-1.5 rounded-md inline-block">
        Source
      </div>

      {/* 3. TAB CONTENT VIEWS */}
      <div className="pt-2">

        {/* ==================== TAB 1: GENERAL ==================== */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={enableCareerSite}
                  onChange={(e) => setEnableCareerSite(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-700 select-none group-hover:text-slate-950">Enable Career Site</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" title="Make application listings publicly visible" />
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={googleRecaptcha}
                  onChange={(e) => setGoogleRecaptcha(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-700 select-none group-hover:text-slate-950">Google Recaptcha</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" title="Inject spam protection verification forms" />
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={jobAlert}
                  onChange={(e) => setJobAlert(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-700 select-none group-hover:text-slate-950">Job Alert</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" title="Permit candidates to register notification reminders" />
              </label>
            </div>

            {/* Company Info Layout (2 Columns: info left, logo right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company legal name"
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
                  <input 
                    type="url" 
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Company Logo section */}
              <div className="border border-slate-150 rounded-xl p-4 bg-white space-y-3 shadow-2xs">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-700">Company Logo</span>
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center text-3xl shadow-xs overflow-hidden border border-slate-200 shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : companyLogo ? (
                      <div className="w-full h-full bg-amber-400 flex items-center justify-center text-white text-3xl font-black">W</div>
                    ) : (
                      'W'
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-1.5 px-3 rounded-lg cursor-pointer text-center border border-slate-200 transition-colors">
                      Replace Logo
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    <button 
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-rose-600 hover:text-rose-700 text-[10px] font-bold cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* About Company Editor section */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">About Company</label>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                {/* Editor Rich Toolbar */}
                <div className="bg-slate-50 border-b border-slate-200 p-1.5 flex flex-wrap gap-1">
                  {RICH_TEXT_BUTTONS.map((btn, idx) => {
                    if (btn.type === 'dropdown') {
                      return (
                        <select key={idx} className="bg-white border border-slate-200 text-[10px] font-semibold rounded px-1.5 py-0.5 outline-none">
                          <option>Normal</option>
                          <option>Header 1</option>
                          <option>Header 2</option>
                        </select>
                      );
                    }
                    return (
                      <button 
                        key={idx} 
                        type="button"
                        onClick={() => onNotify(`Applied font style: ${btn.label}`)}
                        className={`hover:bg-slate-200 text-slate-600 font-bold text-[10px] w-6 h-6 rounded flex items-center justify-center transition-all ${btn.style || ''}`}
                        title={btn.label}
                      >
                        {btn.label.length <= 2 ? btn.label : btn.label[0]}
                      </button>
                    );
                  })}
                </div>
                {/* Editor Content Area */}
                <textarea 
                  value={aboutCompany}
                  onChange={(e) => setAboutCompany(e.target.value)}
                  rows={8}
                  className="w-full p-4 text-xs font-medium text-slate-700 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}

        {/* ==================== TAB 2: FOOTER SETTINGS ==================== */}
        {activeTab === 'footer' && (
          <div className="space-y-4">
            {/* Search and control bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Search footer links..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('title')}>
                      <div className="flex items-center gap-1">
                        <span>Title</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('slug')}>
                      <div className="flex items-center gap-1">
                        <span>Slug / Path</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-semibold">
                  {(() => {
                    const { items, totalItems, totalPages } = filterAndPaginate(footerLinks);
                    if (items.length === 0) {
                      return (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-xs">
                            - No record found. -
                          </td>
                        </tr>
                      );
                    }
                    return items.map(link => (
                      <tr key={link.id} className="hover:bg-slate-50/50 text-slate-700">
                        <td className="px-4 py-3 font-bold text-slate-900">{link.title}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">/{link.slug}</td>
                        <td className="px-4 py-3">
                          <button 
                            type="button"
                            onClick={() => handleToggleFooterStatus(link.id)}
                            className="flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className={`w-2 h-2 rounded-full ${link.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            <span className={link.status === 'Active' ? 'text-emerald-700' : 'text-slate-400'}>{link.status}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button 
                            onClick={() => handleOpenFooterModal(link)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 inline-flex items-center cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteFooterLink(link.id, link.title)}
                            className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 inline-flex items-center cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {(() => {
                const { totalItems, totalPages } = filterAndPaginate(footerLinks);
                if (totalPages <= 1) return null;
                return (
                  <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Showing {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} items</span>
                    <div className="flex gap-1.5">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="p-1 border border-slate-200 rounded bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="p-1 border border-slate-200 rounded bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: RECRUITER SETTINGS ==================== */}
        {activeTab === 'recruiter' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search recruiters..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Recruiter list Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-semibold">
                  {(() => {
                    const { items, totalItems, totalPages } = filterAndPaginate(recruiters);
                    if (items.length === 0) {
                      return (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-slate-400 text-xs">
                            - No record found. -
                          </td>
                        </tr>
                      );
                    }
                    return items.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 text-slate-700">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img src={rec.avatar} alt={rec.name} className="w-8 h-8 rounded-full border border-slate-100 object-cover" />
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs">{rec.name}</h4>
                              <p className="text-[10px] text-slate-400">{rec.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            value={rec.status}
                            onChange={(e) => handleToggleRecruiterStatus(rec.id, e.target.value as any)}
                            className="border border-slate-200 bg-white rounded-lg text-xs font-semibold py-1 px-2.5 outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="Enabled">Enabled</option>
                            <option value="Disabled">Disabled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleDeleteRecruiter(rec.id, rec.name)}
                            className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg border border-slate-150 hover:bg-rose-50 cursor-pointer text-[11px] font-bold inline-flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: NOTIFICATION SETTINGS ==================== */}
        {activeTab === 'notification' && (
          <form onSubmit={handleSaveNotifications} className="space-y-6">
            {/* Mail Settings Group */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>Mail Settings</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Send mail when application status changes to <HelpIcon className="h-3 w-3 inline text-slate-300" /></p>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                {[
                  { label: 'Applied', state: mailApplied, setter: setMailApplied },
                  { label: 'Phone Screen', state: mailPhoneScreen, setter: setMailPhoneScreen },
                  { label: 'Interview', state: mailInterview, setter: setMailInterview },
                  { label: 'Hired', state: mailHired, setter: setMailHired },
                  { label: 'Rejected', state: mailRejected, setter: setMailRejected }
                ].map((chk, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={chk.state}
                      onChange={(e) => chk.setter(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-slate-700 select-none group-hover:text-slate-950">{chk.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Email Notification Settings Group */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  <span>Email Notification Settings</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Configure systemic recruiter notifications</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'New Job (Added by Admin)', state: notifNewJob, setter: setNotifNewJob },
                  { label: 'New Job Application (Added by Admin)', state: notifNewJobApp, setter: setNotifNewJobApp },
                  { label: 'New Interview Schedule', state: notifInterviewSchedule, setter: setNotifInterviewSchedule },
                  { label: 'New Offer Letter', state: notifOfferLetter, setter: setNotifOfferLetter },
                  { label: 'Notifications to Recruiter', state: notifToRecruiter, setter: setNotifToRecruiter }
                ].map((chk, i) => (
                  <label key={i} className="flex items-center gap-2.5 p-2 bg-slate-50/50 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={chk.state}
                      onChange={(e) => chk.setter(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-slate-700 select-none">{chk.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}

        {/* ==================== TAB 5: JOB APPLICATION STATUS ==================== */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search statuses..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Statuses Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        <span>Name</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('category')}>
                      <div className="flex items-center gap-1">
                        <span>Category</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Label Color</th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('position')}>
                      <div className="flex items-center gap-1">
                        <span>Position</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Apply Model Actions</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                  {(() => {
                    const { items, totalItems, totalPages } = filterAndPaginate(jobStatuses);
                    if (items.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                            - No record found. -
                          </td>
                        </tr>
                      );
                    }
                    return items.map(stat => (
                      <tr key={stat.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">{stat.name}</td>
                        <td className="px-4 py-3 text-slate-500">{stat.category}</td>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: stat.color }} />
                          <span className="font-mono text-slate-600 text-[11px]">{stat.color}</span>
                        </td>
                        <td className="px-4 py-3 font-mono">{stat.position}</td>
                        <td className="px-4 py-3 text-slate-500">{stat.applyModelActions ? 'yes' : 'no'}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button 
                            onClick={() => handleOpenStatusModal(stat)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteStatus(stat.id, stat.name)}
                            className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: CUSTOM QUESTION ==================== */}
        {activeTab === 'question' && (
          <div className="space-y-4">
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Questions Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('question')}>
                      <div className="flex items-center gap-1">
                        <span>Question</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('category')}>
                      <div className="flex items-center gap-1">
                        <span>Category</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('type')}>
                      <div className="flex items-center gap-1">
                        <span>Type</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Is Required</th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                  {(() => {
                    const { items, totalItems, totalPages } = filterAndPaginate(questions);
                    if (items.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                            - No record found. -
                          </td>
                        </tr>
                      );
                    }
                    return items.map(q => (
                      <tr key={q.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">{q.question}</td>
                        <td className="px-4 py-3 text-slate-500">{q.category}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{q.type}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${q.isRequired === 'Yes' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-400'}`}>{q.isRequired}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${q.status === 'Enable' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>{q.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button 
                            onClick={() => handleOpenQuestionModal(q)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(q.id, q.question)}
                            className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: CUSTOM FIELDS ==================== */}
        {activeTab === 'fields' && (
          <div className="space-y-4">
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search fields..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Custom Fields table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('category')}>
                      <div className="flex items-center gap-1">
                        <span>Category</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('label')}>
                      <div className="flex items-center gap-1">
                        <span>Label</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('type')}>
                      <div className="flex items-center gap-1">
                        <span>Type</span>
                        <ArrowUpDown className="h-3 w-3 text-slate-300" />
                      </div>
                    </th>
                    <th className="px-4 py-3">Values</th>
                    <th className="px-4 py-3">Required</th>
                    <th className="px-4 py-3">Show in Table</th>
                    <th className="px-4 py-3">Allow Export</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                  {(() => {
                    const { items, totalItems, totalPages } = filterAndPaginate(customFields);
                    if (items.length === 0) {
                      return (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-xs">
                            - No Custom Field added. -
                          </td>
                        </tr>
                      );
                    }
                    return items.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">{f.category}</td>
                        <td className="px-4 py-3 text-slate-700">{f.label}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{f.type}</td>
                        <td className="px-4 py-3 max-w-[120px] truncate" title={f.values.join(', ')}>
                          {f.values.length > 0 ? (
                            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                              {f.values.join(', ')}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${f.required === 'Yes' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-400'}`}>{f.required}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{f.showInTable ? 'yes' : 'no'}</td>
                        <td className="px-4 py-3 text-slate-500">{f.allowExport ? 'yes' : 'no'}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button 
                            onClick={() => handleOpenFieldsModal(f)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteField(f.id, f.label)}
                            className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ==================== 4. MODALS ==================== */}

      {/* MODAL 1: ADD / EDIT FOOTER LINK */}
      {showFooterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="font-extrabold text-slate-800 text-sm">
                {editingFooter ? 'Edit Footer Link' : 'Add Footer Link'}
              </h3>
              <button onClick={() => setShowFooterModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFooterLink} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                  <input 
                    type="text" 
                    required
                    value={footerForm.title}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))}
                    placeholder="e.g. Cookie Policy"
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slug *</label>
                  <input 
                    type="text" 
                    required
                    value={footerForm.slug}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="cookie-policy"
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select 
                  value={footerForm.status}
                  onChange={(e) => setFooterForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="bg-slate-50 border-b border-slate-200 p-1.5 flex flex-wrap gap-1">
                    {RICH_TEXT_BUTTONS.slice(1, 6).map((btn, idx) => (
                      <button 
                        key={idx} 
                        type="button"
                        onClick={() => onNotify(`Applied footer editor style: ${btn.label}`)}
                        className={`hover:bg-slate-200 text-slate-600 font-bold text-[10px] w-6 h-6 rounded flex items-center justify-center transition-all ${btn.style || ''}`}
                      >
                        {btn.label[0]}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={footerForm.description}
                    onChange={(e) => setFooterForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="Write terms or links description details..."
                    className="w-full p-3 text-xs font-medium text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowFooterModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD RECRUITER */}
      {showRecruiterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="font-extrabold text-slate-800 text-sm">Add New Recruiter</h3>
              <button onClick={() => setShowRecruiterModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecruiter} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Recruiter *</label>
                <select 
                  required
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">Nothing selected</option>
                  {MOCK_EMPLOYEES.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Select from active HR internal employees.</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowRecruiterModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT STATUS */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="font-extrabold text-slate-800 text-sm">
                {editingStatus ? 'Edit Status Column' : 'Add Status Column'}
              </h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select 
                    value={statusForm.category}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800"
                  >
                    <option value="applied">applied</option>
                    <option value="shortlist">shortlist</option>
                    <option value="interview">interview</option>
                    <option value="hired">hired</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status *</label>
                  <input 
                    type="text" 
                    required
                    value={statusForm.name}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Phone Screen"
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Label Color *</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={statusForm.color}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0"
                    />
                    <input 
                      type="text" 
                      value={statusForm.color}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#3B82F6"
                      className="w-full text-xs font-mono font-bold border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Position</label>
                  <select 
                    value={statusForm.position}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800"
                  >
                    <option value={1}>Before Applied</option>
                    <option value={2}>After Applied</option>
                    <option value={3}>Before Interview</option>
                    <option value={4}>After Interview</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={statusForm.applyModelActions}
                  onChange={(e) => setStatusForm(prev => ({ ...prev, applyModelActions: e.target.checked }))}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-slate-700 select-none">Apply model actions</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT QUESTION */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="font-extrabold text-slate-800 text-sm">
                {editingQuestion ? 'Edit Question' : 'Add Question'}
              </h3>
              <button onClick={() => setShowQuestionModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={questionForm.category}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800"
                  >
                    <option value="Job Application">Job Application</option>
                    <option value="Interview">Interview</option>
                    <option value="Candidate">Candidate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Question *</label>
                  <input 
                    type="text" 
                    required
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter Custom Question"
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={questionForm.status}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800"
                  >
                    <option value="Enable">Enable</option>
                    <option value="Disable">Disable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Is Required</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="isRequired" 
                        value="Yes"
                        checked={questionForm.isRequired === 'Yes'}
                        onChange={() => setQuestionForm(prev => ({ ...prev, isRequired: 'Yes' }))}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="isRequired" 
                        value="No"
                        checked={questionForm.isRequired === 'No'}
                        onChange={() => setQuestionForm(prev => ({ ...prev, isRequired: 'No' }))}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                <select 
                  value={questionForm.type}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800"
                >
                  <option value="Text">Text</option>
                  <option value="Textarea">Textarea</option>
                  <option value="Number">Number</option>
                  <option value="Email">Email</option>
                  <option value="Date">Date</option>
                  <option value="Dropdown">Dropdown</option>
                  <option value="Checkbox">Checkbox</option>
                  <option value="Radio">Radio</option>
                  <option value="File Upload">File Upload</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD / EDIT CUSTOM FIELD */}
      {showFieldsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="font-extrabold text-slate-800 text-sm">
                {editingField ? 'Edit Custom Field' : 'Add Custom Field'}
              </h3>
              <button onClick={() => setShowFieldsModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveField} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={fieldsForm.category}
                    onChange={(e) => setFieldsForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800"
                  >
                    <option value="Candidate">Candidate</option>
                    <option value="Job Application">Job Application</option>
                    <option value="Interview">Interview</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Field Label *</label>
                  <input 
                    type="text" 
                    required
                    value={fieldsForm.label}
                    onChange={(e) => setFieldsForm(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g. Reference Code"
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select 
                    value={fieldsForm.type}
                    onChange={(e) => setFieldsForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:border-blue-500 cursor-pointer text-slate-800"
                  >
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Date">Date</option>
                    <option value="Time">Time</option>
                    <option value="Select">Select</option>
                    <option value="Multi Select">Multi Select</option>
                    <option value="Checkbox">Checkbox</option>
                    <option value="Radio">Radio</option>
                    <option value="Textarea">Textarea</option>
                    <option value="File Upload">File Upload</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Is Required</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fieldRequired" 
                        value="Yes"
                        checked={fieldsForm.required === 'Yes'}
                        onChange={() => setFieldsForm(prev => ({ ...prev, required: 'Yes' }))}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="fieldRequired" 
                        value="No"
                        checked={fieldsForm.required === 'No'}
                        onChange={() => setFieldsForm(prev => ({ ...prev, required: 'No' }))}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Checkboxes for show/export */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={fieldsForm.showInTable}
                    onChange={(e) => setFieldsForm(prev => ({ ...prev, showInTable: e.target.checked }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-700 select-none">Show in Table View</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={fieldsForm.allowExport}
                    onChange={(e) => setFieldsForm(prev => ({ ...prev, allowExport: e.target.checked }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-slate-700 select-none">Allow Export in Table View</span>
                </label>
              </div>

              {/* Dynamic Option Builder if type requires option arrays */}
              {['Select', 'Multi Select', 'Radio', 'Checkbox'].includes(fieldsForm.type) && (
                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">Dynamic Option Builder</label>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter option..." 
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddOption(); } }}
                      className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:border-blue-500 text-slate-800"
                    />
                    <button 
                      type="button"
                      onClick={handleAddOption}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 rounded-lg cursor-pointer shrink-0 transition-colors"
                    >
                      Add Option
                    </button>
                  </div>

                  {/* List of current options */}
                  <div className="space-y-1.5 pt-1.5 max-h-[140px] overflow-y-auto">
                    {fieldsForm.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white border border-slate-150 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-3xs">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                          <span>{opt}</span>
                        </span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="text-rose-600 hover:text-rose-700 text-[10px] font-bold cursor-pointer hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {fieldsForm.options.length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center font-semibold italic py-1">Please add at least one option.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowFieldsModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
