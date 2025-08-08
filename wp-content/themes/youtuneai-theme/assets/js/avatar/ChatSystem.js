/**
 * Chat System with Avatar Integration
 * Handles user interactions and avatar responses
 */

import { AvatarSystem } from './AvatarSystem.js';

export class ChatSystem {
    constructor(options = {}) {
        this.options = {
            container: '#avatar-chat-bubble',
            apiUrl: '/wp-json/yta/v1/chat',
            avatarId: 0,
            ...options
        };
        
        this.container = document.querySelector(this.options.container);
        this.avatar = null;
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.warn('Chat container not found');
            return;
        }
        
        this.setupUI();
        this.initializeAvatar();
        this.bindEvents();
        
        // Show chat bubble after a delay
        setTimeout(() => {
            this.show();
        }, 3000);
    }
    
    setupUI() {
        // Ensure chat UI elements exist
        if (!this.container.querySelector('.chat-input')) {
            const chatHTML = `
                <div class="avatar-container">
                    <canvas id="avatar-canvas" width="200" height="200"></canvas>
                </div>
                <div class="chat-container">
                    <div id="chat-messages" class="chat-messages"></div>
                    <div class="chat-input">
                        <input type="text" id="chat-input-field" placeholder="Type a message...">
                        <button id="chat-send-btn">Send</button>
                    </div>
                </div>
            `;
            this.container.innerHTML = chatHTML;
        }
        
        this.messagesContainer = this.container.querySelector('#chat-messages');
        this.inputField = this.container.querySelector('#chat-input-field');
        this.sendButton = this.container.querySelector('#chat-send-btn');
    }
    
    initializeAvatar() {
        const avatarCanvas = this.container.querySelector('#avatar-canvas');
        if (avatarCanvas) {
            this.avatar = new AvatarSystem(avatarCanvas.parentElement, {
                modelPath: this.options.modelPath || '/wp-content/themes/youtuneai-theme/assets/models/avatar-default.glb',
                width: 200,
                height: 200
            });
        }
    }
    
    bindEvents() {
        // Send message on button click
        this.sendButton?.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter key
        this.inputField?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Toggle chat on avatar click
        this.container?.addEventListener('click', (e) => {
            if (e.target.closest('.avatar-container') && !this.isOpen) {
                this.toggle();
            }
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.container.contains(e.target)) {
                this.close();
            }
        });
    }
    
    async sendMessage() {
        const message = this.inputField?.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.inputField.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        try {
            const response = await fetch(this.options.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    avatar_id: this.options.avatarId
                })
            });
            
            const data = await response.json();
            
            this.hideTyping();
            
            if (data.success) {
                // Add avatar response
                this.addMessage(data.reply, 'avatar');
                
                // Play lip-sync animation if available
                if (data.visemes && this.avatar) {
                    this.avatar.playVisemes(data.visemes);
                }
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'avatar');
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTyping();
            this.addMessage('Connection error. Please check your internet connection.', 'avatar');
        }
    }
    
    addMessage(text, sender) {
        if (!this.messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.innerHTML = `
            <div class="message-content">${this.escapeHtml(text)}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    showTyping() {
        if (!this.messagesContainer) return;
        
        const typingElement = document.createElement('div');
        typingElement.className = 'chat-message avatar typing';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        typingElement.id = 'typing-indicator';
        
        this.messagesContainer.appendChild(typingElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    hideTyping() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    show() {
        this.container.style.display = 'block';
        setTimeout(() => {
            this.container.classList.add('visible');
        }, 100);
    }
    
    hide() {
        this.container.classList.remove('visible');
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 300);
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        this.container.classList.toggle('chat-open', this.isOpen);
        
        if (this.isOpen) {
            this.inputField?.focus();
            
            // Send welcome message if no messages yet
            if (this.messagesContainer?.children.length === 0) {
                setTimeout(() => {
                    this.addMessage("Hi! I'm your YouTuneAI assistant. How can I help you today?", 'avatar');
                }, 500);
            }
        }
    }
    
    close() {
        this.isOpen = false;
        this.container.classList.remove('chat-open');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}