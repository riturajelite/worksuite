import React, { useState } from 'react';
import { 
  HardDrive, Info, Save, HelpCircle, Check, Shield, Database, RefreshCw, Server
} from 'lucide-react';

interface StorageSettingsProps {
  onNotify: (message: string) => void;
}

export default function StorageSettings({ onNotify }: StorageSettingsProps) {
  const [storageType, setStorageType] = useState<'local' | 'aws' | 'digitalocean' | 'wasabi' | 'minio'>('local');
  const [saving, setSaving] = useState(false);

  // Form states
  const [awsKey, setAwsKey] = useState('');
  const [awsSecret, setAwsSecret] = useState('');
  const [awsRegion, setAwsRegion] = useState('us-east-1');
  const [awsBucket, setAwsBucket] = useState('');

  const [doKey, setDoKey] = useState('');
  const [doSecret, setDoSecret] = useState('');
  const [doRegion, setDoRegion] = useState('nyc3');
  const [doBucket, setDoBucket] = useState('');

  const [wasabiKey, setWasabiKey] = useState('');
  const [wasabiSecret, setWasabiSecret] = useState('');
  const [wasabiRegion, setWasabiRegion] = useState('us-east-1');
  const [wasabiBucket, setWasabiBucket] = useState('');

  const [minioKey, setMinioKey] = useState('');
  const [minioSecret, setMinioSecret] = useState('');
  const [minioEndpoint, setMinioEndpoint] = useState('http://localhost:9000');
  const [minioBucket, setMinioBucket] = useState('');

  const handleSaveStorage = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onNotify(`Storage configuration updated to ${storageType.toUpperCase()} engine!`);
    }, 1000);
  };

  return (
    <div className="space-y-6" id="storage-settings-view">
      {/* Breadcrumbs */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Storage & Asset Delivery</span>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <HardDrive className="h-5.5 w-5.5 text-indigo-600" />
          <span>Storage Settings</span>
        </h2>
      </div>

      {/* Suggestion Info banner */}
      <div className="bg-slate-50 border border-slate-200/85 rounded-2xl p-4 md:p-5 space-y-2 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider">
          <Info className="h-4.5 w-4.5 text-indigo-600" />
          <span>Storage Engine Advice</span>
        </div>
        <ul className="space-y-1.5 list-disc pl-5 text-slate-500 font-semibold leading-relaxed">
          <li>
            <strong className="text-slate-800">Local (Default)</strong> means that the files you upload will be stored on your own server within the <code className="bg-slate-100 font-mono text-[10.5px] px-1.5 py-0.5 rounded text-indigo-600">public/user-uploads</code> directory.
          </li>
          <li>
            <strong className="text-slate-800">Suggestion:</strong> Consider using <span className="text-indigo-600">DigitalOcean Spaces</span>, <span className="text-indigo-600">AWS S3</span>, <span className="text-indigo-600">Wasabi</span> or <span className="text-indigo-600">Minio Storage</span> for an additional layer of security and high availability asset delivery.
          </li>
        </ul>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200/85 shadow-xs p-6 space-y-6">
        <form onSubmit={handleSaveStorage} className="space-y-6">
          
          {/* Select Storage Dropdown */}
          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>Select Storage</span>
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            </label>
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="local">Local (Default)</option>
              <option value="aws">AWS S3</option>
              <option value="digitalocean">DigitalOcean Spaces</option>
              <option value="wasabi">Wasabi</option>
              <option value="minio">Minio</option>
            </select>
          </div>

          {/* DYNAMIC FORMS BASED ON SELECTION */}
          {storageType === 'local' && (
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-xs text-emerald-800 font-semibold animate-fadeIn">
              <Check className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Current storage mode is local filesystem. Files will compile on the hosting disk space. No external credentials required.</span>
            </div>
          )}

          {storageType === 'aws' && (
            <div className="space-y-4 border-t border-slate-100 pt-5 animate-fadeIn">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="h-4 w-4" />
                <span>AWS S3 Credentials</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">AWS Key ID <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={awsKey}
                    onChange={(e) => setAwsKey(e.target.value)}
                    placeholder="e.g. AKIAIOSFODNN7EXAMPLE"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">AWS Secret Key <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    required
                    value={awsSecret}
                    onChange={(e) => setAwsSecret(e.target.value)}
                    placeholder="AWS Secret access key credentials"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">AWS Region <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={awsRegion}
                    onChange={(e) => setAwsRegion(e.target.value)}
                    placeholder="e.g. us-east-1"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">S3 Bucket Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={awsBucket}
                    onChange={(e) => setAwsBucket(e.target.value)}
                    placeholder="e.g. my-company-storage"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {storageType === 'digitalocean' && (
            <div className="space-y-4 border-t border-slate-100 pt-5 animate-fadeIn">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="h-4 w-4" />
                <span>DigitalOcean Spaces Credentials</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Spaces Access Key <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={doKey}
                    onChange={(e) => setDoKey(e.target.value)}
                    placeholder="DO Spaces API key"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Spaces Secret Key <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    required
                    value={doSecret}
                    onChange={(e) => setDoSecret(e.target.value)}
                    placeholder="DO Spaces Secret Key"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Spaces Region / Endpoint <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={doRegion}
                    onChange={(e) => setDoRegion(e.target.value)}
                    placeholder="e.g. nyc3 or sfo2"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Spaces Bucket/Storage Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={doBucket}
                    onChange={(e) => setDoBucket(e.target.value)}
                    placeholder="e.g. my-do-space"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {storageType === 'wasabi' && (
            <div className="space-y-4 border-t border-slate-100 pt-5 animate-fadeIn">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="h-4 w-4" />
                <span>Wasabi Hot Cloud Storage Credentials</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Wasabi Access Key <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={wasabiKey}
                    onChange={(e) => setWasabiKey(e.target.value)}
                    placeholder="Wasabi API Key ID"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Wasabi Secret Key <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    required
                    value={wasabiSecret}
                    onChange={(e) => setWasabiSecret(e.target.value)}
                    placeholder="Wasabi Secret Key credentials"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Wasabi Region <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={wasabiRegion}
                    onChange={(e) => setWasabiRegion(e.target.value)}
                    placeholder="e.g. us-east-1"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Wasabi Bucket Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={wasabiBucket}
                    onChange={(e) => setWasabiBucket(e.target.value)}
                    placeholder="e.g. wasabi-company-bucket"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {storageType === 'minio' && (
            <div className="space-y-4 border-t border-slate-100 pt-5 animate-fadeIn">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="h-4 w-4" />
                <span>Minio Storage Credentials</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Minio Access Key <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={minioKey}
                    onChange={(e) => setMinioKey(e.target.value)}
                    placeholder="Minio root username or Access Key"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Minio Secret Key <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    required
                    value={minioSecret}
                    onChange={(e) => setMinioSecret(e.target.value)}
                    placeholder="Minio root password or Secret Key"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Minio Endpoint URL <span className="text-rose-500">*</span></label>
                  <input
                    type="url"
                    required
                    value={minioEndpoint}
                    onChange={(e) => setMinioEndpoint(e.target.value)}
                    placeholder="e.g. http://localhost:9000"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Minio Bucket Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={minioBucket}
                    onChange={(e) => setMinioBucket(e.target.value)}
                    placeholder="e.g. minio-bucket"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Connecting Storage Service...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Storage Settings</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
