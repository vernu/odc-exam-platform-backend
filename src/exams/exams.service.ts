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
import { CreateExamDTO, InviteExamineesDTO } from './dto/exam.dto';
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
import {
  ExamineeAnswer,
  ExamineeAnswerDocument,
} from './schemas/examinee-answer.schema';

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
    @InjectModel(ExamineeAnswer.name)
    private examineeAnswerModel: Model<ExamineeAnswerDocument>,
    private mailService: MailService,
  ) {}
  async createExam(examData: CreateExamDTO) {
    const { organizationId, title, description, timeAllowed } = examData;
    var examQuestions: ExamQuestion[] = [];

    const organization = await this.organizationsService.findAnOrganization({
      _id: organizationId,
    });
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
      const { type, question } = content.question;

      const topics = content.question.topics || [];
      const answerOptions = content.question.answerOptions || [];
      const correctAnswers = content.question.correctAnswers || [];

      const newQuestion = new this.questionModel({
        type,
        question,
        topics,
        correctAnswers,
        answerOptions,
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
      timeAllowed,
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

  async findExam(exam, hideAnswers = true) {
    try {
      const result = await this.examModel
        .findOne(exam)
        .select([hideAnswers && '-questions.question.correctAnswers'])
        .populate([]);
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
    const organization = await this.organizationsService.findAnOrganization({
      _id: organizationId,
    });
    if (!organization) {
      throw new HttpException(
        {
          success: false,
          error: 'organization not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    try {
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

  async inviteExaminees(examId: string, examineesInfo: InviteExamineesDTO) {
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

    examineesInfo.examinees.forEach(async (examinee) => {
      const { name, email } = examinee;

      const invited = await this.examInvitationModel.findOne({
        exam: exam._id,
        examineeEmail: email,
      });

      if (invited) {
        console.log(`${email} already invited`);
        return;
      }

      const accessKey = this.getRandomInt(100000, 999999).toString(); //randm int between 100k - 999k
      console.log(accessKey);
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
    });
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

  async startExam({ examId, examineeEmail, accessKey }) {
    const examInvitation = await this.examInvitationModel.findOne({
      examineeEmail,
      accessKey,
    });
    if (!examInvitation) {
      throw new HttpException(
        {
          success: false,
          error: 'Not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (examInvitation.finishedAt) {
      throw new HttpException(
        {
          success: false,
          error: 'Answers already submitted',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (examInvitation.startedAt) {
      throw new HttpException(
        {
          success: false,
          error: 'Exam already started',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await examInvitation.updateOne({ startedAt: new Date() });
    return await this.findExam({ _id: examInvitation.exam._id });
  }

  async submitAnswers({ examId, examineeEmail, accessKey, answers }) {
    const examInvitation = await this.examInvitationModel.findOne({
      examineeEmail,
      accessKey,
    });
    if (!examInvitation) {
      throw new HttpException(
        {
          success: false,
          error: 'Not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (examInvitation.finishedAt) {
      throw new HttpException(
        {
          success: false,
          error: 'Answers already submitted',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // console.log(examInvitation);
    await examInvitation.updateOne({ finishedAt: new Date() });

    answers.map(async (answer) => {
      const examQuestion = await this.examQuestionModel.findOne({
        _id: answer.examQuestionId,
      });
      if (examQuestion) {
        const examineeAnswer = new this.examineeAnswerModel({
          examInvitation,
          examQuestion,
          examineeAnswers: answer.answers,
        });
        await examineeAnswer.save();
      }
    });

    return await this.findExam({ _id: examInvitation.exam._id });
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
