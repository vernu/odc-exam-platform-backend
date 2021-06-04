import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Organization } from '../../organizations/schemas/organization.schema';
import { User } from '../../users/schemas/user.schema';
import { ExamQuestionSchema, ExamQuestion } from './exam-question.schema';

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true })
export class Exam {
  _id?: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: Number })
  timeAllowed: number; //in minute
  @Prop({ type: Number, default: 0 })
  totalPoints: number;
  @Prop({ type: Types.ObjectId, ref: Organization.name })
  organization: Organization;
  @Prop({ type: [ExamQuestionSchema], ref: ExamQuestion.name })
  questions: [ExamQuestion];
  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: User;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
