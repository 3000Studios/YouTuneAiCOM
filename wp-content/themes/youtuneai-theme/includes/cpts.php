<?php
/**
 * Custom Post Types and Taxonomies
 * 
 * @package YouTuneAI
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Custom Post Types
 */
add_action('init', 'youtuneai_register_post_types');

function youtuneai_register_post_types() {
    // Game CPT
    register_post_type('game', [
        'label' => __('Games', 'youtuneai'),
        'labels' => [
            'name' => __('Games', 'youtuneai'),
            'singular_name' => __('Game', 'youtuneai'),
            'add_new' => __('Add New Game', 'youtuneai'),
            'add_new_item' => __('Add New Game', 'youtuneai'),
            'edit_item' => __('Edit Game', 'youtuneai'),
            'new_item' => __('New Game', 'youtuneai'),
            'view_item' => __('View Game', 'youtuneai'),
            'search_items' => __('Search Games', 'youtuneai'),
            'not_found' => __('No games found', 'youtuneai'),
            'not_found_in_trash' => __('No games found in trash', 'youtuneai'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-games',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'revisions'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'games'],
        'menu_position' => 20,
    ]);

    // Stream CPT
    register_post_type('stream', [
        'label' => __('Streams', 'youtuneai'),
        'labels' => [
            'name' => __('Streams', 'youtuneai'),
            'singular_name' => __('Stream', 'youtuneai'),
            'add_new' => __('Add New Stream', 'youtuneai'),
            'add_new_item' => __('Add New Stream', 'youtuneai'),
            'edit_item' => __('Edit Stream', 'youtuneai'),
            'new_item' => __('New Stream', 'youtuneai'),
            'view_item' => __('View Stream', 'youtuneai'),
            'search_items' => __('Search Streams', 'youtuneai'),
            'not_found' => __('No streams found', 'youtuneai'),
            'not_found_in_trash' => __('No streams found in trash', 'youtuneai'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-video-alt3',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'streams'],
        'menu_position' => 21,
    ]);

    // Avatar CPT
    register_post_type('avatar', [
        'label' => __('Avatars', 'youtuneai'),
        'labels' => [
            'name' => __('Avatars', 'youtuneai'),
            'singular_name' => __('Avatar', 'youtuneai'),
            'add_new' => __('Add New Avatar', 'youtuneai'),
            'add_new_item' => __('Add New Avatar', 'youtuneai'),
            'edit_item' => __('Edit Avatar', 'youtuneai'),
            'new_item' => __('New Avatar', 'youtuneai'),
            'view_item' => __('View Avatar', 'youtuneai'),
            'search_items' => __('Search Avatars', 'youtuneai'),
            'not_found' => __('No avatars found', 'youtuneai'),
            'not_found_in_trash' => __('No avatars found in trash', 'youtuneai'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-buddicons-buddypress-logo',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'avatars'],
        'menu_position' => 22,
    ]);

    // VR Room CPT
    register_post_type('vr_room', [
        'label' => __('VR Rooms', 'youtuneai'),
        'labels' => [
            'name' => __('VR Rooms', 'youtuneai'),
            'singular_name' => __('VR Room', 'youtuneai'),
            'add_new' => __('Add New VR Room', 'youtuneai'),
            'add_new_item' => __('Add New VR Room', 'youtuneai'),
            'edit_item' => __('Edit VR Room', 'youtuneai'),
            'new_item' => __('New VR Room', 'youtuneai'),
            'view_item' => __('View VR Room', 'youtuneai'),
            'search_items' => __('Search VR Rooms', 'youtuneai'),
            'not_found' => __('No VR rooms found', 'youtuneai'),
            'not_found_in_trash' => __('No VR rooms found in trash', 'youtuneai'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-format-video',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'vr-rooms'],
        'menu_position' => 23,
    ]);

    // Garage Part CPT
    register_post_type('garage_part', [
        'label' => __('Garage Parts', 'youtuneai'),
        'labels' => [
            'name' => __('Garage Parts', 'youtuneai'),
            'singular_name' => __('Garage Part', 'youtuneai'),
            'add_new' => __('Add New Part', 'youtuneai'),
            'add_new_item' => __('Add New Garage Part', 'youtuneai'),
            'edit_item' => __('Edit Garage Part', 'youtuneai'),
            'new_item' => __('New Garage Part', 'youtuneai'),
            'view_item' => __('View Garage Part', 'youtuneai'),
            'search_items' => __('Search Garage Parts', 'youtuneai'),
            'not_found' => __('No garage parts found', 'youtuneai'),
            'not_found_in_trash' => __('No garage parts found in trash', 'youtuneai'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-admin-tools',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
        'has_archive' => true,
        'rewrite' => ['slug' => 'garage-parts'],
        'menu_position' => 24,
    ]);

    // Stream Log CPT (for logging stream events)
    register_post_type('stream_log', [
        'label' => __('Stream Logs', 'youtuneai'),
        'labels' => [
            'name' => __('Stream Logs', 'youtuneai'),
            'singular_name' => __('Stream Log', 'youtuneai'),
            'search_items' => __('Search Logs', 'youtuneai'),
            'not_found' => __('No logs found', 'youtuneai'),
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => 'edit.php?post_type=stream',
        'menu_icon' => 'dashicons-list-view',
        'supports' => ['title', 'editor', 'custom-fields'],
        'capabilities' => [
            'create_posts' => false,
        ],
        'map_meta_cap' => true,
        'menu_position' => 25,
    ]);
}

/**
 * Register Custom Taxonomies
 */
add_action('init', 'youtuneai_register_taxonomies');

function youtuneai_register_taxonomies() {
    // Game Genres
    register_taxonomy('game_genre', ['game'], [
        'label' => __('Game Genres', 'youtuneai'),
        'labels' => [
            'name' => __('Game Genres', 'youtuneai'),
            'singular_name' => __('Game Genre', 'youtuneai'),
            'search_items' => __('Search Genres', 'youtuneai'),
            'all_items' => __('All Genres', 'youtuneai'),
            'edit_item' => __('Edit Genre', 'youtuneai'),
            'update_item' => __('Update Genre', 'youtuneai'),
            'add_new_item' => __('Add New Genre', 'youtuneai'),
            'new_item_name' => __('New Genre Name', 'youtuneai'),
            'menu_name' => __('Game Genres', 'youtuneai'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'hierarchical' => true,
        'rewrite' => ['slug' => 'game-genre'],
    ]);

    // Part Types
    register_taxonomy('part_type', ['garage_part'], [
        'label' => __('Part Types', 'youtuneai'),
        'labels' => [
            'name' => __('Part Types', 'youtuneai'),
            'singular_name' => __('Part Type', 'youtuneai'),
            'search_items' => __('Search Part Types', 'youtuneai'),
            'all_items' => __('All Part Types', 'youtuneai'),
            'edit_item' => __('Edit Part Type', 'youtuneai'),
            'update_item' => __('Update Part Type', 'youtuneai'),
            'add_new_item' => __('Add New Part Type', 'youtuneai'),
            'new_item_name' => __('New Part Type Name', 'youtuneai'),
            'menu_name' => __('Part Types', 'youtuneai'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'hierarchical' => true,
        'rewrite' => ['slug' => 'part-type'],
    ]);
}

/**
 * Add custom meta boxes for CPTs
 */
add_action('add_meta_boxes', 'youtuneai_add_meta_boxes');

function youtuneai_add_meta_boxes() {
    // Game meta box
    add_meta_box(
        'game_details',
        __('Game Details', 'youtuneai'),
        'youtuneai_game_meta_box_callback',
        'game',
        'normal',
        'default'
    );

    // Stream meta box
    add_meta_box(
        'stream_details',
        __('Stream Details', 'youtuneai'),
        'youtuneai_stream_meta_box_callback',
        'stream',
        'normal',
        'default'
    );

    // Avatar meta box
    add_meta_box(
        'avatar_details',
        __('Avatar Details', 'youtuneai'),
        'youtuneai_avatar_meta_box_callback',
        'avatar',
        'normal',
        'default'
    );
}

/**
 * Game meta box callback
 */
function youtuneai_game_meta_box_callback($post) {
    wp_nonce_field('youtuneai_save_game_meta', 'youtuneai_game_meta_nonce');
    
    $platform = get_post_meta($post->ID, '_game_platform', true);
    $build_path = get_post_meta($post->ID, '_game_build_path', true);
    $play_url = get_post_meta($post->ID, '_game_play_url', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="game_platform"><?php _e('Platform', 'youtuneai'); ?></label></th>
            <td>
                <select id="game_platform" name="game_platform">
                    <option value="webgl" <?php selected($platform, 'webgl'); ?>>WebGL</option>
                    <option value="html5" <?php selected($platform, 'html5'); ?>>HTML5</option>
                    <option value="phaser" <?php selected($platform, 'phaser'); ?>>Phaser</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="game_build_path"><?php _e('Build Path', 'youtuneai'); ?></label></th>
            <td><input type="text" id="game_build_path" name="game_build_path" value="<?php echo esc_attr($build_path); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="game_play_url"><?php _e('Play URL', 'youtuneai'); ?></label></th>
            <td><input type="url" id="game_play_url" name="game_play_url" value="<?php echo esc_attr($play_url); ?>" class="regular-text" /></td>
        </tr>
    </table>
    <?php
}

/**
 * Stream meta box callback
 */
function youtuneai_stream_meta_box_callback($post) {
    wp_nonce_field('youtuneai_save_stream_meta', 'youtuneai_stream_meta_nonce');
    
    $platform = get_post_meta($post->ID, '_stream_platform', true);
    $stream_key = get_post_meta($post->ID, '_stream_key', true);
    $embed_url = get_post_meta($post->ID, '_stream_embed_url', true);
    $schedule = get_post_meta($post->ID, '_stream_schedule', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="stream_platform"><?php _e('Platform', 'youtuneai'); ?></label></th>
            <td>
                <select id="stream_platform" name="stream_platform">
                    <option value="youtube" <?php selected($platform, 'youtube'); ?>>YouTube</option>
                    <option value="twitch" <?php selected($platform, 'twitch'); ?>>Twitch</option>
                    <option value="custom" <?php selected($platform, 'custom'); ?>>Custom RTMP</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="stream_key"><?php _e('Stream Key', 'youtuneai'); ?></label></th>
            <td><input type="text" id="stream_key" name="stream_key" value="<?php echo esc_attr($stream_key); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="stream_embed_url"><?php _e('Embed URL', 'youtuneai'); ?></label></th>
            <td><input type="url" id="stream_embed_url" name="stream_embed_url" value="<?php echo esc_attr($embed_url); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="stream_schedule"><?php _e('Schedule', 'youtuneai'); ?></label></th>
            <td><input type="datetime-local" id="stream_schedule" name="stream_schedule" value="<?php echo esc_attr($schedule); ?>" /></td>
        </tr>
    </table>
    <?php
}

/**
 * Avatar meta box callback
 */
function youtuneai_avatar_meta_box_callback($post) {
    wp_nonce_field('youtuneai_save_avatar_meta', 'youtuneai_avatar_meta_nonce');
    
    $model_path = get_post_meta($post->ID, '_avatar_model_path', true);
    $voice = get_post_meta($post->ID, '_avatar_voice', true);
    $colorway = get_post_meta($post->ID, '_avatar_colorway', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="avatar_model_path"><?php _e('Model Path (GLB/glTF)', 'youtuneai'); ?></label></th>
            <td><input type="text" id="avatar_model_path" name="avatar_model_path" value="<?php echo esc_attr($model_path); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="avatar_voice"><?php _e('Voice Type', 'youtuneai'); ?></label></th>
            <td>
                <select id="avatar_voice" name="avatar_voice">
                    <option value="male" <?php selected($voice, 'male'); ?>>Male</option>
                    <option value="female" <?php selected($voice, 'female'); ?>>Female</option>
                    <option value="neutral" <?php selected($voice, 'neutral'); ?>>Neutral</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="avatar_colorway"><?php _e('Colorway (JSON)', 'youtuneai'); ?></label></th>
            <td><textarea id="avatar_colorway" name="avatar_colorway" rows="4" class="large-text"><?php echo esc_textarea($colorway); ?></textarea></td>
        </tr>
    </table>
    <?php
}

/**
 * Save meta data
 */
add_action('save_post', 'youtuneai_save_meta_data');

function youtuneai_save_meta_data($post_id) {
    // Game meta
    if (isset($_POST['youtuneai_game_meta_nonce']) && wp_verify_nonce($_POST['youtuneai_game_meta_nonce'], 'youtuneai_save_game_meta')) {
        if (isset($_POST['game_platform'])) {
            update_post_meta($post_id, '_game_platform', sanitize_text_field($_POST['game_platform']));
        }
        if (isset($_POST['game_build_path'])) {
            update_post_meta($post_id, '_game_build_path', sanitize_text_field($_POST['game_build_path']));
        }
        if (isset($_POST['game_play_url'])) {
            update_post_meta($post_id, '_game_play_url', esc_url_raw($_POST['game_play_url']));
        }
    }

    // Stream meta
    if (isset($_POST['youtuneai_stream_meta_nonce']) && wp_verify_nonce($_POST['youtuneai_stream_meta_nonce'], 'youtuneai_save_stream_meta')) {
        if (isset($_POST['stream_platform'])) {
            update_post_meta($post_id, '_stream_platform', sanitize_text_field($_POST['stream_platform']));
        }
        if (isset($_POST['stream_key'])) {
            update_post_meta($post_id, '_stream_key', sanitize_text_field($_POST['stream_key']));
        }
        if (isset($_POST['stream_embed_url'])) {
            update_post_meta($post_id, '_stream_embed_url', esc_url_raw($_POST['stream_embed_url']));
        }
        if (isset($_POST['stream_schedule'])) {
            update_post_meta($post_id, '_stream_schedule', sanitize_text_field($_POST['stream_schedule']));
        }
    }

    // Avatar meta
    if (isset($_POST['youtuneai_avatar_meta_nonce']) && wp_verify_nonce($_POST['youtuneai_avatar_meta_nonce'], 'youtuneai_save_avatar_meta')) {
        if (isset($_POST['avatar_model_path'])) {
            update_post_meta($post_id, '_avatar_model_path', sanitize_text_field($_POST['avatar_model_path']));
        }
        if (isset($_POST['avatar_voice'])) {
            update_post_meta($post_id, '_avatar_voice', sanitize_text_field($_POST['avatar_voice']));
        }
        if (isset($_POST['avatar_colorway'])) {
            update_post_meta($post_id, '_avatar_colorway', wp_kses_post($_POST['avatar_colorway']));
        }
    }
}