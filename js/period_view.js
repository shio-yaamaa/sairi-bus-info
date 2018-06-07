// name can be null
function createPeriodView(object, type, color) {
  var withName = false;
  if (type === TYPE_CLASSWORK) {
    withName = true;
  }

  var wrapper = $("<div></div>", {
    "class": "period_view_wrapper",
    width: (object['times'][1] - object['times'][0]) * WIDTH_PER_MINUTE,
    css: {
      left: (HORIZONTAL_MARGIN + (object['times'][0] - START_TIME) * WIDTH_PER_MINUTE) + "px"
    }
  });

  // name
  if (withName) {
    wrapper.append($("<span></span>", {
      "class": "period_view_name"
    }).text(object['name']));
  }

  // band
  wrapper.append($("<div></div>", {
    "class": "period_band",
    css: {
      "background-color": color
    }
  }));

  wrapper.click(function () {
    openDetailModalWindow(object, type);
  });

  opacityDivs.push({
    "div": wrapper,
    "endTime": object['times'][1]
  });

  return wrapper;
}