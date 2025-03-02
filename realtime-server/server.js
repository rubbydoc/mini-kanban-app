/**
 * This script sets up a WebSocket server using the 'ws' library.
 * The server listens on port 8080 and handles client connections.
 * 
 * When a client connects, a message is logged to the console.
 * The server listens for messages from the client and echoes them back with a prefix.
 * When a client disconnects, a message is logged to the console.
 * 
 * The server runs on ws://localhost:8080.
 */
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
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

console.log('WebSocket server is running on ws://localhost:8080');

