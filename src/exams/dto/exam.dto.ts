import { ExamDocument } from '../schemas/exam.schema';
import { Question } from '../schemas/question.schema';

export class CreateExamDTO {
  organizationId: string;
  title: string;
  description: string;
  questions: [Question];
}

export class CreateExamResponseDTO {
  success: boolean;
  error?: string;
  message?: string;
  data?: ExamDocument;
}
