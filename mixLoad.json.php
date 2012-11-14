<?php

require('inc-database.php');

$id = $_REQUEST['id'];

/*
// Test data
$mix = array( 
	'mix' => array(
		'ytID' => 'xmfEz4qrnTw',
		'1.788' => array(
			'ytID' => 'xmfEZ4qrnTw',
			'time' => '1.788',
			'soundID' => 'obama2'),
		'2.074' => array(
			'ytID' => 'xmfEZ4qrnTw',
			'time' => '2.074',
			'soundID' => 'romney2'
		),
	),
);
*/


try {
	$stmt = $DB->prepare("SELECT mix FROM mixes WHERE (id=:id)");
	$stmt->bindParam(":id", $id);
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);

	$mix = unserialize($result['mix']);

	$message = array( 'success' => $mix);
} catch (Exception $e) {
	echo $e;
	$message = array( 'error' => 'Something went wrong. Please try again later');
}

echo json_encode($message);