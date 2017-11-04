  /**
   * Routing refers to determining how an application responds to a client request for a
   * specific endpoint, which is a URI (or path) and a specific HTTP request method (GET,
   * POST, and so on).
   *
   * Each of our routes has different route handler functions, which are executed when
   * the route is matched.
   *
   * As you can see, we required the controller so each of the routes methods can call
   * it’s respective handler function.
   *
   * taskRoutes refers to the routing the client request to specific endpoint based on
   * clients task
   * @path routes/taskRoutes.js
   * @file taskRoutes.js
   * Scripted by Vijayakumar
   */

  /*
    Module dependencies
   */
  var express = require('express');
  var router = express.Router();
  var auth = require('../services/authenticate.js').auth;

  var taskController = require('../controllers/taskController').taskController;
  taskCntrl = new taskController();
  taskCntrl.init();

  router.post('/createNote', auth, taskCntrl.createNote);
  router.get('/getMsgNote', auth, taskCntrl.listNotes)
  router.get('/archiveNote', auth, taskCntrl.archiveNote);
  router.get('/noteColor', auth, taskCntrl.noteColor);
  router.get('/archivepinNote', auth, taskCntrl.archivepinNote);
  router.get('/pinNote', auth, taskCntrl.pinNote)
  router.get('/deleteNote', auth, taskCntrl.deleteNote);
  router.post('/imageNote', auth, taskCntrl.imageNote);
  router.post('/updateNote', auth, taskCntrl.updateNote);
  router.get('/copyNote', auth, taskCntrl.copyNote);
  router.post('/noteColloborator', auth, taskCntrl.noteColloborator);
  router.get('/getColloborators', taskCntrl.getColloborators);
  router.get('/removeNote', auth, taskCntrl.removeNote);
  router.get('/scheduleRemainder', auth, taskCntrl.scheduleRemainder);
  router.post('/setReminder', auth, taskCntrl.setReminder);
  router.get('/cancelRemainder',auth,taskCntrl.cancelRemainder);
  router.get('/removeurl',auth,taskCntrl.removeCardURL);
  router.get('/autocomplete', taskCntrl.autocomplete);

  module.exports = router;
