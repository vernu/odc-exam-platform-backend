import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateQuestionDTO } from '../dto/question.dto';
import { QuestionDocument } from '../schemas/question.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question')
    private questionModel: Model<QuestionDocument>,
  ) {}

  async updateQuestion(
    questionId: string,
    updateQuestionDTO: UpdateQuestionDTO,
  ) {
    const question = await this.questionModel.findOne({
      _id: questionId,
    });
    if (!question) {
      throw new HttpException(
        {
          success: false,
          error: 'question not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await question.updateOne(updateQuestionDTO);
      return this.questionModel.findOne({ _id: question._id });
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: `coudnt update question : ${e.toString()}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
