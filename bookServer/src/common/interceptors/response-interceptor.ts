import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, map, Observable, throwError } from "rxjs";


@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        console.log("Before ...");

        const res = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map(data => {
                console.log("After ...")
                return {
                    status: "success",
                    data,
                };
            }),
            catchError(err => {
                const status = err.status || 500; 
                res.status(status).json({
                    status: "fail",
                    data: err
                });
                return throwError(() => err);
            })
        );
    }
}