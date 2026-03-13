const socket = io();

document.addEventListener('DOMContentLoaded', () => {
  const messages = document.getElementById('messages');
  const usernameInput = document.getElementById('username');
  const messageInput = document.getElementById('message');
  const sendButton = document.getElementById('send');

  let username = '';

  sendButton.addEventListener('click', () => {
    if (!username) {
      username = usernameInput.value.trim();
      if (!username) {
        alert('Please enter a username first.');
        return;
      }
      socket.emit('join', username);
    }
    const message = messageInput.value.trim();
    if (message) {
      socket.emit('chat message', { message });
      messageInput.value = '';
    }
  });

  socket.on('chat message', (data) => {
    const type = data.username === username ? 'sent' : 'received';
    addMessage(data.username, data.message, type);
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
});