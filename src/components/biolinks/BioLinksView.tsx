import React, { useState, useRef } from 'react';
import { 
  Link2, Search, Plus, Download, Edit2, Trash2, Eye, Copy, 
  ExternalLink, BarChart3, X, Check, Image, Sparkles, Smartphone, 
  Linkedin, Github, Twitter, Globe, ArrowLeft, PlusCircle, Trash, MoveUp, MoveDown,
  MoreVertical
} from 'lucide-react';

interface CustomLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
}

interface BioLinkProfile {
  id: string; // e.g. 1, 2, 3
  name: string; // sub-URL slug
  displayName: string;
  bioTitle: string;
  bioDesc: string;
  avatarUrl: string;
  theme: 'Cosmic Slate' | 'Minimal Light' | 'Forest Moss' | 'Velvet Neon';
  links: CustomLink[];
  twitterUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  totalViews: number;
  dateCreated: string; // DD-MM-YYYY
}

const INITIAL_BIOLINKS: BioLinkProfile[] = [
  {
    id: '3',
    name: 'voluptatibus-commodi',
    displayName: 'Voluptatibus Commodi',
    bioTitle: 'Enterprise SaaS Operations Hub',
    bioDesc: 'Central registry landing portal for internal and external partner links.',
    avatarUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=100',
    theme: 'Cosmic Slate',
    links: [
      { id: 'lnk-d1', title: 'Wiki Knowledge Base Hub', url: 'https://worksuite.local/kb', clicks: 0 },
      { id: 'lnk-d2', title: 'Submit IT Support Ticket', url: 'https://worksuite.local/tickets', clicks: 0 }
    ],
    totalViews: 0,
    dateCreated: '05-07-2026'
  },
  {
    id: '5',
    name: 'reprehenderit-cum',
    displayName: 'Reprehenderit Cum',
    bioTitle: 'Secure Systems Audit Team',
    bioDesc: 'Hardware credential directories and real-time biometric mapping registries.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    theme: 'Minimal Light',
    links: [],
    totalViews: 0,
    dateCreated: '05-07-2026'
  },
  {
    id: '2',
    name: 'illo-assumenda',
    displayName: 'Illo Assumenda',
    bioTitle: 'Executive Billing Desk',
    bioDesc: 'Stripe checkout proxy parameters and invoice ledger logs.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    theme: 'Forest Moss',
    links: [],
    totalViews: 0,
    dateCreated: '05-07-2026'
  },
  {
    id: '4',
    name: 'expedita-similique-commodi',
    displayName: 'Expedita Similique',
    bioTitle: 'Biometric Devices Console',
    bioDesc: 'Hardware calibrators, clock records, and attendance logs command panel.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    theme: 'Velvet Neon',
    links: [],
    totalViews: 0,
    dateCreated: '05-07-2026'
  },
  {
    id: '1',
    name: 'et-explicabo',
    displayName: 'Et Explicabo',
    bioTitle: 'HR Onboarding Directive',
    bioDesc: 'Letter templates, standard letter generators, and onboarding runbooks.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    theme: 'Cosmic Slate',
    links: [],
    totalViews: 0,
    dateCreated: '05-07-2026'
  }
];

