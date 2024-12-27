import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookCommentDocument = BookComment & Document;

@Schema({ collection: 'BookComment' })
export class BookComment {
  @Prop({ required: true })
  bookId: string;

  @Prop({ type: Types.ObjectId, required: true }) 
  comment: Types.ObjectId;
}

export const BookCommentSchema = SchemaFactory.createForClass(BookComment);