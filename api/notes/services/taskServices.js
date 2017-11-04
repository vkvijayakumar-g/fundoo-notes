  var cardModel = require("../models/cardSchema");
  var userModel = require("./../../users/models/userSchema");
  var urlScrapping = require('./contentScrappingServices.js');
  var noteImage = require('./noteImageServices.js');
  var remainderSchedule = require('./scheduleServices.js');
  var elasticsearch = require('./elasticsearchServices.js');

  function taskServices() {}

  /**
   * @method init() => Init this object
   **/
  taskServices.prototype.init = function() {}

  /**
   * @method [createNote services]
   * @param  {object}   req      [req contains the new data]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.createNote = function(req, callback) {
    var newdata = {

      userid: req.user.userId,
      title: req.body.title,
      content: req.body.message,
    };
    /*
      creating a new card
     */
    cardModel.createCard(newdata, function(err, data) {
      if (err) console.log(err);
      if (data) {
        var query = {
          'cardId': data.cardId
        };
        /*
        checking whether url is present scrapping is done
         */
         var content = urlScrapping.scrapurl(req.body.message)
         for(i=0; i<content.length; i++)
         {
           var urldata = urlScrapping(content[i])
           urldata.then(function(metadata) {
             if (metadata != null)
             {
               cardModel.addUrl(query, metadata, function(err, data) {
               if (err) {
                 callback(err, null)
                 }
               });
             }
         }).catch(function(err) {
           if (err) callback(err, null)
         })
       }
         callback(null, 'done');
      }
    })
  };
  /**
   * @method [listing all cards]
   * @param  {object}   req      [description]
   * @param  {[type]}   res      [sending the response hits to main page]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.listNotes = function(req, res, callback) {
    var query = {$or:[{'userid':req.user.userId},{'collobarator':{ $elemMatch: { 'userEmail':req.user.local.email } }}]
    };
    cardModel.getCards(query, function(err, data) {
      if (err) callback(err, null)

      else {
        elasticsearch.createIndex(req, res);
        callback(null, data)
      }
    })
  }
  /**
   * [scheduling the remainders]
   * @param  {object}   req      [contains the cardId]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.scheduleRemainder = function(req, callback) {
    var query = {
      'userid': req.user.userId
    };
    cardModel.getCards(query, function(err, data) {
      if (err) callback(err)
      remainderSchedule.scheduleRemainder(data)
    })
  }
  taskServices.prototype.cancelRemainder = function(req, callback) {
    var query = {
      'cardId': req.query.cardId
    };
    console.log("services",query);
    var update={
      'remainder.day':null,
      'remainder.month':null,
      'remainder.year':null,
      'remainder.hour':null,
      'remainder.minutes':null,
      'remainder.seconds':null
    }
    remainderSchedule.cancelRemainder(req.query.cardId)
    cardModel.updateCard(query,update, function(err, data)
    {
      if (err) callback(err,null)
      console.log(data);
      if(data)callback(null,'done');
    })
  }
  /**
   * @method [setting the remainder data]
   * @param  {object}   req      [contains the cardId & date,time values]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.setReminder = function(req, callback) {
    var query = {
      "cardId": req.body.cardId
    };
    var update = {
      $set: {
        'remainder.day': req.body.day,
        'remainder.month': req.body.month,
        'remainder.year': req.body.year,
        'remainder.hour': req.body.hour,
        'remainder.minutes': req.body.minutes,
        'remainder.seconds': req.body.seconds,
      }
    };
    cardModel.updateCard(query, update, function(err, data) {
      if (err) callback(err, null)
      if (data)
        callback(null, {
          status: true
        });
      else
        callback(null, {
          status: false
        })
    })
  }

  /**
   * @method [archiving the note]
   * @param  {object}   req      [contains the cardId and boolean value to archive /unarchivce]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.archiveNote = function(req, callback) {
    var query = {
      "cardId": req.query.cardId
    };
    var update = {
      $set: {
        'isarchive': req.query.isArchive,
      }
    };
    cardModel.updateCard(query, update, function(err, data) {
      if (err) callback(err, null)
      else {
        callback(null, 'done')
      }
    })
  }
  /**
   * @method [noteColor]
   * @param  {object}   req      [contains the cardId and color code of the card]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.noteColor = function(req, callback) {
    var query = {
      "cardId": req.query.cardId
    };
    var update = {
      $set: {
        'color': req.query.colorcode,
      }
    };
    cardModel.updateCard(query, update, function(err, data) {
      if (err) callback(err, null)
      else {
        callback(null, 'done')
      }
    });
  }
  /**
   * @method archive the pinned note
   * @param  {object} req.query [pin and archive value in boolean, cardId]
   * @param  {Function} callback [sends back err/data on completion]
   */

  taskServices.prototype.archivepinNote = function(req, callback) {
    var query = {
      "cardId": req.query.cardId
    };
    var update = {
      $set: {
        'isarchive': req.query.isArchive,
        'ispin': req.query.ispin
      }
    };
    cardModel.updateCard(query, update, function(err, data) {
      if (err) callback(err, null)
      else {
        callback(null, 'done');
      }
    });
  }
  /**
   * @method Pinned the note
   * @param  {object} req.query [pin value in boolean, cardId]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.pinNote = function(req, callback) {
    console.log("services pinning");
    var query = {
      "cardId": req.query.cardId
    };
    var update = {
      $set: {
        'ispin': req.query.ispin
      }
    };

    cardModel.updateCard(query, update, function(err, data) {
      if (err) callback(err, null)

      else {
        callback(null, 'done')
      }
    });
  }

  /**
   * @method moving the card to trash
   * @param  {object} req.query [deleteCard value in boolean, cardId]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.deleteNote = function(req, callback) {
    var query = {
      "cardId": req.query.cardId
    };
    var update = {
      $set: {
        'trash': req.query.trash
      }
    };

    cardModel.updateCard(query, update, function(err, data) {
      if (err) callback(err, null)

      else {
        callback(null, 'done');
      }
    });
  }
  /**
   * @method removeCardURL to remove the particular url metadata from database
   * @param  {object} req.query [contains url, cardId]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.removeCardURL = function(req, callback) {
    var query = {
      "cardId": req.query.cardId
    };
    var url=req.query.url;
    cardModel.removeURL(query,url, function(err, data) {
      if (err) callback(err, null)

      else {
        callback(null, 'done');
      }
    });
  }
  /**
   * @method adding image to note
   * @param  {object}   req      [contains the cardId to which image going to upload]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.imageNote = function(req, callback) {
    noteImage(req, function(err, result) {
      if (err) {
        callback(err, null)
      } else {
        callback(null, 'done')
      }
    });
  }

  /**
   * @method updating the content in notes
   * @param  {object}   req      [contains the cardId]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.updateNote = function(req, callback)
  {
    var query = {
      "cardId": req.query.cardId
    };
    var update = {
      $set: {
        'title': req.body.cardtitle,
        'content': req.body.cardtext
      }
    };
    cardModel.updateCard(query, update, function(err, data) {
      if (err) console.error(err);
      if (data) {
        var content = urlScrapping.scrapurl(req.body.cardtext)
        for(i=0; i<content.length; i++)
        {

          cardModel.checkurl(query,content[i],function(err,data)
        {
          if(err)console.log(err);
          if(data)
          {
            callback(null, 'done');
          }
          if(data==null) {
            var urldata = urlScrapping(content[i])
            urldata.then(function(metadata) {
              if (metadata != null)
              {
                cardModel.addUrl(query, metadata, function(err, data) {
                if (err) {
                  callback(err, null)
                  }
                });
              }
          }).catch(function(err) {
            if (err) callback(err, null)
          })
          }
        })
      }
        callback(null, 'done');
      }
    });
  }
  /**
   * @method making the copy of one note
   * @param  {object}   req      [contains the cardId of which copy to be created]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.copyNote = function(req, callback) {
    var query = {
      "cardId": req.query.cardId
    };

    cardModel.copyCard(query, function(err, data) {
      if (err) callback(err, null)

      else {
        callback(null, 'done');
      }
    });
  };

  /**
   * @method removing the note comkpletely from database
   * @param  {object}   req      [contains the cardId of the card to remove]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.removeNote = function(req, callback) {
    var query = {
      "cardId": req.query.cardId
    };
    cardModel.removeCard(query, function(err, data) {
      if (err) callback(err, null)

      else {
        callback(null, 'done');
      }
    });
  }
  /**
   * @method sahring the note to someone
   * @param  {object}   req      [contains the cardId of the card to share]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.noteColloborator = function(req, callback) {
    var query = {
      'cardId': req.body.cardId
    };
    var user = {
      'local.email': req.body.colloboratorMail
    }
    console.log(user);
    userModel.findUser(user, function(err, data) {
      if (err) console.log(err);
      if (data) {
        console.log(data);
        var update = {
          userEmail: data.local.email,
          userName: data.userName,
          userImage: data.userImage
        }
        cardModel.addPeople(query, update, function(err, data) {
          if (err) callback(err, null)

          else {
            callback(null, 'done');
          }

        })
      }
    })
  }
  /**
   * @method getColloborators getting cardss
   * @param  {object}   req      [description]
   * @param  {[type]}   res      [sending the response hits to main page]
   * @param  {Function} callback [sends back err/data on completion]
   */
  taskServices.prototype.getColloborators = function(req, callback) {
    var query = {
      'userid': req.user._id
    };
    cardModel.getCards(query, function(err, data) {
      if (err) callback(err, null)

      else {
        callback(null, data)
      }
    })
  }
  taskServices.prototype.autocomplete = function(req, res) {
    elasticsearch.autocomplete(req, res);
  }

  module.exports = {
    taskServices: taskServices
  };
