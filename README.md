# YouTuneAi.COM

Production-grade WordPress theme for YouTuneAI.com – AI-powered digital platform with 3D avatar, VR experiences, games, automated content, live e-commerce, streaming, and seamless deployment to IONOS hosting.

## 🌟 Features

### Core Functionality
- **WordPress FSE Theme** - Modern block-based theme with custom design tokens
- **3D Avatar System** - Three.js-powered chatbot with lip-sync and customization
- **VR/WebXR Room** - Quest 3 optimized virtual environments
- **6 Playable Games** - WebGL/HTML5/Phaser games with leaderboards
- **WooCommerce Integration** - Complete e-commerce with custom product types
- **Admin Control Center** - Single-panel control for all site operations
- **Performance Optimized** - Meets Lighthouse 90+ scores with budget enforcement

### Custom Post Types
- `game` - Interactive browser games
- `stream` - Live streaming management
- `avatar` - 3D chatbot configurations  
- `vr_room` - Virtual reality experiences
- `garage_part` - 3D configurator components

### Integrations
- **Payment Processing** - Stripe & PayPal with automated payouts
- **Analytics & Ads** - Google Analytics 4, AdSense, affiliate tracking
- **3D/VR Technologies** - Three.js, WebXR, glTF/GLB support
- **Build System** - Vite with HMR, Tailwind CSS, ESLint
- **CI/CD Pipeline** - GitHub Actions → IONOS SFTP deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- WordPress 6.5+
- PHP 8.2+

### Installation

1. **Clone & Bootstrap**
   ```bash
   git clone https://github.com/3000Studios/YouTuneAi.COM
   cd YouTuneAi.COM
   ./scripts/dev/bootstrap.sh
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and settings
   ```

3. **Install WordPress & Activate Theme**
   - Install WordPress in your local environment
   - Copy theme to `wp-content/themes/youtuneai-theme/`
   - Copy MU plugin to `wp-content/mu-plugins/youtune-admin/`
   - Activate the YouTuneAI theme

4. **Access Admin Control Center**
   - Go to wp-admin → YouTune Admin
   - Click "Seed Content" to create demo data

## 🛠️ Development

### Commands
```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Run tests
npx playwright test

# Lint code
npm run lint
```

### Development Workflow
1. **Frontend Development** - Use `npm run dev` for hot reload
2. **3D Assets** - Place GLB/glTF files in `/assets/models/`
3. **Content Creation** - Use Admin Control Center for seeding
4. **Testing** - Run E2E tests with Playwright
5. **Deployment** - Push to main branch triggers auto-deploy

## 📁 Project Structure

```
wp-content/
├── themes/youtuneai-theme/
│   ├── assets/
│   │   ├── js/           # JavaScript modules
│   │   │   ├── avatar/   # 3D avatar system
│   │   │   ├── vr/       # VR/WebXR functionality  
│   │   │   ├── games/    # Game loading system
│   │   │   └── ui/       # User interface components
│   │   ├── css/          # Stylesheets
│   │   ├── models/       # 3D models (GLB/glTF)
│   │   └── img/          # Images and media
│   ├── includes/         # PHP functionality
│   │   ├── cpts.php      # Custom post types
│   │   ├── api.php       # REST API endpoints
│   │   ├── admin.php     # Admin interface
│   │   └── woocommerce.php # E-commerce integration
│   ├── templates/        # Page templates
│   └── parts/           # Template parts
└── mu-plugins/
    └── youtune-admin/   # Admin Control Center
```

## 🎮 Admin Control Center

Access via wp-admin → **YouTune Admin** for one-click:

- **Deploy Now** - Trigger GitHub Actions deployment
- **Seed Content** - Generate demo games, avatars, VR rooms
- **Flush Caches** - Clear all WordPress caches
- **Optimize Media** - Compress images, videos, 3D models
- **Stream Setup** - Configure YouTube/Twitch integration
- **Avatar Tuning** - Customize 3D avatar appearance
- **Ads Check** - Verify AdSense and analytics setup
- **Run Tests** - Execute Playwright + Lighthouse suite

## 🧪 Testing

