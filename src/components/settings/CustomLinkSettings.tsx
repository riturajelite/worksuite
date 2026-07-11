import React, { useState } from 'react';
import { 
  Link2, Plus, Edit2, Trash2, X, Check, HelpCircle, AlertCircle, Eye, ToggleLeft, ToggleRight, Search
} from 'lucide-react';

interface CustomLinkSettingsProps {
  onNotify: (message: string) => void;
}

interface CustomLinkItem {
  id: string;
  title: string;
  url: string;
  viewedBy: ('admin' | 'employee' | 'client')[];
  status: boolean;
}

export default function CustomLinkSettings({ onNotify }: CustomLinkSettingsProps) {
  const [links, setLinks] = useState<CustomLinkItem[]>([
    { id: '1', title: 'Company Wiki & Handbook', url: 'https://wiki.internal.company.com', viewedBy: ['admin', 'employee'], status: true },
    { id: '2', title: 'Support Desk Portal', url: 'https://support.ourcompany.com', viewedBy: ['admin', 'employee', 'client'], status: true }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedLink, setSelectedLink] = useState<CustomLinkItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [viewedBy, setViewedBy] = useState<('admin' | 'employee' | 'client')[]>(['admin']);
  const [status, setStatus] = useState(true);

  const handleOpenCreate = () => {
    setModalMode('create');
    setTitle('');
    setUrl('');
    setViewedBy(['admin', 'employee']);
    setStatus(true);
    setShowModal(true);
  };

  const handleOpenEdit = (link: CustomLinkItem) => {
    setModalMode('edit');
    setSelectedLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setViewedBy(link.viewedBy);
    setStatus(link.status);
    setShowModal(true);
  };

  const handleToggleRoleCheckbox = (role: 'admin' | 'employee' | 'client') => {
    if (viewedBy.includes(role)) {
      setViewedBy(prev => prev.filter(r => r !== role));
    } else {
      setViewedBy(prev => [...prev, role]);
    }
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      onNotify('Title and URL are required.');
      return;
    }
    if (viewedBy.length === 0) {
      onNotify('Select at least one viewer role target profile.');
      return;
    }

    if (modalMode === 'create') {
      const newLink: CustomLinkItem = {
        id: String(Date.now()),
        title,
        url,
        viewedBy,
        status
      };
      setLinks(prev => [...prev, newLink]);
      onNotify(`Custom link '${title}' added successfully!`);
    } else if (modalMode === 'edit' && selectedLink) {
      setLinks(prev => prev.map(l => l.id === selectedLink.id ? {
        ...l,
        title,
        url,
        viewedBy,
        status
      } : l));
      onNotify(`Custom link '${title}' modified!`);
    }
    setShowModal(false);
  };

  const handleDeleteLink = (id: string, title: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
    onNotify(`Custom link '${title}' deleted.`);
  };

  const handleToggleStatus = (id: string, title: string) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, status: !l.status } : l));
    const item = links.find(l => l.id === id);
    if (item) {
      onNotify(`Custom link status of '${title}' set to ${!item.status ? 'Active' : 'Inactive'}.`);
    }
  };

  const filteredLinks = links.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="custom-link-settings-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Navigation Extension</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Link2 className="h-5.5 w-5.5 text-indigo-600" />
            <span>Custom Link Settings</span>
          </h2>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01]"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Custom Link</span>
        </button>
      </div>

      {/* Filter and Content panel */}
      <div className="bg-white rounded-2xl border border-slate-200/85 shadow-xs overflow-hidden">
        {/* Search header bar */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search custom link..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        {filteredLinks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Link Title</th>
                  <th className="py-3 px-4">Target URL</th>
                  <th className="py-3 px-4">Can Be Viewed By</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{link.title}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono select-all select-none hover:text-indigo-600 transition-colors">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        <span>{link.url}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {link.viewedBy.map((role) => (
                          <span
                            key={role}
                            className="bg-indigo-50 text-indigo-700 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider border border-indigo-100"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(link.id, link.title)}
                        className="cursor-pointer focus:outline-none"
                      >
                        {link.status ? (
                          <ToggleRight className="h-8 w-8 text-indigo-600" />
                        ) : (
                          <ToggleLeft className="h-8 w-8 text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(link)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all cursor-pointer"
                          title="Edit link details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink(link.id, link.title)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                          title="Delete Custom Link"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="h-8 w-8 text-slate-300" />
            <span className="text-xs font-bold">No Custom Links Found</span>
            <span className="text-[11px] text-slate-400 font-medium">Click "+ Add New Custom Link" to publish internal reference widgets.</span>
          </div>
        )}
      </div>

      {/* CREATE & EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  {modalMode === 'create' ? 'Add New Custom Link' : 'Edit Custom Link'}
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Link Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Employee Support Ticket Center"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Target URL <span className="text-rose-500">*</span></label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. https://support.mycompany.com"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                />
              </div>

              {/* Multiple checkbox selection for Viewer roles */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Can Be Viewed By <span className="text-rose-500">*</span></label>
                
                <div className="grid grid-cols-3 gap-2.5">
                  {(['admin', 'employee', 'client'] as const).map((role) => {
                    const isSelected = viewedBy.includes(role);
                    return (
                      <div
                        key={role}
                        onClick={() => handleToggleRoleCheckbox(role)}
                        className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-500 font-semibold'
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider block">{role}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status toggle checkbox */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Set Link Status Active</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Render inside profiles sidebar menu</span>
                </div>
                <input
                  type="checkbox"
                  checked={status}
                  onChange={() => setStatus(!status)}
                  className="h-4.5 w-4.5 text-indigo-600 rounded border-slate-300 cursor-pointer focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>{modalMode === 'create' ? 'Publish Link' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
