//general
var TO_JST = +9;
var RULE_COUNT_PER_HOUR = 6;

var SNACKBAR_LONG = 5000;
var SNACKBAR_SHORT = 2500;

// dimen
var WIDTH_PER_MINUTE = correspondToUa(3, 2.5, 2);
var HORIZONTAL_MARGIN = 20; // margin before min_time and after max_time, common to _dimen.scss

var RULE_HEIGHT = 1000;

var START_TIME = 420;

// interval
var CURRENT_LINE_UPDATE_INTERVAL = 1000;
var REMAINING_TIME_UPDATE_INTERVAL = 1000;
var OPACITY_UPDATE_INTERVAL = 10 * 1000;

// material colors
var PINK = '#D81B60'; // Pink 600
var RED = '#D32F2F';  // Red 700
var ORANGE = '#F57C00'; // Orange 700
var YELLOW = '#FFA000';  // Amber 700
var GREEN = '#388E3C';  // Green 700
var LIGHTBLUE = '#039BE5' // Light Blue 600
var BLUE = '#303F9F'; // Indigo 700
var PURPLE = '#512DA8';  // Deep Purple 700

// color
var PAST_OPACITY = 0.5;
var DEFAULT_TEXT_COLOR = 'black';

var CLASSWORK_COLOR = RED;
var BUS_COLORS = [
  {section: BLUE, direction: [LIGHTBLUE, PURPLE]},
  {section: RED, direction: [ORANGE, PINK]}
];
var LIBRARY_COLOR = GREEN;
var RESTAURANT_COLORS = [YELLOW, BLUE, RED];

// type
var TYPE_CLASSWORK = 'classwork';
var TYPE_BUS = 'bus';
var TYPE_LIBRARY = 'library';
var TYPE_RESTAURANT = 'restaurant';
var BUSINESS_HOURS_NAMES = {
  'classwork': ['開始', '終了'],
  'library': ['開館', '閉館'],
  'restaurant': ['開店', '閉店']
};

// link
var links = [
  {
    'name': '学内連絡バス',
    'url': 'http://www.osaka-u.ac.jp/ja/access/bus.html'
  } , {
    'name': '総合図書館',
    'url': 'https://www.library.osaka-u.ac.jp/sougou/schedule.php'
  }, {
    'name': '生命科学図書館',
    'url': 'https://www.library.osaka-u.ac.jp/seimei/schedule.php'
  }, {
    'name': '理工学図書館',
    'url': 'https://www.library.osaka-u.ac.jp/rikou/schedule.php'
  }, {
    'name': '外国学図書館',
    'url': 'https://www.library.osaka-u.ac.jp/gaikoku/schedule.php'
  }, {
    'name': '豊中の生協食堂',
    'url': 'http://www.osaka-univ.coop/info/02_2.html'
  }, {
    'name': '吹田の生協食堂',
    'url': 'http://www.osaka-univ.coop/info/03_2.html'
  }, {
    'name': '箕面の生協食堂',
    'url': 'http://www.osaka-univ.coop/info/04_2.html'
  }, {
    'name': '食堂・売店等の案内',
    'url': 'http://www.osaka-u.ac.jp/ja/guide/student/general/welfare.html'
  }
];

var THIS_PAGE_URL = 'http://sairibus.info';
var TWEET_LINK = 'https://twitter.com/intent/tweet';