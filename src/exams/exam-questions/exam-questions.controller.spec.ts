import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionsController } from './exam-questions.controller';

describe('ExamQuestionsController', () => {
  let controller: ExamQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamQuestionsController],
    }).compile();

    controller = module.get<ExamQuestionsController>(ExamQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
