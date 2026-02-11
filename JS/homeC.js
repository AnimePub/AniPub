// Create sakura animation
function createSakura() {
    const bgAnimation = document.getElementById('bg-animation');
    for (let i = 0; i < 25; i++) {
        const sakura = document.createElement('div');
        sakura.className = 'sakura';
        sakura.style.left = Math.random() * 100 + '%';
        sakura.style.animationDuration = (Math.random() * 3 + 5) + 's';
        sakura.style.animationDelay = Math.random() * 5 + 's';
        bgAnimation.appendChild(sakura);
    }
}
createSakura();

let currentUser = null;
let searchTimeout = null;

// Load user
async function loadUser() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            currentUser = await response.json();
            document.getElementById('username').textContent = currentUser.username;
            document.getElementById('user-avatar').src = getAvatarUrl(currentUser.avatar);
            
            if (currentUser.theme) {
                document.body.setAttribute('data-theme', currentUser.theme);
            }
            
            if (currentUser.backgroundImage) {
                document.body.style.backgroundImage = `url('${currentUser.backgroundImage}')`;
            }
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

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
    }
}}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load conversations with pin/unread
async function loadConversations() {
    try {
        const response = await fetch('/api/conversations');
        const conversations = await response.json();
        
        const conversationsList = document.getElementById('conversations-list');
        
        if (conversations.length === 0) {
            conversationsList.innerHTML = `
                <div class="empty-conversations">
                    <i class="fas fa-inbox" style="font-size: 3em; opacity: 0.3; margin-bottom: 10px;"></i>
                    <p>No conversations yet<br>Start chatting with someone!</p>
                </div>
            `;
            return;
        }
        
        conversationsList.innerHTML = conversations.map(conv => `
            <div class="conversation-item ${conv.isPinned ? 'pinned' : ''}" onclick="openDM('${conv.otherUser._id}')">
                <div class="conversation-avatar">
                    <img src="${getAvatarUrl(conv.otherUser.avatar)}" class="avatar avatar-sm" alt="${escapeHtml(conv.otherUser.username)}">
                    ${conv.unreadCount > 0 ? `<div class="unread-badge">${conv.unreadCount}</div>` : ''}
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">${escapeHtml(conv.otherUser.username)}</div>
                    <div class="conversation-preview">${escapeHtml(conv.lastMessage || 'No messages yet')}</div>
                </div>
                <div class="conversation-actions">
                    <button class="pin-btn ${conv.isPinned ? 'pinned' : ''}" onclick="togglePin(event, '${conv.otherUser._id}')" title="${conv.isPinned ? 'Unpin' : 'Pin'}">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

// Toggle pin conversation
window.togglePin = async function(event, userId) {
    event.stopPropagation();
    try {
        const response = await fetch(`/api/conversations/${userId}/pin`, {
            method: 'POST'
        });
        const data = await response.json();
        if (data.success) {
            loadConversations(); // Reload to show updated order
        }
    } catch (error) {
        console.error('Pin error:', error);
    }
};

function openDM(userId) {
    window.location.href = `/private?user=${userId}`;
}

// Load rooms
async function loadRooms() {
    try {
        const response = await fetch('/api/rooms');
        const rooms = await response.json();
        
        const roomsList = document.getElementById('rooms-list');
        
        if (rooms.length === 0) {
            roomsList.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-door-open" style="font-size: 4em; opacity: 0.3; margin-bottom: 20px;"></i>
                    <h3>No rooms yet!</h3>
                    <p>Be the first to create a room! 🌸</p>
                </div>
            `;
            return;
        }
        
        roomsList.innerHTML = rooms.map(room => `
            <div class="room-card" onclick="joinRoom('${room._id}')">
                <div class="room-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="room-name">${escapeHtml(room.name)}</div>
                <div class="room-description">${escapeHtml(room.description || 'No description')}</div>
                <div class="room-meta">
                    <div style="font-size: 0.9em; color: var(--text-secondary);">
                        by <strong style="color: var(--primary-color);">${escapeHtml(room.creatorName)}</strong>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; font-size: 0.9em; color: var(--text-secondary);">
                        <i class="fas fa-users"></i>
                        ${room.members.length}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

function joinRoom(roomId) {
    window.location.href = `/chatroom?room=${roomId}`;
}

// User search
const searchInput = document.getElementById('user-search');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
            const users = await response.json();
            
            if (users.length === 0) {
                searchResults.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: var(--text-secondary);">
                        <i class="fas fa-user-slash"></i><br>
                        No users found
                    </div>
                `;
                return;
            }
            
            searchResults.innerHTML = users.map(user => `
                <div class="user-result" onclick="openDM('${user._id}')">
                    <img src="${getAvatarUrl(user.avatar)}" class="avatar avatar-sm" alt="${escapeHtml(user.username)}">
                    <div class="user-result-info">
                        <div class="user-result-name">${escapeHtml(user.username)}</div>
                        <div class="user-result-bio">${escapeHtml(user.bio || 'No bio')}</div>
                    </div>
                    <i class="fas fa-paper-plane" style="color: var(--primary-color);"></i>
                </div>
            `).join('');
        } catch (error) {
            console.error('Search error:', error);
        }
    }, 300);
});

// Theme button
document.getElementById('theme-btn').addEventListener('click', () => {
    document.getElementById('theme-modal').classList.add('show');
});

window.changeTheme = async function(theme) {
    document.body.setAttribute('data-theme', theme);
    document.getElementById('theme-modal').classList.remove('show');
    
    try {
        await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme })
        });
    } catch (error) {
        console.error('Error saving theme:', error);
    }
};

// Background image button
document.getElementById('bg-btn').addEventListener('click', () => {
    const bgUrl = prompt('Enter background image URL (or leave empty to remove):\n\nExample:\nhttps://www.anipub.xyz/monkey-d-luffy-adventure-digital_bmdna2WUmZqaraWkpJRmbmdsrWZlbWU-4162485200.jpg');
    if (bgUrl !== null) {
        fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ backgroundImage: bgUrl })
        }).then(() => {
            if (bgUrl) {
                document.body.style.backgroundImage = `url('${bgUrl}')`;
            } else {
                document.body.style.backgroundImage = '';
            }
            alert('Background updated! ✨');
        });
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
    window.location.href="/Logout"
});

// Create room modal
const modal = document.getElementById('create-room-modal');
const createRoomBtn = document.getElementById('create-room-btn');
const closeModal = document.getElementById('close-modal');
const createRoomForm = document.getElementById('create-room-form');
const createError = document.getElementById('create-error');

createRoomBtn.addEventListener('click', () => {
    modal.classList.add('show');
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    createRoomForm.reset();
    createError.textContent = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        createRoomForm.reset();
        createError.textContent = '';
    }
});

createRoomForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    createError.textContent = '';
    
    const name = document.getElementById('room-name').value.trim();
    const description = document.getElementById('room-description').value.trim();
    
    try {
        const response = await fetch('/api/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            modal.classList.remove('show');
            createRoomForm.reset();
            loadRooms();
        } else {
            createError.textContent = data.error || 'Failed to create room';
        }
    } catch (error) {
        createError.textContent = 'Connection error. Please try again.';
    }
});

// Initialize
loadUser();
loadConversations();
loadRooms();

// Auto-refresh
setInterval(loadConversations, 10000); // Refresh conversations every 10 seconds
setInterval(loadRooms, 30000); // Refresh rooms every 30 seconds
