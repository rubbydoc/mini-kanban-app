
const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const wsServer = new WebSocket.Server({ port: 8080 });

wsServer.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Echo the message back to the client
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('taskUpdated', (task) => {
        io.emit('taskUpdated', task);
    });

    socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(4000, () => console.log('Real-time server running on port 4000'));

console.log('WebSocket server is running on ws://localhost:8080');

