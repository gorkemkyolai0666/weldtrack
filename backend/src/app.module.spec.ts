import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { HealthController } from './health/health.controller';
import { AuthController } from './auth/auth.controller';
import { CustomersController } from './customers/customers.controller';
import { WorkOrdersController } from './work-orders/work-orders.controller';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterAll(async () => {
    if (module) await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have health controller', () => {
    const controller = module.get(HealthController);
    expect(controller).toBeDefined();
  });

  it('should have auth controller', () => {
    const controller = module.get(AuthController);
    expect(controller).toBeDefined();
  });

  it('should have customers controller', () => {
    const controller = module.get(CustomersController);
    expect(controller).toBeDefined();
  });

  it('should have work-orders controller', () => {
    const controller = module.get(WorkOrdersController);
    expect(controller).toBeDefined();
  });
});
