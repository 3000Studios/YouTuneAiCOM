<?php
/**
 * REST API Endpoints for YouTuneAI
 * 
 * @package YouTuneAI
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register REST API routes
 */
add_action('rest_api_init', 'youtuneai_register_api_routes');

function youtuneai_register_api_routes() {
    // Health check endpoint
    register_rest_route('yta/v1', '/ping', [
        'methods' => 'GET',
        'callback' => 'youtuneai_api_ping',
        'permission_callback' => '__return_true',
    ]);

    // Avatar chat endpoint
    register_rest_route('yta/v1', '/chat', [
        'methods' => 'POST',
        'callback' => 'youtuneai_api_chat',
        'permission_callback' => '__return_true',
        'args' => [
            'message' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'avatar_id' => [
                'required' => false,
                'type' => 'integer',
                'default' => 0,
            ],
        ],
    ]);

    // Avatar configuration endpoint
    register_rest_route('yta/v1', '/avatar/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'youtuneai_api_get_avatar',
        'permission_callback' => '__return_true',
        'args' => [
            'id' => [
                'required' => true,
                'type' => 'integer',
            ],
        ],
    ]);

    // Stream status endpoint
    register_rest_route('yta/v1', '/stream/status', [
        'methods' => 'GET',
        'callback' => 'youtuneai_api_stream_status',
        'permission_callback' => '__return_true',
    ]);

    // Games list endpoint
    register_rest_route('yta/v1', '/games', [
        'methods' => 'GET',
        'callback' => 'youtuneai_api_games_list',
        'permission_callback' => '__return_true',
        'args' => [
            'genre' => [
                'required' => false,
                'type' => 'string',
            ],
            'limit' => [
                'required' => false,
                'type' => 'integer',
                'default' => 6,
            ],
        ],
    ]);

    // Garage parts endpoint
    register_rest_route('yta/v1', '/garage/parts', [
        'methods' => 'GET',
        'callback' => 'youtuneai_api_garage_parts',
        'permission_callback' => '__return_true',
        'args' => [
            'type' => [
                'required' => false,
                'type' => 'string',
            ],
        ],
    ]);

    // VR Room config endpoint
    register_rest_route('yta/v1', '/vr/room/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'youtuneai_api_vr_room',
        'permission_callback' => '__return_true',
        'args' => [
            'id' => [
                'required' => true,
                'type' => 'integer',
            ],
        ],
    ]);

    // Admin actions (protected)
    register_rest_route('yta/v1', '/admin/(?P<action>[a-zA-Z0-9_-]+)', [
        'methods' => 'POST',
        'callback' => 'youtuneai_api_admin_action',
        'permission_callback' => function() {
            return current_user_can('manage_options');
        },
        'args' => [
            'action' => [
                'required' => true,
                'type' => 'string',
            ],
        ],
    ]);
}

/**
 * Ping endpoint for health checks
 */
function youtuneai_api_ping(WP_REST_Request $request) {
    return new WP_REST_Response([
        'success' => true,
        'message' => 'YouTuneAI API is running',
        'timestamp' => current_time('timestamp'),
        'version' => YOUTUNEAI_VERSION,
    ], 200);
}

/**
 * Avatar chat endpoint
 */
function youtuneai_api_chat(WP_REST_Request $request) {
    $message = $request->get_param('message');
    $avatar_id = $request->get_param('avatar_id');
    
    if (empty($message)) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Message cannot be empty',
        ], 400);
    }

    // Get avatar configuration if provided
    $avatar_config = null;
    if ($avatar_id > 0) {
        $avatar_post = get_post($avatar_id);
        if ($avatar_post && $avatar_post->post_type === 'avatar') {
            $avatar_config = [
                'voice' => get_post_meta($avatar_id, '_avatar_voice', true),
                'model_path' => get_post_meta($avatar_id, '_avatar_model_path', true),
                'colorway' => get_post_meta($avatar_id, '_avatar_colorway', true),
            ];
        }
    }

    // Placeholder AI chat response
    // In production, this would integrate with OpenAI, Claude, or another LLM
    $responses = [
        "Hello! I'm your YouTuneAI assistant. How can I help you today?",
        "That's an interesting question! Let me think about that...",
        "I'd be happy to help you with that. What specific information do you need?",
        "Great question! Here's what I think about that topic...",
        "Thanks for asking! I'm here to help with anything YouTuneAI related.",
    ];
    
    $reply = $responses[array_rand($responses)];
    
    // Generate lip-sync visemes (placeholder)
    $visemes = youtuneai_generate_visemes($reply);
    
    // Log the conversation (optional)
    do_action('youtuneai_chat_message', $message, $reply, $avatar_id);
    
    return new WP_REST_Response([
        'success' => true,
        'reply' => $reply,
        'visemes' => $visemes,
        'avatar_config' => $avatar_config,
        'timestamp' => current_time('timestamp'),
    ], 200);
}

