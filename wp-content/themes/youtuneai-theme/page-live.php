<?php
/**
 * Template Name: Live Streaming
 * Template for live streaming page
 * 
 * @package YouTuneAI
 */

get_header(); ?>

<main id="main" class="site-main live-page">
    <!-- Password Modal -->
    <div class="password-modal" id="password-modal">
        <div class="password-modal-content">
            <div class="password-form">
                <h2><?php esc_html_e('Access Required', 'youtuneai'); ?></h2>
                <p><?php esc_html_e('Please enter the password to access live streaming.', 'youtuneai'); ?></p>
                
                <form id="password-form">
                    <div class="form-field">
                        <input type="password" id="access-password" placeholder="Enter password" required>
                        <button type="submit" class="password-submit-btn">
                            <?php esc_html_e('Enter', 'youtuneai'); ?>
                        </button>
                    </div>
                    <div class="error-message" id="password-error" style="display: none;"></div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- Live Streaming Interface -->
    <div class="live-container" id="live-container" style="display: none;">
        
        <!-- Live Status Bar -->
        <div class="live-status-bar">
            <div class="live-status-indicator">
                <span class="live-dot" id="live-dot"></span>
                <span class="live-text" id="live-status"><?php esc_html_e('Offline', 'youtuneai'); ?></span>
            </div>
            <div class="live-viewers">
                <span id="viewer-count">0</span> <?php esc_html_e('viewers', 'youtuneai'); ?>
            </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="live-main-content">
            
            <!-- Streaming Section -->
            <div class="streaming-section">
                
                <!-- Camera/Stream Preview -->
                <div class="stream-preview">
                    <video id="preview-video" autoplay muted playsinline></video>
                    <div class="preview-overlay" id="preview-overlay">
                        <div class="preview-message">
                            <h3><?php esc_html_e('Ready to Go Live?', 'youtuneai'); ?></h3>
                            <p><?php esc_html_e('Set up your camera and microphone to start streaming.', 'youtuneai'); ?></p>
                        </div>
                    </div>
                </div>
                
                <!-- Streaming Controls -->
                <div class="streaming-controls">
                    
                    <!-- Device Selection -->
                    <div class="device-controls">
                        <div class="control-group">
                            <label for="camera-select"><?php esc_html_e('Camera:', 'youtuneai'); ?></label>
                            <select id="camera-select" class="device-select">
                                <option value=""><?php esc_html_e('Select Camera', 'youtuneai'); ?></option>
                            </select>
                        </div>
                        
                        <div class="control-group">
                            <label for="microphone-select"><?php esc_html_e('Microphone:', 'youtuneai'); ?></label>
                            <select id="microphone-select" class="device-select">
                                <option value=""><?php esc_html_e('Select Microphone', 'youtuneai'); ?></option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Stream Settings -->
                    <div class="stream-settings">
                        <div class="setting-item">
                            <label for="stream-title"><?php esc_html_e('Stream Title:', 'youtuneai'); ?></label>
                            <input type="text" id="stream-title" placeholder="Enter stream title..." maxlength="100">
                        </div>
                        
                        <div class="setting-item">
                            <label for="stream-description"><?php esc_html_e('Description:', 'youtuneai'); ?></label>
                            <textarea id="stream-description" placeholder="Describe your stream..." maxlength="500" rows="3"></textarea>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button id="setup-stream-btn" class="action-btn secondary">
                            <span class="btn-icon">⚙️</span>
                            <?php esc_html_e('Setup Stream', 'youtuneai'); ?>
                        </button>
                        
                        <button id="go-live-btn" class="action-btn primary" disabled>
                            <span class="btn-icon">📺</span>
                            <span class="btn-text"><?php esc_html_e('Go Live', 'youtuneai'); ?></span>
                        </button>
                        
                        <button id="end-stream-btn" class="action-btn danger" style="display: none;">
                            <span class="btn-icon">⏹️</span>
                            <?php esc_html_e('End Stream', 'youtuneai'); ?>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Live Stream Player (for viewers) -->
            <div class="stream-player" id="stream-player" style="display: none;">
                <video id="live-video" autoplay playsinline controls></video>
                <div class="stream-info">
                    <h3 id="stream-title-display"></h3>
                    <p id="stream-description-display"></p>
                </div>
            </div>
            
        </div>
        
        <!-- Sidebar -->
        <div class="live-sidebar">
            
            <!-- Stream Statistics -->
            <div class="stats-panel">
                <h3><?php esc_html_e('Stream Statistics', 'youtuneai'); ?></h3>
                <div class="stat-item">
                    <span class="stat-label"><?php esc_html_e('Duration:', 'youtuneai'); ?></span>
                    <span class="stat-value" id="stream-duration">00:00:00</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label"><?php esc_html_e('Quality:', 'youtuneai'); ?></span>
                    <span class="stat-value" id="stream-quality">-</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label"><?php esc_html_e('Bitrate:', 'youtuneai'); ?></span>
                    <span class="stat-value" id="stream-bitrate">0 kbps</span>
                </div>
            </div>
            
            <!-- Recent Streams -->
            <div class="recent-streams">
                <h3><?php esc_html_e('Recent Streams', 'youtuneai'); ?></h3>
                <div class="stream-history" id="stream-history">
                    <p class="no-streams"><?php esc_html_e('No recent streams', 'youtuneai'); ?></p>
                </div>
            </div>
            
            <!-- Admin Controls -->
            <div class="admin-controls">
                <h3><?php esc_html_e('Admin Controls', 'youtuneai'); ?></h3>
                <button id="view-logs-btn" class="admin-btn">
                    <?php esc_html_e('View Logs', 'youtuneai'); ?>
                </button>
                <button id="admin-panel-btn" class="admin-btn">
                    <?php esc_html_e('Admin Panel', 'youtuneai'); ?>
                </button>
            </div>
        </div>
        
    </div>
    
    <!-- Connection Status Toast -->
    <div class="toast" id="connection-toast" style="display: none;">
        <span class="toast-message" id="toast-message"></span>
    </div>
    
