<?php

require('inc-database.php');

$mix = $_POST['mix'];

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

$mix = serialize($mix);

$idGen = str_split('ABCDEFGHIJKLMNOP'); // get all the characters into an array
shuffle($idGen); // randomize the array
$idGen = array_slice($idGen, 0, 6); // get the first six (random) characters out
$id = implode('', $idGen); // smush them back into a string

try {
	$stmt = $DB->prepare("INSERT INTO mixes (id, mix) VALUES (:id, :mix)");
	$stmt->bindParam(":id", $id);
	$stmt->bindParam(":mix", $mix);
	$stmt->execute();

	$message = array( 'success' => $id);
} catch (Exception $e) {
	$message = array( 'error' => 'Something went wrong. Please try again later');
}

echo json_encode($message);

?>