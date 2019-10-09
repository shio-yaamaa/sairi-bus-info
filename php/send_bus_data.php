<?php

require_once __DIR__ . '/Utility.class.php';
require_once __DIR__ . '/Time.class.php';
require_once __DIR__ . '/SQLiteDB.class.php';

$buses = [];

$db_buses = SQLiteDB::get_bus_data();

$current_section = ['index' => -1, 'name' => null];
$current_direction = ['index' => -1, 'name' => null];

foreach ($db_buses as $db_bus) {
  $bus = [
    'id' => (int) $db_bus['id'],
    'name' => $db_bus['name'],
    'times' => Time::convert_to_ints($db_bus['times']),
    'two_buses' => (boolean) $db_bus['two_buses'],
    'micro_disease' => (boolean) $db_bus['micro_disease'],
    'lane' => (int) $db_bus['lane']
  ];

  $add_section = false;
  $add_direction = false;

  if ($db_bus['section'] === $current_section['name']) {
    if ($db_bus['direction'] !== $current_direction['name']) {
      // direction
      $current_direction['index']++;
      $current_direction['name'] = $db_bus['direction'];
      $add_direction = true;
    }
  } else {
    // section
    $current_section['index']++;
    $current_section['name'] = $db_bus['section'];
    $add_section = true;

    // direction
    $current_direction['index'] = 0;
    $current_direction['name'] = $db_bus['direction'];
    $add_direction = true;
  }

  if ($add_section) {
    $buses[$current_section['index']] = [
      'section_name' => $db_bus['section'],
      'directions' => []
    ];
  }
  if ($add_direction) {
    $buses[$current_section['index']]['directions'][$current_direction['index']] = [
      'direction_name' => Utility::shorten_direction($db_bus['direction']),
      'direction_full_names' => Utility::apart_direction($db_bus['direction']),
      'buses' => []
    ];
  }

  $buses[$current_section['index']]['directions'][$current_direction['index']]['buses'][] = $bus;
}

header('Content-type: application/json; charset=UTF-8');
echo json_encode($buses);

/* sample
[
  {
    "section_name": "吹田方面",
    "directions": [
      {
        "direction_name": "吹→豊",
        "direction_full_names": ["吹田キャンパス(発)", "人科", "豊中キャンパス(着)"],
        "buses": [
          {
            "id": 1,
            "name": "1",
            "times": [10, 20, 30],
            "two_buses": true,
            "micro_disease": false,
            "lane": 0
          },
          {
            "id": 3,
            "name": "3",
            "times": [20, 30, 40],
            "two_buses": false,
            "micro_disease": true,
            "lane": 0
          }
        ]
      },
      {
        "direction_name": "豊→吹",
        "direction_full_names": ["豊中キャンパス(発)", "人科", "吹田キャンパス(着)"],
        "buses": [
          {
            "id": 2,
            "name": "2",
            "times": [10, 20, 30],
            "two_buses": false,
            "micro_disease": false,
            "lane": 0
          },
          {
            "id": 4,
            "name": "4",
            "times": [20, 30, 40],
            "two_buses": false,
            "micro_disease": true,
            "lane": 0
          }
        ]
      }
    ]
  },
  {
    "section_name": "箕面方面",
    "directions": [
      {
        "direction_name": "箕→豊",
        "direction_full_names": ["箕面キャンパス(発)", "人科", "豊中キャンパス(着)"],
        "buses": [
          {
            "id": 5,
            "name": "M-1",
            "times": [10, 30, 50],
            "two_buses": false,
            "micro_disease": false,
            "lane": 0
          }
          {
            "id": 7,
            "name": "M-3",
            "times": [30, 50, 70],
            "two_buses": false,
            "micro_disease": false,
            "lane": 0
          }
        ]
      },
      {
        "direction_name": "豊→箕",
        "direction_full_names": ["豊中キャンパス(着)", "人科", "箕面キャンパス(発)"],
        "buses": [
          {
            "id": 6,
            "name": "M-2",
            "times": [10, 30, 50],
            "two_buses": false,
            "micro_disease": false,
            "lane": 0
          }
          {
            "id": 8,
            "name": "直-1",
            "times": [30, 50, 70],
            "two_buses": false,
            "micro_disease": false,
            "lane": 0
          }
        ]
      }
    ]
  }
]
*/