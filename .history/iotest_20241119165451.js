// eslint-disable-next-line import/no-extraneous-dependencies
const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to the server');

  // Emitting a message event (e.g., sendMessage)
  socket.emit('sendMessage', {
    content: 'Hello. This is admin',
    teamId: '66f29d485ef232f97b04c1eb',
    userId: '66f54854fc0097005cb2d3f9',
  });
});

socket.on('receiveMessage', (message) => {
  console.log('Message received:', message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.log('Connection failed:', error.message);
});
