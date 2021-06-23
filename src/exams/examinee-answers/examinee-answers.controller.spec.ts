import { Test, TestingModule } from '@nestjs/testing';
import { ExamineeAnswersController } from './examinee-answers.controller';

describe('ExamineeAnswersController', () => {
  let controller: ExamineeAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamineeAnswersController],
    }).compile();

    controller = module.get<ExamineeAnswersController>(ExamineeAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
