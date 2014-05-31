var config      = require('config'),
    mongojs     = require('mongojs');

var db_config   = config.db_config,
    collection_name = config.collection_name;
var db = mongojs(db_config + collection_name, [collection_name] );

function select_box(req, res, next){
  //clean these variables:
  var query = req.query;
//  var lat1 = parseFloat(Number(query.lat1).toFixed(13)),
//      lon1 = parseFloat(Number(query.lon1).toFixed(13)),
//      lat2 = parseFloat(Number(query.lat2).toFixed(13)),
//      lon2 = parseFloat(Number(query.lon2).toFixed(13));
    var lat1 = parseFloat(query.lat1),
        lon1 = parseFloat(query.lon1),
        lat2 = parseFloat(query.lat2),
        lon2 = parseFloat(query.lon2);
  var limit = (typeof(query.limit) !== "undefined") ? query.limit : 2000;
  if(!(Number(query.lat1) 
    && Number(query.lon1) 
    && Number(query.lat2) 
    && Number(query.lon2)
    && Number(limit)))
  {
    res.send(500, {http_status:400,error_msg: "this endpoint requires two pair of lat, long coordinates: lat1 lon1 lat2 lon2\na query 'limit' parameter can be optionally specified as well."});
    return console.error('could not connect to the database', err);
  }

//    db[collection_name].find( {'coordinates' : {'$geoWithin': { '$box' : [[lon1,lat1],[lon2,lat2]]}}}).forEach(
//        function(err, doc) {
//        console.log(doc);
//    });

  db[collection_name].find( {'geometry.coordinates' : {'$geoWithin': { '$box' : [[lon1,lat1],[lon2,lat2]]}}}).limit(limit).toArray(function(err, rows){
    if(err) {
      res.send(500, {http_status:500,error_msg: err})
      return console.error('error running query', err);
    }
    res.send(rows);
    console.log('rows count = ' + rows.count());
    return rows;
  });
//    db[collection_name].find( {'cat' : {'$lt': 10000}}).limit(limit).toArray(function(err, rows){
//        if(err) {
//            res.send(500, {http_status:500,error_msg: err})
//            return console.error('error running query', err);
//        }
//        res.send(rows);
//        console.log('rows count = ' + rows.toString());
//        return rows;
//    });
};
function select_all(req, res, next){
  console.log(db);
  db[collection_name].find(function(err, rows){
    if(err) {
      res.send(500, {http_status:500,error_msg: err})
      return console.error('error running query', err);
    }
    res.send(rows);
    return rows;
  });
};

module.exports = exports = {
  selectAll: select_all,
  selectBox: select_box
};
