var mongoose = require('mongoose');

module.exports = function () {

    // Build the connection string
    var dbURI = 'mongodb://cvmatcher:cvmatcher@ds037145.mongolab.com:37145/dbcvmatcher';

    // Create the database connection
    var db = mongoose.connect(dbURI);

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open to ' + dbURI);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    //var db = mongoose.connect(dbURI);

    var MatchingObjectsModel = require('./../schemas/schemas').MatchingObjectsModel;
    var FormulaModel = require('./../schemas/schemas').FormulaModel;
    var UserModel = require('./../schemas/schemas').UserModel;
    var StatusModel = require('./../schemas/schemas').StatusModel;
    var RequirementsModel = require('./../schemas/schemas').RequirementsModel;
    var CompanyModel = require('./../schemas/schemas').CompanyModel;


    return db;
};