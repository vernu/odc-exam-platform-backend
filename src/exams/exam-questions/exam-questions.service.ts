import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateExamQuestionDTO } from '../dto/exam-question.dto';
import { ExamQuestionDocument } from '../schemas/exam-question.schema';

@Injectable()
export class ExamQuestionsService {
  constructor(
    @InjectModel('ExamQuestion')
    private examQuestionModel: Model<ExamQuestionDocument>,
  ) {}
  async updateExamQuestion(
    examQuestionId: string,
    updateExamQuestionDTO: UpdateExamQuestionDTO,
  ) {
    const examQuestion = await this.examQuestionModel.findOne({
      _id: examQuestionId,
    });
    if (!examQuestion) {
      throw new HttpException(
        {
          success: false,
          error: 'exam question not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await examQuestion.updateOne({
        points: updateExamQuestionDTO.points || examQuestion.points,
        questionNumber:
          updateExamQuestionDTO.questionNumber || examQuestion.points,
      });
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: `coudnt update exam question : ${e.toString()}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
