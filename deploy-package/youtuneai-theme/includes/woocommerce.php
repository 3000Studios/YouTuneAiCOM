<?php
/**
 * WooCommerce Integration for YouTuneAI theme
 * 
 * @package YouTuneAI
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Check if WooCommerce is active
 */
if (!function_exists('is_woocommerce_active')) {
    function is_woocommerce_active() {
        return class_exists('WooCommerce');
    }
}

if (!is_woocommerce_active()) {
    return;
}

/**
 * Remove default WooCommerce styles
 */
add_filter('woocommerce_enqueue_styles', '__return_false');

/**
 * Custom WooCommerce support
 */
add_action('after_setup_theme', 'youtuneai_woocommerce_setup');

function youtuneai_woocommerce_setup() {
    add_theme_support('woocommerce', [
        'thumbnail_image_width' => 300,
        'single_image_width'    => 600,
        'product_grid'          => [
            'default_rows'    => 4,
            'min_rows'        => 2,
            'max_rows'        => 8,
            'default_columns' => 3,
            'min_columns'     => 2,
            'max_columns'     => 4,
        ],
    ]);
    
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
}

/**
 * Customize WooCommerce product loop
 */
add_filter('woocommerce_output_related_products_args', 'youtuneai_related_products_args');

function youtuneai_related_products_args($args) {
    $args['posts_per_page'] = 3;
    $args['columns'] = 3;
    return $args;
}

/**
 * Custom product types for YouTune Garage
 */
add_action('plugins_loaded', 'youtuneai_load_garage_product_types');

function youtuneai_load_garage_product_types() {
    if (!class_exists('WC_Product')) {
        return;
    }
    
    // Register garage kit product type
    add_filter('product_type_selector', 'youtuneai_add_garage_product_type');
    add_filter('woocommerce_product_data_tabs', 'youtuneai_garage_product_tab');
    add_action('woocommerce_product_data_panels', 'youtuneai_garage_product_data_fields');
    add_action('woocommerce_process_product_meta', 'youtuneai_save_garage_product_fields');
}

/**
 * Add garage kit product type
 */
function youtuneai_add_garage_product_type($types) {
    $types['garage_kit'] = __('Garage Kit', 'youtuneai');
    return $types;
}

/**
 * Add garage kit product tab
 */
function youtuneai_garage_product_tab($tabs) {
    $tabs['garage_kit'] = [
        'label'  => __('Garage Kit', 'youtuneai'),
        'target' => 'garage_kit_product_data',
        'class'  => ['show_if_garage_kit'],
    ];
    return $tabs;
}

/**
 * Garage kit product data fields
 */
function youtuneai_garage_product_data_fields() {
    global $post;
    ?>
    <div id="garage_kit_product_data" class="panel woocommerce_options_panel">
        <?php
        woocommerce_wp_textarea_input([
            'id' => '_garage_parts',
            'label' => __('Included Parts (JSON)', 'youtuneai'),
            'description' => __('JSON array of part IDs included in this kit', 'youtuneai'),
            'desc_tip' => true,
        ]);
        
        woocommerce_wp_text_input([
            'id' => '_garage_3d_model',
            'label' => __('3D Model Path', 'youtuneai'),
            'description' => __('Path to the assembled 3D model file', 'youtuneai'),
            'desc_tip' => true,
        ]);
        
        woocommerce_wp_checkbox([
            'id' => '_garage_customizable',
            'label' => __('Allow Customization', 'youtuneai'),
            'description' => __('Enable 3D configurator for this kit', 'youtuneai'),
        ]);
        ?>
    </div>
    <?php
}

/**
 * Save garage kit product fields
 */
function youtuneai_save_garage_product_fields($post_id) {
    $garage_parts = $_POST['_garage_parts'] ?? '';
    if ($garage_parts) {
        update_post_meta($post_id, '_garage_parts', wp_kses_post($garage_parts));
    }
    
    $garage_3d_model = $_POST['_garage_3d_model'] ?? '';
    if ($garage_3d_model) {
        update_post_meta($post_id, '_garage_3d_model', sanitize_text_field($garage_3d_model));
    }
    
    $garage_customizable = isset($_POST['_garage_customizable']) ? 'yes' : 'no';
    update_post_meta($post_id, '_garage_customizable', $garage_customizable);
}

/**
 * Add YouTune Garage configurator to single product page
 */
add_action('woocommerce_single_product_summary', 'youtuneai_add_garage_configurator', 25);

function youtuneai_add_garage_configurator() {
    global $product;
    
    if (!is_object($product)) {
        return;
    }
    
    $is_garage_kit = $product->get_meta('_garage_customizable') === 'yes';
    
    if ($is_garage_kit) {
        echo '<div id="garage-configurator" class="garage-configurator">';
        echo '<h3>' . __('3D Configurator', 'youtuneai') . '</h3>';
        echo '<div class="configurator-container">';
        echo '<canvas id="garage-canvas" width="500" height="400"></canvas>';
        echo '<div class="configurator-controls">';
        echo '<button class="btn-primary" onclick="openGarageConfigurator()">' . __('Customize in 3D', 'youtuneai') . '</button>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
    }
}

