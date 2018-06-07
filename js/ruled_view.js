function drawScale(startHour, endHour) {
  var container = $('#scale_timeline');

  for (i = 0; i < endHour - startHour + 1; i++) {
    container.append($('<div></div>', {
      'class': 'scale',
      css: {
        left: (HORIZONTAL_MARGIN + i * WIDTH_PER_MINUTE * 60) + 'px'
      }
    }).text(startHour + i));
  }
}

function drawRule(startHour, endHour, ruleCountPerHour) {
  var canvas = $('#ruled_view')[0]; // $('#ruled_view') returns an array
  if (!canvas || !canvas.getContext) {
    return false;
  }

  // resize
  canvas.width = HORIZONTAL_MARGIN * 2 + WIDTH_PER_MINUTE * 60 * (endHour - startHour);
  canvas.height = RULE_HEIGHT;

  var context = canvas.getContext('2d');

  var hourCount = endHour - startHour;

  // hour
  context.strokeStyle = '#aaaaaa';
  context.beginPath();
  for (i = 0; i < hourCount + 1; i++) {
    var x = HORIZONTAL_MARGIN + i * WIDTH_PER_MINUTE * 60;
    context.moveTo(x, 0);
    context.lineTo(x, RULE_HEIGHT);
  }
  context.stroke();

  // minute
  context.strokeStyle = '#eeeeee';
  context.beginPath();
  for (i = 0; i < hourCount; i++) {
    for (j = 1; j < ruleCountPerHour; j++) {
      var x = HORIZONTAL_MARGIN
        + i * WIDTH_PER_MINUTE * 60
        + j * (60 / ruleCountPerHour) * WIDTH_PER_MINUTE;
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }
  }
  context.stroke();
}

var currentLine;
var initialDate = getCurrentDate().getUTCDate();
function initializeCurrentLine() {
  currentLine = $('#current_line');
  currentLine.height(RULE_HEIGHT);
  setInterval(function execute() {  // setInterval without delay
    adjustCurrentLine();
    return execute;
  }(), CURRENT_LINE_UPDATE_INTERVAL);
}

function adjustCurrentLine() {
  currentLine.css(
    'left',
    getCurrentX() - currentLine.width() / 2
  );
}