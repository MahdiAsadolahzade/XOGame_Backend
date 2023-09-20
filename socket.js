// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server,{
  cors: {origin:"*"}
});


const connectedUsers = new Set();

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

 
  socket.on('joinChat', (username) => {
    socket.join('chatroom');
    connectedUsers.add(socket.id);

    const userDisplayName = username || 'Anonymous';

   
    io.to('chatroom').emit('userJoined', userDisplayName);

   
    socket.on('sendMessage', (message) => {
      io.to('chatroom').emit('messageReceived', { user: userDisplayName, message });
    });

  
    socket.on('disconnect', () => {
      console.log(`A user disconnected: ${socket.id}`);
      connectedUsers.delete(socket.id); 
      io.to('chatroom').emit('userLeft', userDisplayName); 
    });
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
