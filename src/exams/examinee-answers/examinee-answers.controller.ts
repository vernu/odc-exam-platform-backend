import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateExamineeAnswerDTO } from '../dto/examinee-answer.dto';
import { ExamineeAnswersService } from './examinee-answers.service';

@Controller('examinee-answers')
export class ExamineeAnswersController {
  constructor(private examineeAnswersService: ExamineeAnswersService) {}
  @Patch(':examineeAnswerId')
  async updateExamineeAnswer(
    @Param('examineeAnswerId') examineeAnswerId: string,
    @Body() updateExamineeAnswerDTO: UpdateExamineeAnswerDTO,
  ) {
    await this.examineeAnswersService.updateExamineeAnswer(
      examineeAnswerId,
      updateExamineeAnswerDTO,
    );
    return { success: true, message: 'updated' };
  }
}
