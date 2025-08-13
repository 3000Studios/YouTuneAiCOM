#!/bin/bash
set -e

# 1. Download new king avatar 3D model
AVATAR_PATH="wp-content/themes/youtuneai-theme/assets/models/bossman-king.glb"
AVATAR_URL="https://your-cdn-or-repo-link.com/bossman-king.glb"  # <-- replace with real asset link
mkdir -p $(dirname "$AVATAR_PATH")
curl -L "$AVATAR_URL" -o "$AVATAR_PATH"

# 2. Update homepage avatar reference
sed -i 's/avatar-default\.glb/bossman-king.glb/g' wp-content/themes/youtuneai-theme/templates/homepage.php

# 3. Stage and commit the new model and code change
git add "$AVATAR_PATH" wp-content/themes/youtuneai-theme/templates/homepage.php
git commit -m "Add Boss Man King of the Bots avatar and integrate on homepage"

# 4. Build frontend assets for production
cd wp-content/themes/youtuneai-theme
npm install
npm run build
cd ../../../..

# 5. Run full E2E, accessibility, and performance tests
npx playwright test

# 6. Push all changes to main
git push origin main

# 7. Verify API health and avatar endpoint
curl https://youtuneai.com/wp-json/yta/v1/ping
curl https://youtuneai.com/wp-json/yta/v1/games

echo "BOSS MAN: King of the Bots avatar deployed, homepage updated, tests passed, site live! 👑🤖"
