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
import { User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CreateExamDTO, InviteExamineeDTO } from './dto/exam.dto';
import { Exam, ExamDocument } from './schemas/exam.schema';
import { Question, QuestionDocument } from './schemas/question.schema';
import { Request } from 'express';
import {
  ExamInvitation,
  ExamInvitationDocument,
} from './schemas/exam-invitation.schema';
import { MailService } from '../mail/mail.service';
import {
  ExamQuestionDocument,
  ExamQuestion,
} from './schemas/exam-question.schema';

@Injectable({ scope: Scope.REQUEST })
export class ExamsService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel('ExamQuestion')
    private examQuestionModel: Model<ExamQuestionDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(ExamInvitation.name)
    private examInvitationModel: Model<ExamInvitationDocument>,
    private mailService: MailService,
  ) {}
  async createExam(examData: CreateExamDTO) {
    const { organizationId, title, description } = examData;
    var examQuestions: ExamQuestion[] = [];

    const organization = await this.organizationsService.findOrganizationById(
      organizationId,
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

    examData.questions.map((content) => {
      const { type, question, correctAnswer } = content.question;

      const topics = content.question.topics || [];
      const answerOptions = content.question.answerOptions || [];
      const answerKeywords = content.question.answerKeywords || [];

      const newQuestion = new this.questionModel({
        type,
        question,
        topics,
        correctAnswer,
        answerOptions,
        answerKeywords,
      });

      newQuestion.save();

      const newExamQuestion = new this.examQuestionModel({
        question: newQuestion,
        points: content.points,
      });

      newExamQuestion.save();
      examQuestions = [...examQuestions, newExamQuestion];
    });

    const newExam = new this.examModel({
      organization,
      title,
      description,
      questions: examQuestions,
      createdBy: this.request.user,
    });
    try {
      await newExam.save();
      return newExam; // await this.findExam({ _id: newExam._id });
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
      const result = await this.examModel.findOne(exam).populate([]);
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

  async findExamsForOrganization(organizationId) {
    try {
      const organization = await this.organizationsService.findOrganizationById(
        organizationId,
      );
      // return organization;
      const result = await this.examModel.find({
        organization: organization._id,
      });
      if (!result) {
        throw new HttpException(
          {
            success: false,
            error: 'exams not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (e) {
      throw new HttpException(
        {
          success: false,
          error: `could not find exams : ${e.toString()}`,
        },
        500,
      );
    }
  }

  async getExamQuestions(examId: string) {
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
    const questions = await this.questionModel.find({
      exam: exam._id,
    });
    return questions;
  }

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
    } catch (e) {
      throw new HttpException(
        { success: false, error: 'could not delete exam' },
        500,
      );
    }
  }

  async inviteExaminee(examId: string, examineeInfo: InviteExamineeDTO) {
    const { name, email } = examineeInfo;

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
    const accessKey = this.getRandomInt(100000, 999999).toString(); //randm int between 100k - 999k
    try {
      const examInvitation = new this.examInvitationModel({
        exam,
        examineeName: name,
        examineeEmail: email,
        accessKey,
      });
      await examInvitation.save();
      this.mailService.sendEmail({
        to: email,
        subject: 'Invitation for Exam',
        html: `Hi ${name},<br> You have been invited to ${exam.title}<br> Your access key is ${accessKey}`,
      });
    } catch (e) {
      throw new HttpException(
        { success: false, error: 'invitation sending failed' },
        500,
      );
    }
  }

  async getInvitedExaminees(examId: string) {
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
    const invitees = await this.examInvitationModel.find({
      exam: exam._id,
    });
    return invitees;
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
