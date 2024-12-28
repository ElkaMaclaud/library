import { Test, TestingModule } from '@nestjs/testing';
import { CommentsGateway } from './comments.gateway';
import { BookCommentService } from '../book-comment/book-comment.service';
import { BookComment } from '../book-comment/book-comment.model';
import { Types } from 'mongoose';

describe('CommentsGateway', () => {
  let gateway: CommentsGateway;
  let bookCommentService: BookCommentService;

  const mockBookCommentService = {
    findAllBookComments: jest.fn(),
    createComment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsGateway,
        { provide: BookCommentService, useValue: mockBookCommentService },
      ],
    }).compile();

    gateway = module.get<CommentsGateway>(CommentsGateway);
    bookCommentService = module.get<BookCommentService>(BookCommentService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should handle client connection and fetch comments', async () => {
    const bookId = new Types.ObjectId("book")
    const client = { send: jest.fn(), bookId };
    const comments: BookComment[] = [{ bookId, comment: 'Test comment' }];

    mockBookCommentService.findAllBookComments.mockResolvedValue(comments);

    gateway.handleConnection(client as any);
    await gateway.getAllComments(client.bookId);

    expect(mockBookCommentService.findAllBookComments).toHaveBeenCalledWith('test-book-id');
    expect(client.send).toHaveBeenCalledWith(JSON.stringify({ event: 'allComments', data: comments }));
  });

  it('should add a new comment and notify clients', async () => {
    const bookId = new Types.ObjectId("book")
    const client = { send: jest.fn(), bookId };
    const newComment: BookComment = { bookId, comment: 'New comment' };

    mockBookCommentService.createComment.mockResolvedValue(newComment);

    await gateway.addComment({ text: 'New comment' });

    expect(mockBookCommentService.createComment).toHaveBeenCalledWith(bookId.toString(), 'New comment');
    expect(gateway.server.emit).toHaveBeenCalledWith('commentAdded', newComment);
  });
});