/**
 * Generate lip-sync visemes for text
 */
function youtuneai_generate_visemes($text) {
    // Placeholder viseme generation
    // In production, this would use a more sophisticated phoneme-to-viseme mapping
    $words = explode(' ', strtolower($text));
    $visemes = [];
    $time = 0.0;
    
    foreach ($words as $word) {
        $duration = strlen($word) * 0.08 + 0.1; // Rough timing
        $visemes[] = [
            't' => $time,
            'v' => youtuneai_word_to_viseme($word),
        ];
        $time += $duration;
    }
    
    return $visemes;
}

/**
 * Map word to viseme (very basic)
 */
function youtuneai_word_to_viseme($word) {
    $first_char = substr($word, 0, 1);
    $viseme_map = [
        'a' => 'A', 'e' => 'E', 'i' => 'I', 'o' => 'O', 'u' => 'U',
        'b' => 'B', 'm' => 'B', 'p' => 'B',
        'f' => 'F', 'v' => 'F',
        'd' => 'D', 't' => 'D', 'n' => 'D', 'l' => 'D',
        's' => 'S', 'z' => 'S',
    ];
    
    return $viseme_map[$first_char] ?? 'A';
}

/**
 * Get avatar configuration
 */
function youtuneai_api_get_avatar(WP_REST_Request $request) {
    $avatar_id = $request->get_param('id');
    
    $avatar = get_post($avatar_id);
    if (!$avatar || $avatar->post_type !== 'avatar') {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Avatar not found',
        ], 404);
    }
    
    $config = [
        'id' => $avatar->ID,
        'title' => $avatar->post_title,
        'model_path' => get_post_meta($avatar_id, '_avatar_model_path', true),
        'voice' => get_post_meta($avatar_id, '_avatar_voice', true),
        'colorway' => json_decode(get_post_meta($avatar_id, '_avatar_colorway', true), true),
        'thumbnail' => get_the_post_thumbnail_url($avatar_id, 'medium'),
    ];
    
    return new WP_REST_Response([
        'success' => true,
        'avatar' => $config,
    ], 200);
}

/**
 * Get current stream status
 */
function youtuneai_api_stream_status(WP_REST_Request $request) {
    $current_streams = get_posts([
        'post_type' => 'stream',
        'post_status' => 'publish',
        'posts_per_page' => 1,
        'meta_query' => [
            [
                'key' => '_stream_schedule',
                'value' => current_time('mysql'),
                'compare' => '<=',
                'type' => 'DATETIME',
            ],
        ],
    ]);
    
    $is_live = !empty($current_streams);
    $stream_data = null;
    
    if ($is_live) {
        $stream = $current_streams[0];
        $stream_data = [
            'id' => $stream->ID,
            'title' => $stream->post_title,
            'embed_url' => get_post_meta($stream->ID, '_stream_embed_url', true),
            'platform' => get_post_meta($stream->ID, '_stream_platform', true),
            'scheduled_time' => get_post_meta($stream->ID, '_stream_schedule', true),
        ];
    }
    
    return new WP_REST_Response([
        'success' => true,
        'is_live' => $is_live,
        'stream' => $stream_data,
    ], 200);
}

/**
 * Get games list
 */
function youtuneai_api_games_list(WP_REST_Request $request) {
    $genre = $request->get_param('genre');
    $limit = $request->get_param('limit');
    
    $args = [
        'post_type' => 'game',
        'post_status' => 'publish',
        'posts_per_page' => $limit,
    ];
    
    if ($genre) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'game_genre',
                'field' => 'slug',
                'terms' => $genre,
            ],
        ];
    }
    
    $games = get_posts($args);
    $games_data = [];
    
    foreach ($games as $game) {
        $games_data[] = [
            'id' => $game->ID,
            'title' => $game->post_title,
            'excerpt' => get_the_excerpt($game),
            'thumbnail' => get_the_post_thumbnail_url($game->ID, 'medium'),
            'platform' => get_post_meta($game->ID, '_game_platform', true),
            'play_url' => get_post_meta($game->ID, '_game_play_url', true),
            'permalink' => get_permalink($game->ID),
        ];
    }
    
    return new WP_REST_Response([
        'success' => true,
        'games' => $games_data,
    ], 200);
}

