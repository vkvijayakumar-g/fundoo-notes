  var urlMetadata = require('url-metadata');

  /**
   * [getUrl description]
   * @param  {var} url [contains the message content to check whether the url is present]
   * @param  {object} req.query  [contains your cardId]
   */

  module.exports = function(url) {
    return new Promise(function(resolve, reject)
    {
      if(url==null)
      {
        resolve(url)
      }
      else {
        urlMetadata(url).then(function(metadata)
        {
          var meta = {
            'title': metadata.title,
            'url': metadata.url,
            'image': metadata.image
          }
         resolve(meta)
        }, function(err) {
          if (err)
            reject(err);
        });
      }
    })
  }


module.exports.scrapurl=function(text)
{
  var urlarray=[];
  var urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/ig
  var url = text.match(urlPattern);
  if (url != null)
  {
    for (var i = 0; i < url.length; i++)
    {
      if (!/^(?:f|ht)tps?\:\/\//.test(url[i])) {
        var val = "http://" + url[i];
        urlarray.push(val)
      } else {
        val = url[i];
        urlarray.push(val);
      }
    }
    return urlarray;
  }
  else {
    return urlarray;
  }
}
