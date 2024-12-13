"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (err, req, res) => {
    console.error("Произошла ошибка:", err);
    res.status(err.status || 500).json({
        message: err.message || "Внутренняя ошибка сервера",
    });
};
exports.default = errorMiddleware;
// module.exports=(req, res) => {
//     res.status(404)
//     const content = "404 | not found"
//     res.send(content)
// }
