<?php

require_once 'Constant.class.php';
require_once 'SQLiteDB.class.php';
require_once 'lib/phpQuery-onefile.php';

$time = Time::get_current_date();

$year = $time['year'];
$month = $time['month'];

$urls = [
  Constant::$LIBRARY_SOUGOU_URL,
  Constant::$LIBRARY_SEIMEI_URL,
  Constant::$LIBRARY_RIKOU_URL,
  Constant::$LIBRARY_GAIKOKU_URL
];

SQLiteDB::clear_table(SQLiteDB::$TABLE_LIBRARIES);

foreach ($urls as $url) {
  
  $doc = phpQuery::newDocument(file_get_contents($url));

  $title = $doc['title']->text();
  $name = substr($title, 0, strpos($title, "図書館"));

  $table_rows = $doc['table']->find('tr:gt(0)');

  $dates = [];
  $times = []; // two-dimensional array

  foreach ($table_rows as $table_row) {
    foreach (pq($table_row)->children() as $table_datum) {
      $table_datum_text = preg_replace("/\s/", "", pq($table_datum)->html());
      if ($table_datum_text === "<br>") {
        continue;
      }
      $split_table_datum = explode("<br>", $table_datum_text);

      if ($split_table_datum[0] !== "") {
        // dates
        $dates[] = (int) $split_table_datum[0];

        // times
        $times[] = Time::parse_to_ints($split_table_datum[1]);
      }
    }
  }

  SQLiteDB::insert_library_data($name, $year, $month, $dates, $times);
}