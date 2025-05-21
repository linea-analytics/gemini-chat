// Configure marked options for better markdown rendering
marked.setOptions({
  highlight: function(code, lang) {
    return code;
  },
  breaks: true, // Convert line breaks to <br>
  gfm: true, // Enable GitHub Flavored Markdown
  headerIds: false, // Disable header IDs for security
  mangle: false, // Disable mangle for security
  sanitize: true // Enable built-in sanitizer as additional security layer
});

// Store conversation history
let conversationHistory = [];

// Check API key on load
async function checkApiKey() {
  try {
    const userKey = document.getElementById("apiKey").value.trim();
    if (userKey) {
      return; // Don't show warning if user has entered an API key
    }
    
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "test" })
    });
    const data = await res.json();
    
    if (data.error && data.error.includes('No Gemini API key provided')) {
      const warning = document.createElement('div');
      warning.className = 'notification is-warning is-light';
      warning.innerHTML = `
        <button class="delete"></button>
        <strong>No API Key Found!</strong>
        <p>Please set up your Gemini API key in the settings to use the chat.</p>
        <a href="https://aistudio.google.com/apikey" target="_blank" class="button is-warning is-small mt-2">
          <span class="icon">
            <i class="fas fa-key"></i>
          </span>
          <span>Get API Key</span>
        </a>
      `;
      
      document.querySelector('.container').insertBefore(
        warning, 
        document.querySelector('.columns')
      );
      
      // Handle close button
      warning.querySelector('.delete').addEventListener('click', () => {
        warning.remove();
      });
    }
  } catch (error) {
    console.error('Error checking API key:', error);
  }
}

// Run check on page load
checkApiKey();

// Modal handling
const modal = document.getElementById('apiKeyModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeButtons = document.querySelectorAll('.delete, .cancel-modal');
const saveApiKeyBtn = document.getElementById('saveApiKey');

// Open modal
settingsBtn.addEventListener('click', () => {
  modal.classList.add('is-active');
});

// Close modal
closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modal.classList.remove('is-active');
  });
});

// Save API key
saveApiKeyBtn.addEventListener('click', () => {
  modal.classList.remove('is-active');
  // Remove warning notification if it exists
  const warning = document.querySelector('.notification.is-warning');
  if (warning) {
    warning.remove();
  }
});

// Helper function to add message to UI
function addMessageToUI(content, isUser) {
  const messagesContainer = document.getElementById('messagesContainer');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'is-primary' : (isDarkMode ? 'is-dark' : 'is-info')} my-2`;
  
  const messageBody = document.createElement('div');
  messageBody.className = `message-body ${isUser ? '' : 'message-bot'}`;
  
  if (isUser) {
    messageBody.style.whiteSpace = 'pre-wrap';
    messageBody.textContent = content;
  } else {
    // For bot messages, parse markdown and sanitize
    const htmlContent = marked.parse(content);
    messageBody.innerHTML = DOMPurify.sanitize(htmlContent);
  }
  
  messageDiv.appendChild(messageBody);
  messagesContainer.appendChild(messageDiv);
  
  // Scroll to bottom
  const chatContainer = document.getElementById('chatContainer');
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Handle Enter key in textarea
document.getElementById("prompt").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevent newline
    document.getElementById("submitBtn").click(); // Trigger submit
  }
});

// Submit handler
document.getElementById("submitBtn").addEventListener("click", async () => {
  const promptInput = document.getElementById("prompt");
  const prompt = promptInput.value.trim();
  const apiKey = document.getElementById("apiKey").value.trim();
  
  if (!prompt) return;
  
  // Add user message to UI
  addMessageToUI(prompt, true);
  
  // Clear input
  promptInput.value = '';
  
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        apiKey,
        history: conversationHistory
      }),
    });

    const data = await res.json();
    
    if (data.error) {
      if (data.helpUrl) {
        addMessageToUI(`Error: ${data.error}\nGet your API key here: ${data.helpUrl}`, false);
      } else {
        addMessageToUI(`Error: ${data.error}`, false);
      }
      return;
    }
    
    // Add response to UI
    addMessageToUI(data.result, false);
    
    // Update conversation history
    conversationHistory.push({ 
      role: 'user', 
      content: prompt 
    }, { 
      role: 'assistant', 
      content: data.result 
    });
    
  } catch (error) {
    addMessageToUI(`Error: ${error.message}`, false);
  }
});

// Dark mode handling
const darkModeBtn = document.getElementById('darkModeBtn');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('darkMode', isDarkMode);
  updateDarkMode();
}

function updateDarkMode() {
  document.body.classList.toggle('has-background-dark', isDarkMode);
  document.body.classList.toggle('has-text-light', isDarkMode);
  
  // Update title color
  const appTitle = document.getElementById('appTitle');
  appTitle.classList.toggle('has-text-light', isDarkMode);
  appTitle.classList.toggle('has-text-dark', !isDarkMode);
  
  // Update container background and shadow
  const chatContainer = document.getElementById('chatContainer');
  chatContainer.classList.toggle('has-background-dark', isDarkMode);
  chatContainer.classList.toggle('has-text-light', isDarkMode);
  chatContainer.classList.toggle('box-shadow-light', isDarkMode); // Add light shadow in dark mode
  
  // Update buttons
  darkModeBtn.classList.toggle('is-dark', isDarkMode);
  darkModeBtn.classList.toggle('is-light', !isDarkMode);
  darkModeBtn.querySelector('i').classList.toggle('fa-sun', isDarkMode);
  darkModeBtn.querySelector('i').classList.toggle('fa-moon', !isDarkMode);
  
  // Update messages
  const messages = document.querySelectorAll('.message');
  messages.forEach(msg => {
    if (msg.classList.contains('is-primary')) return; // Skip user messages
    msg.classList.toggle('is-dark', isDarkMode);
    msg.classList.toggle('is-info', !isDarkMode);
  });
  
  // Update input area
  const textarea = document.getElementById('prompt');
  textarea.classList.toggle('has-background-dark', isDarkMode);
  textarea.classList.toggle('has-text-light', isDarkMode);

  // Update footer
  const footer = document.getElementById('mainFooter');
  footer.classList.toggle('has-background-dark', isDarkMode);
  footer.classList.toggle('has-background-light', !isDarkMode);
  footer.classList.toggle('has-text-light', isDarkMode);
  
  const footerBtns = document.querySelectorAll('#githubBtn, #linkedinBtn');
  footerBtns.forEach(btn => {
    btn.classList.toggle('is-dark', isDarkMode);
    btn.classList.toggle('is-light', !isDarkMode);
  });
}

// Initialize dark mode
updateDarkMode();

// Add click handler for dark mode toggle
darkModeBtn.addEventListener('click', toggleDarkMode);
