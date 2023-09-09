const socket = io();

// Listen for the WebSocket event 'messageCreated'
socket.on('messageCreated', (message) => {
    // Call the function to create a message card for the newly created message
    const messageCard = document.createElement('div');
    messageCard.classList.add('message-card');
    messageCard.innerHTML = `
        <p><strong>${message.email}:</strong> ${message.message}</p>
    `;

    // Add the card to the messages container
    const messagesContainer = document.getElementById('messages');
    messagesContainer.appendChild(messageCard);
});

// Function to send a message
function sendMessage() {
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    fetch('/api/chat/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
    })
        .then((response) => {
            if (response.ok) {
                // The message was sent successfully
                document.getElementById('message').value = ''; // Clear the message field
            } else {
                // Handle the error if necessary
                console.error('Error sending the message');
            }
        });
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('send-button').addEventListener('click', sendMessage);
});