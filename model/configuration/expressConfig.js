var express = require('express');
var bodyParser = require('body-parser');

var error = {
    error: null
};

module.exports = function() {

    var app =express();

    app.use(bodyParser.json());

    app.use(function(err,req,res,next) {
        if (err) {
            error.error = "invalid json";
            res.status(400).json(error);
        }else {
            next();
        }
    });

    app.use('/', express.static('./public'));

    // create application/json parser
    //var jsonParser = bodyParser.json();

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    require ('./../routes/routes')(app);

    return app;

};