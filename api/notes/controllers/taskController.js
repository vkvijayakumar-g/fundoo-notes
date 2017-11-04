  /**
  * task controller [it controls the all CRUD operations taken place in notes]
  * @path controller/taskController.js
  * @file taskController.js
  * Scripted by Vijayakumar
  */

  var cardModel = require('../models/cardSchema');
  var taskServices = require('../services/taskServices').taskServices;
  var taskServices = new taskServices();

  function taskController() {}

  /**
   * @method init() => Init this object
   **/
  taskController.prototype.init = function() {}

  /**
   * createNote [create a new Note]
   * @param  {[type]} req.body [contains the card title and content]
   * @param  {[type]} res [status messages]
   */
  taskController.prototype.createNote = function(req, res) {
    taskServices.createNote(req, function(err, data) {
      if (err) console.log(err);
      if (data) {
        res.redirect('/profile')
      }
    });
  }
  /**
   * listNotes [listing all the notes from database]
   * @param  {[type]} req.query [contains the card id]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.listNotes = function(req, res) {
    taskServices.listNotes(req, res, function(err, data) {
      if (err) console.log(err);

      else {
        res.send(data);
      }
    })
  }
  /**
   * scheduleRemainder [if there is remainder schedule it when server runs]
   * @param  {[type]} req.query [contains the user id ]
   * @param  {[type]} res [if scheduled send response data]
   */
  taskController.prototype.scheduleRemainder = function(req, res) {
    taskServices.scheduleRemainder(req, function(err, data) {
      if (err) console.log(err);

      else {
        res.send(data);
      }
    })
  }
  taskController.prototype.cancelRemainder = function(req, res)
  {
    console.log("controller",req.query);
    taskServices.cancelRemainder(req, function(err, data) {
      if (err) console.log(err);
      if(data)res.redirect('/profile');
    })
  }
  /**
   * [setting remainder of that particular note]
   * @param  {[type]} req.query [contains the cardId for which the remainder should set]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.setReminder = function(req, res) {
    taskServices.setReminder(req, function(err, data) {
      if (err) console.log(err);
      res.send(data)
    })
  }

  /**
   * [archiving the note]
   * @param  {[type]} req.query [contains the cardId]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.archiveNote = function(req, res) {
    taskServices.archiveNote(req, function(err, data) {
      if (err) console.log(err);
      if (data) {
        res.redirect('/archive');
      } else
        res.redirect('/profile');
    })
  }
  /**
   * [color of the note]
   * @param  {[type]} req.query [contains the cardId]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.noteColor = function(req, res) {
    taskServices.noteColor(req, function(err, data) {
      if (err) console.error(err);
      if (data) {
        res.redirect('/profile');
      } else
        res.redirect('/profile');
    })
  }
  /**
   * @method [remove url]
   * @param  {[type]} req.query [contains the cardId]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.removeCardURL = function(req, res) {
    taskServices.removeCardURL(req, function(err, data) {
      if (err) console.error(err);
      if (data) {
        res.redirect('/profile');
      } else
        res.redirect('/profile');
    })
  }

  /**
   * [archive the note which is pinned]
   * @param  {[type]} req.query [contains the cardId]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.archivepinNote = function(req, res) {
    taskServices.archivepinNote(req, function(err, data) {
      if (err) console.error(err);
      if (data) {
        res.redirect('/profile');
      } else
        res.redirect('/archive');
    });

  }
  /**
   * [pin the note which is important ]
   * @param  {[type]} req.query [contains the cardId]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.pinNote = function(req, res) {
    taskServices.pinNote(req, function(err, data) {
      if (err) console.error(err);
      if (data) {
        res.redirect('/profile');
      } else
        res.redirect('/profile');
    });

  }
  /**
   * [move the note to trash which is not important]
   * @param  {[type]} req.query [contains the cardId]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.deleteNote = function(req, res) {
    taskServices.deleteNote(req, function(err, data) {
      if (err) console.error(err);
      if (data) {
        res.redirect('/trash');
      } else
        res.redirect('/profile');
    })
  }
  /**
   * [uploading the image to the note]
   * @param  {[type]}   req.query  [description]
   * @param  {[type]}   res  [status message]
   */

  taskController.prototype.imageNote = function(req, res) {
    taskServices.imageNote(req, function(err, data) {
      if (err) console.log(err);
      if (data) {
        res.redirect('/profile');
      }
    })

  }
  /**
   * [updating the note details ]
   * @param  {[type]} req.query [contains the cardId]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.updateNote = function(req, res)
  {
    console.log("controller");
    taskServices.updateNote(req, function(err, data) {
      if (err) console.error(err);
      if (data)
        res.redirect('/profile');
    })

  }
  /**
   * [make a copy of the one note ]
   * @param  {[type]} req.query [contains the cardId to make a copy of that note]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.copyNote = function(req, res) {
    taskServices.copyNote(req, function(err, data) {
      if (err) console.error(err);
      if (data) {
        res.redirect('/profile');
      }
    })
  }

  /**
   * [sharing the same note with people]
   * @param  {[type]} req.query [contains the cardId]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.noteColloborator = function(req, res) {
    taskServices.noteColloborator(req, function(err, data) {
      if (err) console.log(err);
      if (data) {
        res.redirect('/profile');
      }
    })
  }
  taskController.prototype.getColloborators = function(req, res) {
    taskServices.getColloborators(req, function(err, data) {
      if (err) console.log(err);
      if (data) {
        res.send(data);
      }
    })
  }
  /**
   * [deleting the entire card from database]
   * @param  {[type]} req.query [contains the cardId]
   * @param  {[type]} res [status message]
   */
  taskController.prototype.removeNote = function(req, res) {
    taskServices.removeNote(req, function(err, data) {
      if (err) console.error(err);
      if (data) {
        res.redirect('/trash');
      } else
        res.redirect('/profile');
    })
  }
  /**
   * [autocomplete of the cards in database whenever we search]
   * @param  {[type]} req.query [description]
   * @param  {[type]} res [staus message]
   */
  taskController.prototype.autocomplete = function(req, res) {
    taskServices.autocomplete(req, res)
  }
  module.exports = {
    taskController: taskController
  };
