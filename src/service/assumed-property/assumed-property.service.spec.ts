import { Test, TestingModule } from '@nestjs/testing';
import { AssumedPropertyService } from './assumed-property.service';

describe('AssumedPropertyService', () => {
  let service: AssumedPropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssumedPropertyService],
    }).compile();

    service = module.get<AssumedPropertyService>(AssumedPropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
