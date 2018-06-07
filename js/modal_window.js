var modalWindowBackground = $('#modal_window_background');

// set click listeners
$('.modal_window_container').click(function (event) {
  if (event.target === this) {  // background is directly clicked
    closeModalWindow($(this));
  }
});

$('.modal_window_title_bar').find('i').click(function () {
  closeModalWindow($(this).closest('.modal_window_container'));
});

function openModalWindow(modalWindowContainer, title) {
  // disable background scrolling
  $('body').css('overflow', 'hidden');

  // set title
  modalWindowContainer.find('.modal_window_title').text(title);

  // show
  modalWindowBackground.fadeIn(100);
  modalWindowContainer.fadeIn(100);
  modalWindowContainer.css('display', 'flex');
}

function closeModalWindow(modalWindowContainer) {
  modalWindowContainer.fadeOut(100);
  modalWindowBackground.fadeOut(100);

  // stop updating
  clearInterval(updateRemainingTime);

  // remove elements
  $.each(removeList, function (index, element) {
    element.remove();
  });
  removeList = [];

  // enable background scrolling
  $('body').css('overflow', 'auto');
}