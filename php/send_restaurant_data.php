<?php

require_once __DIR__ . '/Time.class.php';
require_once __DIR__ . '/SQLiteDB.class.php';

$restaurants = [];

$db_restaurants = SQLiteDB::get_restaurant_data();

$current_campus = ['index' => -1, 'name' => null];

foreach ($db_restaurants as $db_restaurant) {
  $restaurant = [
    'id' => (int) $db_restaurant['id'],
    'name' => $db_restaurant['name'],
    'times' => Time::convert_to_ints($db_restaurant['times'])
  ];

  $add_campus = false;

  if ($db_restaurant['campus'] !== $current_campus['name']) {
    $current_campus['index']++;
    $current_campus['name'] = $db_restaurant['campus'];
    $add_campus = true;
  }

  if ($add_campus) {
    $restaurants[$current_campus['index']] = [
      'campus_name' => $current_campus['name'],
      'restaurants' => []
    ];
  }

  $restaurants[$current_campus['index']]['restaurants'][] = $restaurant;
}

header('Content-type: application/json; charset=UTF-8');
echo json_encode($restaurants);

/* sample
[
  {
    "campus_name": "豊中",
    "restaurants": [
      {
        "id": 1,
        "name": "3階食堂",
        "times": [50, 90]
      },
      {
        "id": 2,
        "name": "4階食堂",
        "times": [-1, -1]
      }
    ]
  },
  {
    "campus_name": "吹田",
    "restaurants": [
      {
        "id": 3,
        "name": "ファミール",
        "times": [50, 90]
      },
      {
        "id": 4,
        "name": "医学部",
        "times": [40, 70]
      }
    ]
  }
]
*/