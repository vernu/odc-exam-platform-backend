import { ExamContentDocument, ExamDocument } from '../schemas/exam.schema';
import { Question } from '../schemas/question.schema';

export class CreateExamDTO {
  organizationId: string;
  title: string;
  description: string;
  questions: [ExamContentDocument];
}

export class CreateExamResponseDTO {
  success: boolean;
  error?: string;
  message?: string;
  data?: ExamDocument;
}

export class InviteExamineeDTO {
  name: string;
  email: string;
}
