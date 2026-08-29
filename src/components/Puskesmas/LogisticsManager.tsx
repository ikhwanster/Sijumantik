import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  Layers, 
  RefreshCw, 
  Send,
  X,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { LogisticsItem } from '../../types/jumantik';
import { exportLogisticsToPdf, exportLogisticsToExcel } from '../../utils/reportExporter';
import { playAlertTone } from '../../utils/audioAlert';

interface LogisticsManagerProps {
  logistics: LogisticsItem[];
  onUpdateLogistics: (updated: LogisticsItem[]) => void;
}

export const LogisticsManager: React.FC<LogisticsManagerProps> = ({
  logistics,
  onUpdateLogistics,
}) => {
  const [items, setItems] = useState<LogisticsItem[]>(logistics);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<LogisticsItem['category']>('Larvasida (Abate)');
  const [newItemQty, setNewItemQty] = useState(100);
  const [newItemUnit, setNewItemUnit] = useState('Kg');
  const [allocatedTo, setAllocatedTo] = useState('Puskesmas Sukamaju & Satgas RW 03');

  const handleAdjustQuantity = (id: string, delta: number) => {
    const next = items.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        let status: LogisticsItem['status'] = 'cukup';
        if (newQty < 20) status = 'kritis';
        else if (newQty < 60) status = 'menipis';
        return { ...item, quantity: newQty, status };
      }
      return item;
    });
    setItems(next);
    onUpdateLogistics(next);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LogisticsItem = {
      id: `log-${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      quantity: newItemQty,
      unit: newItemUnit,
      allocatedTo,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: newItemQty < 20 ? 'kritis' : newItemQty < 60 ? 'menipis' : 'cukup',
    };
    const next = [created, ...items];
    setItems(next);
    onUpdateLogistics(next);
    setShowAddModal(false);
    setNewItemName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-100 text-cyan-700 rounded-xl">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Manajemen Distribusi Logistik Medis & Vektor</h3>
            <p className="text-xs text-slate-500">Stok bubuk Abate, RDT Dengue NS1, Ringer Lactate, dan alat fogging</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              exportLogisticsToPdf(items);
              playAlertTone('success');
            }}
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
            title="Unduh Stok Logistik PDF"
          >
            <FileText className="w-3.5 h-3.5 text-red-600" />
            <span>Unduh PDF</span>
          </button>

          <button
            onClick={() => {
              exportLogisticsToExcel(items);
              playAlertTone('success');
            }}
            className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
            title="Unduh Stok Logistik XLSX"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-600" />
            <span>Unduh XLSX</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Stok Logistik</span>
          </button>
        </div>
      </div>

      {/* Grid of logistics items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all ${
              item.status === 'kritis'
                ? 'bg-red-50/80 border-red-300 ring-1 ring-red-400'
                : item.status === 'menipis'
                ? 'bg-amber-50/80 border-amber-300'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {item.category}
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  item.status === 'kritis'
                    ? 'bg-red-600 text-white animate-pulse'
                    : item.status === 'menipis'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {item.status}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-900 mb-1">{item.name}</h4>
            <p className="text-[11px] text-slate-500 mb-3">Distribusi: {item.allocatedTo}</p>

            <div className="flex items-center justify-between bg-white/90 p-2.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block">Stok Tersedia:</span>
                <span className="text-lg font-black text-slate-900">
                  {item.quantity} <span className="text-xs font-medium text-slate-500">{item.unit}</span>
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAdjustQuantity(item.id, -10)}
                  className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-black text-sm flex items-center justify-center"
                  title="Kurangi 10"
                >
                  -
                </button>
                <button
                  onClick={() => handleAdjustQuantity(item.id, 10)}
                  className="w-7 h-7 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-black text-sm flex items-center justify-center"
                  title="Tambah 10"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleAddItem} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Item Logistik Baru</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Barang / Logistik:</label>
              <input
                type="text"
                required
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Contoh: Larvasida Granul Bti"
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori:</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  <option value="Larvasida (Abate)">Larvasida (Abate)</option>
                  <option value="RDT Dengue NS1">RDT Dengue NS1</option>
                  <option value="Cairan Infus Ringer Lactate">Cairan Infus RL</option>
                  <option value="Mesin & Cairan Fogging">Mesin Fogging</option>
                  <option value="Kelambu Insektisida">Kelambu</option>
                  <option value="Kassa Nyamuk">Kassa Nyamuk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah & Satuan:</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-2/3 text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-1/3 text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alokasi Wilayah / Faskes:</label>
              <input
                type="text"
                value={allocatedTo}
                onChange={(e) => setAllocatedTo(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
            >
              Simpan Logistik
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
