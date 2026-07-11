/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Target, Briefcase, FileText, FileSpreadsheet, Plus, 
  Search, Filter, ChevronRight, DollarSign, Building, Mail, Phone, Trash2,
  Calendar, Upload, Download, SlidersHorizontal, List, Kanban, MoreVertical,
  CheckSquare, Square, Edit, Eye, User, Sparkles, Code, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight as ChevronRightIcon, ArrowUpDown, Info, Share2, EyeOff
} from 'lucide-react';
import { Lead, Client, Deal, Proposal, Estimate } from '../types';

interface CRMTabProps {
  subTab: string;
  leads: Lead[];
  clients: Client[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdDate'>) => void;
  onAddClient: (client: Omit<Client, 'id' | 'projectsCount' | 'totalBilled'>) => void;
  onDeleteLead: (id: string) => void;
  onDeleteClient: (id: string) => void;
}

interface EnhancedDeal {
  id: string;
  name: string;
  leadName: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  closeDate: string;
  nextFollowUp: string;
  agentName: string;
  agentRole: string;
  agentAvatar: string;
  watcher: string;
  stage: 'Generated' | 'Qualified' | 'Initial Contact' | 'Schedule Appointment' | 'Lost' | 'Won';
  category: string;
  product: string;
}

export default function CRMTab({
  subTab,
  leads,
  clients,
  onAddLead,
  onAddClient,
  onDeleteLead,
  onDeleteClient
}: CRMTabProps) {
  // --- STATE FOR LEADS ---
  const [leadSearch, setLeadSearch] = useState('');
  const [leadTypeFilter, setLeadTypeFilter] = useState('All');
  const [leadStartDate, setLeadStartDate] = useState('');
  const [leadEndDate, setLeadEndDate] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [leadSortField, setLeadSortField] = useState<keyof Lead>('id');
  const [leadSortAsc, setLeadSortAsc] = useState(false);
  const [activeLeadRowMenu, setActiveLeadRowMenu] = useState<string | null>(null);

  // --- STATE FOR DEALS ---
  const [dealViewMode, setDealViewMode] = useState<'kanban' | 'list'>('kanban');
  const [dealPipeline, setDealPipeline] = useState('Sales Pipeline');
  const [dealCategory, setDealCategory] = useState('All');
  const [dealProduct, setDealProduct] = useState('All');
  const [dealSearch, setDealSearch] = useState('');
  const [dealStartDate, setDealStartDate] = useState('');
  const [dealEndDate, setDealEndDate] = useState('');
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [dealSortField, setDealSortField] = useState<keyof EnhancedDeal>('id');
  const [dealSortAsc, setDealSortAsc] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);

