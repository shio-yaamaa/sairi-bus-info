var NEXT_MORNING_INT = -2;  // common to Time.class.php
var NEXT_MORNING_STRING = '翌朝';

var COOKIE_EXPIRES = new Date(2100, 0, 1).toUTCString();
var COOKIE_MAX_AGE = 60 * 60 * 24 * 30 * 12 * 50;

var ORIGINAL_MIN_TIME = 600;  // 10:00
var ORIGINAL_MAX_TIME = 1080; // 18:00

var MIN_MIN_TIME = 0; // 0:00
var MAX_MAX_TIME = 1440;  // 24:00

var MIN_TIME = ORIGINAL_MIN_TIME;
var MAX_TIME = ORIGINAL_MAX_TIME;

// flags
var classworkFinished = false;
var busFinished = false;
var libraryFinished = false;
var restaurantFinished = false;

function setClassworkFinished() {
  classworkFinished = true;
  settleTimeRange();
}

function setBusFinished() {
  busFinished = true;
  settleTimeRange();
}

function setLibraryFinished() {
  libraryFinished = true;
  settleTimeRange();
}

function setRestaurantFinished() {
  restaurantFinished = true;
  settleTimeRange();
}

function entryTimeRange(start, end) {
  if (start >= MIN_MIN_TIME) {
    MIN_TIME = Math.min(MIN_TIME, start);
  }
  if (end <= MAX_MAX_TIME) {
    MAX_TIME = Math.max(MAX_TIME, end === NEXT_MORNING_INT ? MAX_MAX_TIME : end);
  }
}

function settleTimeRange() {
  if (classworkFinished && busFinished && libraryFinished && restaurantFinished) {
    MIN_TIME = Math.floor((MIN_TIME - 1) / 60) * 60;
    MAX_TIME = MAX_TIME / 60 * 60 + 60;

    drawScale(MIN_TIME / 60, MAX_TIME / 60);
    drawRule(MIN_TIME / 60, MAX_TIME / 60, 6);
    initializeCurrentLine();

    showClasswork();
    showBus();
    showLibrary();
    showRestaurant();

    scrollToCurrentTime(false);
    setOpacityInterval();

    setVisibilityItems();
  }
}

function getCurrentDate() {
  var date = new Date();
  date.setUTCHours(date.getUTCHours() + TO_JST);
  return date;
}

function getCurrentTime() {
  var date = getCurrentDate();
  return {
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds()
  };
}

function getCurrentMinute() {
  var time = getCurrentTime();
  return time['hour'] * 60 + time['minute'];
}

function getCurrentX() {
  return HORIZONTAL_MARGIN + (getCurrentMinute() - MIN_TIME) * WIDTH_PER_MINUTE;
}

function convertToStringForShow(int) {
  if (int === NEXT_MORNING_INT) {
    return NEXT_MORNING_STRING;
  }
  if (int === -1) {
    return '';
  }
  var hour = Math.floor(int / 60);
  var minute = int % 60;
  return ('00' + hour).slice(-2) + ':' + ('00' + minute).slice(-2);
}

function convertToStringsForShow(ints) {
  return ints[0] === -1 ? '休業' : ints.map(function (int) {
    return convertToStringForShow(int);
  }).join('-');
}

function getRemainingTime(int) {
  if (int === NEXT_MORNING_INT || int === -1) {
    return '-';
  }
  var remainingMinute = int - (getCurrentMinute() + 1);
  if (remainingMinute < 0) {
    return '-';
  }
  var hour = Math.floor(remainingMinute / 60);
  var minute = remainingMinute % 60;
  return (hour === 0 ? '' : hour + '時間') + minute + '分';
}