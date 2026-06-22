import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';

@Injectable()
export class WorkOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string, priority?: string, search?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { orderNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.workOrder.findMany({
      where,
      include: {
        customer: { select: { id: true, companyName: true, contactName: true } },
        createdBy: { select: { id: true, name: true } },
        _count: { select: { items: true, qualityChecks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            material: { select: { id: true, name: true } },
            worker: { select: { id: true, name: true } },
          },
        },
        qualityChecks: { orderBy: { checkedAt: 'desc' } },
        invoices: { select: { id: true, invoiceNumber: true, status: true, totalAmount: true } },
      },
    });

    if (!workOrder) throw new NotFoundException('İş emri bulunamadı');
    return workOrder;
  }

  async create(dto: CreateWorkOrderDto, userId: string) {
    const count = await this.prisma.workOrder.count();
    const orderNumber = `WO-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const { items, ...orderData } = dto;

    const workOrder = await this.prisma.workOrder.create({
      data: {
        ...orderData,
        orderNumber,
        createdById: userId,
        items: items
          ? {
              create: items.map((item) => ({
                description: item.description,
                quantity: item.quantity || 1,
                unitCost: item.unitCost || 0,
                totalCost: (item.quantity || 1) * (item.unitCost || 0),
                materialId: item.materialId,
                workerId: item.workerId,
              })),
            }
          : undefined,
      },
      include: {
        customer: { select: { id: true, companyName: true } },
        items: true,
      },
    });

    if (workOrder.items.length > 0) {
      const totalCost = workOrder.items.reduce((sum, item) => sum + item.totalCost, 0);
      await this.prisma.workOrder.update({
        where: { id: workOrder.id },
        data: { totalCost },
      });
    }

    return workOrder;
  }

  async update(id: string, dto: UpdateWorkOrderDto) {
    await this.findOne(id);

    const { items, ...updateData } = dto;

    if (updateData.status === 'COMPLETED' && !updateData.completedAt) {
      (updateData as any).completedAt = new Date();
    }

    const workOrder = await this.prisma.workOrder.update({
      where: { id },
      data: updateData,
      include: {
        customer: { select: { id: true, companyName: true } },
        items: true,
      },
    });

    return workOrder;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.workOrder.delete({ where: { id } });
  }

  async addQualityCheck(workOrderId: string, data: { checkType: string; result?: string; notes?: string; inspectedBy?: string }) {
    await this.findOne(workOrderId);
    return this.prisma.qualityCheck.create({
      data: {
        workOrderId,
        checkType: data.checkType,
        result: (data.result as any) || 'PENDING',
        notes: data.notes,
        inspectedBy: data.inspectedBy,
      },
    });
  }
}
