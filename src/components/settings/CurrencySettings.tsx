import React, { useState } from 'react';
import { Info, Plus, Key, X, Edit, Trash2, Check, Eye, EyeOff } from 'lucide-react';

interface CurrencyItem {
  id: number;
  name: string;
  symbol: string;
  code: string;
  rate: number;
  isDefault: boolean;
  position: 'left' | 'right' | 'left_space' | 'right_space';
  thousandSeparator: string;
  decimalSeparator: string;
  decimals: number;
}

interface CurrencySettingsProps {
  onNotify: (message: string) => void;
}

export default function CurrencySettings({ onNotify }: CurrencySettingsProps) {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([
    { id: 1, name: 'Dollars', symbol: '$', code: 'USD', rate: 1.00, isDefault: true, position: 'left', thousandSeparator: ',', decimalSeparator: '.', decimals: 2 },
    { id: 2, name: 'Pounds', symbol: '£', code: 'GBP', rate: 0.78, isDefault: false, position: 'left', thousandSeparator: ',', decimalSeparator: '.', decimals: 2 },
    { id: 3, name: 'Euros', symbol: '€', code: 'EUR', rate: 0.91, isDefault: false, position: 'left', thousandSeparator: ',', decimalSeparator: '.', decimals: 2 },
    { id: 4, name: 'Rupee', symbol: '₹', code: 'INR', rate: 83.45, isDefault: false, position: 'left', thousandSeparator: ',', decimalSeparator: '.', decimals: 2 },
  ]);

  const [converterKey, setConverterKey] = useState('AlzaSyDsl2bG7XXXXXXXXXXXXXXXXXXXXXXX');
  const [showKeyPass, setShowKeyPass] = useState(false);
  const [converterVersion, setConverterVersion] = useState('Free');

  // Modal displays
  const [showAddModal, setShowAddModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<CurrencyItem | null>(null);

  // Add Currency Form States
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [code, setCode] = useState('');
  const [isCryptocurrency, setIsCryptocurrency] = useState<'yes' | 'no'>('no');
  const [rate, setRate] = useState('1');
  const [position, setPosition] = useState<'left' | 'right' | 'left_space' | 'right_space'>('left');
  const [thousandSeparator, setThousandSeparator] = useState(',');
  const [decimalSeparator, setDecimalSeparator] = useState('.');
  const [decimals, setDecimals] = useState(2);

  const formatPreview = (val: number, sym: string, pos: string, thousand: string, decimal: string, decs: number) => {
    let formattedVal = val.toFixed(decs);
    const parts = formattedVal.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
    formattedVal = parts.join(decimal);

    if (pos === 'left') return `${sym}${formattedVal}`;
    if (pos === 'right') return `${formattedVal}${sym}`;
    if (pos === 'left_space') return `${sym} ${formattedVal}`;
    return `${formattedVal} ${sym}`;
  };

  const openAddModal = () => {
    setEditingCurrency(null);
    setName('');
    setSymbol('');
    setCode('');
    setIsCryptocurrency('no');
    setRate('1');
    setPosition('left');
    setThousandSeparator(',');
    setDecimalSeparator('.');
    setDecimals(2);
    setShowAddModal(true);
  };

  const openEditModal = (item: CurrencyItem) => {
    setEditingCurrency(item);
    setName(item.name);
    setSymbol(item.symbol);
    setCode(item.code);
    setIsCryptocurrency('no');
    setRate(String(item.rate));
    setPosition(item.position);
    setThousandSeparator(item.thousandSeparator);
    setDecimalSeparator(item.decimalSeparator);
    setDecimals(item.decimals);
    setShowAddModal(true);
  };

  const handleSaveCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !code) {
      onNotify('All asterisk (*) fields are required!');
      return;
    }

    if (editingCurrency) {
      setCurrencies(prev => prev.map(item => {
        if (item.id === editingCurrency.id) {
          return {
            ...item,
            name,
            symbol,
            code,
            rate: Number(rate) || 1,
            position,
            thousandSeparator,
            decimalSeparator,
            decimals,
          };
        }
        return item;
      }));
      onNotify('Currency updated successfully.');
    } else {
      const newCurr: CurrencyItem = {
        id: Date.now(),
        name,
        symbol,
        code,
        rate: Number(rate) || 1,
        isDefault: false,
        position,
        thousandSeparator,
        decimalSeparator,
        decimals,
      };
      setCurrencies(prev => [...prev, newCurr]);
      onNotify('Currency created successfully.');
    }
    setShowAddModal(false);
  };

  const handleDeleteCurrency = (id: number) => {
    const item = currencies.find(c => c.id === id);
    if (item?.isDefault) {
      onNotify('Cannot delete default system currency!');
      return;
    }
    setCurrencies(prev => prev.filter(c => c.id !== id));
    onNotify('Currency removed.');
  };

  const handleSaveConverterKey = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Currency converter keys committed successfully.');
    setShowKeyModal(false);
  };

  return (
    <div className="space-y-6" id="currency-settings-root">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • Settings • Currency Settings
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-800">Currency Settings</h2>
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowKeyModal(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all"
            >
              <Key className="h-4 w-4 text-slate-500" />
              <span>Currency Converter Key</span>
            </button>
            <button
              onClick={openAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Currency</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-xs text-blue-800">
        <Info className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
        <p className="font-medium leading-relaxed">
          Exchange rate is calculated from your default currency. Change default currency in App Settings.
        </p>
      </div>

      {/* Currencies Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden max-w-5xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-5 py-4">Currency Name</th>
                <th className="px-5 py-4">Currency Symbol</th>
                <th className="px-5 py-4">Currency Code</th>
                <th className="px-5 py-4">Exchange Rate</th>
                <th className="px-5 py-4">Currency Format</th>
                <th className="px-5 py-4 w-28 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-medium text-slate-700">
              {currencies.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 flex items-center gap-2">
                    <span className="font-bold text-slate-800">{c.name}</span>
                    {c.isDefault && (
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-100">
                        Default
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-500 text-sm font-mono">{c.symbol}</td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-650">{c.code}</td>
                  <td className="px-5 py-4 font-mono">{c.rate}</td>
                  <td className="px-5 py-4 font-mono text-xs font-bold text-slate-650">
                    {formatPreview(1000, c.symbol, c.position, c.thousandSeparator, c.decimalSeparator, c.decimals)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(c)}
                        title="Edit Currency"
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {!c.isDefault && (
                        <button
                          onClick={() => handleDeleteCurrency(c.id)}
                          title="Delete Currency"
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add/Edit Currency */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="text-sm font-bold text-slate-800">
                {editingCurrency ? 'Edit Currency' : 'Add New Currency'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCurrency} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Currency Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Currency Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dollar"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Currency Symbol */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Currency Symbol *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                </div>

                {/* Currency Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Currency Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. USD"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                {/* Exchange Rate */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Exchange Rate *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>

                {/* Is Cryptocurrency */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Is Cryptocurrency</label>
                  <div className="flex gap-4 p-2">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="isCrypto"
                        checked={isCryptocurrency === 'yes'}
                        onChange={() => setIsCryptocurrency('yes')}
                        className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="isCrypto"
                        checked={isCryptocurrency === 'no'}
                        onChange={() => setIsCryptocurrency('no')}
                        className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Warning Key */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500">
                You need to configure the Currency converter key first to fetch Latest exchange rate.{' '}
                <span onClick={() => { setShowAddModal(false); setShowKeyModal(true); }} className="text-indigo-600 hover:underline cursor-pointer font-bold">
                  click here to add key
                </span>
              </div>

              {/* Format Heading */}
              <div className="border-t border-slate-150 pt-4 space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Currency Format Settings</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Currency Position */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Currency Position</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                      value={position}
                      onChange={(e) => setPosition(e.target.value as any)}
                    >
                      <option value="left">Left ($1,000.00)</option>
                      <option value="right">Right (1,000.00$)</option>
                      <option value="left_space">Left With Space ($ 1,000.00)</option>
                      <option value="right_space">Right With Space (1,000.00 $)</option>
                    </select>
                  </div>

                  {/* Number of Decimals */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Number of Decimals</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none font-mono"
                      value={decimals}
                      onChange={(e) => setDecimals(Number(e.target.value) || 0)}
                    />
                  </div>

                  {/* Thousand Separator */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Thousand Separator</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none font-mono"
                      value={thousandSeparator}
                      onChange={(e) => setThousandSeparator(e.target.value)}
                    />
                  </div>

                  {/* Decimal Separator */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Decimal Separator</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none font-mono"
                      value={decimalSeparator}
                      onChange={(e) => setDecimalSeparator(e.target.value)}
                    />
                  </div>
                </div>

                {/* Preview Box */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono text-xs font-black text-slate-700">
                  Example - {formatPreview(1234567.89, symbol || '$', position, thousandSeparator, decimalSeparator, decimals)}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Converter Key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="text-sm font-bold text-slate-800">Currency converter key</h3>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConverterKey} className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-150 p-3.5 rounded-lg text-[11px] text-blue-800 font-medium leading-relaxed">
                Get API key by this url <a href="https://www.currencyconverterapi.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-bold">https://www.currencyconverterapi.com/</a>
              </div>

              {/* Key Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Currency converter key *</label>
                <div className="relative">
                  <input
                    type={showKeyPass ? 'text' : 'password'}
                    required
                    placeholder="Enter API Key"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 pr-10 text-xs font-mono font-semibold focus:outline-none"
                    value={converterKey}
                    onChange={(e) => setConverterKey(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyPass(!showKeyPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showKeyPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Version Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Version</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                  value={converterVersion}
                  onChange={(e) => setConverterVersion(e.target.value)}
                >
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
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
