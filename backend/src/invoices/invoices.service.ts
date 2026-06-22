import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {};
    return this.prisma.invoice.findMany({
      where,
      include: {
        customer: { select: { id: true, companyName: true } },
        workOrder: { select: { id: true, orderNumber: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        workOrder: { select: { id: true, orderNumber: true, title: true, totalCost: true } },
        user: { select: { id: true, name: true } },
        items: true,
      },
    });

    if (!invoice) throw new NotFoundException('Fatura bulunamadı');
    return invoice;
  }

  async create(dto: CreateInvoiceDto, userId: string) {
    const count = await this.prisma.invoice.count();
    const invoiceNumber = `FTR-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const { items, ...invoiceData } = dto;
    const subtotal = items
      ? items.reduce((sum, item) => sum + (item.quantity || 1) * (item.unitPrice || 0), 0)
      : dto.subtotal || 0;
    const taxRate = dto.taxRate || 20;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    return this.prisma.invoice.create({
      data: {
        ...invoiceData,
        invoiceNumber,
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        userId,
        items: items
          ? {
              create: items.map((item) => ({
                description: item.description,
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || 0,
                totalPrice: (item.quantity || 1) * (item.unitPrice || 0),
              })),
            }
          : undefined,
      },
      include: { customer: true, items: true },
    });
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    await this.findOne(id);

    if (dto.status === 'PAID' && !dto.paidAt) {
      (dto as any).paidAt = new Date();
    }

    return this.prisma.invoice.update({
      where: { id },
      data: dto,
      include: { customer: true, items: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.invoice.delete({ where: { id } });
  }
}
