<?php
/**
 * Admin API for YouTuneAI Enhanced Dashboard
 * 
 * @package YouTuneAI
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register REST API endpoints for admin dashboard
 */
add_action('rest_api_init', 'youtuneai_register_admin_api');

function youtuneai_register_admin_api() {
    register_rest_route('youtuneai/v1', '/admin/progress', [
        'methods' => 'GET',
        'callback' => 'youtuneai_get_progress_data',
        'permission_callback' => function() {
            return current_user_can('manage_options');
        }
    ]);
    
    register_rest_route('youtuneai/v1', '/admin/tasks', [
        'methods' => 'GET',
        'callback' => 'youtuneai_get_tasks_data',
        'permission_callback' => function() {
            return current_user_can('manage_options');
        }
    ]);
    
    register_rest_route('youtuneai/v1', '/admin/agents', [
        'methods' => 'GET',
        'callback' => 'youtuneai_get_agents_data',
        'permission_callback' => function() {
            return current_user_can('manage_options');
        }
    ]);
    
    register_rest_route('youtuneai/v1', '/admin/settings', [
        'methods' => ['GET', 'POST'],
        'callback' => 'youtuneai_handle_dashboard_settings',
        'permission_callback' => function() {
            return current_user_can('manage_options');
        }
    ]);
}

/**
 * Get progress data for dashboard
 */
function youtuneai_get_progress_data($request) {
    $progress_data = get_transient('youtuneai_progress_data');
    
    if (!$progress_data) {
        // Generate mock progress data - replace with real system data
        $tasks = [
            ['name' => 'Building Assets', 'progress' => 85, 'status' => 'in_progress'],
            ['name' => 'Running Tests', 'progress' => 45, 'status' => 'in_progress'],
            ['name' => 'Deploy Prep', 'progress' => 0, 'status' => 'pending'],
            ['name' => 'Go Live', 'progress' => 0, 'status' => 'pending']
        ];
        
        $total_progress = array_sum(array_column($tasks, 'progress')) / count($tasks);
        
        $progress_data = [
            'overall_progress' => round($total_progress, 1),
            'status' => $total_progress >= 100 ? 'complete' : ($total_progress > 0 ? 'in_progress' : 'pending'),
            'tasks' => $tasks,
            'last_updated' => current_time('mysql'),
            'estimated_completion' => date('Y-m-d H:i:s', strtotime('+' . rand(5, 30) . ' minutes'))
        ];
        
        set_transient('youtuneai_progress_data', $progress_data, 30); // Cache for 30 seconds
    }
    
    return rest_ensure_response($progress_data);
}

/**
 * Get tasks data
 */
function youtuneai_get_tasks_data($request) {
    $tasks = [
        [
            'id' => 1,
            'name' => 'Build WordPress Theme',
            'description' => 'Compiling and optimizing theme assets',
            'status' => 'in_progress',
            'progress' => 75,
            'agent' => 'BuildBot',
            'started_at' => date('Y-m-d H:i:s', strtotime('-15 minutes')),
            'logs' => [
                '[15:30] Starting asset compilation...',
                '[15:32] Processing JavaScript files...',
                '[15:35] Optimizing CSS...',
                '[15:37] Building production bundle...'
            ],
            'priority' => 'high'
        ],
        [
            'id' => 2,
            'name' => 'Run Unit Tests',
            'description' => 'Executing automated test suite',
            'status' => 'pending',
            'progress' => 0,
            'agent' => 'TestBot',
            'priority' => 'medium',
            'depends_on' => [1]
        ],
        [
            'id' => 3,
            'name' => 'Deploy to Production',
            'description' => 'Push changes to live environment',
            'status' => 'pending',
            'progress' => 0,
            'agent' => 'DeployBot',
            'priority' => 'high',
            'depends_on' => [1, 2]
        ]
    ];
    
    return rest_ensure_response(['tasks' => $tasks]);
}

/**
 * Get AI agents data
 */
function youtuneai_get_agents_data($request) {
    $agents = [
        [
            'id' => 'buildbot',
            'name' => 'BuildBot',
            'status' => 'active',
            'current_task' => 'Building WordPress Theme',
            'avatar' => 'robot-builder.svg',
            'power_level' => 85,
            'completed_tasks' => 23,
            'efficiency' => 92,
            'last_active' => current_time('mysql')
        ],
        [
            'id' => 'testbot',
            'name' => 'TestBot',
            'status' => 'idle',
            'current_task' => null,
            'avatar' => 'robot-tester.svg',
            'power_level' => 60,
            'completed_tasks' => 15,
            'efficiency' => 88,
            'last_active' => date('Y-m-d H:i:s', strtotime('-5 minutes'))
        ],
        [
            'id' => 'deploybot',
            'name' => 'DeployBot',
            'status' => 'standby',
            'current_task' => null,
            'avatar' => 'robot-deploy.svg',
            'power_level' => 100,
            'completed_tasks' => 8,
            'efficiency' => 95,
            'last_active' => date('Y-m-d H:i:s', strtotime('-1 hour'))
        ]
    ];
    
    return rest_ensure_response(['agents' => $agents]);
}

