import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BookIdInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const client = context.switchToWs().getClient();
        const bookId = client.handshake.query.bookId; 

        client.bookId = bookId;

        return next.handle();
    }
}