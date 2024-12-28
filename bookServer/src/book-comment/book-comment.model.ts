import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookCommentDocument = BookComment & Document;

@Schema({ collection: 'BookComment' })
export class BookComment {
  @Prop({ type: Types.ObjectId, required: true })
  bookId: Types.ObjectId;

  @Prop({ required: true }) 
  comment: string;
}

export const BookCommentSchema = SchemaFactory.createForClass(BookComment);