'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { statusLabels, formatCurrency, formatDate } from '@/lib/utils';
import { FileText, Plus, Search, ArrowRight, X, Save } from 'lucide-react';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-steel-600/20 text-steel-300 border-steel-600/30',
  SENT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PAID: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  OVERDUE: 'bg-red-500/20 text-red-400 border-red-500/30',
  CANCELLED: 'bg-steel-800/50 text-steel-500 border-steel-700/30',
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customerId: '', workOrderId: '', taxRate: 20, dueDate: '', notes: '', items: [{ description: '', quantity: 1, unitPrice: 0 }] });

  const loadData = () => {
    setLoading(true);
    api.getInvoices(statusFilter).then(setInvoices).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [statusFilter]);
  useEffect(() => {
    api.getCustomers().then(setCustomers).catch(console.error);
    api.getWorkOrders().then(setWorkOrders).catch(console.error);
  }, []);

  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unitPrice: 0 }] });
  const removeItem = (idx: number) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  const updateItem = (idx: number, field: string, val: any) => {
    const items = [...form.items];
    (items[idx] as any)[field] = val;
    setForm({ ...form, items });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createInvoice({ ...form, taxRate: Number(form.taxRate), items: form.items.map(i => ({ ...i, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) })) });
      setShowModal(false);
      setForm({ customerId: '', workOrderId: '', taxRate: 20, dueDate: '', notes: '', items: [{ description: '', quantity: 1, unitPrice: 0 }] });
      loadData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3"><FileText className="w-7 h-7 text-brand-500" />Faturalar</h1>
          <p className="text-steel-400 mt-1">Fatura oluşturma ve takip</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-brand-600/20">
          <Plus className="w-4 h-4" />Yeni Fatura
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-steel-900 border border-steel-700 rounded-lg text-steel-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
          <option value="">Tüm Durumlar</option>
          <option value="DRAFT">Taslak</option>
          <option value="SENT">Gönderildi</option>
          <option value="PAID">Ödendi</option>
          <option value="OVERDUE">Gecikmiş</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 bg-steel-900 border border-steel-800 rounded-xl">
          <FileText className="w-16 h-16 text-steel-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-steel-300 mb-2">Henüz fatura bulunmuyor</h3>
          <p className="text-steel-500 text-sm">İlk faturanızı oluşturun</p>
        </div>
      ) : (
        <div className="bg-steel-900 border border-steel-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-steel-800">
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Fatura No</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Müşteri</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">İş Emri</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Durum</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Tutar</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Tarih</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-steel-800/50 hover:bg-steel-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm text-brand-400">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-sm text-steel-300">{inv.customer?.companyName}</td>
                    <td className="px-4 py-3 text-sm text-steel-400">{inv.workOrder?.orderNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded border ${statusColors[inv.status] || ''}`}>
                        {statusLabels[inv.status] || inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-white">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-4 py-3 text-sm text-steel-400">{formatDate(inv.issuedAt)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/invoices/${inv.id}`} className="text-brand-400 hover:text-brand-300"><ArrowRight className="w-4 h-4" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-steel-900 border border-steel-700 rounded-xl w-full max-w-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Yeni Fatura</h2>
              <button onClick={() => setShowModal(false)} className="text-steel-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Müşteri</label>
                  <select required value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-steel-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">Seçiniz</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">İş Emri</label>
                  <select required value={form.workOrderId} onChange={(e) => setForm({ ...form, workOrderId: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-steel-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">Seçiniz</option>
                    {workOrders.map((wo) => <option key={wo.id} value={wo.id}>{wo.orderNumber} - {wo.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">KDV Oranı (%)</label>
                  <input type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Vade Tarihi</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-steel-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-steel-300">Kalemler</label>
                  <button type="button" onClick={addItem} className="text-xs text-brand-400 hover:text-brand-300">+ Kalem Ekle</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <input type="text" required placeholder="Açıklama" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                      </div>
                      <div className="w-20">
                        <input type="number" placeholder="Adet" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                      </div>
                      <div className="w-28">
                        <input type="number" step="0.01" placeholder="Fiyat" value={item.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                          className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                      </div>
                      {form.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(idx)} className="p-2 text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-steel-400 hover:text-white text-sm transition-colors">İptal</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-all">
                  <Save className="w-4 h-4" />{saving ? 'Oluşturuluyor...' : 'Fatura Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
