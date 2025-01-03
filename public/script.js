document.addEventListener("DOMContentLoaded", () => {
  const messageForm = document.getElementById("messageForm");
  const toInput = document.getElementById("ToInput");
  const messageInput = document.getElementById("messageInput");
  const notesContainer = document.getElementById("notesContainer");
  const toCounter = document.getElementById("toCounter");
  const messageCounter = document.getElementById("messageCounter");

  const TO_LIMIT = 50; // Character limit for "To"
  const MESSAGE_LIMIT = 150; // Character limit for the message

  // Update character counters
  function updateCounters() {
    toCounter.textContent = `${toInput.value.length}/${TO_LIMIT}`;
    messageCounter.textContent = `${messageInput.value.length}/${MESSAGE_LIMIT}`;
  }

  // Validate input length
  function validateInput() {
    if (toInput.value.length > TO_LIMIT) {
      toInput.value = toInput.value.substring(0, TO_LIMIT);
    }
    if (messageInput.value.length > MESSAGE_LIMIT) {
      messageInput.value = messageInput.value.substring(0, MESSAGE_LIMIT);
    }
    updateCounters();
  }

  // Fetch existing messages and display them
  async function fetchMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    displayMessages(messages);
  }

  // Display messages as sticky notes
  function displayMessages(messages) {
    notesContainer.innerHTML = ""; // Clear previous messages
    messages.forEach(({ to, message }) => {
      const note = document.createElement("div");
      note.className = "note";
      note.innerHTML = `<div class="to">To: ${to}</div><p>${message}</p>`;
      notesContainer.appendChild(note);
    });
  }

  // Handle form submission to post a new message
  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const to = toInput.value.trim();
    const message = messageInput.value.trim();
    if (to && message) {
      if (to.length <= TO_LIMIT && message.length <= MESSAGE_LIMIT) {
        const response = await fetch('/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, message }),
        });
        if (response.ok) {
          fetchMessages(); // Refresh messages after posting
          toInput.value = "";
          messageInput.value = "";
          updateCounters();
        } else {
          alert("Failed to post message.");
        }
      } else {
        alert("Character limit exceeded!");
      }
    } else {
      alert("Please fill in both fields.");
    }
  });

  // Initial fetch of messages
  fetchMessages();

  // Poll for new messages every 10 seconds
  setInterval(fetchMessages, 10000);

  // Add event listeners for live validation
  toInput.addEventListener("input", validateInput);
  messageInput.addEventListener("input", validateInput);

  // Initialize counters
  updateCounters();
});
