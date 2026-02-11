const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');

if (!roomId) {
    window.location.href = '/chat';
}

let currentUser = null;
let typingTimer;
let replyToMessageId = null;
let editingMessageId = null;

// Emojis
const emojis = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','☺️','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','💋','🩸'];

// Back button
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '/chat';
});

// Get avatar URL
function getAvatarUrl(avatarNum) {
    if(avatarNum) {
        return `https://www.anipub.xyz/ZeroTwo.jpg`
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load current user
async function loadUser() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            currentUser = await response.json();
            document.body.setAttribute('data-theme', currentUser.theme || 'purple');
        } else {
            window.location.href = '/login';
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
            addMessage(msg, false);
        });
        
        scrollToBottom();
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function scrollToBottom() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Add message to UI
function addMessage(data, shouldScroll = true) {
    const messagesDiv = document.getElementById('messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.setAttribute('data-id', data._id);
    
    const timestamp = new Date(data.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const isOwnMessage = currentUser && data.sender === currentUser._id;
    const editedClass = data.edited ? 'edited' : '';
    const deletedClass = data.deleted ? 'deleted' : '';
    
    let replyHtml = '';
    if (data.replyTo && data.replyToMessage) {
        replyHtml = `
            <div class="message-reply">
                <div class="message-reply-sender">${escapeHtml(data.replyToSender)}</div>
                <div>${escapeHtml(data.replyToMessage.substring(0, 100))}</div>
            </div>
        `;
    }

    let reactionsHtml = '';
    if (data.reactions && data.reactions.length > 0) {
        const reactionMap = {};
        data.reactions.forEach(r => {
            if (!reactionMap[r.emoji]) {
                reactionMap[r.emoji] = { count: 0, users: [], userIds: [] };
            }
            reactionMap[r.emoji].count++;
            reactionMap[r.emoji].users.push(r.username);
            reactionMap[r.emoji].userIds.push(r.userId);
        });

        reactionsHtml = '<div class="message-reactions">';
        Object.keys(reactionMap).forEach(emoji => {
            const reaction = reactionMap[emoji];
            const userReacted = currentUser && reaction.userIds.includes(currentUser._id);
            const className = userReacted ? 'reaction user-reacted' : 'reaction';
            reactionsHtml += `
                <div class="${className}" title="${reaction.users.join(', ')}">
                    <span>${emoji}</span>
                    <span>${reaction.count}</span>
                </div>
            `;
        });
        reactionsHtml += '</div>';
    }

    let actionsHtml = '';
    if (!data.deleted) {
        actionsHtml = `
            <div class="message-actions">
                <button class="action-btn" onclick="replyToMessage('${data._id}', '${escapeHtml(data.message).replace(/'/g, "\\'")}', '${escapeHtml(data.senderName)}')">
                    <i class="fas fa-reply"></i>
                </button>
                <button class="action-btn" onclick="reactToMessage('${data._id}')">
                    <i class="fas fa-smile"></i>
                </button>
                ${isOwnMessage ? `
                    <button class="action-btn" onclick="editMessage('${data._id}', '${escapeHtml(data.message).replace(/'/g, "\\'")}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteMessage('${data._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        `;
    }
    
    messageEl.innerHTML = `
        <img src="${getAvatarUrl(data.senderAvatar)}" alt="avatar" class="avatar">
        <div class="message-content">
            <div class="message-header">
                <span class="username">${escapeHtml(data.senderName)}</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            ${replyHtml}
            <div class="message-text ${editedClass} ${deletedClass}">${escapeHtml(data.message)}</div>
            ${reactionsHtml}
        </div>
        ${actionsHtml}
    `;
    
    messagesDiv.appendChild(messageEl);
    
    if (shouldScroll) {
        scrollToBottom();
    }
}

function addSystemMessage(text) {
    const messagesDiv = document.getElementById('messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'system-message';
    messageEl.textContent = text;
    messagesDiv.appendChild(messageEl);
    scrollToBottom();
}

// Reply to message
window.replyToMessage = function(messageId, messageText, senderName) {
    replyToMessageId = messageId;
    document.getElementById('reply-preview-text').textContent = `${senderName}: ${messageText.substring(0, 100)}`;
    document.getElementById('reply-preview').classList.add('show');
    document.getElementById('message-input').focus();
};

document.getElementById('cancel-reply').addEventListener('click', () => {
    replyToMessageId = null;
    document.getElementById('reply-preview').classList.remove('show');
});

// Edit message
window.editMessage = function(messageId, currentText) {
    editingMessageId = messageId;
    const input = document.getElementById('message-input');
    input.value = currentText;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
};

// Delete message
window.deleteMessage = function(messageId) {
    if (confirm('Delete this message?')) {
        socket.emit('delete message', { messageId, roomId, isDM: false });
    }
};

// React to message
window.reactToMessage = function(messageId) {
    const picker = document.getElementById('emoji-picker');
    picker.setAttribute('data-message-id', messageId);
    picker.classList.toggle('show');
};

// Send message
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !roomId) return;

    if (editingMessageId) {
        socket.emit('edit message', { 
            messageId: editingMessageId, 
            newMessage: message,
            roomId,
            isDM: false
        });
        editingMessageId = null;
    } else {
        socket.emit('chat message', { 
            roomId, 
            message,
            replyTo: replyToMessageId
        });
        replyToMessageId = null;
        document.getElementById('reply-preview').classList.remove('show');
    }

    messageInput.value = '';
    messageInput.style.height = 'auto';
    socket.emit('stop typing', { roomId, isDM: false });
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize textarea
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';

    socket.emit('typing', { roomId, isDM: false });
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.emit('stop typing', { roomId, isDM: false });
    }, 1000);
});

// Emoji picker
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const emojiGrid = document.getElementById('emoji-grid');

emojiGrid.innerHTML = emojis.map(emoji => 
    `<div class="emoji-item" onclick="selectEmoji('${emoji}')">${emoji}</div>`
).join('');

emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (emojiPicker.hasAttribute('data-message-id')) {
        emojiPicker.removeAttribute('data-message-id');
    }
    emojiPicker.classList.toggle('show');
});

emojiPicker.addEventListener('click', (e) => {
    e.stopPropagation();
});

window.selectEmoji = function(emoji) {
    const messageId = emojiPicker.getAttribute('data-message-id');
    if (messageId) {
        socket.emit('add reaction', { messageId, emoji, roomId, isDM: false });
        emojiPicker.removeAttribute('data-message-id');
        emojiPicker.classList.remove('show');
    } else {
        messageInput.value += emoji;
        messageInput.focus();
    }
};

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

// Handle AI streaming
socket.on('ai stream', (data) => {
    const messageEl = document.querySelector(`.message[data-id="${data.messageId}"]`);
    if (messageEl) {
        const textEl = messageEl.querySelector('.message-text');
        if (textEl) {
            textEl.textContent = data.content;
            scrollToBottom();
        }
    }
});

socket.on('ai complete', (data) => {
    const messageEl = document.querySelector(`.message[data-id="${data.messageId}"]`);
    if (messageEl) {
        const textEl = messageEl.querySelector('.message-text');
        if (textEl) {
            textEl.textContent = data.content;
            messageEl.classList.remove('loading');
        }
    }
});

socket.on('ai error', (data) => {
    const messageEl = document.querySelector(`.message[data-id="${data.messageId}"]`);
    if (messageEl) {
        const textEl = messageEl.querySelector('.message-text');
        if (textEl) {
            textEl.textContent = '❌ AI service temporarily unavailable';
            textEl.classList.add('deleted');
        }
    }
});

socket.on('message edited', (data) => {
    const messageEl = document.querySelector(`.message[data-id="${data.messageId}"]`);
    if (messageEl) {
        const textEl = messageEl.querySelector('.message-text');
        textEl.textContent = data.newMessage;
        textEl.classList.add('edited');
    }
});

socket.on('message deleted', (data) => {
    const messageEl = document.querySelector(`.message[data-id="${data.messageId}"]`);
    if (messageEl) {
        const textEl = messageEl.querySelector('.message-text');
        textEl.textContent = 'This message was deleted';
        textEl.classList.add('deleted');
        const actions = messageEl.querySelector('.message-actions');
        if (actions) actions.remove();
    }
});

socket.on('reaction added', (data) => {
    const messageEl = document.querySelector(`.message[data-id="${data.messageId}"]`);
    if (messageEl) {
        let reactionsDiv = messageEl.querySelector('.message-reactions');
        if (!reactionsDiv) {
            reactionsDiv = document.createElement('div');
            reactionsDiv.className = 'message-reactions';
            messageEl.querySelector('.message-content').appendChild(reactionsDiv);
        }

        const reactionMap = {};
        data.reactions.forEach(r => {
            if (!reactionMap[r.emoji]) {
                reactionMap[r.emoji] = { count: 0, users: [], userIds: [] };
            }
            reactionMap[r.emoji].count++;
            reactionMap[r.emoji].users.push(r.username);
            reactionMap[r.emoji].userIds.push(r.userId);
        });

        reactionsDiv.innerHTML = '';
        Object.keys(reactionMap).forEach(emoji => {
            const reaction = reactionMap[emoji];
            const userReacted = currentUser && reaction.userIds.includes(currentUser._id);
            const className = userReacted ? 'reaction user-reacted' : 'reaction';
            const reactionEl = document.createElement('div');
            reactionEl.className = className;
            reactionEl.title = reaction.users.join(', ');
            reactionEl.innerHTML = `<span>${emoji}</span><span>${reaction.count}</span>`;
            reactionsDiv.appendChild(reactionEl);
        });
    }
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

window.addEventListener('beforeunload', () => {
    socket.disconnect();
});
