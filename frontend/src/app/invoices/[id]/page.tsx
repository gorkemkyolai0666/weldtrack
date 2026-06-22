'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { statusLabels, formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Edit3, Trash2, Save, CheckCircle, Send } from 'lucide-react';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-steel-600/20 text-steel-300 border-steel-600/30',
  SENT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PAID: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  OVERDUE: 'bg-red-500/20 text-red-400 border-red-500/30',
  CANCELLED: 'bg-steel-800/50 text-steel-500 border-steel-700/30',
};

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) api.getInvoice(id as string).then(setInvoice).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      const updated = await api.updateInvoice(id as string, { status });
      setInvoice({ ...invoice, ...updated });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!confirm('Bu faturayı silmek istediğinize emin misiniz?')) return;
    try { await api.deleteInvoice(id as string); router.push('/invoices'); } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!invoice) return <div className="text-steel-400 text-center py-16">Fatura bulunamadı</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/invoices" className="text-steel-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-brand-400 text-lg">{invoice.invoiceNumber}</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${statusColors[invoice.status]}`}>{statusLabels[invoice.status]}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {invoice.status === 'DRAFT' && (
            <button onClick={() => updateStatus('SENT')} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-all">
              <Send className="w-4 h-4" />Gönder
            </button>
          )}
          {invoice.status === 'SENT' && (
            <button onClick={() => updateStatus('PAID')} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-all">
              <CheckCircle className="w-4 h-4" />Ödendi
            </button>
          )}
          <button onClick={handleDelete} className="p-2 bg-steel-800 border border-red-700/50 rounded-lg text-red-400 hover:text-red-300 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Fatura Kalemleri</h3>
            {invoice.items && invoice.items.length > 0 ? (
              <>
                <div className="space-y-3 mb-6">
                  {invoice.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-steel-800/50 rounded-lg border border-steel-700/30">
                      <div>
                        <p className="text-sm text-white">{item.description}</p>
                        <p className="text-xs text-steel-500">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <p className="font-mono text-sm text-brand-400">{formatCurrency(item.totalPrice)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-steel-800 pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-steel-400">Ara Toplam</span><span className="font-mono text-white">{formatCurrency(invoice.subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-steel-400">KDV (%{invoice.taxRate})</span><span className="font-mono text-white">{formatCurrency(invoice.taxAmount)}</span></div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-steel-800"><span className="text-white">Toplam</span><span className="font-mono text-brand-400">{formatCurrency(invoice.totalAmount)}</span></div>
                </div>
              </>
            ) : (
              <p className="text-steel-500 text-center py-4">Fatura kalemi bulunamadı</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-sm font-mono text-steel-500 uppercase tracking-wider mb-3">Müşteri</h3>
            <p className="text-white font-medium">{invoice.customer?.companyName}</p>
            <p className="text-sm text-steel-400">{invoice.customer?.contactName}</p>
            {invoice.customer?.taxNumber && <p className="text-xs text-steel-500 mt-1">VN: {invoice.customer.taxNumber}</p>}
          </div>

          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-sm font-mono text-steel-500 uppercase tracking-wider mb-3">İş Emri</h3>
            <Link href={`/work-orders/${invoice.workOrder?.id}`} className="text-brand-400 hover:text-brand-300 text-sm">
              {invoice.workOrder?.orderNumber} — {invoice.workOrder?.title}
            </Link>
          </div>

          <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
            <h3 className="text-sm font-mono text-steel-500 uppercase tracking-wider mb-3">Tarihler</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-steel-400">Düzenlenme</span><span className="text-white">{formatDate(invoice.issuedAt)}</span></div>
              {invoice.dueDate && <div className="flex justify-between"><span className="text-steel-400">Vade</span><span className="text-white">{formatDate(invoice.dueDate)}</span></div>}
              {invoice.paidAt && <div className="flex justify-between"><span className="text-steel-400">Ödeme</span><span className="text-emerald-400">{formatDate(invoice.paidAt)}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
