import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './book.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: Book,
        schemaOptions: {
          collection: "Book",
        },
      },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
  ],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
