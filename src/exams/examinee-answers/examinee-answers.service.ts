import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateExamineeAnswerDTO } from '../dto/examinee-answer.dto';
import { ExamsService } from '../exams.service';
import { ExamineeAnswerDocument } from '../schemas/examinee-answer.schema';

@Injectable()
export class ExamineeAnswersService {
  constructor(
    @InjectModel('ExamineeAnswer')
    private examineeAnswerModel: Model<ExamineeAnswerDocument>,
    private examsService: ExamsService,
  ) {}
  //lets examiners change pointsGained field only
  async updateExamineeAnswer(
    examineeAnswerId: string,
    updateExamineeAnswerDTO: UpdateExamineeAnswerDTO,
  ) {
    const examineeAnswer = await this.examineeAnswerModel.findOne({
      _id: examineeAnswerId,
    });
    if (!examineeAnswer) {
      throw new HttpException(
        { success: false, error: 'examinee answer not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await examineeAnswer.updateOne({
        pointsGained: updateExamineeAnswerDTO.pointsGained,
      });
      await this.examsService.calculateTotalPointsGained(
        examineeAnswer.examInvitation._id,
      );
    } catch (e) {
      throw new HttpException(
        { success: false, error: `failed to update: ${e.toString()}` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
