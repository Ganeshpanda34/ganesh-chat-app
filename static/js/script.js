const clientId = Date.now();
const ws = new WebSocket(`ws://${window.location.host}/ws/${clientId}`);
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const chatStatus = document.querySelector('.chat-status');

let typingTimeout;

// Sound effect (simple beep using data URI for now, or a public URL if available)
// Using a subtle notification sound URL
const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

ws.onmessage = function (event) {
    const messageData = JSON.parse(event.data);

    if (messageData.type === 'chat') {
        displayMessage(messageData.text, messageData.senderId, 'received');
        playNotificationSound();
    } else if (messageData.type === 'typing') {
        handleTyping(messageData);
    }
};

messageInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

messageInput.addEventListener('input', function () {
    sendTypingStatus(true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        sendTypingStatus(false);
    }, 1000);
});

function sendTypingStatus(isTyping) {
    const data = {
        type: 'typing',
        senderId: clientId,
        isTyping: isTyping
    };
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

function handleTyping(data) {
    if (data.isTyping) {
        chatStatus.textContent = 'typing...';
        chatStatus.style.color = '#25d366';
    } else {
        chatStatus.textContent = 'online';
        chatStatus.style.color = '#667781';
    }
}

function sendMessage() {
    const messageText = messageInput.value;
    if (messageText.trim() !== "") {
        const messageData = {
            type: 'chat',
            text: messageText,
            senderId: clientId
        };
        ws.send(JSON.stringify(messageData));
        displayMessage(messageText, clientId, 'sent');
        messageInput.value = '';
        sendTypingStatus(false); // Stop typing immediately after send
    }
}

function displayMessage(text, senderId, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(type);

    // Add fade-in animation class
    messageDiv.classList.add('fade-in');

    const contentDiv = document.createElement('div');
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);

    const metaDiv = document.createElement('div');
    metaDiv.classList.add('message-meta');

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('message-time');
    const now = new Date();
    timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    metaDiv.appendChild(timeSpan);

    if (type === 'sent') {
        const tickSpan = document.createElement('span');
        tickSpan.classList.add('tick');
        // Double tick icon (using FontAwesome)
        tickSpan.innerHTML = '<i class="fas fa-check-double"></i>';
        metaDiv.appendChild(tickSpan);
    }

    messageDiv.appendChild(metaDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function playNotificationSound() {
    notificationSound.play().catch(error => console.log('Audio play failed:', error));
}
