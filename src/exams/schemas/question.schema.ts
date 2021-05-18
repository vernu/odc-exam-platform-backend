import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Topic } from '../../topics/schemas/topic.schema';
import { User } from '../../users/schemas/user.schema';
import { Exam } from './exam.schema';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  _id?: string;
  @Prop({ type: Types.ObjectId, ref: Exam.name })
  exam: Exam;
  @Prop({ type: String, required: true })
  type: string;
  @Prop({ type: [Types.ObjectId], ref: Topic.name })
  topics: [Topic];
  @Prop({ type: String, required: true })
  question: string;
  @Prop({ type: [String] })
  answerOptions: [string];
  @Prop({ type: String })
  correctAnswer: string;
  @Prop({ type: [String] })
  answerKeywords: [string];
  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: User;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
