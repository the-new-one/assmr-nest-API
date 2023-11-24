import { Test, TestingModule } from '@nestjs/testing';
import { PropertyAssumptionsController } from './property-assumptions.controller';

describe('PropertyAssumptionsController', () => {
  let controller: PropertyAssumptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyAssumptionsController],
    }).compile();

    controller = module.get<PropertyAssumptionsController>(PropertyAssumptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
