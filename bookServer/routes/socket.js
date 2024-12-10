const { Server } = require("socket.io")

const createSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000"],
        }
    })

    io.on("connection", (socket) => {
        console.log(`Присоединился новый читатель: ${socket.id}`)
        
        const { roomName } = socket.handshake.query

        socket.join(roomName)

        socket.on("book discussion", (msg) => {
            socket.to(roomName).emit("book discussion", msg)
            socket.emit("book discussion", msg)
        })

        socket.on("disconnect", () => {
            console.log(`Читатель покинул комнату: ${socket.id}`)
        })

        socket.on("error", (error) => {
            console.error(`Ошибка сокета ${socket.id}:`, error);
        });
    })

}

module.exports = createSocketServer