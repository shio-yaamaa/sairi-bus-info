var TWEET_TAG = '再履バス';

// button
var ON_THIS_BUS = 'このバスに';
var TWEET_THAT = 'とツイートする';

// status
var WILL_RIDE = '乗車予定';
var RIDING = '乗車中';
var RODE = '乗車した';

var TWEET_CONTENT = ['再履バス(便名: ', ')に', ' - '];

function createTweetLink(bus, directionFullNames, status) {
  var text = '再履バス (便名: ' + bus['name'] + ')に' + status + ' - '
    + directionFullNames.reduce(function () {
      
    });

  return TWEET_LINK
    + '?text=テスト'
    + '&url=' + encodeURIComponent(THIS_PAGE_URL)
    + '&hashtags=' + TWEET_TAG;
}

// #再履バス (便名: M-8) に乗っています - 豊中地区(発)(10:30) → コンベンション前(10:50) → 外国語学部前(着)(11:10) 