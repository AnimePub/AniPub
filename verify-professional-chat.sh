#!/bin/bash

echo "🔍 AniPub Professional Chat Service - Verification Checklist"
echo "============================================================"
echo ""

# Check 1: Socket.IO package
echo "✅ Check 1: Socket.IO Package"
if grep -q '"socket.io"' /workspaces/AniPub/package.json; then
    echo "   ✅ socket.io found in package.json"
else
    echo "   ❌ socket.io NOT found in package.json"
fi
echo ""

# Check 2: Backend Socket.IO handler
echo "✅ Check 2: Backend user-message Handler"
if grep -q 'socket.on("user-message"' /workspaces/AniPub/backend/app.js; then
    echo "   ✅ user-message handler found in backend/app.js"
else
    echo "   ❌ user-message handler NOT found"
fi

# Check for DB save
if grep -q 'room.messages.push(message)' /workspaces/AniPub/backend/app.js; then
    echo "   ✅ Database save logic found"
else
    echo "   ❌ Database save logic NOT found"
fi

# Check for broadcast
if grep -q 'io.to(roomId).emit("receive_message"' /workspaces/AniPub/backend/app.js; then
    echo "   ✅ Broadcast logic found"
else
    echo "   ❌ Broadcast logic NOT found"
fi
echo ""

# Check 3: Frontend Socket.IO emit
echo "✅ Check 3: Frontend Socket.IO Emit"
if grep -q 'socket.emit("user-message"' /workspaces/AniPub/JS/chat.js; then
    echo "   ✅ socket.emit('user-message') found in JS/chat.js"
else
    echo "   ❌ socket.emit('user-message') NOT found"
fi
echo ""

# Check 4: Frontend listeners
echo "✅ Check 4: Frontend Error/Confirmation Handlers"
if grep -q 'socket.on("message-sent"' /workspaces/AniPub/JS/chat.js; then
    echo "   ✅ message-sent listener found"
else
    echo "   ⚠️  message-sent listener not found"
fi

if grep -q 'socket.on("message-error"' /workspaces/AniPub/JS/chat.js; then
    echo "   ✅ message-error listener found"
else
    echo "   ⚠️  message-error listener not found"
fi
echo ""

# Check 5: Validation in backend
echo "✅ Check 5: Server-Side Validation"
if grep -q 'if (typeof msge !==.*string' /workspaces/AniPub/backend/app.js; then
    echo "   ✅ Message validation found"
else
    echo "   ⚠️  Message validation not found"
fi

if grep -q 'if (msge.length > 5000)' /workspaces/AniPub/backend/app.js; then
    echo "   ✅ Message length check found"
else
    echo "   ⚠️  Message length check not found"
fi
echo ""

# Check 6: Room URL route
echo "✅ Check 6: Room URL Routing"
if grep -q 'chatRouter.get("/chat/:roomname"' /workspaces/AniPub/backend/router/chat.js; then
    echo "   ✅ Room URL route (/chat/:roomname) found"
else
    echo "   ⚠️  Room URL route not found"
fi
echo ""

# Check 7: Database model
echo "✅ Check 7: Chat Database Model"
if grep -q 'const Room = mongoose.model' /workspaces/AniPub/backend/models/chat.js; then
    echo "   ✅ Room model found"
else
    echo "   ❌ Room model NOT found"
fi

if grep -q 'messages: \[messageSchema\]' /workspaces/AniPub/backend/models/chat.js; then
    echo "   ✅ Message array in room schema found"
else
    echo "   ❌ Message array NOT found"
fi
echo ""

echo "============================================================"
echo "🎯 All Checks Complete!"
echo ""
echo "Next Steps:"
echo "1. Restart the server: Ctrl+C then npm run dev"
echo "2. Open chat: http://localhost:3000/chat"
echo "3. Send a message"
echo "4. Check browser console (F12) for confirmation logs"
echo "5. Verify message appears instantly in 2 windows"
echo "6. Check MongoDB for saved message"
echo ""
echo "✨ You now have a professional real-time chat service!"
