<?php
/**
 * Template Name: VR Room
 * Template for VR/WebXR experiences
 * 
 * @package YouTuneAI
 */

get_header(); ?>

<main id="main" class="site-main vr-room-page">
    <div class="vr-room-container">
        
        <!-- VR Entry Interface -->
        <div class="vr-entry-screen" id="vr-entry">
            <div class="vr-hero">
                <h1 class="vr-title"><?php esc_html_e('Enter the VR Experience', 'youtuneai'); ?></h1>
                <p class="vr-description"><?php esc_html_e('Step into our immersive virtual environment with 3D interactions, media playback, and spatial audio.', 'youtuneai'); ?></p>
                
                <div class="vr-controls">
                    <button id="enter-vr-btn" class="vr-button primary" data-vr-enter>
                        <span class="vr-icon">🥽</span>
                        <?php esc_html_e('Enter VR Mode', 'youtuneai'); ?>
                    </button>
                    
                    <button id="enter-desktop-btn" class="vr-button secondary">
                        <span class="vr-icon">🖥️</span>
                        <?php esc_html_e('Desktop Mode', 'youtuneai'); ?>
                    </button>
                </div>
                
                <div class="vr-requirements">
                    <h3><?php esc_html_e('VR Requirements', 'youtuneai'); ?></h3>
                    <ul>
                        <li>Meta Quest 2/3, PICO 4, or WebXR compatible headset</li>
                        <li>Chrome, Edge, or Firefox browser with WebXR support</li>
                        <li>Stable internet connection for media streaming</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- VR Experience Container -->
        <div class="vr-experience-container" id="vr-container" style="display: none;">
            <canvas id="vr-canvas"></canvas>
            
            <!-- VR UI Overlay -->
            <div class="vr-ui-overlay">
                <div class="vr-controls-panel">
                    <button class="vr-control-btn" id="toggle-media">📹</button>
                    <button class="vr-control-btn" id="toggle-audio">🔊</button>
                    <button class="vr-control-btn" id="teleport-mode">📍</button>
                    <button class="vr-control-btn" id="exit-vr">❌</button>
                </div>
                
                <div class="vr-info-panel">
                    <div class="vr-fps-counter" id="fps-counter">FPS: 0</div>
                    <div class="vr-status" id="vr-status">Initializing...</div>
                </div>
            </div>
        </div>
        
        <!-- Media Selection Panel -->
        <div class="media-selection-panel" id="media-panel">
            <h3><?php esc_html_e('Choose Your Experience', 'youtuneai'); ?></h3>
            
            <div class="media-grid">
                <div class="media-item" data-media-type="video" data-media-url="/wp-content/uploads/vr-videos/space-journey.mp4">
                    <div class="media-thumbnail">
                        <img src="/wp-content/uploads/vr-videos/space-journey-thumb.jpg" alt="Space Journey">
                    </div>
                    <h4><?php esc_html_e('Space Journey', 'youtuneai'); ?></h4>
                    <p><?php esc_html_e('Explore the cosmos in 360°', 'youtuneai'); ?></p>
                </div>
                
                <div class="media-item" data-media-type="video" data-media-url="/wp-content/uploads/vr-videos/underwater.mp4">
                    <div class="media-thumbnail">
                        <img src="/wp-content/uploads/vr-videos/underwater-thumb.jpg" alt="Underwater Adventure">
                    </div>
                    <h4><?php esc_html_e('Underwater Adventure', 'youtuneai'); ?></h4>
                    <p><?php esc_html_e('Dive into the deep ocean', 'youtuneai'); ?></p>
                </div>
                
                <div class="media-item" data-media-type="interactive" data-media-url="/vr-experiences/showroom">
                    <div class="media-thumbnail">
                        <img src="/wp-content/uploads/vr-experiences/showroom-thumb.jpg" alt="3D Showroom">
                    </div>
                    <h4><?php esc_html_e('3D Showroom', 'youtuneai'); ?></h4>
                    <p><?php esc_html_e('Interactive product showcase', 'youtuneai'); ?></p>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
