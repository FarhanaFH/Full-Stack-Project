// Require necessary modules
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server to serve HTML and static files
const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') filePath = './index.html'; // Default to index.html

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    // Add more content types if needed
  }

  // Read and serve the requested file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile('./404.html', (error, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// WebSocket logic
const wss = new WebSocket.Server({ server });
const clients = new Set();

// On new connection
wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  // Broadcast incoming messages to all clients
  ws.on('message', (message) => {
    try {
      const { name, messageText } = JSON.parse(message);
      console.log(`${name}: ${messageText}`);

      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ name, messageText }));
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  // Remove client when disconnected
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
