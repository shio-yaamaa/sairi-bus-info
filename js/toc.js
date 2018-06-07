var container = $('#toc');

// create a list
var ul = $('<ul></ul>').appendTo(container);

var tags = [
  {'name': 'h2', 'class': 'toc-0'},
  {'name': 'h3', 'class': 'toc-1'},
  {'name': 'h4', 'class': 'toc-2'},
  {'name': 'h5', 'class': 'toc-3'},
  {'name': 'h6', 'class': 'toc-4'}
];

var tagsString = tags.reduce(function (previousValue, currentValue, index) {
  return previousValue + (index == 0 ? '' : ',') + currentValue['name'];
}, '');

var idNumber = 0;

var headings = $(tagsString);

if (headings.length) {

  headings.each(function (index, element) {
    // search the matching tag
    var tag = tags.reduce(function (previousValue, currentValue) {
      return (previousValue == undefined && currentValue['name'] == element.tagName.toLowerCase())
        ? currentValue
        : previousValue;
    }, undefined);

    // set id
    idNumber++;
    var id = 'toc' + idNumber;
    $(element).attr('id', id);

    // create list item
    var li = $('<li></li>')
      .addClass(tag['class'])
      .appendTo(ul);

    // create span inside the list item in order to change the color independently
    var span = $('<span></span>')
      .addClass(tag['class'])
      .text($(element).text())
      .click(function () {
        $('html,body').animate({scrollTop: $(element).offset().top});
      })
      .appendTo(li);
  });

} else {
  container.hide();
}