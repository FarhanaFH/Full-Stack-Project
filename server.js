const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

// Create an HTTP server to serve the HTML file
const server = http.createServer((req, res) => {
  fs.readFile('index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (message) => {
    // Parse the JSON message
    try {
      const { name, messageText } = JSON.parse(message);
  
      // Broadcast the message to all connected clients
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ name, messageText })); // Send message back as JSON
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
