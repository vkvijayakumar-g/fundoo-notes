$(document).ready(function() {
  $('.datepairtime').timepicker({
    'showDuration': true,
    'timeFormat': 'h:ia',

  });

  $('.datepairdate').datepicker({
    'format': 'd-m-yyyy',
    'autoclose': true,

  });

  $("#search-bar").autocomplete({
    source: "/autocomplete",
    minLength: 1
  });

})
