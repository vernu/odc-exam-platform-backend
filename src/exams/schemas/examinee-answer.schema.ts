import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExamQuestion } from './exam-question.schema';

export type ExamineeAnswerDocument = ExamineeAnswer & Document;
@Schema({ timestamps: true })
export class ExamineeAnswer {
  @Prop({ type: Types.ObjectId, ref: 'ExamQuestion' })
  examQuestion: ExamQuestion;
  @Prop({ type: [String], default: [] })
  examineeAnswers: [string];
  @Prop({ type: Number, default: 0 })
  pointsGained: number;
}
export const ExamineeAnswerSchema = SchemaFactory.createForClass(
  ExamineeAnswer,
);
