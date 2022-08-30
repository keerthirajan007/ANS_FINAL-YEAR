<?php
    require_once './vendor/autoload.php';
    use ExpoSDK\Expo;
    use ExpoSDK\ExpoMessage;
    
$input = file_get_contents('php://input'); 
$r = json_decode($input);

$to = $r->to;
$title = $r->title;
$body = $r->body;
$sound = $r->sound;

$messages = (new ExpoMessage([
    'title' => $title,
    'body' => $body,
    'to' => $to,
    'sound' => $sound
]));

$defaultRecipients = [$to];

(new Expo)->send($messages)->to($defaultRecipients)->push();
?>