export default function BioLinksView() {
  const [biolinks, setBiolinks] = useState<BioLinkProfile[]>(INITIAL_BIOLINKS);
  
  // Toast state
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  
  // Search state
  const [search, setSearch] = useState('');

  // Table pagination & items selector
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Page views: 'landing' | 'list' | 'editor'
  const [currentView, setCurrentView] = useState<'landing' | 'list' | 'editor'>('landing');
  const [editingBioId, setEditingBioId] = useState<string | null>(null);

  // Modal displays
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState<BioLinkProfile | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // New Biolink form state
  const [newSlug, setNewSlug] = useState('');

  // Editor states (binds to the active form)
  const [formNameSlug, setFormNameSlug] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formBioTitle, setFormBioTitle] = useState('');
  const [formBioDesc, setFormBioDesc] = useState('');
  const [formAvatar, setFormAvatar] = useState('https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=100');
  const [formTheme, setFormTheme] = useState<'Cosmic Slate' | 'Minimal Light' | 'Forest Moss' | 'Velvet Neon'>('Cosmic Slate');
  const [formLinks, setFormLinks] = useState<CustomLink[]>([]);
  
  // Social link inputs
  const [formTwitter, setFormTwitter] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formLinkedin, setFormLinkedin] = useState('');

  // Link form insertion states
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered list
  const filteredBioLinks = biolinks.filter(bio => 
    bio.name.toLowerCase().includes(search.toLowerCase()) ||
    bio.displayName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const totalEntries = filteredBioLinks.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedBiolinks = filteredBioLinks.slice(startIndex, startIndex + entriesPerPage);

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedBiolinks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBiolinks.map(b => b.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Copy URL Clipboard
  const handleCopyLink = (slug: string) => {
    const url = `https://demo.worksuite.biz/bio/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedToast(url);
    setTimeout(() => {
      setCopiedToast(null);
    }, 2500);
  };

  // Add Link inside editor state
  const handleAddLinkToForm = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;

    const newLink: CustomLink = {
      id: `lnk-${Date.now()}`,
      title: newLinkTitle,
      url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`,
      clicks: 0
    };

    setFormLinks([...formLinks, newLink]);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  // Remove Link inside editor state
  const handleRemoveLinkForm = (id: string) => {
    setFormLinks(prev => prev.filter(item => item.id !== id));
  };

  // Move links up/down for priority sorting
  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formLinks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...formLinks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormLinks(updated);
  };

  // Trigger Creator mode
  const triggerCreateBioLink = () => {
    setEditingBioId(null);
    setFormNameSlug('corporate-page');
    setFormDisplayName('Worksuite Labs');
    setFormBioTitle('Enterprise SaaS Operations Hub');
    setFormBioDesc('Central registry landing portal for internal and external partner links.');
    setFormAvatar('https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=100');
    setFormTheme('Cosmic Slate');
    setFormLinks([
      { id: 'lnk-d1', title: 'Wiki Knowledge Base Hub', url: 'https://worksuite.local/kb', clicks: 0 },
      { id: 'lnk-d2', title: 'Submit IT Support Ticket', url: 'https://worksuite.local/tickets', clicks: 0 }
    ]);
    setFormTwitter('');
    setFormGithub('');
    setFormLinkedin('');
    setCurrentView('editor');
  };

  // Trigger Editor mode
  const triggerEditBioLink = (bio: BioLinkProfile) => {
    setEditingBioId(bio.id);
    setFormNameSlug(bio.name);
    setFormDisplayName(bio.displayName);
    setFormBioTitle(bio.bioTitle);
    setFormBioDesc(bio.bioDesc);
    setFormAvatar(bio.avatarUrl);
    setFormTheme(bio.theme);
    setFormLinks(bio.links);
    setFormTwitter(bio.twitterUrl || '');
    setFormGithub(bio.githubUrl || '');
    setFormLinkedin(bio.linkedinUrl || '');
    setCurrentView('editor');
    setActiveMenuId(null);
  };

  // Create Biolink Page from the Modal
  const handleCreateBiolinkSubmit = () => {
    if (!newSlug.trim()) return;

    const nextId = String(Math.max(...biolinks.map(b => parseInt(b.id) || 0)) + 1);
    const slugified = newSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');

    const newBio: BioLinkProfile = {
      id: nextId,
      name: slugified,
      displayName: slugified.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      bioTitle: 'Enterprise SaaS Operations Hub',
      bioDesc: 'Central registry landing portal for internal and external partner links.',
      avatarUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=100',
      theme: 'Cosmic Slate',
      links: [
        { id: 'lnk-d1', title: 'Wiki Knowledge Base Hub', url: 'https://worksuite.local/kb', clicks: 0 },
        { id: 'lnk-d2', title: 'Submit IT Support Ticket', url: 'https://worksuite.local/tickets', clicks: 0 }
      ],
      totalViews: 0,
      dateCreated: new Date().toLocaleDateString('en-GB').replace(/\//g, '-') // DD-MM-YYYY
    };

    setBiolinks([newBio, ...biolinks]);
    setNewSlug('');
    setShowAddModal(false);
  };

  // Save biolink from Customizer Form
  const handleSaveBioProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameSlug.trim() || !formDisplayName.trim()) return;

    if (editingBioId) {
      setBiolinks(prev => prev.map(item => {
        if (item.id === editingBioId) {
          return {
            ...item,
            name: formNameSlug.trim(),
            displayName: formDisplayName.trim(),
            bioTitle: formBioTitle,
            bioDesc: formBioDesc,
            avatarUrl: formAvatar,
            theme: formTheme,
            links: formLinks,
            twitterUrl: formTwitter,
            githubUrl: formGithub,
            linkedinUrl: formLinkedin
          };
        }
        return item;
      }));
    }

    setCurrentView('list');
    setEditingBioId(null);
  };

  // Delete BioLink profile
  const handleDeleteBio = (id: string) => {
    if (confirm(`Are you sure you want to delete BioLink Profile ${id}?`)) {
      setBiolinks(prev => prev.filter(item => item.id !== id));
      setActiveMenuId(null);
    }
  };

  // Upload Custom Avatar Mock
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormAvatar(url);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Id,Biolink page,Total page views,Created on,Status"].join(",") + "\n"
      + biolinks.map(b => `"${b.id}","${b.name}","${b.totalViews}","${b.dateCreated}","Active"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Biolinks_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION WITH BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">Biolinks</h1>
          <span className="text-xs text-slate-400 font-medium select-none">Home • Biolinks</span>
        </div>
      </div>

      {/* 1. TABLE LIST VIEW */}
      {currentView === 'landing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto shadow-sm my-8 space-y-6 animate-fade-in">
          {/* Branded Icon Frame */}
          <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <Link2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Biolink Profiles Builder
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              Configure responsive, fast, and gorgeous directory pages to share your team credentials, portfolio websites, and internal Worksuite documentation catalogs in one single biolink page.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentView('list');
                setShowAddModal(true);
              }}
              className="bg-[#1890ff] hover:bg-[#40a9ff] text-white text-xs font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Biolink Page</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('list');
              }}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold px-6 py-3 rounded-lg border border-slate-200 transition-all cursor-pointer w-full sm:w-auto"
            >
              Go to General Page
            </button>
          </div>
        </div>
      )}

      {/* 1. TABLE LIST VIEW */}
      {currentView === 'list' && (
        <div className="space-y-4">
          
          {/* Top Actions & Search Bar row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                id="btn-add-biolink"
                onClick={() => setShowAddModal(true)}
                className="bg-[#1890ff] hover:bg-[#40a9ff] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Biolink Page</span>
              </button>
              <button
                id="btn-export-biolinks"
                onClick={handleExportCSV}
                className="bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            </div>

            {/* Search Box on right */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Start typing to search"
                className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table Element container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-6 py-4 w-12">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        checked={selectedIds.length === paginatedBiolinks.length && paginatedBiolinks.length > 0}
                        onChange={handleToggleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 w-16">Id</th>
                    <th className="px-6 py-4">Biolink page</th>
                    <th className="px-6 py-4">Total page views</th>
                    <th className="px-6 py-4">Created on</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {paginatedBiolinks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                        <Link2 className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs">No Biolinks Registered</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedBiolinks.map(bio => (
                      <tr key={bio.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            checked={selectedIds.includes(bio.id)}
                            onChange={() => handleToggleSelectRow(bio.id)}
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{bio.id}</td>
                        <td className="px-6 py-4 font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleCopyLink(bio.name)}>
                          {bio.name}
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-slate-500">{bio.totalViews}</td>
                        <td className="px-6 py-4 font-mono font-medium text-slate-500">{bio.dateCreated}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-slate-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span>Active</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-1.5 relative">
                            <button
                              onClick={() => setShowPreviewModal(bio)}
                              className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === bio.id ? null : bio.id)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border border-slate-200"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {/* Dropdown menu */}
                            {activeMenuId === bio.id && (
                              <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 w-40 z-30 animate-fade-in text-left">
                                <button
                                  onClick={() => triggerEditBioLink(bio)}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Customize Page</span>
                                </button>
                                <button
                                  onClick={() => handleCopyLink(bio.name)}
                                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                                >
                                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Copy Link URL</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteBio(bio.id)}
                                  className="w-full px-3.5 py-2 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                  <span>Delete Page</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls at bottom */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-1.5 font-bold focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span>entries</span>
              </div>
              
              <div className="text-xs text-slate-400 font-bold font-mono">
                Showing {totalEntries > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} entries
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200/60"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`text-xs font-black px-3 py-1.5 rounded-lg border ${
                      currentPage === idx + 1
                        ? 'bg-[#1890ff] border-[#1890ff] text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200/60"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL: ADD BIOLINK */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add biolink</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Biolink page url <span className="text-red-500">*</span>
                </label>
                <div className="flex items-stretch rounded-lg border border-slate-300 overflow-hidden text-sm shadow-xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <span className="bg-slate-100 text-slate-500 px-3.5 flex items-center select-none font-medium border-r border-slate-200 text-xs">
                    https://demo.worksuite.biz/bio/
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. potential-client"
                    required
                    className="flex-1 bg-white text-slate-850 px-3 py-2 focus:outline-none text-xs"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-100 font-sans">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCreateBiolinkSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL: LIVE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden p-6 relative">
            <button 
              onClick={() => setShowPreviewModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col items-center">
              {/* Smartphone mockup layout inside preview modal */}
              <div className={`w-full max-w-[280px] rounded-[36px] border-[8px] border-slate-900 shadow-xl overflow-hidden flex flex-col h-[520px] ${
                showPreviewModal.theme === 'Cosmic Slate' ? 'bg-slate-950 text-white' :
                showPreviewModal.theme === 'Minimal Light' ? 'bg-white text-slate-900 border-slate-900' :
                showPreviewModal.theme === 'Forest Moss' ? 'bg-emerald-950 text-emerald-100' :
                'bg-indigo-950 text-indigo-50'
              }`}>
                {/* Speaker Notch */}
                <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto mt-2 z-40 shrink-0" />

                <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 space-y-4 flex flex-col items-center text-center">
                  <img
                    src={showPreviewModal.avatarUrl}
                    alt={showPreviewModal.displayName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400/80 shadow-md"
                  />
                  <div>
                    <h3 className="text-xs font-black leading-snug">{showPreviewModal.displayName}</h3>
                    <p className="text-[8px] opacity-70 font-mono tracking-wider font-bold mt-0.5">{showPreviewModal.bioTitle}</p>
                  </div>
                  <p className="text-[10px] opacity-75 leading-relaxed font-medium">
                    {showPreviewModal.bioDesc}
                  </p>

                  {/* Links buttons */}
                  <div className="w-full space-y-2 pt-2">
                    {showPreviewModal.links.length === 0 ? (
                      <p className="text-[9px] opacity-40">No buttons configured.</p>
                    ) : (
                      showPreviewModal.links.map(link => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`block w-full py-2 px-3 text-[10px] font-black rounded-xl text-center shadow-xs transition-all border select-none ${
                            showPreviewModal.theme === 'Cosmic Slate' ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-white' :
                            showPreviewModal.theme === 'Minimal Light' ? 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-800' :
                            showPreviewModal.theme === 'Forest Moss' ? 'bg-emerald-900 border-emerald-800 hover:bg-emerald-800 text-emerald-100' :
                            'bg-indigo-900 border-indigo-800 hover:bg-indigo-800 text-indigo-50'
                          }`}
                        >
                          {link.title}
                        </a>
                      ))
                    )}
                  </div>
                  
                  <div className="text-[8px] opacity-40 font-bold uppercase mt-auto">
                    Powered by Worksuite BioLinks
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 w-full">
                <button
                  onClick={() => {
                    handleCopyLink(showPreviewModal.name);
                    setShowPreviewModal(null);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Link URL</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VISUAL SPLIT PANELS CUSTOMIZER */}
      {currentView === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="biolink-editor-bento">
          
          {/* LEFT CUSTOMIZER CONTROLS PANEL */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentView('list')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                    {editingBioId ? 'Customize BioLink Elements' : 'Register BioLink Profile'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Design custom landing themes, tracking handles, and responsive layouts.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveBioProfile} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Display Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Display Owner Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-bold"
                    value={formDisplayName}
                    onChange={(e) => setFormDisplayName(e.target.value)}
                  />
                </div>

                {/* Subdomain slug URL */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Profile URL Slug</label>
                  <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 overflow-hidden text-xs">
                    <span className="text-slate-400 pl-3 pr-1 font-mono font-bold select-none">/</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. elena-bio"
                      className="flex-1 bg-slate-50 text-slate-800 p-2.5 focus:outline-none font-bold"
                      value={formNameSlug}
                      onChange={(e) => setFormNameSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Bio Header Title</label>
                  <input
                    type="text"
                    placeholder="e.g. DevOps Team Lead"
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    value={formBioTitle}
                    onChange={(e) => setFormBioTitle(e.target.value)}
                  />
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Interactive Theme Skin</label>
                  <select
                    value={formTheme}
                    onChange={(e) => setFormTheme(e.target.value as any)}
                    className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="Cosmic Slate">Cosmic Slate (Dark)</option>
                    <option value="Minimal Light">Minimalist Snow (Light)</option>
                    <option value="Forest Moss">Forest Moss (Organic)</option>
                    <option value="Velvet Neon">Velvet Neon (Retro)</option>
                  </select>
                </div>
              </div>

              {/* Bio Desc */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Short Bio Tagline</label>
                <textarea
                  rows={2}
                  placeholder="Helping teams run scalable container operations securely..."
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 focus:outline-none rounded-xl border border-slate-200 font-medium leading-relaxed resize-none"
                  value={formBioDesc}
                  onChange={(e) => setFormBioDesc(e.target.value)}
                />
              </div>

              {/* Profile image photo upload */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Owner Profile Picture</label>
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <img
                    src={formAvatar}
                    alt="Preview avatar"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border shadow-xs shrink-0"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Image className="h-3.5 w-3.5" />
                    <span>Upload Custom Photo</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* OUTBOUND LINK EDITOR WORKSPACE */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                <h4 className="text-xs font-black text-slate-900 font-mono flex items-center gap-1.5 uppercase">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>Interactive Button Links</span>
                </h4>

                {/* Add new link component inside editor */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Button Display Text"
                      className="bg-slate-50 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none font-bold"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Destination URL Link"
                      className="bg-slate-50 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLinkToForm}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black py-2 rounded-lg flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add Custom Button Link</span>
                  </button>
                </div>

                {/* Links Registry sorting list */}
                <div className="space-y-2">
                  {formLinks.length === 0 ? (
                    <p className="text-[11px] text-slate-400 font-bold text-center py-2">No links mapped. Use the form above.</p>
                  ) : (
                    formLinks.map((link, idx) => (
                      <div key={link.id} className="bg-white p-3 rounded-xl border border-slate-150 flex items-center justify-between gap-3 shadow-xs">
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 leading-snug truncate">{link.title}</h5>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{link.url}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveLink(idx, 'up')}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer"
                            disabled={idx === 0}
                          >
                            <MoveUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveLink(idx, 'down')}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer"
                            disabled={idx === formLinks.length - 1}
                          >
                            <MoveDown className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveLinkForm(link.id)}
                            className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SOCIAL LINKS ATTACHMENTS */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Social Connect Links</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-xs pl-3">
                    <Twitter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Twitter URL"
                      className="flex-1 bg-transparent p-2 focus:outline-none text-[11px]"
                      value={formTwitter}
                      onChange={(e) => setFormTwitter(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-xs pl-3">
                    <img src="https://simpleicons.org/icons/github.svg" className="h-3.5 w-3.5 text-slate-400 shrink-0 opacity-40" alt="" />
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      className="flex-1 bg-transparent p-2 focus:outline-none text-[11px]"
                      value={formGithub}
                      onChange={(e) => setFormGithub(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-xs pl-3">
                    <Linkedin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      className="flex-1 bg-transparent p-2 focus:outline-none text-[11px]"
                      value={formLinkedin}
                      onChange={(e) => setFormLinkedin(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('list');
                    setEditingBioId(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer shadow-sm"
                >
                  Save BioLink Profile
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT LIVE MOBILE PHONE SIMULATOR PANEL */}
          <div className="lg:col-span-5 bg-slate-100 p-6 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center">
            
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 select-none">
              <Smartphone className="h-4.5 w-4.5" />
              <span>Mockup Live Simulation</span>
            </div>

            {/* SmartPhone frame wrapper container */}
            <div className={`w-[290px] h-[580px] rounded-[40px] border-[10px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col ${
              formTheme === 'Cosmic Slate' ? 'bg-slate-950 text-white' :
              formTheme === 'Minimal Light' ? 'bg-white text-slate-900' :
              formTheme === 'Forest Moss' ? 'bg-emerald-950 text-emerald-100' :
              'bg-indigo-950 text-indigo-50'
            }`}>
              {/* Speaker Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-40" />

              {/* Interactive preview contents */}
              <div className="flex-1 overflow-y-auto px-5 pt-12 pb-6 space-y-5 flex flex-col items-center text-center">
                
                {/* Header Details */}
                <div className="space-y-2 flex flex-col items-center">
                  <img
                    src={formAvatar}
                    alt="Simulated Avatar"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400/80 shadow-md scale-95"
                  />
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-black leading-snug">{formDisplayName}</h3>
                    <p className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold">{formBioTitle}</p>
                  </div>
                </div>

                {/* Short Description text */}
                <p className="text-[10px] opacity-75 leading-relaxed font-medium px-1 max-w-[240px]">
                  {formBioDesc || 'Insert owner biography summary details here.'}
                </p>

                {/* Social icons follow buttons row */}
                <div className="flex justify-center gap-3 py-1">
                  {formTwitter && <Twitter className="h-4.5 w-4.5 opacity-80 hover:opacity-100 cursor-pointer" />}
                  {formLinkedin && <Linkedin className="h-4.5 w-4.5 opacity-80 hover:opacity-100 cursor-pointer" />}
                </div>

                {/* Mapped links list rendering in simulator */}
                <div className="w-full flex-1 space-y-2.5 pt-2">
                  {formLinks.length === 0 ? (
                    <div className="border border-dashed border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center">
                      <PlusCircle className="h-6 w-6 opacity-40 mb-1" />
                      <span className="text-[9px] opacity-40">No outbound buttons</span>
                    </div>
                  ) : (
                    formLinks.map(link => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`block w-full py-2.5 px-4 text-[10px] font-black rounded-xl text-center shadow-xs transition-all border select-none ${
                          formTheme === 'Cosmic Slate' ? 'bg-slate-900 border-slate-850 hover:bg-slate-850 text-white' :
                          formTheme === 'Minimal Light' ? 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-800' :
                          formTheme === 'Forest Moss' ? 'bg-emerald-900 border-emerald-850 hover:bg-emerald-850 text-emerald-100' :
                          'bg-indigo-900 border-indigo-850 hover:bg-indigo-850 text-indigo-50'
                        }`}
                      >
                        <span className="truncate">{link.title}</span>
                      </a>
                    ))
                  )}
                </div>

                {/* Custom system brand footer */}
                <div className="text-[8px] opacity-40 font-bold uppercase select-none mt-auto">
                  Powered by Worksuite BioLinks
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SUCCESS TOAST */}
      {copiedToast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-semibold px-4.5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-55 animate-fade-in border border-slate-800">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Copied Link: <span className="text-blue-400 font-mono select-all">{copiedToast}</span></span>
        </div>
      )}
    </div>
  );
}

