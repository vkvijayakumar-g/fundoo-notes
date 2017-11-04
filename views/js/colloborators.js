$(document).ready(function()
{
  $.ajax({
    url: '/scheduleRemainder',
    type: 'GET'
  }).done(function(result) {
    console.log(result);
  });
function colloborator(cardId)
{
  console.log($("#people").val());
  $('.modal').modal('hide');
  $.ajax({
    url:'/noteColloborator',
    type:'POST',
    data:
    {
      'cardId':cardId,
      'colloboratorMail':$("#people").val()
    }
  }).done(function(result)
{
  console.log("added");
})
}
});
