<?php

require_once __DIR__ . '/Time.class.php';

class SQLiteDB {

  static $TABLE_CLASSWORKS = 'classworks';
  static $TABLE_BUSES = 'buses';
  static $TABLE_LIBRARIES = 'libraries';
  static $TABLE_RESTAURANTS = 'restaurants';

  private static $db = null;

  public static function get_database() {
    if (!self::$db) {
      try {
        $db_path = realpath(__DIR__ . '/../sairibus.sqlite');
        self::$db = new PDO('sqlite:' . $db_path);
        self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      } catch (PDOException $e) {
        echo $e->getMessage();
      }
    }
    return self::$db;
  }

  public static function initialize() {
    // classworks
    self::get_database()->exec("CREATE TABLE IF NOT EXISTS " . self::$TABLE_CLASSWORKS . " (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      times TEXT
    )");

    // rowCount() cannot be used
    if (self::get_database()->query("SELECT COUNT(*) FROM " . self::$TABLE_CLASSWORKS)->fetchColumn() == 0) {
      self::insert_classwork_data();
    }

    // buses
    self::get_database()->exec("CREATE TABLE IF NOT EXISTS " . self::$TABLE_BUSES . " (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      year INTEGER,
      month INTEGER,
      date INTEGER,
      section TEXT,
      direction TEXT,
      times TEXT,
      two_buses INTEGER,
      micro_disease INTEGER,
      lane INTEGER
    )");

    // libraries
    self::get_database()->exec("CREATE TABLE IF NOT EXISTS " . self::$TABLE_LIBRARIES . " (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      year INTEGER,
      month INTEGER,
      date INTEGER,
      times TEXT
    )");

    // restaurants
    self::get_database()->exec("CREATE TABLE IF NOT EXISTS " . self::$TABLE_RESTAURANTS . " (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      year INTEGER,
      month INTEGER,
      date INTEGER,
      campus TEXT,
      times TEXT
    )");
  }

  public static function clear_table($name) {
    self::get_database()->exec("DELETE FROM $name");
  }

  public static function insert_classwork_data() {
    $default_classworks = [
      "1限" => Time::parse_to_ints("8:50-10:20"),
      "2限" => Time::parse_to_ints("10:30-12:00"),
      "3限" => Time::parse_to_ints("13:00-14:30"),
      "4限" => Time::parse_to_ints("14:40-16:10"),
      "5限" => Time::parse_to_ints("16:20-17:50"),
      "6限" => Time::parse_to_ints("18:00-19:30"),
    ];

    try {

      self::get_database()->beginTransaction();

      $stmt = self::get_database()->prepare("INSERT INTO " . self::$TABLE_CLASSWORKS
        . " (name, times) VALUES (?, ?)");

      foreach ($default_classworks as $name => $times) {
        $stmt->execute([$name, Time::convert_to_strings($times)]);
      }

      self::get_database()->commit();

    } catch (PDOException $e) {
      echo $e->getMessage();
      self::get_database()->rollBack();
    }
  }

  //　execute once per section
  public static function insert_bus_data($year, $month, $date, $section, $directions, $names, $times, $two_buses, $micro_disease, $lanes) {
    try {

      self::get_database()->beginTransaction();

      $stmt = self::get_database()->prepare("INSERT INTO " . self::$TABLE_BUSES
        . " (name, year, month, date, section, direction, times, two_buses, micro_disease, lane) VALUES"
        . " (?, $year, $month, $date, '$section', ?, ?, ?, ?, ?)");

      for ($direction = 0; $direction < count($directions); $direction++) {
        for ($name = 0; $name < count($names[$direction]); $name++) {
          $stmt->execute([
            $names[$direction][$name],
            Utility::join_direction($directions[$direction]),
            Time::convert_to_strings($times[$direction][$name]),
            $two_buses[$direction][$name],
            $micro_disease[$direction][$name],
            $lanes[$direction][$name]
          ]);
        }
      }

      self::get_database()->commit();

    } catch (PDOException $e) {
      echo $e->getMessage();
      self::get_database()->rollBack();
    }
  }

  public static function insert_library_data($name, $year, $month, $dates, $times) {
    try {

      self::get_database()->beginTransaction();

      $stmt = self::get_database()->prepare("INSERT INTO " . self::$TABLE_LIBRARIES
        . " (name, year, month, date, times) VALUES ('$name', $year, $month, ?, ?)");

      for ($i = 0; $i < count($dates); $i++) {
        $stmt->execute([$dates[$i], Time::convert_to_strings($times[$i])]);
      }

      self::get_database()->commit();

    } catch (PDOException $e) {
      echo $e->getMessage();
      self::get_database()->rollBack();
    }
  }

  public static function insert_restaurant_data($names, $year, $month, $dates, $campus, $times) {
    try {

      self::get_database()->beginTransaction();

      $stmt = self::get_database()->prepare("INSERT INTO " . self::$TABLE_RESTAURANTS
        . " (name, year, month, date, campus, times) VALUES (?, $year, $month, ?, '$campus', ?)");

      for ($date = 0; $date < count($dates); $date++) {
        for ($name = 0; $name < count($names); $name++) {
          $stmt->execute([
            $names[$name],
            $dates[$date],
            Time::convert_to_strings($times[$date][$name])
          ]);
        }
      }

      self::get_database()->commit();

    } catch (PDOException $e) {
      echo $e->getMessage();
      self::get_database()->rollBack();
    }
  }

  public static function get_classwork_data() {
    return self::get_database()
        ->query("SELECT * FROM " . self::$TABLE_CLASSWORKS)
        ->fetchAll(PDO::FETCH_ASSOC);
  }

  public static function get_bus_data() {
    return self::get_database()
        ->query("SELECT * FROM " . self::$TABLE_BUSES)
        ->fetchAll(PDO::FETCH_ASSOC);
  }

  public static function get_library_data() {
    $date = Time::get_current_date();
    return self::get_database()
        ->query("SELECT * FROM " . self::$TABLE_LIBRARIES
            . " WHERE year = " . $date['year'] . " AND month = " . $date['month'] . " AND date = " . $date['date'])
        ->fetchAll(PDO::FETCH_ASSOC);
  }

  public static function get_restaurant_data() {
    $date = Time::get_current_date();
    return self::get_database()
        ->query("SELECT * FROM " . self::$TABLE_RESTAURANTS
            . " WHERE year = " . $date['year'] . " AND month = " . $date['month'] . " AND date = " . $date['date'])
        ->fetchAll(PDO::FETCH_ASSOC);
  }
}