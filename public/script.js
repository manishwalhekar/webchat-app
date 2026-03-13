const socket = io();
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const imageInput = document.getElementById('image');
const sendButton = document.getElementById('send');
const emojiBtn = document.getElementById('emoji-btn');
const stickerBtn = document.getElementById('sticker-btn');
const gifBtn = document.getElementById('gif-btn');
const emojiPicker = document.getElementById('emoji-picker');
const stickerPicker = document.getElementById('sticker-picker');
const gifSearch = document.getElementById('gif-search');
const gifQuery = document.getElementById('gif-query');
const searchGifBtn = document.getElementById('search-gif');
const gifResults = document.getElementById('gif-results');

let username = '';
let currentPicker = null;

// Emoji Picker
const picker = new EmojiPicker();
emojiPicker.appendChild(picker);
picker.addEventListener('emoji-click', event => {
  messageInput.value += event.detail.emoji.unicode;
  emojiPicker.style.display = 'none';
});

emojiBtn.addEventListener('click', () => {
  togglePicker(emojiPicker);
});

stickerBtn.addEventListener('click', () => {
  togglePicker(stickerPicker);
});

gifBtn.addEventListener('click', () => {
  togglePicker(gifSearch);
});

function togglePicker(picker) {
  if (currentPicker && currentPicker !== picker) {
    currentPicker.style.display = 'none';
  }
  picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
  currentPicker = picker.style.display === 'block' ? picker : null;
}

// Sticker
document.querySelectorAll('.sticker').forEach(sticker => {
  sticker.addEventListener('click', () => {
    const src = sticker.dataset.src;
    socket.emit('sticker message', { src });
    stickerPicker.style.display = 'none';
  });
});

// GIF Search
searchGifBtn.addEventListener('click', () => {
  const query = gifQuery.value.trim();
  if (query) {
    searchGifs(query);
  }
});

function searchGifs(query) {
  fetch(`https://api.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=LIVDSRZULELA&limit=10`)
    .then(response => response.json())
    .then(data => {
      gifResults.innerHTML = '';
      data.results.forEach(gif => {
        const img = document.createElement('img');
        img.src = gif.media[0].gif.url;
        img.classList.add('gif-thumb');
        img.addEventListener('click', () => {
          socket.emit('gif message', { url: gif.media[0].gif.url });
          gifSearch.style.display = 'none';
        });
        gifResults.appendChild(img);
      });
    });
}

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

socket.on('sticker message', (data) => {
  addStickerMessage(data.username, data.src, 'received');
});

socket.on('gif message', (data) => {
  addGifMessage(data.username, data.url, 'received');
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

function addStickerMessage(username, src, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', 'sticker-message', type);
  messageDiv.innerHTML = `<strong>${username}:</strong><br><img src="${src}" alt="Sticker" style="max-width: 100px;">`;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

function addGifMessage(username, url, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', 'gif-message', type);
  messageDiv.innerHTML = `<strong>${username}:</strong><br><img src="${url}" alt="GIF" style="max-width: 200px;">`;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}