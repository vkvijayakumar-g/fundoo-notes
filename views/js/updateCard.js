function update() {
  $.ajax({
    url: '/updateCard',
    type: 'POST',
    data: {
      cardId: $("#cardId").val(),
      cardtitle: $("#cardtitle").val(),
      cardtext: $("#cardtext").val()
    }
  }).done(function(result) {
    if (result.status == true) {
      console.log("changing");
      window.location.href = '/profile'
    }
    if (result.status == false) {
      alert("error occured");
    }
  })
}