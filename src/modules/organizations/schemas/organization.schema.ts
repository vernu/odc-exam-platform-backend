import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true, unique: true, lowercase: true })
  description: string;
  @Prop({ref:'User'})
  admin: User
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
