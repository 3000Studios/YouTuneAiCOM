/**
 * YouTuneAI Admin JavaScript Entry Point
 * Handles admin interface functionality
 */

// Import admin styles
import '../css/admin.css';

// Admin functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎵 YouTuneAI admin initialized');

  // Initialize admin components
  initializeAdminActions();
  initializeControlCenter();
});

/**
 * Initialize admin action buttons
 */
function initializeAdminActions() {
  const actionButtons = document.querySelectorAll('.admin-action-btn');

  actionButtons.forEach(button => {
    button.addEventListener('click', handleAdminAction);
  });
}

/**
 * Handle admin action clicks
 */
function handleAdminAction(event) {
  const button = event.currentTarget;
  const action = button.dataset.action;
  const log = document.getElementById('activity-log');
  const status = document.getElementById('log-status');

  if (!action) return;

  // Update status
  status.textContent = 'Processing...';
  button.disabled = true;

  // Clear previous log
  if (log) {
    log.textContent = '';
  }

  // Make API request
  fetch(`${youtuneaiAdmin.apiUrl}/admin/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': youtuneaiAdmin.nonce,
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        if (log && data.log) {
          log.textContent = data.log;
        }
        status.textContent = 'Completed';
      } else {
        status.textContent = 'Error';
        console.error('Action failed:', data.message);
      }
    })
    .catch(error => {
      console.error('Request failed:', error);
      status.textContent = 'Error';
    })
    .finally(() => {
      button.disabled = false;
      setTimeout(() => {
        status.textContent = 'Ready';
      }, 3000);
    });
}

/**
 * Initialize control center dashboard
 */
function initializeControlCenter() {
  // System status updates
  updateSystemStatus();

  // Auto-refresh system status every 30 seconds
  setInterval(updateSystemStatus, 30000);
}

/**
 * Update system status indicators
 */
function updateSystemStatus() {
  const statusText = document.getElementById('system-status-text');

  if (!statusText) return;

  fetch(`${youtuneaiAdmin.apiUrl}/ping`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        statusText.textContent = 'System Status: Online';
        statusText.className = 'status-online';
      } else {
        statusText.textContent = 'System Status: Warning';
        statusText.className = 'status-warning';
      }
    })
    .catch(() => {
      statusText.textContent = 'System Status: Offline';
      statusText.className = 'status-offline';
    });
}

/**
 * Clear activity log
 */
window.clearLog = function() {
  const log = document.getElementById('activity-log');
  const status = document.getElementById('log-status');

  if (log) {
    log.textContent = '';
  }

  if (status) {
    status.textContent = 'Ready';
  }
};
