const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Session middleware setup
const sessionMiddleware = session({
    secret: 'MAGIRAZI',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookies in production
});

app.use(sessionMiddleware);

// MongoDB connection setup
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Routes setup
const nodeRoutes = require('./routes/nodes');
app.use('/nodes', nodeRoutes);

// HTTP and Socket.io server setup
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3001", // Replace with your frontend's origin
        methods: ["GET", "POST"]
    }
});

// Integrate session middleware with Socket.io
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected');
    const user = socket.request.session.user;

    if (user && user.projectId) {
        socket.join(user.projectId);
        console.log(`User joined project: ${user.projectId}`);

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        socket.on('updateTopology', (data) => {
            try {
                io.to(user.projectId).emit('topologyUpdated', data);
                console.log(`Topology updated for project: ${user.projectId}`);
            } catch (error) {
                console.error('Error updating topology:', error);
            }
        });
    } else {
        console.warn('No user or projectId found in session');
    }
});

// Server listening
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
