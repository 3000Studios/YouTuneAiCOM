/**
 * Enhanced Admin Dashboard with Live Progress Bar
 * BOSS MAN Supreme Experience
 */

class YouTuneAIAdminDashboard {
  constructor() {
    this.container = null;
    this.progressBar = null;
    this.taskCards = null;
    this.agentAvatars = null;
    this.audioSystem = null;
    this.bossMode = null;
    
    this.settings = {
      theme: 'boss-surge',
      soundEnabled: true,
      particlesEnabled: true,
      autoRefresh: 5000,
      bossModeEnabled: false
    };
    
    this.progressData = {
      overallProgress: 0,
      status: 'pending',
      tasks: [],
      agents: []
    };
    
    this.themes = {
      'boss-surge': {
        name: 'Boss Surge',
        primaryColor: '#00d4ff',
        secondaryColor: '#0099cc',
        accentColor: '#ff6b00',
        bgGradient: 'linear-gradient(135deg, #001122 0%, #003366 100%)',
        effects: 'lightning'
      },
      'hyper-glow': {
        name: 'Hyper Glow',
        primaryColor: '#00ff88',
        secondaryColor: '#00cc66',
        accentColor: '#ffff00',
        bgGradient: 'linear-gradient(135deg, #001100 0%, #003300 100%)',
        effects: 'pulse'
      },
      'turbo-circuit': {
        name: 'Turbo Circuit',
        primaryColor: '#ff4400',
        secondaryColor: '#cc3300',
        accentColor: '#ffaa00',
        bgGradient: 'linear-gradient(135deg, #220000 0%, #440000 100%)',
        effects: 'circuit'
      },
      'dark-mode': {
        name: 'Professional Dark',
        primaryColor: '#6366f1',
        secondaryColor: '#4f46e5',
        accentColor: '#10b981',
        bgGradient: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        effects: 'minimal'
      },
      'light-mode': {
        name: 'Clean Light',
        primaryColor: '#3b82f6',
        secondaryColor: '#2563eb',
        accentColor: '#059669',
        bgGradient: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        effects: 'minimal'
      }
    };
    
    this.init();
  }
  
  async init() {
    console.log('🚀 Initializing BOSS MAN Admin Dashboard...');
    
    try {
      await this.loadSettings();
      await this.createDashboard();
      await this.initializeComponents();
      await this.startRealTimeUpdates();
      
      console.log('✅ BOSS MAN Dashboard ready for supreme control!');
    } catch (error) {
      console.error('❌ Dashboard initialization failed:', error);
    }
  }
  
  async loadSettings() {
    try {
      const response = await fetch(`${youtuneaiAdmin.apiUrl}/admin/settings`, {
        headers: {
          'X-WP-Nonce': youtuneaiAdmin.nonce
        }
      });
      
      if (response.ok) {
        this.settings = await response.json();
        console.log('⚙️ Settings loaded:', this.settings);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load settings, using defaults:', error);
    }
  }
  
  async createDashboard() {
    // Find or create dashboard container
    this.container = document.getElementById('youtuneai-admin-dashboard');
    
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'youtuneai-admin-dashboard';
      
      // Insert at the top of admin content
      const adminContent = document.querySelector('#wpbody-content .wrap');
      if (adminContent) {
        adminContent.insertBefore(this.container, adminContent.firstChild);
      }
    }
    
    this.container.innerHTML = this.getDashboardHTML();
    this.applyTheme();
  }
  
