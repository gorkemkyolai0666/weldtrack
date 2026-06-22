'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, statusLabels, formatDate } from '@/lib/utils';
import {
  ClipboardList, Users, HardHat, Package, FileText,
  TrendingUp, AlertTriangle, CheckCircle2, Clock, Flame,
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { summary, recentWorkOrders, recentInvoices, statusBreakdown } = data;

  const statCards = [
    { label: 'Aktif İş Emirleri', value: summary.activeWorkOrders, icon: ClipboardList, color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/30' },
    { label: 'Toplam Müşteri', value: summary.totalCustomers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    { label: 'Aktif Ustalar', value: summary.totalWorkers, icon: HardHat, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Toplam Gelir', value: formatCurrency(summary.totalRevenue), icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
    { label: 'Bekleyen Gelir', value: formatCurrency(summary.pendingRevenue), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    { label: 'Düşük Stok', value: summary.lowStockCount, icon: AlertTriangle, color: summary.lowStockCount > 0 ? 'text-red-400' : 'text-steel-400', bg: summary.lowStockCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-steel-800/50 border-steel-700/30' },
  ];

  const statusColorMap: Record<string, string> = {
    PENDING: 'bg-steel-600',
    IN_PROGRESS: 'bg-blue-500',
    WELDING: 'bg-brand-500',
    QUALITY_CHECK: 'bg-purple-500',
    COMPLETED: 'bg-emerald-500',
    CANCELLED: 'bg-red-500',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Flame className="w-7 h-7 text-brand-500" />
          Kontrol Paneli
        </h1>
        <p className="text-steel-400 mt-1">Atölye operasyonlarınızın genel görünümü</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-xl border p-5 ${card.bg} transition-all hover:scale-[1.02]`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-steel-400 font-mono uppercase tracking-wider">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              </div>
              <card.icon className={`w-8 h-8 ${card.color} opacity-60`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">İş Emri Durumları</h3>
          <div className="space-y-3">
            {statusBreakdown.map((item: any) => {
              const total = summary.totalWorkOrders || 1;
              const percent = Math.round((item.count / total) * 100);
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-steel-300">{statusLabels[item.status] || item.status}</span>
                    <span className="text-steel-400 font-mono">{item.count}</span>
                  </div>
                  <div className="h-2 bg-steel-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${statusColorMap[item.status] || 'bg-steel-600'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {statusBreakdown.length === 0 && (
              <p className="text-steel-500 text-sm text-center py-4">Henüz iş emri bulunmuyor</p>
            )}
          </div>
        </div>

        {/* Recent Work Orders */}
        <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Son İş Emirleri</h3>
          <div className="space-y-3">
            {recentWorkOrders.map((wo: any) => (
              <div key={wo.id} className="flex items-center gap-3 p-3 bg-steel-800/50 rounded-lg border border-steel-700/30">
                <div className={`w-2 h-8 rounded-full flex-shrink-0 ${statusColorMap[wo.status] || 'bg-steel-600'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{wo.title}</p>
                  <p className="text-xs text-steel-400">{wo.customer?.companyName} · {wo.orderNumber}</p>
                </div>
              </div>
            ))}
            {recentWorkOrders.length === 0 && (
              <div className="text-center py-8">
                <ClipboardList className="w-10 h-10 text-steel-700 mx-auto mb-2" />
                <p className="text-steel-500 text-sm">Henüz iş emri yok</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-steel-900 border border-steel-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Son Faturalar</h3>
          <div className="space-y-3">
            {recentInvoices.map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-steel-800/50 rounded-lg border border-steel-700/30">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{inv.invoiceNumber}</p>
                  <p className="text-xs text-steel-400">{inv.customer?.companyName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-mono font-medium text-brand-400">{formatCurrency(inv.totalAmount)}</p>
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                    inv.status === 'OVERDUE' ? 'bg-red-500/20 text-red-400' :
                    'bg-steel-700/50 text-steel-400'
                  }`}>
                    {statusLabels[inv.status] || inv.status}
                  </span>
                </div>
              </div>
            ))}
            {recentInvoices.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-steel-700 mx-auto mb-2" />
                <p className="text-steel-500 text-sm">Henüz fatura yok</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
