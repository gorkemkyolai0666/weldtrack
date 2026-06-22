import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('demo123456', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'demo@kaynakatolyesi.com.tr' },
    update: {},
    create: {
      email: 'demo@kaynakatolyesi.com.tr',
      password: hashedPassword,
      name: 'Ahmet Demir',
      role: 'ADMIN',
    },
  });

  const operatorUser = await prisma.user.upsert({
    where: { email: 'operator@kaynakatolyesi.com.tr' },
    update: {},
    create: {
      email: 'operator@kaynakatolyesi.com.tr',
      password: hashedPassword,
      name: 'Mehmet Yıldız',
      role: 'OPERATOR',
    },
  });

  const customer1 = await prisma.customer.upsert({
    where: { id: 'cust-demir-ins' },
    update: {},
    create: {
      id: 'cust-demir-ins',
      companyName: 'Demir İnşaat A.Ş.',
      contactName: 'Kemal Öztürk',
      email: 'kemal@demirinsaat.com.tr',
      phone: '0532 111 2233',
      address: 'Ankara, Ostim OSB, 3. Cadde No:45',
      taxNumber: '1234567890',
      notes: 'Büyük çelik konstrüksiyon projeleri',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 'cust-atlas-mak' },
    update: {},
    create: {
      id: 'cust-atlas-mak',
      companyName: 'Atlas Makine Ltd. Şti.',
      contactName: 'Fatma Çelik',
      email: 'fatma@atlasmakine.com.tr',
      phone: '0533 444 5566',
      address: 'İstanbul, İkitelli OSB, 7. Sokak No:12',
      taxNumber: '9876543210',
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { id: 'cust-yildiz-end' },
    update: {},
    create: {
      id: 'cust-yildiz-end',
      companyName: 'Yıldız Endüstri',
      contactName: 'Ali Kaya',
      email: 'ali@yildizend.com.tr',
      phone: '0535 777 8899',
      address: 'Bursa, DOSAB, 2. Cadde No:78',
      taxNumber: '5678901234',
    },
  });

  const worker1 = await prisma.worker.upsert({
    where: { id: 'wrk-usta-hasan' },
    update: {},
    create: {
      id: 'wrk-usta-hasan',
      name: 'Hasan Karakaş',
      phone: '0536 222 3344',
      specialization: 'TIG Kaynak',
      certifications: 'EN ISO 9606-1, ASME IX',
      dailyRate: 2500,
      isActive: true,
    },
  });

  const worker2 = await prisma.worker.upsert({
    where: { id: 'wrk-usta-osman' },
    update: {},
    create: {
      id: 'wrk-usta-osman',
      name: 'Osman Yılmaz',
      phone: '0537 333 4455',
      specialization: 'MIG/MAG Kaynak',
      certifications: 'EN ISO 9606-1',
      dailyRate: 2200,
      isActive: true,
    },
  });

  const worker3 = await prisma.worker.upsert({
    where: { id: 'wrk-usta-veli' },
    update: {},
    create: {
      id: 'wrk-usta-veli',
      name: 'Veli Arslan',
      phone: '0538 555 6677',
      specialization: 'Elektrik Ark Kaynağı',
      certifications: 'EN ISO 9606-1, AWS D1.1',
      dailyRate: 2000,
      isActive: true,
    },
  });

  const mat1 = await prisma.material.upsert({
    where: { id: 'mat-celik-levha' },
    update: {},
    create: {
      id: 'mat-celik-levha',
      name: 'St37 Çelik Levha 10mm',
      category: 'STEEL',
      unit: 'kg',
      unitPrice: 28.5,
      stockQty: 2500,
      minStockQty: 500,
      supplier: 'Kardemir A.Ş.',
    },
  });

  const mat2 = await prisma.material.upsert({
    where: { id: 'mat-paslanmaz' },
    update: {},
    create: {
      id: 'mat-paslanmaz',
      name: '304 Paslanmaz Çelik Boru',
      category: 'STEEL',
      unit: 'metre',
      unitPrice: 185.0,
      stockQty: 120,
      minStockQty: 20,
      supplier: 'İsdemir A.Ş.',
    },
  });

  const mat3 = await prisma.material.upsert({
    where: { id: 'mat-kaynak-teli' },
    update: {},
    create: {
      id: 'mat-kaynak-teli',
      name: 'ER70S-6 Kaynak Teli 1.2mm',
      category: 'ROD',
      unit: 'kg',
      unitPrice: 65.0,
      stockQty: 350,
      minStockQty: 50,
      supplier: 'Askaynak',
    },
  });

  const mat4 = await prisma.material.upsert({
    where: { id: 'mat-argon-gaz' },
    update: {},
    create: {
      id: 'mat-argon-gaz',
      name: 'Argon Gazı Tüp (50L)',
      category: 'GAS',
      unit: 'tüp',
      unitPrice: 950.0,
      stockQty: 8,
      minStockQty: 3,
      supplier: 'Linde Gaz',
    },
  });

  const mat5 = await prisma.material.upsert({
    where: { id: 'mat-taslama' },
    update: {},
    create: {
      id: 'mat-taslama',
      name: 'Taşlama Diski 125mm',
      category: 'CONSUMABLE',
      unit: 'adet',
      unitPrice: 18.5,
      stockQty: 200,
      minStockQty: 50,
      supplier: 'Bosch Türkiye',
    },
  });

  const wo1 = await prisma.workOrder.upsert({
    where: { orderNumber: 'WO-2026-001' },
    update: {},
    create: {
      orderNumber: 'WO-2026-001',
      title: 'Fabrika Çelik Merdiven İmalatı',
      description: 'Demir İnşaat fabrika binası için 3 katlı çelik merdiven imalatı ve montajı',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: new Date('2026-06-15'),
      dueDate: new Date('2026-07-10'),
      totalCost: 45000,
      customerId: customer1.id,
      createdById: adminUser.id,
    },
  });

  const wo2 = await prisma.workOrder.upsert({
    where: { orderNumber: 'WO-2026-002' },
    update: {},
    create: {
      orderNumber: 'WO-2026-002',
      title: 'Paslanmaz Boru Hattı Kaynağı',
      description: 'Atlas Makine tesisi için 120 metre paslanmaz çelik boru hattı TIG kaynağı',
      status: 'WELDING',
      priority: 'URGENT',
      startDate: new Date('2026-06-18'),
      dueDate: new Date('2026-06-30'),
      totalCost: 78000,
      customerId: customer2.id,
      createdById: adminUser.id,
    },
  });

  const wo3 = await prisma.workOrder.upsert({
    where: { orderNumber: 'WO-2026-003' },
    update: {},
    create: {
      orderNumber: 'WO-2026-003',
      title: 'Depo Raf Sistemi Kaynak İşi',
      description: 'Yıldız Endüstri deposu için 50 adet ağır hizmet tipi raf sistemi kaynak ve montajı',
      status: 'PENDING',
      priority: 'MEDIUM',
      dueDate: new Date('2026-07-20'),
      totalCost: 32000,
      customerId: customer3.id,
      createdById: operatorUser.id,
    },
  });

  const wo4 = await prisma.workOrder.upsert({
    where: { orderNumber: 'WO-2026-004' },
    update: {},
    create: {
      orderNumber: 'WO-2026-004',
      title: 'Konveyör Bant Tamir Kaynağı',
      description: 'Atlas Makine konveyör bant sistemi çelik gövde tamiri',
      status: 'COMPLETED',
      priority: 'HIGH',
      startDate: new Date('2026-06-01'),
      dueDate: new Date('2026-06-12'),
      completedAt: new Date('2026-06-10'),
      totalCost: 15500,
      customerId: customer2.id,
      createdById: adminUser.id,
    },
  });

  await prisma.workOrderItem.deleteMany({
    where: { workOrderId: wo1.id },
  });
  await prisma.workOrderItem.createMany({
    data: [
      { workOrderId: wo1.id, description: 'Çelik profil kesim ve kaynak', quantity: 1, unitCost: 25000, totalCost: 25000, materialId: mat1.id, workerId: worker2.id },
      { workOrderId: wo1.id, description: 'Merdiven basamak imalatı', quantity: 36, unitCost: 350, totalCost: 12600, materialId: mat1.id, workerId: worker3.id },
      { workOrderId: wo1.id, description: 'Korkuluk ve küpeşte kaynağı', quantity: 1, unitCost: 7400, totalCost: 7400, workerId: worker1.id },
    ],
  });

  await prisma.workOrderItem.deleteMany({
    where: { workOrderId: wo2.id },
  });
  await prisma.workOrderItem.createMany({
    data: [
      { workOrderId: wo2.id, description: 'TIG kaynak işçiliği (120m boru)', quantity: 120, unitCost: 450, totalCost: 54000, materialId: mat2.id, workerId: worker1.id },
      { workOrderId: wo2.id, description: 'Argon gazı', quantity: 6, unitCost: 950, totalCost: 5700, materialId: mat4.id },
      { workOrderId: wo2.id, description: 'Boru tesisat montajı', quantity: 1, unitCost: 18300, totalCost: 18300, workerId: worker2.id },
    ],
  });

  await prisma.qualityCheck.deleteMany({
    where: { workOrderId: wo4.id },
  });
  await prisma.qualityCheck.create({
    data: {
      workOrderId: wo4.id,
      checkType: 'Görsel Muayene',
      result: 'PASSED',
      notes: 'Kaynak dikişleri düzgün, çatlak yok',
      inspectedBy: 'Hasan Karakaş',
    },
  });

  await prisma.qualityCheck.deleteMany({
    where: { workOrderId: wo2.id },
  });
  await prisma.qualityCheck.create({
    data: {
      workOrderId: wo2.id,
      checkType: 'Radyografik Test (RT)',
      result: 'PENDING',
      notes: 'Boru hattı kaynak dikişleri röntgen kontrolü bekleniyor',
      inspectedBy: 'Hasan Karakaş',
    },
  });

  const inv1 = await prisma.invoice.upsert({
    where: { invoiceNumber: 'FTR-2026-001' },
    update: {},
    create: {
      invoiceNumber: 'FTR-2026-001',
      status: 'PAID',
      subtotal: 15500,
      taxRate: 20,
      taxAmount: 3100,
      totalAmount: 18600,
      issuedAt: new Date('2026-06-10'),
      dueDate: new Date('2026-06-25'),
      paidAt: new Date('2026-06-20'),
      customerId: customer2.id,
      workOrderId: wo4.id,
      userId: adminUser.id,
    },
  });

  await prisma.invoiceItem.deleteMany({
    where: { invoiceId: inv1.id },
  });
  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: inv1.id, description: 'Konveyör gövde tamir kaynağı', quantity: 1, unitPrice: 12000, totalPrice: 12000 },
      { invoiceId: inv1.id, description: 'Malzeme bedeli', quantity: 1, unitPrice: 2500, totalPrice: 2500 },
      { invoiceId: inv1.id, description: 'Nakliye ve montaj', quantity: 1, unitPrice: 1000, totalPrice: 1000 },
    ],
  });

  console.log('Seed data loaded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
