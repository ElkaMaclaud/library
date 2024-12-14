// errorMiddleware.ts
import { Request, Response } from 'express';

export interface CustomError extends Error {
    status?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response) => {
    // console.error("Произошла ошибка:", err);
    res.status(err?.status || 500).json({
        message: err.message || "Внутренняя ошибка сервера",
    });
};

export default errorMiddleware;
















// module.exports=(req, res) => {
//     res.status(404)
//     const content = "404 | not found"
//     res.send(content)
// }