/**
 * Customize shop page
 */
add_action('woocommerce_before_shop_loop', 'youtuneai_shop_header', 5);

function youtuneai_shop_header() {
    if (is_shop()) {
        echo '<div class="shop-hero">';
        echo '<h1 class="shop-title">' . __('YouTune Store', 'youtuneai') . '</h1>';
        echo '<p class="shop-description">' . __('Discover premium digital products, games, and garage kits.', 'youtuneai') . '</p>';
        echo '</div>';
    }
}

/**
 * Custom cart fragments for AJAX
 */
add_filter('woocommerce_add_to_cart_fragments', 'youtuneai_cart_fragments');

function youtuneai_cart_fragments($fragments) {
    $fragments['span.cart-count'] = '<span class="cart-count">' . WC()->cart->get_cart_contents_count() . '</span>';
    return $fragments;
}

/**
 * Add cart icon to header
 */
function youtuneai_get_cart_icon() {
    if (!is_woocommerce_active()) {
        return '';
    }
    
    $cart_count = WC()->cart->get_cart_contents_count();
    $cart_url = wc_get_cart_url();
    
    ob_start();
    ?>
    <div class="header-cart">
        <a href="<?php echo esc_url($cart_url); ?>" class="cart-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <?php if ($cart_count > 0) : ?>
                <span class="cart-count"><?php echo $cart_count; ?></span>
            <?php endif; ?>
        </a>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Customize checkout fields
 */
add_filter('woocommerce_checkout_fields', 'youtuneai_checkout_fields');

function youtuneai_checkout_fields($fields) {
    // Add custom fields for digital products
    $fields['billing']['billing_discord'] = [
        'label'       => __('Discord Username', 'youtuneai'),
        'placeholder' => __('username#1234', 'youtuneai'),
        'required'    => false,
        'type'        => 'text',
        'priority'    => 120,
    ];
    
    return $fields;
}

/**
 * Add order status for digital delivery
 */
add_action('init', 'youtuneai_register_order_status');

function youtuneai_register_order_status() {
    register_post_status('wc-digital-delivered', [
        'label'                     => __('Digital Delivered', 'youtuneai'),
        'public'                    => true,
        'exclude_from_search'       => false,
        'show_in_admin_all_list'    => true,
        'show_in_admin_status_list' => true,
        'label_count'               => _n_noop(
            'Digital Delivered <span class="count">(%s)</span>',
            'Digital Delivered <span class="count">(%s)</span>',
            'youtuneai'
        ),
    ]);
}

/**
 * Add custom order status to WooCommerce
 */
add_filter('wc_order_statuses', 'youtuneai_add_order_statuses');

function youtuneai_add_order_statuses($order_statuses) {
    $new_order_statuses = [];
    
    foreach ($order_statuses as $key => $status) {
        $new_order_statuses[$key] = $status;
        
        if ('wc-processing' === $key) {
            $new_order_statuses['wc-digital-delivered'] = __('Digital Delivered', 'youtuneai');
        }
    }
    
    return $new_order_statuses;
}

/**
 * Custom email for digital delivery
 */
add_action('woocommerce_order_status_digital-delivered', 'youtuneai_send_digital_delivery_email', 10, 2);

function youtuneai_send_digital_delivery_email($order_id, $order) {
    // Custom email logic would go here
    // This is a placeholder for the digital delivery notification
    do_action('youtuneai_digital_order_delivered', $order_id, $order);
}

/**
 * Add product quick view
 */
add_action('woocommerce_after_shop_loop_item', 'youtuneai_add_quick_view_button', 15);

function youtuneai_add_quick_view_button() {
    global $product;
    
    echo '<button class="quick-view-btn" data-product-id="' . $product->get_id() . '">';
    echo __('Quick View', 'youtuneai');
    echo '</button>';
}

/**
 * Enqueue WooCommerce custom styles and scripts
 */
add_action('wp_enqueue_scripts', 'youtuneai_woocommerce_assets');

function youtuneai_woocommerce_assets() {
    if (is_woocommerce() || is_cart() || is_checkout()) {
        wp_enqueue_style(
            'youtuneai-woocommerce',
            YOUTUNEAI_URL . '/assets/css/woocommerce.css',
            [],
            YOUTUNEAI_VERSION
        );
        
        wp_enqueue_script(
            'youtuneai-woocommerce',
            YOUTUNEAI_URL . '/assets/js/woocommerce.js',
            ['jquery'],
            YOUTUNEAI_VERSION,
            true
        );
    }
}