### Test Suites
- **E2E Tests** - Playwright automation across browsers
- **Performance** - Lighthouse CI with budget enforcement  
- **Accessibility** - WCAG 2.1 AA compliance
- **API Tests** - REST endpoint validation
- **Admin Tests** - WordPress admin functionality

### Running Tests
```bash
# All tests
npx playwright test

# Specific test file
npx playwright test tests/playwright/homepage.spec.ts

# Visual comparison
npx playwright test --update-snapshots
```

## 🚢 Deployment

### Unified Deployment Structure
YouTuneAI uses a unified deployment approach that consolidates all files into a single deployment-ready directory:

```bash
# Build unified deployment package
npm run build

# This creates deployment-ready/wp-theme-youtuneai/ with:
# - WordPress theme files
# - Built assets (CSS, JS)
# - MU plugins
# - Configuration files
```

### IONOS Deploy Now Setup
1. **Repository Settings:**
   - Set public folder path to: `/deployment-ready/wp-theme-youtuneai`
   - Entry file: `index.php`
   - Build command: `npm run build`

2. **GitHub Actions Deployment:**
   - **Trigger** - Push to `main` branch  
   - **Process** - Build → Test → Deploy to IONOS
   - **Features** - Atomic deployment, rollback support, verification

### Manual Deployment
```bash
# Build production deployment package
npm run build

# Deploy via Admin Control Center
# Go to wp-admin → YouTune Admin → Deploy Now

# Or manually upload deployment-ready/wp-theme-youtuneai/ content
```

### Deployment Structure
```
deployment-ready/wp-theme-youtuneai/
├── index.php                    # Entry point
├── wp-content/
│   ├── themes/
│   │   └── youtuneai-theme/    # Main theme with built assets
│   └── mu-plugins/
│       └── youtune-admin/      # Admin control center
└── DEPLOYMENT_MANIFEST.md      # Deployment documentation
```

## 🎨 Customization

### 3D Avatar
1. Replace `/assets/models/avatar-default.glb` with your model
2. Update colorway settings in Admin → Avatar Tuning
3. Customize chat responses in `includes/api.php`

### VR Room
1. Create VR Room posts with scene configuration JSON
2. Add 360° videos to media playlist
3. Configure teleport points and interactive zones

### Games
1. Create Game posts with platform type
2. Upload WebGL builds or embed URLs
3. Set up genres and thumbnails

## 🔧 API Endpoints

### Public Endpoints
- `GET /wp-json/yta/v1/ping` - Health check
- `POST /wp-json/yta/v1/chat` - Avatar chat
- `GET /wp-json/yta/v1/games` - Games list
- `GET /wp-json/yta/v1/stream/status` - Live stream status

### Admin Endpoints (auth required)
- `POST /wp-json/yta/v1/admin/deploy` - Trigger deployment
- `POST /wp-json/yta/v1/admin/seed` - Seed content
- `POST /wp-json/yta/v1/admin/flush` - Flush caches

## 🔒 Security

- **Nonce Protection** - All AJAX requests verified
- **Capability Checks** - Admin functions restricted
- **Input Sanitization** - All user input cleaned
- **HTTPS Enforcement** - SSL required in production
- **WAF Integration** - Web Application Firewall ready

## ⚡ Performance

### Targets
- **Lighthouse Score** - 90+ on mobile and desktop
- **LCP** - ≤ 2.5s on 4G Fast
- **CLS** - ≤ 0.1
- **TBT** - ≤ 200ms

### Optimizations
- **Asset Pipeline** - Vite with code splitting
- **Image Optimization** - WebP conversion, lazy loading
- **3D Model Compression** - Draco and KTX2 formats
- **Caching Strategy** - Full-page + object cache
- **CDN Ready** - Optimized for content delivery

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

GPL v2 or later - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues** - [GitHub Issues](https://github.com/3000Studios/YouTuneAi.COM/issues)
- **Documentation** - [Wiki](https://github.com/3000Studios/YouTuneAi.COM/wiki)
- **Community** - [Discussions](https://github.com/3000Studios/YouTuneAi.COM/discussions)

---

**Built with ❤️ by [3000Studios](https://github.com/3000Studios)**
