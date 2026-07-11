import React, { useState, useRef } from 'react';
import { 
  BookOpen, Search, Plus, Settings, FolderPlus, Edit2, Trash2, 
  X, Check, HelpCircle, ArrowLeft, Bold, Italic, Underline, 
  List, ListOrdered, AlignLeft, Link2, Paperclip, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Employee, Client } from '../../types';

interface KBArticle {
  id: number;
  title: string;
  category: string;
  content: string;
  target: 'Employees' | 'Clients' | 'All';
  attachments?: { name: string; size: string }[];
}

interface KBCategory {
  id: string;
  name: string;
  articleCount: number;
}

const INITIAL_CATEGORIES: KBCategory[] = [
  { id: 'cat-all', name: 'All Categories', articleCount: 4 },
  { id: 'cat-dev', name: 'DevOps & Deployments', articleCount: 2 },
  { id: 'cat-hr', name: 'Human Resources & Onboarding', articleCount: 1 },
  { id: 'cat-support', name: 'IT Support & Hardware', articleCount: 1 },
  { id: 'cat-fin', name: 'Finance & Payments', articleCount: 0 },
];

const INITIAL_ARTICLES: KBArticle[] = [
  {
    id: 1,
    title: 'Connecting to Corporate Git via SSH Handshake',
    category: 'DevOps & Deployments',
    content: 'Follow these step-by-step instructions for mapping local public SSH keys onto our container hosting nodes. Never export your secret passphrase to unencrypted files.',
    target: 'Employees',
    attachments: [{ name: 'git_ssh_handshake.pdf', size: '144 KB' }]
  },
  {
    id: 2,
    title: 'Biometric Attendance Clock Calibration runbook',
    category: 'IT Support & Hardware',
    content: 'Recalibrate the hardware biometric terminals if alignment codes trigger logs error. Ensure your employee mapping status is active before clocking in.',
    target: 'Employees',
    attachments: []
  },
  {
    id: 3,
    title: 'Client Checkout Portal invoice pay guide',
    category: 'DevOps & Deployments',
    content: 'How to authorize remote client ledger payments through the Stripe checkout container router safely. Keep VITE_ keys hidden from clients.',
    target: 'Clients',
    attachments: [{ name: 'stripe_pay_flow.docx', size: '2.4 MB' }]
  },
  {
    id: 4,
    title: 'Corporate Expense Logging Policy guidelines',
    category: 'Human Resources & Onboarding',
    content: 'Standard thresholds for remote license software acquisition, local compute hardware depreciation, and third-party SaaS seat pricing allocations.',
    target: 'All',
    attachments: []
  }
];

interface KnowledgeBaseViewProps {
  employees: Employee[];
  clients: Client[];
}

