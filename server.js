// const express = require('express');
// const WebSocket = require('ws');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const clients = new Map(); // Store connected clients

// app.use(express.static('public')); // Serve the HTML file

// wss.on('connection', (ws) => {
//     console.log('Client connected');

//     // Generate a unique ID for each client
//     const clientId = Math.random().toString(36).substr(2, 9);
//     clients.set(clientId, ws);

//     // Send the client their unique ID
//     ws.send(JSON.stringify({ id: clientId }));

//     ws.on('message', (message) => {
//         const data = JSON.parse(message);
//         // Broadcast message to the target client
//         if (data.target) {
//             const targetClient = clients.get(data.target);
//             if (targetClient && targetClient.readyState === WebSocket.OPEN) {
//                 targetClient.send(JSON.stringify({ ...data, from: clientId }));
//             }
//         }
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//         clients.delete(clientId);
//     });
// });

// server.listen(8080, () => {
//     console.log('Signaling server is running on http://localhost:8080');
// });


const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map(); // Store connected clients

app.use(express.static('public')); // Serve the HTML file

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Generate a unique ID for each client
    const clientId = Math.random().toString(36).substr(2, 9);
    clients.set(clientId, ws);

    // Send the client their unique ID
    ws.send(JSON.stringify({ id: clientId }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        // Broadcast message to the target client
        if (data.target) {
            const targetClient = clients.get(data.target);
            if (targetClient && targetClient.readyState === WebSocket.OPEN) {
                targetClient.send(JSON.stringify({ ...data, from: clientId }));
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(clientId);
    });
});

server.listen(8080, () => {
    console.log('Signaling server is running on http://localhost:8080');
});
