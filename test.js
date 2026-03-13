const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Test client connected');
  socket.emit('join', 'TestUser');
  setTimeout(() => {
    socket.emit('chat message', { message: 'Hello from test' });
  }, 1000);
});

socket.on('chat message', (data) => {
  console.log('Received chat message:', data);
});

socket.on('user joined', (user) => {
  console.log('User joined:', user);
});