$(document).ready(function() {
  $.ajax({
    url: '/getMsgNote',
    type: 'GET',
  }).success(function(result) {
    var len = result.length;
    for (i = 0; i < len; i++) {
      if (result[i].trash == false && result[i].isarchive == false) {
        if (result[i].ispin == false && result[i].image == null) {
          var pinImage = "pin.svg"
          var height = "20%"
          appendCard(result[i], i, "none", null, "card-row", true, pinImage, "none", height);
        }
        if (result[i].ispin == false && result[i].image != null) {
          var pinImage = "pin.svg"
          var height = "35%"
          appendCard(result[i], i, "none", null, "card-row", true, pinImage, "block", height);
        }
        if (result[i].ispin == true && result[i].image == null) {
          var pinImage = "push-pin.svg"
          var height = "20%"
          appendCard(result[i], i, "block", "Others", "pincard-row", false, pinImage, "none", height);
        }
        if (result[i].ispin == true && result[i].image != null) {
          var pinImage = "push-pin.svg"
          var height = "35%"
          appendCard(result[i], i, "block", "Others", "pincard-row", false, pinImage, "block", height);
        }

      }
    }
  }).complete(function(result) {
    var scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = './js/datetimepicker.js';
    document.head.appendChild(scriptElement);
    $(document).on("click", "div.w3-container.cards", function()
    {

    $('#updateCard').modal('toggle');
    $('#updateCard').modal('show');
    var id=$(this).offsetParent().attr('id');
    var cardtitle=$(this).find('.card-title').text();
    var cardtext=$(this).find('.card-text').text();
    $('#updateCard').on('shown.bs.modal',function()
    {
    $('#card-title').attr('value',cardtitle);
    $('#card-text').attr('value',cardtext);
    $('#cardForm').attr('action',"/updateNote?cardId="+id+"");
    })
    });
    $.ajax({
      url: '/getMsgNote',
      type: 'GET',
    }).done(function(result) {
        var ownermail=$('#usermail').text();
        if (result != null) {
        var len = result.length;
        for (i = 0; i < len; i++) {
        //   if (result[i].collobarator.length > 1);
        //   {
        //     // document.getElementById('colloborator_images' + i + '').style.display = "block";
        //     var collength = result[i].collobarator.length;
        //     for (j = 0; j < collength; j++)
        //     {
        //       if(result[i].collobarator[j].userEmail!=ownermail)
        //       {
        //       document.getElementById('colloborator_images' + i + '').innerHTML += '<div>\
        //       <img class="img" src="' + result[i].collobarator[j].userImage + '" height="20"></span>'
        //       document.getElementById('colloborated_users' + i + '').innerHTML += '<div>\
        //       <img class="img-circle" src="' + result[i].collobarator[j].userImage + '" height="40"/></div>\
        //       <div ><b>' + result[i].collobarator[j].userName + '</b>\
        //       <br>' + result[i].collobarator[j].userEmail + '\
        //       </div><br>'
        //       }
        //
        //     }
        //   }
          if (result[i].url.length>=1)
          {
              var urllen = result[i].url.length;
              for (j = 0; j < urllen; j++)
              {
                document.getElementById('metadata'+i+'').innerHTML += '<div class="url"><div class="url-image">\
                  <img class="img-circle" src="' + result[i].url[j].image + '" height="40"/></div>\
                  <a target="_blank" href="' + result[i].url[j].url +'"><span class="url-link"><img class="img" src="./images/hyperlink.png" height="15"></span></a>\
                  <div class="url-content">' + result[i].url[j].title + '\
                  <br>' + result[i].url[j].url + '\
                  </div><div class="dropdown url-more">\
                  <span class="more" data-toggle="dropdown"><img class="img" src="./images/more.svg" height="10"></span>\
                  <ul class="dropdown-menu metaurl">\
                    <li><a href="/removeurl?cardId=' + result[i].cardId + '&url='+ result[i].url[j].url +'">Remove</a></li>\
                  </ul>\
                  </div>\</div>\
                  <br>'
              }
            }
            if(result[i].remainder.day!=null)
            {
              document.getElementById('remainders'+i+'').innerHTML+='<div>\
                <h4><span class="label label-default"><span>\
                <img class="img timeIcon" src="./images/time.png" height="15" >'+result[i].remainder.hour+':'+result[i].remainder.minutes+'</span>\
                <a href="/cancelRemainder?cardId=' + result[i].cardId + '"><span ><img class="img" src="./images/cancel.png" height="20"></span></a>\
                </span>\
                </h4>\
                </div>'
            }
        }

      }
    })
  });
});
function sharedBy(userid)
{
  $.ajax({
    url:'/getOwner',
    type:'POST',
    data:{
      'userid':userid
    }
  }).done(function(result)
{
console.log("sucess");
})
}

