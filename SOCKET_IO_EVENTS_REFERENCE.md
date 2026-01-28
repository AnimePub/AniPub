# Socket.IO Event Reference

## Client Events (Emitted FROM Frontend)

### 1. Join Room
```javascript
socket.emit("join_room", {
    roomId: "507f1f77bcf86cd799439011",      // MongoDB Room ID
    userId: "507f1f77bcf86cd799439012",      // MongoDB User ID
    userName: "John Doe"                      // User's display name
});
```
**When**: User clicks on a chat room
**Purpose**: Tell server user is joining the room

---

### 2. Send Message
```javascript
socket.emit("send_message", {
    roomId: "507f1f77bcf86cd799439011",      // Room ID
    userId: "507f1f77bcf86cd799439012",      // Sender's user ID
    senderName: "John Doe",                   // Sender's name
    senderImage: "https://...",               // Sender's avatar URL
    content: "Hello everyone!",               // Message text
    timestamp: "2024-01-28T10:30:00Z"        // When sent
});
```
**When**: User sends a message
**Purpose**: Broadcast message to all users in the room

---

### 3. Leave Room
```javascript
socket.emit("leave_room", {
    roomId: "507f1f77bcf86cd799439011",      // Room ID
    userId: "507f1f77bcf86cd799439012",      // User ID
    userName: "John Doe"                      // User name
});
```
**When**: User clicks "Leave Room" button
**Purpose**: Notify others that user is leaving

---

### 4. Get Active Users
```javascript
socket.emit("get_active_users", "507f1f77bcf86cd799439011");
```
**Parameter**: Room ID
**Purpose**: Request list of currently active users in room

---

## Server Events (Received BY Frontend)

### 1. Receive Message
```javascript
socket.on("receive_message", (data) => {
    // data contains:
    {
        sender: "507f1f77bcf86cd799439012",   // Sender's user ID
        senderName: "John Doe",                // Sender's display name
        senderImage: "https://...",            // Sender's avatar
        content: "Hello everyone!",            // Message text
        timestamp: "2024-01-28T10:30:00Z"     // When sent
    }
});
```
**Triggered**: When ANY user (including sender) in the room sends a message
**Use**: Display message in chat window

---

### 2. User Joined
```javascript
socket.on("user_joined", (data) => {
    // data contains:
    {
        userId: "507f1f77bcf86cd799439012",   // User's ID
        userName: "John Doe"                   // User's name
    }
});
```
**Triggered**: When a new user joins the room
**Use**: Show notification "John Doe joined the chat"

---

### 3. User Left
```javascript
socket.on("user_left", (data) => {
    // data contains:
    {
        userId: "507f1f77bcf86cd799439012",   // User's ID
        userName: "John Doe"                   // User's name
    }
});
```
**Triggered**: When a user leaves the room
**Use**: Show notification "John Doe left the chat"

---

### 4. Active Users
```javascript
socket.on("active_users", (users) => {
    // users is an array:
    [
        {
            userId: "507f1f77bcf86cd799439012",
            userName: "John Doe",
            socketId: "abc123xyz..."
        },
        {
            userId: "507f1f77bcf86cd799439013",
            userName: "Jane Smith",
            socketId: "def456uvw..."
        }
    ]
});
```
**Triggered**: In response to `get_active_users` request
**Use**: Update UI with list of online users

---

### 5. Connect
```javascript
socket.on("connect", () => {
    console.log("Connected to chat server");
});
```
**Triggered**: When Socket.IO establishes connection to server
**Use**: Update UI to show "Connected" status

---

### 6. Disconnect
```javascript
socket.on("disconnect", () => {
    console.log("Disconnected from chat server");
});
```
**Triggered**: When Socket.IO connection is lost
**Use**: Update UI to show "Disconnected" status, attempt reconnect

---

## Complete Flow Example

### Scenario: User A sends message "Hello" in a room with User B

