import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateExamineeAnswerDTO } from '../dto/examinee-answer.dto';
import { CanUpdateExamineeAnswer } from '../guards/can-update-examinee-answer';
import { ExamineeAnswersService } from './examinee-answers.service';

@Controller('examinee-answers')
export class ExamineeAnswersController {
  constructor(private examineeAnswersService: ExamineeAnswersService) {}
  @Patch(':examineeAnswerId')
  @UseGuards(JwtAuthGuard, CanUpdateExamineeAnswer)
  async updateExamineeAnswer(
    @Param('examineeAnswerId') examineeAnswerId: string,
    @Body() updateExamineeAnswerDTO: UpdateExamineeAnswerDTO,
  ) {
    const data = await this.examineeAnswersService.updateExamineeAnswer(
      examineeAnswerId,
      updateExamineeAnswerDTO,
    );
    return { success: true, message: 'updated', data };
  }
}
