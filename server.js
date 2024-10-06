// server.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

// Set up Next.js app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Create Express and HTTP servers
const expressApp = express();
const server = createServer(expressApp);

// Set up Socket.io server
const io = new Server(server);

let rooms = {};
io.on('connection', socket => {
  console.log('A user connected');

  // Functionality for send message to all user
  socket.on('messageToAll', data => {
    console.log('Message received:', data);
    io.emit('messageToAll', data);
  });

  // Functionality for send message to only room member
  socket.on('login', roomId => {
    socket.join(roomId);
    io.in(roomId).emit('user_connected', {
      Id: `${roomId}`,
      message: 'You successfully connected',
    });
  });

  socket.on('messageToRoomMember', data => {
    console.log('Message received:', data.senderID);
    io.in(data.senderID).emit('messageToRoomMember', data.data);
  });

  // Emiit after disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
// io.on('connection', socket => {
//   console.log(`User connected: ${socket.id}`);

//   // Handle room creation/joining
//   socket.on('create-room', room => {
//     socket.join(room);
//     if (!rooms[room]) rooms[room] = [];
//     rooms[room].push(socket.id);
//     console.log(`User ${socket.id} joined room: ${room}`);
//   });

//   // Handle sending messages to a specific room
//   socket.on('message-room', ({ room, message }) => {
//     if (rooms[room]) {
//       io.to(room).emit('receive-message', message); // Emit message only to the specific room
//     }
//   });

//   // Handle broadcasting message to all users except the sender
//   socket.on('message-all', message => {
//     socket.broadcast.emit('receive-message', message); // Broadcast to all except the sender
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     console.log(`User disconnected: ${socket.id}`);
//     // for (let room in rooms) {
//     //   rooms[room] = rooms[room].filter(id => id !== socket.id);
//     //   if (rooms[room].length === 0) delete rooms[room];
//     // }
//   });
// });

// Prepare the Next.js app and routes
app.prepare().then(() => {
  // Serve the Next.js pages
  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  const PORT = process.env.PORT || 3008;
  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
