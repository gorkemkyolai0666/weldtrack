import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async findAll(active?: string) {
    const where = active === 'true' ? { isActive: true } : {};
    return this.prisma.worker.findMany({
      where,
      include: { _count: { select: { workOrderItems: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { id },
      include: {
        workOrderItems: {
          include: { workOrder: { select: { id: true, orderNumber: true, title: true, status: true } } },
          orderBy: { workOrder: { createdAt: 'desc' } },
          take: 10,
        },
      },
    });

    if (!worker) throw new NotFoundException('İşçi/usta bulunamadı');
    return worker;
  }

  async create(dto: CreateWorkerDto) {
    return this.prisma.worker.create({ data: dto });
  }

  async update(id: string, dto: UpdateWorkerDto) {
    await this.findOne(id);
    return this.prisma.worker.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.worker.delete({ where: { id } });
  }
}
