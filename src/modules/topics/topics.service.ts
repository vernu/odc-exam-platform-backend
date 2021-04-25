import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddTopicDTO, AddTopicResponseDTO } from './dto/topic.dto';
import { Topic, TopicDocument } from './schemas/topic.schema';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}
  async getAllTopics() {
    return await this.topicModel.find();
  }

  async addTopic(topicData: AddTopicDTO): Promise<AddTopicResponseDTO> {
    const { title, description } = topicData;
    const newTopic = new this.topicModel({
      title,
      description,
    });

    try {
      await newTopic.save();
      return {
        success: true,
        message: 'Topic has been added',
        topic: newTopic,
      };
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: e.toString(),
        },
        500,
      );
    }
  }
}
