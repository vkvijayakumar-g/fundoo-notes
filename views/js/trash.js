$(document).ready(function() {
    $.ajax({
      url: '/getMsgNote',
      type: 'GET'
    }).done(function(result) {
      var len = result.length;
      for (i = 0; i < len; i++) {
        if (result[i].trash == true) {
          var newElement = document.createElement('div');
          newElement.setAttribute("name", "cardId");
          newElement.setAttribute("id", result[i].cardId);
          newElement.setAttribute("class", "col-sm-3");
          document.getElementById('card-row').appendChild(newElement);
          newElement.innerHTML = '<div class="w3-card-4" style="background-color:' + result[i].color + '">\
           <div class="w3-container">\
           <form action="/updateCard?cardId=' + result[i].cardId + '" method="post">\
          <div><input type="text" name="cardtitle"  id="cardtitle" class="card-title" width="30" value=' + result[i].title + ' autocomplete="off" placeholder="title" style="border:none; background-color:' + result[i].color + '"></div>\
           <br>\
           <div><input type="text" name="cardtext" id="cardtext" class="card-text" value=' + result[i].content + '  autocomplete="off" placeholder="content" style="border:none; background-color:' + result[i].color + '"></div>\
           <button id="btnupdate" type="submit" class="btn btn-primary" style="visibility: visible;">Done</button></a>\
           </form>\
           </div>\
           <footer class="w3-container" style="background:' + result[i].color + '">\
           <div class="inline">\
           <div class="dropdown">\
           <span class="more" data-toggle="dropdown"><img class="img" src="./images/more.svg" height="15"></span>\
           <ul class="dropdown-menu">\
             <li><a href="/removeNote?cardId=' + result[i].cardId + '">Delete forever</a></li>\
             <li><a href="/deleteNote?cardId=' + result[i].cardId + '&trash=' + false + '">Restore</a></li>\
           </ul>\
           </div>\
          </div>\
          </footer></div>'
        }
      }
    });

  })