</main>

<style>
.live-page {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Password Modal */
.password-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
}

.password-modal-content {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 40px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.password-form h2 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #6C5CE7;
}

.form-field {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

#access-password {
    flex: 1;
    padding: 15px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    font-size: 16px;
}

#access-password::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.password-submit-btn {
    padding: 15px 25px;
    background: linear-gradient(45deg, #6C5CE7, #5a48d4);
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.password-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(108, 92, 231, 0.4);
}

.error-message {
    color: #ff4757;
    margin-top: 10px;
    font-size: 14px;
}

/* Live Container */
.live-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Status Bar */
.live-status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.live-status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
}

.live-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ff4757;
    animation: pulse 2s infinite;
}

.live-dot.live {
    background: #2ed573;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Main Content */
.live-main-content {
    display: flex;
    flex: 1;
    gap: 20px;
    padding: 20px;
}

.streaming-section {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Stream Preview */
.stream-preview {
    position: relative;
    background: #000;
    border-radius: 15px;
    overflow: hidden;
    aspect-ratio: 16/9;
    min-height: 300px;
}

#preview-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
}

.preview-message {
    text-align: center;
}

.preview-message h3 {
    margin-bottom: 10px;
    font-size: 1.5em;
}

/* Streaming Controls */
.streaming-controls {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.device-controls {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.control-group {
    flex: 1;
}

.control-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #a0a0a0;
}

.device-select, #stream-title, #stream-description {
    width: 100%;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 14px;
}

.device-select option {
    background: #2c2c2c;
    color: white;
}

.stream-settings {
    margin-bottom: 20px;
}

.setting-item {
    margin-bottom: 15px;
}

.setting-item label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #a0a0a0;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 15px 25px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 140px;
    justify-content: center;
}

.action-btn.primary {
    background: linear-gradient(45deg, #6C5CE7, #5a48d4);
    color: white;
}

.action-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.action-btn.danger {
    background: linear-gradient(45deg, #ff4757, #e73c47);
    color: white;
}

.action-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Sidebar */
.live-sidebar {
    flex: 1;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.stats-panel, .recent-streams, .admin-controls {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-panel h3, .recent-streams h3, .admin-controls h3 {
    margin: 0 0 15px 0;
    color: #6C5CE7;
    font-size: 1.1em;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 5px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
    color: #a0a0a0;
}

.stat-value {
    font-weight: 600;
}

.admin-btn {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
}

.admin-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Toast Notifications */
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    border-left: 4px solid #6C5CE7;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .live-main-content {
        flex-direction: column;
    }
    
    .live-sidebar {
        max-width: none;
    }
    
    .device-controls {
        flex-direction: column;
        gap: 15px;
    }
    
    .action-buttons {
        flex-direction: column;
        align-items: stretch;
    }
    
    .action-btn {
        min-width: auto;
    }
    
    .password-modal-content {
        padding: 30px 20px;
    }
    
    .form-field {
        flex-direction: column;
        gap: 15px;
    }
}
</style>

<?php get_footer(); ?>