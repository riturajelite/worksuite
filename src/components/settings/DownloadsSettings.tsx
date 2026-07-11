import React, { useState } from 'react';
import { HelpCircle, Save, Download, Apple, Play } from 'lucide-react';

interface DownloadsSettingsProps {
  onNotify: (message: string) => void;
}

const DEFAULT_IOS = 'https://apps.apple.com/us/app/worksuite/id123456789';
const DEFAULT_ANDROID = 'https://play.google.com/store/apps/details?id=com.worksuite';

export default function DownloadsSettings({ onNotify }: DownloadsSettingsProps) {
  const [iosUrl, setIosUrl] = useState(DEFAULT_IOS);
  const [androidUrl, setAndroidUrl] = useState(DEFAULT_ANDROID);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Downloads settings saved successfully!');
  };

  return (
    <div className="space-y-6" id="downloads-settings-root">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • Settings • Downloads
        </div>
        <h2 className="text-xl font-bold text-slate-800">Downloads</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-4xl space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Mobile store links</h3>
          <p className="text-xs text-slate-450 mt-0.5">
            Set public download links for your mobile apps. These URLs are shared with all companies using this installation.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* iOS Link */}
          <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Apple className="h-4 w-4 text-slate-800" />
              <span>Apple iOS</span>
              <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter App Store URL"
                className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                value={iosUrl}
                onChange={(e) => setIosUrl(e.target.value)}
              />
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIosUrl('')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIosUrl(DEFAULT_IOS)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Reset To Default
                </button>
                <button
                  type="button"
                  onClick={() => iosUrl ? window.open(iosUrl, '_blank') : onNotify('No link specified!')}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Open link
                </button>
              </div>
            </div>

            {/* Apple Preview Button */}
            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer shadow-2xs transition-all"
                onClick={() => onNotify('Simulating Apple Store download link')}
              >
                <Apple className="h-4 w-4" />
                <span>Apple iOS</span>
              </button>
            </div>
          </div>

          {/* Android Link */}
          <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Play className="h-3.5 w-3.5 text-slate-800 fill-slate-800" />
              <span>Google Android</span>
              <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter Play Store URL"
                className="w-full bg-white text-slate-800 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                value={androidUrl}
                onChange={(e) => setAndroidUrl(e.target.value)}
              />
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setAndroidUrl('')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setAndroidUrl(DEFAULT_ANDROID)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Reset To Default
                </button>
                <button
                  type="button"
                  onClick={() => androidUrl ? window.open(androidUrl, '_blank') : onNotify('No link specified!')}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Open link
                </button>
              </div>
            </div>

            {/* Android Preview Button */}
            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer shadow-2xs transition-all"
                onClick={() => onNotify('Simulating Play Store download link')}
              >
                <Play className="h-4 w-4 fill-white text-white" />
                <span>Google Android</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium italic">
            Changes apply immediately for all users who can open this page.
          </p>

          {/* Custom Logo apps section */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-700">Custom Logo Apps</h4>
            <p className="text-xs text-slate-450 leading-relaxed">
              Publishing under your own developer accounts typically requires Apple and Google developer memberships. Use the official console links below for more information.
            </p>
            <button
              type="button"
              onClick={() => onNotify('Redirecting to order custom logo apps services')}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow-3xs"
            >
              Order Custom Logo Apps
            </button>
          </div>

          {/* Submit */}
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
