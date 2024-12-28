import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module'; 
import { Book } from './book.model'; 

describe('BookController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/book (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/book')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/book/:id (GET)', async () => {
    const bookId = 'some-valid-book-id';
    const response = await request(app.getHttpServer())
      .get(`/book/${bookId}`)
      .expect(200);

    expect(response.body).toHaveProperty('bookId', bookId);
  });

  it('/book (POST)', async () => {
    const newBook = { title: 'New Book', author: 'Author Name', publishedDate: '2024-01-01' };
    const response = await request(app.getHttpServer())
      .post('/book')
      .send(newBook)
      .expect(201);

    expect(response.body).toHaveProperty('title', newBook.title);
  });

  it('/book/:id (PUT)', async () => {
    const bookId = 'some-valid-book-id'; 
    const updatedBook = { title: 'Updated Book', author: 'Updated Author' }; 
    const response = await request(app.getHttpServer())
      .put(`/book/${bookId}`)
      .send(updatedBook)
      .expect(200);

    expect(response.body).toHaveProperty('title', updatedBook.title);
  });

  it('/book/:id (DELETE)', async () => {
    const bookId = 'some-valid-book-id'; 
    const response = await request(app.getHttpServer())
      .delete(`/book/${bookId}`)
      .expect(200);

    expect(response.body).toHaveProperty('bookId', bookId);
  });
});