```
┌─────────────────────────────────┐
│  USER A (Browser 1)             │
│                                  │
│  1. Types "Hello" in input box   │
│  2. Clicks Send button           │
│  3. sendMessage() is called      │
│                                  │
│  ① POST /api/chat/rooms/...     │ (Save to database)
│     Save message to MongoDB      │
│     Response: message object     │
│                                  │
│  ② emit "send_message" event    │
│     Send to Socket.IO server     │
└──────────────┬──────────────────┘
               │
               │ WebSocket Connection
               │
┌──────────────▼──────────────────┐
│  SERVER (Node.js + Socket.IO)    │
│                                  │
│  Receives "send_message" event   │
│  Broadcasts to all users in room │
│  io.to(roomId).emit("recv...")   │
└──────────────┬──────────────────┘
               │
        ┌──────┴──────┐
        │             │
        │ WebSocket   │ WebSocket
        │             │
┌───────▼─────┐  ┌────▼────────────┐
│  USER A     │  │  USER B         │
│             │  │  (Browser 2)    │
│ ③ receive   │  │                 │
│   "receive_ │  │ ③ receive       │
│   message"  │  │  "receive_      │
│   event     │  │  message" event │
│             │  │                 │
│ ④ Message   │  │ ④ Message       │
│   displayed │  │   displayed     │
│   in chat   │  │   in chat       │
│   (instant) │  │   (instant)     │
└─────────────┘  └─────────────────┘
```

### Timeline
```
0ms   - User A clicks Send
10ms  - Message saved to MongoDB
15ms  - Socket.IO broadcasts event
20ms  - User A receives and displays message
25ms  - User B receives and displays message
        (Total latency: ~25ms - user doesn't notice! ⚡)
```

---

## Error Handling

### What if send fails?
```javascript
// In chat.js sendMessage():
try {
    const response = await fetch(`/api/chat/rooms/${this.currentRoom._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
    });

    if (response.ok) {
        // Only emit Socket.IO if REST API succeeded
        this.socket.emit("send_message", { ... });
    }
} catch (err) {
    console.error("Error sending message:", err);
    alert("Error sending message");
}
```

### What if Socket.IO disconnects?
```javascript
socket.on("disconnect", () => {
    // Alert user they're disconnected
    console.log("Lost connection to chat server");
    
    // Socket.IO automatically attempts reconnection
    // Connection will resume when server is back online
});

socket.on("connect", () => {
    console.log("Reconnected to chat server!");
});
```

---

## Data Types Reference

```javascript
// MongoDB ObjectId (as string)
userId: "507f1f77bcf86cd799439011"

// Room ID
roomId: "507f1f77bcf86cd799439011"

// User name
userName: "John Doe"

// Avatar URL
senderImage: "https://example.com/avatar.jpg"

// Message content
content: "This is a message"

// ISO 8601 Timestamp
timestamp: "2024-01-28T10:30:00.000Z"

// Socket.IO connection ID
socketId: "abc123xyz..."
```

---

## Common Mistakes to Avoid

❌ **Don't**: Emit send_message before saving to database
```javascript
// Wrong order!
this.socket.emit("send_message", ...);  // Before DB save
await fetch(...);  // After DB save
```

✅ **Do**: Save to database first, then emit
```javascript
// Correct order!
const response = await fetch(...);  // Save to DB first
if (response.ok) {
    this.socket.emit("send_message", ...);  // Then emit
}
```

---

❌ **Don't**: Forget to join room
```javascript
// Wrong - won't receive messages!
// User never called emit("join_room")
```

✅ **Do**: Join room first
```javascript
// Correct - always emit join_room first
socket.emit("join_room", { roomId, userId, userName });
// Then messages will be received
```

---

## Testing Events in Console

You can test Socket.IO events directly in browser console:

```javascript
// Test emitting join_room
window.aniChat.socket.emit("join_room", {
    roomId: "YOUR_ROOM_ID",
    userId: "YOUR_USER_ID",
    userName: "Test User"
});

// Test emitting message
window.aniChat.socket.emit("send_message", {
    roomId: "YOUR_ROOM_ID",
    userId: "YOUR_USER_ID",
    senderName: "Test User",
    senderImage: "https://...",
    content: "Test message",
    timestamp: new Date()
});

// Listen for events
window.aniChat.socket.on("receive_message", (data) => {
    console.log("Received:", data);
});
```

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| **Latency (same network)** | 20-50ms |
| **Latency (internet)** | 100-200ms |
| **Max users per room** | 1000+ (depends on server) |
| **Concurrent connections** | Limited by server resources |
| **Message size limit** | 1MB (default) |
| **Reconnection time** | <5 seconds |

---

## References

- **Socket.IO Documentation**: https://socket.io/docs/
- **Socket.IO Client API**: https://socket.io/docs/client-api/
- **Socket.IO Server API**: https://socket.io/docs/server-api/
