import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ExamsService } from '../exams.service';

@Injectable()
export class CanDeleteExam implements CanActivate {
  constructor(
    private examsService: ExamsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user != null) {
      if (user.role == 'super-admin') {
        return true;
      } else {
        const exam = await this.examsService.findExam(
          { _id: request.params.examId },
          true,
          ['createdBy'],
        );
        if (
          exam &&
          exam.createdBy &&
          exam.createdBy._id == user._id.toString()
        ) {
          return true;
        }
      }
    }

    throw new HttpException(
      { success: false, error: 'unauthorized' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
