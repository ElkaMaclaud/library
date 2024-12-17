"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const createSocketServer = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3000"],
        }
    });
    io.on("connection", (socket) => {
        console.log(`Присоединился новый читатель: ${socket.id}`);
        const { roomName } = socket.handshake.query;
        socket.join(roomName);
        socket.on("book discussion", (msg) => {
            socket.to(roomName).emit("book discussion", msg);
            socket.emit("book discussion", msg);
        });
        socket.on("disconnect", () => {
            console.log(`Читатель покинул комнату: ${socket.id}`);
        });
        socket.on("error", (error) => {
            console.error(`Ошибка сокета ${socket.id}:`, error);
        });
    });
};
exports.default = createSocketServer;
