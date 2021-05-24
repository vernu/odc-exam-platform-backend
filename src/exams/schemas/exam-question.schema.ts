import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Question } from './question.schema';

export type ExamQuestionDocument = ExamQuestion & Document;
@Schema({ timestamps: true })
export class ExamQuestion {
  @Prop({ type: Types.ObjectId, ref: 'Question' })
  question: Question;
  @Prop({ type: Number, required: true, default: 0 })
  questionNumber: number;
  @Prop({ type: Number })
  points: number;
}
export const ExamQuestionSchema = SchemaFactory.createForClass(ExamQuestion);
