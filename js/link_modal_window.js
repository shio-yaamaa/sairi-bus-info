var linkModalWindowContainer = $('#link_modal_window_container');
var linkModalWindow = $('#link_modal_window');

var linkList = $('#link_list');

// insert items in link list
links.forEach(function (element, index) {
  var li = $('<li></li>').appendTo(linkList);
  var a = $('<a></a>').attr({
    'href': element['url'],
    'target': '_blank'
  }).appendTo(li);
  var div = $('<div></div>').addClass('link_li_div').appendTo(a);
  $('<span></span>').text(element['name']).appendTo(div);
});

function openLinkModalWindow() {
  openModalWindow(linkModalWindowContainer, 'リンク');
}