const socket = io();
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const imageInput = document.getElementById('image');
const sendButton = document.getElementById('send');

let username = '';

usernameInput.addEventListener('change', () => {
  username = usernameInput.value;
  socket.emit('join', username);
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat message', { message });
    messageInput.value = '';
  }

  if (imageInput.files[0]) {
    uploadImage(imageInput.files[0]);
  }
});

imageInput.addEventListener('change', () => {
  if (imageInput.files[0]) {
    sendButton.textContent = 'Send Image';
  } else {
    sendButton.textContent = 'Send';
  }
});

function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      socket.emit('image message', { filename: data.filename });
      imageInput.value = '';
      sendButton.textContent = 'Send';
    }
  });
}

socket.on('chat message', (data) => {
  addMessage(data.username, data.message, 'received');
});

socket.on('image message', (data) => {
  addImageMessage(data.username, data.filename, 'received');
});

socket.on('user joined', (user) => {
  addMessage('System', `${user} joined the chat`, 'system');
});

socket.on('user left', (user) => {
  addMessage('System', `${user} left the chat`, 'system');
});

function addMessage(username, message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', type);
  messageDiv.innerHTML = `<strong>${username}:</strong> ${message}`;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

function addImageMessage(username, filename, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', 'image-message', type);
  messageDiv.innerHTML = `<strong>${username}:</strong><br><img src="/uploads/${filename}" alt="Image">`;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}