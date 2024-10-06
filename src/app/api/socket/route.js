import { WebSocketServer } from 'ws';

let users = [];

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log('WebSocket server already running');
    res.end();
    return;
  }

  const wss = new WebSocketServer({ server: res.socket.server });

  wss.on('connection', ws => {
    console.log('New client connected');

    ws.on('message', message => {
      const parsedMessage = JSON.parse(message);

      // Handle joining a room
      if (parsedMessage.type === 'join') {
        users.push({ ws, room: parsedMessage.room });
      }

      // Broadcast the message to users in the same room or all users
      if (parsedMessage.type === 'message') {
        const { room, content } = parsedMessage;
        users.forEach(user => {
          if (room === 'all' || user.room === room) {
            user.ws.send(JSON.stringify({ room, content }));
          }
        });
      }
    });

    ws.on('close', () => {
      users = users.filter(user => user.ws !== ws);
      console.log('Client disconnected');
    });
  });

  res.socket.server.io = wss;
  res.end();
}