  getDashboardHTML() {
    return `
      <div class="ytai-dashboard-wrapper">
        <!-- Theme Selector -->
        <div class="ytai-theme-selector">
          <select id="ytai-theme-select" class="ytai-select">
            ${Object.entries(this.themes).map(([key, theme]) => 
              `<option value="${key}" ${this.settings.theme === key ? 'selected' : ''}>${theme.name}</option>`
            ).join('')}
          </select>
          <div class="ytai-settings-toggle">
            <button id="ytai-settings-btn" class="ytai-btn ytai-btn-icon">
              ⚙️
            </button>
          </div>
        </div>
        
        <!-- Main Progress Bar -->
        <div class="ytai-progress-section">
          <div class="ytai-progress-header">
            <h2 class="ytai-title">BOSS MAN Command Center</h2>
            <div class="ytai-status-badge" id="ytai-status">
              <span class="ytai-status-dot"></span>
              <span class="ytai-status-text">Initializing...</span>
            </div>
          </div>
          
          <div class="ytai-progress-container" id="ytai-progress-container">
            <div class="ytai-progress-track">
              <div class="ytai-progress-bar" id="ytai-progress-bar">
                <div class="ytai-progress-glow"></div>
                <div class="ytai-progress-particles" id="ytai-particles"></div>
              </div>
              <div class="ytai-progress-text" id="ytai-progress-text">0%</div>
            </div>
          </div>
          
          <div class="ytai-ready-notification" id="ytai-ready-notification" style="display: none;">
            <div class="ytai-ready-content">
              <div class="ytai-ready-icon">🚀</div>
              <div class="ytai-ready-text">READY FOR LAUNCH!</div>
              <button class="ytai-go-button" id="ytai-go-button">GO!</button>
            </div>
          </div>
        </div>
        
        <!-- AI Agent Avatars -->
        <div class="ytai-agents-section" id="ytai-agents-section">
          <h3 class="ytai-section-title">AI Agents Status</h3>
          <div class="ytai-agents-container" id="ytai-agents-container">
            <!-- Agents will be populated by JavaScript -->
          </div>
        </div>
        
        <!-- Task Cards -->
        <div class="ytai-tasks-section" id="ytai-tasks-section">
          <h3 class="ytai-section-title">Active Tasks</h3>
          <div class="ytai-tasks-container" id="ytai-tasks-container">
            <!-- Tasks will be populated by JavaScript -->
          </div>
        </div>
        
        <!-- Settings Panel -->
        <div class="ytai-settings-panel" id="ytai-settings-panel" style="display: none;">
          <div class="ytai-settings-content">
            <h3>Dashboard Settings</h3>
            <div class="ytai-setting-group">
              <label>
                <input type="checkbox" id="ytai-sound-toggle" ${this.settings.soundEnabled ? 'checked' : ''}>
                Sound Effects
              </label>
            </div>
            <div class="ytai-setting-group">
              <label>
                <input type="checkbox" id="ytai-particles-toggle" ${this.settings.particlesEnabled ? 'checked' : ''}>
                Particle Effects
              </label>
            </div>
            <div class="ytai-setting-group">
              <label>
                Auto Refresh Rate: 
                <select id="ytai-refresh-rate">
                  <option value="2000" ${this.settings.autoRefresh === 2000 ? 'selected' : ''}>2s</option>
                  <option value="5000" ${this.settings.autoRefresh === 5000 ? 'selected' : ''}>5s</option>
                  <option value="10000" ${this.settings.autoRefresh === 10000 ? 'selected' : ''}>10s</option>
                </select>
              </label>
            </div>
            <button class="ytai-btn ytai-btn-primary" id="ytai-save-settings">Save</button>
          </div>
        </div>
      </div>
    `;
  }
  
  async initializeComponents() {
    // Initialize progress bar animations
    this.initProgressBar();
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Initialize particles system
    if (this.settings.particlesEnabled) {
      this.initParticles();
    }
    
    // Initialize audio system
    this.initAudioSystem();
    
    // Initialize Boss Mode easter egg
    this.initBossMode();
    
    // Load initial data
    await this.loadDashboardData();
  }
  
  initProgressBar() {
    this.progressBar = {
      element: document.getElementById('ytai-progress-bar'),
      textElement: document.getElementById('ytai-progress-text'),
      particlesElement: document.getElementById('ytai-particles')
    };
  }
  
