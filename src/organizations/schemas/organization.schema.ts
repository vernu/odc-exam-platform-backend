import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, slug: ['name'], uniqueSlug: true })
  slug: string;
  @Prop({ type: String, required: true, lowercase: true })
  description: string;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  admin: User;
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  examiners: [User];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
