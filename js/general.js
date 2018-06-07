function resizeRowHeading() {
  var windowWidth = window.innerWidth;
  Array.prototype.forEach.call(
    document.getElementsByClassName('row_heading'),
    function(element) {
      element.style.width = windowWidth >= 640 ? 640 * 0.2 + 'px' : '20%';
    }
  );
}
resizeRowHeading();
window.onresize = function() {
  resizeRowHeading();
};

// synchronize horizontal scroll
var contentTimeline = $('#content_timeline');
var scaleTimeline = $('#scale_timeline');
contentTimeline.scroll(function() {
  scaleTimeline.scrollLeft(contentTimeline.scrollLeft());
});

// scroll to current time
function scrollToCurrentTime(smoothScroll) {
  var destinationX = getCurrentX() - contentTimeline.width() / 2;
  destinationX = Math.max(
    0,
    Math.min($('#ruled_view').width() - contentTimeline.width(), destinationX)
  );
  contentTimeline.animate(
    {scrollLeft: destinationX},
    smoothScroll ? 800 : 0,
    'swing'
  );
};

// reload when date changes
var midnight = getCurrentDate();
midnight.setUTCHours(24, 0, 1, 0);
setTimeout(function () {
  location.reload();
}, midnight.getTime() - getCurrentDate().getTime());

// set opacity
var opacityDivs = [];
/*
opacityDivs = [
  {divs: div, endTime: 0, ended: false},
  ...
];
*/
function setOpacityInterval() {
  setInterval(function setOpacity() {
    var currentMinute = getCurrentMinute();
    $.each(opacityDivs, function (opacityDivIndex, opacityDiv) {
      if (!opacityDiv['ended'] && opacityDiv['endTime'] < currentMinute) {
        opacityDiv['div'].css('opacity', PAST_OPACITY);
        opacityDiv['ended'] = true;
      }
    });
    return setOpacity;
  }(), OPACITY_UPDATE_INTERVAL);
}