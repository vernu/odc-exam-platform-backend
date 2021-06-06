import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Exam } from './exam.schema';

export type ExamInvitationDocument = ExamInvitation & Document;

@Schema({ timestamps: true })
export class ExamInvitation {
  _id?: string;
  @Prop({ type: Types.ObjectId, ref: 'Exam' })
  exam: Exam;
  @Prop({ type: String, required: true })
  examineeName: string;
  @Prop({ type: String, required: true })
  examineeEmail: string;
  @Prop({ type: String, required: true })
  accessKey: string;
  @Prop({ type: Date })
  expiresAt: Date;
  @Prop({ type: Date })
  startedAt: Date;
  @Prop({ type: Date })
  finishedAt: Date;
}

export const ExamInvitationSchema = SchemaFactory.createForClass(
  ExamInvitation,
);
