import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PasswordResetDocument = PasswordReset & Document;

@Schema({ timestamps: true })
export class PasswordReset {
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User;
  @Prop({ type: String, required: true })
  secretCode: string;
  @Prop({ type: Date, required: true })
  expiresAt: Date;
  @Prop({ type: Date })
  usedAt: Date;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);
