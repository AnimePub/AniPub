let messages = [];
let isTyping = false;

const chat = document.getElementById('chat');
const input = document.getElementById('input');

function loadHistory() {
    const saved = localStorage.getItem('zerotwo_chat');
    if (saved) {
        messages = JSON.parse(saved);
        messages.forEach(msg => addMessage(msg.role, msg.content, false));
    } else {
        // Welcome message
        setTimeout(() => {
            const welcome = "Hey there, Darling~ 💕 I've been waiting for you. What kind of trouble should we get into today? Hehe~";
            addMessage('assistant', welcome);
            messages.push({ role: 'assistant', content: welcome });
            saveHistory();
        }, 600);
    }
}

function saveHistory() {
    localStorage.setItem('zerotwo_chat', JSON.stringify(messages));
}

function addMessage(role, content, animate = true) {
    const div = document.createElement('div');
    div.className = `flex gap-4 ${role === 'user' ? 'justify-end' : ''} message-bubble`;
    
    if (role === 'assistant') {
        div.innerHTML = `
            <div class="w-9 h-9 flex-shrink-0 mt-1">
                <img src="https://c.tenor.com/jDzuJe3ss3wAAAAd/zero-two-darling-in-the-franxx.gif" class="w-full h-full object-cover rounded-2xl zero-avatar">
            </div>
            <div>
                <div class="flex items-center gap-x-2 mb-1">
                    <div class="font-medium text-pink-400">Zero Two</div>
                    <div class="text-zinc-500 text-xs">02</div>
                </div>
                <div class="prose prose-zinc prose-invert max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl px-5 py-4 leading-relaxed">
                    ${content}
                </div>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="max-w-md">
                <div class="bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 leading-relaxed">
                    ${content}
                </div>
            </div>
        `;
    }
    
    chat.appendChild(div);
    chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    return div;
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing';
    typingDiv.className = 'flex gap-4 message-bubble';
    typingDiv.innerHTML = `
        <div class="w-9 h-9 flex-shrink-0 mt-1">
            <img src="https://c.tenor.com/jDzuJe3ss3wAAAAd/zero-two-darling-in-the-franxx.gif" class="w-full h-full object-cover rounded-2xl zero-avatar">
        </div>
        <div>
            <div class="flex items-center gap-x-2 mb-1">
                <div class="font-medium text-pink-400">Zero Two</div>
                <div class="text-zinc-500 text-xs">typing...</div>
            </div>
            <div class="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-3xl px-5 py-4">
                <div class="typing-dot w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="typing-dot w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="typing-dot w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
        </div>
    `;
    chat.appendChild(typingDiv);
    chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    return typingDiv;
}

function removeTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
}

async function sendMessage() {
    const text = input.value.trim();
    if (!text || isTyping) return;

    addMessage('user', text);
    messages.push({ role: 'user', content: text });
    saveHistory();
    input.value = '';

    isTyping = true;
    const typingIndicator = showTyping();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages })
        });

        removeTyping();

        if (!response.ok) throw new Error('Error');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = '';
        let currentDiv = null;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6);
                    if (dataStr === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(dataStr);
                        if (parsed.content) {
                            aiResponse += parsed.content;

                            if (!currentDiv) {
                                currentDiv = addMessage('assistant', aiResponse);
                            } else {
                                currentDiv.querySelector('.prose').innerHTML = aiResponse;
                            }
                            chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
                        }
                    } catch (e) {}
                }
            }
        }

        messages.push({ role: 'assistant', content: aiResponse });
        saveHistory();

    } catch (err) {
        removeTyping();
        addMessage('assistant', "Sorry Darling... my horns are acting up. Try again? 💕");
    }

    isTyping = false;
}

function clearChat() {
    if (confirm("Start a new conversation with Zero Two?")) {
        localStorage.removeItem('zerotwo_chat');
        messages = [];
        chat.innerHTML = '';
        loadHistory();
    }
}

// Enter key support
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto resize textarea
input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 160) + 'px';
});

// Init
window.onload = () => {
    loadHistory();
};