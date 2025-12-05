import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { socketAuthMiddleware } from '../middlewares/socketMiddleware.js';
import { getUserConversationsForSocketIO } from '../controllers/conversationController.js';

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

const onlineUsers = new Map(); // Map để lưu trữ userId và socketId

io.on('connection', async (socket) => {
    const user = socket.user;
    console.log(`User ${user.displayName} online on: ${socket.id}`);

    // Lưu trữ userId và socketId vào onlineUsers map
    onlineUsers.set(user._id.toString(), socket.id);

    // Phát sự kiện cập nhật danh sách người dùng trực tuyến cho tất cả các client
    io.emit('online-users', Array.from(onlineUsers.keys()));

    // Lấy các cuộc trò chuyện mà người dùng tham gia
    const conversationIds = await getUserConversationsForSocketIO(user._id);
    console.log("🚀 ~ conversationIds:", conversationIds)

    // Tham gia các phòng tương ứng với các cuộc trò chuyện
    conversationIds.forEach((conversationId) => {
        socket.join(conversationId.toString());
    });

    // Log các phòng mà socket đã tham gia
    console.log(`User ${user.displayName} joined rooms:`, Array.from(socket.rooms));

    // Xử lý khi người dùng ngắt kết nối
    socket.on("disconnect", () => {

        // Xóa user khỏi onlineUsers map
        onlineUsers.delete(user._id.toString());

        // Phát sự kiện cập nhật danh sách người dùng trực tuyến cho tất cả các client
        io.emit('online-users', Array.from(onlineUsers.keys()));

        console.log(`User ${user.displayName} offline on: ${socket.id}`);
    });
})

export { io, app, server }