function converturl(text) {
  if (text == null) return text;
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  var text1 = text.replace(exp, "<a target='_blank' href='$1'>$1</a>");
  var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  return (text1.replace(exp2, '$1<a class="card-data" target="_blank" href="http://$2">$2</a>'));
}

function appendCard(result, i, pindisplay, title, divId, boolean, pinnedImage, imageDisplay, height) {
  document.getElementById('pin').style.display = pindisplay;
  $('#pin-title').text('Pinned');
  if (title != null) {
    $('#unpin-title').text(title);
  }
  var cardtitle = converturl(result.title)
  var cardtext = converturl(result.content);
  var newElement = document.createElement('div');
  newElement.setAttribute("name", "cardId");
  newElement.setAttribute("id", result.cardId);
  newElement.setAttribute("class", "col-sm-3");
  document.getElementById(divId).appendChild(newElement);
  newElement.innerHTML = '<div class="w3-card-4" style="height:' + height + '; background-color:' + result.color + '">\
     <header class="w3-container">\
       <a href="/pinNote?cardId=' + result.cardId + '&ispin=' + boolean + '"<span class="pin inline"><img class="img" src="./images/' + pinnedImage + '" height="20"></span></a>\
       <div class="card-image" style="display:' + imageDisplay + '">\
       <img src="./images/cardimages/' + result.image + '"></img>\
       </div>\
     </header>\
     <div class="w3-container cards">\
     <div name="cardtitle"  id="cardtitle" class="card-title" width="30" autocomplete="off" placeholder="title" style="border:none; background-color:' + result.color + '">' + cardtitle + '</div>\
     <div name="cardtext" id="cardtext" class="card-text" autocomplete="off" placeholder="content" style="border:none; background-color:' + result.color + '">' + cardtext + '</div>\
     <div id="colloborator_images' + i + '" class="colloborator_images" style="display:none"></div>\
     </div>\
     <div id="remainders'+i+'" class="remainders"></div><br>\
     <footer class="w3-container" style="background:' + result.color + '">\
     <div class="inline">\
     <div class="dropdown" id="remainder" >\
      <span data-toggle="dropdown" ><img class="img-square" src="./images/remindericonsidebar.svg" height="15"></span>\
       <ul class="dropdown-menu datetime ">\
         <div>Reminder:</div>\
         <div>Later Today&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8:00PM</div>\
         <div>Tomorrow &emsp;&ensp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8:00AM</div>\
         <div>Next Week &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Mon,8:00AM</div>\
         <div>Date:<input id="datepairdate" type="text" class="datepairdate" /></div>\
         <div>Time:<input id="datepairtime" type="text" class="datepairtime" /></div>\
         <button type="submit" onclick="call(\'' + result.cardId + '\')">done</button>\
      </ul>\
    </div>\
     </div>\
     &nbsp;\
     <div class="inline">\
     <a href="#" data-toggle="modal", data-target=".colloborator' + i + '">\
     <span><img class="img" src="./images/addIcon.png" height="20"></span></a>\
     <div class="modal colloborator' + i + '" role="dialog">\
       <div class="modal-dialog">\
           <div class="modal-content">\
            <div class="modal-body">\
              <button type="button" class="close" data-dismiss="modal">&times;</button>\
              <div><img id="ownerImage" class="img-circle" src="' + $('#profilePic').attr('src') + '" height="40"/></div>\
              <div id="owner"><b>' + $('#username').text() + '</b>(Owner)\
              <br>' + $('#usermail').text() + '\
              </div><br>\
              <div id="colloborated_users' + i + '" class="colloborated_users" style="display:block"></div>\
              <div><input id="people" class="people" type="text" style="border:none;"/><br></div>\
              <button type="submit" id="colloborator" onclick="colloborator(\'' + result.cardId + '\')">done</button>\
             </div>\
           </div>\
       </div>\
     </div>\
     </div>\
     &nbsp;\
     <div class="inline">\
     <div class="dropdown">\
      <span data-toggle="dropdown"><img class="img" src="./images/color-palette.png" height="20"></span></a>\
      <ul class="dropdown-menu color-palette" style="max-width:80px;">\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23FFFFFF"><span class="col-sm-2"><img class="img" src="./images/moonwhite.png" height="20"></span></a>&emsp;\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23FF8A80"><span class="col-sm-2"><img class="img" src="./images/red.png" height="20"></span></a>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23FFD180"><span class="col-sm-2"><img class="img" src="./images/orange.png" height="20"></span></a>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23FFFF8D"><span class="col-sm-2"><img class="img" src="./images/yellow.png" height="20"></span></a>\
      <br>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23CCFF90"><span class="col-sm-2"><img class="img" src="./images/green.png" height="20"></span></a>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23A7FFEB"><span class="col-sm-2"><img class="img" src="./images/teal.png" height="20"></span></a>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%2380D8FF"><span class="col-sm-2"><img class="img" src="./images/blue.png" height="20"></span></a>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%2382B1FF"><span class="col-sm-2"><img class="img" src="./images/darkblue.png" height="20"></span></a>\
      <br>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23B388FF"><span class="col-sm-2"><img class="img" src="./images/purple.png" height="20"></span></a>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23F8BBD0"><span class="col-sm-2"><img class="img" src="./images/pink.png" height="20"></span></a>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23D7CCC8"><span class="col-sm-2"><img class="img" src="./images/brown.png" height="20"></span></a>\
      <a href="/noteColor?cardId=' + result.cardId + '&colorcode=%23CFD8C8"><span class="col-sm-2"><img class="img" src="./images/grey.png" height="20"></span></a>\
      </ul>\
      </div>\
     </div>\
     &nbsp;\
     <div class="inline">\
     <div class="dropdown">\
     <span class="more" data-toggle="dropdown"><img class="img" src="./images/picture.png" height="15"></span>\
     <ul class="dropdown-menu">\
     <form id="frmUploader" enctype="multipart/form-data" action="/imageNote?cardId=' + result.cardId + '" method="post">\
         <input type="file" name="imgUploader" multiple />\
         <input type="submit" name="submit" value="Upload" />\
     </form>\
      </ul>\
     </div>\
    </div>\
     &nbsp;\
     <div class="inline">\
     <a href="/archiveNote?cardId=' + result.cardId + '&isArchive=' + true + '">\
       <span><img class="img" src="./images/sidebarArchive.svg" height="20"></span></a>\
     </div>\
      &nbsp;\
     <div class="inline">\
     <div class="dropdown">\
     <span class="more" data-toggle="dropdown"><img class="img" src="./images/more.svg" height="15"></span>\
     <ul class="dropdown-menu">\
       <li><a href="/deleteNote?cardId=' + result.cardId + '&trash=' + true + '">Delete note</a></li>\
       <li><a href="/addlabel?cardId=' + result.cardId + '">Add label</a></li>\
       <li><a href="/copyNote?cardId=' + result.cardId + '">Make a copy</a></li>\
     </ul>\
     </div>\
    </div>\
    </footer></div>\
    <div class="w3-container footer-url" style="background:' + result.color + ';"><footer id="metadata'+i+'"></footer></div>'
}
