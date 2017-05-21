var express = require('express');
var config = require('config');
var map = express();
var path = require('path');
var GeoJSON = require('geojson');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = process.env.DB_Mongo || config.get('DB.MONGO');

map.use(express.static(path.join(__dirname, 'public')));
map.use(bodyParser.json());  //to support JSON

// show index.html
map.get('/', function(req, res) {
    res.render('index'); 
});

// get json content
map.get('/json', function(req, res){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("連接成功！");
        res.setHeader('Content-Type', 'application/json');
        var collection = db.collection('map');
        // var whereStr = {"name":'test'};
        var whereStr = {};
        var queryData = [];
        collection.find(whereStr, {"_id":0}).toArray(function(err, docs){
            for(var i = 0; i < docs.length; i++){
                queryData.push({
                    name: (docs[i].name)? docs[i].name: 'test', 
                    lat: docs[i].local_X,
                    lng: docs[i].local_Y
                });
            }
            var jsonResult = GeoJSON.parse(queryData, {Point: ['lat', 'lng']}); //監看這個變數，可以得到結果
            db.close();
            res.send(JSON.stringify(jsonResult));
        });
    });
});

map.listen(9487, function() {
    console.log('Example map listening on port : You 9487!');
});

