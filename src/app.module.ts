import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mongoDBConfig } from './config/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TopicsModule } from './topics/topics.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { MailModule } from './mail/mail.module';
import { ExamsModule } from './exams/exams.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
      ...mongoDBConfig,
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
    }),

    AuthModule,
    UsersModule,
    TopicsModule,
    OrganizationsModule,
    MailModule,
    ExamsModule,

    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
