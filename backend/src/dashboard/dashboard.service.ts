import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalWorkOrders,
      activeWorkOrders,
      completedWorkOrders,
      totalCustomers,
      totalWorkers,
      totalMaterials,
      totalInvoices,
      paidInvoices,
    ] = await Promise.all([
      this.prisma.workOrder.count(),
      this.prisma.workOrder.count({ where: { status: { in: ['IN_PROGRESS', 'WELDING', 'QUALITY_CHECK'] } } }),
      this.prisma.workOrder.count({ where: { status: 'COMPLETED' } }),
      this.prisma.customer.count(),
      this.prisma.worker.count({ where: { isActive: true } }),
      this.prisma.material.count(),
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: 'PAID' } }),
    ]);

    const revenueResult = await this.prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'PAID' },
    });

    const pendingRevenueResult = await this.prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['SENT', 'DRAFT'] } },
    });

    const lowStockMaterials = await this.prisma.material.findMany();
    const lowStockCount = lowStockMaterials.filter((m) => m.stockQty <= m.minStockQty).length;

    const recentWorkOrders = await this.prisma.workOrder.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { companyName: true } },
      },
    });

    const recentInvoices = await this.prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { companyName: true } },
      },
    });

    const statusBreakdown = await this.prisma.workOrder.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return {
      summary: {
        totalWorkOrders,
        activeWorkOrders,
        completedWorkOrders,
        totalCustomers,
        totalWorkers,
        totalMaterials,
        totalInvoices,
        paidInvoices,
        totalRevenue: revenueResult._sum.totalAmount || 0,
        pendingRevenue: pendingRevenueResult._sum.totalAmount || 0,
        lowStockCount,
      },
      recentWorkOrders,
      recentInvoices,
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
    };
  }
}
