// Create animated background
function createSakura() {
    const bgAnimation = document.getElementById('bg-animation');
    for (let i = 0; i < 20; i++) {
        const sakura = document.createElement('div');
        sakura.className = 'sakura';
        sakura.style.left = Math.random() * 100 + '%';
        sakura.style.animationDuration = (Math.random() * 3 + 5) + 's';
        sakura.style.animationDelay = Math.random() * 5 + 's';
        bgAnimation.appendChild(sakura);
    }
}
createSakura();

// Load user info
async function loadUser() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            document.getElementById('username').textContent = user.username;
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

// Load rooms
async function loadRooms() {
    try {
        const response = await fetch('/api/rooms');
        const rooms = await response.json();
        
        const roomsList = document.getElementById('rooms-list');
        
        if (rooms.length === 0) {
            roomsList.innerHTML = `
                <div class="empty-state">
                    <h3>No rooms yet!</h3>
                    <p>Be the first to create a room and start chatting! 🌸</p>
                </div>
            `;
            return;
        }
        
        roomsList.innerHTML = rooms.map(room => `
            <div class="room-card" onclick="joinRoom('${room._id}')">
                <h3>${escapeHtml(room.name)}</h3>
                <p>${escapeHtml(room.description || 'No description')}</p>
                <div class="room-meta">
                    <span class="room-creator">Created by ${escapeHtml(room.creatorName)}</span>
                    <span>${room.members.length} members</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function joinRoom(roomId) {
    window.location.href = `/chatroom?room=${roomId}`;
}

// Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        window.location.href = '/Logout';
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Modal
const modal = document.getElementById('create-room-modal');
const createRoomBtn = document.getElementById('create-room-btn');
const closeModal = document.querySelector('.close');
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

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        createRoomForm.reset();
        createError.textContent = '';
    }
});

// Create room
createRoomForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    createError.textContent = '';
    
    const name = document.getElementById('room-name').value.trim();
    const description = document.getElementById('room-description').value.trim();
    
    try {
        const response = await fetch('/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            modal.classList.remove('show');
            createRoomForm.reset();
            loadRooms(); // Reload rooms list
        } else {
            createError.textContent = data.error || 'Failed to create room';
        }
    } catch (error) {
        createError.textContent = 'Connection error. Please try again.';
    }
});

// Initialize
loadUser();
loadRooms();

// Auto-refresh rooms every 10 seconds
setInterval(loadRooms, 10000);