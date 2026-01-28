# ⚡ Socket.IO Quick Reference Card

## Installation
```bash
npm install socket.io
```

## Quick Test (3 steps)
```
1. npm run dev
2. Open http://localhost:3000/chat in 2 windows
3. Send message from one → Appears instantly in other! ✨
```

---

## Socket.IO Events - Quick Lookup

### From Client (emit)
```js
socket.emit("join_room", {roomId, userId, userName})
socket.emit("send_message", {roomId, userId, senderName, senderImage, content, timestamp})
socket.emit("leave_room", {roomId, userId, userName})
socket.emit("get_active_users", roomId)
```

### From Server (listen)
```js
socket.on("receive_message", (data) => { /* data has content, sender, timestamp */ })
socket.on("user_joined", (data) => { /* data has userId, userName */ })
socket.on("user_left", (data) => { /* data has userId, userName */ })
socket.on("active_users", (users) => { /* array of active users */ })
socket.on("connect", () => { /* connection established */ })
socket.on("disconnect", () => { /* connection lost */ })
```

---

## Key Files
| File | What Changed |
|------|--------------|
| `backend/app.js` | Added Socket.IO server + handlers |
| `JS/chat.js` | Updated for real-time events |
| `views-ejs/chat.ejs` | Added Socket.IO script |
| `package.json` | Added socket.io dependency |

---

## Message Flow (Simple)
```
User A sends → REST API saves to DB → 
Socket.IO broadcasts → User B sees instantly ✨
```

---

## Common Tasks

### Listen for Messages
```js
this.socket.on("receive_message", (data) => {
    this.messages.push(data);
    this.renderMessages();
});
```

### Send Message
```js
this.socket.emit("send_message", {
    roomId: this.currentRoom._id,
    userId: this.currentUser._id,
    senderName: this.currentUser.Name,
    senderImage: this.currentUser.Image,
    content: "Hello!",
    timestamp: new Date()
});
```

### Join Room
```js
this.socket.emit("join_room", {
    roomId: room._id,
    userId: currentUser._id,
    userName: currentUser.Name
});
```

### Get Active Users
```js
this.socket.emit("get_active_users", roomId);
this.socket.on("active_users", (users) => {
    console.log(users); // Array of active users
});
```

---

## Testing Commands (Browser Console)

```js
// Check connection
window.aniChat.socket.connected

// Emit test event
window.aniChat.socket.emit("join_room", {
    roomId: "test123",
    userId: "user123",
    userName: "Test User"
});

// Listen for messages
window.aniChat.socket.on("receive_message", (data) => {
    console.log("Message:", data);
});

// Check socket ID
window.aniChat.socket.id
```

---

## Latency
- **Before:** 5-10 seconds (manual refresh)
- **After:** <100ms (Socket.IO WebSocket) ⚡

---

## Troubleshooting Quick Fixes
| Issue | Fix |
|-------|-----|
| Messages not instant | Hard refresh: Ctrl+F5 |
| Socket won't connect | Restart: npm run dev |
| 404 on /socket.io/socket.io.js | Install socket.io: npm install |
| Can't see other's messages | Verify same room ID |

---

## Architecture
```
Client A ←→ Socket.IO Server ←→ Client B
           (WebSocket, Real-time)
           Saves to MongoDB
```

---

## Verification Checklist
- [ ] npm install completed
- [ ] npm run dev works
- [ ] Chat page loads
- [ ] 2 users in same room
- [ ] User A sends message
- [ ] User B sees it instantly (no refresh)
- [ ] Join/leave notifications appear

---

## Features Ready Now
✅ Real-time messages
✅ Join/leave notifications  
✅ Message persistence
✅ Multiple rooms
✅ User tracking

---

## Future Enhancements
🔜 Typing indicators
🔜 Message read receipts
🔜 User presence status
🔜 Message reactions
🔜 File sharing

---

## Documentation Files
- **START HERE:** [CHAT_QUICK_START.md](CHAT_QUICK_START.md)
- **API Reference:** [SOCKET_IO_EVENTS_REFERENCE.md](SOCKET_IO_EVENTS_REFERENCE.md)
- **Architecture:** [ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md)
- **All Docs:** [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

---

## Socket.IO Basics
| Concept | Explanation |
|---------|-------------|
| **WebSocket** | Persistent TCP connection for real-time communication |
| **Event** | Message sent between client and server |
| **emit()** | Send an event |
| **on()** | Listen for an event |
| **room** | Group of sockets to broadcast to |
| **broadcast** | Send to all except sender |
| **to(room)** | Send to specific room |

---

## Status Check
```bash
# Server running?
curl http://localhost:3000/chat

# Socket.IO accessible?
curl http://localhost:3000/socket.io/socket.io.js
```

---

## One-Liner Tests
```js
// Check if Socket.IO is working
window.aniChat.socket.on("receive_message", (d) => alert("Got: " + d.content));
```

---


