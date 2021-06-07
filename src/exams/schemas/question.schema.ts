import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  _id?: string;
  // @Prop({ type: Types.ObjectId, ref: 'Exam' })
  // exam: Exam;
  @Prop({ type: String, required: true })
  type: string;
  @Prop({ type: [String] })
  topics: [string];
  @Prop({ type: String, required: true })
  question: string;
  @Prop({ type: [String] })
  answerOptions: [string];
  @Prop({ type: [String] })
  correctAnswers: [string];
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
