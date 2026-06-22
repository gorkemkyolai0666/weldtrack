'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { statusLabels, priorityLabels, formatDate, formatCurrency } from '@/lib/utils';
import { ClipboardList, Plus, Search, Filter, Calendar, ArrowRight } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-steel-600/20 text-steel-300 border-steel-600/30',
  IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  WELDING: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
  QUALITY_CHECK: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const priorityColors: Record<string, string> = {
  LOW: 'text-steel-400',
  MEDIUM: 'text-blue-400',
  HIGH: 'text-amber-400',
  URGENT: 'text-red-400',
};

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', customerId: '', priority: 'MEDIUM', dueDate: '' });

  const loadData = () => {
    setLoading(true);
    api.getWorkOrders(statusFilter, '', search).then(setWorkOrders).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [statusFilter, search]);
  useEffect(() => { api.getCustomers().then(setCustomers).catch(console.error); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createWorkOrder(form);
      setShowCreateModal(false);
      setForm({ title: '', description: '', customerId: '', priority: 'MEDIUM', dueDate: '' });
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-brand-500" />
            İş Emirleri
          </h1>
          <p className="text-steel-400 mt-1">Tüm kaynak ve metal işleri siparişleri</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-brand-600/20"
        >
          <Plus className="w-4 h-4" />
          Yeni İş Emri
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-500" />
          <input
            type="text"
            placeholder="İş emri ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-steel-900 border border-steel-700 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-steel-900 border border-steel-700 rounded-lg text-steel-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        >
          <option value="">Tüm Durumlar</option>
          <option value="PENDING">Beklemede</option>
          <option value="IN_PROGRESS">Devam Ediyor</option>
          <option value="WELDING">Kaynak Aşamasında</option>
          <option value="QUALITY_CHECK">Kalite Kontrol</option>
          <option value="COMPLETED">Tamamlandı</option>
          <option value="CANCELLED">İptal Edildi</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : workOrders.length === 0 ? (
        <div className="text-center py-16 bg-steel-900 border border-steel-800 rounded-xl">
          <ClipboardList className="w-16 h-16 text-steel-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-steel-300 mb-2">Henüz iş emri bulunmuyor</h3>
          <p className="text-steel-500 text-sm mb-6">İlk iş emrinizi oluşturmak için yukarıdaki butonu kullanın</p>
          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-500 transition-colors">
            <Plus className="w-4 h-4 inline mr-1" />
            İş Emri Oluştur
          </button>
        </div>
      ) : (
        <div className="bg-steel-900 border border-steel-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-steel-800">
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Sipariş No</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Başlık</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Müşteri</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Durum</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Öncelik</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Tutar</th>
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-steel-500">Termin</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map((wo) => (
                  <tr key={wo.id} className="border-b border-steel-800/50 hover:bg-steel-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-brand-400">{wo.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{wo.title}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-steel-300">{wo.customer?.companyName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-mono px-2 py-1 rounded border ${statusColors[wo.status] || ''}`}>
                        {statusLabels[wo.status] || wo.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${priorityColors[wo.priority] || ''}`}>
                        {priorityLabels[wo.priority] || wo.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-steel-200">{formatCurrency(wo.totalCost)}</td>
                    <td className="px-4 py-3 text-sm text-steel-400">{wo.dueDate ? formatDate(wo.dueDate) : '—'}</td>
                    <td className="px-4 py-3">
                      <Link href={`/work-orders/${wo.id}`} className="text-brand-400 hover:text-brand-300 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-steel-900 border border-steel-700 rounded-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Yeni İş Emri</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">Başlık</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-steel-800 border border-steel-700 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  placeholder="Çelik merdiven imalatı" />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">Açıklama</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-steel-800 border border-steel-700 rounded-lg text-white placeholder-steel-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  rows={3} placeholder="İş emri detayları..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Müşteri</label>
                  <select required value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-steel-800 border border-steel-700 rounded-lg text-steel-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
                    <option value="">Seçiniz</option>
                    {customers.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-300 mb-1">Öncelik</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-4 py-2.5 bg-steel-800 border border-steel-700 rounded-lg text-steel-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
                    <option value="LOW">Düşük</option>
                    <option value="MEDIUM">Orta</option>
                    <option value="HIGH">Yüksek</option>
                    <option value="URGENT">Acil</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">Termin Tarihi</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-steel-800 border border-steel-700 rounded-lg text-steel-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-steel-400 hover:text-white transition-colors text-sm">İptal</button>
                <button type="submit" disabled={creating} className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium text-sm disabled:opacity-50 transition-all">
                  {creating ? 'Oluşturuluyor...' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
