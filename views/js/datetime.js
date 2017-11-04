function call(id) {
  console.log("coming");
  var date = $('.datepairdate').datepicker('getDate');
  var time = $(".datepairtime").val();
  var hours = time.slice(0, 2);
  var minutes = time.slice(3, 5);
  var ampm = time.slice(5, 8);
  if (ampm == "pm" && hours < 12) hours = parseInt(hours) + 12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  $.ajax({
    url: '/setReminder',
    type: 'POST',
    data: {
      cardId: id,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hour: hours,
      minutes: minutes,
      seconds: '00'
    }
  }).done(function(result) {
    if (result.status == true) {
      window.location.href = '/profile'
    }
    if (result.status == false) {
      alert("remainder not set ")
    }
  });
}