import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
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
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ExamsService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
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
    const organization = await this.organizationsService.findOrganizationById(
      examData.organizationId,
    );
    if (!organization) {
      throw new HttpException(
        {
          success: false,
          error: 'Organization not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newExam = new this.examModel({
      organization,
      title: examData.title,
      description: examData.description,
      // questions,
      createdBy: this.request.user,
    });
    try {
      await newExam.save();
      examData.questions.map((question) => {
        const newQuestion = new this.questionModel({
          exam: newExam,
          type: question.type,
          question: question.question,
        });
        newQuestion.save();
        questions = [...questions, newQuestion];
      });
      return await this.findExam({ _id: newExam._id });
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: `could not create exam : ${e.toString()}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findExam(exam) {
    try {
      const result = await this.examModel.findOne(exam).populate(['createdBy']);
      if (!result) {
        throw new HttpException(
          {
            success: false,
            error: 'exam not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: `could not find exam : ${e.toString()}`,
        },
        500,
      );
    }
  }

  async getExamQuestions(examId: string) {}

  async deleteExam(examId: string) {
    const exam = await this.examModel.findById(examId);
    if (!exam) {
      throw new HttpException(
        {
          success: false,
          error: 'Exam not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await exam.deleteOne();
      return 'exam deleted';
    } catch (e) {
      throw new HttpException(
        { success: false, error: 'could not delete exam' },
        500,
      );
    }
  }
}
