import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddTopicDTO } from './dto/topic.dto';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  getAllTopics() {
    return this.topicsService.getAllTopics();
  }

  @Post()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  addTopic(@Body() addTopicDTO: AddTopicDTO) {
    return this.topicsService.addTopic(addTopicDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  deleteTopic(@Param('id') id: string) {
    return this.topicsService.deleteTopic(id);
  }
}
