  var cardModel = require("../models/cardSchema");
  var elasticsearch = require('elasticsearch');
  var esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });
  var indexName = "notes";
  var indexType = "cards";

  /**
   * [search index for autocomplete]
   * @param  {var} index [contains the indexName]
   * @param  {object} body  [contains the body of the respective indexName]
   */
  var search = function search(index, body) {
    return esClient.search({
      index: index,
      body: body
    });
  }
  /**
   * [indexExists checking whether index is exist or not]
   * @param  {var} a [indexname ]
   * @return {[type]}   [sending response whether index exists or not ]
   */
  function indexExists(a) {
    return new Promise(function(resolve, reject) {
      if (a) {
        resolve(esClient.indices.exists({
          index: a
        }));
      } else {
        reject("unsuccess");
      }
    });
  }
  var bulkIndex = function bulkIndex(req, res) {
    esClient.indices.create({
      index: indexName,
      body: {
        "settings": {
          "analysis": {
            "filter": {
              "autocomplete_filter": {
                "type": "edge_ngram",
                "min_gram": 1,
                "max_gram": 10
              }
            },
            "analyzer": {
              "autocomplete": {
                "type": "custom",
                "tokenizer": "standard",
                "filter": [
                  "lowercase",
                  "autocomplete_filter"
                ]
              }
            }
          }
        },
        "mappings": {
          "cards": {
            "properties": {
              "title": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed"
                  }
                }
              },
              "content": {
                "type": "string",
                "fields": {
                  "raw": {
                    "type": "string",
                    "index": "not_analyzed"
                  }
                }
              }
            }
          }
        }
      }

    }, function(error, response) {
      var query = {
        'userid': req.user._id
      }
      cardModel.getCards(query, function(err, data) {
        if (err) console.log(err);
        else {
          var body = [];
          data.forEach(function(item) {
            body.push({
              "index": {
                "_index": indexName,
                "_type": indexType
              }
            });
            body.push({
              content: item.content,
              title: item.title
            });
          });
          esClient.bulk({
            body: body
          });
        }
      })
    });
  }
  /**
   * [creating index for the updated database]
   * @param  {object} req [contains the userid from which u can get all cards]
   * @param  {object} res [sending the response hits]
   */
  module.exports.createIndex = function(req, res) {

    var checkindex = indexExists(indexName);
    checkindex.then(function(data) {
      if (data == true) {

        esClient.indices.delete({
          index: indexName
        });

        bulkIndex(req, res);
      } else {

        bulkIndex(req, res);
      }
    }).catch(function(error) {
      console.log("Direct Index Exists", error);
    });
  }
  /**
   * autocomplete of the search query
   */
  module.exports.autocomplete = function(req, res) {
    esClient.search({
      index: indexName,
      type: indexType,
      body: {
        query: {
          multi_match: {
            query: req.query.term,
            fields: ['title', 'content'],
            type: "phrase",
            minimum_should_match: 2,
            fuzziness: 2
          }
        }
      }
    }).then(function(resp) {
      var results = resp.hits.hits.map(function(hit) {
        return hit._source.title + " " + hit._source.content;
      });

      res.send(results);
    }, function(err) {
      console.trace(err);
      res.send({
        response: err.message
      });
    });
  }
