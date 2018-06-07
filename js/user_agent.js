var UA_PC = 0;
var UA_TABLET = 1;
var UA_SMARTPHONE = 2;

var userAgent;
var ua = navigator.userAgent;
if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
  userAgent = UA_SMARTPHONE;
} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
  userAgent = UA_TABLET;
} else {
  userAgent = UA_PC;  // includes WindowsPhone and some other devices
}

console.log("User Agent is " + userAgent);

function correspondToUa(pc, tablet, smartphone) {
  switch (userAgent) {
    case UA_PC:
      return pc;
    case UA_TABLET:
      return tablet;
    case UA_SMARTPHONE:
      return smartphone;
  }
}