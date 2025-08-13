<?php
/**
 * YouTuneAI Theme Functions
 * 
 * @package YouTuneAI
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('YOUTUNEAI_VERSION')) {
    define('YOUTUNEAI_VERSION', '1.0.0');
}

if (!defined('YOUTUNEAI_PATH')) {
    define('YOUTUNEAI_PATH', get_stylesheet_directory());
}

if (!defined('YOUTUNEAI_URL')) {
    define('YOUTUNEAI_URL', get_stylesheet_directory_uri());
}

/**
 * Theme setup
 */
add_action('after_setup_theme', function() {
    // Add theme supports
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('html5', [
        'comment-list',
        'comment-form',
        'search-form',
        'gallery',
        'caption',
        'script',
        'style'
    ]);
    add_theme_support('responsive-embeds');
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    add_theme_support('editor-styles');
    add_theme_support('automatic-feed-links');

    // WooCommerce support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Custom logo
    add_theme_support('custom-logo', [
        'height'      => 60,
        'width'       => 200,
        'flex-width'  => true,
        'flex-height' => true,
    ]);

    // Navigation menus
    register_nav_menus([
        'primary' => __('Primary Menu', 'youtuneai'),
        'footer'  => __('Footer Menu', 'youtuneai'),
        'mobile'  => __('Mobile Menu', 'youtuneai'),
    ]);

    // Load text domain
    load_theme_textdomain('youtuneai', YOUTUNEAI_PATH . '/languages');
});

/**
 * Enqueue scripts and styles
 */
add_action('wp_enqueue_scripts', function() {
    $is_dev = defined('WP_DEBUG') && WP_DEBUG && getenv('VITE_DEV') === '1';
    
    if ($is_dev) {
        // Development mode - use Vite dev server
        wp_enqueue_script('vite-client', 'http://localhost:5173/@vite/client', [], null, true);
        wp_enqueue_script('youtuneai-app', 'http://localhost:5173/assets/js/app.js', ['vite-client'], null, true);
    } else {
        // Production mode - use built assets
        $manifest_path = YOUTUNEAI_PATH . '/assets/.vite/manifest.json';
        if (file_exists($manifest_path)) {
            $manifest = json_decode(file_get_contents($manifest_path), true);
            $entry = $manifest['assets/js/app.js'] ?? null;
            
            if ($entry) {
                wp_enqueue_script(
                    'youtuneai-app',
                    YOUTUNEAI_URL . '/assets/' . $entry['file'],
                    [],
                    YOUTUNEAI_VERSION,
                    true
                );
                
                // Enqueue CSS files from manifest
                if (!empty($entry['css'])) {
                    foreach ($entry['css'] as $css_file) {
                        wp_enqueue_style(
                            'youtuneai-style-' . md5($css_file),
                            YOUTUNEAI_URL . '/assets/' . $css_file,
                            [],
                            YOUTUNEAI_VERSION
                        );
                    }
                }
            }
        }
        
        // Fallback main style
        wp_enqueue_style(
            'youtuneai-style',
            YOUTUNEAI_URL . '/style.css',
            [],
            YOUTUNEAI_VERSION
        );
    }
    
    // Localize script with theme data
    wp_localize_script('youtuneai-app', 'youtuneaiData', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'restUrl' => rest_url('yta/v1/'),
        'nonce'   => wp_create_nonce('youtuneai_nonce'),
        'themeUrl' => YOUTUNEAI_URL,
        'isRTL'   => is_rtl(),
    ]);
});

/**
 * Admin styles
 */
add_action('admin_enqueue_scripts', function() {
    wp_enqueue_style(
        'youtuneai-admin',
        YOUTUNEAI_URL . '/assets/css/admin.css',
        [],
        YOUTUNEAI_VERSION
    );
});

/**
 * Include required files
 */
require_once YOUTUNEAI_PATH . '/includes/cpts.php';
require_once YOUTUNEAI_PATH . '/includes/api.php';
require_once YOUTUNEAI_PATH . '/includes/admin.php';
require_once YOUTUNEAI_PATH . '/includes/admin-api.php';
require_once YOUTUNEAI_PATH . '/includes/woocommerce.php';

/**
 * Theme activation hook
 */
add_action('after_switch_theme', function() {
    // Flush rewrite rules
    flush_rewrite_rules();
    
    // Create required pages
    youtuneai_create_required_pages();
});

/**
 * Create required pages on theme activation
 */
function youtuneai_create_required_pages() {
    $pages = [
        'live' => [
            'title' => 'Live Stream',
            'content' => '<!-- wp:paragraph --><p>Live streaming content will appear here.</p><!-- /wp:paragraph -->'
        ],
        'games' => [
            'title' => 'Games',
            'content' => '<!-- wp:paragraph --><p>Browse our collection of games.</p><!-- /wp:paragraph -->'
        ],
        'youtune-garage' => [
            'title' => 'YouTune Garage',
            'content' => '<!-- wp:paragraph --><p>3D configurator for custom builds.</p><!-- /wp:paragraph -->'
        ],
        'vr-room' => [
            'title' => 'VR Room',
            'content' => '<!-- wp:paragraph --><p>Enter the VR experience.</p><!-- /wp:paragraph -->'
        ]
    ];
    
    foreach ($pages as $slug => $page_data) {
        if (!get_page_by_path($slug)) {
            wp_insert_post([
                'post_title' => $page_data['title'],
                'post_content' => $page_data['content'],
                'post_status' => 'publish',
                'post_type' => 'page',
                'post_name' => $slug
            ]);
        }
    }
}

/**
 * Add body classes
 */
add_filter('body_class', function($classes) {
    if (is_page_template('page-vr-room.php')) {
        $classes[] = 'vr-enabled';
    }
    
    if (function_exists('is_shop') && is_shop()) {
        $classes[] = 'woocommerce-shop';
    }
    
    return $classes;
});

/**
 * Customize excerpt length
 */
add_filter('excerpt_length', function() {
    return 30;
});

/**
 * Customize excerpt more
 */
add_filter('excerpt_more', function() {
    return '...';
});