import React, { useState } from 'react';
import { Save, HelpCircle, Eye, EyeOff, Upload, Calendar, RefreshCcw, Lock } from 'lucide-react';

interface ProfileSettingsProps {
  onNotify: (message: string) => void;
}

export default function ProfileSettings({ onNotify }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'emergency' | 'docs'>('profile');

  // Form states
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [nameSalutation, setNameSalutation] = useState('--');
  const [fullName, setFullName] = useState('Addie Pacocha');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState<'enable' | 'disable'>('enable');
  const [googleCalendar, setGoogleCalendar] = useState<'yes' | 'no'>('no');
  const [country, setCountry] = useState('IN');
  const [mobileCode, setMobileCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('1234567890');
  const [language, setLanguage] = useState('English');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('1995-04-12');
  const [slackId, setSlackId] = useState('addie.p');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [address, setAddress] = useState('132, My Street, Kingston, NY 12401');
  const [about, setAbout] = useState('Worksuite Platform Administrator.');

  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let newPass = '';
    for (let i = 0; i < 12; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
    setShowPassword(true);
    onNotify('Secure password generated!');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Profile Details updated successfully!');
  };

  return (
    <div className="space-y-6" id="profile-settings-root">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • Settings • Profile Settings
        </div>
        <h2 className="text-xl font-bold text-slate-800">Profile Settings</h2>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1.5 scrollbar-thin">
        {[
          { key: 'profile', label: 'Profile' },
          { key: 'emergency', label: 'Emergency Contacts' },
          { key: 'docs', label: 'Documents' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-xs font-bold -mb-px border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card Body */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-4xl">
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-6 animate-fadeIn">
            
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
              <div className="relative group w-20 h-20 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-3xs">
                {profilePic ? (
                  <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-[20px] font-bold text-slate-500">AP</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Upload className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left space-y-1">
                <p className="text-xs font-bold text-slate-800">Profile Picture</p>
                <p className="text-[11px] text-slate-450">Drag and drop file or click upload. Format JPG, PNG. Max 2MB.</p>
                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePic('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60');
                      onNotify('Profile picture changed!');
                    }}
                    className="text-xs font-bold text-indigo-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg cursor-pointer shadow-3xs"
                  >
                    Change Picture
                  </button>
                  {profilePic && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePic(null);
                        onNotify('Picture removed.');
                      }}
                      className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Your Name</label>
                <div className="flex gap-2">
                  <select
                    className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-20 shrink-0"
                    value={nameSalutation}
                    onChange={(e) => setNameSalutation(e.target.value)}
                  >
                    <option value="--">--</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Your Email *</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Your Password</label>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pr-10 text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    title="Generate Password"
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2.5 border border-indigo-200 rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Leave blank to keep the current password.</p>
              </div>

              {/* Receive email notifications? */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Receive email notifications?</label>
                <div className="flex gap-4 p-2">
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="emailNotifs"
                      checked={emailNotifs === 'enable'}
                      onChange={() => setEmailNotifs('enable')}
                      className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>Enable</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="emailNotifs"
                      checked={emailNotifs === 'disable'}
                      onChange={() => setEmailNotifs('disable')}
                      className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>Disable</span>
                  </label>
                </div>
              </div>

              {/* Enable Google Calendar */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Enable Google Calendar</label>
                <div className="flex gap-4 p-2">
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="googleCalendar"
                      checked={googleCalendar === 'yes'}
                      onChange={() => setGoogleCalendar('yes')}
                      className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="googleCalendar"
                      checked={googleCalendar === 'no'}
                      onChange={() => setGoogleCalendar('no')}
                      className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Country</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="US">🇺🇸 United States</option>
                  <option value="IN">🇮🇳 India</option>
                  <option value="GB">🇬🇧 United Kingdom</option>
                  <option value="AE">🇦🇪 United Arab Emirates</option>
                </select>
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Mobile</label>
                <div className="flex gap-2">
                  <select
                    className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer w-24 shrink-0"
                    value={mobileCode}
                    onChange={(e) => setMobileCode(e.target.value)}
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+971">+971 (UAE)</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="e.g. 1234567890"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Change Language */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Change Language</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="English">🇺🇸 English</option>
                  <option value="Spanish">🇪🇸 Spanish</option>
                  <option value="French">🇫🇷 French</option>
                </select>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Gender</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Date of Birth</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>

              {/* Slack Member ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Slack Member ID</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">@</span>
                  <input
                    type="text"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pl-8 text-xs font-medium focus:outline-none focus:border-indigo-500"
                    placeholder="member.username"
                    value={slackId}
                    onChange={(e) => setSlackId(e.target.value)}
                  />
                </div>
              </div>

              {/* Marital Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Marital Status</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
            </div>

            {/* Textareas */}
            <div className="grid grid-cols-1 gap-5 border-t border-slate-150 pt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Your Address</label>
                <textarea
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">About</label>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-start pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'emergency' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Emergency Contacts</h3>
              <button
                type="button"
                onClick={() => onNotify('Emergency Contact Modal coming soon!')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                + Add Contact
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-400 text-[10px] uppercase font-bold">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Relationship</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                  <tr>
                    <td className="px-4 py-3.5 text-slate-800">John Doe</td>
                    <td className="px-4 py-3.5">Brother</td>
                    <td className="px-4 py-3.5 font-mono">+1 (555) 321-9876</td>
                    <td className="px-4 py-3.5 text-slate-400">123, Maple Road, Seattle, WA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Documents</h3>
              <button
                type="button"
                onClick={() => onNotify('Document Upload Modal coming soon!')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                + Upload Document
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-400 text-[10px] uppercase font-bold">
                    <th className="px-4 py-3">Document Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                  <tr>
                    <td className="px-4 py-3.5 text-slate-800">Identity_Card_US.pdf</td>
                    <td className="px-4 py-3.5">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 border border-emerald-100 rounded-full text-[10px] font-bold">Verified</span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-indigo-600 cursor-pointer hover:underline">Download</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
