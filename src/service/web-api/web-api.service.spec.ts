import { Test, TestingModule } from '@nestjs/testing';
import { WebApiService } from './web-api.service';

describe('WebApiService', () => {
  let service: WebApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebApiService],
    }).compile();

    service = module.get<WebApiService>(WebApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
