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
    private bookId: string;

    constructor(private readonly bookCommentService: BookCommentService) { }

    handleConnection(client: any) {
        console.log(`Client connected: ${client}`);

        this.bookId = client.bookId;
        this.getAllComments(client);
    }

    handleDisconnect(client: any) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('getAllComments')
    async getAllComments(client: any): Promise<BookComment[]> {
        const comments = await this.bookCommentService.findAllBookComments(this.bookId);
        client.emit('allComments', comments);
        return comments;
    }

    @SubscribeMessage('addComment')
    async addComment(@MessageBody() { text }: { text: string }): Promise<BookComment> {
        const newComment = await this.bookCommentService.createComment(this.bookId, text);
        this.server.emit('commentAdded', newComment);
        return newComment;
    }
}