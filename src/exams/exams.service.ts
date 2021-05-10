import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from 'src/organizations/schemas/organization.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateExamDTO } from './dto/exam.dto';
import { Exam, ExamDocument } from './schemas/exam.schema';
import { Question, QuestionDocument } from './schemas/question.schema';

@Injectable()
export class ExamsService {
  constructor(
    private usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}
  async createExam(examData: CreateExamDTO) {
    var questions: Question[] = [];
    examData.questions.map(async (question) => {
      const newQuestion = new this.questionModel(question);
      await newQuestion.save();
      questions.push(question);
    });
    const newExam = new this.examModel({
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
}
