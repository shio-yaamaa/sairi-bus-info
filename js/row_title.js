var container = $('#row_title_container');

function createRowTitle(className) {
  return $('<div></div>', {
    'class': 'row_title ' + className
  })
}

function createRowTitleEdge(edgeColor) {
  return $('<div></div>', {
    'class': 'row_title_edge',
    css: {
      'border-left-color': edgeColor
    }
  });
}

function createMainTitle(mainTitle, mainColor, withSubTitle) {
  return $('<div></div>', {
    'class': (withSubTitle ? 'row_main_title_with_sub_title' : 'row_main_title_without_sub_title'),
    css: {
      color: mainColor
    }
  }).text(mainTitle);
}

function createSubTitle(subTitle, subColor, height, alignMiddle, snackbarMessage) {
  return $('<div></div>', {
    'class': (alignMiddle ? 'row_sub_title_align_middle' : 'row_sub_title_no_align'),
    height: (height ? height : 'auto'),
    css: {
      color: subColor
    }
  })
  .text(subTitle)
  .click(function () {
    showSnackbar(snackbarMessage, SNACKBAR_SHORT)
  });
}

function createRowTitleWithoutSubTitle(mainTitle, mainColor, edgeColor, className) {
  var rowTitle = createRowTitle(className);
  var rowTitleEdge = createRowTitleEdge(edgeColor);
  rowTitle.append(rowTitleEdge);
  rowTitleEdge.append(createMainTitle(mainTitle, mainColor, false));
  
  return rowTitle;
}

// if all the sub titles are the same color, use String instead of Array
function createRowTitleWithSubTitle(mainTitle, mainColor, subTitles, subColors, edgeColor, className, alignMiddle, snackbarMessages) {
  var rowTitle = createRowTitle(className);
  var rowTitleEdge = createRowTitleEdge(edgeColor);
  rowTitle.append(rowTitleEdge);
  rowTitleEdge.append(createMainTitle(mainTitle, mainColor, true));

  for (i = 0; i < subTitles.length; i++) {
    rowTitleEdge.append(createSubTitle(
        subTitles[i],
        Array.isArray(subColors) ? subColors[i] : subColors,
        null,
        alignMiddle,
        snackbarMessages[i]
    ));
  }

  return rowTitle;
}

function createBusRowTitle(sectionNames, sectionColors, directionNames, directionColors, edgeColors, directionFullNames) {
  var rowTitle = createRowTitle('bus_row');

  for (section = 0; section < sectionNames.length; section++) {
    var sectionTitle = createRowTitleEdge(edgeColors[section]);
    rowTitle.append(sectionTitle);
    sectionTitle.append(createMainTitle(sectionNames[section], sectionColors[section], true));

    for (direction = 0; direction < directionNames[section].length; direction++) {
      sectionTitle.append(createSubTitle(
        directionNames[section][direction],
        directionColors[section][direction],
        false,
        false,
        directionFullNames[section][direction]
      ));
    }
  }

  return rowTitle;
}

function adjustBusRowTitleHeight(laneCounts, busLaneWidth) {
  console.log('busLaneWidth: ' + busLaneWidth);

  var flatLaneCounts = Array.prototype.concat.apply([], laneCounts);
  console.log(flatLaneCounts);
  $('#bus_title_container').find('.row_sub_title_no_align').each(function (index, element) {
    $(element).css('height', busLaneWidth * flatLaneCounts[index]);
  });
}