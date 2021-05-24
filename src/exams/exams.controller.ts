import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
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
import { CanCreateExam } from './guards/can-create-exam.guard';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, CanCreateExam)
  async createExam(
    @Body() createExamDTO: CreateExamDTO,
  ): Promise<CreateExamResponseDTO> {
    const data = await this.examsService.createExam(createExamDTO);
    return {
      success: true,
      message: 'exam has been created',
      data,
    };
  }

  @Get(':examId')
  async findExam(@Param('examId') examId: string) {
    const data = await this.examsService.findExam({ _id: examId });
    return {
      success: true,
      data,
    };
  }

  @Get('')
  async findExamsForOrganization(
    @Query('organizationId') organizationId: string,
  ) {
    const data = await this.examsService.findExamsForOrganization(
      organizationId,
    );
    return {
      success: true,
      data,
    };
  }

  @Get(':examId/questions')
  async getExamQuestions(@Param('examId') examId: string) {
    const data = await this.examsService.getExamQuestions(examId);
    return {
      success: true,
      count: data.length,
      data,
    };
  }

  @Delete(':examId')
  async deleteExam(@Param('examId') examId: string) {
    await this.examsService.deleteExam(examId);
    return {
      success: true,
      message: 'exam has been deleted',
    };
  }

  @Post(':examId/invite-examinee')
  async inviteExaminee(
    @Param('examId') examId: string,
    @Body() inviteExamineeDTO: InviteExamineeDTO,
  ) {
    await this.examsService.inviteExaminee(examId, inviteExamineeDTO);
    return {
      success: true,
      message: 'Invitation has been sent',
    };
  }

  @Get(':examId/invitations')
  async getInvitedExaminees(@Param('examId') examId: string) {
    const data = await this.examsService.getInvitedExaminees(examId);
    return {
      success: true,
      count: data.length,
      data,
    };
  }
}
