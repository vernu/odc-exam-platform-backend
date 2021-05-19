import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Exam } from './exam.schema';

export type ExamInvitationDocument = ExamInvitation & Document;

@Schema({ timestamps: true })
export class ExamInvitation {
  _id?: string;
  @Prop({ type: Types.ObjectId, ref: Exam.name })
  exam: Exam;
  @Prop({ type: String, required: true })
  examineeName: string;
  @Prop({ type: String, required: true })
  examineeEmail: string;
  @Prop({ type: String, required: true })
  accessKey: string;
}

export const ExamInvitationSchema = SchemaFactory.createForClass(
  ExamInvitation,
);
