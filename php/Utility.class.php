<?php

class Utility {
  public static function tidy($string, $normalize_form, $replace) {
    return preg_replace($replace, "",
      Normalizer::normalize($string, $normalize_form)
    );
  }

  public static function join_direction($array) {
    return implode(',', $array);
  }

  public static function apart_direction($string) {
    return explode(',', $string);
  }

  public static function shorten_direction($string) {
    $directions = self::apart_direction($string);
    return implode('>', array_map(function ($string) {
      return mb_substr($string, 0, 1, 'utf-8');
    }, $directions));
  }
}