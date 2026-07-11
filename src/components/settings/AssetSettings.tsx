import React, { useState } from 'react';
import { 
  Package, Plus, Edit2, Trash2, X, Check, Eye
} from 'lucide-react';

interface AssetSettingsProps {
  onNotify: (message: string) => void;
}

interface AssetType {
  id: string;
  name: string;
}

export default function AssetSettings({ onNotify }: AssetSettingsProps) {
  // Asset Type List State (Pre-populated exactly like screenshot)
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([
    { id: '1', name: 'Laptop' },
    { id: '2', name: 'Desktop' },
    { id: '3', name: 'Mobile' },
    { id: '4', name: 'Printer' },
    { id: '5', name: 'Scanner' },
    { id: '6', name: 'Two-Wheeler' },
    { id: '7', name: 'Car' },
    { id: '8', name: 'Other' }
  ]);

  // Modal Control States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);

  // Form Field States
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Open Edit Modal
  const handleEditClick = (asset: AssetType) => {
    setSelectedAsset(asset);
    setName(asset.name);
    setError('');
    setShowEditModal(true);
  };

  // Open Add Modal
  const handleAddClick = () => {
    setName('');
    setError('');
    setShowAddModal(true);
  };

  // Create Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const newAsset: AssetType = {
      id: Date.now().toString(),
      name: name.trim()
    };

    setAssetTypes(prev => [...prev, newAsset]);
    setShowAddModal(false);
    onNotify(`Asset type "${newAsset.name}" added successfully!`);
  };

  // Update Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setAssetTypes(prev => prev.map(a => a.id === selectedAsset.id ? { ...a, name: name.trim() } : a));
    setShowEditModal(false);
    onNotify(`Asset type updated to "${name.trim()}"`);
  };

  // Delete Asset
  const handleDeleteClick = (id: string, assetName: string) => {
    if (confirm(`Are you sure you want to delete asset type "${assetName}"?`)) {
      setAssetTypes(prev => prev.filter(a => a.id !== id));
      onNotify(`Asset type "${assetName}" deleted successfully.`);
    }
  };

  return (
    <div className="space-y-6" id="asset-settings-view">
      
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span>Assets</span>
          </h2>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            <span>Assets</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-500 font-bold">Home</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="text-slate-400 font-medium">Assets</span>
          </div>
        </div>

        {/* Add Asset Type Button */}
        <button 
          onClick={handleAddClick}
          className="bg-[#1d82f5] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors shrink-0"
        >
          <span className="font-extrabold text-sm leading-none">+</span>
          <span>Add Asset Type</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-3xs overflow-hidden">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-slate-150 bg-slate-50/20">
          <h3 className="text-sm font-bold text-slate-800">Asset Type</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="px-5 py-3.5 w-16">#</th>
                <th className="px-5 py-3.5">Type Name</th>
                <th className="px-5 py-3.5 text-right w-44">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assetTypes.length > 0 ? (
                assetTypes.map((asset, index) => (
                  <tr key={asset.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400 font-semibold">{index + 1}</td>
                    <td className="px-5 py-3.5 text-slate-800 font-bold">{asset.name}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditClick(asset)}
                          className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-4xs"
                        >
                          <Edit2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                          <span>Edit</span>
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClick(asset.id, asset.name)}
                          className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-4xs"
                        >
                          <Trash2 className="h-3 w-3 text-slate-400 stroke-[2.5]" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400 font-medium italic">
                    No asset types added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Type Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Add Asset Type</h3>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setError('');
                  }}
                  className={`w-full bg-slate-50 hover:bg-slate-50/50 border ${error ? 'border-red-400' : 'border-slate-200'} rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700 transition-colors`}
                />
                {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex items-center justify-end gap-3.5">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
              <button 
                type="submit"
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Asset Type Modal */}
      {showEditModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Edit Asset Type</h3>
              <button 
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setError('');
                  }}
                  className={`w-full bg-slate-50 hover:bg-slate-50/50 border ${error ? 'border-red-400' : 'border-slate-200'} rounded-md p-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700 transition-colors`}
                />
                {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-150 flex items-center justify-end gap-3.5">
              <button 
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-500 hover:text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
              <button 
                type="submit"
                className="bg-[#1d82f5] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
