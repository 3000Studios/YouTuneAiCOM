#!/usr/bin/env bash

# YouTuneAI Theme Development Bootstrap Script
# Sets up the entire development environment with one command

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}"
echo "🎵 YouTuneAI Theme Development Bootstrap"
echo "======================================${NC}"
echo

log_info "Project root: $PROJECT_ROOT"
echo

# Check system requirements
log_info "Checking system requirements..."

# Check Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js is required but not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version)
log_success "Node.js version: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    log_error "npm is required but not installed."
    exit 1
fi

NPM_VERSION=$(npm --version)
log_success "npm version: $NPM_VERSION"

# Check if we're in a WordPress directory structure
THEME_DIR="$PROJECT_ROOT/wp-content/themes/youtuneai-theme"
if [[ ! -d "$THEME_DIR" ]]; then
    log_error "WordPress theme directory not found at: $THEME_DIR"
    exit 1
fi

log_success "WordPress theme directory found"

# Install root dependencies
log_info "Installing root project dependencies..."
cd "$PROJECT_ROOT"
if [[ -f "package.json" ]]; then
    npm install
    log_success "Root dependencies installed"
else
    log_warning "No root package.json found"
fi

# Install theme dependencies
log_info "Installing theme dependencies..."
cd "$THEME_DIR"
if [[ -f "package.json" ]]; then
    npm ci
    log_success "Theme dependencies installed"
else
    log_error "Theme package.json not found"
    exit 1
fi

# Create environment configuration
log_info "Setting up environment configuration..."
ENV_FILE="$PROJECT_ROOT/.env"
if [[ ! -f "$ENV_FILE" ]]; then
    cat > "$ENV_FILE" << EOF
# YouTuneAI Development Environment
# Copy this to .env and update with your values

# WordPress Debug Mode
WP_DEBUG=true
WP_DEBUG_LOG=true
WP_DEBUG_DISPLAY=false

# Development flags
VITE_DEV=1
NODE_ENV=development

# API Keys (add your real keys for full functionality)
OPENAI_API_KEY=your_openai_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_here
PAYPAL_CLIENT_ID=your_paypal_client_id_here
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# IONOS Hosting (for deployment)
IONOS_HOST=access-5017098454.webspace-host.com
IONOS_USER=your_user_here
IONOS_PASS=your_pass_here

# Testing
TEST_BASE_URL=http://localhost:8080
WP_ADMIN_USER=admin
WP_ADMIN_PASS=password
EOF
    log_success "Environment configuration created at $ENV_FILE"
else
    log_info "Environment configuration already exists"
fi

# Setup Git hooks (if this is a git repository)
if [[ -d "$PROJECT_ROOT/.git" ]]; then
    log_info "Setting up Git hooks..."
    
    HOOKS_DIR="$PROJECT_ROOT/.git/hooks"
    
    # Pre-commit hook for linting
    cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/sh
echo "🔍 Running pre-commit checks..."

# Change to theme directory
cd wp-content/themes/youtuneai-theme

# Run linting
if npm run lint; then
    echo "✅ Linting passed"
else
    echo "❌ Linting failed. Please fix the issues and try again."
    exit 1
fi

echo "✅ Pre-commit checks passed"
EOF

    chmod +x "$HOOKS_DIR/pre-commit"
    log_success "Git hooks configured"
fi

# Build initial assets
log_info "Building initial assets..."
cd "$THEME_DIR"
npm run build
log_success "Initial assets built"

# Create placeholder 3D model if none exists
MODELS_DIR="$THEME_DIR/assets/models"
mkdir -p "$MODELS_DIR"

if [[ ! -f "$MODELS_DIR/avatar-default.glb" ]]; then
    log_info "Creating placeholder 3D model..."
    # Create a simple placeholder file
    echo "# Placeholder for avatar-default.glb" > "$MODELS_DIR/avatar-default.glb"
    echo "# Replace this with a real GLB/glTF 3D model file" >> "$MODELS_DIR/avatar-default.glb"
    log_warning "Placeholder 3D model created. Replace $MODELS_DIR/avatar-default.glb with a real GLB file."
fi

# Create uploads directory
UPLOADS_DIR="$PROJECT_ROOT/wp-content/uploads"
mkdir -p "$UPLOADS_DIR"
log_success "WordPress uploads directory created"

# Final instructions
echo
log_success "🎉 Bootstrap completed successfully!"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update the .env file with your actual API keys"
echo "2. Replace placeholder 3D models with real GLB files"
echo "3. Set up your local WordPress installation"
echo "4. Activate the YouTuneAI theme"
echo "5. Visit the YouTune Admin Control Center in wp-admin"
echo
echo -e "${YELLOW}Development commands:${NC}"
echo "• Start development server: cd wp-content/themes/youtuneai-theme && npm run dev"
echo "• Build for production: cd wp-content/themes/youtuneai-theme && npm run build"
echo "• Run tests: npx playwright test"
echo "• Lint code: cd wp-content/themes/youtuneai-theme && npm run lint"
echo
echo -e "${BLUE}Happy coding! 🚀${NC}"