import { Test, TestingModule } from '@nestjs/testing';
import { InclusionController } from './inclusion.controller';

describe('InclusionController', () => {
  let controller: InclusionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InclusionController],
    }).compile();

    controller = module.get<InclusionController>(InclusionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
