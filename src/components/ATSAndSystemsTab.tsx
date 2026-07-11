/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, Briefcase, FileText, Calendar, Users, Server, 
  Webhook, FileSpreadsheet, Plus, Search, HelpCircle, Check, Play, RefreshCw, Eye,
  Wallet, TrendingUp, Cpu, Key, CheckCircle2, Trash2, Edit3, X, ChevronLeft, ChevronRight,
  Filter, Download, ArrowUpRight, Award, MapPin, Mail, Phone, Clock, PieChart, BarChart3, Star,
  Globe, Activity, ExternalLink, AlertTriangle, ShieldCheck, Lock, Sliders
} from 'lucide-react';
import { Job, JobApplication, InterviewSchedule, Server as ServerType, Webhook as WebhookType, WebhookLog } from '../types';

export interface Hosting {
  id: string;
  name: string;
  ip: string;
  provider: string;
  type: string;
  ssl: string;
  sslActive: boolean;
  expiryDate: string;
  cost: string;
  status: 'Active' | 'Expiring' | 'Expired';
  description?: string;
  notifyDays?: string;
}

export interface Domain {
  id: string;
  name: string;
  registrar: string;
  expiryDate: string;
  autoRenew: boolean;
  dnsProvider: string;
  cost: string;
  status: 'Active' | 'Expiring' | 'Pending Transfer';
  description?: string;
  notifyDays?: string;
}

export interface Provider {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  status: 'Active' | 'Inactive';
  activeHostings: number;
  activeDomains: number;
  notes?: string;
}

interface ATSAndSystemsTabProps {
  subTab: string;
  jobs: Job[];
  onAddJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  applications: JobApplication[];
  onAddApplication: (app: JobApplication) => void;
  onDeleteApplication: (id: string) => void;
  interviews: InterviewSchedule[];
  onAddInterview: (interview: InterviewSchedule) => void;
  onDeleteInterview: (id: string) => void;
  candidates: { name: string; skills: string; matchScore: string; location: string }[];
  onAddCandidate: (candidate: { name: string; skills: string; matchScore: string; location: string }) => void;
  onDeleteCandidate: (name: string) => void;
  skillsList: string[];
  onAddSkill: (skill: string) => void;
  onDeleteSkill: (skill: string) => void;
  offerLetters: { candidate: string; job: string; date: string; salary: string; status: string; expiry?: string; joining?: string }[];
  onAddOffer: (offer: { candidate: string; job: string; date: string; salary: string; status: string; expiry?: string; joining?: string }) => void;
  onDeleteOffer: (cand: string) => void;
  servers: ServerType[];
  webhooks: WebhookType[];
  webhookLogs: WebhookLog[];
  onTriggerWebhook: (webhookId: string) => void;
  onAddWebhook: (wh: Omit<WebhookType, 'id' | 'status'>) => void;
}

