var visibilityModalWindowContainer = $('#visibility_modal_window_container');
var visibilityModalWindow = $('#visibility_modal_window');

var visibilityItems;
var visibilityList = $('#visibility_list');

function setVisibilityItems() {
  // set visibilityItems
  visibilityItems = [
    {
      'name': '授業',
      'heading': $('#classwork_title_container'),
      'content': $('#classwork_content')
    }, {
      'name': '図書館',
      'heading': $('#library_title_container'),
      'content': $('#library_content')
    }, {
      'name': '豊中の生協食堂',
      'heading': $('#restaurant_title_container').children().eq(0),
      'content': $('#restaurant_toyonaka_content')
    }, {
      'name': '吹田の生協食堂',
      'heading': $('#restaurant_title_container').children().eq(1),
      'content': $('#restaurant_suita_content')
    }, {
      'name': '箕面の生協食堂',
      'heading': $('#restaurant_title_container').children().eq(2),
      'content': $('#restaurant_minoh_content')
    }
  ];
  busData.forEach(function (element, index) {
    visibilityItems.splice(index + 1, 0, {
      'name': 'バス(' + element['section_name'] + ')',
      'heading': $('#bus_title_container').find('.row_title_edge').eq(index),
      'content': $('#bus_content').find('.bus_section_content').eq(index)
    });
  });
  visibilityItems.forEach(function (element, index) {
    element['isVisible'] = invisibles.indexOf(element['name']) == -1;
    if (element['isVisible']) {
        element['heading'].show();
        element['content'].show();
      } else {
        element['heading'].hide();
        element['content'].hide();
      }
  });

  // insert items in visibility list
  visibilityItems.forEach(function (element, index) {
    var li = $('<li></li>').appendTo(visibilityList);
    var div = $('<div></div>').addClass('visibility_li_div').appendTo(li);
    $('<span></span>').text(element['name']).appendTo(div);
    $('<input type="checkbox"/>').prop('checked', element['isVisible']).change(function () {
      var checked = this.checked;
      if (this.checked) {
        element['heading'].show();
        element['content'].show();
        deleteInvisible(element['name']);
      } else {
        element['heading'].hide();
        element['content'].hide();
        addInvisible(element['name']);
      }
      element['isVisible'] = this.checked;
    }).appendTo(div);
  });
}

function openVisibilityModalWindow() {
  openModalWindow(visibilityModalWindowContainer, '表示設定');
}