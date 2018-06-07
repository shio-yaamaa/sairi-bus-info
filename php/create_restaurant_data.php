<?php

require_once 'Constant.class.php';
require_once 'SQLiteDB.class.php';
require_once '../lib/phpQuery-onefile.php';

$time = Time::get_current_date();

$year = $time['year'];
$month = $time['month'];

$urls = [
  "豊中" => Constant::$RESTAURANT_TOYONAKA_URL,
  "吹田" => Constant::$RESTAURANT_SUITA_URL,
  "箕面" => Constant::$RESTAURANT_MINOH_URL
];

SQLiteDB::clear_table(SQLiteDB::$TABLE_RESTAURANTS);

foreach ($urls as $campus_name => $url) {

  $names = [];
  $times = [];  // three-dimensional array [date[name[start or end]]]
  $dates = [];

  $this_month_string = ($month + 1) . '月';

  $doc = phpQuery::newDocument(file_get_contents($url));

  $table_rows = $doc[".table-02:contains($this_month_string)"]->find('tr');

  // separate restaurant-name row and body rows
  $restaurant_name_row = pq($table_rows)->eq(0);
  $table_rows = pq($table_rows)->not(':eq(0)');

  // put the name of the restaurants into $names
  $restaurant_name_tds = pq($restaurant_name_row)->children()->slice(3);
  foreach ($restaurant_name_tds as $td) {
    $names[] = Normalizer::normalize(preg_replace("/\s/", "", pq($td)->text()), Normalizer::FORM_KC);
  }

  // slice rows that belong to this month (for vacation season)
  $first_table_row = pq($table_rows)->filter(":contains('$this_month_string')")->eq(0);
  $table_rows = pq($table_rows)->slice(
    pq($table_rows)->index(pq($first_table_row)),
    pq($table_rows)->index(pq($first_table_row))
        + pq($first_table_row)->children(':first')->attr('rowspan')
  );

  foreach ($table_rows as $table_row) {
    $table_data = pq($table_row)->children();
    $offset = count($table_data) - count($names); // where the actual data begin

    // date
    $dates[] = (int) pq($table_data)->eq($offset - 2)->text();

    // times
    $time_table_data = pq($table_data)->slice($offset);
    $times_of_day = [];  // two-dimensional array

    foreach ($time_table_data as $time_table_datum) {
      $times_of_day[] = Time::parse_to_ints(pq($time_table_datum)->text());
    }

    $times[] = $times_of_day;
  }

  SQLiteDB::insert_restaurant_data($names, $year, $month, $dates, $campus_name, $times);
}