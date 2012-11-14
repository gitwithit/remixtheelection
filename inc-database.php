<?php

// Database credentials
define('DB_HOST', 'localhost');
define('DB_PORT', 3306);
define('DB_NAME', '');
define('DB_USERNAME', '');
define('DB_PASSWORD', '');

// Initialize PDO and connect to database
$pdo_options = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES "utf8"');
$DB = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME, DB_USERNAME, DB_PASSWORD, $pdo_options);
$DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);