export default function ATSAndSystemsTab({
  subTab,
  jobs,
  onAddJob,
  onDeleteJob,
  applications,
  onAddApplication,
  onDeleteApplication,
  interviews,
  onAddInterview,
  onDeleteInterview,
  candidates,
  onAddCandidate,
  onDeleteCandidate,
  skillsList,
  onAddSkill,
  onDeleteSkill,
  offerLetters,
  onAddOffer,
  onDeleteOffer,
  servers,
  webhooks,
  webhookLogs,
  onTriggerWebhook,
  onAddWebhook
}: ATSAndSystemsTabProps) {

  // Global filters states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals & Drawers States
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddApplicationModal, setShowAddApplicationModal] = useState(false);
  const [showAddInterviewModal, setShowAddInterviewModal] = useState(false);
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showWhModal, setShowWhModal] = useState(false);

  // Form states - Add Job
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobLoc, setJobLoc] = useState('Remote');
  const [jobOpenings, setJobOpenings] = useState(1);
  const [jobStart, setJobStart] = useState('2026-07-06');
  const [jobEnd, setJobEnd] = useState('2026-08-06');
  const [jobRecruiter, setJobRecruiter] = useState('Rashad Lakin Team Lead');
  const [jobDesc, setJobDesc] = useState('');

  // Form states - Add Job Application
  const [appCandidateName, setAppCandidateName] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appJob, setAppJob] = useState('');
  const [appLocVal, setAppLocVal] = useState('Bangalore');
  const [appSkills, setAppSkills] = useState('');

  // Form states - Add Interview
  const [intCandidate, setIntCandidate] = useState('');
  const [intJob, setIntJob] = useState('');
  const [intDate, setIntDate] = useState('2026-07-06');
  const [intTime, setIntTime] = useState('14:00');
  const [intInterviewer, setIntInterviewer] = useState('Elena Rostova');

  // Form states - Add Offer Letter
  const [offCandidate, setOffCandidate] = useState('');
  const [offJob, setOffJob] = useState('');
  const [offSalary, setOffSalary] = useState('$120,000 / Yr');
  const [offExpiry, setOffExpiry] = useState('2026-07-20');
  const [offJoining, setOffJoining] = useState('2026-08-01');

  // Form states - Add Skills (multiple)
  const [newSkillInputs, setNewSkillInputs] = useState(['']);

  // Webhook Add state
  const [whName, setWhName] = useState('');
  const [whUrl, setWhUrl] = useState('');
  const [whEvent, setWhEvent] = useState('invoice.paid');
  const [whMethod, setWhMethod] = useState<'POST' | 'GET' | 'PUT'>('POST');
  const [whHeaders, setWhHeaders] = useState<{ key: string; value: string }[]>([{ key: 'Content-Type', value: 'application/json' }]);
  const [whBodyParams, setWhBodyParams] = useState<{ key: string; value: string }[]>([{ key: 'source', value: 'worksuite_erp' }]);

  // Server Manager States & High-Quality Dummy Datasets
  const [hostings, setHostings] = useState<Hosting[]>([
    { id: 'HST-01', name: 'worksuite.biz', ip: '104.198.22.8', provider: 'Google Cloud Platform', type: 'Docker Container', ssl: "Let's Encrypt (Active)", sslActive: true, expiryDate: '2027-07-06', cost: '$15 / Mo', status: 'Active', description: 'Primary production hosting engine running on Cloud Run container nodes.' },
    { id: 'HST-02', name: 'wayne-sandbox.worksuite.io', ip: '35.210.155.90', provider: 'AWS', type: 'VPS VM', ssl: 'Cloudflare SSL (Active)', sslActive: true, expiryDate: '2026-07-22', cost: '$45 / Mo', status: 'Expiring', description: 'Enterprise partner sandboxed environment integration VM.' },
    { id: 'HST-03', name: 'bio-backup.worksuite.net', ip: '192.168.10.45', provider: 'DigitalOcean', type: 'Shared Cloud', ssl: 'None (Inactive)', sslActive: false, expiryDate: '2026-05-10', cost: '$5 / Mo', status: 'Expired', description: 'Legacy offline backup storage endpoint for hardware logs.' },
  ]);

  const [domains, setDomains] = useState<Domain[]>([
    { id: 'DOM-01', name: 'worksuite.biz', registrar: 'Namecheap', expiryDate: '2027-05-15', autoRenew: true, dnsProvider: 'Cloudflare DNS', cost: '$12 / Yr', status: 'Active', description: 'Main corporate platform root domain registered for 10 years.' },
    { id: 'DOM-02', name: 'wayne-sandbox.io', registrar: 'GoDaddy', expiryDate: '2026-07-18', autoRenew: false, dnsProvider: 'AWS Route53', cost: '$18 / Yr', status: 'Expiring', description: 'Partner demonstration system sub-registrar link.' },
    { id: 'DOM-03', name: 'bio-backup.net', registrar: 'Google Domains', expiryDate: '2028-09-12', autoRenew: true, dnsProvider: 'Cloudflare DNS', cost: '$10 / Yr', status: 'Active', description: 'Archived biometrics network endpoint domain.' },
  ]);

  const [providers, setProviders] = useState<Provider[]>([
    { id: 'PROV-01', name: 'Google Cloud Platform', contactName: 'Enterprise Sales', contactEmail: 'gcp-support@google.com', status: 'Active', activeHostings: 1, activeDomains: 0, notes: 'Core cloud provider hosting major enterprise container runtimes.' },
    { id: 'PROV-02', name: 'AWS', contactName: 'Support Desk', contactEmail: 'aws-billing@amazon.com', status: 'Active', activeHostings: 1, activeDomains: 1, notes: 'S3 cloud storage and redundant route resolver provider.' },
    { id: 'PROV-03', name: 'Namecheap', contactName: 'Registrar Support', contactEmail: 'help@namecheap.com', status: 'Active', activeHostings: 0, activeDomains: 1, notes: 'Primary DNS and root domain registrar with active automated DNS records.' },
    { id: 'PROV-04', name: 'DigitalOcean', contactName: 'Developer Portal', contactEmail: 'do-support@digitalocean.com', status: 'Active', activeHostings: 1, activeDomains: 0, notes: 'Staging VMs and test environment provider.' },
  ]);

  // Server manager filter/toolbar states
  const [serverSearchQuery, setServerSearchQuery] = useState('');
  const [serverProviderFilter, setServerProviderFilter] = useState('All');
  const [serverStatusFilter, setServerStatusFilter] = useState('All');

  // Form Modals State
  const [showAddHostingModal, setShowAddHostingModal] = useState(false);
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);

  // Form Inputs - Add Hosting
  const [hostName, setHostName] = useState('');
  const [hostIp, setHostIp] = useState('');
  const [hostProvider, setHostProvider] = useState('Google Cloud Platform');
  const [hostType, setHostType] = useState('Docker Container');
  const [hostSslActive, setHostSslActive] = useState(true);
  const [hostSslProvider, setHostSslProvider] = useState("Let's Encrypt");
  const [hostCost, setHostCost] = useState('15');
  const [hostCycle, setHostCycle] = useState('Mo');
  const [hostExpiry, setHostExpiry] = useState('2027-07-06');
  const [hostNotify, setHostNotify] = useState('15');
  const [hostDesc, setHostDesc] = useState('');

  // Form Inputs - Add Domain
  const [domName, setDomName] = useState('');
  const [domRegistrar, setDomRegistrar] = useState('Namecheap');
  const [domDns, setDomDns] = useState('Cloudflare DNS');
  const [domCost, setDomCost] = useState('12');
  const [domAutoRenew, setDomAutoRenew] = useState(true);
  const [domExpiry, setDomExpiry] = useState('2027-05-15');
  const [domNotify, setDomNotify] = useState('15');
  const [domDesc, setDomDesc] = useState('');

  // Form Inputs - Add Provider
  const [provName, setProvName] = useState('');
  const [provContact, setProvContact] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provNotes, setProvNotes] = useState('');

  // Recent Activity Log state for Server Manager
  const [serverActivities, setServerActivities] = useState([
    { id: 'act-01', text: 'Let\'s Encrypt SSL certificate renewed automatically for worksuite.biz', time: 'Today, 09:12 AM', type: 'ssl' },
    { id: 'act-02', text: 'New Domain "wayne-sandbox.io" synced with GoDaddy registrar integration', time: 'Yesterday, 04:30 PM', type: 'domain' },
    { id: 'act-03', text: 'Backup Biometric Logging Service marked offline due to routing update', time: '2 days ago', type: 'error' },
    { id: 'act-04', text: 'Provider Google Cloud Platform initialized with 1 active container cluster hosting', time: '3 days ago', type: 'provider' },
  ]);

  // Webhooks logs local state for fully active simulation pagination/sorting/filtering
  const [webhookLogsSearch, setWebhookLogsSearch] = useState('');
  const [webhookLogsSortDesc, setWebhookLogsSortDesc] = useState(true);
  const [webhookLogsPage, setWebhookLogsPage] = useState(1);
  const webhookLogsPerPage = 5;

  // Active Calendar Month Navigation state
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(6); // July (0-indexed represents July as index 6)

  // Submit handlers for Hosting, Domain, and Provider
  const handleHostingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName || !hostIp) return;
    const newHost: Hosting = {
      id: `HST-${Date.now().toString().slice(-2)}`,
      name: hostName,
      ip: hostIp,
      provider: hostProvider,
      type: hostType,
      ssl: hostSslActive ? `${hostSslProvider} (Active)` : 'None (Inactive)',
      sslActive: hostSslActive,
      expiryDate: hostExpiry,
      cost: `$${hostCost} / ${hostCycle}`,
      status: 'Active',
      description: hostDesc,
      notifyDays: hostNotify
    };
    setHostings(prev => [newHost, ...prev]);
    // Add activity log
    setServerActivities(prev => [
      { id: `act-${Date.now().toString().slice(-2)}`, text: `New hosting "${hostName}" registered successfully with ${hostProvider}`, time: 'Just now', type: 'provider' },
      ...prev
    ]);
    // Close & reset
    setHostName('');
    setHostIp('');
    setHostDesc('');
    setShowAddHostingModal(false);
  };

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domName) return;
    const newDom: Domain = {
      id: `DOM-${Date.now().toString().slice(-2)}`,
      name: domName,
      registrar: domRegistrar,
      expiryDate: domExpiry,
      autoRenew: domAutoRenew,
      dnsProvider: domDns,
      cost: `$${domCost} / Yr`,
      status: 'Active',
      description: domDesc,
      notifyDays: domNotify
    };
    setDomains(prev => [newDom, ...prev]);
    // Add activity log
    setServerActivities(prev => [
      { id: `act-${Date.now().toString().slice(-2)}`, text: `New root domain "${domName}" configured with ${domDns}`, time: 'Just now', type: 'domain' },
      ...prev
    ]);
    // Close & reset
    setDomName('');
    setDomDesc('');
    setShowAddDomainModal(false);
  };

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provName) return;
    const newProv: Provider = {
      id: `PROV-${Date.now().toString().slice(-2)}`,
      name: provName,
      contactName: provContact,
      contactEmail: provEmail,
      status: 'Active',
      activeHostings: 0,
      activeDomains: 0,
      notes: provNotes
    };
    setProviders(prev => [newProv, ...prev]);
    // Add activity log
    setServerActivities(prev => [
      { id: `act-${Date.now().toString().slice(-2)}`, text: `New service provider ${provName} linked successfully`, time: 'Just now', type: 'provider' },
      ...prev
    ]);
    // Close & reset
    setProvName('');
    setProvContact('');
    setProvEmail('');
    setProvNotes('');
    setShowAddProviderModal(false);
  };

  // Webhook custom submission supporting dynamic headers/body rows
  const handleWebhookSubmitWithDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whName || !whUrl) return;
    
    // Trigger standard parent handler
    onAddWebhook({
      name: whName,
      url: whUrl,
      event: whEvent
    });

    // Reset and close
    setWhName('');
    setWhUrl('');
    setWhHeaders([{ key: 'Content-Type', value: 'application/json' }]);
    setWhBodyParams([{ key: 'source', value: 'worksuite_erp' }]);
    setShowWhModal(false);
    alert('Dynamic REST webhook trigger pipeline saved successfully!');
  };

  // Webhook dynamic row modifiers
  const addHeaderRow = () => setWhHeaders(prev => [...prev, { key: '', value: '' }]);
  const removeHeaderRow = (index: number) => setWhHeaders(prev => prev.filter((_, idx) => idx !== index));
  const updateHeaderRow = (index: number, field: 'key' | 'value', value: string) => {
    setWhHeaders(prev => prev.map((row, idx) => idx === index ? { ...row, [field]: value } : row));
  };

  const addBodyRow = () => setWhBodyParams(prev => [...prev, { key: '', value: '' }]);
  const removeBodyRow = (index: number) => setWhBodyParams(prev => prev.filter((_, idx) => idx !== index));
  const updateBodyRow = (index: number, field: 'key' | 'value', value: string) => {
    setWhBodyParams(prev => prev.map((row, idx) => idx === index ? { ...row, [field]: value } : row));
  };

  // Handlers for adding items
  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;
    const newJob: Job = {
      id: `JB-0${jobs.length + 1}`,
      title: jobTitle,
      department: jobDept,
      location: jobLoc,
      openings: Number(jobOpenings),
      status: 'Active',
      type: 'Full-time'
    };
    onAddJob(newJob);
    // Reset and close
    setJobTitle('');
    setShowAddJobModal(false);
    alert('Job opportunity published successfully!');
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appCandidateName || !appEmail || !appJob) return;
    const appId = `AP-5${applications.length + 1}`;
    
    onAddApplication({
      id: appId,
      jobTitle: appJob,
      candidateName: appCandidateName,
      email: appEmail,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0]
    });

    onAddCandidate({
      name: appCandidateName,
      skills: appSkills || 'React, TS',
      matchScore: '88%',
      location: appLocVal
    });

    // Reset and close
    setAppCandidateName('');
    setAppEmail('');
    setAppSkills('');
    setShowAddApplicationModal(false);
    alert('Job Application registered and linked with candidate profile!');
  };

  const handleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intCandidate || !intJob) return;
    const intId = `INT-${interviews.length + 81}`;
    
    onAddInterview({
      id: intId,
      candidateName: intCandidate,
      jobTitle: intJob,
      date: intDate,
      time: intTime,
      interviewer: intInterviewer
    });

    // Reset and close
    setIntCandidate('');
    setShowAddInterviewModal(false);
    alert('Interview session scheduled successfully!');
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offCandidate || !offJob) return;
    
    onAddOffer({
      candidate: offCandidate,
      job: offJob,
      date: new Date().toISOString().split('T')[0],
      salary: offSalary,
      expiry: offExpiry,
      joining: offJoining,
      status: 'Pending Review'
    });

    // Reset and close
    setOffCandidate('');
    setShowAddOfferModal(false);
    alert('Offer letter generated successfully!');
  };

  const handleAddSkillField = () => {
    setNewSkillInputs([...newSkillInputs, '']);
  };

  const handleRemoveSkillField = (index: number) => {
    setNewSkillInputs(newSkillInputs.filter((_, idx) => idx !== index));
  };

  const handleSkillInputChange = (index: number, val: string) => {
    const updated = [...newSkillInputs];
    updated[index] = val;
    setNewSkillInputs(updated);
  };

  const handleSkillsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkills = newSkillInputs.map(s => s.trim()).filter(s => s !== '');
    if (cleanSkills.length === 0) return;

    cleanSkills.forEach(s => {
      if (!skillsList.includes(s)) {
        onAddSkill(s);
      }
    });

    // Reset
    setNewSkillInputs(['']);
    setShowAddSkillModal(false);
    alert('Skills tag registry updated!');
  };

  const handleWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whName || !whUrl) return;
    onAddWebhook({ name: whName, url: whUrl, event: whEvent });
    setWhName('');
    setWhUrl('');
    setShowWhModal(false);
  };

  // Calendar Day generation
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDayIndex = getFirstDayOfMonth(calendarMonth, calendarYear);
  const daysArray = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Export Simulation
  const handleExportCSV = (filename: string) => {
    alert(`CSV export triggered! Preserving exact Worksuite schema. Download scheduled for: ${filename}.csv`);
  };

  // Filter lists based on inputs
  const filteredJobsList = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || job.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCandidateDatabase = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cand.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cand.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredSkills = skillsList.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredOffers = offerLetters.filter(off => {
    const matchesSearch = off.candidate.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          off.job.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || off.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  return (
    <div className="space-y-6">
      
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* PANEL MAIN BANNER HEADER */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            {subTab.startsWith('recruit') ? (
              <GraduationCap className="h-5 w-5 text-indigo-600" />
            ) : subTab.startsWith('server') ? (
              <Server className="h-5 w-5 text-indigo-600" />
            ) : (
              <Webhook className="h-5 w-5 text-indigo-600" />
            )}
            <h2 className="text-base font-bold text-slate-900 tracking-tight capitalize">
              {subTab === 'recruit-dashboard' ? 'Recruitment Hub Dashboard' :
               subTab === 'recruit-jobs' ? 'Active Job Opportunities' :
               subTab === 'recruit-applications' ? 'Job Applications Manager' :
               subTab === 'recruit-interviews' ? 'Interview Scheduling Calendar' :
               subTab === 'recruit-offers' ? 'Offer Letters Registry' :
               subTab === 'recruit-skills' ? 'Skills Tag Directory' :
               subTab === 'recruit-database' ? 'Candidate Profiles Database' :
               subTab === 'recruit-reports' ? 'Recruit Analytics & Reports' : 
               subTab === 'server-manager' ? 'Server Manager Dashboard' :
               subTab === 'server-hostings' ? 'Hosting Management' :
               subTab === 'server-domains' ? 'Domain Management' :
               subTab === 'server-providers' ? 'Provider Management' :
               subTab === 'server-nodes' ? 'Cluster Nodes Deployed' :
               subTab === 'server-logs' ? 'Hosting Terminal Logs' :
               subTab === 'webhooks' ? 'Secure API Webhooks' :
               subTab === 'webhook-keys' ? 'Secret Integration Keys' :
               subTab === 'webhook-logs' ? 'Webhooks Delivery Logs' : 'BI Reports'}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            {subTab.startsWith('recruit') 
              ? 'Manage recruitment funnels, review job seekers, and dispatch signed compensation structures.'
              : subTab.startsWith('server')
              ? 'Monitor network assets, manage secure hosting instances, domain registry, and providers.'
              : 'Configure incoming event hooks, secure authentication pipelines, and audit triggers.'}
          </p>
        </div>

        {/* Dynamic Action Button in Header based on Active Sub-Module */}
        <div className="shrink-0 flex items-center gap-2">
          {subTab === 'recruit-jobs' && (
            <button
              id="btn-recruit-add-job"
              onClick={() => setShowAddJobModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Job</span>
            </button>
          )}

          {subTab === 'recruit-applications' && (
            <div className="flex gap-2">
              <button 
                onClick={() => handleExportCSV('job-applications-export')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
              <button
                id="btn-recruit-add-application"
                onClick={() => {
                  if (jobs.length > 0) setAppJob(jobs[0].title);
                  setShowAddApplicationModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Application</span>
              </button>
            </div>
          )}

          {subTab === 'recruit-interviews' && (
            <button
              id="btn-recruit-add-interview"
              onClick={() => {
                if (jobs.length > 0) setIntJob(jobs[0].title);
                setShowAddInterviewModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Interview</span>
            </button>
          )}

          {subTab === 'recruit-offers' && (
            <button
              id="btn-recruit-add-offer"
              onClick={() => {
                if (jobs.length > 0) setOffJob(jobs[0].title);
                setShowAddOfferModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Generate Offer Letter</span>
            </button>
          )}

          {subTab === 'recruit-skills' && (
            <button
              id="btn-recruit-add-skill"
              onClick={() => setShowAddSkillModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Skill</span>
            </button>
          )}

          {subTab === 'recruit-database' && (
            <button 
              onClick={() => handleExportCSV('candidate-database-export')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Candidates</span>
            </button>
          )}

          {subTab === 'server-hostings' && (
            <button
              id="btn-server-add-hosting"
              onClick={() => {
                if (providers.length > 0) setHostProvider(providers[0].name);
                setShowAddHostingModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Hosting</span>
            </button>
          )}

          {subTab === 'server-domains' && (
            <button
              id="btn-server-add-domain"
              onClick={() => setShowAddDomainModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Domain</span>
            </button>
          )}

          {subTab === 'server-providers' && (
            <button
              id="btn-server-add-provider"
              onClick={() => setShowAddProviderModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Provider</span>
            </button>
          )}

          {subTab === 'webhooks' && (
            <button
              id="sys-add-webhook-btn"
              onClick={() => setShowWhModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Webhook</span>
            </button>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 0. RECRUIT MODULE - DASHBOARD SUBTAB */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'recruit-dashboard' && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Total Openings', val: jobs.length, sub: 'Active roles', bg: 'bg-slate-50', text: 'text-slate-900' },
              { label: 'Total Applications', val: applications.length, sub: 'Logged ATS', bg: 'bg-indigo-50/40 border border-indigo-100', text: 'text-indigo-600' },
              { label: 'Total Hired', val: 22, sub: 'Signed offers', bg: 'bg-emerald-50/40 border border-emerald-100', text: 'text-emerald-600' },
              { label: 'Total Rejected', val: 16, sub: 'Archived', bg: 'bg-rose-50/40 border border-rose-100', text: 'text-rose-600' },
              { label: 'New Applications', val: applications.filter(a => a.status === 'Applied').length, sub: 'Review pending', bg: 'bg-blue-50/40 border border-blue-100', text: 'text-blue-600' },
              { label: 'Shortlisted', val: applications.filter(a => a.status === 'Shortlisted').length, sub: 'Next round', bg: 'bg-sky-50/40 border border-sky-100', text: 'text-sky-600' },
              { label: "Today's Interview", val: interviews.length, sub: 'Scheduled', bg: 'bg-amber-50/40 border border-amber-100', text: 'text-amber-600' },
            ].map((metric, i) => (
              <div key={i} className={`p-3.5 rounded-xl border border-slate-200/60 shadow-2xs ${metric.bg}`}>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider truncate">{metric.label}</span>
                <h3 className={`text-xl font-black mt-1 ${metric.text}`}>{metric.val}</h3>
                <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">{metric.sub}</p>
              </div>
            ))}
          </div>

          {/* Core Recruiter Tables & Pipelines */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recruitment Pipeline Table */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase">Recruitment Pipeline Matrix</h4>
                <span className="text-[10px] text-indigo-600 font-bold">Active Opportunities</span>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[9px] uppercase font-bold tracking-wider">
                      <th className="px-4 py-2.5">Job Role</th>
                      <th className="px-4 py-2.5 text-center">Applied</th>
                      <th className="px-4 py-2.5 text-center">Screen</th>
                      <th className="px-4 py-2.5 text-center">Interview</th>
                      <th className="px-4 py-2.5 text-center">Hired</th>
                      <th className="px-4 py-2.5 text-center">Rejected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                    {[
                      { role: 'Senior Backend Engineer (Node/TS)', applied: 2, screen: 3, interview: 2, hired: 1, rejected: 1 },
                      { role: 'Product Marketing Manager', applied: 1, screen: 1, interview: 1, hired: 0, rejected: 0 },
                      { role: 'UI/UX Developer', applied: 3, screen: 2, interview: 2, hired: 2, rejected: 1 },
                      { role: 'DevOps & Site Reliability Engineer', applied: 1, screen: 0, interview: 1, hired: 0, rejected: 2 },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900 truncate max-w-[180px]">{row.role}</td>
                        <td className="px-4 py-3 text-center"><span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full">{row.applied}</span></td>
                        <td className="px-4 py-3 text-center"><span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">{row.screen}</span></td>
                        <td className="px-4 py-3 text-center"><span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">{row.interview}</span></td>
                        <td className="px-4 py-3 text-center"><span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">{row.hired}</span></td>
                        <td className="px-4 py-3 text-center"><span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full">{row.rejected}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Today's Interviews Card list */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-3xs p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Today's Interviews</h4>
                <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded">Pending Loops</span>
              </div>
              <div className="space-y-3">
                {interviews.length > 0 ? (
                  interviews.map(int => (
                    <div key={int.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex gap-3 items-start">
                      <div className="bg-indigo-600 text-white rounded-lg p-2 text-center text-[10px] font-bold font-mono w-12 shrink-0">
                        JUL 26
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-black text-slate-900">{int.candidateName}</h5>
                        <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[180px]">{int.jobTitle}</p>
                        <p className="text-[9px] text-slate-500 font-medium">Time: {int.time} PM • Host: {int.interviewer}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No interviews scheduled today</p>
                )}
              </div>
            </div>
          </div>

          {/* Charts & Analytical Graphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Application Sources Pie Chart Replication */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-4">
              <div className="border-b border-slate-100 pb-2.5">
                <h4 className="text-xs font-black text-slate-900 uppercase">Application Candidate Sources</h4>
                <p className="text-[9px] text-slate-400 font-semibold">Incoming traffic channels</p>
              </div>
              
              <div className="flex items-center justify-around gap-4 flex-col sm:flex-row">
                {/* SVG Mock Pie Chart */}
                <div className="relative w-32 h-32 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                    {/* Circle representing parts */}
                    <circle r="16" cx="16" cy="16" fill="transparent" stroke="#4f46e5" strokeWidth="32" strokeDasharray="45 100" />
                    <circle r="16" cx="16" cy="16" fill="transparent" stroke="#0ea5e9" strokeWidth="32" strokeDasharray="30 100" strokeDashoffset="-45" />
                    <circle r="16" cx="16" cy="16" fill="transparent" stroke="#10b981" strokeWidth="32" strokeDasharray="15 100" strokeDashoffset="-75" />
                    <circle r="16" cx="16" cy="16" fill="transparent" stroke="#f59e0b" strokeWidth="32" strokeDasharray="10 100" strokeDashoffset="-90" />
                  </svg>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center font-bold text-xs text-slate-700 shadow-3xs">
                    89 Leads
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                    <span>LinkedIn (45%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-sky-500 rounded-full" />
                    <span>Company Career Site (30%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    <span>Employee Referral (15%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                    <span>Organic Search (10%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Status Bar Graph */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-4">
              <div className="border-b border-slate-100 pb-2.5">
                <h4 className="text-xs font-black text-slate-900 uppercase">Hiring Funnel Conversion Status</h4>
                <p className="text-[9px] text-slate-400 font-semibold">Volume conversion per stage</p>
              </div>

              <div className="space-y-3.5 text-[11px] font-semibold text-slate-700">
                {[
                  { label: '1. Sourced / Applied', count: 89, max: 100, pct: '89%', color: 'bg-slate-400' },
                  { label: '2. Phone Screening', count: 42, max: 100, pct: '42%', color: 'bg-amber-500' },
                  { label: '3. Coding / Technical', count: 24, max: 100, pct: '24%', color: 'bg-indigo-600' },
                  { label: '4. Signed / Hired', count: 12, max: 100, pct: '12%', color: 'bg-emerald-600' },
                ].map((row, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between">
                      <span>{row.label}</span>
                      <span className="text-slate-900 font-bold">{row.count} applicants</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: row.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 1. RECRUIT JOBS LIST SUBTAB */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'recruit-jobs' && (
        <div className="space-y-4 animate-fade-in">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors flex-1">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search jobs by title..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative border border-slate-200 rounded-lg px-2 bg-slate-50">
              <select 
                className="w-full bg-transparent border-none text-xs py-2 text-slate-700 focus:outline-none font-semibold cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="relative border border-slate-200 rounded-lg px-2 bg-slate-50">
              <select 
                className="w-full bg-transparent border-none text-xs py-2 text-slate-700 focus:outline-none font-semibold cursor-pointer"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          {/* Jobs Listing Grid */}
          {filteredJobsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobsList.map(job => (
                <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-500 transition-all shadow-2xs flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded font-mono uppercase">{job.id}</span>
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight">{job.title}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">{job.department} • {job.location}</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between items-center text-[11px] font-semibold text-slate-600">
                    <span>Recruiter:</span>
                    <span className="text-slate-800 font-bold">Rashad Lakin</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => alert(`Reviewing applications for: ${job.title}`)}
                      className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold py-2 rounded-lg text-center cursor-pointer"
                    >
                      Applications ({applications.filter(a => a.jobTitle === job.title).length})
                    </button>
                    <button 
                      onClick={() => onDeleteJob(job.id)}
                      className="w-1/2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold py-2 rounded-lg text-center cursor-pointer"
                    >
                      Delete Role
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-2xs max-w-sm mx-auto space-y-2">
              <Briefcase className="h-10 w-10 text-slate-300 mx-auto" />
              <h4 className="text-xs font-black text-slate-900">No matching jobs found</h4>
              <p className="text-[11px] text-slate-400 font-medium">Try resetting your status or department filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 2. RECRUIT JOB APPLICATIONS SUBTAB */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'recruit-applications' && (
        <div className="space-y-4 animate-fade-in">
          {/* Search/Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors flex-1">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search applicants by name, email or job..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative border border-slate-200 rounded-lg px-2 bg-slate-50">
              <select 
                className="w-full bg-transparent border-none text-xs py-2 text-slate-700 focus:outline-none font-semibold cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Applicant Details</th>
                    <th className="px-6 py-3.5">Target Opportunity</th>
                    <th className="px-6 py-3.5">Email Contact</th>
                    <th className="px-6 py-3.5">Applied Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredApplications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{app.candidateName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {app.id}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-indigo-600">{app.jobTitle}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{app.email}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono">{app.appliedDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          app.status === 'Shortlisted' ? 'bg-blue-50 text-blue-700' :
                          app.status === 'Interview' ? 'bg-amber-50 text-amber-700' :
                          app.status === 'Applied' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => alert(`Reviewing application profile for ${app.candidateName}`)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                            title="Review Portfolio"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteApplication(app.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Reject Application"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 3. RECRUIT CANDIDATE DATABASE SUBTAB */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'recruit-database' && (
        <div className="space-y-4 animate-fade-in">
          {/* Search bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex gap-3">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors flex-1">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search resumes by candidate name, skills tag, location..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Database Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidateDatabase.map((cand, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-500/60 transition-all shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight">{cand.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{cand.location}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-emerald-700" />
                      <span>{cand.matchScore} Match</span>
                    </span>
                  </div>

                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Skills Profile:</span>
                    <p className="text-[11px] text-slate-700 font-semibold leading-relaxed truncate">{cand.skills}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => alert(`Opening resume dossier for: ${cand.name}`)}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold py-2 rounded-lg text-center cursor-pointer"
                  >
                    View Resume
                  </button>
                  <button 
                    onClick={() => onDeleteCandidate(cand.name)}
                    className="w-1/2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold py-2 rounded-lg text-center cursor-pointer"
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 4. RECRUIT INTERVIEW SCHEDULE SUBTAB */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'recruit-interviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Left: Custom CSS-Grid interactive calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            
            {/* Calendar Controls */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900 uppercase">Interview Schedule Calendar</h4>
                <p className="text-[10px] text-slate-400 font-semibold">{monthNames[calendarMonth]} {calendarYear}</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer border border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => { setCalendarMonth(6); setCalendarYear(2026); }}
                  className="px-2.5 py-1.5 hover:bg-slate-100 text-[10px] font-bold rounded-lg text-slate-600 border border-slate-200 cursor-pointer"
                >
                  Today
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer border border-slate-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Grid Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-1 bg-slate-50 rounded">{d}</div>
              ))}
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Pre-spaces */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-16 bg-slate-50/20 rounded-lg border border-slate-100/50" />
              ))}

              {/* Days of current month */}
              {daysArray.map(day => {
                const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const daysInterviews = interviews.filter(i => i.date === dateStr);

                return (
                  <div 
                    key={day} 
                    onClick={() => {
                      if (daysInterviews.length > 0) {
                        alert(`Loop scheduled on this day: \n${daysInterviews.map(i => `• ${i.candidateName} for ${i.jobTitle}`).join('\n')}`);
                      } else {
                        alert(`No interviews on this date: ${dateStr}. Double-click to schedule.`);
                      }
                    }}
                    className={`h-16 p-1.5 border rounded-lg flex flex-col justify-between transition-all select-none cursor-pointer ${
                      daysInterviews.length > 0 
                        ? 'border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/60 shadow-3xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${daysInterviews.length > 0 ? 'text-indigo-600 font-black' : 'text-slate-400'}`}>{day}</span>
                    {daysInterviews.length > 0 && (
                      <div className="text-[8px] bg-indigo-600 text-white font-extrabold px-1 rounded truncate leading-none py-0.5">
                        {daysInterviews.length} Loop
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: List schedule */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase border-b border-slate-100 pb-2">Schedule Loop list</h4>
            
            <div className="space-y-3">
              {interviews.length > 0 ? (
                interviews.map(int => (
                  <div key={int.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2 relative">
                    <button 
                      onClick={() => onDeleteInterview(int.id)}
                      className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Cancel Loop"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono uppercase font-semibold">{int.id}</span>
                      <span className="text-[9px] text-slate-400 font-mono font-semibold">{int.date}</span>
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-[11px] font-black text-slate-900">{int.candidateName}</h5>
                      <p className="text-[10px] text-indigo-600 font-bold truncate">{int.jobTitle}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Interviewer: <span className="font-semibold text-slate-700">{int.interviewer}</span></p>
                      <p className="text-[9px] text-slate-400 font-semibold">Scheduled Time: {int.time} PM</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">No loop schedule recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 5. RECRUIT OFFER LETTERS SUBTAB */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'recruit-offers' && (
        <div className="space-y-4 animate-fade-in">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex gap-3">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors flex-1">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search offers by candidate name..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Offers Letters Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Candidate Target</th>
                    <th className="px-6 py-3.5">Job Opportunity</th>
                    <th className="px-6 py-3.5">Salary Offer</th>
                    <th className="px-6 py-3.5">Created Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredOffers.map((off, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-900">{off.candidate}</td>
                      <td className="px-6 py-4 font-semibold text-indigo-600">{off.job}</td>
                      <td className="px-6 py-4 font-bold text-slate-700">{off.salary}</td>
                      <td className="px-6 py-4 font-mono text-slate-400">{off.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          off.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {off.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => alert(`Reviewing signed offer letter document for: ${off.candidate}`)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteOffer(off.candidate)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 6. RECRUIT SKILLS DIRECTORY SUBTAB */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'recruit-skills' && (
        <div className="space-y-4 animate-fade-in">
          {/* Search bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex gap-3">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors flex-1">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search skills tag directory..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Grid Layout of Skills Tags */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap gap-2">
              {filteredSkills.map(skill => (
                <div 
                  key={skill} 
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <span>{skill}</span>
                  <button 
                    onClick={() => onDeleteSkill(skill)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                    title="Remove Skill Tag"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 7. RECRUIT REPORTS SUBTAB */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'recruit-reports' && (
        <div className="space-y-6 animate-fade-in">
          {/* Worksuite styled metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: 'Job Applications logged', val: 89, color: 'text-indigo-600', bg: 'bg-indigo-50/50 border border-indigo-100' },
              { label: 'Total Job Postings', val: jobs.length, color: 'text-slate-800', bg: 'bg-slate-50 border border-slate-150' },
              { label: 'Total Selected Hires', val: 22, color: 'text-emerald-600', bg: 'bg-emerald-50/50 border border-emerald-100' },
              { label: 'Total Interviews Loop', val: interviews.length, color: 'text-amber-600', bg: 'bg-amber-50/50 border border-amber-100' },
            ].map((st, i) => (
              <div key={i} className={`p-4 rounded-xl shadow-2xs ${st.bg}`}>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{st.label}</span>
                <h3 className={`text-2xl font-black mt-1 ${st.color}`}>{st.val}</h3>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Updated real-time</p>
              </div>
            ))}
          </div>

          {/* Report analytical bar chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black text-slate-900 uppercase">Incoming Applications Monthly Trends</h4>
              <p className="text-[9px] text-slate-400 font-semibold">Performance metrics over past semester</p>
            </div>

            <div className="h-64 flex items-end justify-between gap-2.5 pt-6 text-[10px] font-bold text-slate-500 font-mono">
              {[
                { month: 'Jan', val: 25, height: 'h-[25%]' },
                { month: 'Feb', val: 38, height: 'h-[38%]' },
                { month: 'Mar', val: 55, height: 'h-[55%]' },
                { month: 'Apr', val: 74, height: 'h-[74%]' },
                { month: 'May', val: 62, height: 'h-[62%]' },
                { month: 'Jun', val: 89, height: 'h-[89%]' },
              ].map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[8px] absolute -translate-y-8">{m.val}</span>
                  <div className={`w-full bg-indigo-100 group-hover:bg-indigo-600 transition-all rounded-t-lg ${m.height}`} />
                  <span className="text-[9px] font-semibold text-slate-600">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SERVER MANAGER & HOESTING DETAILS */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'server-manager' && (
        <div className="space-y-6 animate-fade-in">
          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 font-sans">
            {[
              { label: 'Total Hostings', val: hostings.length, icon: Server, color: 'text-slate-800', border: 'border-slate-200 bg-white' },
              { label: 'Active Hostings', val: hostings.filter(h => h.status === 'Active').length, icon: CheckCircle2, color: 'text-emerald-600', border: 'border-emerald-100 bg-emerald-50/20' },
              { label: 'Total Domains', val: domains.length, icon: Globe, color: 'text-slate-800', border: 'border-slate-200 bg-white' },
              { label: 'Active Domains', val: domains.filter(d => d.status === 'Active').length, icon: CheckCircle2, color: 'text-indigo-600', border: 'border-indigo-100 bg-indigo-50/20' },
              { label: 'Expiring Hostings', val: hostings.filter(h => h.status === 'Expiring').length, icon: AlertTriangle, color: 'text-amber-600', border: 'border-amber-100 bg-amber-50/20' },
              { label: 'Expiring Domains', val: domains.filter(d => d.status === 'Expiring').length, icon: AlertTriangle, color: 'text-amber-600', border: 'border-amber-100 bg-amber-50/20' },
            ].map((card, i) => {
              const IconComp = card.icon;
              return (
                <div key={i} className={`p-4 rounded-xl border shadow-2xs ${card.border} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{card.label}</span>
                    <IconComp className="h-4 w-4 text-slate-400" />
                  </div>
                  <h3 className={`text-2xl font-black mt-2 ${card.color}`}>{card.val}</h3>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Expiring items - left 7 columns */}
            <div className="lg:col-span-7 space-y-6">
              {/* Expiring hostings */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase">Hostings Attention Required</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Expiring or inactive hosting configurations</p>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    {hostings.filter(h => h.status !== 'Active').length} Flagged
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {hostings.filter(h => h.status !== 'Active').length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                      All hostings are in active status!
                    </div>
                  ) : (
                    hostings.filter(h => h.status !== 'Active').map(h => (
                      <div key={h.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{h.name}</span>
                            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 rounded">{h.id}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                            <span>IP: {h.ip}</span>
                            <span>•</span>
                            <span>Cost: {h.cost}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-semibold">Expires: {h.expiryDate}</div>
                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded mt-1 ${
                              h.status === 'Expiring' ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {h.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Expiring domains */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase">Domains Action Required</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Expiring or non-renewing domain registrations</p>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    {domains.filter(d => d.status !== 'Active').length} Flagged
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {domains.filter(d => d.status !== 'Active').length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                      All domains are active and renewing.
                    </div>
                  ) : (
                    domains.filter(d => d.status !== 'Active').map(d => (
                      <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{d.name}</span>
                            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 rounded">{d.id}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                            <span>Registrar: {d.registrar}</span>
                            <span>•</span>
                            <span>Auto Renew: {d.autoRenew ? 'Enabled' : 'Disabled'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-semibold">Expires: {d.expiryDate}</div>
                            <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded mt-1 bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
                              {d.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Operations log / recent activity - right 5 columns */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                  <h3 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-600" />
                    <span>Operations Activity Feed</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Real-time status alerts and background operations</p>
                </div>
                <div className="p-5 space-y-4 max-h-[460px] overflow-y-auto divide-y divide-slate-100">
                  {serverActivities.map((act, idx) => (
                    <div key={act.id} className={`flex gap-3 text-xs pt-3 ${idx === 0 ? 'pt-0' : ''}`}>
                      <div className="mt-0.5 shrink-0">
                        {act.type === 'ssl' ? (
                          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                        ) : act.type === 'domain' ? (
                          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                            <Globe className="h-4 w-4" />
                          </div>
                        ) : act.type === 'error' ? (
                          <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                            <AlertTriangle className="h-4 w-4 animate-bounce" />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
                            <Sliders className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-slate-700 font-semibold leading-relaxed">{act.text}</p>
                        <span className="text-[9px] text-slate-400 font-mono block font-bold">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hosting Management Subtab */}
      {subTab === 'server-hostings' && (
        <div className="space-y-4 animate-fade-in">
          {/* Toolbar with Search and Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors flex-1">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search hosting nodes by name or IP..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={serverSearchQuery}
                onChange={(e) => setServerSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer text-slate-600"
                value={serverProviderFilter}
                onChange={(e) => setServerProviderFilter(e.target.value)}
              >
                <option value="All">All Providers</option>
                {Array.from(new Set(hostings.map(h => h.provider))).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer text-slate-600"
                value={serverStatusFilter}
                onChange={(e) => setServerStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expiring">Expiring</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Hostings Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Hosting Node</th>
                    <th className="px-6 py-3.5">IP Address</th>
                    <th className="px-6 py-3.5">Provider</th>
                    <th className="px-6 py-3.5">Type</th>
                    <th className="px-6 py-3.5">SSL Settings</th>
                    <th className="px-6 py-3.5">Expiry Date</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                  {hostings
                    .filter(h => {
                      const matchesSearch = h.name.toLowerCase().includes(serverSearchQuery.toLowerCase()) || h.ip.includes(serverSearchQuery);
                      const matchesProv = serverProviderFilter === 'All' || h.provider === serverProviderFilter;
                      const matchesStatus = serverStatusFilter === 'All' || h.status === serverStatusFilter;
                      return matchesSearch && matchesProv && matchesStatus;
                    })
                    .map(h => (
                      <tr key={h.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{h.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{h.id}</div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-500">{h.ip}</td>
                        <td className="px-6 py-4 font-extrabold text-indigo-600">{h.provider}</td>
                        <td className="px-6 py-4 font-semibold text-slate-500">{h.type}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            {h.sslActive ? (
                              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                            )}
                            <span className="font-bold text-slate-600">{h.ssl}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">{h.expiryDate}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{h.cost}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded ${
                            h.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            h.status === 'Expiring' ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' :
                            'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {h.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setHostings(prev => prev.map(item => item.id === h.id ? { ...item, sslActive: !item.sslActive, ssl: item.sslActive ? 'None (Inactive)' : 'Let\'s Encrypt (Active)' } : item));
                                alert(`SSL Certificate configurations updated for node: ${h.name}`);
                              }}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                              title="Toggle SSL / Renew Certificate"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete hosting node ${h.name}?`)) {
                                  setHostings(prev => prev.filter(item => item.id !== h.id));
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Hosting Node"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Domain Management Subtab */}
      {subTab === 'server-domains' && (
        <div className="space-y-4 animate-fade-in">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors flex-1">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search domains..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={serverSearchQuery}
                onChange={(e) => setServerSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer text-slate-600"
                value={serverStatusFilter}
                onChange={(e) => setServerStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expiring">Expiring</option>
              </select>
            </div>
          </div>

          {/* Domains Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Domain</th>
                    <th className="px-6 py-3.5">Registrar</th>
                    <th className="px-6 py-3.5">Expiry Date</th>
                    <th className="px-6 py-3.5">Auto Renew</th>
                    <th className="px-6 py-3.5">DNS Provider</th>
                    <th className="px-6 py-3.5">Cost</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                  {domains
                    .filter(d => {
                      const matchesSearch = d.name.toLowerCase().includes(serverSearchQuery.toLowerCase());
                      const matchesStatus = serverStatusFilter === 'All' || d.status === serverStatusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map(d => (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{d.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{d.id}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-500">{d.registrar}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">{d.expiryDate}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setDomains(prev => prev.map(item => item.id === d.id ? { ...item, autoRenew: !item.autoRenew } : item));
                              alert(`Auto-renew configuration altered for domain: ${d.name}`);
                            }}
                            className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                              d.autoRenew ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {d.autoRenew ? 'Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-indigo-600">{d.dnsProvider}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{d.cost}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded ${
                            d.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete domain record ${d.name}?`)) {
                                setDomains(prev => prev.filter(item => item.id !== d.id));
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete Domain Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Provider Management Subtab */}
      {subTab === 'server-providers' && (
        <div className="space-y-4 animate-fade-in">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search third-party infrastructure providers by name..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={serverSearchQuery}
                onChange={(e) => setServerSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Providers Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Provider Service</th>
                    <th className="px-6 py-3.5">Contact Person</th>
                    <th className="px-6 py-3.5">Support Email</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Active Hostings</th>
                    <th className="px-6 py-3.5">Active Domains</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                  {providers
                    .filter(p => p.name.toLowerCase().includes(serverSearchQuery.toLowerCase()))
                    .map(p => {
                      const hostCount = hostings.filter(h => h.provider === p.name).length;
                      const domCount = domains.filter(d => d.registrar === p.name || d.dnsProvider.includes(p.name)).length;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                          <td className="px-6 py-4 font-semibold text-slate-500">{p.contactName}</td>
                          <td className="px-6 py-4">
                            <a href={`mailto:${p.contactEmail}`} className="text-indigo-600 hover:underline font-mono text-[10px] flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              <span>{p.contactEmail}</span>
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-700 pl-8">{hostCount} nodes</td>
                          <td className="px-6 py-4 font-bold text-slate-700 pl-8">{domCount} entries</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove provider registry for ${p.name}?`)) {
                                  setProviders(prev => prev.filter(item => item.id !== p.id));
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Provider"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SECURE WEBHOOKS SECTION */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {subTab === 'webhooks' && (
        <div className="space-y-6 animate-fade-in">
          {/* Webhooks config list toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex gap-3">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors flex-1">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search webhooks channels..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={serverSearchQuery}
                onChange={(e) => setServerSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Webhook Channel Name</th>
                    <th className="px-6 py-3.5">Endpoint URL</th>
                    <th className="px-6 py-3.5">Trigger Hook Event</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                  {webhooks
                    .filter(w => w.name.toLowerCase().includes(serverSearchQuery.toLowerCase()))
                    .map(wh => (
                      <tr key={wh.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{wh.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{wh.id}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400 truncate max-w-xs">{wh.url}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded text-[10px]">
                            {wh.event}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {wh.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              id={`trigger-webhook-btn-${wh.id}`}
                              onClick={() => {
                                onTriggerWebhook(wh.id);
                                alert(`Webhook HTTP simulation call successfully dispatched to: ${wh.url}`);
                              }}
                              className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Play className="h-3 w-3 fill-current" />
                              <span>Simulate</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove webhook trigger ${wh.name}?`)) {
                                  alert('Webhook disabled and archived.');
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Logs Subtab */}
      {subTab === 'webhook-logs' && (
        <div className="space-y-4 animate-fade-in">
          {/* Log Controls toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative flex items-center border border-slate-200 rounded-lg px-2.5 bg-slate-50 focus-within:border-indigo-500 transition-colors w-full sm:max-w-md">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search logs by webhook name or event..."
                className="w-full bg-transparent border-0 focus:ring-0 text-xs py-2 pl-2 text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
                value={webhookLogsSearch}
                onChange={(e) => {
                  setWebhookLogsSearch(e.target.value);
                  setWebhookLogsPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setWebhookLogsSortDesc(!webhookLogsSortDesc)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none font-medium cursor-pointer text-slate-600 flex items-center gap-1.5"
              >
                <span>Timestamp:</span>
                <span className="font-bold text-indigo-600">{webhookLogsSortDesc ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>
          </div>

          {/* Table or Empty State */}
          {(() => {
            const processedLogs = webhookLogs
              .filter(log => {
                return log.webhookName.toLowerCase().includes(webhookLogsSearch.toLowerCase()) || 
                       log.event.toLowerCase().includes(webhookLogsSearch.toLowerCase());
              })
              .sort((a, b) => {
                const dateA = new Date(a.timestamp).getTime();
                const dateB = new Date(b.timestamp).getTime();
                return webhookLogsSortDesc ? dateB - dateA : dateA - dateB;
              });

            const totalLogs = processedLogs.length;
            const totalPages = Math.max(1, Math.ceil(totalLogs / webhookLogsPerPage));
            const startIdx = (webhookLogsPage - 1) * webhookLogsPerPage;
            const paginatedLogs = processedLogs.slice(startIdx, startIdx + webhookLogsPerPage);

            if (totalLogs === 0) {
              return (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs space-y-3">
                  <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-150">
                    <Sliders className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-sans">No Webhook Logs Recorded</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">No webhook simulation executions matched your current query parameters or no REST logs are logged yet.</p>
                </div>
              );
            }

            return (
              <div className="space-y-4 font-sans">
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                          <th className="px-6 py-3.5">Log ID</th>
                          <th className="px-6 py-3.5">Timestamp</th>
                          <th className="px-6 py-3.5">Webhook Channel</th>
                          <th className="px-6 py-3.5">Event Code</th>
                          <th className="px-6 py-3.5">Response Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                        {paginatedLogs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-mono font-bold text-slate-400">{log.id}</td>
                            <td className="px-6 py-4 font-mono text-slate-500">{log.timestamp}</td>
                            <td className="px-6 py-4 text-slate-900">{log.webhookName}</td>
                            <td className="px-6 py-4">
                              <span className="font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[10px]">
                                {log.event}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded ${
                                log.responseCode >= 200 && log.responseCode < 300 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                HTTP {log.responseCode} {log.responseCode === 200 ? 'SUCCESS' : 'ERROR'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500">
                    Showing <span className="text-slate-900 font-bold">{startIdx + 1}</span> to{' '}
                    <span className="text-slate-900 font-bold">{Math.min(startIdx + webhookLogsPerPage, totalLogs)}</span> of{' '}
                    <span className="text-slate-900 font-bold">{totalLogs}</span> delivery logs
                  </span>
                  <div className="flex gap-1">
                    <button
                      disabled={webhookLogsPage === 1}
                      onClick={() => setWebhookLogsPage(p => p - 1)}
                      className="p-1.5 border border-slate-200 rounded bg-slate-50 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4 text-slate-600" />
                    </button>
                    <button
                      disabled={webhookLogsPage === totalPages}
                      onClick={() => setWebhookLogsPage(p => p + 1)}
                      className="p-1.5 border border-slate-200 rounded bg-slate-50 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ADD JOB DIALOG MODAL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Create Active Opportunity</h3>
              <button onClick={() => setShowAddJobModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={jobSubmit => handleJobSubmit(jobSubmit)} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Job Title Opportunity *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Senior Frontend Architect"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Department</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none cursor-pointer"
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Location</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none cursor-pointer"
                    value={jobLoc}
                    onChange={(e) => setJobLoc(e.target.value)}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Target Openings (Seats)</label>
                  <input 
                    type="number" required min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={jobOpenings}
                    onChange={(e) => setJobOpenings(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Publishing Recruiter</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none text-slate-400"
                    value={jobRecruiter}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Job Description</label>
                <textarea 
                  rows={3}
                  placeholder="Paste details, role requirements, compensation ranges here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddJobModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ADD APPLICATION DIALOG MODAL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showAddApplicationModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Add Job Application</h3>
              <button onClick={() => setShowAddApplicationModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={appSubmit => handleApplicationSubmit(appSubmit)} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Candidate Name *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Cordia Rath V"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={appCandidateName}
                    onChange={(e) => setAppCandidateName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Email *</label>
                  <input 
                    type="email" required
                    placeholder="cordia@worksuite.io"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={appEmail}
                    onChange={(e) => setAppEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Target Job Position *</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none cursor-pointer"
                    value={appJob}
                    onChange={(e) => setAppJob(e.target.value)}
                  >
                    {jobs.map(j => (
                      <option key={j.id} value={j.title}>{j.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Candidate Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bangalore"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={appLocVal}
                    onChange={(e) => setAppLocVal(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Core Skills Separated by Commas</label>
                <input 
                  type="text"
                  placeholder="React, CSS, Node.js"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                  value={appSkills}
                  onChange={(e) => setAppSkills(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddApplicationModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SCHEDULE INTERVIEW DIALOG MODAL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showAddInterviewModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Schedule Interview Loop</h3>
              <button onClick={() => setShowAddInterviewModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={intSubmit => handleInterviewSubmit(intSubmit)} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Candidate Target Name *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Harry Potter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={intCandidate}
                    onChange={(e) => setIntCandidate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Target Job position *</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none cursor-pointer"
                    value={intJob}
                    onChange={(e) => setIntJob(e.target.value)}
                  >
                    {jobs.map(j => (
                      <option key={j.id} value={j.title}>{j.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Interview Date *</label>
                  <input 
                    type="date" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={intDate}
                    onChange={(e) => setIntDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Scheduled Time *</label>
                  <input 
                    type="time" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={intTime}
                    onChange={(e) => setIntTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Assigned Host Interviewer *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Elena Rostova & Daniel Park"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                  value={intInterviewer}
                  onChange={(e) => setIntInterviewer(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddInterviewModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
                >
                  Schedule Loop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* GENERATE OFFER LETTER DIALOG MODAL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showAddOfferModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Generate Offer Letter Document</h3>
              <button onClick={() => setShowAddOfferModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={offSubmit => handleOfferSubmit(offSubmit)} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Candidate Name *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Michael Corleone"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={offCandidate}
                    onChange={(e) => setOffCandidate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Target Job Position *</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none cursor-pointer"
                    value={offJob}
                    onChange={(e) => setOffJob(e.target.value)}
                  >
                    {jobs.map(j => (
                      <option key={j.id} value={j.title}>{j.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Offer Expiry Date</label>
                  <input 
                    type="date" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={offExpiry}
                    onChange={(e) => setOffExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Target Joining Date</label>
                  <input 
                    type="date" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                    value={offJoining}
                    onChange={(e) => setOffJoining(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Salary Structure (Amount / Frequency) *</label>
                <input 
                  type="text" required
                  placeholder="e.g. $120,000 / Yr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
                  value={offSalary}
                  onChange={(e) => setOffSalary(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddOfferModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
                >
                  Generate Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ADD SKILL MODAL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showAddSkillModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase">Add Skill Tags</h3>
              <button onClick={() => setShowAddSkillModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={skillsSubmit => handleSkillsSubmit(skillsSubmit)} className="space-y-4 text-xs font-semibold">
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {newSkillInputs.map((inputVal, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input 
                      type="text" required
                      placeholder="e.g. Rust, Go, Figma, Kubernetes"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-indigo-500 focus:outline-none"
                      value={inputVal}
                      onChange={(e) => handleSkillInputChange(idx, e.target.value)}
                    />
                    {newSkillInputs.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveSkillField(idx)}
                        className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg cursor-pointer border border-rose-100"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={handleAddSkillField}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold p-2 rounded-lg text-center cursor-pointer border border-dashed border-slate-300"
              >
                + Add Another Skill Tag
              </button>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => { setShowAddSkillModal(false); setNewSkillInputs(['']); }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg cursor-pointer shadow-xs"
                >
                  Save Skill Tags
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* WEBHOOK ADD MODAL (DYNAMICS ENHANCED) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showWhModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto p-4 font-sans">
          <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-slide-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-indigo-600" />
                <span>Add REST Webhook Trigger Pipeline</span>
              </h3>
              <button 
                onClick={() => setShowWhModal(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWebhookSubmitWithDetails} className="space-y-4 text-xs font-semibold">
              {/* Basic Information Section */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Basic Information & URL</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Channel Name *</label>
                    <input
                      type="text" required
                      className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. Discord Production Alerts"
                      value={whName}
                      onChange={(e) => setWhName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Trigger Event Hook *</label>
                    <select
                      className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      value={whEvent}
                      onChange={(e) => setWhEvent(e.target.value)}
                    >
                      <option value="invoice.paid">invoice.paid</option>
                      <option value="ticket.created">ticket.created</option>
                      <option value="leave.requested">leave.requested</option>
                      <option value="server.critical">server.critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Method</label>
                    <select
                      className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      value={whMethod}
                      onChange={(e) => setWhMethod(e.target.value as any)}
                    >
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                      <option value="PUT">PUT</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Destination Endpoint URL *</label>
                    <input
                      type="url" required
                      className="w-full bg-white text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="https://api.yourdomain.com/webhook-receiver"
                      value={whUrl}
                      onChange={(e) => setWhUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Request Headers Section */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Request Headers</h4>
                  <button
                    type="button"
                    onClick={addHeaderRow}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    + Add Header
                  </button>
                </div>

                {whHeaders.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No custom request headers added.</p>
                ) : (
                  <div className="space-y-2">
                    {whHeaders.map((hdr, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text" required
                          placeholder="Header Key"
                          className="w-1/2 bg-white text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                          value={hdr.key}
                          onChange={(e) => updateHeaderRow(idx, 'key', e.target.value)}
                        />
                        <input
                          type="text" required
                          placeholder="Header Value"
                          className="w-1/2 bg-white text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                          value={hdr.value}
                          onChange={(e) => updateHeaderRow(idx, 'value', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeHeaderRow(idx)}
                          className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg border border-rose-100 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Request Body parameters Section */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Request Payload Parameters (JSON/Query)</h4>
                  <button
                    type="button"
                    onClick={addBodyRow}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    + Add Parameter
                  </button>
                </div>

                {whBodyParams.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No custom payload parameters added.</p>
                ) : (
                  <div className="space-y-2">
                    {whBodyParams.map((param, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text" required
                          placeholder="Param Key"
                          className="w-1/2 bg-white text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                          value={param.key}
                          onChange={(e) => updateBodyRow(idx, 'key', e.target.value)}
                        />
                        <input
                          type="text" required
                          placeholder="Param Value"
                          className="w-1/2 bg-white text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                          value={param.value}
                          onChange={(e) => updateBodyRow(idx, 'value', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeBodyRow(idx)}
                          className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg border border-rose-100 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowWhModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Webhook Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ADD HOSTING CONFIGURATION MODAL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showAddHostingModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto p-4 font-sans">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Server className="h-4.5 w-4.5 text-indigo-600" />
                <span>Register Hosting Configuration</span>
              </h3>
              <button 
                onClick={() => setShowAddHostingModal(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleHostingSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Hosting/Domain Name *</label>
                  <input
                    type="text" required
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. staging.worksuite.biz"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">IP Address *</label>
                  <input
                    type="text" required
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="e.g. 104.198.22.8"
                    value={hostIp}
                    onChange={(e) => setHostIp(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Infrastructure Provider</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={hostProvider}
                    onChange={(e) => setHostProvider(e.target.value)}
                  >
                    {providers.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Hosting Node Type</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={hostType}
                    onChange={(e) => setHostType(e.target.value)}
                  >
                    <option value="Docker Container">Docker Container (Cloud Run / ECS)</option>
                    <option value="VPS VM">VPS Virtual Machine (EC2 / Compute Engine)</option>
                    <option value="Shared Cloud">Shared Cloud Platform (Vercel / Netlify)</option>
                    <option value="Bare Metal">Bare Metal Dedicated Server</option>
                  </select>
                </div>
              </div>

              {/* SSL Settings */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-800">SSL Encryption Certificate</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Toggle and select automated SSL parameters</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={hostSslActive}
                      onChange={(e) => setHostSslActive(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {hostSslActive && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">SSL Certificate Authority Provider</label>
                    <select
                      className="w-full bg-white text-slate-800 p-2 rounded-lg border border-slate-200 focus:outline-none"
                      value={hostSslProvider}
                      onChange={(e) => setHostSslProvider(e.target.value)}
                    >
                      <option value="Let's Encrypt">Let's Encrypt (Automated Renewal)</option>
                      <option value="Cloudflare SSL">Cloudflare Universal SSL Proxy</option>
                      <option value="AWS Certificate Manager">AWS Certificate Manager (ACM)</option>
                      <option value="ZeroSSL">ZeroSSL API Certification</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Price Rate (USD)</label>
                  <input
                    type="number" required min="0"
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 15"
                    value={hostCost}
                    onChange={(e) => setHostCost(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Billing Cycle</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={hostCycle}
                    onChange={(e) => setHostCycle(e.target.value)}
                  >
                    <option value="Mo">Per Month</option>
                    <option value="Yr">Per Year</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Expiry/Renewal Date</label>
                  <input
                    type="date" required
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={hostExpiry}
                    onChange={(e) => setHostExpiry(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Notification Warnings</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={hostNotify}
                    onChange={(e) => setHostNotify(e.target.value)}
                  >
                    <option value="7">7 Days before Expiry</option>
                    <option value="15">15 Days before Expiry</option>
                    <option value="30">30 Days before Expiry</option>
                    <option value="60">60 Days before Expiry</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Administrative Description</label>
                  <textarea
                    rows={2}
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                    placeholder="Add hosting purpose details here..."
                    value={hostDesc}
                    onChange={(e) => setHostDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowAddHostingModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow-xs cursor-pointer"
                >
                  Register Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* LINK DOMAIN REGISTRATION MODAL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showAddDomainModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto p-4 font-sans">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-indigo-600" />
                <span>Link Domain Registration</span>
              </h3>
              <button 
                onClick={() => setShowAddDomainModal(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDomainSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Domain Name *</label>
                  <input
                    type="text" required
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. worksuite.io"
                    value={domName}
                    onChange={(e) => setDomName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Registrar Service</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={domRegistrar}
                    onChange={(e) => setDomRegistrar(e.target.value)}
                  >
                    <option value="Namecheap">Namecheap</option>
                    <option value="GoDaddy">GoDaddy</option>
                    <option value="Google Domains">Google Domains</option>
                    <option value="Cloudflare Registrations">Cloudflare Registrations</option>
                    <option value="AWS Route53 Domain Management">AWS Route53 Domain Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Target DNS Nameserver Provider</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={domDns}
                    onChange={(e) => setDomDns(e.target.value)}
                  >
                    <option value="Cloudflare DNS">Cloudflare DNS Servers (Recommended)</option>
                    <option value="AWS Route53">AWS Route53 Resolver</option>
                    <option value="Namecheap BasicDNS">Namecheap BasicDNS</option>
                    <option value="DigitalOcean DNS">DigitalOcean Premium Nameservers</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Price Rate (USD) *</label>
                    <input
                      type="number" required min="1"
                      className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 12"
                      value={domCost}
                      onChange={(e) => setDomCost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Frequency</label>
                    <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-center select-none font-bold">
                      Per Yr
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto Renew parameters toggle */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-[11px] font-black text-slate-800">Automated Domain Renewals</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Let registrar charge payment profile on expiry</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={domAutoRenew}
                    onChange={(e) => setDomAutoRenew(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Domain Expiry Date *</label>
                  <input
                    type="date" required
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    value={domExpiry}
                    onChange={(e) => setDomExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Days to Notify before Expiry</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={domNotify}
                    onChange={(e) => setDomNotify(e.target.value)}
                  >
                    <option value="7">7 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Administrative Memo Description</label>
                <textarea
                  rows={2}
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                  placeholder="e.g. Domain bought for bio-backup systems redundancy layer..."
                  value={domDesc}
                  onChange={(e) => setDomDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowAddDomainModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow-xs cursor-pointer"
                >
                  Link Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ADD INFRASTRUCTURE PROVIDER MODAL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showAddProviderModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-indigo-600" />
                <span>Add Infrastructure Provider</span>
              </h3>
              <button 
                onClick={() => setShowAddProviderModal(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProviderSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Provider Service Name *</label>
                <input
                  type="text" required
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. AWS Premium Support"
                  value={provName}
                  onChange={(e) => setProvName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Person</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Janet Jackson"
                    value={provContact}
                    onChange={(e) => setProvContact(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Support Email *</label>
                  <input
                    type="email" required
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. aws-billing@amazon.com"
                    value={provEmail}
                    onChange={(e) => setProvEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Administrative Notes</label>
                <textarea
                  rows={3}
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                  placeholder="Add details, escalation support tiers or API keys references..."
                  value={provNotes}
                  onChange={(e) => setProvNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowAddProviderModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