.vr-room-page {
    background: linear-gradient(135deg, #000428 0%, #004e92 100%);
    min-height: 100vh;
    color: white;
    overflow-x: hidden;
}

.vr-room-container {
    position: relative;
    min-height: 100vh;
}

.vr-entry-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 20px;
}

.vr-hero {
    max-width: 800px;
}

.vr-title {
    font-size: 3.5em;
    margin-bottom: 20px;
    background: linear-gradient(45deg, #6C5CE7, #00D1B2);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
    from { filter: brightness(1); }
    to { filter: brightness(1.2) drop-shadow(0 0 10px rgba(108, 92, 231, 0.5)); }
}

.vr-description {
    font-size: 1.3em;
    margin-bottom: 40px;
    opacity: 0.9;
    line-height: 1.6;
}

.vr-controls {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-bottom: 60px;
    flex-wrap: wrap;
}

.vr-button {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 30px;
    border: none;
    border-radius: 50px;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.vr-button.primary {
    background: linear-gradient(45deg, #6C5CE7, #5a48d4);
    color: white;
    box-shadow: 0 8px 30px rgba(108, 92, 231, 0.3);
}

.vr-button.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(108, 92, 231, 0.4);
}

.vr-button.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.vr-button.secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
}

.vr-requirements {
    text-align: left;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
    backdrop-filter: blur(10px);
}

.vr-requirements h3 {
    margin-top: 0;
    color: #00D1B2;
}

.vr-requirements ul {
    list-style: none;
    padding: 0;
}

.vr-requirements li {
    padding: 5px 0;
    position: relative;
    padding-left: 20px;
}

.vr-requirements li:before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #00D1B2;
    font-weight: bold;
}

.vr-experience-container {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: black;
}

#vr-canvas {
    width: 100%;
    height: 100%;
    display: block;
}

.vr-ui-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1001;
}

.vr-controls-panel {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    pointer-events: auto;
}

.vr-control-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 20px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.vr-control-btn:hover {
    background: rgba(108, 92, 231, 0.8);
}

.vr-info-panel {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    pointer-events: auto;
}

.media-selection-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    max-width: 80vw;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 1002;
    display: none;
}

.media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.media-item {
    text-align: center;
    cursor: pointer;
    padding: 15px;
    border-radius: 10px;
    transition: background 0.3s ease;
}

.media-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.media-thumbnail {
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 10px;
}

.media-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Responsive design */
@media (max-width: 768px) {
    .vr-title {
        font-size: 2.5em;
    }
    
    .vr-controls {
        flex-direction: column;
        align-items: center;
    }
    
    .vr-button {
        width: 100%;
        max-width: 300px;
    }
    
    .media-selection-panel {
        max-width: 95vw;
        padding: 20px;
    }
    
    .media-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const enterVRBtn = document.getElementById('enter-vr-btn');
    const enterDesktopBtn = document.getElementById('enter-desktop-btn');
    const vrContainer = document.getElementById('vr-container');
    const vrEntry = document.getElementById('vr-entry');
    
    // Check VR support
    if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            if (!supported) {
                enterVRBtn.textContent = 'VR Not Supported';
                enterVRBtn.disabled = true;
            }
        });
    } else {
        enterVRBtn.textContent = 'WebXR Not Available';
        enterVRBtn.disabled = true;
    }
    
    // VR mode entry
    enterVRBtn.addEventListener('click', () => {
        console.log('🥽 Entering VR mode...');
        enterVRExperience(true);
    });
    
    // Desktop mode entry
    enterDesktopBtn.addEventListener('click', () => {
        console.log('🖥️ Entering desktop mode...');
        enterVRExperience(false);
    });
    
    function enterVRExperience(vrMode) {
        vrEntry.style.display = 'none';
        vrContainer.style.display = 'block';
        
        // Initialize VR system
        if (window.youtuneai && window.youtuneai.vr) {
            window.youtuneai.vr.init(vrMode);
        } else {
            console.warn('VR system not loaded');
        }
    }
    
    // Exit VR
    document.getElementById('exit-vr')?.addEventListener('click', () => {
        vrContainer.style.display = 'none';
        vrEntry.style.display = 'flex';
    });
});
</script>

<?php get_footer(); ?>