<?php
if(php_sapi_name() !== 'cli'){
  return die('Command Line only');
}

$_POST["webSiteRootURL"] = getenv("SERVER_URL");
$_POST["systemRootPath"] = "/var/www/html/AVideo/Encoder/";

$_POST["databaseHost"] = getenv("ENCODER_DB_MYSQL_HOST");
$_POST["databasePort"] = getenv("ENCODER_DB_MYSQL_PORT");
$_POST["databaseName"] = getenv("ENCODER_DB_MYSQL_NAME");
$_POST["databaseUser"] = getenv("ENCODER_DB_MYSQL_USER");
$_POST["databasePass"] = getenv("ENCODER_DB_MYSQL_PASSWORD");
$_POST["createTables"] = 2;

$_POST['siteURL'] = getenv("STREAMER_URL");
$_POST['inputUser'] = getenv("STREAMER_USER");
$_POST['inputPassword'] = getenv("STREAMER_PASSWORD");
$_POST['allowedStreamers'] = getenv("STREAMER_URL");
$_POST['defaultPriority'] = getenv("STREAMER_PRIORITY");

require_once "./checkConfiguration.php";
