import React, { useState } from 'react';
import { 
  UserPlus, Save, HelpCircle, Check, ToggleLeft, ToggleRight
} from 'lucide-react';

interface SignUpSettingsProps {
  onNotify: (message: string) => void;
}

export default function SignUpSettings({ onNotify }: SignUpSettingsProps) {
  const [signupTermsEnabled, setSignupTermsEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onNotify('Sign up registration configurations updated successfully!');
    }, 800);
  };

  return (
    <div className="space-y-6" id="sign-up-settings-view">
      
      {/* Top Header section */}
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          <span>Sign Up Settings</span>
        </h2>
        <div className="text-[11px] text-slate-400 font-semibold mt-1">
          <span>Sign Up Settings</span>
          <span className="mx-1.5 text-slate-300">•</span>
          <span className="text-slate-500 font-bold">Home</span>
          <span className="mx-1.5 text-slate-300">•</span>
          <span className="text-slate-500 font-bold">Settings</span>
          <span className="mx-1.5 text-slate-300">•</span>
          <span className="text-slate-400 font-medium">Sign Up Settings</span>
        </div>
      </div>

      {/* Main Setting Box */}
      <form onSubmit={handleSave} className="space-y-6 max-w-lg">
        <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3 shadow-3xs">
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
            <span>Sign-up terms and conditions</span>
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-slate-400 cursor-help hover:text-slate-500" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg text-center z-10 font-medium leading-normal">
                Enable this to require users to agree to terms and conditions during registration.
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setSignupTermsEnabled(!signupTermsEnabled)}
              className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
            >
              {signupTermsEnabled ? (
                <ToggleRight className="h-9 w-9 text-blue-500" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors disabled:opacity-75"
          >
            {saving ? (
              <span className="h-3.5 w-3.5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            )}
            <span>Save</span>
          </button>
        </div>
      </form>

    </div>
  );
}
