<?php

if(php_sapi_name() !== 'cli'){
    die('Must be command line');
}

$cmd = 'ps -u www-data -F';

$output = shell_exec($cmd);
foreach(preg_split("/((\r?\n)|(\r\n?))/", $output) as $line){
    if(strpos($line, '-f image2 -s') !== false){
        echo $line.PHP_EOL;        
    }
    if(strpos($line, '-y -ss 3 -t 3') !== false){
        echo $line.PHP_EOL;        
    }
} 