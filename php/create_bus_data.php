<?php

require_once __DIR__ . '/Constant.class.php';
require_once __DIR__ . '/SQLiteDB.class.php';
require_once __DIR__ . '/../lib/phpQuery-onefile.php';

$time = Time::get_current_date();

$year = $time['year'];
$month = $time['month'];
$date = $time['date'];

SQLiteDB::clear_table(SQLiteDB::$TABLE_BUSES);

$doc = phpQuery::newDocument(file_get_contents(Constant::$BUS_URL));

$tables = $doc['.dataTable'];

foreach ($tables as $table) {
  $section = "";
  $directions = []; // two-dimensional array
  $names = [];  // two-dimensional array
  $times = [];  // three-dimensional array
  $two_buses = [];  // two-dimensional array
  $micro_disease = [];

  // section
  $split_section_strings = preg_split("/[．.]/", pq($table)->prev()->text());  // unstable due to encoding?
  $section_string = array_values(array_filter($split_section_strings, function ($string) {
    return strpos($string, '地区間');
  }))[0];
  $section = implode('-', array_map(function ($string) {
    return mb_substr($string, 0, 1);
  }, explode('⇔', preg_replace("/地区間.*/", '', $section_string))));
  
  $header_row = pq($table)->find('tr')->eq(0);
  $table_rows = pq($table)->find('tr:gt(0)');

  // position of directions in the table row
  $table_names = pq($table_rows)->eq(0)->find('.tableName');
  $column_positions = [];
  foreach ($table_names as $table_name) {
    $column_positions[] = pq($table_rows)->eq(0)->children()->index(pq($table_name));
  }

  // $column_positions = [[index of name column, number of time columns], ...];
  for ($i = 0; $i < count($column_positions); $i++) {
    $column_positions[$i] = [
      $column_positions[$i],
      $i === count($column_positions) - 1
        ? count(pq($header_row)->children()) - $column_positions[$i] - 1
        : $column_positions[$i + 1] - $column_positions[$i] - 1
    ];
  }

  // direction
  foreach ($column_positions as $column_position) {
    $directions_of_section = [];
    for ($column = 0; $column < $column_position[1]; $column++) {
      $directions_of_section[] = Utility::tidy(
        pq($header_row)->children()->eq($column_position[0] + $column + 1)->text(), Normalizer::FORM_KC, "/\s/"
      );
    }

    $directions[] = $directions_of_section;
  }

  foreach ($table_rows as $table_row) {
    $table_data = pq($table_row)->children();
    foreach ($column_positions as $column_position) {
      // name
      $single_name = Utility::tidy(
        pq($table_data)->eq($column_position[0])->text(), Normalizer::FORM_KC, "/\s/"
      );
      if ($single_name === "") { continue; }
      $single_micro_disease = strpos($single_name, "※") !== false;
      $single_name = str_replace("※", "", $single_name);

      // times
      $single_times = [];
      $single_two_buses = false;
      for ($column = 0; $column < $column_position[1]; $column++) {
        $original_time_text = pq($table_data)->eq($column_position[0] + $column + 1)->text();
        $single_two_buses = strpos($original_time_text, "*") !== false;
        $single_times[] = Time::convert_to_int($original_time_text);
      }

      $direction_index = array_search($column_position, $column_positions);
      // direction_indexにしたがって挿入する
      $names[$direction_index][] = $single_name;
      $times[$direction_index][] = $single_times;
      $two_buses[$direction_index][] = $single_two_buses;
      $micro_disease[$direction_index][] = $single_micro_disease;
    }
  }

  // lane
  $lanes = array_fill(0, count($directions), []);
  for ($direction = 0; $direction < count($directions); $direction++) {
    $buses_of_direction = $names[$direction];
    //$buses_of_same_lane = [];

    for ($bus_index = 0; $bus_index < count($names[$direction]); $bus_index++) {
      for ($lane = 0; true; $lane++) {
        if (array_search($lane, $lanes[$direction]) === false) {
          $lanes[$direction][$bus_index] = $lane;
          break;
        } else {
          $previous_bus_index_of_same_lane
            = count($lanes[$direction]) - array_search($lane, array_reverse($lanes[$direction])) - 1;
          $margin = $times[$direction][$bus_index][0]
            - $times[$direction][$previous_bus_index_of_same_lane][count($times[$direction][$previous_bus_index_of_same_lane]) - 1];
          if ($margin >= Constant::$BUS_MIN_MARGIN) {
            $lanes[$direction][$bus_index] = $lane;
            break;
          }
        }
      }
    }
  }

  SQLiteDB::insert_bus_data(
    $year, $month, $date, $section, $directions, $names, $times, $two_buses, $micro_disease, $lanes
  );
}