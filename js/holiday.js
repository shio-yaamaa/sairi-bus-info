var API_KEY = "AIzaSyAQ6hTZGcOB4On2AEZGku3iuw5F-CvAna8";
var CALENDAR_ID = "ja.japanese#holiday@group.v.calendar.google.com";

var day = getCurrentDate().getUTCDay();
var isHoliday = day === 0 || day === 6;

var nationalHolidays = [];

function getNationalHolidays() {
  var year = getCurrentDate().getUTCFullYear();

  $.getJSON(
    'https://www.googleapis.com/calendar/v3/calendars/'
      + encodeURIComponent(CALENDAR_ID)
      + '/events?key='
      + API_KEY
      + '&timeMin=' + year + '-01-01T00:00:00.000Z'
      + '&timeMax=' + year + '-12-31T00:00:00.000Z',
    null,
    function (response) {
      $.each(response['items'], function (index, element) {
        nationalHolidays.push(parseGoogleCalendarDate(element['start']['date']));
      });

      setIsNationalHoliday();
    }
  );

}

function parseGoogleCalendarDate(string) {
  var strings = string.split("-");
  return {
    month: parseInt(strings[1]) - 1,
    date: parseInt(strings[2])
  };
}

function setIsNationalHoliday() {
  var today = {
    month: getCurrentDate().getUTCMonth(),
    date: getCurrentDate().getUTCDate()
  }
  $.each(nationalHolidays, function (index, element) {
    if (element['month'] === today['month'] && element['date'] === today['date']) {
      isHoliday = true;
      return false;
    }
  });
}

if (!isHoliday) {
  getNationalHolidays();
}