import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pointRoutes from './routes/pointRoutes.js';
import initializeSocket from './socket/socket.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  },
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);
app.use(cookieParser());
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

// Initialize Socket.IO
initializeSocket(io);
 
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use('/ping' ,(req,res) =>{
    res.send('/pong')
})


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/points', pointRoutes);

// Start server
const PORT = process.env.PORT || 5001; // Updated to match your backend port
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));