import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, search?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { supplier: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.material.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const material = await this.prisma.material.findUnique({ where: { id } });
    if (!material) throw new NotFoundException('Malzeme bulunamadı');
    return material;
  }

  async create(dto: CreateMaterialDto) {
    return this.prisma.material.create({ data: dto });
  }

  async update(id: string, dto: UpdateMaterialDto) {
    await this.findOne(id);
    return this.prisma.material.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.material.delete({ where: { id } });
  }

  async getLowStock() {
    return this.prisma.material.findMany({
      where: {
        stockQty: { lte: this.prisma.material.fields?.minStockQty as any },
      },
      orderBy: { stockQty: 'asc' },
    });
  }

  async getLowStockItems() {
    const materials = await this.prisma.material.findMany();
    return materials.filter((m) => m.stockQty <= m.minStockQty);
  }
}
