/**
 * Created by filippov on 20.05.14.
 */
var config      = require('config');
var pg = require('pg');
//var client = new pg.Client(config.db_postgis_config);
//client.connect();

function select_box(req, res, next){
    //clean these variables:
    var query = req.query;
    var lat1 = parseFloat(query.lat1),
        lon1 = parseFloat(query.lon1),
        lat2 = parseFloat(query.lat2),
        lon2 = parseFloat(query.lon2);
    var limit = (typeof(query.limit) !== "undefined") ? query.limit : 4000;
    if(!(Number(query.lat1)
        && Number(query.lon1)
        && Number(query.lat2)
        && Number(query.lon2)
        && Number(limit)))
    {
        res.send(500, {http_status:400,error_msg: "this endpoint requires two pair of lat, long coordinates: lat1 lon1 lat2 lon2\na query 'limit' parameter can be optionally specified as well."});
        return console.error('could not connect to the database', err);
    }
    pg.connect(config.db_postgis_config, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        var query = 'SELECT ST_AsGeoJSON(geom) FROM '+ config.table_name +' WHERE ' +
        'ST_Within(geom,' +
        'ST_GeomFromText(\'POLYGON((' + lat1 + ' ' + lon1 + ', ' +
        lat2 + ' ' + lon1 + ', ' +
        lat2 + ' ' + lon2 + ', ' +
        lat1 + ' ' + lon2 + ', ' +
        lat1 + ' ' + lon1 + '))\',' +
        '4326));';
        client.query(query, function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }
            res.send(result.rows);
            return result.rows;
            //console.log(result);
            //output: 1
        });
    });
//    db[collection_name].find( {'geometry.coordinates' : {'$geoWithin': { '$box' : [[lon1,lat1],[lon2,lat2]]}}}).limit(limit).toArray(function(err, rows){
//        if(err) {
//            res.send(500, {http_status:500,error_msg: err})
//            return console.error('error running query', err);
//        }
//
//        res.send(rows);
//        console.log('rows count = ' + rows.count());
//        return rows;
//    });
};
//var query = client.query('SELECT ST_AsGeoJSON(geom) FROM '+ config.table_name +' WHERE ' +
//    'ST_Within(geom,' +
//    'ST_GeomFromText(\'POLYGON((57.89149735271031 85.71533203125,' +
//    '61.05296842431332 85.71533203125,' +
//    '61.05296842431332 87.35620117187499,' +
//    '57.89149735271031 87.35620117187499,' +
//    '57.89149735271031 85.71533203125)),' +
//    '4326))\';');
//query.on("row", function (row, result) {
//    result.addRow(row);
//});
//query.on("end", function (result) {
//    console.log(JSON.stringify(result.rows, null, "    "));
//    client.end();
//});

module.exports = exports = {
    selectBox: select_box
};
