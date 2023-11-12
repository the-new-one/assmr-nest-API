import { Test, TestingModule } from '@nestjs/testing';
import { PropertyAsssumptionsService } from './property-asssumptions.service';

describe('PropertyAsssumptionsService', () => {
  let service: PropertyAsssumptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyAsssumptionsService],
    }).compile();

    service = module.get<PropertyAsssumptionsService>(
      PropertyAsssumptionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
