#!/usr/bin/env bash
set -e

# CONFIG—update if needed
REPO="3000Studios/youtuneaicom"
BRANCH="main"
TOKEN="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"
COMMIT_MSG="🔥 Add AI Voice-Command Backend (command.php, ai_execute.php, db.php)"

# Define files
declare -A FILES
FILES["command.php"]="<?php
require_once \"db.php\";
\$input=\$_POST['command']??null;
\$source=\$_POST['source']??'web';
if(!\$input){http_response_code(400);echo \"Missing command.\";exit;}
\$stmt=\$pdo->prepare(\"INSERT INTO commands (content, source) VALUES (?, ?)\");
\$stmt->execute([\$input,\$source]);
echo \"✅ Command received and logged: \$input\";
?>"
FILES["ai_execute.php"]="<?php
require_once \"db.php\";
\$openai_key=getenv(\"OPENAI_API_KEY\")?:'';
\$latest=\$pdo->query(\"SELECT * FROM commands WHERE executed=0 ORDER BY id DESC LIMIT 1\")->fetch();
if(!\$latest){echo \"No pending command.\";exit;}
\$prompt=\"Apply: \".\$latest['content'];
\$ch=curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array(\$ch,[
  CURLOPT_RETURNTRANSFER=>true,
  CURLOPT_POST=>true,
  CURLOPT_HTTPHEADER=>[
    \"Authorization: Bearer \$openai_key\",
    \"Content-Type: application/json\"
  ],
  CURLOPT_POSTFIELDS=>json_encode([
    model=>'gpt-4o',
    messages=>[
      ['role'=>'system','content'=>'You’re a file editor.'],
      ['role'=>'user','content'=>\$prompt]
    ],
    temperature=>0.2,
    max_tokens=>1000
  ])
]);
\$res=curl_exec(\$ch);
\$data=json_decode(\$res,true);
\$result=\$data['choices'][0]['message']['content']??'No response';
\$status=isset(\$data['choices'][0])?'success':'fail';
\$pdo->prepare(\"INSERT INTO ai_logs (command_id,result,status) VALUES (?,?,?)\")->execute([\$latest['id'],\$result,\$status]);
\$pdo->prepare(\"UPDATE commands SET executed=1 WHERE id=?\")->execute([\$latest['id']]);
echo \"✅ Executed: \".\$latest['content'];
?>"
FILES["db.php"]="<?php
\$host='db5018379011.hosting-data.io';
\$db='dbs14664771';
\$user='dbu3573022';
\$pass='MNM3000God';
\$charset='utf8mb4';
\$dsn=\"mysql:host=\$host;dbname=\$db;charset=\$charset\";
\$opt=[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false];
try{\$pdo=new PDO(\$dsn,\$user,\$pass,\$opt);}catch(PDOException \$e){thrownew PDOException(\$e->getMessage(),(int)\$e->getCode());}
?>"

# Get latest SHA
echo "Fetching latest commit SHA..."
LAST_COMMIT_SHA=$(curl -s -H "Authorization: token $TOKEN" \
  "https://api.github.com/repos/$REPO/branches/$BRANCH" | jq -r .commit.sha)

# Prepare blobs
echo "Creating blobs..."
BLOB_LIST=()
for path in "${!FILES[@]}"; do
  content=${FILES[$path]}
  ENCODED=$(printf '%s' "$content" | base64)
  blob_sha=$(curl -s -X POST -H "Authorization: token $TOKEN" \
    -d "{\"content\":\"$content\",\"encoding\":\"utf-8\"}" \
    "https://api.github.com/repos/$REPO/git/blobs" | jq -r .sha)
  BLOB_LIST+=("{\"path\":\"$path\",\"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$blob_sha\"}")
done

# Create new tree
echo "Creating tree..."
TREE_JSON=$(printf '{"base_tree":"%s","tree":[%s]}' "$LAST_COMMIT_SHA" "$(IFS=,; echo "${BLOB_LIST[*]}")")
TREE_SHA=$(curl -s -X POST -H "Authorization: token $TOKEN" \
  -d "$TREE_JSON" \
  "https://api.github.com/repos/$REPO/git/trees" | jq -r .sha)

# Commit
echo "Committing changes..."
COMMIT=$(printf '{"message":"%s","parents":["%s"],"tree":"%s"}' "$COMMIT_MSG" "$LAST_COMMIT_SHA" "$TREE_SHA")
NEW_COMMIT_SHA=$(curl -s -X POST -H "Authorization: token $TOKEN" \
  -d "$COMMIT" \
  "https://api.github.com/repos/$REPO/git/commits" | jq -r .sha)

# Update main branch
echo "Updating branch..."
curl -s -X PATCH -H "Authorization: token $TOKEN" \
  -d "{\"sha\":\"$NEW_COMMIT_SHA\"}" \
  "https://api.github.com/repos/$REPO/git/refs/heads/$BRANCH"

echo "Files pushed and live. HEAD: $NEW_COMMIT_SHA"
