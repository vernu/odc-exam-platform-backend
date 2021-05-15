import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateExamDTO } from './dto/exam.dto';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createExam(@Body() createExamDTO: CreateExamDTO) {
    return this.examsService.createExam(createExamDTO);
  }

  @Get(':examId')
  getASingleExam(@Param('examId') examId: string) {
    return this.examsService.findExamById(examId);
  }
}