import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateExamDTO,
  CreateExamResponseDTO,
  InviteExamineeDTO,
} from './dto/exam.dto';
import { ExamsService } from './exams.service';
import { CanCreateOrganization } from './guards/can-create-exam.guard';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, CanCreateOrganization)
  async createExam(
    @Body() createExamDTO: CreateExamDTO,
  ): Promise<CreateExamResponseDTO> {
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

  @Get(':examId/questions')
  async getExamQuestions(@Param('examId') examId: string) {
    return {
      success: true,
      data: await this.examsService.getExamQuestions(examId),
    };
  }

  @Delete(':examId')
  async deleteExam(@Param('examId') examId: string) {
    return {
      success: true,
      message: await this.examsService.deleteExam(examId),
    };
  }

  @Post(':examId/invite-examinee')
  async inviteExaminee(
    @Param('examId') examId: string,
    @Body() inviteExamineeDTO: InviteExamineeDTO,
  ) {
    return {
      success: true,
      message: await this.examsService.inviteExaminee(
        examId,
        inviteExamineeDTO,
      ),
    };
  }
}
