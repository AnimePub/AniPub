const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const otherUserId = urlParams.get('user');

if (!otherUserId) {
    window.location.href = '/Home';
}

let currentUser = null;
let otherUser = null;
let typingTimer;
let replyToMessageId = null;
let editingMessageId = null;

const emojis = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','☺️','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪'];

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '/Chat';
});

function getAvatarUrl(avatarNum) {
    if(Number(avatarNum) === 0) {
        return `https://www.anipub.xyz/ZeroTwo.jpg`
    }
    else {
        const PIC = avatarNum;
                            const POSTERARY = PIC.split("https://");
                            let LINKU = "";
                            if(POSTERARY.length > 1){
                                LINKU = "https://" + POSTERARY[1]; 
                                return LINKU;
                            }
                            else {
                                 LINKU= "/"+POSTERARY[0]
                                 return LINKU;
    }}}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

async function loadOtherUser() {
    try {
        const response = await fetch(`/api/users/${otherUserId}`);
        if (response.ok) {
            otherUser = await response.json();
            document.getElementById('other-user-name').textContent = otherUser.Name;
            document.getElementById('other-user-avatar').src = getAvatarUrl(otherUser.Image);
        }
    } catch (error) {
        console.error('Error loading other user:', error);
    }
}

async function loadMessages() {
    try {
        const response = await fetch(`/api/dm/${otherUserId}/messages`);
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

window.editMessage = function(messageId, currentText) {
    editingMessageId = messageId;
    const input = document.getElementById('message-input');
    input.value = currentText;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
};

window.deleteMessage = function(messageId) {
    if (confirm('Delete this message?')) {
        socket.emit('delete message', { messageId, isDM: true });
    }
};

window.reactToMessage = function(messageId) {
    const picker = document.getElementById('emoji-picker');
    picker.setAttribute('data-message-id', messageId);
    picker.classList.toggle('show');
};

const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !otherUserId) return;

    if (editingMessageId) {
        socket.emit('edit message', { 
            messageId: editingMessageId, 
            newMessage: message,
            isDM: true
        });
        editingMessageId = null;
    } else {
        socket.emit('dm message', { 
            otherUserId, 
            message,
            replyTo: replyToMessageId
        });
        replyToMessageId = null;
        document.getElementById('reply-preview').classList.remove('show');
    }

    messageInput.value = '';
    messageInput.style.height = 'auto';
    socket.emit('stop typing', { isDM: true, otherUserId });
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';

    socket.emit('typing', { isDM: true, otherUserId });
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.emit('stop typing', { isDM: true, otherUserId });
    }, 1000);
});

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
        socket.emit('add reaction', { messageId, emoji, isDM: true });
        emojiPicker.removeAttribute('data-message-id');
        emojiPicker.classList.remove('show');
    } else {
        messageInput.value += emoji;
        messageInput.focus();
    }
};

socket.on('connect', async () => {
    console.log('Connected to server');
    await loadUser();
    await loadOtherUser();
    await loadMessages();
    socket.emit('join dm', { otherUserId });
});

socket.on('dm joined', () => {
    messageInput.focus();
});

socket.on('dm message', (data) => {
    addMessage(data);
});

socket.on('dm edited', (data) => {
    const messageEl = document.querySelector(`.message[data-id="${data.messageId}"]`);
    if (messageEl) {
        const textEl = messageEl.querySelector('.message-text');
        textEl.textContent = data.newMessage;
        textEl.classList.add('edited');
    }
});

socket.on('dm deleted', (data) => {
    const messageEl = document.querySelector(`.message[data-id="${data.messageId}"]`);
    if (messageEl) {
        const textEl = messageEl.querySelector('.message-text');
        textEl.textContent = 'This message was deleted';
        textEl.classList.add('deleted');
        const actions = messageEl.querySelector('.message-actions');
        if (actions) actions.remove();
    }
});

socket.on('dm reaction', (data) => {
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

const typingIndicator = document.getElementById('typing-indicator');
socket.on('typing', (data) => {
    typingIndicator.innerHTML = `${data.username} is typing<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
});

socket.on('stop typing', () => {
    typingIndicator.innerHTML = '';
});

window.addEventListener('beforeunload', () => {
    socket.disconnect();
});
