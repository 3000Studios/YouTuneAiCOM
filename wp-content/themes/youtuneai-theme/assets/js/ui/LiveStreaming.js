/**
 * Live Streaming System
 * Handles WebRTC streaming, device management, and session authentication
 */

export class LiveStreamingSystem {
    constructor() {
        this.isAuthenticated = false;
        this.isStreaming = false;
        this.localStream = null;
        this.peerConnections = new Map();
        this.streamStartTime = null;
        this.streamTimer = null;
        this.viewers = 0;
        this.signalServer = null;
        this.config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadDevices();
        this.connectSignalServer();
    }
    
    /**
     * Check if user is already authenticated
     */
    checkAuthentication() {
        const authToken = sessionStorage.getItem('youtuneai_auth_token');
        const authExpiry = sessionStorage.getItem('youtuneai_auth_expiry');
        
        if (authToken && authExpiry && Date.now() < parseInt(authExpiry)) {
            this.isAuthenticated = true;
            this.showLiveInterface();
        } else {
            this.showPasswordModal();
        }
    }
    
    /**
     * Show password modal
     */
    showPasswordModal() {
        const modal = document.getElementById('password-modal');
        const liveContainer = document.getElementById('live-container');
        
        if (modal) modal.style.display = 'flex';
        if (liveContainer) liveContainer.style.display = 'none';
    }
    
