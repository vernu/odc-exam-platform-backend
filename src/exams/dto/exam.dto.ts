import { ExamQuestionDocument } from '../schemas/exam-question.schema';
import { ExamDocument } from '../schemas/exam.schema';
import { Question } from '../schemas/question.schema';

export class CreateExamDTO {
  organizationId: string;
  title: string;
  description: string;
  timeAllowed: number;
  questions: [ExamQuestionDocument];
}

export class CreateExamResponseDTO {
  success: boolean;
  error?: string;
  message?: string;
  data?: ExamDocument;
}

export class InviteExamineesDTO {
  examinees: [{ name: string; email: string }];
}

export class StartExamDTO {
  examineeEmail: string;
  accessKey: string;
}

export class SubmitAnswersDTO {
  examineeEmail: string;
  accessKey: string;
  answers: [
    {
      examQuestionId: string;
      answers: [string];
    },
  ];
}
