#!/bin/bash
set -e

echo "🚀 Building unified deployment structure for YouTuneAi.COM..."

# Define paths
PROJECT_ROOT="/home/runner/work/YouTuneAi.COM/YouTuneAi.COM"
DEPLOYMENT_DIR="$PROJECT_ROOT/deployment-ready/wp-theme-youtuneai"
THEME_DIR="$PROJECT_ROOT/wp-content/themes/youtuneai-theme"
MUPLUGINS_DIR="$PROJECT_ROOT/wp-content/mu-plugins"

# Clean and recreate deployment directory
echo "📁 Preparing deployment directory..."
rm -rf "$DEPLOYMENT_DIR"
mkdir -p "$DEPLOYMENT_DIR"

# Create WordPress directory structure
echo "🏗️  Creating WordPress directory structure..."
mkdir -p "$DEPLOYMENT_DIR/wp-content/themes/youtuneai-theme"
mkdir -p "$DEPLOYMENT_DIR/wp-content/mu-plugins"

# Build theme assets
echo "🔨 Building theme assets..."
cd "$THEME_DIR"
npm run build

# Copy theme files to deployment directory
echo "📋 Copying theme files..."
cd "$PROJECT_ROOT"

# Copy all PHP theme files and templates
cp -r "$THEME_DIR"/*.php "$DEPLOYMENT_DIR/wp-content/themes/youtuneai-theme/" 2>/dev/null || true
cp -r "$THEME_DIR"/includes "$DEPLOYMENT_DIR/wp-content/themes/youtuneai-theme/" 2>/dev/null || true
cp -r "$THEME_DIR"/templates "$DEPLOYMENT_DIR/wp-content/themes/youtuneai-theme/" 2>/dev/null || true

# Copy theme configuration files
cp "$THEME_DIR/style.css" "$DEPLOYMENT_DIR/wp-content/themes/youtuneai-theme/"
cp "$THEME_DIR/theme.json" "$DEPLOYMENT_DIR/wp-content/themes/youtuneai-theme/"

# Copy built assets
echo "📦 Copying built assets..."
cp -r "$THEME_DIR/assets" "$DEPLOYMENT_DIR/wp-content/themes/youtuneai-theme/"

# Copy MU plugins
echo "🔌 Copying MU plugins..."
cp -r "$MUPLUGINS_DIR"/* "$DEPLOYMENT_DIR/wp-content/mu-plugins/"

# Create index.php entry point for deployment
echo "📄 Creating deployment entry point..."
cat > "$DEPLOYMENT_DIR/index.php" << 'EOF'
<?php
/**
 * YouTuneAI Deployment Entry Point
 * 
 * This file serves as the main entry point for the YouTuneAI deployment.
 * It loads the WordPress environment and activates the theme.
 */

// Define WordPress paths relative to deployment directory
define('WP_USE_THEMES', true);
define('ABSPATH', dirname(__FILE__) . '/');

// Load WordPress if available, otherwise show deployment info
if (file_exists(ABSPATH . '../wp-load.php')) {
    require_once ABSPATH . '../wp-load.php';
} elseif (file_exists(ABSPATH . 'wp-load.php')) {
    require_once ABSPATH . 'wp-load.php';
} else {
    // Deployment info page for standalone deployment
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>YouTuneAI - Deployment Ready</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 600px; margin: 0 auto; text-align: center; }
            .logo { color: #6366f1; font-size: 2.5rem; margin-bottom: 20px; }
            .status { background: #10b981; color: white; padding: 10px 20px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🎵 YouTuneAI.COM</div>
            <div class="status">✅ Deployment Package Ready</div>
            <h2>WordPress Theme Deployment</h2>
            <p>This deployment package contains:</p>
            <ul style="text-align: left;">
                <li>YouTuneAI WordPress Theme</li>
                <li>Built Assets (CSS, JS)</li>
                <li>MU Plugins</li>
                <li>3D Models & VR Components</li>
            </ul>
            <p><strong>Deploy this directory to your WordPress installation.</strong></p>
        </div>
    </body>
    </html>
    <?php
}
EOF

# Create deployment manifest
echo "📋 Creating deployment manifest..."
cat > "$DEPLOYMENT_DIR/DEPLOYMENT_MANIFEST.md" << EOF
# YouTuneAI Deployment Package

**Generated:** $(date)
**Version:** 1.0.0
**Deployment Target:** IONOS Deploy Now

## Package Contents

### WordPress Theme
- \`wp-content/themes/youtuneai-theme/\` - Main WordPress theme
- Built with Vite (CSS, JS assets included)
- 3D Avatar system with Three.js
- VR/WebXR capabilities
- WooCommerce integration

### MU Plugins
- \`wp-content/mu-plugins/youtune-admin/\` - Admin Control Center
- Deployment management
- Content seeding tools

### Assets
- Production-optimized JS bundles
- CSS with Tailwind
- 3D models and textures
- VR scene configurations

## Deployment Instructions

1. **IONOS Deploy Now Setup:**
   - Set public folder path to: \`/deployment-ready/wp-theme-youtuneai\`
   - Entry file: \`index.php\`

2. **WordPress Integration:**
   - Copy \`wp-content/\` to your WordPress installation
   - Activate the YouTuneAI theme
   - Configure the YouTune Admin Control Center

3. **Environment Variables:**
   - Set up API keys for OpenAI, Stripe, etc.
   - Configure SFTP credentials for future deployments

## File Structure
\`\`\`
deployment-ready/wp-theme-youtuneai/
├── index.php                    # Entry point
├── wp-content/
│   ├── themes/
│   │   └── youtuneai-theme/    # Main theme
│   └── mu-plugins/
│       └── youtune-admin/      # Admin tools
└── DEPLOYMENT_MANIFEST.md      # This file
\`\`\`

## Build Info
- Node.js assets built with Vite
- CSS processed with Tailwind + PostCSS
- JS minified with Terser
- Ready for production deployment
EOF

# Clean up development files from deployment
echo "🧹 Cleaning up development files..."
find "$DEPLOYMENT_DIR" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find "$DEPLOYMENT_DIR" -name "*.map" -delete 2>/dev/null || true
find "$DEPLOYMENT_DIR" -name ".git*" -delete 2>/dev/null || true
find "$DEPLOYMENT_DIR" -name "package.json" -delete 2>/dev/null || true
find "$DEPLOYMENT_DIR" -name "package-lock.json" -delete 2>/dev/null || true
find "$DEPLOYMENT_DIR" -name "vite.config.js" -delete 2>/dev/null || true
find "$DEPLOYMENT_DIR" -name ".eslintrc*" -delete 2>/dev/null || true

# Generate deployment summary
echo "📊 Deployment package created successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📂 Location: $DEPLOYMENT_DIR"
echo "📦 Size: $(du -sh "$DEPLOYMENT_DIR" | cut -f1)"
echo "🗂️  Files: $(find "$DEPLOYMENT_DIR" -type f | wc -l) files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Ready for IONOS Deploy Now deployment!"
echo "🌐 Set public folder path to: /deployment-ready/wp-theme-youtuneai"
echo ""