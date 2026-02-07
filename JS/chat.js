const socket = io();

// Get room ID from URL
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');

if (!roomId) {
    window.location.href = '/';
}

let currentUser = null;
let typingTimer;

// Back button
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '/';
});

// Get avatar URL
function getAvatarUrl(avatarNum) {
    const colors = ['FF6B9D', '667eea', 'FFA500', '20E3B2', 'F368E0', '00D2FF', 'FFD93D', 'A8E6CF'];
    return `https://ui-avatars.com/api/?name=${avatarNum}&background=${colors[avatarNum - 1]}&color=fff&size=100&bold=true`;
}

// Load current user
async function loadUser() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            currentUser = await response.json();
        } else {
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

// Load previous messages
async function loadMessages() {
    try {
        const response = await fetch(`/api/rooms/${roomId}/messages`);
        const messages = await response.json();
        
        messages.forEach(msg => {
            addMessage(msg, false); // Don't scroll for old messages initially
        });
        
        // Scroll to bottom after loading all messages
        const messagesDiv = document.getElementById('messages');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Add message to UI
function addMessage(data, shouldScroll = true) {
    const messagesDiv = document.getElementById('messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    
    const timestamp = new Date(data.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageEl.innerHTML = `
        <img src="${getAvatarUrl(data.senderAvatar)}" alt="avatar" class="avatar">
        <div class="message-content">
            <div class="message-header">
                <span class="username">${escapeHtml(data.senderName)}</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            <div class="message-text">${escapeHtml(data.message)}</div>
        </div>
    `;
    
    messagesDiv.appendChild(messageEl);
    
    if (shouldScroll) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Add system message
function addSystemMessage(text) {
    const messagesDiv = document.getElementById('messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'system-message';
    messageEl.textContent = text;
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Send message
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

function sendMessage() {
    const message = messageInput.value.trim();
    if (message && roomId) {
        socket.emit('chat message', { roomId, message });
        messageInput.value = '';
        socket.emit('stop typing');
    }
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Typing indicator
messageInput.addEventListener('input', () => {
    socket.emit('typing');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.emit('stop typing');
    }, 1000);
});

// Socket events
socket.on('connect', async () => {
    console.log('Connected to server');
    await loadUser();
    await loadMessages();
    socket.emit('join room', { roomId });
});

socket.on('room joined', (data) => {
    document.getElementById('room-name').textContent = data.roomName;
    document.getElementById('online-count').textContent = data.onlineUsers.length;
    messageInput.focus();
});

socket.on('chat message', (data) => {
    addMessage(data);
});

socket.on('user joined', (data) => {
    addSystemMessage(`✨ ${data.username} joined the room!`);
    document.getElementById('online-count').textContent = data.onlineCount;
});

socket.on('user left', (data) => {
    addSystemMessage(`👋 ${data.username} left the room`);
});

socket.on('update online count', (count) => {
    document.getElementById('online-count').textContent = count;
});

const typingIndicator = document.getElementById('typing-indicator');
socket.on('typing', (data) => {
    typingIndicator.innerHTML = `${data.username} is typing<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
});

socket.on('stop typing', () => {
    typingIndicator.innerHTML = '';
});

socket.on('error', (message) => {
    console.error('Socket error:', message);
    alert(message);
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    socket.disconnect();
});
