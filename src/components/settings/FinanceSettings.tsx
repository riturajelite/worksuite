import React, { useState } from 'react';
import { Save, Info, Plus, X, Edit, Trash2, Check, Upload, CheckCircle2 } from 'lucide-react';

interface UnitType {
  id: number;
  name: string;
}

interface PaymentDetail {
  id: number;
  title: string;
  description: string;
  qrCodeUrl: string | null;
}

interface FinanceSettingsProps {
  onNotify: (message: string) => void;
}

export default function FinanceSettings({ onNotify }: FinanceSettingsProps) {
  const [activeTab, setActiveTab] = useState<'invoice' | 'template' | 'prefix' | 'units' | 'quickbooks' | 'payment' | 'estimate'>('invoice');

  // Tab 1: Invoice Settings States
  const [invoiceLogo, setInvoiceLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [invoiceLang, setInvoiceLang] = useState('English');
  const [dueAfter, setDueAfter] = useState('30');
  const [sendReminderBefore, setSendReminderBefore] = useState('3');
  const [sendReminderAfter, setSendReminderAfter] = useState('3');
  const [showTaxNum, setShowTaxNum] = useState(true);
  const [showHsnSac, setShowHsnSac] = useState(false);
  const [showTaxMessage, setShowTaxMessage] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [showSignatory, setShowSignatory] = useState(true);
  // Client Info States
  const [clientName, setClientName] = useState(true);
  const [clientEmail, setClientEmail] = useState(true);
  const [clientPhone, setClientPhone] = useState(true);
  const [clientCompany, setClientCompany] = useState(true);
  const [clientAddress, setClientAddress] = useState(true);
  const [showProject, setShowProject] = useState(false);
  const [terms, setTerms] = useState('Thank you for your business. Invoice is due within the stipulated period.');
  const [otherInfo, setOtherInfo] = useState('Make all checks payable to Worksuite.');

  // Tab 2: Invoice Template
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const TEMPLATES = [
    { id: 'classic', name: 'Classic Minimalist', desc: 'Sleek corporate identity layout', color: 'bg-slate-850' },
    { id: 'modern', name: 'Modern Indigo', desc: 'Symmetric headings with color accents', color: 'bg-indigo-650' },
    { id: 'creative', name: 'Creative Coral', desc: 'Left column accent colored template', color: 'bg-rose-500' },
    { id: 'editorial', name: 'Elegant Editorial', desc: 'Serif display typography with clean grids', color: 'bg-amber-600' },
    { id: 'compact', name: 'Compact Dense', desc: 'No margins grid for multiple item pages', color: 'bg-emerald-600' },
  ];

  // Tab 3: Prefix Settings States
  const [invPrefix, setInvPrefix] = useState('INV');
  const [invSep, setInvSep] = useState('#');
  const [invDigits, setInvDigits] = useState('5');

  const [cnPrefix, setCnPrefix] = useState('CN');
  const [cnSep, setCnSep] = useState('#');
  const [cnDigits, setCnDigits] = useState('5');

  const [estPrefix, setEstPrefix] = useState('EST');
  const [estSep, setEstSep] = useState('#');
  const [estDigits, setEstDigits] = useState('5');

  const [ordPrefix, setOrdPrefix] = useState('ORD');
  const [ordSep, setOrdSep] = useState('#');
  const [ordDigits, setOrdDigits] = useState('5');

  // Tab 4: Units States
  const [units, setUnits] = useState<UnitType[]>([
    { id: 1, name: 'Pcs' },
    { id: 2, name: 'Hrs' },
    { id: 3, name: 'Box' },
  ]);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [unitInput, setUnitInput] = useState('');

  // Tab 5: Quickbooks States
  const [qbStatus, setQbStatus] = useState(false);
  const [qbClientId, setQbClientId] = useState('');
  const [qbClientSecret, setQbClientSecret] = useState('');

  // Tab 6: Invoice Payment Details States
  const [payments, setPayments] = useState<PaymentDetail[]>([
    { id: 1, title: 'Bank Transfer (USD)', description: 'Routing: 123456789. Account: 987654321.', qrCodeUrl: null }
  ]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState('');
  const [paymentDesc, setPaymentDesc] = useState('');
  const [paymentQR, setPaymentQR] = useState<string | null>(null);

  // Tab 7: Estimate Terms States
  const [estimateTerms, setEstimateTerms] = useState('Estimate is valid for 30 days from date of issuance.');

  // Handler Actions
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Invoice settings updated successfully!');
  };

  const handleSavePrefix = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Prefix parameters saved.');
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitInput.trim()) return;
    setUnits(prev => [...prev, { id: Date.now(), name: unitInput.trim() }]);
    setUnitInput('');
    setShowUnitModal(false);
    onNotify('New invoice unit added!');
  };

  const handleDeleteUnit = (id: number) => {
    setUnits(prev => prev.filter(u => u.id !== id));
    onNotify('Unit removed.');
  };

  const handleSaveQB = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Quickbooks Sync configuration updated.');
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTitle) return;
    const newPay: PaymentDetail = {
      id: Date.now(),
      title: paymentTitle,
      description: paymentDesc,
      qrCodeUrl: paymentQR,
    };
    setPayments(prev => [...prev, newPay]);
    setPaymentTitle('');
    setPaymentDesc('');
    setPaymentQR(null);
    setShowPaymentModal(false);
    onNotify('Payment details registered!');
  };

  const handleDeletePayment = (id: number) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    onNotify('Payment detail removed.');
  };

  const generateExample = (prefix: string, sep: string, digits: string) => {
    const pad = '0'.repeat(Math.max(1, Number(digits) - 1)) + '1';
    return `${prefix}${sep}${pad}`;
  };

  return (
    <div className="space-y-6" id="finance-settings-root">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • Settings • Finance Settings
        </div>
        <h2 className="text-xl font-bold text-slate-800">Finance Settings</h2>
      </div>

      {/* Tabs list */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1.5 scrollbar-thin">
        {[
          { key: 'invoice', label: 'Invoice Settings' },
          { key: 'template', label: 'Invoice Template' },
          { key: 'prefix', label: 'Prefix Settings' },
          { key: 'units', label: 'Units' },
          { key: 'quickbooks', label: 'Quickbooks' },
          { key: 'payment', label: 'Payment Details' },
          { key: 'estimate', label: 'Estimate Settings' },
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

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-4xl">
        
        {/* TAB 1: Invoice Settings */}
        {activeTab === 'invoice' && (
          <form onSubmit={handleSaveInvoice} className="space-y-6 animate-fadeIn">
            {/* Logo grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Invoice Logo */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Invoice Logo</label>
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-16 h-16 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-lg text-slate-300">
                    {invoiceLogo ? <img src={invoiceLogo} alt="Invoice Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" /> : 'LOGO'}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setInvoiceLogo('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60'); onNotify('Invoice logo set!'); }}
                    className="text-[10px] font-bold text-indigo-600 bg-white border border-slate-200 px-2.5 py-1 rounded cursor-pointer hover:bg-slate-50"
                  >
                    Change Logo
                  </button>
                </div>
              </div>

              {/* Authorised Signature */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Authorised Signatory Signature</label>
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-2">
                  <div className="w-32 h-16 rounded bg-white border border-slate-200 flex items-center justify-center italic text-xs text-slate-300 font-serif">
                    {signature ? <img src={signature} alt="Signature" className="w-full h-full object-contain" referrerPolicy="no-referrer" /> : 'Signature Box'}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSignature('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=150&auto=format&fit=crop&q=60'); onNotify('Authorized signature set!'); }}
                    className="text-[10px] font-bold text-indigo-600 bg-white border border-slate-200 px-2.5 py-1 rounded cursor-pointer hover:bg-slate-50"
                  >
                    Set Signature
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-150 pt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Language</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none"
                  value={invoiceLang}
                  onChange={(e) => setInvoiceLang(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Due after *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pr-16 text-xs font-bold focus:outline-none"
                    value={dueAfter}
                    onChange={(e) => setDueAfter(e.target.value)}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Day(s)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Send Reminder Before</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pr-16 text-xs font-bold focus:outline-none"
                    value={sendReminderBefore}
                    onChange={(e) => setSendReminderBefore(e.target.value)}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Day(s)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Send Reminder After</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pr-16 text-xs font-bold focus:outline-none"
                    value={sendReminderAfter}
                    onChange={(e) => setSendReminderAfter(e.target.value)}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Day(s)</span>
                </div>
              </div>
            </div>

            {/* Checkbox triggers */}
            <div className="border-t border-slate-150 pt-5 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800">Layout Switches</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded hover:bg-slate-50 select-none">
                  <input type="checkbox" className="h-4.5 w-4.5 rounded text-indigo-600" checked={showTaxNum} onChange={(e) => setShowTaxNum(e.target.checked)} />
                  <span className="text-xs text-slate-700 font-semibold">Show Tax number on invoice</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded hover:bg-slate-50 select-none">
                  <input type="checkbox" className="h-4.5 w-4.5 rounded text-indigo-600" checked={showHsnSac} onChange={(e) => setShowHsnSac(e.target.checked)} />
                  <span className="text-xs text-slate-700 font-semibold">Hsn/Sac Code Show</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded hover:bg-slate-50 select-none">
                  <input type="checkbox" className="h-4.5 w-4.5 rounded text-indigo-600" checked={showTaxMessage} onChange={(e) => setShowTaxMessage(e.target.checked)} />
                  <span className="text-xs text-slate-700 font-semibold">Show tax calculation message</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded hover:bg-slate-50 select-none">
                  <input type="checkbox" className="h-4.5 w-4.5 rounded text-indigo-600" checked={showStatus} onChange={(e) => setShowStatus(e.target.checked)} />
                  <span className="text-xs text-slate-700 font-semibold">Show Status</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded hover:bg-slate-50 select-none">
                  <input type="checkbox" className="h-4.5 w-4.5 rounded text-indigo-600" checked={showSignatory} onChange={(e) => setShowSignatory(e.target.checked)} />
                  <span className="text-xs text-slate-700 font-semibold">Show Authorised Signatory</span>
                </label>
              </div>
            </div>

            {/* Client Info subheading checkboxes */}
            <div className="border-t border-slate-150 pt-5 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800">Client info to show on invoice</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded text-indigo-600" checked={clientName} onChange={(e) => setClientName(e.target.checked)} />
                  <span className="text-xs text-slate-600 font-semibold">Client Name</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded text-indigo-600" checked={clientEmail} onChange={(e) => setClientEmail(e.target.checked)} />
                  <span className="text-xs text-slate-600 font-semibold">Client Email</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded text-indigo-600" checked={clientPhone} onChange={(e) => setClientPhone(e.target.checked)} />
                  <span className="text-xs text-slate-600 font-semibold">Client Phone</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded text-indigo-600" checked={clientCompany} onChange={(e) => setClientCompany(e.target.checked)} />
                  <span className="text-xs text-slate-600 font-semibold">Company Name</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded text-indigo-600" checked={clientAddress} onChange={(e) => setClientAddress(e.target.checked)} />
                  <span className="text-xs text-slate-600 font-semibold">Client Address</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded text-indigo-600" checked={showProject} onChange={(e) => setShowProject(e.target.checked)} />
                  <span className="text-xs text-slate-600 font-semibold">Show Project on invoice</span>
                </label>
              </div>
            </div>

            {/* Textareas */}
            <div className="grid grid-cols-1 gap-4 border-t border-slate-150 pt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Terms and Conditions</label>
                <textarea rows={2} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none" value={terms} onChange={(e) => setTerms(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Other Information</label>
                <textarea rows={2} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none" value={otherInfo} onChange={(e) => setOtherInfo(e.target.value)} />
              </div>
            </div>

            {/* Save */}
            <div className="flex pt-2 border-t border-slate-100">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Invoice Template */}
        {activeTab === 'template' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEMPLATES.map(t => (
                <div
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t.id); onNotify(`Selected template ${t.name}`); }}
                  className={`border rounded-xl overflow-hidden cursor-pointer transition-all select-none relative group ${
                    selectedTemplate === t.id
                      ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-350 hover:shadow-xs'
                  }`}
                >
                  <div className={`h-24 ${t.color} flex items-center justify-center text-white font-serif tracking-wider font-extrabold text-[15px]`}>
                    {t.name.split(' ')[0]} Frame
                  </div>
                  <div className="p-4 bg-white space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">{t.name}</h4>
                    <p className="text-[10px] text-slate-450">{t.desc}</p>
                  </div>
                  {selectedTemplate === t.id && (
                    <div className="absolute top-2.5 right-2.5 bg-indigo-600 text-white p-1 rounded-full shadow-xs">
                      <CheckCircle2 className="h-4.5 w-4.5 fill-indigo-600 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Save */}
            <div className="flex pt-4 border-t border-slate-150">
              <button
                type="button"
                onClick={() => onNotify('Invoice layout template preferences locked!')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Prefix Settings */}
        {activeTab === 'prefix' && (
          <form onSubmit={handleSavePrefix} className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Invoice Prefix info */}
              <div className="space-y-4 bg-slate-50/55 p-4 rounded-xl border border-slate-200/50">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Invoices</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Prefix *</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold" value={invPrefix} onChange={(e) => setInvPrefix(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Separator</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold text-center" value={invSep} onChange={(e) => setInvSep(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Digits</label>
                    <input type="number" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold text-center" value={invDigits} onChange={(e) => setInvDigits(e.target.value)} />
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-slate-150/60 font-mono text-[10px] font-bold text-slate-550">
                  Example: {generateExample(invPrefix, invSep, invDigits)}
                </div>
              </div>

              {/* Credit Note Prefix info */}
              <div className="space-y-4 bg-slate-50/55 p-4 rounded-xl border border-slate-200/50">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Credit Notes</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Prefix *</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold" value={cnPrefix} onChange={(e) => setCnPrefix(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Separator</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold text-center" value={cnSep} onChange={(e) => setCnSep(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Digits</label>
                    <input type="number" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold text-center" value={cnDigits} onChange={(e) => setCnDigits(e.target.value)} />
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-slate-150/60 font-mono text-[10px] font-bold text-slate-550">
                  Example: {generateExample(cnPrefix, cnSep, cnDigits)}
                </div>
              </div>

              {/* Estimate Prefix info */}
              <div className="space-y-4 bg-slate-50/55 p-4 rounded-xl border border-slate-200/50">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Estimates</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Prefix *</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold" value={estPrefix} onChange={(e) => setEstPrefix(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Separator</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold text-center" value={estSep} onChange={(e) => setEstSep(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Digits</label>
                    <input type="number" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold text-center" value={estDigits} onChange={(e) => setEstDigits(e.target.value)} />
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-slate-150/60 font-mono text-[10px] font-bold text-slate-550">
                  Example: {generateExample(estPrefix, estSep, estDigits)}
                </div>
              </div>

              {/* Orders Prefix info */}
              <div className="space-y-4 bg-slate-50/55 p-4 rounded-xl border border-slate-200/50">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Orders</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Prefix *</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold" value={ordPrefix} onChange={(e) => setOrdPrefix(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Separator</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold text-center" value={ordSep} onChange={(e) => setOrdSep(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Digits</label>
                    <input type="number" className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-mono font-bold text-center" value={ordDigits} onChange={(e) => setOrdDigits(e.target.value)} />
                  </div>
                </div>
                <div className="p-2 bg-white rounded border border-slate-150/60 font-mono text-[10px] font-bold text-slate-550">
                  Example: {generateExample(ordPrefix, ordSep, ordDigits)}
                </div>
              </div>

            </div>

            {/* Save */}
            <div className="flex pt-2 border-t border-slate-100">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: Units */}
        {activeTab === 'units' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Units</h3>
              <button
                onClick={() => setShowUnitModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Unit</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs max-w-md">
              <table className="w-full text-left text-xs font-medium">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-400 text-[10px] uppercase font-bold">
                    <th className="px-4 py-3">Unit Name</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                  {units.map(u => (
                    <tr key={u.id}>
                      <td className="px-4 py-3.5 text-slate-800">{u.name}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteUnit(u.id)}
                          className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Quickbooks */}
        {activeTab === 'quickbooks' && (
          <form onSubmit={handleSaveQB} className="space-y-5 animate-fadeIn">
            {/* Banner */}
            <div className="bg-indigo-50 border border-indigo-150 text-indigo-800 p-4 rounded-xl flex gap-3 text-xs leading-normal font-medium">
              <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <p>It is only One-Way Sync. If you create an invoice or payment here then an invoice or payment will be created on QuickBooks too.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800">QuickBooks Sync Status</span>
                <p className="text-[11px] text-slate-500 font-medium">Enable automatic webhooks syncing to your Intuit ledger account.</p>
              </div>
              <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded" checked={qbStatus} onChange={(e) => setQbStatus(e.target.checked)} />
            </div>

            {qbStatus && (
              <div className="space-y-4 border-t border-slate-150 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">QuickBooks Client ID</label>
                  <input type="text" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold" value={qbClientId} onChange={(e) => setQbClientId(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">QuickBooks Client Secret</label>
                  <input type="password" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold" value={qbClientSecret} onChange={(e) => setQbClientSecret(e.target.value)} />
                </div>
              </div>
            )}

            {/* Save */}
            <div className="flex pt-2 border-t border-slate-100">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                <Save className="h-4 w-4" />
                <span>Save Setup</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 6: Invoice Payment Details */}
        {activeTab === 'payment' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Warning Info */}
            <div className="bg-slate-50 border border-slate-200 text-slate-600 p-4 rounded-xl flex gap-3 text-xs leading-relaxed font-medium">
              <Info className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
              <p>You can select the payment option when creating the invoice, and it will be displayed on the invoice details page and Invoice PDF.</p>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Registered Payment Details</h3>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add Payment Detail</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
              {payments.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs font-medium space-y-1 bg-white">
                  <p>- No payment added. -</p>
                  <p className="text-[10px] text-slate-350">Register bank credentials, routing numbers, or QR payment frames.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs font-medium bg-white">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-slate-400 text-[10px] uppercase font-bold">
                      <th className="px-5 py-3 w-12 text-center">#</th>
                      <th className="px-5 py-3">QR Code</th>
                      <th className="px-5 py-3">Method / Title</th>
                      <th className="px-5 py-3">Details Description</th>
                      <th className="px-5 py-3 w-24 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                    {payments.map((p, idx) => (
                      <tr key={p.id}>
                        <td className="px-5 py-3.5 text-center text-slate-450">{idx + 1}</td>
                        <td className="px-5 py-3.5">
                          {p.qrCodeUrl ? (
                            <img src={p.qrCodeUrl} alt="QR" className="w-10 h-10 object-cover border border-slate-200 rounded" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-[10px] text-slate-350 italic">None</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-slate-800 font-bold">{p.title}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-medium max-w-sm truncate">{p.description}</td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => handleDeletePayment(p.id)}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: Estimate Setting */}
        {activeTab === 'estimate' && (
          <form onSubmit={(e) => { e.preventDefault(); onNotify('Estimate parameters registered.'); }} className="space-y-5 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Estimate Terms</label>
              <textarea
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                value={estimateTerms}
                onChange={(e) => setEstimateTerms(e.target.value)}
              />
            </div>

            {/* Save */}
            <div className="flex pt-2 border-t border-slate-100">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Modal: Add Unit */}
      {showUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="text-sm font-bold text-slate-800">Unit Type</h3>
              <button onClick={() => setShowUnitModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Unit Type *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pcs, Box, Hrs"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  value={unitInput}
                  onChange={(e) => setUnitInput(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowUnitModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Payment Detail */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="text-sm font-bold text-slate-800">Add Payment Detail</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank Transfer (USD)"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-bold"
                  value={paymentTitle}
                  onChange={(e) => setPaymentTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Payment Details *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Routing numbers, IBAN, instructions..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold resize-none"
                  value={paymentDesc}
                  onChange={(e) => setPaymentDesc(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">QR Code</label>
                <div className="border border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer hover:bg-slate-100/50 transition-colors">
                  <Upload className="h-5 w-5 text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-bold">Drag & drop files here or click</span>
                  <button
                    type="button"
                    onClick={() => setPaymentQR('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=60')}
                    className="text-[10px] font-bold text-indigo-600 mt-1 hover:underline"
                  >
                    Load Sample QR Code
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
