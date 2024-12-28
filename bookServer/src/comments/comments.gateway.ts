import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server } from 'http';
import { BookCommentService } from '../book-comment/book-comment.service';
import { BookComment } from '../book-comment/book-comment.model';
import { UseInterceptors } from '@nestjs/common';
import { BookIdInterceptor } from 'src/common/interceptors/bookId-Interceptor';

@WebSocketGateway()
@UseInterceptors(BookIdInterceptor)
export class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly bookCommentService: BookCommentService) {}

    handleConnection(client: any) {
        console.log(`Client connected: ${client}`);

        const bookId = client.bookId;
        this.getAllComments(client, bookId);
    }

    handleDisconnect(client: any) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('getAllComments')
    async getAllComments(client: any, bookId: string): Promise<BookComment[]> {
        const comments = await this.bookCommentService.findAllBookComments(bookId);
        client.emit('allComments', comments); 
        return comments;
    }

    @SubscribeMessage('addComment')
    async addComment(@MessageBody() { bookId, text }: { bookId: string; text: string }): Promise<BookComment> {
        const newComment = await this.bookCommentService.createComment(bookId, text);
        this.server.emit('commentAdded', newComment);
        return newComment; 
    }
}