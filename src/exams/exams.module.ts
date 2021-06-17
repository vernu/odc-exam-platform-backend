import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsModule } from '../organizations/organizations.module';
import { TopicsModule } from '../topics/topics.module';
import { UsersModule } from '../users/users.module';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { Exam, ExamSchema } from './schemas/exam.schema';
import { Question, QuestionSchema } from './schemas/question.schema';
import {
  ExamInvitation,
  ExamInvitationSchema,
} from './schemas/exam-invitation.schema';
import { MailModule } from '../mail/mail.module';
import {
  ExamQuestion,
  ExamQuestionSchema,
} from './schemas/exam-question.schema';
import {
  ExamineeAnswer,
  ExamineeAnswerSchema,
} from './schemas/examinee-answer.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { ExamineeAnswersController } from './examinee-answers/examinee-answers.controller';
import { ExamineeAnswersService } from './examinee-answers/examinee-answers.service';
import { ExamQuestionsController } from './exam-questions/exam-questions.controller';
import { ExamQuestionsService } from './exam-questions/exam-questions.service';
import { QuestionsController } from './questions/questions.controller';
import { QuestionsService } from './questions/questions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ExamQuestion.name,
        schema: ExamQuestionSchema,
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Exam.name,
        useFactory: () => {
          const schema = ExamSchema;
          schema.plugin(require('mongoose-slug-updater'));
          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ExamInvitation.name,
        schema: ExamInvitationSchema,
      },
    ]),

    MongooseModule.forFeature([
      {
        name: ExamineeAnswer.name,
        schema: ExamineeAnswerSchema,
      },
    ]),

    UsersModule,
    OrganizationsModule,
    TopicsModule,
    MailModule,
  ],
  controllers: [ExamsController, ExamineeAnswersController, ExamQuestionsController, QuestionsController],
  providers: [ExamsService, TasksService, ExamineeAnswersService, ExamQuestionsService, QuestionsService],
})
export class ExamsModule {}
