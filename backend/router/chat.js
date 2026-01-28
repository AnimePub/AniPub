const express = require("express");
const chatRouter = express.Router();
const jwt = require("jsonwebtoken");
const { Message, Room } = require("../models/chat");
const Data = require("../models/model");
const { AuthAcc } = require("../middleware/valideAcc");

const JSONAUTH = process.env.jsonauth;

// Helper function to get user from token
const getUserFromToken = (token) => {
    try {
        const decoded = jwt.verify(token, JSONAUTH);
        return decoded.id;
    } catch (err) {
        return null;
    }
};

// GET - Main chat page (list all rooms)
chatRouter.get("/chat", AuthAcc, async (req, res) => {
    const Token = req.cookies.anipub;
    const userId = getUserFromToken(Token);

    if (!userId) {
        return res.redirect("/Login");
    }

    try {
        const user = await Data.findById(userId);
        const rooms = await Room.find({}).sort({ updatedAt: -1 });

        res.render("chat", {
            user: user,
            rooms: rooms,
            selectedRoomName: null,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading chat");
    }
});

// GET - Chat room by name
chatRouter.get("/chat/:roomname", AuthAcc, async (req, res) => {
    const Token = req.cookies.anipub;
    const userId = getUserFromToken(Token);

    if (!userId) {
        return res.redirect("/Login");
    }

    try {
        const { roomname } = req.params;
        const user = await Data.findById(userId);
        const rooms = await Room.find({}).sort({ updatedAt: -1 });
        
        // Find the specific room by name
        const selectedRoom = await Room.findOne({ name: roomname });
        
        if (!selectedRoom) {
            return res.status(404).render("404");
        }

        res.render("chat", {
            user: user,
            rooms: rooms,
            selectedRoomName: roomname,
            selectedRoomId: selectedRoom._id,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading chat room");
    }
});

// GET - Get all chat rooms
chatRouter.get("/api/chat/rooms", AuthAcc, async (req, res) => {
    try {
        const rooms = await Room.find({})
            .populate("members", "Name Image")
            .sort({ updatedAt: -1 });
        res.json(rooms);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching rooms" });
    }
});

// POST - Create new chat room
chatRouter.post("/api/chat/rooms", AuthAcc, async (req, res) => {
    const Token = req.cookies.anipub;
    const userId = getUserFromToken(Token);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Room name is required" });
        }

        // Check if room already exists
        const existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ error: "Room already exists" });
        }

        const newRoom = await Room.create({
            name,
            description: description || "",
            members: [userId],
        });

        res.json(newRoom);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error creating room" });
    }
});

// GET - Get messages from a room
chatRouter.get("/api/chat/rooms/:roomId/messages", AuthAcc, async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId)
            .populate("messages.sender", "Name Image")
            .sort({ "messages.timestamp": 1 });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.json(room.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching messages" });
    }
});

// POST - Send message to a room
chatRouter.post("/api/chat/rooms/:roomId/messages", AuthAcc, async (req, res) => {
    const Token = req.cookies.anipub;
    const userId = getUserFromToken(Token);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { roomId } = req.params;
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({ error: "Message content is required" });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        const user = await Data.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const message = {
            sender: userId,
            senderName: user.Name,
            senderImage: user.Image,
            content: content,
            timestamp: new Date(),
        };

        room.messages.push(message);
        room.updatedAt = new Date();
        await room.save();

        res.json(message);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error sending message" });
    }
});

// POST - Join a room
chatRouter.post("/api/chat/rooms/:roomId/join", AuthAcc, async (req, res) => {
    const Token = req.cookies.anipub;
    const userId = getUserFromToken(Token);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        // Check if user already in room
        if (!room.members.includes(userId)) {
            room.members.push(userId);
            await room.save();
        }

        res.json({ success: true, message: "Joined room successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error joining room" });
    }
});

// DELETE - Leave a room
chatRouter.delete("/api/chat/rooms/:roomId/leave", AuthAcc, async (req, res) => {
    const Token = req.cookies.anipub;
    const userId = getUserFromToken(Token);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        room.members = room.members.filter(id => id.toString() !== userId);
        await room.save();

        res.json({ success: true, message: "Left room successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error leaving room" });
    }
});

// GET - Get room details
chatRouter.get("/api/chat/rooms/:roomId", AuthAcc, async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId)
            .populate("members", "Name Image");

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.json(room);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching room details" });
    }
});

module.exports = chatRouter;