  initEventListeners() {
    // Theme selector
    document.getElementById('ytai-theme-select').addEventListener('change', (e) => {
      this.changeTheme(e.target.value);
    });
    
    // Settings panel toggle
    document.getElementById('ytai-settings-btn').addEventListener('click', () => {
      this.toggleSettings();
    });
    
    // Settings save
    document.getElementById('ytai-save-settings').addEventListener('click', () => {
      this.saveSettings();
    });
    
    // Go button
    document.getElementById('ytai-go-button').addEventListener('click', () => {
      this.handleGoButton();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }
  
  initParticles() {
    const particlesContainer = document.getElementById('ytai-particles');
    
    // Create particle system based on theme
    const theme = this.themes[this.settings.theme];
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = `ytai-particle ytai-particle-${theme.effects}`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      particle.style.animationDuration = `${2 + Math.random() * 3}s`;
      particlesContainer.appendChild(particle);
    }
  }
  
  initAudioSystem() {
    this.audioSystem = {
      sounds: {},
      context: null,
      enabled: this.settings.soundEnabled
    };
    
    // Preload sound effects (with fallback for missing audio files)
    const sounds = ['power-up', 'progress-tick', 'completion', 'boss-mode'];
    sounds.forEach(sound => {
      try {
        const audio = new Audio(`${youtuneaiAdmin.themeUrl}/assets/sounds/${sound}.mp3`);
        audio.preload = 'auto';
        audio.volume = 0.3;
        this.audioSystem.sounds[sound] = audio;
      } catch (e) {
        console.warn(`Could not load sound: ${sound}`);
      }
    });
  }
  
  initBossMode() {
    this.bossMode = {
      sequence: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], // Konami code + BA
      userSequence: [],
      activated: false
    };
  }
  
