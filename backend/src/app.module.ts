import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { WorkersModule } from './workers/workers.module';
import { MaterialsModule } from './materials/materials.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { InvoicesModule } from './invoices/invoices.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    WorkersModule,
    MaterialsModule,
    WorkOrdersModule,
    InvoicesModule,
    DashboardModule,
    HealthModule,
  ],
})
export class AppModule {}
