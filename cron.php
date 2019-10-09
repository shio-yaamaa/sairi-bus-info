#!/usr/bin/php
<?php
require_once 'lib/phpQuery-onefile.php';
require_once 'php/Constant.class.php';
require_once 'php/Utility.class.php';
require_once 'php/Time.class.php';
require_once 'php/SQLiteDB.class.php';

SQLiteDB::initialize();

require "php/create_bus_data.php";
require "php/create_library_data.php";
require "php/create_restaurant_data.php";