// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// لیست کاربران متصل به چت
const connectedUsers = new Set();

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // وقتی یک کاربر به چت وارد می‌شود
  socket.on('joinChat', (username) => {
    socket.join('chatroom'); // ورود به اتاق چت
    connectedUsers.add(socket.id); // افزودن کاربر به لیست متصل شده‌ها

    const userDisplayName = username || 'Anonymous'; // استفاده از نام کاربری یا "Anonymous"

    // اعلام ورود کاربر به بقیه
    io.to('chatroom').emit('userJoined', userDisplayName);

    // وقتی یک کاربر پیامی ارسال می‌کند
    socket.on('sendMessage', (message) => {
      io.to('chatroom').emit('messageReceived', { user: userDisplayName, message });
    });

    // وقتی کاربر اتصال خود را قطع می‌کند
    socket.on('disconnect', () => {
      console.log(`A user disconnected: ${socket.id}`);
      connectedUsers.delete(socket.id); // حذف کاربر از لیست متصل شده‌ها
      io.to('chatroom').emit('userLeft', userDisplayName); // اعلام خروج کاربر به بقیه
    });
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