  // --- MODALS AND FORMS STATE ---
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadValue, setNewLeadValue] = useState(10000);
  const [newLeadStatus, setNewLeadStatus] = useState<Lead['status']>('New');

  const [showClientModal, setShowClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  // --- EXTRA SHY FILTERS ---
  const [showLeadExtraFilters, setShowLeadExtraFilters] = useState(false);
  const [showDealExtraFilters, setShowDealExtraFilters] = useState(false);

  // --- IMPORT / EXPORT SIMULATED SYSTEMS ---
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTarget, setImportTarget] = useState<'leads' | 'deals'>('leads');
  const [importRawJson, setImportRawJson] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  // --- LEAD FORM BUILDER PANEL STATE ---
  const [showLeadFormSlider, setShowLeadFormSlider] = useState(false);
  const [formConfig, setFormConfig] = useState({
    title: 'Request a Consult',
    description: 'Provide your contact details and our team will get in touch with you shortly.',
    themeColor: '#4f46e5', // indigo-600
    buttonText: 'Submit Request',
    showPhoneField: true,
    showCompanyField: true,
    successMsg: 'Thank you! Your information has been registered successfully.'
  });
  const [previewName, setPreviewName] = useState('');
  const [previewEmail, setPreviewEmail] = useState('');
  const [previewPhone, setPreviewPhone] = useState('');
  const [previewCompany, setPreviewCompany] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  // --- DEALS PERSISTENT STATE ---
  const [dealsList, setDealsList] = useState<EnhancedDeal[]>([
    {
      id: '9',
      name: 'Delphia Cormier-9',
      leadName: 'Delphia Cormier',
      company: 'Hyatt Inc',
      email: 'fake@example.com',
      phone: '+19804255669',
      value: 64890.00,
      closeDate: '--',
      nextFollowUp: '--',
      agentName: 'Gia Lind',
      agentRole: 'Senior',
      agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      watcher: '--',
      stage: 'Schedule Appointment',
      category: 'Best Case',
      product: 'Smart Watch'
    },
    {
      id: '8',
      name: 'Dr. Kaleigh Schmeler Jr.-8',
      leadName: 'Dr. Kaleigh Schmeler Jr.',
      company: 'Mraz Ltd',
      email: 'fake@example.com',
      phone: '+1-458-685-4940',
      value: 13431.00,
      closeDate: '--',
      nextFollowUp: '--',
      agentName: 'Gia Lind',
      agentRole: 'Senior',
      agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      watcher: '--',
      stage: 'Initial Contact',
      category: 'Closed',
      product: 'Smart Sprinkler'
    },
    {
      id: '7',
      name: 'Elias Hauck-7',
      leadName: 'Elias Hauck',
      company: 'Witting Group',
      email: 'fake@example.com',
      phone: '+15012148979',
      value: 90044.00,
      closeDate: '--',
      nextFollowUp: '--',
      agentName: 'Prof. Theresia Bechteler',
      agentRole: 'Junior',
      agentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      watcher: '--',
      stage: 'Generated',
      category: 'Commit',
      product: 'Electric Kettle'
    },
    {
      id: '6',
      name: 'Elias Hauck-6',
      leadName: 'Elias Hauck',
      company: 'Witting Group',
      email: 'fake@example.com',
      phone: '+15012148979',
      value: 30174.00,
      closeDate: '--',
      nextFollowUp: '--',
      agentName: 'Prof. Theresia Bechteler',
      agentRole: 'Junior',
      agentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      watcher: '--',
      stage: 'Initial Contact',
      category: 'Best Case',
      product: "Men's Leather Wallet"
    },
    {
      id: '5',
      name: 'Pascale O\'Conner-5',
      leadName: 'Pascale O\'Conner',
      company: 'Pacocha-Ritchie',
      email: 'fake@example.com',
      phone: '+1-507-701-5835',
      value: 17017.00,
      closeDate: '--',
      nextFollowUp: '--',
      agentName: 'Prof. Theresia Bechteler',
      agentRole: 'Junior',
      agentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      watcher: '--',
      stage: 'Schedule Appointment',
      category: 'Closed',
      product: 'Smart Smoke Detector'
    },
    {
      id: '4',
      name: 'Delphia Cormier-4',
      leadName: 'Delphia Cormier',
      company: 'Hyatt Inc',
      email: 'fake@example.com',
      phone: '+19804255669',
      value: 26045.00,
      closeDate: '--',
      nextFollowUp: '--',
      agentName: 'Gia Lind',
      agentRole: 'Senior',
      agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      watcher: '--',
      stage: 'Schedule Appointment',
      category: 'Commit',
      product: 'Power Bank'
    },
    {
      id: '3',
      name: 'Elias Hauck-3',
      leadName: 'Elias Hauck',
      company: 'Witting Group',
      email: 'fake@example.com',
      phone: '+15012148979',
      value: 93763.00,
      closeDate: '--',
      nextFollowUp: '--',
      agentName: 'Candido Wolff',
      agentRole: 'Junior',
      agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      watcher: '--',
      stage: 'Lost',
      category: 'All',
      product: 'Bluetooth Headphones'
    }
  ]);

  // --- NEW DEAL FORM FIELDS ---
  const [newDName, setNewDName] = useState('');
  const [newDLead, setNewDLead] = useState('');
  const [newDCompany, setNewDCompany] = useState('');
  const [newDEmail, setNewDEmail] = useState('');
  const [newDPhone, setNewDPhone] = useState('');
  const [newDValue, setNewDValue] = useState(50000);
  const [newDStage, setNewDStage] = useState<'Generated' | 'Qualified' | 'Initial Contact' | 'Schedule Appointment'>('Generated');
  const [newDProduct, setNewDProduct] = useState('Smart Watch');
  const [newDCategory, setNewDCategory] = useState('Best Case');

  // --- STATIC MOCK DATA FOR THE GENERAL VIEW ---
  // Sample Contracts
  const contracts = [
    { id: 'CON-001', clientName: 'Bruce Wayne', title: 'SaaS Platform Master Services', amount: 45000, startDate: '2026-05-01', endDate: '2026-08-30', status: 'Active' },
    { id: 'CON-002', clientName: 'Sarah Connor', title: 'Cyberdyne V2 NDA & SOW', amount: 25000, startDate: '2026-06-01', endDate: '2026-09-15', status: 'Active' },
    { id: 'CON-003', clientName: 'John Miller', title: 'Miller E-commerce Support SLA', amount: 12000, startDate: '2026-04-10', endDate: '2027-04-10', status: 'Expiring Soon' },
  ];

  // Sample Proposals
  const proposals: Proposal[] = [
    { id: 'PRP-201', proposalNumber: 'PRP-2026-091', leadName: 'Alex Johnson', amount: 12500, date: '2026-06-25', status: 'Accepted' },
    { id: 'PRP-202', proposalNumber: 'PRP-2026-092', leadName: 'Samantha Smith', amount: 8200, date: '2026-07-01', status: 'Waiting' },
    { id: 'PRP-203', proposalNumber: 'PRP-2026-093', leadName: 'David Lee', amount: 15000, date: '2026-06-28', status: 'Waiting' },
  ];

  // Sample Estimates
  const estimates: Estimate[] = [
    { id: 'EST-101', estimateNumber: 'EST-2026-44', clientName: 'John Miller', amount: 18000, validTill: '2026-08-10', status: 'Accepted' },
    { id: 'EST-102', estimateNumber: 'EST-2026-45', clientName: 'Diana Prince', amount: 9500, validTill: '2026-07-25', status: 'Pending' },
  ];

  // --- FORM SUBMISSIONS ---
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadCompany || !newLeadEmail) return;
    onAddLead({
      name: newLeadName,
      company: newLeadCompany,
      email: newLeadEmail,
      phone: newLeadPhone || '+1 555-0100',
      status: newLeadStatus,
      value: Number(newLeadValue) || 5000,
    });
    setNewLeadName('');
    setNewLeadCompany('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadValue(10000);
    setShowLeadModal(false);
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientCompany || !newClientEmail) return;
    onAddClient({
      name: newClientName,
      company: newClientCompany,
      email: newClientEmail,
      status: newClientStatus,
      mobile: newClientMobile || '--',
      category: newClientCategory || '--',
      subCategory: newClientSubCategory || '--',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'), // e.g. "04-07-2026"
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    });
    setNewClientName('');
    setNewClientCompany('');
    setNewClientEmail('');
    setNewClientMobile('');
    setNewClientCategory('--');
    setNewClientSubCategory('--');
    setNewClientStatus('Active');
    setShowClientModal(false);
  };

  const handleDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDName || !newDLead || !newDEmail) return;
    const freshDeal: EnhancedDeal = {
      id: `${dealsList.length + 10}`,
      name: newDName,
      leadName: newDLead,
      company: newDCompany || 'N/A',
      email: newDEmail,
      phone: newDPhone || '+1 555-0100',
      value: Number(newDValue) || 25000,
      closeDate: '--',
      nextFollowUp: '--',
      agentName: 'Gia Lind',
      agentRole: 'Senior',
      agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      watcher: '--',
      stage: newDStage as any,
      category: newDCategory,
      product: newDProduct
    };
    setDealsList([freshDeal, ...dealsList]);
    setNewDName('');
    setNewDLead('');
    setNewDCompany('');
    setNewDEmail('');
    setNewDPhone('');
    setNewDValue(50000);
    setNewDStage('Generated');
    setShowDealModal(false);
  };

  const handleLeadFormBuilderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewName || !previewEmail) return;
    onAddLead({
      name: previewName,
      company: previewCompany || 'Web Lead',
      email: previewEmail,
      phone: previewPhone || '+1 555-0100',
      status: 'New',
      value: 10000
    });
    setPreviewSubmitted(true);
    setTimeout(() => {
      setPreviewSubmitted(false);
      setPreviewName('');
      setPreviewEmail('');
      setPreviewPhone('');
      setPreviewCompany('');
      setPreviewMessage('');
    }, 3000);
  };

  // --- DELETES ---
  const handleLocalDeleteDeal = (id: string) => {
    setDealsList(dealsList.filter(d => d.id !== id));
  };

  // --- SELECTION HELPERS ---
  const handleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(item => item !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const handleSelectAllLeads = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const handleSelectDeal = (id: string) => {
    if (selectedDeals.includes(id)) {
      setSelectedDeals(selectedDeals.filter(item => item !== id));
    } else {
      setSelectedDeals([...selectedDeals, id]);
    }
  };

  const handleSelectAllDeals = () => {
    if (selectedDeals.length === filteredDeals.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(filteredDeals.map(d => d.id));
    }
  };

  // --- IMPORT & EXPORT EXECUTIVES ---
  const triggerExport = (type: 'leads' | 'deals') => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify(type === 'leads' ? leads : dealsList, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${type}_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importRawJson);
      if (Array.isArray(parsed)) {
        if (importTarget === 'leads') {
          parsed.forEach(item => {
            if (item.name && item.company && item.email) {
              onAddLead({
                name: item.name,
                company: item.company,
                email: item.email,
                phone: item.phone || '+1 555-0100',
                status: item.status || 'New',
                value: Number(item.value) || 12000
              });
            }
          });
        } else {
          const formatted: EnhancedDeal[] = parsed.map((item, idx) => ({
            id: `${dealsList.length + idx + 100}`,
            name: item.name || `${item.leadName || 'Deal'}-Lead`,
            leadName: item.leadName || item.name || 'Anonymous',
            company: item.company || 'N/A',
            email: item.email || 'fake@example.com',
            phone: item.phone || '--',
            value: Number(item.value) || 25000,
            closeDate: item.closeDate || '--',
            nextFollowUp: item.nextFollowUp || '--',
            agentName: item.agentName || 'Gia Lind',
            agentRole: item.agentRole || 'Senior',
            agentAvatar: item.agentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
            watcher: item.watcher || '--',
            stage: item.stage || 'Generated',
            category: item.category || 'Best Case',
            product: item.product || 'Smart Watch'
          }));
          setDealsList([...formatted, ...dealsList]);
        }
        setImportFeedback(`Successfully imported batch of ${parsed.length} entries!`);
        setImportRawJson('');
        setTimeout(() => {
          setShowImportModal(false);
          setImportFeedback(null);
        }, 1500);
      } else {
        setImportFeedback('Error: JSON must be an array of records.');
      }
    } catch (err: any) {
      setImportFeedback(`Failed to parse JSON: ${err.message}`);
    }
  };

  const handleLoadDemoBatch = () => {
    if (importTarget === 'leads') {
      const demoLeads = [
        { name: 'Dr. John Doe Jr.', company: 'Wayne Corp', email: 'john@wayne.com', phone: '+1-555-0120', status: 'New', value: 34000 },
        { name: 'Alice Kingsleigh', company: 'Underland Ltd', email: 'alice@underland.org', phone: '+1-203-485-9922', status: 'Contacted', value: 45000 }
      ];
      setImportRawJson(JSON.stringify(demoLeads, null, 2));
    } else {
      const demoDeals = [
        { name: 'Underland Strategic Redesign', leadName: 'Alice Kingsleigh', company: 'Underland Ltd', value: 45000, stage: 'Generated', category: 'Best Case', product: 'Electric Kettle' },
        { name: 'Wayne Corp Sandbox integration V3', leadName: 'Dr. John Doe Jr.', company: 'Wayne Corp', value: 34000, stage: 'Schedule Appointment', category: 'Commit', product: 'Smart Watch' }
      ];
      setImportRawJson(JSON.stringify(demoDeals, null, 2));
    }
  };

  // --- STAGE QUICK SHIFTER ---
  const handleMoveDealStage = (dealId: string, nextStage: any) => {
    setDealsList(dealsList.map(d => d.id === dealId ? { ...d, stage: nextStage } : d));
  };

  // --- FILTERS & SORTINGS ENGINE ---
  // A. Leads filter
  const filteredLeads = leads.filter(l => {
    const term = leadSearch.toLowerCase();
    const matchesSearch = l.name.toLowerCase().includes(term) || 
                          l.company.toLowerCase().includes(term) ||
                          l.email.toLowerCase().includes(term);
    const matchesType = leadTypeFilter === 'All' || l.status === leadTypeFilter;
    return matchesSearch && matchesType;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const valA = a[leadSortField];
    const valB = b[leadSortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return leadSortAsc ? valA - valB : valB - valA;
    }
    return leadSortAsc 
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // B. Deals filter
  const filteredDeals = dealsList.filter(d => {
    const term = dealSearch.toLowerCase();
    const matchesSearch = d.name.toLowerCase().includes(term) || 
                          d.leadName.toLowerCase().includes(term) ||
                          d.company.toLowerCase().includes(term) ||
                          d.email.toLowerCase().includes(term);
    
    const matchesCategory = dealCategory === 'All' || d.category === dealCategory;
    const matchesProduct = dealProduct === 'All' || d.product === dealProduct;
    return matchesSearch && matchesCategory && matchesProduct;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    const valA = a[dealSortField];
    const valB = b[dealSortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return dealSortAsc ? valA - valB : valB - valA;
    }
    return dealSortAsc 
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // C. Clients filter & state
  const [clientSearch, setClientSearch] = useState('');
  const [clientAddedOnFilter, setClientAddedOnFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('All');
  const [clientCategoryFilter, setClientCategoryFilter] = useState('All');
  const [clientSubCategoryFilter, setClientSubCategoryFilter] = useState('All');
  
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [clientSortField, setClientSortField] = useState<keyof Client>('id');
  const [clientSortAsc, setClientSortAsc] = useState(false); // Default false so newest (or highest ID) is first
  const [clientViewMode, setClientViewMode] = useState<'list' | 'grid'>('list');
  const [showClientExtraFilters, setShowClientExtraFilters] = useState(false);
  const [activeClientRowMenu, setActiveClientRowMenu] = useState<string | null>(null);

  // States for new client form
  const [newClientMobile, setNewClientMobile] = useState('');
  const [newClientCategory, setNewClientCategory] = useState('--');
  const [newClientSubCategory, setNewClientSubCategory] = useState('--');
  const [newClientStatus, setNewClientStatus] = useState<'Active' | 'Inactive'>('Active');

  // Filter logic
  const filteredClients = clients.filter(c => {
    const term = clientSearch.toLowerCase();
    const matchesSearch = 
      c.name.toLowerCase().includes(term) || 
      c.company.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.mobile && c.mobile.toLowerCase().includes(term));

    const matchesClient = clientFilter === 'All' || c.name === clientFilter;
    const matchesCategory = clientCategoryFilter === 'All' || c.category === clientCategoryFilter;
    const matchesSubCategory = clientSubCategoryFilter === 'All' || c.subCategory === clientSubCategoryFilter;
    const matchesDate = !clientAddedOnFilter || (c.createdDate && c.createdDate.includes(clientAddedOnFilter));

    return matchesSearch && matchesClient && matchesCategory && matchesSubCategory && matchesDate;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (clientSortField === 'id') {
      const numA = Number(a.id);
      const numB = Number(b.id);
      if (!isNaN(numA) && !isNaN(numB)) {
        return clientSortAsc ? numA - numB : numB - numA;
      }
    }

    const valA = a[clientSortField] ?? '';
    const valB = b[clientSortField] ?? '';
    
    if (typeof valA === 'number' && typeof valB === 'number') {
      return clientSortAsc ? valA - valB : valB - valA;
    }
    return clientSortAsc 
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const requestClientSort = (field: keyof Client) => {
    if (clientSortField === field) {
      setClientSortAsc(!clientSortAsc);
    } else {
      setClientSortField(field);
      setClientSortAsc(true);
    }
  };

  const handleSelectClient = (id: string) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter(item => item !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  const handleSelectAllClients = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  // Sorting toggler helper
  const requestLeadSort = (field: keyof Lead) => {
    if (leadSortField === field) {
      setLeadSortAsc(!leadSortAsc);
    } else {
      setLeadSortField(field);
      setLeadSortAsc(true);
    }
  };

  const requestDealSort = (field: keyof EnhancedDeal) => {
    if (dealSortField === field) {
      setDealSortAsc(!dealSortAsc);
    } else {
      setDealSortField(field);
      setDealSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* ----------------- SUB-TAB HEADER: LEADS ----------------- */}
      {subTab === 'leads' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Lead Contacts</h1>
                <span className="text-slate-400 font-mono text-xs">/</span>
                <span className="text-slate-500 font-medium text-[11px] bg-slate-100 px-2 py-0.5 rounded">Home • Lead Contacts</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Configure and manage target leads, export logs, and deploy live capture web forms.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowLeadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Lead Contact</span>
              </button>
              <button
                onClick={() => setShowLeadFormSlider(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Code className="h-3.5 w-3.5 text-indigo-500" />
                <span>Lead Form</span>
              </button>
              <button
                onClick={() => { setImportTarget('leads'); setShowImportModal(true); }}
                className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Import</span>
              </button>
              <button
                onClick={() => triggerExport('leads')}
                className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Screenshot 1 Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 items-end">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Duration</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Start Date To End Date"
                  className="w-full bg-slate-50 text-slate-800 text-[11px] pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Type</label>
              <select
                className="w-full bg-slate-50 text-slate-800 text-[11px] px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={leadTypeFilter}
                onChange={(e) => setLeadTypeFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Start typing to search"
                  className="w-full bg-slate-50 text-slate-800 text-[11px] pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowLeadExtraFilters(!showLeadExtraFilters)}
                className={`px-3 py-1.5 rounded border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showLeadExtraFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Expanded extra filters pane */}
          {showLeadExtraFilters && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Lead Potential Value</span>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full bg-white border border-slate-200 rounded p-1" />
                  <span>to</span>
                  <input type="number" placeholder="Max" className="w-full bg-white border border-slate-200 rounded p-1" />
                </div>
              </div>
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Owner Assignment</span>
                <select className="w-full bg-white border border-slate-200 rounded p-1">
                  <option value="">All Owners</option>
                  <option value="gia">Gia Lind</option>
                  <option value="elena">Prof. Theresia Bechteler</option>
                </select>
              </div>
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Quick Actions</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setLeadSearch(''); setLeadTypeFilter('All'); }}
                    className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-50 text-[10px]"
                  >
                    Reset Filters
                  </button>
                  {selectedLeads.length > 0 && (
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${selectedLeads.length} selected leads?`)) {
                          selectedLeads.forEach(id => onDeleteLead(id));
                          setSelectedLeads([]);
                        }
                      }}
                      className="bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1 rounded hover:bg-rose-100 text-[10px]"
                    >
                      Bulk Delete ({selectedLeads.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ----------------- SUB-TAB HEADER: DEALS ----------------- */}
      {subTab === 'deals' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Deal</h1>
                <span className="text-slate-400 font-mono text-xs">/</span>
                <span className="text-slate-500 font-medium text-[11px] bg-slate-100 px-2 py-0.5 rounded">Home • Deal</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Assess active sales pipelines, category probabilities, and product configurations.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowDealModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Deal</span>
              </button>
              <button
                onClick={() => { setImportTarget('deals'); setShowImportModal(true); }}
                className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Import</span>
              </button>
              <button
                onClick={() => triggerExport('deals')}
                className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </button>

              <div className="bg-slate-100 p-0.5 rounded flex items-center border border-slate-200 ml-2">
                <button
                  onClick={() => setDealViewMode('list')}
                  className={`p-1.5 rounded transition-all cursor-pointer ${dealViewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  title="List View"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDealViewMode('kanban')}
                  className={`p-1.5 rounded transition-all cursor-pointer ${dealViewMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Kanban Board"
                >
                  <Kanban className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Screenshot 2 Filters Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100 items-end">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Duration</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2 h-3 w-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Start Date To End Date"
                  className="w-full bg-slate-50 text-slate-800 text-[10px] pl-7 pr-2 py-1.5 rounded border border-slate-200 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Pipeline</label>
              <select
                className="w-full bg-slate-50 text-slate-800 text-[10px] px-2 py-1.5 rounded border border-slate-200 focus:outline-none"
                value={dealPipeline}
                onChange={(e) => setDealPipeline(e.target.value)}
              >
                <option value="Sales Pipeline">Sales Pipeline</option>
                <option value="Marketing Pipeline">Marketing Pipeline</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Category</label>
              <select
                className="w-full bg-slate-50 text-slate-800 text-[10px] px-2 py-1.5 rounded border border-slate-200 focus:outline-none"
                value={dealCategory}
                onChange={(e) => setDealCategory(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Best Case">Best Case</option>
                <option value="Closed">Closed</option>
                <option value="Commit">Commit</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Product</label>
              <select
                className="w-full bg-slate-50 text-slate-800 text-[10px] px-2 py-1.5 rounded border border-slate-200 focus:outline-none"
                value={dealProduct}
                onChange={(e) => setDealProduct(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Electric Kettle">Electric Kettle</option>
                <option value="Smart Sprinkler">Smart Sprinkler</option>
                <option value="Men's Leather Wallet">Men's Leather Wallet</option>
                <option value="Smart Watch">Smart Watch</option>
                <option value="Hair Straightener">Hair Straightener</option>
                <option value="Power Bank">Power Bank</option>
                <option value="Smart Smoke Detector">Smart Smoke Detector</option>
                <option value="Bluetooth Headphones">Bluetooth Headphones</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Start typing to search"
                  className="w-full bg-slate-50 text-slate-800 text-[10px] pl-7 pr-2 py-1.5 rounded border border-slate-200 focus:outline-none"
                  value={dealSearch}
                  onChange={(e) => setDealSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowDealExtraFilters(!showDealExtraFilters)}
                className={`px-2 py-1 rounded border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  showDealExtraFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Deal Extra Filters block */}
          {showDealExtraFilters && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="block font-bold text-slate-700 mb-1">Deal Agent assignment</span>
                <select className="w-full bg-white border border-slate-200 rounded p-1 text-[10px]">
                  <option value="all">All Agents</option>
                  <option value="gia">Gia Lind (Senior)</option>
                  <option value="theresia">Prof. Theresia Bechteler (Junior)</option>
                  <option value="candido">Candido Wolff (Junior)</option>
                </select>
              </div>
              <div>
                <span className="block font-bold text-slate-700 mb-1">Value Bounds</span>
                <div className="flex items-center gap-1.5">
                  <input type="number" placeholder="Min" className="w-full bg-white border border-slate-200 rounded p-1" />
                  <span>to</span>
                  <input type="number" placeholder="Max" className="w-full bg-white border border-slate-200 rounded p-1" />
                </div>
              </div>
              <div>
                <span className="block font-bold text-slate-700 mb-1">Batch Operations</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setDealSearch(''); setDealCategory('All'); setDealProduct('All'); }}
                    className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-50 text-[10px]"
                  >
                    Reset
                  </button>
                  {selectedDeals.length > 0 && (
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${selectedDeals.length} selected deals?`)) {
                          setDealsList(dealsList.filter(d => !selectedDeals.includes(d.id)));
                          setSelectedDeals([]);
                        }
                      }}
                      className="bg-rose-50 border border-rose-200 text-rose-600 px-2 py-1 rounded hover:bg-rose-100 text-[10px]"
                    >
                      Bulk Delete ({selectedDeals.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ----------------- SUB-TAB HEADER: CLIENTS ----------------- */}
      {subTab === 'clients' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Clients</h1>
                <span className="text-slate-400 font-mono text-xs">/</span>
                <span className="text-slate-500 font-medium text-[11px] bg-slate-100 px-2 py-0.5 rounded">Home • Clients</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Manage corporate client profiles, categories, billing stats, and communications.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="crm-add-client-btn"
                onClick={() => setShowClientModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Client</span>
              </button>
              <button
                onClick={() => { setImportTarget('clients' as any); setShowImportModal(true); }}
                className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Import</span>
              </button>
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clients, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `clients_export_${new Date().toISOString().split('T')[0]}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-3 py-2 rounded border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export</span>
              </button>

              <div className="bg-slate-100 p-0.5 rounded flex items-center border border-slate-200 ml-2">
                <button
                  onClick={() => setClientViewMode('list')}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    clientViewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="List View"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setClientViewMode('grid')}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    clientViewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <Kanban className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Screenshot 1 Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100 items-end">
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Added On</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Start Date To End Date"
                  className="w-full bg-slate-50 text-slate-800 text-[11px] pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={clientAddedOnFilter}
                  onChange={(e) => setClientAddedOnFilter(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Client</label>
              <select
                className="w-full bg-slate-50 text-slate-800 text-[11px] px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
              >
                <option value="All">All</option>
                {Array.from(new Set(clients.map(c => c.name))).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Category</label>
              <select
                className="w-full bg-slate-50 text-slate-800 text-[11px] px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                value={clientCategoryFilter}
                onChange={(e) => setClientCategoryFilter(e.target.value)}
              >
                <option value="All">All</option>
                {Array.from(new Set(clients.map(c => c.category).filter(Boolean))).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Sub Category</label>
              <select
                className="w-full bg-slate-50 text-slate-800 text-[11px] px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                value={clientSubCategoryFilter}
                onChange={(e) => setClientSubCategoryFilter(e.target.value)}
              >
                <option value="All">All</option>
                {Array.from(new Set(clients.map(c => c.subCategory).filter(Boolean))).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Start typing to search"
                  className="w-full bg-slate-50 text-slate-800 text-[11px] pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowClientExtraFilters(!showClientExtraFilters)}
                className={`px-3 py-1.5 rounded border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showClientExtraFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
              </button>
              {(clientSearch || clientAddedOnFilter || clientFilter !== 'All' || clientCategoryFilter !== 'All' || clientSubCategoryFilter !== 'All') && (
                <button
                  onClick={() => {
                    setClientSearch('');
                    setClientAddedOnFilter('');
                    setClientFilter('All');
                    setClientCategoryFilter('All');
                    setClientSubCategoryFilter('All');
                  }}
                  className="px-3 py-1.5 rounded border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1"
                  title="Clear Filters"
                >
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Expanded extra filters pane */}
          {showClientExtraFilters && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Status Filter</span>
                <div className="flex gap-2">
                  {['All', 'Active', 'Inactive'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        if (st === 'All') {
                          setClientFilter('All');
                        } else {
                          // Filter client list state locally
                          alert(`Status filtering is fully integrated via main search & dropdowns.`);
                        }
                      }}
                      className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-50 text-[10px]"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Quick Actions</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setClientSearch('');
                      setClientAddedOnFilter('');
                      setClientFilter('All');
                      setClientCategoryFilter('All');
                      setClientSubCategoryFilter('All');
                    }}
                    className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded hover:bg-slate-50 text-[10px]"
                  >
                    Reset Filters
                  </button>
                  {selectedClients.length > 0 && (
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${selectedClients.length} selected clients?`)) {
                          selectedClients.forEach(id => onDeleteClient(id));
                          setSelectedClients([]);
                        }
                      }}
                      className="bg-rose-50 border border-rose-200 text-rose-600 px-3 py-1 rounded hover:bg-rose-100 text-[10px] font-semibold"
                    >
                      Bulk Delete ({selectedClients.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- SUB-TAB HEADER: GENERAL (CONTRACTS, ETC) ----------------- */}
      {!['leads', 'deals', 'clients'].includes(subTab) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight capitalize">
              CRM: {subTab === 'contracts' ? 'Contracts Registry' : 
                     subTab === 'proposals' ? 'Client Proposals' : 'Estimates'}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Manage corporate engagements, communications, and value funnels.</p>
          </div>
        </div>
      )}


      {/* -------------------------------------------------------- */}
      {/* ----------------- VIEW RENDERING LOGIC ----------------- */}
      {/* -------------------------------------------------------- */}

      {/* 1. LEADS VIEW */}
      {subTab === 'leads' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-4 py-3 text-center w-12">
                    <button 
                      onClick={handleSelectAllLeads}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-all inline-block"
                    >
                      {selectedLeads.length === filteredLeads.length && filteredLeads.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => requestLeadSort('id')}>
                    <div className="flex items-center">
                      <span>Id</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => requestLeadSort('name')}>
                    <div className="flex items-center">
                      <span>Contact Name</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => requestLeadSort('email')}>
                    <div className="flex items-center">
                      <span>Email</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => requestLeadSort('status')}>
                    <div className="flex items-center">
                      <span>Lead Owner</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => requestLeadSort('company')}>
                    <div className="flex items-center">
                      <span>Added By</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => requestLeadSort('createdDate')}>
                    <div className="flex items-center">
                      <span>Created</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                {sortedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400 bg-slate-50/20 font-medium">
                      No matching lead contacts found. Try adjusting filters or create a new contact.
                    </td>
                  </tr>
                ) : (
                  sortedLeads.map(lead => {
                    const isSelected = selectedLeads.includes(lead.id);
                    return (
                      <tr key={lead.id} className={`hover:bg-slate-50/60 transition-all ${isSelected ? 'bg-blue-50/20' : ''}`}>
                        <td className="px-4 py-2.5 text-center">
                          <button 
                            onClick={() => handleSelectLead(lead.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 transition-all inline-block"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-400 text-[10px]">
                          {lead.id}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="font-bold text-slate-900">{lead.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{lead.company}</div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="text-slate-600 font-medium">{lead.email}</div>
                          {lead.phone && <div className="text-[9px] text-slate-400 font-mono mt-0.5">{lead.phone}</div>}
                        </td>
                        <td className="px-4 py-2.5 text-slate-400 italic">
                          --
                        </td>
                        <td className="px-4 py-2.5 text-slate-400 italic">
                          --
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-500 font-medium">
                          {lead.createdDate}
                        </td>
                        <td className="px-4 py-2.5 text-right relative">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`delete-lead-${lead.id}`}
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-all"
                              title="Delete record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setActiveLeadRowMenu(activeLeadRowMenu === lead.id ? null : lead.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-all"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Row menu dropdown */}
                          {activeLeadRowMenu === lead.id && (
                            <div className="absolute right-4 top-10 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30 w-36 text-left">
                              <button 
                                onClick={() => {
                                  alert(`Detail View: Lead ${lead.name} is in status [${lead.status}] with deal value of $${lead.value.toLocaleString()}`);
                                  setActiveLeadRowMenu(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 text-[10px] text-slate-700 font-semibold flex items-center gap-1.5"
                              >
                                <Eye className="h-3 w-3 text-slate-400" />
                                <span>View Profile</span>
                              </button>
                              <button 
                                onClick={() => {
                                  alert("Owner assignments can be processed once cloud auth is fully configured.");
                                  setActiveLeadRowMenu(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 text-[10px] text-slate-700 font-semibold flex items-center gap-1.5"
                              >
                                <User className="h-3 w-3 text-slate-400" />
                                <span>Assign Owner</span>
                              </button>
                              <div className="border-t border-slate-100 my-1"></div>
                              <button 
                                onClick={() => {
                                  onDeleteLead(lead.id);
                                  setActiveLeadRowMenu(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-rose-50 text-[10px] text-rose-600 font-semibold flex items-center gap-1.5"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* 2. DEALS VIEW */}
      {subTab === 'deals' && (
        <>
          {/* A. KANBAN VIEW */}
          {dealViewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['Generated', 'Qualified', 'Initial Contact', 'Schedule Appointment'] as const).map(stage => {
                const stageDeals = sortedDeals.filter(d => d.stage === stage);
                const totalStageVal = stageDeals.reduce((s, d) => s + d.value, 0);
                
                // Color configuration according to screenshots
                const headerColorClass = 
                  stage === 'Generated' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                  stage === 'Qualified' ? 'text-orange-600 bg-orange-50 border-orange-200' :
                  stage === 'Initial Contact' ? 'text-teal-600 bg-teal-50 border-teal-200' :
                  'text-emerald-600 bg-emerald-50 border-emerald-200';

                const dotColorClass = 
                  stage === 'Generated' ? 'bg-amber-500' :
                  stage === 'Qualified' ? 'bg-orange-500' :
                  stage === 'Initial Contact' ? 'bg-teal-500' :
                  'bg-emerald-500';

                return (
                  <div key={stage} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-col gap-3 min-h-[480px]">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${dotColorClass}`}></span>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{stage}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-extrabold bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                        {stageDeals.length}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold font-mono bg-white p-1.5 rounded border border-slate-200/50 text-center">
                      Stage Sum: <span className="text-slate-900 font-extrabold">${totalStageVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="flex-1 space-y-3 overflow-y-auto">
                      {stageDeals.length === 0 ? (
                        <div className="h-32 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-[10px] text-slate-400 font-bold">No deals in stage</p>
                          <button
                            onClick={() => { setNewDStage(stage as any); setShowDealModal(true); }}
                            className="mt-2 text-[9px] bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-100 text-slate-600 font-bold"
                          >
                            + Add Deal
                          </button>
                        </div>
                      ) : (
                        stageDeals.map(deal => (
                          <div 
                            key={deal.id} 
                            className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2.5 hover:border-blue-500 hover:shadow-md transition-all group relative"
                          >
                            {/* Card Header */}
                            <div className="flex items-start justify-between">
                              <h5 className="text-xs font-bold text-slate-900 leading-snug pr-4">{deal.name}</h5>
                              <button
                                onClick={() => handleLocalDeleteDeal(deal.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition-all absolute right-2 top-2"
                                title="Delete deal"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Client & Company */}
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                              <Building className="h-3 w-3 text-slate-400" />
                              <span>{deal.leadName} ({deal.company})</span>
                            </div>

                            {/* Contact email */}
                            <div className="text-[10px] text-slate-400 font-mono overflow-ellipsis overflow-hidden">
                              {deal.email}
                            </div>

                            {/* Value display */}
                            <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded border border-slate-100">
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Deal Value</span>
                              <span className="text-xs font-extrabold text-slate-900">${deal.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>

                            {/* Agent Avatar */}
                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={deal.agentAvatar}
                                  alt={deal.agentName}
                                  className="w-5 h-5 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <div className="text-[9px] font-bold text-slate-800 leading-none">{deal.agentName}</div>
                                  <div className="text-[8px] text-slate-400 font-medium mt-0.5">{deal.agentRole} Agent</div>
                                </div>
                              </div>
                              
                              {/* Quick stage controls */}
                              <div className="flex items-center gap-0.5">
                                {stage !== 'Generated' && (
                                  <button
                                    onClick={() => {
                                      const stages: any[] = ['Generated', 'Qualified', 'Initial Contact', 'Schedule Appointment'];
                                      const idx = stages.indexOf(stage);
                                      handleMoveDealStage(deal.id, stages[idx - 1]);
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 text-[9px]"
                                    title="Move back"
                                  >
                                    ◀
                                  </button>
                                )}
                                {stage !== 'Schedule Appointment' && (
                                  <button
                                    onClick={() => {
                                      const stages: any[] = ['Generated', 'Qualified', 'Initial Contact', 'Schedule Appointment'];
                                      const idx = stages.indexOf(stage);
                                      handleMoveDealStage(deal.id, stages[idx + 1]);
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 text-[9px]"
                                    title="Move forward"
                                  >
                                    ▶
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* B. LIST VIEW */}
          {dealViewMode === 'list' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="px-4 py-3 text-center w-12">
                        <button 
                          onClick={handleSelectAllDeals}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-all inline-block"
                        >
                          {selectedDeals.length === filteredDeals.length && filteredDeals.length > 0 ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 cursor-pointer" onClick={() => requestDealSort('id')}>
                        <div className="flex items-center">
                          <span>Id</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer" onClick={() => requestDealSort('name')}>
                        <div className="flex items-center">
                          <span>Deal Name</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer" onClick={() => requestDealSort('leadName')}>
                        <div className="flex items-center">
                          <span>Lead Name</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3">Contact Details</th>
                      <th className="px-4 py-3 cursor-pointer" onClick={() => requestDealSort('value')}>
                        <div className="flex items-center">
                          <span>Value</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3">Close Date</th>
                      <th className="px-4 py-3">Next Follow Up</th>
                      <th className="px-4 py-3 cursor-pointer" onClick={() => requestDealSort('agentName')}>
                        <div className="flex items-center">
                          <span>Deal Agent</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3">Deal Watcher</th>
                      <th className="px-4 py-3">Stage</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                    {sortedDeals.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="px-4 py-12 text-center text-slate-400 bg-slate-50/20 font-medium">
                          No matching deal rows found. Customize filtering bounds.
                        </td>
                      </tr>
                    ) : (
                      sortedDeals.map(deal => {
                        const isSelected = selectedDeals.includes(deal.id);
                        
                        // Stage badges matching Screenshot 2 dots
                        const dotColor = 
                          deal.stage === 'Generated' ? 'bg-amber-500' :
                          deal.stage === 'Qualified' ? 'bg-orange-500' :
                          deal.stage === 'Initial Contact' ? 'bg-teal-500' :
                          deal.stage === 'Schedule Appointment' ? 'bg-emerald-500' :
                          deal.stage === 'Lost' ? 'bg-rose-500' : 'bg-blue-500';

                        return (
                          <tr key={deal.id} className={`hover:bg-slate-50/60 transition-all ${isSelected ? 'bg-blue-50/20' : ''}`}>
                            <td className="px-4 py-3.5 text-center">
                              <button 
                                onClick={() => handleSelectDeal(deal.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 transition-all inline-block"
                              >
                                {isSelected ? (
                                  <CheckSquare className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Square className="h-4 w-4" />
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-slate-400 text-[10px]">
                              {deal.id}
                            </td>
                            <td className="px-4 py-3.5 font-extrabold text-slate-900">
                              {deal.name}
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-700">
                              <div>{deal.leadName}</div>
                              <div className="text-[9px] text-slate-400 font-medium">{deal.company}</div>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="text-slate-600 font-medium">{deal.email}</div>
                              <div className="text-[9px] text-slate-400 font-mono mt-0.5">{deal.phone}</div>
                            </td>
                            <td className="px-4 py-3.5 font-extrabold text-slate-950">
                              ${deal.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3.5 text-slate-400 font-medium">
                              {deal.closeDate}
                            </td>
                            <td className="px-4 py-3.5 text-slate-400 font-medium">
                              {deal.nextFollowUp}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={deal.agentAvatar}
                                  alt={deal.agentName}
                                  className="w-5.5 h-5.5 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <div className="font-bold text-slate-800 leading-none text-[10px]">{deal.agentName}</div>
                                  <span className="text-[8px] bg-slate-100 text-slate-500 font-semibold px-1 py-0.2 rounded mt-0.5 inline-block">{deal.agentRole}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-slate-400 font-medium">
                              {deal.watcher}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[10px]">
                                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                                <span>{deal.stage}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                onClick={() => handleLocalDeleteDeal(deal.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-all inline-block"
                                title="Remove deal"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}


      {/* 3. CLIENTS DIRECTORY VIEW */}
      {subTab === 'clients' && (
        <>
          {clientViewMode === 'list' ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider select-none">
                      <th className="px-4 py-3 text-center w-12">
                        <button 
                          onClick={handleSelectAllClients}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-all inline-block"
                        >
                          {selectedClients.length === filteredClients.length && filteredClients.length > 0 ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 cursor-pointer w-16" onClick={() => requestClientSort('id')}>
                        <div className="flex items-center">
                          <span>ID</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer" onClick={() => requestClientSort('name')}>
                        <div className="flex items-center">
                          <span>Name</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer" onClick={() => requestClientSort('company')}>
                        <div className="flex items-center">
                          <span>Company</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer" onClick={() => requestClientSort('email')}>
                        <div className="flex items-center">
                          <span>Email</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Sub Category</th>
                      <th className="px-4 py-3 cursor-pointer" onClick={() => requestClientSort('createdDate')}>
                        <div className="flex items-center">
                          <span>Created Date</span>
                          <ArrowUpDown className="h-3 w-3 text-slate-400 ml-1" />
                        </div>
                      </th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                    {sortedClients.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-4 py-12 text-center text-slate-400 bg-slate-50/20 font-medium">
                          No matching client records found. Adjust filters or search terms.
                        </td>
                      </tr>
                    ) : (
                      sortedClients.map(client => {
                        const isSelected = selectedClients.includes(client.id);
                        return (
                          <tr key={client.id} className={`hover:bg-slate-50/60 transition-all ${isSelected ? 'bg-blue-50/20' : ''}`}>
                            <td className="px-4 py-3.5 text-center">
                              <button 
                                onClick={() => handleSelectClient(client.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 transition-all inline-block"
                              >
                                {isSelected ? (
                                  <CheckSquare className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Square className="h-4 w-4" />
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-slate-400 text-[10px]">
                              {client.id}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <img
                                  src={client.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                                  alt={client.name}
                                  referrerPolicy="no-referrer"
                                  className="w-6 h-6 rounded-full object-cover border border-slate-100"
                                />
                                <span className="font-extrabold text-slate-900">{client.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-700">
                              {client.company}
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="text-slate-600 font-medium">{client.email}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-slate-500">
                              {client.mobile || '--'}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded text-[10px]">
                                {client.category || '--'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                                {client.subCategory || '--'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-medium text-slate-400">
                              {client.createdDate || '--'}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                client.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                <span>{client.status}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right text-slate-500">
                              <div className="relative inline-block text-left">
                                <button
                                  onClick={() => setActiveClientRowMenu(activeClientRowMenu === client.id ? null : client.id)}
                                  className="p-1 hover:bg-slate-100 rounded transition-all inline-block"
                                >
                                  <MoreVertical className="h-3.5 w-3.5 text-slate-500" />
                                </button>
                                {activeClientRowMenu === client.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-10" 
                                      onClick={() => setActiveClientRowMenu(null)}
                                    />
                                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-xl z-20 text-[10px] text-left">
                                      <button
                                        onClick={() => {
                                          setActiveClientRowMenu(null);
                                          // Toggle status dynamically
                                          client.status = client.status === 'Active' ? 'Inactive' : 'Active';
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5"
                                      >
                                        <Sparkles className="h-3 w-3" />
                                        <span>Toggle Status</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete client ${client.name}?`)) {
                                            onDeleteClient(client.id);
                                          }
                                          setActiveClientRowMenu(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5 border-t border-slate-100"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                        <span>Remove Client</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedClients.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 font-medium">
                  No matching client card views found. Adjust filters or search terms.
                </div>
              ) : (
                sortedClients.map(client => {
                  const isSelected = selectedClients.includes(client.id);
                  return (
                    <div 
                      key={client.id} 
                      className={`bg-white rounded-2xl border transition-all p-5 shadow-xs relative flex flex-col justify-between ${
                        isSelected ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button 
                          onClick={() => handleSelectClient(client.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove client ${client.name}?`)) {
                              onDeleteClient(client.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete client"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={client.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                            alt={client.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{client.name}</h4>
                            <p className="text-[11px] text-blue-600 font-bold mt-0.5">{client.company}</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-400 uppercase text-[9px]">ID Code</span>
                            <span className="font-mono font-bold text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded">{client.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-400 uppercase text-[9px]">Email Address</span>
                            <span className="font-medium text-slate-600 truncate max-w-[180px]">{client.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-400 uppercase text-[9px]">Mobile Phone</span>
                            <span className="font-mono text-slate-600">{client.mobile || '--'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-400 uppercase text-[9px]">Established On</span>
                            <span className="font-medium text-slate-500">{client.createdDate || '--'}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {client.category && (
                            <span className="bg-slate-100 text-slate-600 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                              {client.category}
                            </span>
                          )}
                          {client.subCategory && (
                            <span className="bg-blue-50 text-blue-700 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                              {client.subCategory}
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            client.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {client.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-xl text-center border border-slate-100 mt-4">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Active Projects</p>
                          <p className="text-xs font-extrabold text-slate-900 mt-0.5">{client.projectsCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Billed</p>
                          <p className="text-xs font-extrabold text-emerald-600 mt-0.5">${(client.totalBilled || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}


      {/* 4. CONTRACTS VIEW */}
      {subTab === 'contracts' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-3.5">Contract Title</th>
                  <th className="px-6 py-3.5">Client Partner</th>
                  <th className="px-6 py-3.5">Authorized Value</th>
                  <th className="px-6 py-3.5">Start / End Dates</th>
                  <th className="px-6 py-3.5">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {contracts.map(con => (
                  <tr key={con.id} className="hover:bg-slate-50/40">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{con.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{con.id}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{con.clientName}</td>
                    <td className="px-6 py-4 font-bold text-slate-950">${con.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500">{con.startDate} to {con.endDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        con.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {con.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* 5. PROPOSALS VIEW */}
      {subTab === 'proposals' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-3.5">Proposal ID</th>
                  <th className="px-6 py-3.5">Target Lead</th>
                  <th className="px-6 py-3.5">Value Sum</th>
                  <th className="px-6 py-3.5">Date Logged</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {proposals.map(prop => (
                  <tr key={prop.id} className="hover:bg-slate-50/40">
                    <td className="px-6 py-4 font-bold text-slate-900">{prop.proposalNumber}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{prop.leadName}</td>
                    <td className="px-6 py-4 font-bold text-slate-950">${prop.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500">{prop.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        prop.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* 6. ESTIMATES VIEW */}
      {subTab === 'estimates' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-3.5">Estimate ID</th>
                  <th className="px-6 py-3.5">Client Entity</th>
                  <th className="px-6 py-3.5">Estimated Value</th>
                  <th className="px-6 py-3.5">Expiration Limit</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {estimates.map(est => (
                  <tr key={est.id} className="hover:bg-slate-50/40">
                    <td className="px-6 py-4 font-bold text-slate-900">{est.estimateNumber}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{est.clientName}</td>
                    <td className="px-6 py-4 font-bold text-slate-950">${est.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono">{est.validTill}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        est.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {est.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ------------------------------------------------------------- */}
      {/* ----------------- DIALOGS & OVERLAY PANELS ----------------- */}
      {/* ------------------------------------------------------------- */}

      {/* LEAD FORM SLIDER PANEL */}
      {showLeadFormSlider && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setShowLeadFormSlider(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-slate-50 border-l border-slate-200 flex flex-col shadow-2xl overflow-y-auto">
              {/* Slider Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Live Website Lead Capture Form</h3>
                    <p className="text-[10px] text-slate-400">Configure parameters, view real-time styling, and capture live mock submissions.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLeadFormSlider(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Slider content: Split Builder vs Preview */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                
                {/* A. Configuration Panel */}
                <div className="p-4 border-r border-slate-200 space-y-4 bg-white">
                  <h4 className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" />
                    <span>Configuration Builder</span>
                  </h4>
                  
                  <div className="space-y-3 text-[11px]">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Form Heading</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none"
                        value={formConfig.title}
                        onChange={(e) => setFormConfig({ ...formConfig, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Description Paragraph</label>
                      <textarea
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none"
                        value={formConfig.description}
                        onChange={(e) => setFormConfig({ ...formConfig, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Brand Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0"
                          value={formConfig.themeColor}
                          onChange={(e) => setFormConfig({ ...formConfig, themeColor: e.target.value })}
                        />
                        <span className="font-mono text-slate-500 font-bold">{formConfig.themeColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Submit Button Label</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none"
                        value={formConfig.buttonText}
                        onChange={(e) => setFormConfig({ ...formConfig, buttonText: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={formConfig.showCompanyField}
                          onChange={(e) => setFormConfig({ ...formConfig, showCompanyField: e.target.checked })}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        />
                        <span>Require Company Name</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={formConfig.showPhoneField}
                          onChange={(e) => setFormConfig({ ...formConfig, showPhoneField: e.target.checked })}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                        />
                        <span>Require Phone Number</span>
                      </label>
                    </div>
                  </div>

                  {/* HTML Embed Snippet Code box */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-indigo-600 font-bold uppercase flex items-center gap-1">
                        <Code className="h-3.5 w-3.5" />
                        <span>Embed Iframe Code</span>
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`<iframe src="https://worksuite.biz/embed/form/leads" width="100%" height="450" style="border:none;border-radius:12px;"></iframe>`);
                          alert('Copied iframe snippet code to clipboard!');
                        }}
                        className="text-[9px] text-slate-500 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="p-2 bg-slate-900 text-[9px] text-emerald-400 font-mono rounded overflow-x-auto leading-normal">
{`<iframe
  src="https://worksuite.biz/embed/form/leads"
  width="100%"
  height="450"
  style="border:none; border-radius:12px;"
></iframe>`}
                    </pre>
                  </div>
                </div>

                {/* B. Live Interactive Preview */}
                <div className="p-4 flex flex-col justify-center bg-slate-100">
                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3 text-center flex items-center justify-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
                    <span>Live Widget Preview</span>
                  </h4>

                  <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 p-5 space-y-4 max-w-sm mx-auto w-full transition-all">
                    {previewSubmitted ? (
                      <div className="text-center py-8 space-y-3 animate-fade-in">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                        <h5 className="text-xs font-bold text-slate-900">Submission Received!</h5>
                        <p className="text-[10px] text-slate-500 leading-normal px-2">{formConfig.successMsg}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleLeadFormBuilderSubmit} className="space-y-3 text-[11px]">
                        <div className="text-center space-y-1">
                          <h5 className="font-extrabold text-slate-900 text-sm leading-tight" style={{ color: formConfig.themeColor }}>{formConfig.title}</h5>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{formConfig.description}</p>
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold uppercase text-[9px] mb-0.5">Your Name *</label>
                          <input
                            type="text" required
                            placeholder="John Doe"
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={previewName}
                            onChange={(e) => setPreviewName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold uppercase text-[9px] mb-0.5">Email Address *</label>
                          <input
                            type="email" required
                            placeholder="john@example.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                            value={previewEmail}
                            onChange={(e) => setPreviewEmail(e.target.value)}
                          />
                        </div>

                        {formConfig.showCompanyField && (
                          <div>
                            <label className="block text-slate-500 font-bold uppercase text-[9px] mb-0.5">Company Name</label>
                            <input
                              type="text"
                              placeholder="Acme Corporation"
                              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                              value={previewCompany}
                              onChange={(e) => setPreviewCompany(e.target.value)}
                            />
                          </div>
                        )}

                        {formConfig.showPhoneField && (
                          <div>
                            <label className="block text-slate-500 font-bold uppercase text-[9px] mb-0.5">Phone Number</label>
                            <input
                              type="text"
                              placeholder="+1 555-0100"
                              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                              value={previewPhone}
                              onChange={(e) => setPreviewPhone(e.target.value)}
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-slate-500 font-bold uppercase text-[9px] mb-0.5">Brief Message</label>
                          <textarea
                            rows={2}
                            placeholder="Tell us what you are looking to build..."
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 focus:outline-none"
                            value={previewMessage}
                            onChange={(e) => setPreviewMessage(e.target.value)}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full text-white font-extrabold py-2 rounded-lg text-xs tracking-wide shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                          style={{ backgroundColor: formConfig.themeColor }}
                        >
                          {formConfig.buttonText}
                        </button>
                      </form>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase">💡 Submission actualizes real rows in your active table!</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT DIALOG MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-blue-600" />
                <span>Import {importTarget === 'leads' ? 'Lead Contacts' : 'Deals'} Batch</span>
              </h3>
              <button
                onClick={() => { setShowImportModal(false); setImportFeedback(null); }}
                className="p-1 hover:bg-slate-100 rounded-full"
              >
                <XCircle className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-3 text-[11px]">
              <div>
                <span className="block font-bold text-slate-600 mb-1">Paste JSON array</span>
                <p className="text-[10px] text-slate-400 leading-normal mb-2">Ensure the array is formatted as a correct sequence of standard JSON objects.</p>
                <textarea
                  rows={6}
                  required
                  placeholder={importTarget === 'leads' 
                    ? '[\n  {\n    "name": "Ms. Ashly Klocko",\n    "company": "Vandervort Ltd",\n    "email": "fake@example.com"\n  }\n]'
                    : '[\n  {\n    "name": "Delphia Cormier-9",\n    "leadName": "Delphia Cormier",\n    "value": 64890\n  }\n]'
                  }
                  className="w-full bg-slate-50 font-mono text-[10px] p-2.5 rounded border border-slate-200 focus:outline-none focus:border-blue-500"
                  value={importRawJson}
                  onChange={(e) => setImportRawJson(e.target.value)}
                />
              </div>

              {importFeedback && (
                <div className={`p-2 rounded text-[10px] font-semibold ${
                  importFeedback.includes('Error') || importFeedback.includes('Failed') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {importFeedback}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLoadDemoBatch}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded"
                >
                  Load Demo Batch
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowImportModal(false); setImportFeedback(null); }}
                    className="bg-white border border-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded"
                  >
                    Confirm Import
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAD ADD MODAL (POPUP) */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900">Add Lead Record</h3>
              <button onClick={() => setShowLeadModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <XCircle className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleLeadSubmit} className="space-y-3 text-[11px]">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contact Person *</label>
                <input
                  type="text" required
                  placeholder="e.g. Ms. Ashly Klocko"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-blue-500"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Company Name *</label>
                <input
                  type="text" required
                  placeholder="e.g. Vandervort Ltd"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-blue-500"
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Email Address *</label>
                  <input
                    type="email" required
                    placeholder="fake@example.com"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-blue-500"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0100"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-blue-500"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Contract Potential ($)</label>
                  <input
                    type="number" required
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-blue-500"
                    value={newLeadValue}
                    onChange={(e) => setNewLeadValue(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Status</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-blue-500"
                    value={newLeadStatus}
                    onChange={(e) => setNewLeadStatus(e.target.value as Lead['status'])}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEAL ADD MODAL */}
      {showDealModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900">Add Sales Deal</h3>
              <button onClick={() => setShowDealModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <XCircle className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleDealSubmit} className="space-y-3 text-[11px]">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Deal Name *</label>
                <input
                  type="text" required
                  placeholder="e.g. Delphia Cormier-9"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-blue-500"
                  value={newDName}
                  onChange={(e) => setNewDName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Lead Name / Customer *</label>
                <input
                  type="text" required
                  placeholder="e.g. Delphia Cormier"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                  value={newDLead}
                  onChange={(e) => setNewDLead(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyatt Inc"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                    value={newDCompany}
                    onChange={(e) => setNewDCompany(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Email *</label>
                  <input
                    type="email" required
                    placeholder="fake@example.com"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                    value={newDEmail}
                    onChange={(e) => setNewDEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0100"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                    value={newDPhone}
                    onChange={(e) => setNewDPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Deal Value ($) *</label>
                  <input
                    type="number" required
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                    value={newDValue}
                    onChange={(e) => setNewDValue(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Product</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-[10px] p-2 rounded border border-slate-200 focus:outline-none"
                    value={newDProduct}
                    onChange={(e) => setNewDProduct(e.target.value)}
                  >
                    <option value="Smart Watch">Smart Watch</option>
                    <option value="Electric Kettle">Electric Kettle</option>
                    <option value="Smart Sprinkler">Smart Sprinkler</option>
                    <option value="Men's Leather Wallet">Men's Leather Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Category</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-[10px] p-2 rounded border border-slate-200 focus:outline-none"
                    value={newDCategory}
                    onChange={(e) => setNewDCategory(e.target.value)}
                  >
                    <option value="Best Case">Best Case</option>
                    <option value="Commit">Commit</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Stage</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-[10px] p-2 rounded border border-slate-200 focus:outline-none"
                    value={newDStage}
                    onChange={(e) => setNewDStage(e.target.value as any)}
                  >
                    <option value="Generated">Generated</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Initial Contact">Initial Contact</option>
                    <option value="Schedule Appointment">Schedule Appointment</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDealModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT ADD MODAL (POPUP) */}
      {showClientModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Add Client Directory</h3>
              <button onClick={() => setShowClientModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <XCircle className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleClientSubmit} className="space-y-3 text-[11px]">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Client Representative *</label>
                <input
                  type="text" required
                  placeholder="e.g. John Miller"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Organization / Company *</label>
                <input
                  type="text" required
                  placeholder="e.g. Miller Enterprises"
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                  value={newClientCompany}
                  onChange={(e) => setNewClientCompany(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Billing Email *</label>
                  <input
                    type="email" required
                    placeholder="john@miller.com"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Mobile Phone</label>
                  <input
                    type="text"
                    placeholder="+1 555-0150"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                    value={newClientMobile}
                    onChange={(e) => setNewClientMobile(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Category</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                    value={newClientCategory}
                    onChange={(e) => setNewClientCategory(e.target.value)}
                  >
                    <option value="--">--</option>
                    <option value="Software">Software</option>
                    <option value="FMCG">FMCG</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Sub Category</label>
                  <select
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                    value={newClientSubCategory}
                    onChange={(e) => setNewClientSubCategory(e.target.value)}
                  >
                    <option value="--">--</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Mid-Market">Mid-Market</option>
                    <option value="SME">SME</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Status</label>
                <select
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2 rounded border border-slate-200 focus:outline-none"
                  value={newClientStatus}
                  onChange={(e) => setNewClientStatus(e.target.value as 'Active' | 'Inactive')}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                >
                  Register Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
