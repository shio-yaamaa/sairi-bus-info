<?php

require_once 'Time.class.php';
require_once 'SQLiteDB.class.php';

$classworks = [];

$db_classworks = SQLiteDB::get_classwork_data();

foreach ($db_classworks as $db_classwork) {
  $classworks[] = [
    'id' => (int) $db_classwork['id'],
    'name' => $db_classwork['name'],
    'times' => Time::convert_to_ints($db_classwork['times'])
  ];
}

header('Content-type: application/json; charset=UTF-8');
echo json_encode($classworks);

/* sample
[
  {
    "id": 1,
    "name": "1限",
    "times": [800, 850]
  },
  {
    "id": 2,
    "name": "2限",
    "times": [900, 950]
  }
]
*/