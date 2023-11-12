import { Test, TestingModule } from '@nestjs/testing';
import { AssumedPropertyController } from './assumed-property.controller';

describe('AssumedPropertyController', () => {
  let controller: AssumedPropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssumedPropertyController],
    }).compile();

    controller = module.get<AssumedPropertyController>(AssumedPropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
