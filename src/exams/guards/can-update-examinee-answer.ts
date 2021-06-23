import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrganizationsService } from '../../organizations/organizations.service';
import { ExamineeAnswersService } from '../examinee-answers/examinee-answers.service';
import { ExamsService } from '../exams.service';
import { ExamineeAnswerDocument } from '../schemas/examinee-answer.schema';

@Injectable()
export class CanUpdateExamineeAnswer implements CanActivate {
  constructor(
    private examsService: ExamsService,
    @InjectModel('ExamineeAnswer')
    private examineeAnswerModel: Model<ExamineeAnswerDocument>,
    private organizationsService: OrganizationsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user != null) {
      if (user.role == 'super-admin') {
        return true;
      } else {
        const examineeAnswer = await this.examineeAnswerModel
          .findOne({ _id: request.params.examineeAnswerId })
          .populate([
            'examInvitation',
            {
              path: 'examInvitation',
              populate: {
                path: 'exam',
              },
            },
          ]);
        try {
          if (
            examineeAnswer.examInvitation.exam.createdBy == user._id.toString()
          ) {
            return true;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    throw new HttpException(
      { success: false, error: 'unauthorized' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
