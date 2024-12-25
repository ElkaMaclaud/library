import { Test, TestingModule } from "@nestjs/testing";
import { Types } from "mongoose";
import { BookService } from "./book.service";
import { HttpService } from "@nestjs/axios";
import { InternalServerErrorException } from "@nestjs/common";
import { of } from "rxjs";
import { Book } from "./book.model";

describe("BookService", () => {
  let service: BookService;
  let bookModel: Book;
  let httpService: HttpService;

  const mockBook = { _id: new Types.ObjectId().toHexString(), title: "Test Book" };
  const mockBookModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: 'Book', useValue: mockBookModel },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookModel = module.get('Book');
    httpService = module.get(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all books", async () => {
    mockBookModel.find.mockReturnValue({ select: jest.fn().mockReturnValue(Promise.resolve([mockBook])) });
    const books = await service.getBooks();
    expect(books).toEqual([mockBook]);
  });

  it("should return a book and increment counter", async () => {
    const id = mockBook._id;
    mockBookModel.findById.mockReturnValue({ select: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockBook) }) });
    mockHttpService.post.mockReturnValue(of({ data: { success: true } }));
    mockHttpService.get.mockReturnValue(of({ data: { counter: 1 } }));

    const result = await service.getBook(id).toPromise();
    expect(result).toEqual({ ...mockBook, counter: 1 });
  });

  it("should throw an error if book not found", async () => {
    const id = new Types.ObjectId().toHexString();
    mockBookModel.findById.mockReturnValue({ select: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }) });

    await expect(service.getBook(id).toPromise()).rejects.toThrow(InternalServerErrorException);
  });

  it("should create a new book", async () => {
    const dto = { title: "New Book" };
    mockBookModel.create.mockReturnValue(mockBook);
    const result = await service.createBook(dto);
    expect(result).toEqual(mockBook);
  });

  it("should update a book", async () => {
    const id = mockBook._id;
    const dto = { title: "Updated Book" };
    mockBookModel.findByIdAndUpdate.mockReturnValue(mockBook);
    const result = await service.updateBook(id, dto);
    expect(result).toEqual(mockBook);
  });

  it("should delete a book and counter", async () => {
    const id = mockBook._id;
    mockBookModel.findByIdAndDelete.mockReturnValue(mockBook);
    mockHttpService.delete.mockReturnValue(of({ data: { success: true } }));

    const result = await service.deleteBook(id).toPromise();
    expect(result).toEqual(mockBook);
  });

  it("should throw an error if book not found on delete", async () => {
    const id = new Types.ObjectId().toHexString();
    mockBookModel.findByIdAndDelete.mockReturnValue(null);

    await expect(service.deleteBook(id).toPromise()).rejects.toThrow(InternalServerErrorException);
  });
});