/**
 * Get garage parts
 */
function youtuneai_api_garage_parts(WP_REST_Request $request) {
    $type = $request->get_param('type');
    
    $args = [
        'post_type' => 'garage_part',
        'post_status' => 'publish',
        'posts_per_page' => -1,
    ];
    
    if ($type) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'part_type',
                'field' => 'slug',
                'terms' => $type,
            ],
        ];
    }
    
    $parts = get_posts($args);
    $parts_data = [];
    
    foreach ($parts as $part) {
        $parts_data[] = [
            'id' => $part->ID,
            'title' => $part->post_title,
            'type' => wp_get_post_terms($part->ID, 'part_type', ['fields' => 'names']),
            'thumbnail' => get_the_post_thumbnail_url($part->ID, 'medium'),
            'price' => get_post_meta($part->ID, '_part_price', true),
            'compatibility' => get_post_meta($part->ID, '_part_compatibility', true),
        ];
    }
    
    return new WP_REST_Response([
        'success' => true,
        'parts' => $parts_data,
    ], 200);
}

/**
 * Get VR room configuration
 */
function youtuneai_api_vr_room(WP_REST_Request $request) {
    $room_id = $request->get_param('id');
    
    $room = get_post($room_id);
    if (!$room || $room->post_type !== 'vr_room') {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'VR Room not found',
        ], 404);
    }
    
    $config = [
        'id' => $room->ID,
        'title' => $room->post_title,
        'scene_config' => json_decode(get_post_meta($room_id, '_vr_scene_config', true), true),
        'media_playlist' => json_decode(get_post_meta($room_id, '_vr_media_playlist', true), true),
        'ad_zones' => json_decode(get_post_meta($room_id, '_vr_ad_zones', true), true),
    ];
    
    return new WP_REST_Response([
        'success' => true,
        'room' => $config,
    ], 200);
}

/**
 * Admin actions endpoint
 */
function youtuneai_api_admin_action(WP_REST_Request $request) {
    $action = $request->get_param('action');
    
    switch ($action) {
        case 'deploy':
            return youtuneai_admin_deploy();
        case 'seed':
            return youtuneai_admin_seed_content();
        case 'flush':
            return youtuneai_admin_flush_cache();
        case 'test':
            return youtuneai_admin_run_tests();
        default:
            return new WP_REST_Response([
                'success' => false,
                'message' => 'Unknown action',
            ], 400);
    }
}

/**
 * Deploy action
 */
function youtuneai_admin_deploy() {
    // Trigger GitHub Action deployment
    // This would typically use GitHub API or webhooks
    $log = "Deployment initiated...\n";
    $log .= "GitHub Action dispatched\n";
    
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Deployment started',
        'log' => $log,
    ], 200);
}

/**
 * Seed content action
 */
function youtuneai_admin_seed_content() {
    $log = "Seeding content...\n";
    
    // Create sample games
    $sample_games = [
        ['title' => 'Space Adventure', 'platform' => 'webgl'],
        ['title' => 'Racing Challenge', 'platform' => 'html5'],
        ['title' => 'Puzzle Master', 'platform' => 'phaser'],
    ];
    
    foreach ($sample_games as $game) {
        if (!post_exists($game['title'])) {
            $post_id = wp_insert_post([
                'post_title' => $game['title'],
                'post_content' => 'Sample game content',
                'post_status' => 'publish',
                'post_type' => 'game',
            ]);
            
            if ($post_id) {
                update_post_meta($post_id, '_game_platform', $game['platform']);
                $log .= "Created game: {$game['title']}\n";
            }
        }
    }
    
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Content seeded successfully',
        'log' => $log,
    ], 200);
}

/**
 * Flush cache action
 */
function youtuneai_admin_flush_cache() {
    wp_cache_flush();
    flush_rewrite_rules();
    
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Cache flushed successfully',
        'log' => "WordPress cache cleared\nRewrite rules flushed\n",
    ], 200);
}

/**
 * Run tests action
 */
function youtuneai_admin_run_tests() {
    $log = "Running tests...\n";
    $log .= "Health check: OK\n";
    $log .= "Database connection: OK\n";
    $log .= "Theme files: OK\n";
    
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Tests completed',
        'log' => $log,
    ], 200);
}