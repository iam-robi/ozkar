import { Test, TestingModule } from '@nestjs/testing';
import { AppleResolver } from './apple.resolver';

describe('AppleResolver', () => {
  let resolver: AppleResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppleResolver],
    }).compile();

    resolver = module.get<AppleResolver>(AppleResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
