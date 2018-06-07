function createBusView(object, color) {
  var wrapper = $('<div></div>', {
    'class': 'bus_wrapper',
    width: (object['times'][object['times'].length - 1] - object['times'][0]) * WIDTH_PER_MINUTE,
    css: {
      left: HORIZONTAL_MARGIN + (object['times'][0] - START_TIME) * WIDTH_PER_MINUTE
    }
  });

  // line
  wrapper.append($('<div></div>', {
    'class': 'bus_line',
    css: {
      'background-color': color
    }
  }));

  // circles
  $.each(object['times'], function(index, element) {
    if (element === -1) {
      return true;  // = continue;
    }
    wrapper.append($('<div></div>', {
      'class': 'bus_circle',
      css: {
        left: ((element - object['times'][0]) * WIDTH_PER_MINUTE) + 'px',
        'background-color': color
      }
    }).text((object['two_buses'] && index == 0) ? '2' : ''));
  });

  // Research Institute for Microbial Diseases
  if (object['micro_disease']) {
    wrapper.append($('<div></div>', {
      'class': 'micro_disease',
      css: {
        'border-color': color
      }
    }));
  }

  wrapper.click(function () {
    openDetailModalWindow(object, TYPE_BUS);
  });

  opacityDivs.push({
    'div': wrapper,
    'endTime': object['times'][object['times'].length - 1]
  });

  return wrapper;
}