/* global $ */

/* global TYPE_CLASSWORK */
/* global TYPE_LIBRARY */
/* global TYPE_RESTAURANT */

/* global DEFAULT_TEXT_COLOR */
/* global CLASSWORK_COLOR */
/* global BUS_COLORS */
/* global LIBRARY_COLOR */
/* global RESTAURANT_COLORS */

/* global convertToStringsForShow */

/* global entryTimeRange */
/* global setClassworkFinished */
/* global setBusFinished */
/* global setLibraryFinished */
/* global setRestaurantFinished */

/* global createRowTitleWithoutSubTitle */
/* global createRowTitleWithSubTitle */
/* global createBusRowTitle */
/* global adjustBusRowTitleHeight */

/* global createPeriodView */
/* global createBusView */

/* global createSectionColors */
/* global createDirectionColors */

// classwork
var classworkData;
$.getJSON(
  '../php/send_classwork_data.php',
  null,
  function (data) {
    classworkData = data;
    console.log('class data is retrieved');

    // row title
    $('#classwork_title_container').append(createRowTitleWithoutSubTitle(
      '授業', DEFAULT_TEXT_COLOR, CLASSWORK_COLOR, 'classwork_row')
    );

    // entry time
    $.each(data, function (index, classwork) {
      entryTimeRange(classwork['times'][0], classwork['times'][1]);
    });

    setClassworkFinished();
  }
).fail(() => console.log('failed to obtain classwork data'));

function showClasswork() {
  console.log('showClasswork called');
  $.each(classworkData, function (index, classwork) {
    $('#classwork_content').append(
      createPeriodView(classwork, TYPE_CLASSWORK, CLASSWORK_COLOR)
    );
  });
}

// bus
var busData;
var laneCounts = [];
$.getJSON(
  '../php/send_bus_data.php',
  null,
  function (data, status) {
    console.log(data);
    busData = data;

    // number of lanes
    $.each(data, function (sectionIndex, section) {
      laneCounts.push([]);
      $.each(section['directions'], function (directionIndex, direction) {
        laneCounts[sectionIndex].push(direction['buses'].reduce(function (previous, current) {
          return Math.max(previous, current['lane'] + 1);
        }, 0));
      });
    });

    console.log(laneCounts);

    // row title
    $('#bus_title_container').append(createBusRowTitle(
      data.map(function (section) {
        return section['section_name'];
      }),
      createSectionColors(data.length),
      data.map(function (section) {
        return section['directions'].map(function (direction) {
          return direction['direction_name'];
        });
      }),
      createDirectionColors(data.length, data.map(function (section) {
        return section['directions'].length;
      })),
      createSectionColors(data.length),
      data.map(function (section) {
        return section['directions'].map(function (direction) {
          return direction['direction_full_names'].join(' → ');
        });
      })
    ));

    // entry time
    $.each(data, function (sectionIndex, section) {
      $.each(section['directions'], function (directionIndex, direction) {
        $.each(direction['buses'], function (busIndex, bus) {
          entryTimeRange(bus['times'][0], bus['times'][bus['times'].length - 1]);
        });
      });
    });

    setBusFinished();
  }
).fail(() => console.log('failed obtaining bus data'));

function showBus() {
  $.each(busData, function (sectionIndex, section) {
    var sectionContainer = $('<div></div>', {
      'class': 'bus_section_content'
    });
    $('#bus_content').append(sectionContainer);

    $.each(section['directions'], function (directionIndex, direction) {
      var directionContainer = $('<div></div>', {
        'class': 'bus_direction_content'
      });
      sectionContainer.append(directionContainer);

      for (var lane = 0; lane < laneCounts[sectionIndex][directionIndex]; lane++) {
        directionContainer.append($('<div></div>', {
          'class': 'bus_lane'
        }));
      }

      $.each(direction['buses'], function (busIndex, bus) {
        directionContainer.children().eq(bus['lane'])
          .append(createBusView(bus, BUS_COLORS[sectionIndex]['direction'][directionIndex]));
      })
    });
  });

  adjustBusRowTitleHeight(laneCounts, $('.bus_lane').height());
}

// library
var libraryData;
$.getJSON(
  '../php/send_library_data.php',
  null,
  function (data, status) {
    libraryData = data;

    // row title
    $('#library_title_container').append(createRowTitleWithSubTitle(
      '図書館',
      LIBRARY_COLOR,
      data.map(function (library) {
        return library['name'];
      }),
      DEFAULT_TEXT_COLOR,
      LIBRARY_COLOR,
      "library_row",
      true,
      data.map(function (library) {
        return library['name'] + '図書館 ' + convertToStringsForShow(library['times']);
      })
    ));

    // entry time
    $.each(data, function (index, library) {
      entryTimeRange(library['times'][0], library['times'][1]);
    });

    setLibraryFinished();
  }
);

function showLibrary() {
  $.each(libraryData, function (index, library) {
    var wrapper = $('<div></div>', {
      'class': 'sub_content'
    });
    $('#library_content').append(wrapper);
    wrapper.append(createPeriodView(library, TYPE_LIBRARY, LIBRARY_COLOR));
  });
}

// restaurant
var restaurantData;
$.getJSON(
  '../php/send_restaurant_data.php',
  null,
  function (data, status) {
    restaurantData = data;

    $.each(data, function (campusIndex, campus) {
      // row title
      $('#restaurant_title_container').append(createRowTitleWithSubTitle(
        campus['campus_name'],
        RESTAURANT_COLORS[campusIndex],
        campus['restaurants'].map(function (restaurant) {
          return restaurant['name'];
        }),
        DEFAULT_TEXT_COLOR,
        RESTAURANT_COLORS[campusIndex],
        'restaurant_row',
        true,
        campus['restaurants'].map(function (restaurant) {
          return restaurant['name'] + "\n" + convertToStringsForShow(restaurant['times']);
        })
      ));

      // entry time
      $.each(campus['restaurants'], function (restaurantIndex, restaurant) {
        entryTimeRange(restaurant['times'][0], restaurant['times'][1]);
      });
    });

    setRestaurantFinished();
  }
);

function showRestaurant() {
  var contentContainers = [
    $('#restaurant_toyonaka_content'),
    $('#restaurant_suita_content'),
    $('#restaurant_minoh_content')
  ];

  $.each(restaurantData, function (campusIndex, campus) {
    $.each(campus['restaurants'], function (restaurantIndex, restaurant) {
      var wrapper = $('<div></div>', {
        'class': 'sub_content'
      });
      contentContainers[campusIndex].append(wrapper);
      wrapper.append(createPeriodView(restaurant, TYPE_RESTAURANT, RESTAURANT_COLORS[campusIndex]));
    });
  });
}