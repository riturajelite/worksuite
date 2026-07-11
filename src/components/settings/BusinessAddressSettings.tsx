import React, { useState } from 'react';
import { Info, Plus, X, Edit, Trash2, Check, MapPin } from 'lucide-react';

interface AddressItem {
  id: number;
  location: string;
  address: string;
  country: string;
  taxName: string;
  taxNumber: string;
  isDefault: boolean;
  lat?: string;
  lng?: string;
}

interface BusinessAddressSettingsProps {
  onNotify: (message: string) => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
];

export default function BusinessAddressSettings({ onNotify }: BusinessAddressSettingsProps) {
  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: 1,
      location: 'Worksuite',
      address: 'Your Company address here',
      country: '--',
      taxName: '--',
      taxNumber: '--',
      isDefault: true,
      lat: '38.895',
      lng: '-77.0364',
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);

  // Form states for adding/editing
  const [country, setCountry] = useState('US');
  const [location, setLocation] = useState('');
  const [taxName, setTaxName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [addressVal, setAddressVal] = useState('');
  const [lat, setLat] = useState('38.895');
  const [lng, setLng] = useState('-77.0364');

  const openAddModal = () => {
    setEditingAddress(null);
    setCountry('US');
    setLocation('');
    setTaxName('');
    setTaxNumber('');
    setAddressVal('');
    setLat('38.895');
    setLng('-77.0364');
    setShowModal(true);
  };

  const openEditModal = (item: AddressItem) => {
    setEditingAddress(item);
    setCountry(item.country === '--' ? 'US' : item.country);
    setLocation(item.location);
    setTaxName(item.taxName === '--' ? '' : item.taxName);
    setTaxNumber(item.taxNumber === '--' ? '' : item.taxNumber);
    setAddressVal(item.address);
    setLat(item.lat || '38.895');
    setLng(item.lng || '-77.0364');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !addressVal) {
      onNotify('Location and Address are required!');
      return;
    }

    const countryObj = COUNTRIES.find(c => c.code === country);
    const countryName = countryObj ? `${countryObj.flag} ${countryObj.name}` : country;

    if (editingAddress) {
      setAddresses(prev => prev.map(item => {
        if (item.id === editingAddress.id) {
          return {
            ...item,
            location,
            address: addressVal,
            country: countryName,
            taxName: taxName || '--',
            taxNumber: taxNumber || '--',
            lat,
            lng,
          };
        }
        return item;
      }));
      onNotify('Business Address updated successfully!');
    } else {
      const newAddress: AddressItem = {
        id: Date.now(),
        location,
        address: addressVal,
        country: countryName,
        taxName: taxName || '--',
        taxNumber: taxNumber || '--',
        isDefault: addresses.length === 0,
        lat,
        lng,
      };
      setAddresses(prev => [...prev, newAddress]);
      onNotify('Business Address added successfully!');
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    const item = addresses.find(a => a.id === id);
    if (item?.isDefault) {
      onNotify('Cannot delete default address!');
      return;
    }
    setAddresses(prev => prev.filter(a => a.id !== id));
    onNotify('Address removed.');
  };

  const handleSetDefault = (id: number) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    onNotify('Default business address changed!');
  };

  return (
    <div className="space-y-6" id="business-address-settings-root">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • Settings • Business Address
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-800">Business Address</h2>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Address</span>
          </button>
        </div>
      </div>

      {/* Info Warning Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-xs text-blue-800">
        <Info className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
        <p className="font-medium leading-relaxed">
          The attendance and other modules utilize the default business address, but when creating records, you have the option to select a different address as default address.
        </p>
      </div>

      {/* Addresses Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-5 py-4 w-12 text-center">#</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Tax Name</th>
                <th className="px-5 py-4 w-28 text-center">Default</th>
                <th className="px-5 py-4 w-28 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-medium text-slate-700">
              {addresses.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-center font-mono text-slate-400 text-[11px]">{index + 1}</td>
                  <td className="px-5 py-4 font-bold text-slate-800">{item.location}</td>
                  <td className="px-5 py-4 text-slate-500 max-w-xs truncate">{item.address}</td>
                  <td className="px-5 py-4">{item.country}</td>
                  <td className="px-5 py-4">{item.taxName}</td>
                  <td className="px-5 py-4 text-center">
                    <input
                      type="radio"
                      name="defaultAddress"
                      checked={item.isDefault}
                      onChange={() => handleSetDefault(item.id)}
                      className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Edit Address"
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete Address"
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h3 className="text-sm font-bold text-slate-800">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Country</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New York, London, Delhi"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* Tax Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Tax Name</label>
                  <input
                    type="text"
                    placeholder="Tax Name"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={taxName}
                    onChange={(e) => setTaxName(e.target.value)}
                  />
                </div>

                {/* Tax ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Tax Number</label>
                  <input
                    type="text"
                    placeholder="Enter Tax Number"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Address *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. 132, My Street, Kingston, New York 12401"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                  value={addressVal}
                  onChange={(e) => setAddressVal(e.target.value)}
                />
              </div>

              {/* Latitude & Longitude */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Latitude</label>
                  <input
                    type="text"
                    placeholder="e.g. 38.895"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Longitude</label>
                  <input
                    type="text"
                    placeholder="e.g. -77.0364"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                  />
                </div>
              </div>

              {/* Maps Warning Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-2.5 text-[11px] text-slate-500">
                <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  You need to add Google Map Key to see the Maps here and locate your location directly on map. Visit{' '}
                  <span className="text-indigo-600 hover:underline cursor-pointer font-bold">Google Map Settings</span>.
                </span>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
