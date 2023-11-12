import { Test, TestingModule } from '@nestjs/testing';
import { MyPropertyService } from './my-property.service';

describe('MyPropertyService', () => {
  let service: MyPropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyPropertyService],
    }).compile();

    service = module.get<MyPropertyService>(MyPropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
