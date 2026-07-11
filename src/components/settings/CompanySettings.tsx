import React, { useState } from 'react';
import { HelpCircle, Save, Upload, CheckCircle2 } from 'lucide-react';

interface CompanySettingsProps {
  onNotify: (message: string) => void;
}

export default function CompanySettings({ onNotify }: CompanySettingsProps) {
  const [companyName, setCompanyName] = useState('Worksuite');
  const [companyEmail, setCompanyEmail] = useState('company@email.com');
  const [companyPhone, setCompanyPhone] = useState('1234567891');
  const [companyWebsite, setCompanyWebsite] = useState('https://worksuite.biz');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Company Settings Saved Successfully!');
  };

  return (
    <div className="space-y-6" id="company-settings-root">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • Company Settings
        </div>
        <h2 className="text-xl font-bold text-slate-800">Company Settings</h2>
      </div>

      {/* Main Settings Form Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <span>Company Name *</span>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
              </label>
              <input
                type="text"
                required
                className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* Company Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Company Email *
              </label>
              <input
                type="email"
                required
                className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </div>

            {/* Company Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Company Phone *
              </label>
              <input
                type="tel"
                required
                className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </div>

            {/* Company Website */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Company Website
              </label>
              <input
                type="url"
                className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </div>
          </div>

          {/* Logo Section */}
          <div className="border-t border-slate-150 pt-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-700">Company Logo</h4>
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="relative group w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-center font-bold text-[18px] text-slate-400">
                    W
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Upload className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left space-y-1.5">
                <p className="text-[11px] text-slate-500">
                  Recommended: Square logo, PNG with transparent background. Max size: 2MB.
                </p>
                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60');
                      onNotify('Company logo updated!');
                    }}
                    className="text-xs font-bold text-indigo-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg cursor-pointer transition-all shadow-3xs"
                  >
                    Upload Logo
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl(null);
                        onNotify('Logo removed.');
                      }}
                      className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-start pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
