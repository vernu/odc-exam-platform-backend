import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionsService } from './exam-questions.service';

describe('ExamQuestionsService', () => {
  let service: ExamQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamQuestionsService],
    }).compile();

    service = module.get<ExamQuestionsService>(ExamQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
