import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String, slug: ['title'], uniqueSlug: true })
  slug: string;
  @Prop({ type: String })
  icon: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
