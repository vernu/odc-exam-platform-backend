import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService]
})
export class ExamsModule {}
