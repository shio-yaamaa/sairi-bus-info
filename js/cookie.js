var cookieValueSeparator = '&';

var cookies = [];
function loadCookie() {
  document.cookie.split(/\s*;\s*/).forEach(function (element, index) {
    var splitElement = element.split(/\s*=\s*/);
    cookies.push({'key': splitElement[0], 'value': splitElement[1]});
  });
}

var invisibles = [];
function loadInvisibles() {
  var invisiblesCookie = cookies.reduce(function (previousValue, currentValue) {
    return (previousValue == undefined && currentValue['key'] == 'invisibles')
      ? currentValue
      : previousValue;
  }, undefined);
  if (invisiblesCookie != undefined) {
    invisibles = invisiblesCookie['value'].split(cookieValueSeparator);
  }
}

function updateInvisibles() {
  document.cookie = 'invisibles=' + invisibles.join(cookieValueSeparator)
    + ';expires=' + COOKIE_EXPIRES + ';max-age=' + COOKIE_MAX_AGE;
  // IEがmax-ageに対応したらexpires消す
}

function addInvisible(string) {
  if (invisibles.indexOf(string) == -1) {
    invisibles.push(string);
  }
  updateInvisibles();
}

function deleteInvisible(string) {
  if (invisibles.indexOf(string) != -1) {
    invisibles.splice(invisibles.indexOf(string), 1);
  }
  updateInvisibles();
}

loadCookie();
loadInvisibles();