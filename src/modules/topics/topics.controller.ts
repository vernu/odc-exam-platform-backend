import { Body, Controller, Get, Post } from '@nestjs/common';
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
  addTopic(@Body() addTopicDTO: AddTopicDTO) {
    return this.topicsService.addTopic(addTopicDTO);
  }
}
