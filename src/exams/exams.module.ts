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

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema,
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

    UsersModule,
    OrganizationsModule,
    TopicsModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
