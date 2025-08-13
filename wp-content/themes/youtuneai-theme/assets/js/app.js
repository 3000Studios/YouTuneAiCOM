/**
 * YouTuneAI Theme Main JavaScript Entry Point
 * Handles 3D avatar, VR functionality, and site interactions
 */

import './avatar/AvatarSystem.js';
import './vr/VRRoom.js';
import './ui/Navigation.js';
import './ui/ChatBubble.js';
import './ui/LiveStreaming.js';
import './woocommerce/GarageConfigurator.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎵 YouTuneAI theme initialized');

  // Initialize components
  initializeNavigation();
  initializeAvatarChat();
  initializeVRCapabilities();
  initializeGames();

  // Performance monitoring
  if ('performance' in window && 'observer' in window.PerformanceObserver.prototype) {
    observePerformance();
  }
});

/**
 * Initialize responsive navigation
 */
function initializeNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryMenu = document.querySelector('#primary-menu');

  if (menuToggle && primaryMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      primaryMenu.classList.toggle('menu-open');
    });
  }
}

/**
 * Initialize 3D avatar chat system
 */
function initializeAvatarChat() {
  const options = youtuneaiData || {};

  if (options.enable_chat) {
    import('./avatar/ChatSystem.js').then(({ ChatSystem }) => {
      new ChatSystem({
        container: '#avatar-chat-bubble',
        apiUrl: `${options.restUrl}chat`,
        avatarId: options.default_avatar || 0,
      });
    });
  }
}

/**
 * Initialize VR capabilities
 */
function initializeVRCapabilities() {
  const options = youtuneaiData || {};

  if (options.enable_vr && 'xr' in navigator) {
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
      if (supported) {
        import('./vr/VRSystem.js').then(({ VRSystem }) => {
          new VRSystem();
        });
      }
    });
  }
}

/**
 * Initialize games functionality
 */
function initializeGames() {
  const gameContainers = document.querySelectorAll('.game-container');

  gameContainers.forEach(container => {
    const gameId = container.dataset.gameId;
    const platform = container.dataset.platform;

    if (platform && gameId) {
      import('./games/GameLoader.js').then(({ GameLoader }) => {
        new GameLoader(container, { gameId, platform });
      });
    }
  });
}

/**
 * Performance monitoring
 */
function observePerformance() {
  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('LCP:', entry.startTime);
    }
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    console.log('CLS:', clsValue);
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // First Input Delay
  const fidObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('FID:', entry.processingStart - entry.startTime);
    }
  });
  fidObserver.observe({ entryTypes: ['first-input'] });
}

// Global utilities
window.youtuneai = {
  // Utility functions available globally
  formatPrice: (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  },

  // Lazy load images
  lazyLoad: (selector = 'img[data-src]') => {
    const images = document.querySelectorAll(selector);
    const imageObserver = new IntersectionObserver((entries, _observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  },

  // Show notification
  notify: (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  },
};

// Initialize lazy loading
window.youtuneai.lazyLoad();
