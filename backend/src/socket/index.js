import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { socketAuthMiddleware } from '../middlewares/socketMiddleware.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    },
});

// sử dụng middleware xác thực cho socket.io
io.use(socketAuthMiddleware);

io.on('connection', async (socket) => {
    const user = socket.user;
    console.log(`User ${user.displayName} online on: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`User ${user.displayName} offline on: ${socket.id}`);
    });
})

export { io, app, server }