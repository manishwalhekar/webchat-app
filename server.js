const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/stickers', express.static('stickers'));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ success: true, filename: req.file.filename });
  } else {
    res.json({ success: false });
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    socket.username = username;
    io.emit('user joined', username);
  });

  socket.on('chat message', (data) => {
    io.emit('chat message', { username: socket.username, message: data.message, timestamp: new Date() });
  });

  socket.on('image message', (data) => {
    io.emit('image message', { username: socket.username, filename: data.filename, timestamp: new Date() });
  });

  socket.on('sticker message', (data) => {
    io.emit('sticker message', { username: socket.username, src: data.src, timestamp: new Date() });
  });

  socket.on('gif message', (data) => {
    io.emit('gif message', { username: socket.username, url: data.url, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.username) {
      io.emit('user left', socket.username);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});