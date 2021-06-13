import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateExamQuestionDTO } from '../dto/exam-question.dto';
import { ExamQuestionsService } from './exam-questions.service';

@Controller('exam-questions')
export class ExamQuestionsController {
  constructor(private examQuestionsService: ExamQuestionsService) {}
  @Patch(':examQuestionId')
  async updateExamineeAnswer(
    @Param('examQuestionId') examQuestionId: string,
    @Body() updateExamQuestionDTO: UpdateExamQuestionDTO,
  ) {
    await this.examQuestionsService.updateExamQuestion(
      examQuestionId,
      updateExamQuestionDTO,
    );
    return { success: true, message: 'exam question has been updated' };
  }
}