/**
 * Handle dashboard settings
 */
function youtuneai_handle_dashboard_settings($request) {
    $method = $request->get_method();
    
    if ($method === 'GET') {
        $settings = get_option('youtuneai_dashboard_settings', [
            'theme' => 'boss-surge',
            'sound_enabled' => true,
            'particles_enabled' => true,
            'auto_refresh' => 5000, // milliseconds
            'boss_mode_enabled' => false,
            'notification_sound' => 'power-up.mp3'
        ]);
        
        return rest_ensure_response($settings);
    }
    
    if ($method === 'POST') {
        $new_settings = $request->get_json_params();
        
        // Validate settings
        $allowed_themes = ['boss-surge', 'hyper-glow', 'turbo-circuit', 'dark-mode', 'light-mode'];
        if (isset($new_settings['theme']) && !in_array($new_settings['theme'], $allowed_themes)) {
            return new WP_Error('invalid_theme', 'Invalid theme selected', ['status' => 400]);
        }
        
        $current_settings = get_option('youtuneai_dashboard_settings', []);
        $updated_settings = array_merge($current_settings, $new_settings);
        
        update_option('youtuneai_dashboard_settings', $updated_settings);
        
        return rest_ensure_response([
            'success' => true,
            'settings' => $updated_settings
        ]);
    }
}

/**
 * Simulate progress updates (for demo purposes)
 */
add_action('wp_ajax_youtuneai_simulate_progress', 'youtuneai_simulate_progress');

function youtuneai_simulate_progress() {
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }
    
    $progress = floatval($_POST['progress'] ?? 0);
    $status = sanitize_text_field($_POST['status'] ?? 'pending');
    $message = sanitize_text_field($_POST['message'] ?? 'Processing...');
    
    // Update simulated progress data
    $progress_data = [
        'overall_progress' => $progress,
        'status' => $status,
        'current_task' => $message,
        'last_updated' => current_time('mysql'),
        'tasks' => [
            ['name' => 'Initialize Build', 'progress' => min(100, max(0, $progress * 5 - 0)), 'status' => $progress > 5 ? 'complete' : ($progress > 0 ? 'in_progress' : 'pending')],
            ['name' => 'Compile Assets', 'progress' => min(100, max(0, $progress * 5 - 100)), 'status' => $progress > 40 ? 'complete' : ($progress > 20 ? 'in_progress' : 'pending')],
            ['name' => 'Run Tests', 'progress' => min(100, max(0, $progress * 5 - 200)), 'status' => $progress > 60 ? 'complete' : ($progress > 40 ? 'in_progress' : 'pending')],
            ['name' => 'Optimize Bundle', 'progress' => min(100, max(0, $progress * 5 - 300)), 'status' => $progress > 80 ? 'complete' : ($progress > 60 ? 'in_progress' : 'pending')],
            ['name' => 'Deploy to Production', 'progress' => min(100, max(0, $progress * 5 - 400)), 'status' => $progress >= 100 ? 'complete' : ($progress > 80 ? 'in_progress' : 'pending')]
        ]
    ];
    
    set_transient('youtuneai_progress_data', $progress_data, 300);
    
    wp_send_json_success([
        'progress' => $progress,
        'status' => $status,
        'message' => $message
    ]);
}

/**
 * Server-sent events endpoint for real-time updates
 */
add_action('wp_ajax_youtuneai_sse_updates', 'youtuneai_sse_updates');

function youtuneai_sse_updates() {
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }
    
    // Set SSE headers
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');
    header('Access-Control-Allow-Origin: *');
    
    // Send periodic updates
    $counter = 0;
    while ($counter < 10) { // Limit to prevent infinite loop
        $progress_data = youtuneai_get_progress_data(null)->get_data();
        
        echo "data: " . json_encode($progress_data) . "\n\n";
        
        if (ob_get_level()) {
            ob_flush();
        }
        flush();
        
        sleep(2); // Update every 2 seconds
        $counter++;
    }
}