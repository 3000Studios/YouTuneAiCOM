<?php
/**
 * Admin functionality for YouTuneAI theme
 * 
 * @package YouTuneAI
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add admin menu pages
 */
add_action('admin_menu', 'youtuneai_admin_menu');

function youtuneai_admin_menu() {
    add_theme_page(
        __('Theme Options', 'youtuneai'),
        __('YouTuneAI Options', 'youtuneai'),
        'manage_options',
        'youtuneai-options',
        'youtuneai_options_page'
    );
}

/**
 * Theme options page
 */
function youtuneai_options_page() {
    if (isset($_POST['submit'])) {
        youtuneai_save_options();
    }
    
    $options = get_option('youtuneai_options', []);
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <form method="post" action="">
            <?php wp_nonce_field('youtuneai_options', 'youtuneai_options_nonce'); ?>
            
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="default_avatar"><?php _e('Default Avatar', 'youtuneai'); ?></label>
                    </th>
                    <td>
                        <?php
                        $avatars = get_posts(['post_type' => 'avatar', 'posts_per_page' => -1]);
                        ?>
                        <select id="default_avatar" name="youtuneai_options[default_avatar]">
                            <option value=""><?php _e('Select Avatar', 'youtuneai'); ?></option>
                            <?php foreach ($avatars as $avatar) : ?>
                                <option value="<?php echo $avatar->ID; ?>" <?php selected($options['default_avatar'] ?? '', $avatar->ID); ?>>
                                    <?php echo esc_html($avatar->post_title); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="enable_chat"><?php _e('Enable Chat', 'youtuneai'); ?></label>
                    </th>
                    <td>
                        <input type="checkbox" id="enable_chat" name="youtuneai_options[enable_chat]" value="1" 
                               <?php checked($options['enable_chat'] ?? 0, 1); ?>>
                        <label for="enable_chat"><?php _e('Show avatar chat bubble on frontend', 'youtuneai'); ?></label>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="enable_vr"><?php _e('Enable VR', 'youtuneai'); ?></label>
                    </th>
                    <td>
                        <input type="checkbox" id="enable_vr" name="youtuneai_options[enable_vr]" value="1" 
                               <?php checked($options['enable_vr'] ?? 0, 1); ?>>
                        <label for="enable_vr"><?php _e('Enable WebXR/VR functionality', 'youtuneai'); ?></label>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="admin_password"><?php _e('Admin Password', 'youtuneai'); ?></label>
                    </th>
                    <td>
                        <input type="password" id="admin_password" name="youtuneai_options[admin_password]" 
                               value="<?php echo esc_attr($options['admin_password'] ?? 'admin123'); ?>" class="regular-text">
                        <p class="description"><?php _e('Password for live streaming and admin access', 'youtuneai'); ?></p>
                    </td>
                </tr>
                
                <tr>
                    <th scope="row">
                        <label for="api_keys"><?php _e('API Keys', 'youtuneai'); ?></label>
                    </th>
                    <td>
                        <textarea id="api_keys" name="youtuneai_options[api_keys]" rows="6" class="large-text" placeholder="OpenAI Key: sk-...
Stripe Key: sk_live_...
PayPal Client ID: ...
GA4 Measurement ID: G-..."><?php echo esc_textarea($options['api_keys'] ?? ''); ?></textarea>
                        <p class="description"><?php _e('Enter API keys (one per line)', 'youtuneai'); ?></p>
                    </td>
                </tr>
            </table>
            
            <?php submit_button(); ?>
        </form>
        
        <hr>
        
        <h2><?php _e('System Status', 'youtuneai'); ?></h2>
        <div class="youtuneai-system-status">
            <?php youtuneai_display_system_status(); ?>
        </div>
    </div>
    
    <style>
    .youtuneai-system-status {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
    }
    .status-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
    }
    .status-ok { color: #46b450; }
    .status-warning { color: #ffb900; }
    .status-error { color: #dc3232; }
    </style>
    <?php
}

/**
 * Save theme options
 */
function youtuneai_save_options() {
    if (!current_user_can('manage_options') || !wp_verify_nonce($_POST['youtuneai_options_nonce'], 'youtuneai_options')) {
        return;
    }
    
    $options = $_POST['youtuneai_options'] ?? [];
    
    // Sanitize options
    $sanitized_options = [
        'default_avatar' => (int) ($options['default_avatar'] ?? 0),
        'enable_chat' => (int) ($options['enable_chat'] ?? 0),
        'enable_vr' => (int) ($options['enable_vr'] ?? 0),
        'admin_password' => sanitize_text_field($options['admin_password'] ?? 'admin123'),
        'api_keys' => sanitize_textarea_field($options['api_keys'] ?? ''),
    ];
    
    update_option('youtuneai_options', $sanitized_options);
    
    add_settings_error('youtuneai_options', 'settings_updated', __('Settings saved.', 'youtuneai'), 'success');
    settings_errors('youtuneai_options');
}

/**
 * Display system status
 */
function youtuneai_display_system_status() {
    $status_items = [
        'WordPress Version' => get_bloginfo('version'),
        'PHP Version' => PHP_VERSION,
        'Theme Version' => YOUTUNEAI_VERSION,
        'Active Plugins' => count(get_option('active_plugins', [])),
        'Memory Limit' => ini_get('memory_limit'),
        'Upload Max Size' => ini_get('upload_max_filesize'),
    ];
    
    // Check for required features
    $features = [
        'WooCommerce' => class_exists('WooCommerce'),
        'REST API' => function_exists('rest_url'),
        'JSON Support' => function_exists('json_encode'),
        'cURL Support' => function_exists('curl_init'),
        'GD Library' => extension_loaded('gd'),
    ];
    
    foreach ($status_items as $label => $value) {
        echo "<div class='status-item'>";
        echo "<strong>{$label}:</strong>";
        echo "<span class='status-ok'>{$value}</span>";
        echo "</div>";
    }
    
    foreach ($features as $feature => $enabled) {
        $status_class = $enabled ? 'status-ok' : 'status-error';
        $status_text = $enabled ? __('Enabled', 'youtuneai') : __('Disabled', 'youtuneai');
        
        echo "<div class='status-item'>";
        echo "<strong>{$feature}:</strong>";
        echo "<span class='{$status_class}'>{$status_text}</span>";
        echo "</div>";
    }
}

/**
 * Add dashboard widgets
 */
add_action('wp_dashboard_setup', 'youtuneai_dashboard_widgets');

function youtuneai_dashboard_widgets() {
    wp_add_dashboard_widget(
        'youtuneai_dashboard_stats',
        __('YouTuneAI Stats', 'youtuneai'),
        'youtuneai_dashboard_stats_widget'
    );
}

/**
 * Dashboard stats widget
 */
function youtuneai_dashboard_stats_widget() {
    $stats = [
        'games' => wp_count_posts('game')->publish,
        'streams' => wp_count_posts('stream')->publish,
        'avatars' => wp_count_posts('avatar')->publish,
        'vr_rooms' => wp_count_posts('vr_room')->publish,
        'garage_parts' => wp_count_posts('garage_part')->publish,
    ];
    
    echo '<div class="youtuneai-dashboard-stats">';
    
    foreach ($stats as $type => $count) {
        $label = ucfirst(str_replace('_', ' ', $type));
        echo "<div class='stat-item'>";
        echo "<span class='stat-number'>{$count}</span>";
        echo "<span class='stat-label'>{$label}</span>";
        echo "</div>";
    }
    
    echo '</div>';
    
    // Recent activity
    $recent_games = get_posts([
        'post_type' => 'game',
        'posts_per_page' => 3,
        'post_status' => 'publish',
    ]);
    
    if (!empty($recent_games)) {
        echo '<h4>' . __('Recent Games', 'youtuneai') . '</h4>';
        echo '<ul>';
        foreach ($recent_games as $game) {
            echo '<li><a href="' . get_edit_post_link($game->ID) . '">' . esc_html($game->post_title) . '</a></li>';
        }
        echo '</ul>';
    }
    
    ?>
    <style>
    .youtuneai-dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }
    .stat-item {
        text-align: center;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 4px;
    }
    .stat-number {
        display: block;
        font-size: 24px;
        font-weight: bold;
        color: #0073aa;
    }
    .stat-label {
        display: block;
        font-size: 12px;
        color: #666;
        text-transform: uppercase;
    }
    </style>
    <?php
}

/**
 * Add custom admin CSS
 */
add_action('admin_head', 'youtuneai_admin_styles');

function youtuneai_admin_styles() {
    ?>
    <style>
    .youtuneai-admin-header {
        background: linear-gradient(135deg, #6C5CE7, #00D1B2);
        color: white;
        padding: 20px;
        margin: 0 -20px 20px -20px;
        border-radius: 0 0 8px 8px;
    }
    .youtuneai-admin-header h1 {
        color: white;
        margin: 0;
    }
    </style>
    <?php
}

/**
 * Add quick actions to admin bar
 */
add_action('admin_bar_menu', 'youtuneai_admin_bar_menu', 100);

function youtuneai_admin_bar_menu($wp_admin_bar) {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    $wp_admin_bar->add_node([
        'id'    => 'youtuneai',
        'title' => __('YouTuneAI', 'youtuneai'),
        'href'  => admin_url('themes.php?page=youtuneai-options'),
    ]);
    
    $wp_admin_bar->add_node([
        'id'     => 'youtuneai-flush-cache',
        'parent' => 'youtuneai',
        'title'  => __('Flush Cache', 'youtuneai'),
        'href'   => wp_nonce_url(admin_url('admin.php?action=youtuneai_flush_cache'), 'youtuneai_flush_cache'),
    ]);
    
    $wp_admin_bar->add_node([
        'id'     => 'youtuneai-view-games',
        'parent' => 'youtuneai',
        'title'  => __('View Games', 'youtuneai'),
        'href'   => admin_url('edit.php?post_type=game'),
    ]);
}

/**
 * Handle admin actions
 */
add_action('admin_action_youtuneai_flush_cache', 'youtuneai_handle_flush_cache');

function youtuneai_handle_flush_cache() {
    if (!current_user_can('manage_options') || !wp_verify_nonce($_GET['_wpnonce'], 'youtuneai_flush_cache')) {
        wp_die(__('You do not have sufficient permissions to access this page.'));
    }
    
    wp_cache_flush();
    flush_rewrite_rules();
    
    wp_redirect(add_query_arg(['message' => 'cache_flushed'], wp_get_referer()));
    exit;
}

/**
 * Show admin notices
 */
add_action('admin_notices', 'youtuneai_admin_notices');

function youtuneai_admin_notices() {
    if (isset($_GET['message']) && $_GET['message'] === 'cache_flushed') {
        echo '<div class="notice notice-success is-dismissible">';
        echo '<p>' . __('Cache has been flushed successfully.', 'youtuneai') . '</p>';
        echo '</div>';
    }
}