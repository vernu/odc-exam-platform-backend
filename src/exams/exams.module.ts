import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { TopicsModule } from 'src/topics/topics.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { Exam, ExamSchema } from './schemas/exam.schema';
import { Question, QuestionSchema } from './schemas/question.schema';

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

    UsersModule,
    OrganizationsModule,
    TopicsModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
