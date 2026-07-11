import React, { useState } from 'react';
import { 
  Users, Save, HelpCircle, Check, Shield, Info, RefreshCw, Key, ArrowRight, Github
} from 'lucide-react';

interface SocialLoginSettingsProps {
  onNotify: (message: string) => void;
}

interface ProviderConfig {
  clientId: string;
  clientSecret: string;
  enabled: boolean;
}

export default function SocialLoginSettings({ onNotify }: SocialLoginSettingsProps) {
  const [activeTab, setActiveTab] = useState<'google' | 'facebook' | 'linkedin' | 'twitter'>('google');
  const [saving, setSaving] = useState(false);

  const [configs, setConfigs] = useState<Record<string, ProviderConfig>>({
    google: { clientId: '', clientSecret: '', enabled: false },
    facebook: { clientId: '', clientSecret: '', enabled: false },
    linkedin: { clientId: '', clientSecret: '', enabled: false },
    twitter: { clientId: '', clientSecret: '', enabled: false }
  });

  const handleInputChange = (provider: string, field: keyof ProviderConfig, value: string | boolean) => {
    setConfigs(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  const handleSave = (e: React.FormEvent, provider: string) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onNotify(`${provider.toUpperCase()} social SSO login configuration saved!`);
    }, 1000);
  };

  // Callback / Redirect URL template helper
  const getCallbackUrl = (provider: string) => {
    return `https://yourdomain.com/api/auth/callback/${provider}`;
  };

  return (
    <div className="space-y-6" id="social-login-settings-view">
      {/* Title */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Authentication Providers</span>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="h-5.5 w-5.5 text-indigo-600 animate-pulse" />
          <span>Social Login Settings</span>
        </h2>
      </div>

      {/* Main card panel with tabs on top */}
      <div className="bg-white rounded-2xl border border-slate-200/85 shadow-xs overflow-hidden">
        {/* Header tabs with status dots */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex flex-wrap gap-1.5">
          {(['google', 'facebook', 'linkedin', 'twitter'] as const).map(provider => {
            const isSelected = activeTab === provider;
            const config = configs[provider];
            return (
              <button
                key={provider}
                type="button"
                onClick={() => setActiveTab(provider)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {/* Status indicator dot */}
                <span className={`h-2 w-2 rounded-full ${config.enabled ? 'bg-emerald-500 animate-ping' : 'bg-rose-400'} shrink-0`} />
                <span className={`h-2 w-2 rounded-full absolute ${config.enabled ? 'bg-emerald-500' : 'bg-rose-400'} shrink-0`} />
                <span className="pl-3 capitalize">{provider}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6">
          <form onSubmit={(e) => handleSave(e, activeTab)} className="space-y-6">
            
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Form Input fields */}
              <div className="flex-1 space-y-4">
                
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-xl max-w-md">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block capitalize">{activeTab} SSO Integration</span>
                    <span className="text-[10px] text-slate-400 block font-medium">Toggle user-facing login option</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange(activeTab, 'enabled', !configs[activeTab].enabled)}
                    className="cursor-pointer focus:outline-none"
                  >
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase ${
                      configs[activeTab].enabled 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {configs[activeTab].enabled ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                    Client ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={configs[activeTab].enabled}
                    value={configs[activeTab].clientId}
                    onChange={(e) => handleInputChange(activeTab, 'clientId', e.target.value)}
                    placeholder={`Paste your ${activeTab} Client API Key ID`}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                    Client Secret Key <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required={configs[activeTab].enabled}
                    value={configs[activeTab].clientSecret}
                    onChange={(e) => handleInputChange(activeTab, 'clientSecret', e.target.value)}
                    placeholder={`Paste your ${activeTab} client API credentials secret`}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>

                {/* Redirect URI read-only */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 block text-[10px] uppercase">Authorized Redirect URI</label>
                    <span className="text-[10px] text-slate-400 font-bold block">Copy into Provider Console</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-mono text-indigo-600 select-all font-semibold flex items-center justify-between">
                    <span>{getCallbackUrl(activeTab)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(getCallbackUrl(activeTab));
                        onNotify('Callback URI copied to clipboard!');
                      }}
                      className="text-[10px] text-indigo-700 font-black tracking-wider uppercase hover:underline cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>

              </div>

              {/* Informational help card for configuration */}
              <div className="w-full md:w-80 bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-3.5 shrink-0 text-xs">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <Key className="h-4 w-4 text-indigo-600" />
                  <span>How to configure</span>
                </h4>
                
                <div className="space-y-2.5 text-slate-500 font-semibold leading-relaxed">
                  <p>
                    1. Go to your <span className="text-slate-800 font-bold capitalize">{activeTab} Developer Console</span> project settings page.
                  </p>
                  <p>
                    2. Enable the <strong className="text-slate-700">OAuth2 Authentications Protocol</strong> service inside your client credentials manager.
                  </p>
                  <p>
                    3. Copy the <strong className="text-indigo-600 font-mono">Authorized Redirect URI</strong> on the left and paste it into the console whitelist.
                  </p>
                  <p>
                    4. Retrieve the generated <strong className="text-slate-700">Client ID</strong> and <strong className="text-slate-700">Client Secret Key</strong>, then enter them here.
                  </p>
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-2 transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span className="capitalize">Save {activeTab} Settings</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
