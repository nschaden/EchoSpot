<?php
header('Content-Type: application/csv');
header('Content-Disposition: attachment; filename="echospot.csv"');
$csv = str_replace("\'","'",(str_replace('\"','"',urldecode($_POST['csv']))));
echo $csv;
?>