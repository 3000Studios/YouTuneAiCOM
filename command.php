<?php
require_once "db.php";

$input = $_POST['command'] ?? null;
$source = $_POST['source'] ?? 'web';

if (!$input) {
  http_response_code(400);
  echo "Missing command.";
  exit;
}

$stmt = $pdo->prepare("INSERT INTO commands (content, source) VALUES (?, ?)");
$stmt->execute([$input, $source]);

echo "✅ Command received and logged: $input";
?>
