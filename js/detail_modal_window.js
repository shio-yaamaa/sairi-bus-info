var detailModalWindowContainer = $('#detail_modal_window_container');
var detailModalWindow = $('#detail_modal_window');

var detailTable = $('.detail_table');
var annotationUl = $('.annotation_ul');
var busTweetLink = $('#bus_tweet_link');

var updateRemainingTime;
var removeList = [];
var annotationVisibilities;

function openDetailModalWindow(object, type) {
  openModalWindow(
    detailModalWindowContainer,
    (type === TYPE_BUS ? '便名: ' : '') + object['name'] + (type === TYPE_LIBRARY ? '図書館' : '')
  );

  // get full names of the direction
  var directionFullNames;
  if (type === TYPE_BUS) {
    $.each(busData, function (sectionIndex, section) {
      $.each(section['directions'], function (directionIndex, direction) {
        if (direction['buses'].indexOf(object) !== -1) {
          directionFullNames = direction['direction_full_names'];
          return false; // = break;
        }
      });
      if (directionFullNames !== undefined) {
        return false;
      }
    });
  }

  // append table rows
  for (var i = 0; i < object['times'].length; i++) {
    if (object['times'][i] === -1) {
      continue;
    }
    var tableRow = $('<tr></tr>').appendTo(detailTable);
    tableRow.append($('<td></td>').text(
      type === TYPE_BUS
        ? directionFullNames[i]
        : BUSINESS_HOURS_NAMES[type][i]
    ));
    tableRow.append($('<td></td>').text(convertToStringForShow(object['times'][i])));
    tableRow.append($('<td></td>').text(getRemainingTime(object['times'][i])));

    removeList.push(tableRow);
  }

  updateRemainingTime = setInterval((function execute() {  // setInterval without delay
    setRemainingTime(object);
    return execute;
  }()), REMAINING_TIME_UPDATE_INTERVAL);

  // annotations
  if (type === TYPE_BUS) {
    annotationVisibilities = [];
    annotationVisibilities.push(object['two_buses']);
    annotationVisibilities.push(object['micro_disease']);
    annotationVisibilities.push(isHoliday);

    // twitter
    busTweetLink.attr(
      'href',
      createTweetLink(object)
    ).show();
  } else {
    annotationVisibilities = [false, false, false];

    busTweetLink.hide();
  }
  annotationUl.children().each(function (index, element) {
    if (annotationVisibilities[index]) {
      $(element).show();
    } else {
      $(element).hide();
    }
  });
}

function setRemainingTime(object) {
  detailTable.find('tr').has('td').each(function (index, element) {
    var offset = 0;
    if (object['times'][index] == -1) {
      offset++; // gap between td index and times index due to the direct buses
    }
    $(element).children().eq(2).text(getRemainingTime(object['times'][index + offset]));
  });
}