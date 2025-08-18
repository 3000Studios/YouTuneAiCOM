<?php
require_once "db.php";

$openai_key = getenv("OPENAI_API_KEY") ?: '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';
$latestCmd = $pdo->query("SELECT * FROM commands WHERE executed = 0 ORDER BY id DESC LIMIT 1")->fetch();

if (!$latestCmd) {
  echo "No pending command.";
  exit;
}

$prompt = "Fix or apply this request to your PHP/HTML/CSS files:\n\n" . $latestCmd['content'];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer $openai_key",
    "Content-Type: application/json"
  ],
  CURLOPT_POSTFIELDS => json_encode([
    "model" => "gpt-4o",
    "messages" => [
      ["role" => "system", "content" => "You're a web file editor."],
      ["role" => "user", "content" => $prompt]
    ],
    "temperature" => 0.2,
    "max_tokens" => 1000
  ])
]);

$response = curl_exec($ch);
$data = json_decode($response, true);

$resultText = $data['choices'][0]['message']['content'] ?? 'No response.';
$status = isset($data['choices'][0]) ? 'success' : 'fail';

// Log result
$stmt = $pdo->prepare("INSERT INTO ai_logs (command_id, result, status) VALUES (?, ?, ?)");
$stmt->execute([$latestCmd['id'], $resultText, $status]);

// Mark command as executed
$pdo->prepare("UPDATE commands SET executed = 1 WHERE id = ?")->execute([$latestCmd['id']]);

echo "✅ Executed: " . $latestCmd['content'];
?>
