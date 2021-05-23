import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Organization } from '../../organizations/schemas/organization.schema';
import { User } from '../../users/schemas/user.schema';
import { Question } from './question.schema';

export type ExamContentDocument = ExamContent & Document;
@Schema({})
export class ExamContent {
  @Prop({ type: Types.ObjectId, ref: Question.name })
  question: Question;
  @Prop({ type: Number })
  points: number;
}
export const ExamContentSchema = SchemaFactory.createForClass(ExamContent);

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true })
export class Exam {
  _id?: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: Types.ObjectId, ref: Organization.name })
  organization: Organization;
  @Prop({ type: [ExamContentSchema] })
  content: [ExamContent];
  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: User;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
