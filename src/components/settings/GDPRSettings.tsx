import React, { useState } from 'react';
import { 
  ShieldCheck, Save, HelpCircle, ToggleLeft, ToggleRight, Info, AlertCircle, Trash2, Download, Check, FileText, Mail
} from 'lucide-react';

interface GDPRSettingsProps {
  onNotify: (message: string) => void;
}

export default function GDPRSettings({ onNotify }: GDPRSettingsProps) {
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  // Sub GDPR module settings
  const [cookieConsent, setCookieConsent] = useState(true);
  const [cookieMessage, setCookieMessage] = useState(
    'We use cookies to improve your user experience and for analytic profiling. By continuing to browse, you agree to our privacy policy terms.'
  );

  const [dataRemoval, setDataRemoval] = useState(true);
  const [removalDays, setRemovalDays] = useState('30');

  const [portability, setPortability] = useState(true);
  const [termsAgreement, setTermsAgreement] = useState(true);
  const [termsText, setTermsText] = useState(
    'By registering or logging in, you explicitly acknowledge and agree to our general Service Terms & Conditions and GDPR Privacy policies.'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onNotify('GDPR compliance regulations configurations saved!');
    }, 1000);
  };

  return (
    <div className="space-y-6" id="gdpr-settings-view">
      {/* Title */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Compliance & Privacy</span>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-5.5 w-5.5 text-indigo-600" />
          <span>GDPR Settings</span>
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Master GDPR Enable Panel */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-950 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">Master Switch</span>
              <h3 className="font-extrabold text-white text-sm">Enable GDPR Compliance</h3>
            </div>
            <p className="text-xs text-slate-300 font-medium">Enable or disable General Data Protection Regulation features across the SaaS app portal.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setGdprEnabled(!gdprEnabled);
              onNotify(`GDPR Compliance status set to ${!gdprEnabled ? 'Enabled' : 'Disabled'}`);
            }}
            className="cursor-pointer focus:outline-none shrink-0"
          >
            {gdprEnabled ? (
              <ToggleRight className="h-9 w-9 text-indigo-400" />
            ) : (
              <ToggleLeft className="h-9 w-9 text-slate-600" />
            )}
          </button>
        </div>

        {gdprEnabled ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            
            {/* Cookie Consent Settings */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Cookie Consent</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Manage floating browser banners</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={cookieConsent}
                  onChange={() => setCookieConsent(!cookieConsent)}
                  className="h-4.5 w-4.5 text-indigo-600 rounded border-slate-300 cursor-pointer"
                />
              </div>

              {cookieConsent && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-[11px] font-bold text-slate-600 block">Cookie Banner Message Text</label>
                  <textarea
                    rows={4}
                    value={cookieMessage}
                    onChange={(e) => setCookieMessage(e.target.value)}
                    placeholder="Enter short cookie notice message text..."
                    className="w-full bg-slate-50 hover:bg-slate-50/20 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Terms & Register Agreement Consent */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Registration Consent</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Require agreement box during signup</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={termsAgreement}
                  onChange={() => setTermsAgreement(!termsAgreement)}
                  className="h-4.5 w-4.5 text-indigo-600 rounded border-slate-300 cursor-pointer"
                />
              </div>

              {termsAgreement && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-[11px] font-bold text-slate-600 block">Terms & Policy Agreement Consent Note</label>
                  <textarea
                    rows={4}
                    value={termsText}
                    onChange={(e) => setTermsText(e.target.value)}
                    placeholder="Consent sentence..."
                    className="w-full bg-slate-50 hover:bg-slate-50/20 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Data Removal & Forgotten rights */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Right to be Forgotten</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Enable account deletion requests</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={dataRemoval}
                  onChange={() => setDataRemoval(!dataRemoval)}
                  className="h-4.5 w-4.5 text-indigo-600 rounded border-slate-300 cursor-pointer"
                />
              </div>

              {dataRemoval && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">Grace Period Deletion (Days)</label>
                    <input
                      type="number"
                      value={removalDays}
                      onChange={(e) => setRemovalDays(e.target.value)}
                      min={0}
                      className="w-32 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">After user requests account erasure, wait this many days before hard-purging database schemas in case they cancel the removal.</p>
                </div>
              )}
            </div>

            {/* Data Portability (Export) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Download className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">Data Portability</h4>
                    <p className="text-[10px] text-slate-400 font-bold">JSON payload exporting downloads</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={portability}
                  onChange={() => setPortability(!portability)}
                  className="h-4.5 w-4.5 text-indigo-600 rounded border-slate-300 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-[10.5px] font-semibold text-slate-500 leading-relaxed">
                Allows both employees and client profiles to request and generate downloadable JSON files containing all profile details, invoices, time log files, and support tickets history directly from their dashboards.
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex gap-3 text-xs text-rose-800 font-semibold items-center">
            <AlertCircle className="h-6 w-6 text-rose-500 shrink-0" />
            <span>GDPR Compliance is disabled. Cookie banners, data export hooks, and Right to be Forgotten requests are deactivated system-wide.</span>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving || !gdprEnabled}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Compliance Settings</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
