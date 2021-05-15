import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrganizationsService } from '../organizations/organizations.service';
import {
  Organization,
  OrganizationDocument,
} from '../organizations/schemas/organization.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CreateExamDTO } from './dto/exam.dto';
import { Exam, ExamDocument } from './schemas/exam.schema';
import { Question, QuestionDocument } from './schemas/question.schema';

@Injectable()
export class ExamsService {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}
  async createExam(examData: CreateExamDTO) {
    var questions = [];
    examData.questions.map((question) => {
      const newQuestion = new this.questionModel({
        type: question.type,
        question: question.question,
      });
      newQuestion.save();
      questions = [...questions, newQuestion];
    });

    const newExam = new this.examModel({
      organization: (
        await this.organizationsService.findOrganizationById(
          examData.organizationId,
        )
      ).data,
      title: examData.title,
      description: examData.description,
      questions,
    });
    await newExam.save();
    return {
      success: true,
      message: 'exam has been created',
      data: newExam,
    };
  }

  async findExamById(examId: string) {
    try {
      const exam = await this.examModel
        .findById(examId)
        .populate(['organization', 'questions']);
      return {
        success: true,
        data: exam,
      };
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: 'could not find exam ',
        },
        500,
      );
    }
  }
}
