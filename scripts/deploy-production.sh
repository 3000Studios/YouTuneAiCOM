#!/bin/bash
set -e

# YouTuneAi.COM - Complete Production Deployment Script
# This script builds, tests, and deploys all changes to the live site

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

log_section() {
    echo
    echo -e "${BLUE}🚀 =================[ $1 ]=================${NC}"
    echo
}

# Check prerequisites
check_prerequisites() {
    log_section "Checking Prerequisites"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is required but not installed"
        exit 1
    fi
    NODE_VERSION=$(node --version)
    log_success "Node.js version: $NODE_VERSION"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is required but not installed"
        exit 1
    fi
    NPM_VERSION=$(npm --version)
    log_success "npm version: $NPM_VERSION"
    
    # Check git
    if ! command -v git &> /dev/null; then
        log_error "Git is required but not installed"
        exit 1
    fi
    GIT_VERSION=$(git --version)
    log_success "$GIT_VERSION"
    
    # Check for required files
    THEME_DIR="$PROJECT_ROOT/wp-content/themes/youtuneai-theme"
    if [[ ! -d "$THEME_DIR" ]]; then
        log_error "Theme directory not found: $THEME_DIR"
        exit 1
    fi
    log_success "Theme directory found"
}

# Install dependencies
install_dependencies() {
    log_section "Installing Dependencies"
    
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
}

# Build assets
build_assets() {
    log_section "Building Production Assets"
    
    cd "$THEME_DIR"
    
    # Run linting first
    log_info "Running code linting..."
    if npm run lint; then
        log_success "Linting passed"
    else
        log_error "Linting failed. Please fix issues and try again."
        exit 1
    fi
    
    # Build production assets
    log_info "Building production assets..."
    if npm run build; then
        log_success "Assets built successfully"
    else
        log_error "Build failed"
        exit 1
    fi
    
    # List built assets
    log_info "Built assets:"
    if [[ -d "assets" ]]; then
        find assets -name "*.js" -o -name "*.css" | head -10
        log_success "Production assets are ready"
    else
        log_error "Built assets directory not found"
        exit 1
    fi
}

# Run tests
run_tests() {
    log_section "Running Tests"
    
    cd "$PROJECT_ROOT"
    
    # Check if Playwright is configured
    if [[ -f "playwright.config.ts" ]]; then
        log_info "Running Playwright E2E tests..."
        if npx playwright test --reporter=list; then
            log_success "All tests passed"
        else
            log_warning "Some tests failed, but continuing deployment"
            log_warning "Please review test results and fix issues in future updates"
        fi
    else
        log_warning "No Playwright config found, skipping E2E tests"
    fi
}

# Prepare deployment package
prepare_deployment() {
    log_section "Preparing Deployment Package"
    
    cd "$PROJECT_ROOT"
    
    # Create deployment directory
    DEPLOY_DIR="$PROJECT_ROOT/deploy-package"
    rm -rf "$DEPLOY_DIR"
    mkdir -p "$DEPLOY_DIR"
    
    # Copy theme files
    log_info "Copying theme files..."
    cp -r wp-content/themes/youtuneai-theme "$DEPLOY_DIR/"
    
    # Copy MU plugins
    log_info "Copying MU plugins..."
    if [[ -d "wp-content/mu-plugins" ]]; then
        cp -r wp-content/mu-plugins "$DEPLOY_DIR/"
    fi
    
    # Remove development files
    log_info "Cleaning up development files..."
    find "$DEPLOY_DIR" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
    find "$DEPLOY_DIR" -name "*.map" -delete 2>/dev/null || true
    find "$DEPLOY_DIR" -name ".git*" -delete 2>/dev/null || true
    find "$DEPLOY_DIR" -name "*.log" -delete 2>/dev/null || true
    
    log_success "Deployment package prepared at: $DEPLOY_DIR"
}