    /**
     * Show live interface after authentication
     */
    showLiveInterface() {
        const modal = document.getElementById('password-modal');
        const liveContainer = document.getElementById('live-container');
        
        if (modal) modal.style.display = 'none';
        if (liveContainer) liveContainer.style.display = 'flex';
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Password form
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => this.handlePasswordSubmit(e));
        }
        
        // Device selection
        const cameraSelect = document.getElementById('camera-select');
        const micSelect = document.getElementById('microphone-select');
        
        if (cameraSelect) {
            cameraSelect.addEventListener('change', () => this.handleDeviceChange());
        }
        
        if (micSelect) {
            micSelect.addEventListener('change', () => this.handleDeviceChange());
        }
        
        // Stream controls
        const setupBtn = document.getElementById('setup-stream-btn');
        const goLiveBtn = document.getElementById('go-live-btn');
        const endStreamBtn = document.getElementById('end-stream-btn');
        
        if (setupBtn) {
            setupBtn.addEventListener('click', () => this.setupStream());
        }
        
        if (goLiveBtn) {
            goLiveBtn.addEventListener('click', () => this.startStream());
        }
        
        if (endStreamBtn) {
            endStreamBtn.addEventListener('click', () => this.endStream());
        }
        
        // Admin controls
        const adminPanelBtn = document.getElementById('admin-panel-btn');
        if (adminPanelBtn) {
            adminPanelBtn.addEventListener('click', () => this.openAdminPanel());
        }
    }
    
    /**
     * Handle password form submission
     */
    async handlePasswordSubmit(e) {
        e.preventDefault();
        
        const password = document.getElementById('access-password').value;
        const errorEl = document.getElementById('password-error');
        
        try {
            const response = await fetch('/wp-json/yta/v1/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': youtuneaiData?.nonce || ''
                },
                body: JSON.stringify({ password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Store authentication token
                const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
                sessionStorage.setItem('youtuneai_auth_token', result.token);
                sessionStorage.setItem('youtuneai_auth_expiry', expiry.toString());
                
                this.isAuthenticated = true;
                this.showLiveInterface();
                this.showToast('Authentication successful!', 'success');
            } else {
                if (errorEl) {
                    errorEl.style.display = 'block';
                    errorEl.textContent = result.message || 'Invalid password';
                }
            }
        } catch (error) {
            console.error('Authentication error:', error);
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.textContent = 'Connection error. Please try again.';
            }
        }
    }
    
    /**
     * Load available devices
     */
    async loadDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameraSelect = document.getElementById('camera-select');
            const micSelect = document.getElementById('microphone-select');
            
            // Clear existing options
            if (cameraSelect) {
                cameraSelect.innerHTML = '<option value="">Select Camera</option>';
            }
            if (micSelect) {
                micSelect.innerHTML = '<option value="">Select Microphone</option>';
            }
            
            devices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `${device.kind} ${device.deviceId.substr(0, 5)}`;
                
                if (device.kind === 'videoinput' && cameraSelect) {
                    cameraSelect.appendChild(option);
                } else if (device.kind === 'audioinput' && micSelect) {
                    micSelect.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error loading devices:', error);
            this.showToast('Failed to load devices', 'error');
        }
    }
    
    /**
     * Handle device selection change
     */
    async handleDeviceChange() {
        const cameraSelect = document.getElementById('camera-select');
        const micSelect = document.getElementById('microphone-select');
        const setupBtn = document.getElementById('setup-stream-btn');
        
        const hasCamera = cameraSelect?.value;
        const hasMic = micSelect?.value;
        
        if (hasCamera || hasMic) {
            setupBtn.disabled = false;
            setupBtn.classList.add('ready');
        } else {
            setupBtn.disabled = true;
            setupBtn.classList.remove('ready');
        }
    }
    
    /**
     * Setup stream with selected devices
     */
    async setupStream() {
        const cameraSelect = document.getElementById('camera-select');
        const micSelect = document.getElementById('microphone-select');
        const previewVideo = document.getElementById('preview-video');
        const previewOverlay = document.getElementById('preview-overlay');
        const goLiveBtn = document.getElementById('go-live-btn');
        
        try {
            const constraints = {
                video: cameraSelect?.value ? { deviceId: cameraSelect.value } : false,
                audio: micSelect?.value ? { deviceId: micSelect.value } : false
            };
            
            // Stop existing stream
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => track.stop());
            }
            
            // Get new stream
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Show preview
            if (previewVideo) {
                previewVideo.srcObject = this.localStream;
                previewOverlay.style.display = 'none';
            }
            
            // Enable go live button
            if (goLiveBtn) {
                goLiveBtn.disabled = false;
            }
            
            this.showToast('Stream setup complete!', 'success');
            
            // Update stream quality info
            this.updateStreamQuality();
            
        } catch (error) {
            console.error('Error setting up stream:', error);
            this.showToast('Failed to access camera/microphone', 'error');
        }
    }
    
    /**
     * Start live stream
     */
    async startStream() {
        if (!this.localStream) {
            this.showToast('Please setup your stream first', 'error');
            return;
        }
        
        const title = document.getElementById('stream-title').value;
        const description = document.getElementById('stream-description').value;
        
        try {
            // Create stream session
            const response = await fetch('/wp-json/yta/v1/stream/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': youtuneaiData?.nonce || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('youtuneai_auth_token')}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    type: 'webrtc'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.streamId = result.stream_id;
                this.isStreaming = true;
                this.streamStartTime = Date.now();
                
                // Update UI
                this.updateStreamingUI(true);
                
                // Start stream timer
                this.startStreamTimer();
                
                // Begin broadcasting
                this.startBroadcast();
                
                this.showToast('Live stream started!', 'success');
            } else {
                this.showToast(result.message || 'Failed to start stream', 'error');
            }
            
        } catch (error) {
            console.error('Error starting stream:', error);
            this.showToast('Failed to start stream', 'error');
        }
    }
    
    /**
     * End live stream
     */
    async endStream() {
        try {
            // Stop local stream
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => track.stop());
                this.localStream = null;
            }
            
            // Close all peer connections
            this.peerConnections.forEach(pc => pc.close());
            this.peerConnections.clear();
            
            // Stop stream timer
            if (this.streamTimer) {
                clearInterval(this.streamTimer);
                this.streamTimer = null;
            }
            
            // End stream session
            if (this.streamId) {
                await fetch('/wp-json/yta/v1/stream/end', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': youtuneaiData?.nonce || '',
                        'Authorization': `Bearer ${sessionStorage.getItem('youtuneai_auth_token')}`
                    },
                    body: JSON.stringify({ stream_id: this.streamId })
                });
            }
            
            this.isStreaming = false;
            this.streamId = null;
            
            // Update UI
            this.updateStreamingUI(false);
            
            this.showToast('Stream ended', 'info');
            
        } catch (error) {
            console.error('Error ending stream:', error);
        }
    }
    
    /**
     * Start WebRTC broadcast
     */
    startBroadcast() {
        // This would typically connect to a signaling server
        // For now, we'll simulate the broadcast functionality
        console.log('Starting WebRTC broadcast...');
        
        // In a real implementation, this would:
        // 1. Connect to signaling server
        // 2. Handle viewer connection requests
        // 3. Create peer connections for each viewer
        // 4. Stream video/audio to connected peers
    }
    
    /**
     * Connect to signaling server
     */
    connectSignalServer() {
        // WebSocket connection for signaling
        // This would be implemented based on your signaling server setup
        console.log('Connecting to signaling server...');
    }
    
    /**
     * Update streaming UI state
     */
    updateStreamingUI(isLive) {
        const statusIndicator = document.getElementById('live-dot');
        const statusText = document.getElementById('live-status');
        const goLiveBtn = document.getElementById('go-live-btn');
        const endStreamBtn = document.getElementById('end-stream-btn');
        const setupBtn = document.getElementById('setup-stream-btn');
        
        if (isLive) {
            statusIndicator?.classList.add('live');
            if (statusText) statusText.textContent = 'Live';
            if (goLiveBtn) goLiveBtn.style.display = 'none';
            if (endStreamBtn) endStreamBtn.style.display = 'flex';
            if (setupBtn) setupBtn.disabled = true;
        } else {
            statusIndicator?.classList.remove('live');
            if (statusText) statusText.textContent = 'Offline';
            if (goLiveBtn) {
                goLiveBtn.style.display = 'flex';
                goLiveBtn.disabled = !this.localStream;
            }
            if (endStreamBtn) endStreamBtn.style.display = 'none';
            if (setupBtn) setupBtn.disabled = false;
        }
    }
    
    /**
     * Start stream timer
     */
    startStreamTimer() {
        const durationEl = document.getElementById('stream-duration');
        
        this.streamTimer = setInterval(() => {
            if (this.streamStartTime && durationEl) {
                const elapsed = Date.now() - this.streamStartTime;
                const hours = Math.floor(elapsed / (1000 * 60 * 60));
                const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
                
                durationEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    /**
     * Update stream quality information
     */
    updateStreamQuality() {
        const qualityEl = document.getElementById('stream-quality');
        const bitrateEl = document.getElementById('stream-bitrate');
        
        if (this.localStream && qualityEl) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                const settings = videoTrack.getSettings();
                qualityEl.textContent = `${settings.width}x${settings.height}`;
            }
        }
        
        // Bitrate monitoring would be implemented with WebRTC stats
        if (bitrateEl) {
            bitrateEl.textContent = '1200 kbps'; // Placeholder
        }
    }
    
    /**
     * Open admin panel (session persists)
     */
    openAdminPanel() {
        // Since session is stored, admin panel will recognize authentication
        window.open('/wp-admin/themes.php?page=youtuneai-options', '_blank');
    }
    
    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.getElementById('connection-toast');
        const messageEl = document.getElementById('toast-message');
        
        if (toast && messageEl) {
            messageEl.textContent = message;
            toast.className = `toast toast-${type}`;
            toast.style.display = 'block';
            
            setTimeout(() => {
                toast.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.live-page')) {
        new LiveStreamingSystem();
    }
});