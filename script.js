// Get the current hour and show appropriate greeting
function setGreeting() {
  const currentHour = new Date().getHours();
  const greetingElement = document.getElementById('greeting');

  if (currentHour >= 0 && currentHour < 12) {
    greetingElement.innerText = "Good Morning!";
  } else if (currentHour >= 12 && currentHour < 18) {
    greetingElement.innerText = "Good Afternoon!";
  } else {
    greetingElement.innerText = "Good Evening!";
  }
}

setGreeting();  // Call the function to set the greeting

// Handle the chat form submission
const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const chatbox = document.getElementById('chatbox');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage('user', userMessage);
  input.value = '';

  addTypingIndicator();

  try {
    const response = await fetch('/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `message=${encodeURIComponent(userMessage)}`
    });

    const data = await response.json();
    removeTypingIndicator();
    addMessage('bot', data.response);
  } catch (error) {
    removeTypingIndicator();
    addMessage('bot', 'Oops! Something went wrong. Try again.');
  }
});

function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
  messageDiv.innerText = text;
  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function addTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing';
  typingDiv.className = 'message bot-message';
  typingDiv.innerText = 'Math Buddy is thinking...';
  chatbox.appendChild(typingDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById('typing');
  if (typingDiv) {
    typingDiv.remove();
  }
}
