import { Test, TestingModule } from '@nestjs/testing';
import { MyPropertyController } from './my-property.controller';

describe('MyPropertyController', () => {
  let controller: MyPropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyPropertyController],
    }).compile();

    controller = module.get<MyPropertyController>(MyPropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
