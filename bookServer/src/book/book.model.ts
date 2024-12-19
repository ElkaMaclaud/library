import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BookDocument = Book & Document

@Schema({ collection: 'Book' })
export class Book {
  @Prop({required: true})
  title: string;

  @Prop()
  description?: string;

  @Prop()
  authors?: string[];

  @Prop()
  favorite?: string;

  @Prop()
  fileCover?: string;

  @Prop()
  fileName?: string;

  @Prop()
  fileBook?: string
}

export const BookSchema = SchemaFactory.createForClass(Book)
