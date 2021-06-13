import { Test, TestingModule } from '@nestjs/testing';
import { ExamineeAnswersService } from './examinee-answers.service';

describe('ExamineeAnswersService', () => {
  let service: ExamineeAnswersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamineeAnswersService],
    }).compile();

    service = module.get<ExamineeAnswersService>(ExamineeAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
