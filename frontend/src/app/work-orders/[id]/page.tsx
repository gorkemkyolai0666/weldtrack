'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { statusLabels, priorityLabels, formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { ArrowLeft, Edit3, Trash2, CheckCircle, Shield, Package, HardHat, Save } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-steel-600/20 text-steel-300 border-steel-600/30',
  IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  WELDING: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
  QUALITY_CHECK: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const qcResultColors: Record<string, string> = {
  PENDING: 'text-amber-400 bg-amber-500/10',
  PASSED: 'text-emerald-400 bg-emerald-500/10',
  FAILED: 'text-red-400 bg-red-500/10',
  CONDITIONAL: 'text-purple-400 bg-purple-500/10',
};

export default function WorkOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [wo, setWo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', priority: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      api.getWorkOrder(id as string).then((data) => {
        setWo(data);
        setEditForm({ status: data.status, priority: data.priority, notes: data.notes || '' });
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateWorkOrder(id as string, editForm);
      setWo({ ...wo, ...updated });
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bu iş emrini silmek istediğinize emin misiniz?')) return;
    try {
      await api.deleteWorkOrder(id as string);
      router.push('/work-orders');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!wo) return <div className="text-steel-400 text-center py-16">İş emri bulunamadı</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/work-orders" className="text-steel-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-brand-400 text-sm">{wo.orderNumber}</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${statusColors[wo.status]}`}>
              {statusLabels[wo.status]}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{wo.title}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(!editing)} className="p-2 bg-steel-800 border border-steel-700 rounded-lg text-steel-300 hover:text-white transition-colors">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-2 bg-steel-800 border border-red-700/50 rounded-lg text-red-400 hover:text-red-300 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {editing && (
        <div className="bg-steel-900 border border-brand-600/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Düzenle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-steel-400 mb-1">Durum</label>
              <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-steel-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                {Object.entries(statusLabels).filter(([k]) => ['PENDING','IN_PROGRESS','WELDING','QUALITY_CHECK','COMPLETED','CANCELLED'].includes(k)).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-steel-400 mb-1">Öncelik</label>
              <select value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-steel-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                {Object.entries(priorityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-steel-400 mb-1">Notlar</label>
            <textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-steel-800 border border-steel-700 rounded-lg text-steel-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" rows={3} />
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-all">
            <Save className="w-4 h-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Detaylar</h3>
            {wo.description && <p className="text-steel-300 text-sm mb-4">{wo.description}</p>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-steel-500 font-mono uppercase">Öncelik</p>
                <p className="text-sm text-white font-medium mt-1">{priorityLabels[wo.priority]}</p>
              </div>
              <div>
                <p className="text-xs text-steel-500 font-mono uppercase">Tutar</p>
                <p className="text-sm text-brand-400 font-mono font-medium mt-1">{formatCurrency(wo.totalCost)}</p>
              </div>
              <div>
                <p className="text-xs text-steel-500 font-mono uppercase">Başlangıç</p>
                <p className="text-sm text-white mt-1">{wo.startDate ? formatDate(wo.startDate) : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-steel-500 font-mono uppercase">Termin</p>
                <p className="text-sm text-white mt-1">{wo.dueDate ? formatDate(wo.dueDate) : '—'}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-400" />
              İş Kalemleri
            </h3>
            {wo.items && wo.items.length > 0 ? (
              <div className="space-y-3">
                {wo.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-steel-800/50 rounded-lg border border-steel-700/30">
                    <div>
                      <p className="text-sm text-white">{item.description}</p>
                      <div className="flex gap-3 mt-1 text-xs text-steel-400">
                        {item.material && <span className="flex items-center gap-1"><Package className="w-3 h-3" />{item.material.name}</span>}
                        {item.worker && <span className="flex items-center gap-1"><HardHat className="w-3 h-3" />{item.worker.name}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-brand-400">{formatCurrency(item.totalCost)}</p>
                      <p className="text-xs text-steel-500">{item.quantity} x {formatCurrency(item.unitCost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-steel-500 text-sm text-center py-4">Henüz kalem eklenmemiş</p>
            )}
          </div>

          {/* Quality Checks */}
          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Kalite Kontrol
            </h3>
            {wo.qualityChecks && wo.qualityChecks.length > 0 ? (
              <div className="space-y-3">
                {wo.qualityChecks.map((qc: any) => (
                  <div key={qc.id} className="p-3 bg-steel-800/50 rounded-lg border border-steel-700/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{qc.checkType}</p>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${qcResultColors[qc.result] || ''}`}>
                        {statusLabels[qc.result] || qc.result}
                      </span>
                    </div>
                    {qc.notes && <p className="text-xs text-steel-400 mt-1">{qc.notes}</p>}
                    <p className="text-xs text-steel-500 mt-1">{qc.inspectedBy} · {formatDateTime(qc.checkedAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-steel-500 text-sm text-center py-4">Henüz kalite kontrolü yapılmamış</p>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Müşteri</h3>
            <p className="text-white font-medium">{wo.customer?.companyName}</p>
            <p className="text-sm text-steel-400">{wo.customer?.contactName}</p>
            {wo.customer?.phone && <p className="text-sm text-steel-400 mt-1">{wo.customer.phone}</p>}
            {wo.customer?.email && <p className="text-sm text-steel-400">{wo.customer.email}</p>}
          </div>

          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Faturalar</h3>
            {wo.invoices && wo.invoices.length > 0 ? (
              <div className="space-y-2">
                {wo.invoices.map((inv: any) => (
                  <Link key={inv.id} href={`/invoices/${inv.id}`} className="block p-3 bg-steel-800/50 rounded-lg border border-steel-700/30 hover:border-brand-500/30 transition-all">
                    <p className="text-sm font-mono text-brand-400">{inv.invoiceNumber}</p>
                    <p className="text-xs text-steel-400">{formatCurrency(inv.totalAmount)}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-steel-500 text-sm text-center py-4">Henüz fatura kesilmemiş</p>
            )}
          </div>

          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-sm font-mono text-steel-500 uppercase tracking-wider mb-3">Meta Bilgi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-steel-400">Oluşturan</span>
                <span className="text-white">{wo.createdBy?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel-400">Oluşturulma</span>
                <span className="text-white">{formatDate(wo.createdAt)}</span>
              </div>
              {wo.completedAt && (
                <div className="flex justify-between">
                  <span className="text-steel-400">Tamamlanma</span>
                  <span className="text-emerald-400">{formatDate(wo.completedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
