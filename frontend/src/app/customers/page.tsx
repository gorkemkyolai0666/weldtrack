'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, Plus, Search, Building2, Phone, Mail, Trash2, Edit3, X, Save } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', phone: '', address: '', taxNumber: '', notes: '' });

  const loadData = () => {
    setLoading(true);
    api.getCustomers(search).then(setCustomers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [search]);

  const resetForm = () => {
    setForm({ companyName: '', contactName: '', email: '', phone: '', address: '', taxNumber: '', notes: '' });
    setEditId(null);
  };

  const openEdit = (c: any) => {
    setForm({ companyName: c.companyName, contactName: c.contactName, email: c.email || '', phone: c.phone, address: c.address || '', taxNumber: c.taxNumber || '', notes: c.notes || '' });
    setEditId(c.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.updateCustomer(editId, form);
      } else {
        await api.createCustomer(form);
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
    try {
      await api.deleteCustomer(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-brand-500" />
            Müşteriler
          </h1>
          <p className="text-steel-400 mt-1">İş ortaklarınız ve müşterileriniz</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-brand-600/20">
          <Plus className="w-4 h-4" />Yeni Müşteri
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-500" />
        <input type="text" placeholder="Müşteri ara..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-steel-900 border border-steel-700 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 bg-steel-900 border border-steel-800 rounded-xl">
          <Building2 className="w-16 h-16 text-steel-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-steel-300 mb-2">Henüz müşteri bulunmuyor</h3>
          <p className="text-steel-500 text-sm">İlk müşterinizi ekleyin</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <div key={c.id} className="bg-steel-900 border border-steel-800 rounded-xl p-5 hover:border-steel-700 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{c.companyName}</h3>
                  <p className="text-sm text-steel-400">{c.contactName}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-steel-800 text-steel-400 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-steel-400 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-steel-400"><Phone className="w-3.5 h-3.5" />{c.phone}</div>
                {c.email && <div className="flex items-center gap-2 text-steel-400"><Mail className="w-3.5 h-3.5" />{c.email}</div>}
              </div>
              <div className="flex gap-3 mt-4 pt-3 border-t border-steel-800">
                <span className="text-xs text-steel-500">{c._count?.workOrders || 0} iş emri</span>
                <span className="text-xs text-steel-500">{c._count?.invoices || 0} fatura</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-steel-900 border border-steel-700 rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editId ? 'Müşteri Düzenle' : 'Yeni Müşteri'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-steel-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Firma Adı</label>
                  <input type="text" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Yetkili Kişi</label>
                  <input type="text" required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">E-posta</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Telefon</label>
                  <input type="text" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">Adres</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Vergi No</label>
                  <input type="text" value={form.taxNumber} onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Notlar</label>
                  <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
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
