import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id?: string;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;
  @Prop({ type: String, required: true, select: false })
  password: string;
  @Prop({ type: String, required: true, default: 'regular', lowercase: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