export default function KnowledgeBaseView({ employees, clients }: KnowledgeBaseViewProps) {
  const [categories, setCategories] = useState<KBCategory[]>(INITIAL_CATEGORIES);
  const [articles, setArticles] = useState<KBArticle[]>(INITIAL_ARTICLES);

  // Filter states
  const [activeCategoryId, setActiveCategoryId] = useState('cat-all');
  const [sidebarCatSearch, setSidebarCatSearch] = useState('');
  const [mainPanelSearch, setMainPanelSearch] = useState('');

  // View states: 'list' | 'add'
  const [currentView, setCurrentView] = useState<'list' | 'add'>('list');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [viewingArticle, setViewingArticle] = useState<KBArticle | null>(null);

  // Category Manager State
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Add Article Form state
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState('DevOps & Deployments');
  const [articleTarget, setArticleTarget] = useState<'Employees' | 'Clients'>('Employees');
  const [articleContent, setArticleContent] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);

  // File attach ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sidebar filtered categories
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(sidebarCatSearch.toLowerCase())
  );

  // Active category name
  const activeCategory = categories.find(c => c.id === activeCategoryId);

  // Filtered Articles listing
  const filteredArticles = articles.filter(art => {
    // Search filter
    const matchesSearch = art.title.toLowerCase().includes(mainPanelSearch.toLowerCase()) ||
                          art.content.toLowerCase().includes(mainPanelSearch.toLowerCase());
    if (!matchesSearch) return false;

    // Category filter
    if (activeCategoryId !== 'cat-all' && activeCategory) {
      if (art.category !== activeCategory.name) return false;
    }

    return true;
  });

  // Category Manager CRUD
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    // Check duplicates
    if (categories.some(c => c.name.toLowerCase() === newCatName.toLowerCase())) {
      alert("Category already exists.");
      return;
    }

    const newCat: KBCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      articleCount: 0
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
  };

  const handleUpdateCategory = (id: string) => {
    if (!editingCatName.trim()) return;
    
    // Update category name in state
    const oldCat = categories.find(c => c.id === id);
    if (!oldCat) return;

    setCategories(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, name: editingCatName.trim() };
      }
      return c;
    }));

    // Cascade update category names on articles
    setArticles(prev => prev.map(art => {
      if (art.category === oldCat.name) {
        return { ...art, category: editingCatName.trim() };
      }
      return art;
    }));

    setEditingCatId(null);
    setEditingCatName('');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (id === 'cat-all') return;
    if (confirm(`Are you sure you want to delete "${name}" category? Articles in this category will be preserved but category tag will change.`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
      if (activeCategoryId === id) {
        setActiveCategoryId('cat-all');
      }
    }
  };

  // Article Actions
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) return;

    const newArt: KBArticle = {
      id: articles.length + 1,
      title: articleTitle,
      category: articleCategory,
      content: articleContent,
      target: articleTarget,
      attachments: attachedFiles
    };

    setArticles([newArt, ...articles]);

    // Update categories count
    setCategories(prev => prev.map(c => {
      if (c.name === articleCategory || c.id === 'cat-all') {
        return { ...c, articleCount: c.articleCount + 1 };
      }
      return c;
    }));

    // Reset Form & View
    setArticleTitle('');
    setArticleContent('');
    setAttachedFiles([]);
    setCurrentView('list');
  };

  const handleDeleteArticle = (id: number, catName: string) => {
    if (confirm("Are you sure you want to delete this wiki runbook article?")) {
      setArticles(prev => prev.filter(a => a.id !== id));
      
      // Update categories counts
      setCategories(prev => prev.map(c => {
        if (c.name === catName || c.id === 'cat-all') {
          return { ...c, articleCount: Math.max(0, c.articleCount - 1) };
        }
        return c;
      }));
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).map((f: any) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`
      }));
      setAttachedFiles(prev => [...prev, ...files]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      {currentView === 'list' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <span>Knowledge Base Wiki Workspace</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Central runbook logs, compliance documentation, and deployment guidelines.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-manage-categories"
              onClick={() => setShowCategoryModal(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Manage Categories</span>
            </button>
            <button
              id="btn-add-article"
              onClick={() => setCurrentView('add')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Article</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT (SIDEBAR + CONTENT PANEL) */}
      {currentView === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="kb-module-stage">
          
          {/* LEFT SIDEBAR: Category Panel */}
          <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search categories</h4>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Find category tag..."
                className="w-full bg-slate-50 text-slate-800 text-xs pl-8.5 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none"
                value={sidebarCatSearch}
                onChange={(e) => setSidebarCatSearch(e.target.value)}
              />
            </div>

            {/* Category selection list */}
            <div className="space-y-1">
              {filteredCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg text-left transition-colors ${
                    activeCategoryId === cat.id 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full shrink-0">
                    {cat.articleCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN PANEL: Article Table Ledger */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 font-mono">
                {activeCategory ? activeCategory.name : 'Wiki Articles'} Catalog
              </h3>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles heading..."
                  className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none"
                  value={mainPanelSearch}
                  onChange={(e) => setMainPanelSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Articles Table Grid */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="px-5 py-3 w-12">#</th>
                    <th className="px-5 py-3">Article Heading</th>
                    <th className="px-5 py-3">Article Category</th>
                    <th className="px-5 py-3">To (Audience)</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center text-slate-400">
                        <div className="max-w-xs mx-auto space-y-2">
                          <HelpCircle className="h-8 w-8 mx-auto text-slate-300" />
                          <h4 className="text-xs font-bold text-slate-700">No Record Found</h4>
                          <p className="text-[11px] text-slate-400">No matching runbook articles were found inside this wiki category.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art, index) => (
                      <tr key={art.id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-slate-400 font-bold">{index + 1}</td>
                        <td className="px-5 py-3.5">
                          <div className="space-y-0.5">
                            <h4 
                              onClick={() => setViewingArticle(art)}
                              className="text-xs font-bold text-slate-900 hover:text-indigo-600 hover:underline cursor-pointer"
                            >
                              {art.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate max-w-sm font-medium">{art.content}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-500">{art.category}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            art.target === 'Employees' ? 'bg-indigo-50 text-indigo-700' :
                            art.target === 'Clients' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {art.target}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setViewingArticle(art)}
                              className="text-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                            >
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id, art.category)}
                              className="text-[10px] text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                              title="Delete article"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD ARTICLE PAGE */}
      {currentView === 'add' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentView('list')}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div>
                <h3 className="text-sm font-black text-slate-900 font-mono uppercase tracking-wide">
                  Publish New Article Runbook
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Record deployment guides, compliance rules, or onboarding details.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveArticle} className="space-y-4">
            {/* Target Radio Selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Target Reader</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700 select-none">
                  <input
                    type="radio"
                    name="articleTarget"
                    checked={articleTarget === 'Employees'}
                    onChange={() => setArticleTarget('Employees')}
                    className="accent-indigo-600 h-4 w-4"
                  />
                  <span>Employees / Staff</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700 select-none">
                  <input
                    type="radio"
                    name="articleTarget"
                    checked={articleTarget === 'Clients'}
                    onChange={() => setArticleTarget('Clients')}
                    className="accent-indigo-600 h-4 w-4"
                  />
                  <span>Clients / Partners</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Article Heading */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Article Heading</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Setting up Docker Compose, Registering hardware..."
                  className="w-full bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                />
              </div>

              {/* Category Dropdown & Quick Add button */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Article Category</label>
                <div className="flex gap-2">
                  <select
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value)}
                    className="flex-1 bg-slate-50 text-slate-800 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                  >
                    {categories.filter(c => c.id !== 'cat-all').map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const name = prompt("Enter new category name:");
                      if (name && name.trim()) {
                        const newCat = { id: `cat-${Date.now()}`, name: name.trim(), articleCount: 0 };
                        setCategories([...categories, newCat]);
                        setArticleCategory(name.trim());
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl flex items-center justify-center border border-slate-200"
                    title="Add category"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Rich text simulated block */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Article Body (Wiki Rich Editor)</label>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                {/* Fake toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border-b border-slate-200 text-slate-400">
                  <Bold className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                  <Italic className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                  <Underline className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <List className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                  <ListOrdered className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                  <AlignLeft className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <Link2 className="h-3.5 w-3.5 cursor-pointer hover:text-slate-600" />
                </div>
                <textarea
                  rows={8}
                  required
                  placeholder="Draft detailed wiki instructions and step-by-step procedures..."
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-xs p-3.5 focus:outline-none resize-none font-medium leading-relaxed"
                />
              </div>
            </div>

            {/* Large upload section exactly like screenshot */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Reference Manuals / Attachments</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <Paperclip className="h-7 w-7 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Drag and Drop PDF runbooks or click to select files</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Size limit 25MB. Safe files are automatically mapped via SSL peer.</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileAttach}
                  className="hidden"
                  multiple
                />
              </div>

              {/* Show attached */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 pl-2.5 pr-1 py-1 rounded-lg text-[10px] font-mono">
                      <Paperclip className="h-3 w-3 text-slate-400" />
                      <span className="font-bold text-slate-700 truncate max-w-[150px]">{file.name}</span>
                      <span className="text-slate-400">({file.size})</span>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="p-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Footer Actions */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 font-sans">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-5 py-2.5 rounded-xl cursor-pointer shadow-sm"
              >
                Save Article Runbook
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MANAGE CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4 mx-4">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 font-mono uppercase tracking-wide">
                Manage Article Categories
              </h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Table of Existing Categories */}
            <div className="max-h-56 overflow-y-auto border border-slate-150 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-150">
                    <th className="px-3.5 py-2">Category Name</th>
                    <th className="px-3.5 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-50/20">
                      <td className="px-3.5 py-2.5 font-bold">
                        {editingCatId === cat.id ? (
                          <input
                            type="text"
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            className="bg-slate-50 text-xs px-2 py-1 rounded border border-indigo-400 focus:outline-none w-full"
                          />
                        ) : (
                          <span>{cat.name}</span>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5 text-right shrink-0">
                        {cat.id !== 'cat-all' ? (
                          <div className="flex justify-end items-center gap-1">
                            {editingCatId === cat.id ? (
                              <button
                                onClick={() => handleUpdateCategory(cat.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded"
                                title="Save"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingCatId(cat.id);
                                  setEditingCatName(cat.name);
                                }}
                                className="text-slate-400 hover:text-indigo-600 p-1"
                                title="Edit"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              disabled={cat.id === 'cat-all'}
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="text-slate-400 hover:text-red-600 p-1 disabled:opacity-30"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 font-mono font-bold">SYSTEM</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Add category form inside modal */}
            <form onSubmit={handleAddCategory} className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Category Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Legal Compliances, Server Ops..."
                  className="flex-1 bg-slate-50 text-slate-800 text-xs p-2 rounded-xl border border-slate-200 focus:outline-none"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 rounded-xl shadow-xs transition-colors"
                >
                  Save
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLE VIEW DETAIL MODAL */}
      {viewingArticle && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-100 shadow-2xl space-y-4 mx-4">
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                  {viewingArticle.category}
                </span>
                <h3 className="text-sm font-black text-slate-900 leading-snug pt-1">
                  {viewingArticle.title}
                </h3>
              </div>
              <button 
                onClick={() => setViewingArticle(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metadata bar */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-bold flex justify-between">
              <span>Audience: <span className="text-indigo-600">{viewingArticle.target}</span></span>
              <span>Wiki ID: <span className="font-mono text-slate-700">#KB-0{viewingArticle.id}</span></span>
            </div>

            {/* Description content */}
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto font-medium py-1">
              {viewingArticle.content}
            </div>

            {/* Attachments list */}
            {viewingArticle.attachments && viewingArticle.attachments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Attachments & References</h5>
                <div className="flex flex-col gap-1.5">
                  {viewingArticle.attachments.map((file, idx) => (
                    <div 
                      key={idx}
                      onClick={() => alert(`Downloading runbook attachment: ${file.name}`)}
                      className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-150 hover:border-indigo-400 rounded-xl cursor-pointer text-[11px] font-mono hover:bg-indigo-50/20 transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-bold text-slate-700 truncate">{file.name}</span>
                      </div>
                      <span className="text-indigo-600 font-black shrink-0">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingArticle(null)}
                className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
