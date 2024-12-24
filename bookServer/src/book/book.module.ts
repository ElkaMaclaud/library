import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BookSchema } from './book.model'; 
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]), 
    ConfigModule,
    AuthModule
  ],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
