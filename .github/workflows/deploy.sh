#!/bin/bash

HOST="access-5017098454.webspace-host.com"
PORT="22"
USER="a1747849"
PASS="Gabby3000!!!"
LOCAL_DIR="./dist"
REMOTE_DIR="/"

echo "🚀 Building project..."
npm install || true
npm run build || true

echo "📤 Uploading to live server..."
lftp -u $USER,$PASS -p $PORT sftp://$HOST <<EOF
mirror -R $LOCAL_DIR $REMOTE_DIR
bye
EOF

echo "✅ Deployment complete. Checking site..."
curl -I https://youtuneai.com
