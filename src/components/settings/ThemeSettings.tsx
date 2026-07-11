import React, { useState, useRef } from 'react';
import { 
  Palette, Info, Save, HelpCircle, Check, Image as ImageIcon, 
  Upload, Trash2, Sliders, Laptop, User, Eye, ArrowUp, X, CheckCircle2, RotateCcw
} from 'lucide-react';

interface ThemeSettingsProps {
  onNotify: (message: string) => void;
}

export default function ThemeSettings({ onNotify }: ThemeSettingsProps) {
  // --- General Theme Settings ---
  const [appName, setAppName] = useState('Worksuite');
  const [brandingStyle, setBrandingStyle] = useState<'name' | 'logo'>('name');

  // --- Upload Assets States ---
  const [lightLogo, setLightLogo] = useState<string>('https://raw.githubusercontent.com/worksuite/worksuite/master/public/logo-square.png');
  const [darkLogo, setDarkLogo] = useState<string>('https://raw.githubusercontent.com/worksuite/worksuite/master/public/logo-square.png');
  const [loginBg, setLoginBg] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string>('https://raw.githubusercontent.com/worksuite/worksuite/master/public/logo-square.png');

  // Crop & Compression simulation
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [compressImage, setCompressImage] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // File Inputs references
  const lightLogoRef = useRef<HTMLInputElement>(null);
  const darkLogoRef = useRef<HTMLInputElement>(null);
  const loginBgRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  // --- Login Screen Color Settings ---
  const [loginBgColor, setLoginBgColor] = useState('#FFFFFF');
  const [loginBgOpacity, setLoginBgOpacity] = useState(100);
  const [loginTextColor, setLoginTextColor] = useState<'dark' | 'light'>('dark');

  // --- Public Pages Theme ---
  const [publicPrimary, setPublicPrimary] = useState('#1D82F5');
  const [publicTheme, setPublicTheme] = useState<'dark' | 'light'>('light');

  // --- Admin Panel Theme ---
  const [adminPrimary, setAdminPrimary] = useState('#1D82F5');
  const [adminSidebar, setAdminSidebar] = useState<'dark' | 'light'>('dark');
  const [adminHeader, setAdminHeader] = useState<'dark' | 'light'>('light');
  const [adminMenuStyle, setAdminMenuStyle] = useState<'expanded' | 'compact' | 'mini'>('expanded');
  const [adminBorderRadius, setAdminBorderRadius] = useState<number>(8);
  const [adminFontScale, setAdminFontScale] = useState<number>(13);
  const [adminAnimation, setAdminAnimation] = useState<boolean>(true);

  // --- Employee Panel Theme ---
  const [employeePrimary, setEmployeePrimary] = useState('#1D82F5');
  const [employeeSidebar, setEmployeeSidebar] = useState<'dark' | 'light'>('dark');
  const [employeeHeader, setEmployeeHeader] = useState<'dark' | 'light'>('light');
  const [employeeAccent, setEmployeeAccent] = useState('#EF4444');
  const [employeeBtnStyle, setEmployeeBtnStyle] = useState<'rounded' | 'sharp' | 'default'>('rounded');

  // --- Client Panel Theme ---
  const [clientPrimary, setClientPrimary] = useState('#1D82F5');
  const [clientSidebar, setClientSidebar] = useState<'dark' | 'light'>('dark');
  const [clientHeader, setClientHeader] = useState<'dark' | 'light'>('light');
  const [clientAccent, setClientAccent] = useState('#10B981');

  // --- Advanced Options ---
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoTheme, setAutoTheme] = useState(false);
  const [themeStart, setThemeStart] = useState('18:00');
  const [themeEnd, setThemeEnd] = useState('06:00');
  const [customCSS, setCustomCSS] = useState('/* Custom Global Style overrides */\nbody {\n  font-smooth: always;\n}');
  const [customJS, setCustomJS] = useState('// Custom Script Injection\nconsole.log("Worksuite script whitelisted.");');

  // --- Modals & Popups ---
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [autoSave, setAutoSave] = useState(false);

  // --- Drag & Drop handlers simulation ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const simulateUpload = (key: string, fileUrl: string) => {
    setUploadProgress(prev => ({ ...prev, [key]: 10 }));
    let progress = 10;
    const interval = setInterval(() => {
      progress += 30;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(prev => ({ ...prev, [key]: 100 }));
        setTimeout(() => {
          setUploadProgress(prev => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
          });
          if (key === 'light') setLightLogo(fileUrl);
          if (key === 'dark') setDarkLogo(fileUrl);
          if (key === 'bg') setLoginBg(fileUrl);
          if (key === 'favicon') setFavicon(fileUrl);
          onNotify(`${key.toUpperCase()} file uploaded successfully!`);
        }, 300);
      } else {
        setUploadProgress(prev => ({ ...prev, [key]: progress }));
      }
    }, 150);
  };

  const handleFileDrop = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      simulateUpload(key, url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      simulateUpload(key, url);
    }
  };

  const removeFile = (key: string) => {
    if (key === 'light') setLightLogo('');
    if (key === 'dark') setDarkLogo('');
    if (key === 'bg') setLoginBg(null);
    if (key === 'favicon') setFavicon('');
    onNotify(`${key.toUpperCase()} removed successfully.`);
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Theme parameters deployed successfully!');
  };

  const handleRestoreDefaults = () => {
    setAppName('Worksuite');
    setBrandingStyle('name');
    setLightLogo('https://raw.githubusercontent.com/worksuite/worksuite/master/public/logo-square.png');
    setDarkLogo('https://raw.githubusercontent.com/worksuite/worksuite/master/public/logo-square.png');
    setLoginBg(null);
    setFavicon('https://raw.githubusercontent.com/worksuite/worksuite/master/public/logo-square.png');
    setLoginBgColor('#FFFFFF');
    setLoginBgOpacity(100);
    setLoginTextColor('dark');
    setPublicPrimary('#1D82F5');
    setPublicTheme('light');
    setAdminPrimary('#1D82F5');
    setAdminSidebar('dark');
    setAdminHeader('light');
    setAdminMenuStyle('expanded');
    setAdminBorderRadius(8);
    setAdminFontScale(13);
    setAdminAnimation(true);
    setEmployeePrimary('#1D82F5');
    setEmployeeSidebar('dark');
    setEmployeeHeader('light');
    setEmployeeAccent('#EF4444');
    setEmployeeBtnStyle('rounded');
    setClientPrimary('#1D82F5');
    setClientSidebar('dark');
    setClientHeader('light');
    setClientAccent('#10B981');
    setDarkModeEnabled(false);
    setAutoTheme(false);
    onNotify('Theme styles rolled back to workspace default settings.');
  };

  return (
    <div className="space-y-6" id="theme-settings-container">
      {/* Breadcrumbs */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Personalization Settings</span>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Palette className="h-5.5 w-5.5 text-indigo-600" />
          <span>Theme Settings</span>
        </h2>
      </div>

      {/* Main Grid: Left Config Panel, Right Live Preview Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* CONFIG COLUMN: Left 2 columns on wide screens */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            
            {/* SECTION 1: General Theme Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-4 w-4" />
                <span>General Theme Options</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">App Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-700"
                    placeholder="e.g., Worksuite"
                  />
                </div>

                {/* Branding Style Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Select Branding Style <span className="text-rose-500">*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBrandingStyle('name')}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        brandingStyle === 'name' 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-600/10' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="font-extrabold text-[11px]">Sidebar with Name</span>
                      <span className="text-[9px] text-slate-400 font-medium">Text layout</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrandingStyle('logo')}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        brandingStyle === 'logo' 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-600/10' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="font-extrabold text-[11px]">Sidebar with Logo</span>
                      <span className="text-[9px] text-slate-400 font-medium">Image layout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Logo Upload Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Logo Assets Upload</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Light Mode Logo */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Light Mode Logo</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </label>
                  
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleFileDrop(e, 'light')}
                    className="border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 text-center relative min-h-[140px]"
                  >
                    {uploadProgress['light'] !== undefined ? (
                      <div className="w-full max-w-[120px] space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold">Uploading {uploadProgress['light']}%</span>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-full transition-all" style={{ width: `${uploadProgress['light']}%` }} />
                        </div>
                      </div>
                    ) : lightLogo ? (
                      <div className="space-y-3">
                        <img src={lightLogo} alt="Light Mode Logo Preview" className="h-10 object-contain mx-auto mix-blend-multiply" referrerPolicy="no-referrer" />
                        <div className="flex gap-1.5 justify-center">
                          <button
                            type="button"
                            onClick={() => lightLogoRef.current?.click()}
                            className="bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile('light')}
                            className="bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-rose-100 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 cursor-pointer" onClick={() => lightLogoRef.current?.click()}>
                        <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                        <p className="text-[11px] font-bold text-slate-600">Drag & Drop or Browse</p>
                        <p className="text-[9px] text-slate-400">PNG • SVG • WEBP (Max 2MB)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={lightLogoRef} 
                      onChange={(e) => handleFileChange(e, 'light')} 
                      accept="image/png, image/svg+xml, image/webp" 
                      className="hidden" 
                    />
                  </div>
                </div>

                {/* Dark Mode Logo */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Dark Mode Logo</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </label>
                  
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleFileDrop(e, 'dark')}
                    className="border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors rounded-xl p-4 flex flex-col items-center justify-center bg-slate-850 text-center relative min-h-[140px]"
                  >
                    {uploadProgress['dark'] !== undefined ? (
                      <div className="w-full max-w-[120px] space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold">Uploading {uploadProgress['dark']}%</span>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-400 h-full transition-all" style={{ width: `${uploadProgress['dark']}%` }} />
                        </div>
                      </div>
                    ) : darkLogo ? (
                      <div className="space-y-3">
                        <img src={darkLogo} alt="Dark Mode Logo Preview" className="h-10 object-contain mx-auto brightness-95 invert-0" referrerPolicy="no-referrer" />
                        <div className="flex gap-1.5 justify-center">
                          <button
                            type="button"
                            onClick={() => darkLogoRef.current?.click()}
                            className="bg-white/90 border border-slate-200 text-slate-700 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-white cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile('dark')}
                            className="bg-rose-500/85 text-white border border-rose-500 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-rose-600 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 cursor-pointer" onClick={() => darkLogoRef.current?.click()}>
                        <Upload className="h-5 w-5 text-slate-300 mx-auto" />
                        <p className="text-[11px] font-bold text-slate-200">Drag & Drop or Browse</p>
                        <p className="text-[9px] text-slate-400">PNG • SVG • WEBP (Max 2MB)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={darkLogoRef} 
                      onChange={(e) => handleFileChange(e, 'dark')} 
                      accept="image/png, image/svg+xml, image/webp" 
                      className="hidden" 
                    />
                  </div>
                </div>

                {/* Login Background Image */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Login Background Image</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </label>
                  
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleFileDrop(e, 'bg')}
                    className="border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 text-center relative min-h-[140px]"
                  >
                    {uploadProgress['bg'] !== undefined ? (
                      <div className="w-full max-w-[120px] space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold">Uploading {uploadProgress['bg']}%</span>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-full transition-all" style={{ width: `${uploadProgress['bg']}%` }} />
                        </div>
                      </div>
                    ) : loginBg ? (
                      <div className="space-y-3 w-full">
                        <div className="relative h-14 rounded overflow-hidden max-w-[200px] mx-auto border border-slate-200">
                          <img src={loginBg} alt="Login Background" className="h-full w-full object-cover scale-[1.3]" style={{ transform: `scale(${cropZoom})` }} referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-2">
                          {/* Simulated Crop Slider */}
                          <div className="flex items-center gap-2 justify-center max-w-[160px] mx-auto">
                            <span className="text-[8px] text-slate-400 font-bold uppercase">Crop Zoom</span>
                            <input 
                              type="range" 
                              min="1" 
                              max="3" 
                              step="0.1" 
                              value={cropZoom} 
                              onChange={(e) => setCropZoom(parseFloat(e.target.value))} 
                              className="h-1 accent-indigo-600 w-16" 
                            />
                          </div>
                          
                          <div className="flex gap-1.5 justify-center">
                            <button
                              type="button"
                              onClick={() => loginBgRef.current?.click()}
                              className="bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFile('bg')}
                              className="bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-rose-100 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 cursor-pointer" onClick={() => loginBgRef.current?.click()}>
                        <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                        <p className="text-[11px] font-bold text-slate-600">Drag & Drop Background</p>
                        <p className="text-[9px] text-slate-400">JPG • WEBP (Max 5MB)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={loginBgRef} 
                      onChange={(e) => handleFileChange(e, 'bg')} 
                      accept="image/jpeg, image/webp" 
                      className="hidden" 
                    />
                  </div>
                  {/* Compression checkbox */}
                  <label className="flex items-center gap-2 pt-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={compressImage} 
                      onChange={() => setCompressImage(!compressImage)} 
                      className="h-4 w-4 text-indigo-600 rounded border-slate-300" 
                    />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Enable Image Compression for cold starts</span>
                  </label>
                </div>

                {/* Favicon Card */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Favicon (Tab Icon)</span>
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                  </label>
                  
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleFileDrop(e, 'favicon')}
                    className="border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 text-center relative min-h-[140px]"
                  >
                    {uploadProgress['favicon'] !== undefined ? (
                      <div className="w-full max-w-[120px] space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold">Uploading {uploadProgress['favicon']}%</span>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-full transition-all" style={{ width: `${uploadProgress['favicon']}%` }} />
                        </div>
                      </div>
                    ) : favicon ? (
                      <div className="space-y-3">
                        <div className="flex gap-3 items-center justify-center">
                          <img src={favicon} alt="favicon" className="h-4 w-4 object-contain" referrerPolicy="no-referrer" />
                          <img src={favicon} alt="favicon" className="h-6 w-6 object-contain" referrerPolicy="no-referrer" />
                          <img src={favicon} alt="favicon" className="h-8 w-8 object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold block">16x16 • 32x32 • 64x64 renders</span>
                        <div className="flex gap-1.5 justify-center">
                          <button
                            type="button"
                            onClick={() => faviconRef.current?.click()}
                            className="bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile('favicon')}
                            className="bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-rose-100 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 cursor-pointer" onClick={() => faviconRef.current?.click()}>
                        <Upload className="h-5 w-5 text-slate-400 mx-auto" />
                        <p className="text-[11px] font-bold text-slate-600">Drag & Drop Favicon</p>
                        <p className="text-[9px] text-slate-400">ICO • PNG (Max 512kb)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={faviconRef} 
                      onChange={(e) => handleFileChange(e, 'favicon')} 
                      accept="image/png, image/x-icon" 
                      className="hidden" 
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 3: Login Screen Logo Color Settings */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Login Screen Theme Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Background color */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Login Screen Logo's Background Color <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={loginBgColor} 
                      onChange={(e) => setLoginBgColor(e.target.value)} 
                      className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer bg-transparent" 
                    />
                    <input 
                      type="text" 
                      maxLength={7}
                      value={loginBgColor.toUpperCase()} 
                      onChange={(e) => setLoginBgColor(e.target.value)} 
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-700 uppercase" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setLoginBgColor('#FFFFFF')} 
                      className="text-xs text-slate-400 hover:text-slate-700 font-bold border border-slate-200 p-2 rounded-lg"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Logo Text Color radio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Login Screen Logo's Text Color</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 h-10 items-center">
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="login-text-color" 
                        checked={loginTextColor === 'dark'} 
                        onChange={() => setLoginTextColor('dark')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Dark</span>
                    </label>
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="login-text-color" 
                        checked={loginTextColor === 'light'} 
                        onChange={() => setLoginTextColor('light')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Light</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark mode banner warning */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex gap-2.5 items-center text-xs font-semibold text-slate-500">
              <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
              <span>Theme color settings will not work when Dark Mode is active.</span>
            </div>

            {/* SECTION 4: Public Pages Theme */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Public Pages Theme</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Primary Color <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={publicPrimary} 
                      onChange={(e) => setPublicPrimary(e.target.value)} 
                      className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer bg-transparent" 
                    />
                    <input 
                      type="text" 
                      maxLength={7}
                      value={publicPrimary.toUpperCase()} 
                      onChange={(e) => setPublicPrimary(e.target.value)} 
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-700 uppercase" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Public Pages Theme Mode</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 h-10 items-center">
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="public-mode" 
                        checked={publicTheme === 'light'} 
                        onChange={() => setPublicTheme('light')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Light</span>
                    </label>
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="public-mode" 
                        checked={publicTheme === 'dark'} 
                        onChange={() => setPublicTheme('dark')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Dark</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: Admin Panel Theme */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Admin Panel Theme</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Primary Color <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={adminPrimary} 
                      onChange={(e) => setAdminPrimary(e.target.value)} 
                      className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer bg-transparent" 
                    />
                    <input 
                      type="text" 
                      maxLength={7}
                      value={adminPrimary.toUpperCase()} 
                      onChange={(e) => setAdminPrimary(e.target.value)} 
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-700 uppercase" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Sidebar Theme</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 h-10 items-center">
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="admin-sidebar" 
                        checked={adminSidebar === 'dark'} 
                        onChange={() => setAdminSidebar('dark')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Dark</span>
                    </label>
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="admin-sidebar" 
                        checked={adminSidebar === 'light'} 
                        onChange={() => setAdminSidebar('light')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Light</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Advanced admin visual factors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Border Radius (SaaS Style)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="16" 
                      value={adminBorderRadius} 
                      onChange={(e) => setAdminBorderRadius(parseInt(e.target.value))} 
                      className="w-full accent-indigo-600" 
                    />
                    <span className="text-xs font-bold text-slate-500 w-8 text-right">{adminBorderRadius}px</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Font Scale (Accessibility)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" 
                      min="11" 
                      max="16" 
                      value={adminFontScale} 
                      onChange={(e) => setAdminFontScale(parseInt(e.target.value))} 
                      className="w-full accent-indigo-600" 
                    />
                    <span className="text-xs font-bold text-slate-500 w-8 text-right">{adminFontScale}px</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Transitions & Animation</label>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                    <span className="text-xs font-semibold text-slate-700">Render Motion</span>
                    <input 
                      type="checkbox" 
                      checked={adminAnimation} 
                      onChange={() => setAdminAnimation(!adminAnimation)} 
                      className="h-4 w-4 text-indigo-600 rounded" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6: Employee Panel Theme */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Employee Panel Theme</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Primary Color <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={employeePrimary} 
                      onChange={(e) => setEmployeePrimary(e.target.value)} 
                      className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer bg-transparent" 
                    />
                    <input 
                      type="text" 
                      maxLength={7}
                      value={employeePrimary.toUpperCase()} 
                      onChange={(e) => setEmployeePrimary(e.target.value)} 
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-700 uppercase" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Sidebar Theme</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 h-10 items-center">
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="employee-sidebar" 
                        checked={employeeSidebar === 'dark'} 
                        onChange={() => setEmployeeSidebar('dark')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Dark</span>
                    </label>
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="employee-sidebar" 
                        checked={employeeSidebar === 'light'} 
                        onChange={() => setEmployeeSidebar('light')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Light</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 7: Client Panel Theme */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Client Panel Theme</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Primary Color <span className="text-rose-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={clientPrimary} 
                      onChange={(e) => setClientPrimary(e.target.value)} 
                      className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer bg-transparent" 
                    />
                    <input 
                      type="text" 
                      maxLength={7}
                      value={clientPrimary.toUpperCase()} 
                      onChange={(e) => setClientPrimary(e.target.value)} 
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-700 uppercase" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Sidebar Theme</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 h-10 items-center">
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="client-sidebar" 
                        checked={clientSidebar === 'dark'} 
                        onChange={() => setClientSidebar('dark')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Dark</span>
                    </label>
                    <label className="flex items-center gap-2 justify-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="client-sidebar" 
                        checked={clientSidebar === 'light'} 
                        onChange={() => setClientSidebar('light')} 
                        className="h-4 w-4 text-indigo-600 border-slate-300" 
                      />
                      <span className="text-xs font-bold text-slate-700">Light</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 8: Advanced Theme Options */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Advanced Styles & Code Injectors</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Enable Dark Mode</span>
                    <span className="text-[10px] text-slate-400 font-medium block">Sets deep dark canvas across entire portal views.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDarkModeEnabled(!darkModeEnabled)}
                    className="cursor-pointer"
                  >
                    <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${darkModeEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${darkModeEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Auto Theme (Time Scheduler)</span>
                    <span className="text-[10px] text-slate-400 font-medium block">Switches to dark canvas during evening periods.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoTheme(!autoTheme)}
                    className="cursor-pointer"
                  >
                    <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${autoTheme ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${autoTheme ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </button>
                </div>
              </div>

              {autoTheme && (
                <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-150 text-xs font-bold animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-slate-600">Start Time (Dark)</span>
                    <input 
                      type="time" 
                      value={themeStart} 
                      onChange={(e) => setThemeStart(e.target.value)} 
                      className="w-full bg-white border border-slate-200 p-2 rounded" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-600">End Time (Light)</span>
                    <input 
                      type="time" 
                      value={themeEnd} 
                      onChange={(e) => setThemeEnd(e.target.value)} 
                      className="w-full bg-white border border-slate-200 p-2 rounded" 
                    />
                  </div>
                </div>
              )}

              {/* Custom CSS Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Custom CSS Stylesheet override</label>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-900 font-mono text-xs text-emerald-400">
                  <div className="bg-slate-800 px-3 py-1 text-[10px] text-slate-400 font-bold border-b border-slate-700 uppercase">Style Injector CSS</div>
                  <textarea
                    rows={4}
                    value={customCSS}
                    onChange={(e) => setCustomCSS(e.target.value)}
                    className="w-full bg-transparent p-3 outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Custom JS */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Custom JavaScript (Header/Footer Injection)</label>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-900 font-mono text-xs text-indigo-300">
                  <div className="bg-slate-800 px-3 py-1 text-[10px] text-slate-400 font-bold border-b border-slate-700 uppercase">Script Injector JS</div>
                  <textarea
                    rows={4}
                    value={customJS}
                    onChange={(e) => setCustomJS(e.target.value)}
                    className="w-full bg-transparent p-3 outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Import/Export actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onNotify('Theme configuration JSON string copied to clipboard!')}
                  className="bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs px-3.5 py-2 border border-slate-200 rounded-lg shadow-3xs cursor-pointer"
                >
                  Export Theme JSON
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const str = prompt('Paste your Worksuite Theme settings JSON here:');
                    if (str) {
                      onNotify('Theme JSON injected and compiled successfully!');
                    }
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs px-3.5 py-2 border border-slate-200 rounded-lg shadow-3xs cursor-pointer"
                >
                  Import Theme JSON
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* LIVE PREVIEW COLUMN: Right column sticky preview */}
        <div className="space-y-6 xl:sticky xl:top-6">
          <div className="bg-slate-900 rounded-2xl p-5 shadow-md border border-slate-800 text-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase text-indigo-400 font-black tracking-widest flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>Live Dashboard Mock</span>
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded uppercase">Responsive</span>
            </div>

            {/* Simulated Live Preview Card */}
            <div 
              className="rounded-xl border shadow-sm overflow-hidden font-sans text-left transition-all duration-300 select-none bg-slate-950"
              style={{ 
                borderColor: adminPrimary,
                fontSize: `${adminFontScale}px`
              }}
            >
              
              {/* Top Titlebar */}
              <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 shrink-0" style={{ color: adminPrimary }} />
                  <span className="font-extrabold text-[11px] text-slate-200">{appName} Workspace</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                </div>
              </div>

              {/* Main inner block: Side & Content */}
              <div className="flex min-h-[220px]">
                
                {/* Sidebar Mock */}
                <div 
                  className={`w-[75px] shrink-0 border-r border-slate-800/80 p-2 space-y-3 transition-colors ${
                    adminSidebar === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-700 border-r border-slate-200'
                  }`}
                >
                  {/* Sidebar Header branding style check */}
                  {brandingStyle === 'name' ? (
                    <div className="text-[8px] font-black tracking-tighter truncate text-center uppercase" style={{ color: adminPrimary }}>
                      {appName}
                    </div>
                  ) : (
                    <img src={lightLogo} alt="icon" className="h-5 w-5 object-contain mx-auto mix-blend-multiply" referrerPolicy="no-referrer" />
                  )}

                  {/* Sidebar links */}
                  <div className="space-y-1.5">
                    {[
                      { l: 'Dashboard', act: true },
                      { l: 'Projects', act: false },
                      { l: 'Leads', act: false },
                      { l: 'HR & Work', act: false }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className={`p-1.5 rounded text-[8px] font-black truncate text-center ${
                          item.act 
                            ? 'text-white' 
                            : 'opacity-50 hover:opacity-100'
                        }`}
                        style={{ 
                          backgroundColor: item.act ? adminPrimary : 'transparent',
                          borderRadius: `${adminBorderRadius}px`
                        }}
                      >
                        {item.l}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Area Mock */}
                <div className="flex-1 bg-slate-950 p-3 space-y-3 text-[10px] text-slate-300">
                  
                  {/* Top content header */}
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-800/80">
                    <span className="font-bold text-[10px]">Dashboard</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800 font-bold">Standard</span>
                  </div>

                  {/* Boxes */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 p-2 rounded border border-slate-800/80 space-y-1" style={{ borderRadius: `${adminBorderRadius}px` }}>
                      <span className="text-[8px] text-slate-500 font-bold block">ACTIVE LEADS</span>
                      <span className="text-sm font-extrabold text-slate-100" style={{ color: adminPrimary }}>124</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800/80 space-y-1" style={{ borderRadius: `${adminBorderRadius}px` }}>
                      <span className="text-[8px] text-slate-500 font-bold block">PROJECTS</span>
                      <span className="text-sm font-extrabold text-slate-100">18</span>
                    </div>
                  </div>

                  {/* Actions buttons style preview */}
                  <div className="pt-1.5 flex gap-1.5">
                    <span 
                      className="px-2.5 py-1 text-[8px] font-black text-white"
                      style={{ 
                        backgroundColor: adminPrimary,
                        borderRadius: `${adminBorderRadius}px`
                      }}
                    >
                      Active Button
                    </span>
                    <span 
                      className="px-2 px-2.5 py-1 text-[8px] font-bold bg-slate-800 text-slate-400"
                      style={{ 
                        borderRadius: `${adminBorderRadius}px`
                      }}
                    >
                      Cancel
                    </span>
                  </div>

                </div>

              </div>

            </div>

            <div className="text-[10px] text-slate-400 leading-normal">
              <p className="font-bold text-slate-300">Live Custom Workspace Compiler</p>
              <p className="mt-1">All changes made inside the color inputs or style sliders are calculated instantly and rendered in this interactive portal layout.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Save Actions Footer */}
      <div className="sticky bottom-0 bg-white border border-slate-200 rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-35 animate-slideUp">
        <div className="flex items-center gap-2.5">
          <Palette className="h-5 w-5 text-indigo-600" />
          <span className="text-xs font-bold text-slate-600">Pending style modifications are buffered.</span>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex-1 sm:flex-none text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 font-extrabold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all"
          >
            Restore Defaults
          </button>
          <button
            type="button"
            onClick={() => {
              onNotify('Workspace theme settings reset successfully.');
            }}
            className="flex-1 sm:flex-none text-rose-600 hover:bg-rose-50 border border-rose-150 font-extrabold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSaveTheme}
            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Save Theme Settings</span>
          </button>
        </div>
      </div>

    </div>
  );
}
