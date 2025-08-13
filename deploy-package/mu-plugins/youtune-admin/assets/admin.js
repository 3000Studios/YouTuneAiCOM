/**
 * YouTune Admin Control Center JavaScript
 */
(function($) {
    'use strict';
    
    let isProcessing = false;
    
    $(document).ready(function() {
        // Initialize status check
        checkSystemStatus();
        
        // Bind action buttons
        $('.admin-action-btn').on('click', function(e) {
            e.preventDefault();
            
            if (isProcessing) {
                return;
            }
            
            const action = $(this).data('action');
            const button = $(this);
            
            executeAction(action, button);
        });
        
        // Auto-scroll log
        $('#activity-log').on('DOMSubtreeModified', function() {
            this.scrollTop = this.scrollHeight;
        });
    });
    
    /**
     * Execute admin action
     */
    function executeAction(action, button) {
        isProcessing = true;
        
        // Update UI
        button.prop('disabled', true).text('Processing...');
        $('#log-status').text('Running ' + action + '...');
        updateLog('🔄 Initiating ' + action + ' action...\n');
        
        $.ajax({
            url: youtuneAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'yta_' + action,
                nonce: youtuneAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    updateLog(response.data.log);
                    showNotification('✅ ' + ucfirst(action) + ' completed successfully!', 'success');
                } else {
                    updateLog('❌ Error: ' + response.data + '\n');
                    showNotification('❌ ' + ucfirst(action) + ' failed!', 'error');
                }
            },
            error: function(xhr, status, error) {
                updateLog('❌ AJAX Error: ' + error + '\n');
                showNotification('❌ Network error occurred!', 'error');
            },
            complete: function() {
                // Reset UI
                button.prop('disabled', false).text(button.text().replace('Processing...', getButtonText(action)));
                $('#log-status').text('Ready');
                isProcessing = false;
            }
        });
    }
    
    /**
     * Update activity log
     */
    function updateLog(message) {
        const log = $('#activity-log');
        const timestamp = new Date().toLocaleTimeString();
        log.append('[' + timestamp + '] ' + message + '\n');
        log.scrollTop(log[0].scrollHeight);
    }
    
    /**
     * Show notification
     */
    function showNotification(message, type) {
        const notification = $('<div class="youtune-notification youtune-' + type + '">' + message + '</div>');
        $('body').append(notification);
        
        notification.fadeIn(300);
        
        setTimeout(function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 5000);
    }
    
    /**
     * Check system status
     */
    function checkSystemStatus() {
        $('#system-status-text').text('System Status: Checking...');
        $('#system-status').removeClass('status-ok status-warning status-error').addClass('status-checking');
        
        $.ajax({
            url: youtuneAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'yta_status_check',
                nonce: youtuneAdmin.nonce
            },
            success: function(response) {
                if (response.success) {
                    $('#system-status').removeClass('status-checking').addClass('status-ok');
                    $('#system-status-text').text('System Status: All Systems Operational');
                } else {
                    $('#system-status').removeClass('status-checking').addClass('status-warning');
                    $('#system-status-text').text('System Status: Some Issues Detected');
                }
            },
            error: function() {
                $('#system-status').removeClass('status-checking').addClass('status-error');
                $('#system-status-text').text('System Status: Connection Error');
            }
        });
    }
    
    /**
     * Get button text based on action
     */
    function getButtonText(action) {
        const texts = {
            'deploy': 'Deploy Now',
            'seed': 'Seed Content',
            'flush': 'Flush Caches',
            'optimize': 'Optimize Media',
            'stream': 'Setup Stream',
            'avatar': 'Avatar Tuning',
            'ads': 'Check Ads/Analytics',
            'test': 'Run Full Test'
        };
        
        return texts[action] || 'Execute';
    }
    
    /**
     * Capitalize first letter
     */
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    /**
     * Clear log function (global)
     */
    window.clearLog = function() {
        $('#activity-log').empty();
        updateLog('📝 Activity log cleared\n');
    };
    
})(jQuery);