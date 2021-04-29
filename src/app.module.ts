import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mongoDBConfig } from './config/db';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TopicsModule } from './modules/topics/topics.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, mongoDBConfig),
    AuthModule,
    UsersModule,
    TopicsModule,
    OrganizationsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
