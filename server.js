// // const express = require('express');
// // const WebSocket = require('ws');
// // const http = require('http');

// // const app = express();
// // const server = http.createServer(app);
// // const wss = new WebSocket.Server({ server });

// // const clients = new Map(); // Store connected clients

// // app.use(express.static('public')); // Serve the HTML file

// // wss.on('connection', (ws) => {
// //     console.log('Client connected');

// //     // Generate a unique ID for each client
// //     const clientId = Math.random().toString(36).substr(2, 9);
// //     clients.set(clientId, ws);

// //     // Send the client their unique ID
// //     ws.send(JSON.stringify({ id: clientId }));

// //     ws.on('message', (message) => {
// //         const data = JSON.parse(message);
// //         // Broadcast message to the target client
// //         if (data.target) {
// //             const targetClient = clients.get(data.target);
// //             if (targetClient && targetClient.readyState === WebSocket.OPEN) {
// //                 targetClient.send(JSON.stringify({ ...data, from: clientId }));
// //             }
// //         }
// //     });

// //     ws.on('close', () => {
// //         console.log('Client disconnected');
// //         clients.delete(clientId);
// //     });
// // });

// // server.listen(8080, () => {
// //     console.log('Signaling server is running on http://localhost:8080');
// // });


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





const WebSocket = require('ws');

let clients = new Map(); // Store connected clients

module.exports = (req, res) => {
    if (req.method === 'GET' && req.url === '/ws') {
        const wss = new WebSocket.Server({ noServer: true });

        // Handle WebSocket connections
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

        req.socket.server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        });

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('WebSocket server is running');
    } else {
        res.writeHead(404);
        res.end();
    }
};
