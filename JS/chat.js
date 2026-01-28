// Chat Application with Real-Time Socket.IO Support
class AniChat {
    constructor() {
        this.currentRoom = null;
        this.rooms = [];
        this.messages = [];
        this.peerConnections = {};
        this.localStream = null;
        this.dataChannels = {};
        this.currentUser = null;
        this.socket = null;
        this.init();
    }

    async init() {
        // Initialize Socket.IO connection
        this.socket = io();
        this.setupSocketListeners();
        this.attachEventListeners();
        await this.loadRooms();
        await this.setupWebRTC();
    }

    setupSocketListeners() {
        // Socket connection events
        this.socket.on("connect", () => {
            console.log("Connected to chat server");
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected from chat server");
        });

        // Receive messages in real-time
        this.socket.on("receive_message", (data) => {
            this.messages.push(data);
            this.renderMessages();
            // Auto-scroll to bottom
            const messagesContainer = document.querySelector(".messages-container");
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });

        // User joined room notification
        this.socket.on("user_joined", (data) => {
            console.log(`${data.userName} joined the room`);
            this.showNotification(`${data.userName} joined the chat`);
        });

        // User left room notification
        this.socket.on("user_left", (data) => {
            console.log(`${data.userName} left the room`);
            this.showNotification(`${data.userName} left the chat`);
        });

        // Get active users
        this.socket.on("active_users", (users) => {
            console.log("Active users in room:", users);
        });
    }

