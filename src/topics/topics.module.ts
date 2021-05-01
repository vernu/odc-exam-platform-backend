import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Topic.name,
        useFactory: () => {
          const schema = TopicSchema;
          schema.plugin(require('mongoose-slug-updater'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
