  var multer = require('multer');
  var fs = require('fs-extra');
  var userModel = require("../models/userSchema");

  /**
   * storing the uploaded imageat destination place with filename
   * @type {jpeg}
   */
  var Storage = multer.diskStorage({
    destination: (req, file, callback) => {
      var type = req.params.type;
      var path = `./views/images/profile_images`;
      fs.mkdirsSync(path);
      callback(null, path);
    },
    filename: function(req, file, callback) {
      var type = file.mimetype.slice(6, 11);
      var imageName = req.user._id + "." + type;
      profileImage(req, imageName);
      callback(null, imageName);
    }
  });
  var upload = multer({
    storage: Storage
  }).array("imgUploader", 3);

  /**
   * upload function to upload the image
   * @param  {object}   req      [contains id to which image should upload]
   * @param  {Function} callback [sends back err/data ]
   */
  var uploadFile = function(req, callback) {
    upload(req, callback, function(err) {
      if (err) {
        console.log("something went wrong");
        callback(err, null);
      } else {
        console.log("File upload sucessfully");
        callback(null, 'done')
      }
    })
  }

  /**
   * [profileImage ]
   * @param  {object} req       [cardid to which image should upload]
   * @param  {var} imageName [name of the image]
   */
  function profileImage(req, imageName) {
    var query = {
        "userId": req.user.id
      };
      var update = {
        $set: {
          'userImage': './images/profile_images/' + imageName
        }
      };
    userModel.updateProfile(query, update, function(err, data)  {
      if (err) {
        console.log(err);
        callback(err, null);
      }
    })
  }

  module.exports = uploadFile;
