// Prompt the user to enter their name
const name = prompt('Enter your name:');

// Establish WebSocket connection
const ws = new WebSocket('ws://localhost:3000');

// Select DOM elements
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

// Event listener for WebSocket open event
ws.addEventListener('open', () => {
  // Notify server that user has joined
  sendMessageToServer(`User ${name} has joined the chat.`);
});

// Function to send message to server
function sendMessageToServer(messageText) {
  ws.send(JSON.stringify({ name, messageText }));
}

// Event listener for Send button click
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message.trim() !== '') {
    sendMessageToServer(message); // Send message to server
    messageInput.value = ''; // Clear input
  }
});

// Event listener for receiving messages from WebSocket server
ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  displayMessage(`${data.name}: ${data.messageText}`);
});

// Function to display message in the chat window with a timestamp
function displayMessage(message) {
    const messageDiv = document.createElement('div');
    
    // Add timestamp to message
    const timestamp = new Date().toLocaleTimeString();
    messageDiv.textContent = `[${timestamp}] ${message}`;
    
    messages.appendChild(messageDiv);
  }
  
