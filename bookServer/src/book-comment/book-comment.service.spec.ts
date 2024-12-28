import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BookCommentService } from './book-comment.service';
import { BookComment } from './book-comment.model';
import { Model } from 'mongoose';

describe('BookCommentService', () => {
    let service: BookCommentService;
    let model: Model<BookComment>;

    const mockBookCommentModel = {
        find: jest.fn(),
        create: jest.fn(),
        exec: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookCommentService,
                {
                    provide: getModelToken('BookComment'),
                    useValue: mockBookCommentModel,
                },
            ],
        }).compile();

        service = module.get<BookCommentService>(BookCommentService);
        model = module.get<Model<BookComment>>(getModelToken('BookComment'));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAllBookComments', () => {
        it('should return an array of comments', async () => {
            const bookId = '60d21b4667d0d8992e610c85'; // Пример ID книги
            const result = [{ comment: 'Great book!' }, { comment: 'Interesting read.' }];
            jest.spyOn(model, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValue(result),
            } as any);

            expect(await service.findAllBookComments(bookId)).toEqual(result);
        });
    });

    describe('createComment', () => {
        it('should create a new comment', async () => {
            const bookId = '60d21b4667d0d8992e610c85'; // Пример ID книги
            const text = 'Amazing book!';
            const newComment = { bookId, comment: text };
            jest.spyOn(model, 'create').mockResolvedValue(newComment as any);

            expect(await service.createComment(bookId, text)).toEqual(newComment);
        });
    });
});