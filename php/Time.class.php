<?php

class Time {

  static $NEXT_MORNING_INT = -2;
  static $NEXT_MORNING_STRING = '翌朝';

  static $ORIGINAL_MIN_TIME;
  static $ORIGINAL_MAX_TIME;
  static $MIN_MIN_TIME;
  static $MAX_MAX_TIME;
  static $MIN_TIME;
  static $MAX_TIME;

  public static function initialize() {
    // jsに移す
    $ORIGINAL_MIN_TIME = self::convert_to_int('10:00');
    $ORIGINAL_MAX_TIME = self::convert_to_int('18:00');
    $MIN_MIN_TIME = self::convert_to_int('0:00');
    $MAX_MAX_TIME = self::convert_to_int('24:00');
    $MIN_TIME = self::$ORIGINAL_MIN_TIME;
    $MAX_TIME = self::$ORIGINAL_MAX_TIME;
  }

  public static function get_current_datetime() {
    return new DateTime();
  }

  public static function get_current_date() {
    $datetime = self::get_current_datetime();
    $year = (int) $datetime->format('Y');
    $month = (int) $datetime->format('n');
    $date = (int) $datetime->format('j');
    return ['year' => $year, 'month' => $month - 1, 'date' => $date];
  }

  public static function get_current_time() {
    $datetime = self::get_current_datetime();
    $hour = (int) $datetime->format('H');
    $minute = (int) $datetime->format('i');

    return $hour * 60 + $minute;
  }

  public static function get_header_date() {
    return self::get_current_datetime()->format('Y/n/j (D)');
  }

  public static function get_reload_interval() {
    $tomorrow = new DateTime('tomorrow');
    $interval = $tomorrow->diff(Time::get_current_datetime());
    
    $hour = (int) $interval->format('%H');
    $minute = (int) $interval->format('%i');
    $second = (int) $interval->format('%s');

    return ($hour * 60 + $minute) * 60 + $second;
  }

  public static function clear_time_range() {
    self::$MIN_TIME = self::$ORIGINAL_MIN_TIME;
    self::$MAX_TIME = self::$ORIGINAL_MAX_TIME;
  }

  public static function entry_time_range($start, $end) {
    self::$MIN_TIME = min(self::$MIN_TIME, $start);
    self::$MAX_TIME = max(
      self::$MAX_TIME,
      $end === self::$NEXT_MORNING_INT ? self::$MAX_MAX_TIME : $end
    );

    // adjustment
    self::$MIN_TIME = (self::$MIN_TIME - 1) / 60 * 60;
    self::$MAX_TIME = self::$MAX_TIME / 60 * 60 + 60;

    // validation
    self::$MIN_TIME = max(self::$MIN_TIME, self::$MIN_MIN_TIME);
    self::$MAX_TIME = min(self::$MAX_TIME, self::$MAX_MAX_TIME);
  }

/*
    public static void settleTimeRange() {
        MIN_TIME = (MIN_TIME - 1) / 60 * 60;
        MAX_TIME = MAX_TIME / 60 * 60 + 60;

        MIN_TIME = Math.max(MIN_TIME, MIN_MIN_TIME);
        MAX_TIME = Math.min(MAX_TIME, MAX_MAX_TIME);

        CONTENT_WIDTH = Constants.HORIZONTAL_MARGIN * 2 + Utility.widthBetweenTimes(Constants.MIN_TIME, Constants.MAX_TIME);
    }*/

  // "08:10" or "8:10" -> 490
  public static function convert_to_int($string) {
    if ($string === self::$NEXT_MORNING_STRING) {
      return self::$NEXT_MORNING_INT;
    }
    if (!preg_match("/.*[0-9].*/", $string)) {
      return -1;
    }
    $flat = preg_replace("/[^0-9]/", "", $string);
    return (int) (floor($flat / 100) * 60 + $flat % 100);
  }

  // 490 -> "08:10"
  public static function convert_to_string($int) {
    if ($int === self::$NEXT_MORNING_INT) {
      return self::$NEXT_MORNING_STRING;
    }
    if ($int === -1) {
      return "";
    }
    $hour = floor($int / 60);
    $minute = $int % 60;
    return sprintf("%02d:%02d", $hour, $minute);
  }

  // 490 -> "8時間10分"
  public static function convert_to_remaining_time($int) {
    if ($int === self::$NEXT_MORNING_INT || $int === -1) {
      return '-';
    }
    $hour = floor($int / 60);
    $minute = $int % 60;
    return ($hour === 0 ? "" : sprintf("%d時間", $hour)) . sprintf("%d分", $minute);
  }

  // "490,550" -> [490, 550]
  // can manage more than three elements
  public static function convert_to_ints($string) {
    $return_array = [];
    if ($string === "") {
      return [-1, -1];
    }
    $divided_times = explode(',', $string);
    foreach ($divided_times as $divided_time) {
      $return_array[] = $divided_time === self::$NEXT_MORNING_STRING
        ? self::$NEXT_MORNING_INT
        : (int) $divided_time;
    }
    return $return_array;
  }

  // [490, 550] -> "490,550"
  // can manage array with more than three elements
  public static function convert_to_strings($ints) {
    return $ints[0] === -1 ? "" : implode(',', $ints);
  }

  // [490, 550] -> "8:10-9:10"
  public static function convert_to_strings_for_show($ints) {
    return $ints[0] === -1
      ? ""
      : (self::convert_to_string($ints[0]) . '-' . self::convert_to_string($ints[1]));
  }

  // "8:10～9:10" or "8:10-9:10" -> [490, 550]
  public static function parse_to_ints($string) {
    if (!preg_match("/.*[0-9].*/", $string)) {
      return [-1, -1];
    }
    $string = preg_replace("/\s/", "", $string);

    $divided_strings = [];

    $dividers = ['~', '～', '〜', '-', '―'];  // multiple '～' with different encoding (for restaurant)
    foreach ($dividers as $divider) {
      if (strpos($string, $divider)) { // divider's pos cannot be 0
        $divided_strings = explode($divider, $string);
      }
    }

    $ints = [];
    foreach ($divided_strings as $divided_string) {
      if (preg_match("/.*[0-9].*/", $divided_string)) {
        $ints[] = self::convert_to_int($divided_string);
      } else {
        // somewhat dangerous
        $ints[] = self::$NEXT_MORNING_INT;
      }
    }
    return $ints;
  }

  public static function is_future($ints) {
    return $ints[1] === self::$NEXT_MORNING_INT || $ints[1] >= self::get_current_time();
  }

}