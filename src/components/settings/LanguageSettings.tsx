import React, { useState } from 'react';
import { 
  Globe, Info, Plus, Settings, Edit2, Trash2, X, Check, ToggleLeft, ToggleRight, AlertCircle, HelpCircle
} from 'lucide-react';

interface LanguageSettingsProps {
  onNotify: (message: string) => void;
}

interface LanguageItem {
  id: string;
  name: string;
  code: string;
  rtl: boolean;
  enabled: boolean;
  flag: string;
}

export default function LanguageSettings({ onNotify }: LanguageSettingsProps) {
  const [languages, setLanguages] = useState<LanguageItem[]>([
    { id: '1', name: 'English', code: 'en', rtl: false, enabled: true, flag: '🇺🇸' },
    { id: '2', name: 'Arabic', code: 'ar', rtl: true, enabled: false, flag: '🇸🇦' },
    { id: '3', name: 'Bulgarian', code: 'bg', rtl: false, enabled: false, flag: '🇧🇬' },
    { id: '4', name: 'Thai', code: 'th', rtl: false, enabled: false, flag: '🇹🇭' },
    { id: '5', name: 'Serbian', code: 'sr', rtl: false, enabled: false, flag: '🇷🇸' },
    { id: '6', name: 'Georgian', code: 'ka', rtl: false, enabled: false, flag: '🇬🇪' },
    { id: '7', name: 'German', code: 'de', rtl: false, enabled: false, flag: '🇩🇪' },
    { id: '8', name: 'Spanish', code: 'es', rtl: false, enabled: false, flag: '🇪🇸' },
    { id: '9', name: 'Estonian', code: 'et', rtl: false, enabled: false, flag: '🇪🇪' },
    { id: '10', name: 'Farsi', code: 'fa', rtl: true, enabled: false, flag: '🇮🇷' },
    { id: '11', name: 'Indonesian', code: 'id', rtl: false, enabled: false, flag: '🇮🇩' },
    { id: '12', name: 'Italian', code: 'it', rtl: false, enabled: false, flag: '🇮🇹' },
    { id: '13', name: 'Dutch', code: 'nl', rtl: false, enabled: false, flag: '🇳🇱' },
    { id: '14', name: 'Polish', code: 'pl', rtl: false, enabled: false, flag: '🇵🇱' },
    { id: '15', name: 'Portuguese', code: 'pt', rtl: false, enabled: false, flag: '🇵🇹' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedLang, setSelectedLang] = useState<LanguageItem | null>(null);

  // Form states
  const [langName, setLangName] = useState('');
  const [langCode, setLangCode] = useState('');
  const [langRtl, setLangRtl] = useState(false);
  const [langEnabled, setLangEnabled] = useState(true);
  const [langFlag, setLangFlag] = useState('🏳️');

  const handleOpenCreate = () => {
    setModalMode('create');
    setLangName('');
    setLangCode('');
    setLangRtl(false);
    setLangEnabled(true);
    setLangFlag('🏳️');
    setShowModal(true);
  };

  const handleOpenEdit = (lang: LanguageItem) => {
    setModalMode('edit');
    setSelectedLang(lang);
    setLangName(lang.name);
    setLangCode(lang.code);
    setLangRtl(lang.rtl);
    setLangEnabled(lang.enabled);
    setLangFlag(lang.flag);
    setShowModal(true);
  };

  const handleSaveLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!langName.trim() || !langCode.trim()) {
      onNotify('Please fill in all required fields.');
      return;
    }

    if (modalMode === 'create') {
      const newLang: LanguageItem = {
        id: String(Date.now()),
        name: langName,
        code: langCode.toLowerCase(),
        rtl: langRtl,
        enabled: langEnabled,
        flag: langFlag
      };
      setLanguages(prev => [...prev, newLang]);
      onNotify(`Language '${langName}' added successfully!`);
    } else if (modalMode === 'edit' && selectedLang) {
      setLanguages(prev => prev.map(l => l.id === selectedLang.id ? {
        ...l,
        name: langName,
        code: langCode.toLowerCase(),
        rtl: langRtl,
        enabled: langEnabled,
        flag: langFlag
      } : l));
      onNotify(`Language '${langName}' updated successfully!`);
    }
    setShowModal(false);
  };

  const handleDeleteLang = (id: string, name: string) => {
    if (name === 'English') {
      onNotify('Action denied: English is the core system language and cannot be deleted.');
      return;
    }
    setLanguages(prev => prev.filter(l => l.id !== id));
    onNotify(`Language '${name}' deleted successfully.`);
  };

  const handleToggleStatus = (id: string, name: string) => {
    setLanguages(prev => prev.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l));
    const currentLang = languages.find(l => l.id === id);
    if (currentLang) {
      onNotify(`Language status set to ${!currentLang.enabled ? 'Enabled' : 'Disabled'} for '${name}'`);
    }
  };

  return (
    <div className="space-y-6" id="language-settings-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Localization Systems</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="h-5.5 w-5.5 text-indigo-600" />
            <span>Language Settings</span>
          </h2>
        </div>

        {/* Action button grouping */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Language</span>
          </button>
          
          <button
            type="button"
            onClick={() => onNotify('Preparing translation dictionary mapper...')}
            className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span>Translate</span>
          </button>
        </div>
      </div>

      {/* Info Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-amber-800 font-semibold">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-amber-900 block">Note regarding translation bundles</span>
          <p className="text-amber-700 font-medium mt-0.5">
            Simply enabling a language setting will not automatically change the language. To effectively change the language, you must also have translation files compiled under that specific locale directory.
          </p>
        </div>
      </div>

      {/* Languages Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/85 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Language Name</th>
                <th className="py-3 px-4">Language Code</th>
                <th className="py-3 px-4">RTL Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {languages.map((lang) => (
                <tr key={lang.id} className="hover:bg-slate-50/40">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none" role="img" aria-label="flag">{lang.flag}</span>
                      <span className="font-bold text-slate-900">{lang.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 font-bold uppercase">{lang.code}</td>
                  <td className="py-3.5 px-4">
                    {lang.rtl ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Yes</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">No</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(lang.id, lang.name)}
                      className="cursor-pointer"
                    >
                      {lang.enabled ? (
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
                        onClick={() => handleOpenEdit(lang)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all cursor-pointer"
                        title="Edit Language parameters"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLang(lang.id, lang.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                        title="Delete Language"
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
      </div>

      {/* CREATE & EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  {modalMode === 'create' ? 'Add New Language' : 'Edit Language'}
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLanguage} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Language Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={langName}
                  onChange={(e) => setLangName(e.target.value)}
                  placeholder="e.g. French"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Language Code <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={langCode}
                    onChange={(e) => setLangCode(e.target.value)}
                    placeholder="e.g. fr"
                    maxLength={5}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono lowercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Flag Icon Emoji</label>
                  <select
                    value={langFlag}
                    onChange={(e) => setLangFlag(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="🏳️">🏳️ Generic Flag</option>
                    <option value="🇺🇸">🇺🇸 United States</option>
                    <option value="🇫🇷">🇫🇷 France</option>
                    <option value="🇩🇪">🇩🇪 Germany</option>
                    <option value="🇪🇸">🇪🇸 Spain</option>
                    <option value="🇮🇹">🇮🇹 Italy</option>
                    <option value="🇯🇵">🇯🇵 Japan</option>
                    <option value="🇨🇳">🇨🇳 China</option>
                    <option value="🇮🇳">🇮🇳 India</option>
                    <option value="🇧🇷">🇧🇷 Brazil</option>
                    <option value="🇨🇦">🇨🇦 Canada</option>
                    <option value="🇬🇧">🇬🇧 United Kingdom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">RTL Status</span>
                    <span className="text-[9px] text-slate-400 block font-medium">Right-to-Left</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={langRtl}
                    onChange={() => setLangRtl(!langRtl)}
                    className="h-4 w-4 text-indigo-600 rounded border-slate-300 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">Set Active</span>
                    <span className="text-[9px] text-slate-400 block font-medium">Status visible</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={langEnabled}
                    onChange={() => setLangEnabled(!langEnabled)}
                    className="h-4 w-4 text-indigo-600 rounded border-slate-300 cursor-pointer"
                  />
                </div>
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
                  <span>{modalMode === 'create' ? 'Add Language' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
