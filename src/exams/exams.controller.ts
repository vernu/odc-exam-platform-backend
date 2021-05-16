import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateExamDTO } from './dto/exam.dto';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createExam(@Body() createExamDTO: CreateExamDTO) {
    return {
      success: true,
      message: 'exam has been created',
      data: await this.examsService.createExam(createExamDTO),
    };
  }

  @Get(':examId')
  async findExam(@Param('examId') examId: string) {
    return {
      success: true,
      data: await this.examsService.findExam({ _id: examId }),
    };
  }
}
