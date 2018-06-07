var snackbar = $('#snackbar');
var snackbarTimeout;

function showSnackbar(message, duration) {
  // initialize
  clearTimeout(snackbarTimeout);
  snackbar.css({
    'top': '100%',
    'visibility': 'visible'
  });

  snackbar.text(message);

  // animate
  var moveHeight = snackbar.outerHeight() + (window.innerHeight >= 800 ? 20 : 0);
  snackbar.animate({'top': '-=' + moveHeight + 'px'}, 100, 'swing');
  snackbarTimeout = setTimeout(function() {
    snackbar.animate({'top': '100%'}, 100, 'swing', function () {
      snackbar.css('visibility', 'hidden');
    });
  }, duration);
}