  async loadDashboardData() {
    try {
      // Load progress data
      const progressResponse = await fetch(`${youtuneaiAdmin.apiUrl}/admin/progress`, {
        headers: { 'X-WP-Nonce': youtuneaiAdmin.nonce }
      });
      
      if (progressResponse.ok) {
        this.progressData = await progressResponse.json();
        this.updateProgressBar();
      }
      
      // Load agents data
      const agentsResponse = await fetch(`${youtuneaiAdmin.apiUrl}/admin/agents`, {
        headers: { 'X-WP-Nonce': youtuneaiAdmin.nonce }
      });
      
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        this.updateAgents(agentsData.agents);
      }
      
      // Load tasks data
      const tasksResponse = await fetch(`${youtuneaiAdmin.apiUrl}/admin/tasks`, {
        headers: { 'X-WP-Nonce': youtuneaiAdmin.nonce }
      });
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        this.updateTasks(tasksData.tasks);
      }
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }
  
  updateProgressBar() {
    const progress = this.progressData.overall_progress || 0;
    const progressBar = this.progressBar.element;
    const progressText = this.progressBar.textElement;
    const statusBadge = document.getElementById('ytai-status');
    
    // Animate progress bar
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
    
    // Update status
    const statusText = statusBadge.querySelector('.ytai-status-text');
    const statusDot = statusBadge.querySelector('.ytai-status-dot');
    
    statusBadge.className = `ytai-status-badge ytai-status-${this.progressData.status}`;
    statusText.textContent = this.getStatusText(this.progressData.status);
    
    // Show ready notification if complete
    if (progress >= 100 && this.progressData.status === 'complete') {
      this.showReadyNotification();
    }
    
    // Play progress sound
    if (this.audioSystem.enabled && progress > 0) {
      this.playSound('progress-tick');
    }
  }
  
  updateAgents(agents) {
    const container = document.getElementById('ytai-agents-container');
    
    container.innerHTML = agents.map(agent => `
      <div class="ytai-agent-card ytai-agent-${agent.status}" data-agent-id="${agent.id}">
        <div class="ytai-agent-avatar">
          <div class="ytai-agent-icon">🤖</div>
          <div class="ytai-agent-power-ring" style="--power: ${agent.power_level}%">
            <div class="ytai-power-bar"></div>
          </div>
        </div>
        <div class="ytai-agent-info">
          <h4>${agent.name}</h4>
          <p class="ytai-agent-task">${agent.current_task || 'Standby'}</p>
          <div class="ytai-agent-stats">
            <span>⚡ ${agent.power_level}%</span>
            <span>✅ ${agent.completed_tasks}</span>
            <span>📊 ${agent.efficiency}%</span>
          </div>
        </div>
        ${agent.status === 'active' ? '<div class="ytai-agent-pulse"></div>' : ''}
      </div>
    `).join('');
  }
  
  updateTasks(tasks) {
    const container = document.getElementById('ytai-tasks-container');
    
    container.innerHTML = tasks.map(task => `
      <div class="ytai-task-card ytai-task-${task.status}" data-task-id="${task.id}">
        <div class="ytai-task-header">
          <div class="ytai-task-info">
            <h4>${task.name}</h4>
            <p>${task.description}</p>
          </div>
          <div class="ytai-task-progress">
            <div class="ytai-task-progress-ring" style="--progress: ${task.progress}%">
              <span>${task.progress}%</span>
            </div>
          </div>
        </div>
        <div class="ytai-task-details">
          <div class="ytai-task-meta">
            <span class="ytai-task-agent">🤖 ${task.agent}</span>
            <span class="ytai-task-priority ytai-priority-${task.priority}">${task.priority}</span>
          </div>
          ${task.logs ? `
            <div class="ytai-task-logs">
              <button class="ytai-toggle-logs">View Logs</button>
              <div class="ytai-logs-content" style="display: none;">
                ${task.logs.map(log => `<div class="ytai-log-line">${log}</div>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
    
    // Add log toggle functionality
    container.querySelectorAll('.ytai-toggle-logs').forEach(button => {
      button.addEventListener('click', (e) => {
        const logsContent = e.target.nextElementSibling;
        const isVisible = logsContent.style.display !== 'none';
        logsContent.style.display = isVisible ? 'none' : 'block';
        e.target.textContent = isVisible ? 'View Logs' : 'Hide Logs';
      });
    });
  }
  
  showReadyNotification() {
    const notification = document.getElementById('ytai-ready-notification');
    notification.style.display = 'block';
    
    // Play completion sound
    if (this.audioSystem.enabled) {
      this.playSound('completion');
    }
    
    // Add dramatic entrance animation
    setTimeout(() => {
      notification.classList.add('ytai-ready-active');
    }, 100);
  }
  
  handleGoButton() {
    console.log('🚀 BOSS MAN initiated GO sequence!');
    
    // Trigger power-up effect
    this.triggerPowerUpEffect();
    
    // Play boss mode sound if enabled
    if (this.bossMode.activated) {
      this.playSound('boss-mode');
    } else {
      this.playSound('power-up');
    }
    
    // Hide notification
    document.getElementById('ytai-ready-notification').style.display = 'none';
  }
  
  triggerPowerUpEffect() {
    const container = this.container;
    container.classList.add('ytai-power-up');
    
    // Create burst effect
    this.createBurstEffect();
    
    setTimeout(() => {
      container.classList.remove('ytai-power-up');
    }, 2000);
  }
  
  createBurstEffect() {
    const burst = document.createElement('div');
    burst.className = 'ytai-burst-effect';
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'ytai-burst-particle';
      particle.style.setProperty('--angle', `${(360 / 50) * i}deg`);
      particle.style.setProperty('--delay', `${Math.random() * 0.5}s`);
      burst.appendChild(particle);
    }
    
    this.container.appendChild(burst);
    
    setTimeout(() => {
      burst.remove();
    }, 2000);
  }
  
  handleKeyboard(event) {
    // Boss Mode easter egg - Konami code detection
    if (this.bossMode.userSequence.length < this.bossMode.sequence.length) {
      this.bossMode.userSequence.push(event.keyCode);
      
      // Check if sequence matches so far
      const isCorrect = this.bossMode.userSequence.every((key, index) => 
        key === this.bossMode.sequence[index]
      );
      
      if (!isCorrect) {
        this.bossMode.userSequence = [];
      } else if (this.bossMode.userSequence.length === this.bossMode.sequence.length) {
        this.activateBossMode();
      }
    }
  }
  
  activateBossMode() {
    if (this.bossMode.activated) return;
    
    console.log('👑 BOSS MODE ACTIVATED!');
    this.bossMode.activated = true;
    
    // Apply boss mode theme
    document.body.classList.add('ytai-boss-mode');
    
    // Play boss mode sound
    this.playSound('boss-mode');
    
    // Show boss mode notification
    this.showBossModeNotification();
    
    // Enhanced particle effects
    this.upgradeParticleEffects();
    
    // Save boss mode state
    this.settings.bossModeEnabled = true;
    this.saveSettings();
  }
  
  showBossModeNotification() {
    const notification = document.createElement('div');
    notification.className = 'ytai-boss-mode-notification';
    notification.innerHTML = `
      <div class="ytai-boss-mode-content">
        <div class="ytai-boss-crown">👑</div>
        <div class="ytai-boss-text">BOSS MODE ACTIVATED!</div>
        <div class="ytai-boss-subtitle">Supreme Command Unlocked</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('ytai-boss-active');
    }, 100);
    
    setTimeout(() => {
      notification.remove();
    }, 4000);
  }
  
  upgradeParticleEffects() {
    const particlesContainer = document.getElementById('ytai-particles');
    
    // Add boss mode particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'ytai-particle ytai-particle-boss';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      particlesContainer.appendChild(particle);
    }
  }
  
  playSound(soundName) {
    if (!this.audioSystem.enabled || !this.audioSystem.sounds[soundName]) {
      return;
    }
    
    const sound = this.audioSystem.sounds[soundName];
    sound.currentTime = 0;
    sound.volume = this.bossMode.activated ? 0.7 : 0.3;
    
    sound.play().catch(error => {
      console.warn('Audio play failed:', error);
    });
  }
  
  changeTheme(themeName) {
    this.settings.theme = themeName;
    this.applyTheme();
    this.saveSettings();
  }
  
  applyTheme() {
    const theme = this.themes[this.settings.theme];
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--ytai-primary', theme.primaryColor);
    root.style.setProperty('--ytai-secondary', theme.secondaryColor);
    root.style.setProperty('--ytai-accent', theme.accentColor);
    root.style.setProperty('--ytai-bg-gradient', theme.bgGradient);
    
    // Update theme class
    this.container.className = this.container.className
      .replace(/ytai-theme-\w+/g, '')
      .concat(` ytai-theme-${this.settings.theme}`);
  }
  
  toggleSettings() {
    const panel = document.getElementById('ytai-settings-panel');
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
  }
  
  async saveSettings() {
    // Collect current settings from UI
    this.settings.soundEnabled = document.getElementById('ytai-sound-toggle').checked;
    this.settings.particlesEnabled = document.getElementById('ytai-particles-toggle').checked;
    this.settings.autoRefresh = parseInt(document.getElementById('ytai-refresh-rate').value);
    
    try {
      await fetch(`${youtuneaiAdmin.apiUrl}/admin/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': youtuneaiAdmin.nonce
        },
        body: JSON.stringify(this.settings)
      });
      
      console.log('⚙️ Settings saved successfully');
      
      // Update audio system
      this.audioSystem.enabled = this.settings.soundEnabled;
      
      // Update particles
      if (this.settings.particlesEnabled) {
        this.initParticles();
      }
      
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
  
  async startRealTimeUpdates() {
    // For now, use polling - SSE can be added later
    this.startPolling();
  }
  
  startPolling() {
    setInterval(async () => {
      await this.loadDashboardData();
    }, this.settings.autoRefresh);
  }
  
  getStatusText(status) {
    const statusMap = {
      'pending': 'Standby',
      'in_progress': 'Active',
      'complete': 'Ready',
      'error': 'Alert'
    };
    
    return statusMap[status] || 'Unknown';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on admin pages
  if (window.youtuneaiAdmin) {
    new YouTuneAIAdminDashboard();
  }
});

// Export for potential external use
window.YouTuneAIAdminDashboard = YouTuneAIAdminDashboard;