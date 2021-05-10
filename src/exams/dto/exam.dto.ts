import { Question } from '../schemas/question.schema';

export class CreateExamDTO {
  organizationId: string;
  title: string;
  description: string;
  questions: [Question];
}
