$(document).ready(function() {
    $('#pdfLink').click(function(e) {
      e.preventDefault();
      $('#pdfPopup').fadeIn();
    });
  
    $('#pdfPopup').click(function() {
      $(this).fadeOut();
    });
  
    $('#pdfContainer').click(function(e) {
      e.stopPropagation();
    });
  });
  