import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddTopicDTO,
  AddTopicResponseDTO,
  DeleteTopicResponseDTO,
  GetTopicsResponseDTO,
} from './dto/topic.dto';
import { Topic, TopicDocument } from './schemas/topic.schema';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}
  async getAllTopics(): Promise<GetTopicsResponseDTO> {
    const topics = await this.topicModel.find();
    return {
      success: true,
      count: topics.length,
      topics,
    };
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

  async deleteTopic(topicId: string): Promise<DeleteTopicResponseDTO> {
    const topic = await this.topicModel.findOne({ _id: topicId });

    if (!topic) {
      throw new HttpException(
        {
          success: false,
          error: 'topic does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      try {
        await this.topicModel.deleteOne({ _id: topicId });
        return {
          success: true,
          message: 'topic deleted',
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
}
