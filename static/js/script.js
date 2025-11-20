const clientId = Date.now();
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}/ws/${clientId}`);
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const chatStatus = document.querySelector('.chat-status');
const sendBtn = document.getElementById('sendBtn');

let typingTimeout;

// Sound effect
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

if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

// Mobile Navigation Logic
const backBtn = document.getElementById('backBtn');
const sidebar = document.querySelector('.sidebar');
const chatArea = document.querySelector('.chat-area');

if (backBtn) {
    backBtn.addEventListener('click', () => {
        sidebar.classList.remove('hidden');
        chatArea.classList.remove('active');
    });
}

const chatItems = document.querySelectorAll('.chat-item');
chatItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
            sidebar.classList.add('hidden');
            chatArea.classList.add('active');
        }
    });
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
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(messageData));
            displayMessage(messageText, clientId, 'sent');
            messageInput.value = '';
            sendTypingStatus(false);
        } else {
            console.error("WebSocket is not open.");
            alert("Connection lost. Please refresh the page.");
        }
    }
}

function displayMessage(text, senderId, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(type);

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
