const socket = io();
let myUsername = '';
let typingTimer = null;
let isTyping = false;

// ── JOIN ──────────────────────────────────────────────────
function joinChat() {
  const input = document.getElementById('username-input');
  const username = input.value.trim();

  if (!username) {
    document.getElementById('join-error').textContent = 'Please enter a name.';
    return;
  }
  if (username.length < 2) {
    document.getElementById('join-error').textContent = 'Name must be at least 2 characters.';
    return;
  }

  myUsername = username;
  socket.emit('join', { username });

  document.getElementById('join-screen').classList.add('hidden');
  document.getElementById('chat-screen').classList.remove('hidden');
  document.getElementById('message-input').focus();
}

// Allow Enter key on join screen
document.getElementById('username-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') joinChat();
});

// ── SEND MESSAGE ──────────────────────────────────────────
function sendMessage() {
  const input = document.getElementById('message-input');
  const message = input.value.trim();
  if (!message) return;

  socket.emit('send_message', { message });
  input.value = '';

  // Stop typing indicator
  if (isTyping) {
    socket.emit('typing', { is_typing: false });
    isTyping = false;
  }
}

// Allow Enter key in message input
document.getElementById('message-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

// ── TYPING INDICATOR ──────────────────────────────────────
document.getElementById('message-input').addEventListener('input', () => {
  if (!isTyping) {
    isTyping = true;
    socket.emit('typing', { is_typing: true });
  }
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    isTyping = false;
    socket.emit('typing', { is_typing: false });
  }, 1500);
});

// ── LEAVE ─────────────────────────────────────────────────
function leaveChat() {
  location.reload();
}

// ── SOCKET EVENTS ─────────────────────────────────────────
socket.on('receive_message', data => {
  const isMine = data.username === myUsername;
  appendMessage(data.username, data.message, data.time, isMine);
});

socket.on('system_message', data => {
  appendSystemMessage(data.message);
  const countEl = document.getElementById('online-count');
  countEl.textContent = `${data.user_count} online`;
});

socket.on('user_list', data => {
  const list = document.getElementById('user-list');
  list.innerHTML = '';
  data.users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user;
    if (user === myUsername) li.classList.add('is-me');
    list.appendChild(li);
  });
});

socket.on('user_typing', data => {
  const indicator = document.getElementById('typing-indicator');
  if (data.is_typing) {
    indicator.textContent = `${data.username} is typing...`;
    indicator.classList.remove('hidden');
  } else {
    indicator.classList.add('hidden');
    indicator.textContent = '';
  }
});

// ── DOM HELPERS ───────────────────────────────────────────
function appendMessage(username, message, time, isMine) {
  const container = document.getElementById('messages');

  const wrapper = document.createElement('div');
  wrapper.classList.add('msg-wrapper', isMine ? 'mine' : 'theirs');

  const meta = document.createElement('div');
  meta.classList.add('msg-meta');
  if (!isMine) meta.innerHTML = `<span class="username">${escapeHtml(username)}</span>`;

  const bubble = document.createElement('div');
  bubble.classList.add('msg-bubble');
  bubble.textContent = message;

  const timeEl = document.createElement('div');
  timeEl.classList.add('msg-time');
  timeEl.textContent = time;

  if (!isMine) wrapper.appendChild(meta);
  wrapper.appendChild(bubble);
  wrapper.appendChild(timeEl);

  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

function appendSystemMessage(text) {
  const container = document.getElementById('messages');
  const div = document.createElement('div');
  div.classList.add('sys-msg');
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
