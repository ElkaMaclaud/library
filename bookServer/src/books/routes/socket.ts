import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const createSocketServer = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000"],
        }
    });

    io.on("connection", (socket) => {
        console.log(`Присоединился новый читатель: ${socket.id}`);
        
        const { roomName } = socket.handshake.query as { roomName: string };

        socket.join(roomName);

        socket.on("book discussion", (msg: string) => {
            socket.to(roomName).emit("book discussion", msg);
            socket.emit("book discussion", msg);
        });

        socket.on("disconnect", () => {
            console.log(`Читатель покинул комнату: ${socket.id}`);
        });

        socket.on("error", (error: Error) => {
            console.error(`Ошибка сокета ${socket.id}:`, error);
        });
    });
};

export default createSocketServer;