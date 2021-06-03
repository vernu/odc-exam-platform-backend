import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { ExamInvitationDocument } from './schemas/exam-invitation.schema';
import { ExamDocument } from './schemas/exam.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('ExamInvitation')
    private examInvitationModel: Model<ExamInvitationDocument>,
    private mailService: MailService,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  // @Cron('* * * * * *')
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  cronTask() {
    this.sendExamInvitationReminderToExaminees();
  }

  async sendExamInvitationReminderToExaminees() {
    const invitations = await this.examInvitationModel
      .find({
        // startedAt: { $ne: null },
        expiresAt: { $lt: new Date() },
      })
      .populate(['exam']);

    invitations.map((invitation) => {
      const { exam, examineeName, examineeEmail } = invitation;
      this.mailService.sendEmail({
        to: examineeEmail,
        subject: 'Exam Reminder',
        html: `Hi ${examineeName},<br> This email is sent to remind you ${exam.title} will expire on ${invitation.expiresAt} `,
      });
    });
  }
}
