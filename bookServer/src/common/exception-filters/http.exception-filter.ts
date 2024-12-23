import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    public catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        // const request = ctx.getRequest<Request>()
        const status = exception.getStatus()

        console.log("HttpExceptionFilter", exception.message)
        response
            .status(status)
            .json({
                timestamp: new Date().toISOString(),
                status: "fail",
                data: exception.message,
                code: status
            })

    }
}