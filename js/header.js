// header text
var today = new Date();
var dayNames = ['日', '月', '火', '水', '木', '金', '土'];
$('#date').text(
  today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
  + ' (' + dayNames[today.getDay()] + ')'
);

// current time icon
$('#current_time_icon').click(function () {
  scrollToCurrentTime(true);
});

// visibility icon
$('#visibility_icon').click(function () {
  openVisibilityModalWindow();
});

// link icon
$('#link_icon').click(function () {
  openLinkModalWindow();
});