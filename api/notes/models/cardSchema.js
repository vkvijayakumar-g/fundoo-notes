  /**
   * Card Schema
   * @path models/cardSchema.js
   * @file cardSchema.js
   * Scripted by Vijayakumar
   */

  /*
   * Module dependencies
   */

  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Types.ObjectId;
  /**
   * cardSchema
   */

  var cardSchema = Schema({
    cardId: {
      type: String
    },
    userid: {
      type: String
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    color: {
      type: String,
      default: "#FFFFFF"
    },
    remainder: {
      day: {
        type: String,
        default: null
      },
      month: {
        type: String,
        default: null
      },
      year: {
        type: String,
        default: null
      },
      hour: {
        type: String,
        default: null
      },
      minutes: {
        type: String,
        default: null
      },
      seconds: {
        type: String,
        default: null
      }
    },
    isarchive: {
      type: Boolean,
      default: false
    },
    ispin: {
      type: Boolean,
      default: false
    },
    trash: {
      type: Boolean,
      default: false
    },
    collobarator: {
      type: [{}],
      default: null
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    },
    image: {
      type: String,
      default: null
    },
    url: {
      type: [{}],
      default: null
    }
  }, {
    collection: "userCardSchema"
  });

  // var cardModel =mongoose.model('card', cardSchema);
  /**
   * getting all cards
   * @param  {[object]}   query    [contains the user_id]
   * @param  {Function} callback [sends err/data back after process completed]
   */
  cardSchema.statics.getCards = function(query, callback) {
    this.find(query).exec(callback);
  };
  /**
   * find only one card of selected id
   * @param  {[object]}   query    [contains the cardId that to copied]
   * @param  {Function} callback [make updation of new card in database]
   */
  cardSchema.statics.copyCard = function(query, callback) {
    var newCard = new this()
    this.findOne(query, function(err, data) {
      if (err) callback(err, null)
      else {
        newCard = data;
        newCard._id = new ObjectId();
        newCard.cardId = newCard._id;
        newCard.isNew = true;
        newCard.save(function(err) {
          if (err) callback(err)
          else callback(null)

        })
      }
    });
  };
  /**
   * updating cardDetails
   * @param  {[type]}   query    [contains the cardId]
   * @param  {[type]}   update   [contains the updation that to be done]
   * @param  {Function} callback [sends err/data back after the process completed]
   */
  cardSchema.statics.updateCard = function(query, update, callback)
  {
    console.log("changing");
    this.findOneAndUpdate(query, update).exec(callback);
  };
  /**
   * remove card
   * @param  {[type]}   query    [contains the cardId]
   * @param  {Function} callback [return if err else sucess data]
   */
  cardSchema.statics.removeCard = function(query, callback) {
    this.findOneAndRemove(query).exec(callback);
  }

  /**
   * [create a new card]
   * @param  {[type]}   data     [data contains respective value based on schema  ]
   * @param  {Function} callback [send err if error founds else sends data]
   */
  cardSchema.statics.createCard = function(data, callback) {
    var newCard = new this()
    newCard.cardId = newCard._id;
    newCard.userid = data.userid;
    newCard.title = data.title;
    newCard.content = data.content;
    newCard.save(function(err, data) {
      if (err) callback(err, null)
      callback(null, data)
    });
  }
  /**
   * [add meta content to the note when url is present]
   * @param  {[type]}   query    [query contains for the cardId to which url should be added ]
   * @param  {[type]}   metadata [scarpped content of url to update]
   * @param  {Function} callback [send err if error founds else sends data]
   */
  cardSchema.statics.addUrl = function(query, metadata, callback) {
    this.findOne(query, function(err, data) {
      if (err) callback(err, null)
      data.url.push(metadata);
      data.save(function(err) {
        if (err) callback(err);
        callback(null);
      })
    });
  };
  cardSchema.statics.checkurl = function(query,baseurl,callback) {
    this.findOne(query, function(err, data) {
      if (err) callback(err, null)
      if(data)
      { var status=0;
        var len=data.url.length;
        for(i=0; i<len; i++)
        {
          if(data.url[i].url==baseurl)
          {
            status=1;
          }
        }
        if(status==1)callback(null,'done')
        else callback(null,null)
      }
      })
    };
  /**
   * [shared users details of the note gets shared]
   * @param  {[type]}   query    [query contains for the cardId of note to be shared]
   * @param  {[type]}   update   [contains the updation of user details]
   * @param  {Function} callback [send err if error founds else sends data]
   */
  cardSchema.statics.addPeople = function(query, update, callback) {
    this.findOne(query, function(err, data) {
      if (err) callback(err, null)
      data.collobarator.push(update);
      data.save(function(err) {
        if (err) callback(err);
        callback(null)
      })
    })
  }
  /**
   * remove the particular url  metadata from the database
   * @param  {[type]}   query    [query contains for the cardId of note to be shared]
   * @param  {[type]}   url   [contains the url to be removed]
   * @param  {Function} callback [send err if error founds else sends data]

   */
  cardSchema.statics.removeURL = function(query,url,callback)
  {
    this.findOne(query,function(err,data)
  {
    if(err)callback(err,null)
    data.url.splice(data.url.indexOf(url),1);
    data.save(function(err)
    {
    if(err)callback(err);
    callback(null,'done')
    })
  })
  }
  module.exports = mongoose.model('card', cardSchema);
