import { Prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Schema } from 'mongoose';

export interface Book extends Base {}
export class Book extends TimeStamps {
  @Prop()
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
