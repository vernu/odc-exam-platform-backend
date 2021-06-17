import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateQuestionDTO } from '../dto/question.dto';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}
  @Patch(':questionId')
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() updateQuestionDTO: UpdateQuestionDTO,
  ) {
    const data = await this.questionsService.updateQuestion(
      questionId,
      updateQuestionDTO,
    );
    return { success: true, message: 'question has been updated', data };
  }
}
