import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BookDocument = User & Document

@Schema({ collection: 'User' })
export class User {
  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  firstName: string[];

  @Prop()
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User)