'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, categoryLabels } from '@/lib/utils';
import { Package, Plus, Search, AlertTriangle, Edit3, Trash2, X, Save } from 'lucide-react';

const categoryColors: Record<string, string> = {
  STEEL: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  ROD: 'bg-brand-500/10 text-brand-400 border-brand-500/30',
  GAS: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  CONSUMABLE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  TOOL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  OTHER: 'bg-steel-600/20 text-steel-300 border-steel-600/30',
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'STEEL', unit: '', unitPrice: 0, stockQty: 0, minStockQty: 0, supplier: '' });

  const loadData = () => {
    setLoading(true);
    api.getMaterials(categoryFilter, search).then(setMaterials).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [categoryFilter, search]);

  const resetForm = () => {
    setForm({ name: '', category: 'STEEL', unit: '', unitPrice: 0, stockQty: 0, minStockQty: 0, supplier: '' });
    setEditId(null);
  };

  const openEdit = (m: any) => {
    setForm({ name: m.name, category: m.category, unit: m.unit, unitPrice: m.unitPrice, stockQty: m.stockQty, minStockQty: m.minStockQty, supplier: m.supplier || '' });
    setEditId(m.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, unitPrice: Number(form.unitPrice), stockQty: Number(form.stockQty), minStockQty: Number(form.minStockQty) };
      if (editId) await api.updateMaterial(editId, data);
      else await api.createMaterial(data);
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu malzemeyi silmek istediğinize emin misiniz?')) return;
    try { await api.deleteMaterial(id); loadData(); } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Package className="w-7 h-7 text-brand-500" />Malzeme Envanteri</h1>
          <p className="text-steel-400 mt-1">Kaynak malzemeleri ve stok durumu</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-brand-600/20">
          <Plus className="w-4 h-4" />Yeni Malzeme
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-500" />
          <input type="text" placeholder="Malzeme ara..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-steel-900 border border-steel-700 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-steel-900 border border-steel-700 rounded-lg text-steel-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
          <option value="">Tüm Kategoriler</option>
          {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : materials.length === 0 ? (
        <div className="text-center py-16 bg-steel-900 border border-steel-800 rounded-xl">
          <Package className="w-16 h-16 text-steel-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-steel-300 mb-2">Malzeme bulunamadı</h3>
          <p className="text-steel-500 text-sm">Envantere malzeme ekleyin</p>
        </div>
      ) : (
        <div className="bg-steel-900 border border-steel-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-steel-800">
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Malzeme</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Birim Fiyat</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Stok</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Tedarikçi</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => {
                  const isLow = m.stockQty <= m.minStockQty;
                  return (
                    <tr key={m.id} className="border-b border-steel-800/50 hover:bg-steel-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-white">{m.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${categoryColors[m.category] || ''}`}>
                          {categoryLabels[m.category] || m.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-steel-200">{formatCurrency(m.unitPrice)}/{m.unit}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-sm ${isLow ? 'text-red-400' : 'text-white'}`}>{m.stockQty} {m.unit}</span>
                          {isLow && <AlertTriangle className="w-4 h-4 text-red-400" />}
                        </div>
                        <p className="text-xs text-steel-500">Min: {m.minStockQty}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-steel-400">{m.supplier || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-steel-800 text-steel-400 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-steel-400 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-steel-900 border border-steel-700 rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editId ? 'Malzeme Düzenle' : 'Yeni Malzeme'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-steel-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">Malzeme Adı</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-steel-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Birim</label>
                  <input type="text" required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="kg, adet, metre" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Birim Fiyat (₺)</label>
                  <input type="number" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Stok Miktarı</label>
                  <input type="number" step="0.01" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Min. Stok</label>
                  <input type="number" step="0.01" value={form.minStockQty} onChange={(e) => setForm({ ...form, minStockQty: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">Tedarikçi</label>
                <input type="text" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 text-steel-400 hover:text-white text-sm transition-colors">İptal</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-all">
                  <Save className="w-4 h-4" />{saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
