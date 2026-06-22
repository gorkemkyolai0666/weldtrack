'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { HardHat, Plus, Award, Phone, Edit3, Trash2, X, Save, CheckCircle, XCircle } from 'lucide-react';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', specialization: '', certifications: '', dailyRate: 0, isActive: true });

  const loadData = () => {
    setLoading(true);
    api.getWorkers().then(setWorkers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setForm({ name: '', phone: '', specialization: '', certifications: '', dailyRate: 0, isActive: true });
    setEditId(null);
  };

  const openEdit = (w: any) => {
    setForm({ name: w.name, phone: w.phone || '', specialization: w.specialization, certifications: w.certifications || '', dailyRate: w.dailyRate, isActive: w.isActive });
    setEditId(w.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, dailyRate: Number(form.dailyRate) };
      if (editId) await api.updateWorker(editId, data);
      else await api.createWorker(data);
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ustayı silmek istediğinize emin misiniz?')) return;
    try { await api.deleteWorker(id); loadData(); } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><HardHat className="w-7 h-7 text-brand-500" />Ustalar</h1>
          <p className="text-steel-400 mt-1">Kaynak ustaları ve sertifikaları</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-brand-600/20">
          <Plus className="w-4 h-4" />Yeni Usta
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : workers.length === 0 ? (
        <div className="text-center py-16 bg-steel-900 border border-steel-800 rounded-xl">
          <HardHat className="w-16 h-16 text-steel-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-steel-300 mb-2">Henüz usta kayıtlı değil</h3>
          <p className="text-steel-500 text-sm">Ekibinize usta ekleyin</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((w) => (
            <div key={w.id} className="bg-steel-900 border border-steel-800 rounded-xl p-5 hover:border-steel-700 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${w.isActive ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-steel-800 border border-steel-700'}`}>
                    <HardHat className={`w-5 h-5 ${w.isActive ? 'text-emerald-400' : 'text-steel-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{w.name}</h3>
                    <p className="text-xs text-brand-400 font-medium">{w.specialization}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(w)} className="p-1.5 rounded-lg hover:bg-steel-800 text-steel-400 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(w.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-steel-400 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              {w.phone && <div className="flex items-center gap-2 text-sm text-steel-400 mb-2"><Phone className="w-3.5 h-3.5" />{w.phone}</div>}
              {w.certifications && (
                <div className="flex items-start gap-2 text-sm text-steel-400 mb-3">
                  <Award className="w-3.5 h-3.5 mt-0.5 text-amber-400" />
                  <span className="text-xs">{w.certifications}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-steel-800">
                <span className="font-mono text-sm text-brand-400">{formatCurrency(w.dailyRate)}<span className="text-steel-500 text-xs">/gün</span></span>
                <div className="flex items-center gap-1">
                  {w.isActive ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-steel-500" />}
                  <span className={`text-xs ${w.isActive ? 'text-emerald-400' : 'text-steel-500'}`}>{w.isActive ? 'Aktif' : 'Pasif'}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-steel-500">{w._count?.workOrderItems || 0} iş kalemi</div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-steel-900 border border-steel-700 rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editId ? 'Usta Düzenle' : 'Yeni Usta'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-steel-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Ad Soyad</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Telefon</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">Uzmanlık Alanı</label>
                <input type="text" required value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="TIG Kaynak, MIG/MAG, vb." />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">Sertifikalar</label>
                <input type="text" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                  className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="EN ISO 9606-1, ASME IX" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Günlük Ücret (₺)</label>
                  <input type="number" value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-steel-600 bg-steel-800 text-brand-500 focus:ring-brand-500" />
                    <span className="text-sm text-steel-300">Aktif</span>
                  </label>
                </div>
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
