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

export class UpdateExamDTO {
  organizationId: string;
  title: string;
  description: string;
  timeAllowed: number;
  questions: [ExamQuestionDocument];
}

export class UpdateExamResponseDTO {
  success: boolean;
  error?: string;
  message?: string;
  data?: ExamDocument;
}

export class InviteExamineesDTO {
  expiresAt: Date;
  examinees: [{ name: string; email: string }];
}

export class CancelExamInvitationsDTO {
  examinees: [email: string];
}

export class SendEmailToInvitedExamineesDTO {
  subject: string;
  body: string;
  emails: [string];
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
