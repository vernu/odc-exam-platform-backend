import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Organization } from '../../organizations/schemas/organization.schema';
import { User } from '../../users/schemas/user.schema';
import { Question } from './question.schema';

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true })
export class Exam {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: Types.ObjectId, ref: Organization.name })
  organization: Organization;
  @Prop({ type: [Types.ObjectId], ref: Question.name })
  questions: [Question];
  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: User;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
