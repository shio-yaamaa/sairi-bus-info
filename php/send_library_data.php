<?php

require_once 'Time.class.php';
require_once 'SQLiteDB.class.php';

$libraries = [];

$db_libraries = SQLiteDB::get_library_data();

foreach ($db_libraries as $db_library) {
  $libraries[] = [
    'id' => (int) $db_library['id'],
    'name' => $db_library['name'],
    'times' => Time::convert_to_ints($db_library['times'])
  ];
}

header('Content-type: application/json; charset=UTF-8');
echo json_encode($libraries);

/* sample
[
  {
    "id": 1,
    "name": "総合",
    "times": [10, -2]
  },
  {
    "id": 2,
    "name": "理工学",
    "times": [10, 70]
  }
]
*/