#!/usr/bin/php
<?php

mb_language('Japanese');
mb_internal_encoding('UTF-8');

require_once __DIR__ . '/lib/phpQuery-onefile.php';
require_once __DIR__ . '/php/Constant.class.php';
require_once __DIR__ . '/php/Utility.class.php';
require_once __DIR__ . '/php/Time.class.php';
require_once __DIR__ . '/php/SQLiteDB.class.php';

SQLiteDB::initialize();

require __DIR__ . '/php/create_bus_data.php';
require __DIR__ . '/php/create_library_data.php';
require __DIR__ . '/php/create_restaurant_data.php';