    attachEventListeners() {
        // Create room button
        const createRoomBtn = document.getElementById("createRoomBtn");
        if (createRoomBtn) {
            createRoomBtn.addEventListener("click", () => {
                this.showCreateRoomModal();
            });
        }

        // Create room form submit
        const createRoomForm = document.getElementById("createRoomForm");
        if (createRoomForm) {
            createRoomForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.createRoom();
            });
        }

        // Modal close buttons
        document.querySelectorAll(".close-modal").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.target.closest(".modal").style.display = "none";
            });
        });

        // Room search
        const roomSearch = document.getElementById("roomSearch");
        if (roomSearch) {
            roomSearch.addEventListener("input", (e) => {
                this.searchRooms(e.target.value);
            });
        }

        // Video call buttons
        const endCallBtn = document.getElementById("endCallBtn");
        if (endCallBtn) {
            endCallBtn.addEventListener("click", () => {
                this.endVideoCall();
            });
        }

        const toggleAudioBtn = document.getElementById("toggleAudioBtn");
        if (toggleAudioBtn) {
            toggleAudioBtn.addEventListener("click", () => {
                this.toggleAudio();
            });
        }

        const toggleVideoBtn = document.getElementById("toggleVideoBtn");
        if (toggleVideoBtn) {
            toggleVideoBtn.addEventListener("click", () => {
                this.toggleVideo();
            });
        }

        const cancelCallBtn = document.getElementById("cancelCallBtn");
        if (cancelCallBtn) {
            cancelCallBtn.addEventListener("click", () => {
                document.getElementById("videoCallModal").style.display = "none";
            });
        }

        // Close modal on outside click
        window.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal")) {
                e.target.style.display = "none";
            }
        });
    }

    async loadRooms() {
        try {
            const response = await fetch("/api/chat/rooms");
            this.rooms = await response.json();
            this.renderRoomsList();
        } catch (err) {
            console.error("Error loading rooms:", err);
        }
    }

    renderRoomsList() {
        const roomsList = document.getElementById("roomsList");
        if (!roomsList) return;
        
        roomsList.innerHTML = "";

        this.rooms.forEach(room => {
            const li = document.createElement("li");
            li.className = `room-item ${this.currentRoom?._id === room._id ? "active" : ""}`;
            li.innerHTML = `
                <div class="room-info">
                    <h4>${room.name}</h4>
                    <small>${room.messages.length} messages</small>
                </div>
                <span class="room-members">${room.members.length}</span>
            `;
            li.addEventListener("click", () => this.selectRoom(room));
            roomsList.appendChild(li);
        });
    }

    searchRooms(query) {
        const roomsList = document.getElementById("roomsList");
        if (!roomsList) return;
        
        const items = roomsList.querySelectorAll(".room-item");

        items.forEach(item => {
            const roomName = item.querySelector("h4").textContent.toLowerCase();
            if (roomName.includes(query.toLowerCase())) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }

    showCreateRoomModal() {
        const modal = document.getElementById("createRoomModal");
        if (modal) {
            modal.style.display = "block";
            const roomName = document.getElementById("roomName");
            if (roomName) roomName.focus();
        }
    }

    async createRoom() {
        const roomName = document.getElementById("roomName");
        const roomDescription = document.getElementById("roomDescription");
        
        if (!roomName || !roomName.value.trim()) {
            alert("Please enter a room name");
            return;
        }

        const name = roomName.value;
        const description = roomDescription ? roomDescription.value : "";

        try {
            const response = await fetch("/api/chat/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description }),
            });

            if (response.ok) {
                const newRoom = await response.json();
                this.rooms.push(newRoom);
                this.renderRoomsList();
                this.selectRoom(newRoom);
                const createRoomModal = document.getElementById("createRoomModal");
                if (createRoomModal) createRoomModal.style.display = "none";
                const createRoomForm = document.getElementById("createRoomForm");
                if (createRoomForm) createRoomForm.reset();
                this.showNotification("Room created successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Error creating room");
            }
        } catch (err) {
            console.error("Error creating room:", err);
            alert("Error creating room");
        }
    }

    async selectRoom(room) {
        // Leave previous room
        if (this.currentRoom) {
            this.socket.emit("leave_room", {
                roomId: this.currentRoom._id,
                userId: this.currentUser?._id,
                userName: this.currentUser?.Name
            });
        }

        this.currentRoom = room;
        
        // Join room on server
        try {
            const response = await fetch(`/api/chat/rooms/${room._id}/join`, { method: "POST" });
            const data = await response.json();
            
            // Get current user info
            const userInfo = document.querySelector(".user-info img");
            if (userInfo && !this.currentUser) {
                // Fetch current user data (you may need to expose this from the server)
                this.currentUser = {
                    _id: userInfo.parentElement.parentElement.dataset.userId || "unknown",
                    Name: document.querySelector(".user-details p")?.textContent || "Unknown",
                    Image: userInfo.src
                };
            }

            // Emit join room event via Socket.IO
            if (this.currentUser) {
                this.socket.emit("join_room", {
                    roomId: room._id,
                    userId: this.currentUser._id,
                    userName: this.currentUser.Name
                });
            }
        } catch (err) {
            console.error("Error joining room:", err);
        }

        // Update UI
        this.renderRoomsList();
        await this.loadMessages();
        this.renderChatInterface();
    }

    async loadMessages() {
        if (!this.currentRoom) return;

        try {
            const response = await fetch(`/api/chat/rooms/${this.currentRoom._id}/messages`);
            this.messages = await response.json();
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    }

    renderChatInterface() {
        const chatContent = document.getElementById("chatContent");
        if (!chatContent) return;
        
        chatContent.innerHTML = `
            <div class="chat-window">
                <div class="chat-header">
                    <div class="room-header-info">
                        <h2>${this.currentRoom.name}</h2>
                        <p>${this.currentRoom.description || "No description"}</p>
                    </div>
                    <div class="chat-header-actions">
                        <button id="videoCallBtn" class="btn-icon" title="Start Video Call">
                            <i class="fas fa-video"></i>
                        </button>
                        <button id="leaveRoomBtn" class="btn-icon" title="Leave Room">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>

                <div class="messages-container">
                    <div id="messagesList" class="messages-list">
                        <!-- Messages will be populated here -->
                    </div>
                </div>

                <div class="chat-input-area">
                    <form id="messageForm">
                        <input 
                            type="text" 
                            id="messageInput" 
                            placeholder="Type your message..." 
                            autocomplete="off"
                        >
                        <button type="submit" class="btn-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;

        // Render messages
        this.renderMessages();

        // Attach event listeners
        const messageForm = document.getElementById("messageForm");
        if (messageForm) {
            messageForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        const videoCallBtn = document.getElementById("videoCallBtn");
        if (videoCallBtn) {
            videoCallBtn.addEventListener("click", () => {
                this.initVideoCall();
            });
        }

        const leaveRoomBtn = document.getElementById("leaveRoomBtn");
        if (leaveRoomBtn) {
            leaveRoomBtn.addEventListener("click", () => {
                this.leaveRoom();
            });
        }

        // Auto-scroll to bottom
        setTimeout(() => {
            const messagesContainer = document.querySelector(".messages-container");
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 100);
    }

    renderMessages() {
        const messagesList = document.getElementById("messagesList");
        if (!messagesList) return;
        
        messagesList.innerHTML = "";

        this.messages.forEach(msg => {
            const msgDiv = document.createElement("div");
            msgDiv.className = "message";
            msgDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="${msg.senderImage || '/default-avatar.png'}" alt="${msg.senderName}">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <strong>${msg.senderName}</strong>
                        <span class="message-time">${this.formatTime(msg.timestamp)}</span>
                    </div>
                    <div class="message-text">${this.escapeHtml(msg.content)}</div>
                </div>
            `;
            messagesList.appendChild(msgDiv);
        });
    }

    async sendMessage() {
        const input = document.getElementById("messageInput");
        if (!input) return;
        
        const content = input.value.trim();

        if (!content || !this.currentRoom || !this.currentUser) return;

        try {
            // First, save to database via HTTP
            const response = await fetch(`/api/chat/rooms/${this.currentRoom._id}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                
                // Emit message via Socket.IO for real-time delivery
                this.socket.emit("send_message", {
                    roomId: this.currentRoom._id,
                    userId: this.currentUser._id,
                    senderName: this.currentUser.Name,
                    senderImage: this.currentUser.Image,
                    content: content,
                    timestamp: newMessage.timestamp || new Date()
                });

                input.value = "";
                input.focus();
            }
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Error sending message");
        }
    }

    async leaveRoom() {
        if (!this.currentRoom) return;

        try {
            // Emit leave room event via Socket.IO
            this.socket.emit("leave_room", {
                roomId: this.currentRoom._id,
                userId: this.currentUser?._id,
                userName: this.currentUser?.Name
            });

            // Leave room on server
            await fetch(`/api/chat/rooms/${this.currentRoom._id}/leave`, {
                method: "DELETE",
            });

            this.currentRoom = null;
            this.messages = [];
            await this.loadRooms();
            
            const chatContent = document.getElementById("chatContent");
            if (chatContent) {
                chatContent.innerHTML = `
                    <div class="welcome-screen">
                        <div class="welcome-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <h2>Welcome to AniChat</h2>
                        <p>Select a room or create a new one to start chatting with anime fans!</p>
                    </div>
                `;
            }
        } catch (err) {
            console.error("Error leaving room:", err);
        }
    }

    // WebRTC Functions
    async setupWebRTC() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: { width: 320, height: 240 },
            });
        } catch (err) {
            console.warn("Could not get user media:", err);
        }
    }

    async initVideoCall() {
        if (!this.localStream) {
            alert("Please allow camera and microphone access first");
            return;
        }

        // Show video call modal
        const modal = document.getElementById("videoCallModal");
        if (modal) modal.style.display = "block";

        // Load online users
        try {
            const response = await fetch(`/api/chat/rooms/${this.currentRoom._id}`);
            const room = await response.json();

            const onlineUsers = document.getElementById("onlineUsers");
            if (onlineUsers) {
                onlineUsers.innerHTML = "";

                room.members.forEach(member => {
                    if (member._id !== this.currentUser?._id) {
                        const userDiv = document.createElement("div");
                        userDiv.className = "user-option";
                        userDiv.innerHTML = `
                            <img src="${member.Image}" alt="${member.Name}">
                            <div>
                                <p>${member.Name}</p>
                                <small>Click to call</small>
                            </div>
                        `;
                        userDiv.addEventListener("click", () => {
                            this.startVideoCallWith(member._id);
                            modal.style.display = "none";
                        });
                        onlineUsers.appendChild(userDiv);
                    }
                });
            }
        } catch (err) {
            console.error("Error loading users:", err);
        }
    }

    async startVideoCallWith(userId) {
        const videoContainer = document.getElementById("videoCallContainer");
        if (videoContainer) videoContainer.style.display = "flex";

        const localVideo = document.getElementById("localVideo");
        if (localVideo) localVideo.srcObject = this.localStream;

        // Create peer connection
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: ["stun:stun.l.google.com:19302"] },
                { urls: ["stun:stun1.l.google.com:19302"] },
            ],
        });

        this.peerConnections[userId] = peerConnection;

        // Add local stream
        this.localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, this.localStream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            const remoteVideo = document.getElementById("remoteVideo");
            if (remoteVideo) remoteVideo.srcObject = event.streams[0];
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("ICE candidate:", event.candidate);
            }
        };

        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        console.log("Offer created - implement signaling server for full functionality");
        const callStatus = document.getElementById("callStatus");
        if (callStatus) callStatus.textContent = "Calling...";
    }

    endVideoCall() {
        Object.values(this.peerConnections).forEach(pc => {
            pc.close();
        });
        this.peerConnections = {};

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }

        const videoCallContainer = document.getElementById("videoCallContainer");
        if (videoCallContainer) videoCallContainer.style.display = "none";
        
        const callStatus = document.getElementById("callStatus");
        if (callStatus) callStatus.textContent = "Call ended";
    }

    toggleAudio() {
        if (this.localStream) {
            const audioTracks = this.localStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });

            const btn = document.getElementById("toggleAudioBtn");
            if (btn) {
                btn.classList.toggle("active");
                btn.classList.toggle("muted");
            }
        }
    }

    toggleVideo() {
        if (this.localStream) {
            const videoTracks = this.localStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });

            const btn = document.getElementById("toggleVideoBtn");
            if (btn) {
                btn.classList.toggle("active");
                btn.classList.toggle("disabled");
            }
        }
    }

    // Utility Functions
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("show");
        }, 100);

        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize chat application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    window.aniChat = new AniChat();
});
        // Create room button
        document.getElementById("createRoomBtn").addEventListener("click", () => {
            this.showCreateRoomModal();
        });

        // Create room form submit
        document.getElementById("createRoomForm").addEventListener("submit", (e) => {
            e.preventDefault();
            this.createRoom();
        });

        // Modal close buttons
        document.querySelectorAll(".close-modal").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.target.closest(".modal").style.display = "none";
            });
        });

        // Room search
        document.getElementById("roomSearch").addEventListener("input", (e) => {
            this.searchRooms(e.target.value);
        });

        // Video call buttons
        document.getElementById("endCallBtn").addEventListener("click", () => {
            this.endVideoCall();
        });

        document.getElementById("toggleAudioBtn").addEventListener("click", () => {
            this.toggleAudio();
        });

        document.getElementById("toggleVideoBtn").addEventListener("click", () => {
            this.toggleVideo();
        });

        document.getElementById("cancelCallBtn").addEventListener("click", () => {
            document.getElementById("videoCallModal").style.display = "none";
        });

        // Close modal on outside click
        window.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal")) {
                e.target.style.display = "none";
            }
        });
    }

    async loadRooms() {
        try {
            const response = await fetch("/api/chat/rooms");
            this.rooms = await response.json();
            this.renderRoomsList();
        } catch (err) {
            console.error("Error loading rooms:", err);
        }
    }

    renderRoomsList() {
        const roomsList = document.getElementById("roomsList");
        roomsList.innerHTML = "";

        this.rooms.forEach(room => {
            const li = document.createElement("li");
            li.className = `room-item ${this.currentRoom?._id === room._id ? "active" : ""}`;
            li.innerHTML = `
                <div class="room-info">
                    <h4>${room.name}</h4>
                    <small>${room.messages.length} messages</small>
                </div>
                <span class="room-members">${room.members.length}</span>
            `;
            li.addEventListener("click", () => this.selectRoom(room));
            roomsList.appendChild(li);
        });
    }

    searchRooms(query) {
        const roomsList = document.getElementById("roomsList");
        const items = roomsList.querySelectorAll(".room-item");

        items.forEach(item => {
            const roomName = item.querySelector("h4").textContent.toLowerCase();
            if (roomName.includes(query.toLowerCase())) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }

    showCreateRoomModal() {
        document.getElementById("createRoomModal").style.display = "block";
        document.getElementById("roomName").focus();
    }

    async createRoom() {
        const name = document.getElementById("roomName").value;
        const description = document.getElementById("roomDescription").value;

        if (!name.trim()) {
            alert("Please enter a room name");
            return;
        }

        try {
            const response = await fetch("/api/chat/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description }),
            });

            if (response.ok) {
                const newRoom = await response.json();
                this.rooms.push(newRoom);
                this.renderRoomsList();
                this.selectRoom(newRoom);
                document.getElementById("createRoomModal").style.display = "none";
                document.getElementById("createRoomForm").reset();
                this.showNotification("Room created successfully!");
            } else {
                const error = await response.json();
                alert(error.error || "Error creating room");
            }
        } catch (err) {
            console.error("Error creating room:", err);
            alert("Error creating room");
        }
    }

    async selectRoom(room) {
        this.currentRoom = room;
        
        // Join room
        try {
            await fetch(`/api/chat/rooms/${room._id}/join`, { method: "POST" });
        } catch (err) {
            console.error("Error joining room:", err);
        }

        // Update UI
        this.renderRoomsList();
        await this.loadMessages();
        this.renderChatInterface();
    }

    async loadMessages() {
        if (!this.currentRoom) return;

        try {
            const response = await fetch(`/api/chat/rooms/${this.currentRoom._id}/messages`);
            this.messages = await response.json();
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    }

    renderChatInterface() {
        const chatContent = document.getElementById("chatContent");
        chatContent.innerHTML = `
            <div class="chat-window">
                <div class="chat-header">
                    <div class="room-header-info">
                        <h2>${this.currentRoom.name}</h2>
                        <p>${this.currentRoom.description || "No description"}</p>
                    </div>
                    <div class="chat-header-actions">
                        <button id="videoCallBtn" class="btn-icon" title="Start Video Call">
                            <i class="fas fa-video"></i>
                        </button>
                        <button id="leaveRoomBtn" class="btn-icon" title="Leave Room">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>

                <div class="messages-container">
                    <div id="messagesList" class="messages-list">
                        <!-- Messages will be populated here -->
                    </div>
                </div>

                <div class="chat-input-area">
                    <form id="messageForm">
                        <input 
                            type="text" 
                            id="messageInput" 
                            placeholder="Type your message..." 
                            autocomplete="off"
                        >
                        <button type="submit" class="btn-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;

        // Render messages
        this.renderMessages();

        // Attach event listeners
        document.getElementById("messageForm").addEventListener("submit", (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        document.getElementById("videoCallBtn").addEventListener("click", () => {
            this.initVideoCall();
        });

        document.getElementById("leaveRoomBtn").addEventListener("click", () => {
            this.leaveRoom();
        });

        // Auto-scroll to bottom
        setTimeout(() => {
            const messagesContainer = document.querySelector(".messages-container");
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    renderMessages() {
        const messagesList = document.getElementById("messagesList");
        messagesList.innerHTML = "";

        this.messages.forEach(msg => {
            const msgDiv = document.createElement("div");
            msgDiv.className = "message";
            const isOwnMessage = msg.sender === document.querySelector(".user-info img").src;
            msgDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="${msg.senderImage}" alt="${msg.senderName}">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <strong>${msg.senderName}</strong>
                        <span class="message-time">${this.formatTime(msg.timestamp)}</span>
                    </div>
                    <div class="message-text">${this.escapeHtml(msg.content)}</div>
                </div>
            `;
            messagesList.appendChild(msgDiv);
        });
    }

    async sendMessage() {
        const input = document.getElementById("messageInput");
        const content = input.value.trim();

        if (!content || !this.currentRoom) return;

        try {
            const response = await fetch(`/api/chat/rooms/${this.currentRoom._id}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                this.messages.push(newMessage);
                this.renderMessages();
                input.value = "";
                input.focus();

                // Auto-scroll to bottom
                const messagesContainer = document.querySelector(".messages-container");
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Error sending message");
        }
    }

    async leaveRoom() {
        if (!this.currentRoom) return;

        try {
            await fetch(`/api/chat/rooms/${this.currentRoom._id}/leave`, {
                method: "DELETE",
            });
            this.currentRoom = null;
            this.messages = [];
            await this.loadRooms();
            document.getElementById("chatContent").innerHTML = `
                <div class="welcome-screen">
                    <div class="welcome-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <h2>Welcome to AniChat</h2>
                    <p>Select a room or create a new one to start chatting with anime fans!</p>
                </div>
            `;
        } catch (err) {
            console.error("Error leaving room:", err);
        }
    }

    // WebRTC Functions
    async setupWebRTC() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: { width: 320, height: 240 },
            });
        } catch (err) {
            console.warn("Could not get user media:", err);
        }
    }

    async initVideoCall() {
        if (!this.localStream) {
            alert("Please allow camera and microphone access first");
            return;
        }

        // Show video call modal
        const modal = document.getElementById("videoCallModal");
        modal.style.display = "block";

        // Load online users
        try {
            const response = await fetch(`/api/chat/rooms/${this.currentRoom._id}`);
            const room = await response.json();

            const onlineUsers = document.getElementById("onlineUsers");
            onlineUsers.innerHTML = "";

            room.members.forEach(member => {
                if (member._id !== document.querySelector(".user-info").dataset.userId) {
                    const userDiv = document.createElement("div");
                    userDiv.className = "user-option";
                    userDiv.innerHTML = `
                        <img src="${member.Image}" alt="${member.Name}">
                        <div>
                            <p>${member.Name}</p>
                            <small>Click to call</small>
                        </div>
                    `;
                    userDiv.addEventListener("click", () => {
                        this.startVideoCallWith(member._id);
                        modal.style.display = "none";
                    });
                    onlineUsers.appendChild(userDiv);
                }
            });
        } catch (err) {
            console.error("Error loading users:", err);
        }
    }

    async startVideoCallWith(userId) {
        const videoContainer = document.getElementById("videoCallContainer");
        videoContainer.style.display = "flex";

        const localVideo = document.getElementById("localVideo");
        localVideo.srcObject = this.localStream;

        // Create peer connection
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: ["stun:stun.l.google.com:19302"] },
                { urls: ["stun:stun1.l.google.com:19302"] },
            ],
        });

        this.peerConnections[userId] = peerConnection;

        // Add local stream
        this.localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, this.localStream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            const remoteVideo = document.getElementById("remoteVideo");
            remoteVideo.srcObject = event.streams[0];
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                // In production, send ICE candidates through signaling server
                console.log("ICE candidate:", event.candidate);
            }
        };

        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // In production, send the offer through your signaling server
        console.log("Offer created - implement signaling server for full functionality");
        document.getElementById("callStatus").textContent = "Calling...";
    }

    endVideoCall() {
        Object.values(this.peerConnections).forEach(pc => {
            pc.close();
        });
        this.peerConnections = {};

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }

        document.getElementById("videoCallContainer").style.display = "none";
        document.getElementById("callStatus").textContent = "Call ended";
    }

    toggleAudio() {
        if (this.localStream) {
            const audioTracks = this.localStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });

            const btn = document.getElementById("toggleAudioBtn");
            btn.classList.toggle("active");
            btn.classList.toggle("muted");
        }
    }

    toggleVideo() {
        if (this.localStream) {
            const videoTracks = this.localStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });

            const btn = document.getElementById("toggleVideoBtn");
            btn.classList.toggle("active");
            btn.classList.toggle("disabled");
        }
    }

    // Utility Functions
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("show");
        }, 100);

        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize chat application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    window.aniChat = new AniChat();
});
