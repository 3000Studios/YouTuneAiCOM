<?php
/**
 * Test live streaming authentication and API endpoints
 */

// Test authentication endpoint
function test_auth_endpoint() {
    echo "Testing authentication endpoint...\n";
    
    // Simulate POST to auth endpoint
    $data = json_encode(['password' => 'admin123']);
    
    // Basic verification - would normally use HTTP client
    if (function_exists('youtuneai_api_auth_verify')) {
        echo "✓ Authentication function exists\n";
    } else {
        echo "✗ Authentication function missing\n";
    }
}

// Test stream creation endpoint
function test_stream_creation() {
    echo "Testing stream creation endpoint...\n";
    
    if (function_exists('youtuneai_api_stream_create')) {
        echo "✓ Stream creation function exists\n";
    } else {
        echo "✗ Stream creation function missing\n";
    }
}

// Test page template
function test_live_page_template() {
    echo "Testing live page template...\n";
    
    $template_path = ABSPATH . 'wp-content/themes/youtuneai-theme/page-live.php';
    
    if (file_exists($template_path)) {
        echo "✓ Live page template exists\n";
    } else {
        echo "✗ Live page template missing\n";
    }
}

// Run tests
test_auth_endpoint();
test_stream_creation();
test_live_page_template();

echo "\nBasic functionality tests completed.\n";
?>
