import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CancelExamInvitationsDTO,
  CreateExamDTO,
  CreateExamResponseDTO,
  InviteExamineesDTO,
  SendEmailToInvitedExamineesDTO,
  StartExamDTO,
  SubmitAnswersDTO,
  UpdateExamDTO,
} from './dto/exam.dto';
import { ExamsService } from './exams.service';
import { CanCreateExam } from './guards/can-create-exam.guard';
import { CanDeleteExam } from './guards/can-delete-exam';
import { CanInviteExaminees } from './guards/can-invite-examinees';
import { CanUpdateExam } from './guards/can-update-exam.guard';
import { CanViewExamStats } from './guards/can-view-exam-stats';

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
  @Patch(':examId')
  @UseGuards(JwtAuthGuard, CanUpdateExam)
  async updateExam(
    @Param('examId') examId: string,
    @Body() updateExamDTO: UpdateExamDTO,
  ): Promise<CreateExamResponseDTO> {
    const data = await this.examsService.updateExam(examId, updateExamDTO);
    return {
      success: true,
      message: 'exam has been updated',
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
  @Get(':examId/include-questions')
  async getExamIncludingQuestions(@Param('examId') examId: string) {
    const data = await this.examsService.getExamIncludingQuestions({
      _id: examId,
    });
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

  @Get('by-organization/:organizationId')
  async findExamsForOrganizationAlternative(
    @Param('organizationId') organizationId: string,
  ) {
    const data = await this.examsService.findExamsForOrganization(
      organizationId,
    );
    return {
      success: true,
      data,
    };
  }

  @Delete(':examId')
  @UseGuards(JwtAuthGuard, CanDeleteExam)
  async deleteExam(@Param('examId') examId: string) {
    await this.examsService.deleteExam(examId);
    return {
      success: true,
      message: 'exam has been deleted',
    };
  }

  @Post(':examId/invite-examinees')
  @UseGuards(JwtAuthGuard, CanInviteExaminees)
  async inviteExaminees(
    @Param('examId') examId: string,
    @Body() inviteExamineesDTO: InviteExamineesDTO,
  ) {
    await this.examsService.inviteExaminees(examId, inviteExamineesDTO);
    return {
      success: true,
      message: 'Invitation has been sent',
    };
  }

  @Post(':examId/cancel-invitations')
  @UseGuards(JwtAuthGuard, CanInviteExaminees)
  async cancelExamInvitations(
    @Param('examId') examId: string,
    @Body() cancelExamInvitationsDTO: CancelExamInvitationsDTO,
  ) {
    await this.examsService.cancelExamInvitations(
      examId,
      cancelExamInvitationsDTO,
    );
    return {
      success: true,
      message: 'Invitations have been canceled',
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

  @Post(':examId/invitations/send-email')
  async sendEmailToInvitedExaminees(
    @Param('examId') examId: string,
    @Body() sendEmailToInvitedExamineesDTO: SendEmailToInvitedExamineesDTO,
  ) {
    const data = await this.examsService.sendEmailToInvitedExaminees(
      examId,
      sendEmailToInvitedExamineesDTO,
    );
    return {
      success: true,
      message: 'emails sent ',
    };
  }

  @Post(':examId/start')
  async startExam(
    @Param('examId') examId: string,
    @Body() startExamDTO: StartExamDTO,
  ) {
    const { examineeEmail, accessKey } = startExamDTO;
    const data = await this.examsService.startExam({
      examId,
      examineeEmail,
      accessKey,
    });
    return {
      success: true,
      message: 'exam started',
      data,
    };
  }

  @Post(':examId/submit-answers')
  async submitAnswers(
    @Param('examId') examId: string,
    @Body() submitAnswersDTO: SubmitAnswersDTO,
  ) {
    const { examineeEmail, accessKey, answers } = submitAnswersDTO;
    await this.examsService.submitAnswers({
      examId,
      examineeEmail,
      accessKey,
      answers,
    });
    return {
      success: true,
      message: 'answers submitted',
    };
  }

  @Get(':examId/exam-invitations/:invitationId')
  async getAnExamInvitation(@Param('invitationId') invitationId: string) {
    const data = await this.examsService.getAnExamInvitation(invitationId);
    return {
      success: true,
      data,
    };
  }

  @Get(':examId/stats')
  @UseGuards(JwtAuthGuard, CanViewExamStats)
  async getExamStats(@Param('examId') examId: string) {
    const data = await this.examsService.getExamStats(examId);
    return {
      success: true,
      data,
    };
  }
  @Get(':examId/questions-stats')
  @UseGuards(JwtAuthGuard, CanViewExamStats)
  async getExamQuestionsStats(@Param('examId') examId: string) {
    const data = await this.examsService.getExamQuestionsStats(examId);
    return {
      success: true,
      data,
    };
  }
}
