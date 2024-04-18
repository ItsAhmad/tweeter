$(document).ready(function() {
  $('.new-tweet textarea').on('input', function() {
      let $textarea = $(this);
      let inputValue = $textarea.val();
      let inputLength = inputValue.length;
      let charactersLeft = 140 - inputLength;

      let $counter = $('.new-tweet .counter');
      $counter.text(charactersLeft);

      if (charactersLeft < 0) {
          $counter.addClass('invalid'); 
      } else {
          $counter.removeClass('invalid'); 
      }
  });
});