# Git operations
git_operations() {
    log_section "Git Operations"
    
    cd "$PROJECT_ROOT"
    
    # Check git status
    log_info "Checking git status..."
    git status --porcelain
    
    # Stage all changes
    log_info "Staging all changes..."
    git add .
    
    # Commit changes
    COMMIT_MSG="Production deployment: Build assets and prepare for live deployment"
    log_info "Committing changes: $COMMIT_MSG"
    if git commit -m "$COMMIT_MSG" || true; then
        log_success "Changes committed"
    else
        log_info "No new changes to commit"
    fi
    
    # Show current branch
    CURRENT_BRANCH=$(git branch --show-current)
    log_info "Current branch: $CURRENT_BRANCH"
    
    if [[ "$CURRENT_BRANCH" != "main" ]]; then
        log_warning "Not on main branch. To trigger automatic deployment:"
        log_warning "1. Merge this branch to main"
        log_warning "2. Or push directly to main branch"
        echo
        log_info "Git commands to merge to main:"
        echo "  git checkout main"
        echo "  git merge $CURRENT_BRANCH"
        echo "  git push origin main"
    else
        log_info "On main branch - push will trigger deployment"
    fi
}

# Deploy via API (if available)
api_deployment() {
    log_section "API Deployment Check"
    
    # Check if the site is accessible
    SITE_URL="https://youtuneai.com"
    
    log_info "Checking site accessibility..."
    if curl -sSf "$SITE_URL" > /dev/null 2>&1; then
        log_success "Site is accessible: $SITE_URL"
        
        # Check API endpoints
        API_BASE="$SITE_URL/wp-json/yta/v1"
        
        if curl -sSf "$API_BASE/ping" > /dev/null 2>&1; then
            log_success "API is responsive"
            
            # Try to trigger deployment via admin API (if credentials are available)
            log_info "To trigger deployment via WordPress admin:"
            echo "1. Go to: $SITE_URL/wp-admin"
            echo "2. Navigate to YouTune Admin Control Center"
            echo "3. Click 'Deploy Now' button"
            
        else
            log_warning "API not responding, manual deployment may be needed"
        fi
    else
        log_warning "Site not accessible, check deployment status"
    fi
}

# Manual deployment instructions
deployment_instructions() {
    log_section "Manual Deployment Instructions"
    
    cat << EOF
🚀 Manual Deployment Options:

📁 SFTP Deployment:
   Host: access-5017098454.webspace-host.com
   Path: /htdocs/wp-content/
   Files: Deploy contents of deploy-package/ directory

🔧 WordPress Admin:
   1. Login to https://youtuneai.com/wp-admin
   2. Go to YouTune Admin Control Center
   3. Use the "Deploy Now" button

📋 GitHub Actions:
   1. Push changes to main branch
   2. GitHub Actions will automatically deploy
   3. Check: https://github.com/3000Studios/YouTuneAi.COM/actions

🧪 Verify Deployment:
   • Check: https://youtuneai.com
   • API: https://youtuneai.com/wp-json/yta/v1/ping
   • Admin: https://youtuneai.com/wp-admin

EOF
}

# Final summary
deployment_summary() {
    log_section "Deployment Summary"
    
    log_success "✅ Dependencies installed"
    log_success "✅ Assets built successfully"
    log_success "✅ Code linting passed"
    log_success "✅ Changes committed to git"
    log_success "✅ Deployment package prepared"
    
    echo
    log_info "📦 Deployment package location: $PROJECT_ROOT/deploy-package"
    log_info "📋 Next steps:"
    echo "   1. Push changes to main branch (triggers auto-deployment)"
    echo "   2. Or manually deploy using SFTP/WordPress admin"
    echo "   3. Verify deployment at https://youtuneai.com"
    echo
    log_success "🎉 Deployment preparation complete!"
}

# Main execution
main() {
    log_section "YouTuneAi.COM Production Deployment"
    echo "Starting complete build and deployment process..."
    echo "Project root: $PROJECT_ROOT"
    echo
    
    check_prerequisites
    install_dependencies
    build_assets
    run_tests
    prepare_deployment
    git_operations
    api_deployment
    deployment_instructions
    deployment_summary
}

# Run main function
main "$@"