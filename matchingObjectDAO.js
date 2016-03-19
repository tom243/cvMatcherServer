var mongoose = require('mongoose');

//var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');
//var db = mongoose.createConnection('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

var newMatchingObjects = require('./schemas').matchingObjectsSchema;
var MatchingObjectsModel = mongoose.model('MatchingObjectsModel', newMatchingObjects);

var newFormula = require('./schemas').formulasSchema;
var FormulaModel = mongoose.model('FormulaModel', newFormula);

var UserModel = require('./schemas').UserModel;
var StatusModel = require('./schemas').StatusModel;


var errorMessage;

/////////////////////////////////////////////////////////////// *** Matching Objects *** ///////////////////////////////////////////////////////////////


// Add Object
function addObject(addObject, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in addObject function");

    var class_data = JSON.parse(addObject);   ////////////change the class json schema
    var newtable = new MatchingObjectsModel({
        matching_object_id: class_data['matching_object_id'],
        user_id:class_data['personal_id'],
        matching_object_type: class_data['matching_object_type'],
        date: class_data['date'],
        original_text: class_data['original_text'],
        sector: class_data['sector'],
        locations: class_data['locations'],
        candidate_type: class_data['candidate_type'],
        scope_of_position: class_data['scope_of_position'],
        academy: class_data['academy'],
        sub_sector: class_data['sub_sector'],
        formula: class_data['formula'],
        requirements: class_data['requirements'],
        compatibility_level: class_data['compatibility_level'],
        status: class_data['status'],
        favorites: class_data['favorites'],
        cvs: class_data['cvs'],
        active: class_data['active']
    });


    var query = MatchingObjectsModel.find().where('matching_object_id', newtable.matching_object_id);

    query.exec(function (err, result) {
        console.log("result.length: " + result.length);
        if (err) {
            console.log("error find Object id from DB");
            mongoose.disconnect();
            callback(false);
        }
        if (result.length == 0) {
            console.log("the Object isn't exist");
            /*save the User in db*/
            newtable.save(function (err, doc) {
                console.log("Object saved to DB: " + doc);
                mongoose.disconnect();
                callback(doc);
            });
        }
        else {
            console.log("exist Object with the same id!!!");
            mongoose.disconnect();
            callback(false);
        }
    });

};


// Delete Object
function deleteObject(deleteObject, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in deleteObject function");

    var class_data = JSON.parse(deleteObject);
    var newtable = new MatchingObjectsModel({
        matching_object_id: class_data['matching_object_id'],
    });

    var query = MatchingObjectsModel.findOne().where('matching_object_id', newtable.matching_object_id);

    query.exec(function (err, doc) {
        var query = doc.update({$set: {active: false}});
        query.exec(function (err, result) {

            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }
            else {
                mongoose.disconnect();
                callback(result);
            }

        });
    });
};


// Update Object
function updateObject(updateObject, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in updateObject function");


    var class_data = JSON.parse(updateObject);
    var newtable = new MatchingObjectsModel({
        matching_object_type: class_data['matching_object_type'],
        user_id:class_data['personal_id'],
        date: class_data['date'],
        original_text: class_data['original_text'],
        sector: class_data['sector'],
        locations: class_data['locations'],
        candidate_type: class_data['candidate_type'],
        scope_of_position: class_data['scope_of_position'],
        academy: class_data['academy'],
        sub_sector: class_data['sub_sector'],
        formula: class_data['formula'],
        requirements: class_data['requirements'],
        compatibility_level: class_data['compatibility_level'],
        status: class_data['status'],
        favorites: class_data['favorites'],
        cvs: class_data['cvs'],
        active: class_data['active']
    });


    var query = MatchingObjectsModel.findOne().where('matching_object_id', newtable.matching_object_id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {
                matching_object_type: newtable.matching_object_type,
                user_id:newtable.personal_id,
                date: newtable.date,
                original_text: newtable.original_text,
                sector: newtable.sector,
                locations: newtable.locations,
                candidate_type: newtable.candidate_type,
                scope_of_position: newtable.scope_of_position,
                academy: newtable.academy,
                sub_sector: newtable.sub_sector,
                formula: newtable.formula,
                requirements: newtable.requirements,
                compatibility_level: newtable.compatibility_level,
                status: newtable.status,
                favorites: newtable.favorites,
                cvs: newtable.cvs,
                active: newtable.active
            }
        });

        query.exec(function (err, result) {

            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }
            else {
                mongoose.disconnect();
                callback(result);
            }

        });
    });

};


/////////////////////////////////////////////////////////////// ***  Formulas  *** ///////////////////////////////////////////////////////////////


// Add Formula
function addFormula(addFormula, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in addFormula function");

    var class_data = JSON.parse(addFormula);
    var newtable = new FormulaModel({
        formula_id: class_data['formula_id'],
        job_name: class_data['job_name'],
        sector: class_data['sector'],
        locations: class_data['locations'],
        candidate_type: class_data['candidate_type'],
        scope_of_position: class_data['scope_of_position'],
        academy: class_data['academy'],
        sub_sector: class_data['sub_sector'],
        experience: class_data['experience'],
        requirements: class_data['requirements'],
        matching_percentage: class_data['matching_percentage'],
        active: class_data['active']
    });


    var query = FormulaModel.find().where('formula_id', newtable.formula_id);

    query.exec(function (err, result) {
        console.log("result.length: " + result.length);
        if (err) {
            console.log("error find formula_id from DB");
            mongoose.disconnect();
            callback(false);
        }
        if (result.length == 0) {
            console.log("the formula isn't exist");
            /*save the User in db*/
            newtable.save(function (err, doc) {
                console.log("formula saved to DB: " + doc);
                mongoose.disconnect();
                callback(doc);
            });
        }
        else {
            console.log("exist formula with the same id!!!");
            mongoose.disconnect();
            callback(false);
        }
    });

};


// Delete Formula
function deleteFormula(deleteFormula, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in deleteFormula function");

    var class_data = JSON.parse(deleteFormula);
    var newtable = new FormulaModel({
        formula_id: class_data['formula_id']
    });

    var query = FormulaModel.findOne().where('formula_id', newtable.formula_id);

    query.exec(function (err, doc) {
        var query = doc.update({$set: {active: false}});
        query.exec(function (err, result) {

            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }
            else {
                mongoose.disconnect();
                callback(result);
            }

        });
    });
};


// Update Formula
function updateFormula(updateFormula, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in updateFormula function");

    var class_data = JSON.parse(updateFormula);
    var newtable = new FormulaModel({
        formula_id: class_data['formula_id'],
        job_name: class_data['job_name'],
        sector: class_data['sector'],
        locations: class_data['locations'],
        candidate_type: class_data['candidate_type'],
        scope_of_position: class_data['scope_of_position'],
        academy: class_data['academy'],
        sub_sector: class_data['sub_sector'],
        experience: class_data['experience'],
        requirements: class_data['requirements'],
        matching_percentage: class_data['matching_percentage'],
        active: class_data['active']
    });


    var query = FormulaModel.findOne().where('formula_id', newtable.formula_id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {
                formula_id: newtable.formula_id,
                job_name: newtable.job_name,
                sector: newtable.sector,
                locations: newtable.locations,
                candidate_type: newtable.candidate_type,
                scope_of_position: newtable.scope_of_position,
                academy: newtable.academy,
                sub_sector: newtable.sub_sector,
                experience: newtable.experience,
                requirements: newtable.requirements,
                matching_percentage: newtable.matching_percentage,
                active: newtable.active
            }
        });

        query.exec(function (err, result) {

            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }
            else {
                mongoose.disconnect();
                callback(result);
            }

        });
    });

};

var getFormula = function getFormula(jobId,callback) {

    mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    mongoose.connection.once('open', function () {

        var query = MatchingObjectsModel.find(
            {matching_object_id: jobId},
            {formula: 1}
        );

        query.exec(function (err, results) {
            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }

            if ( typeof(results[0].formula) !== "undefined" && results[0].formula !== null ) {

                console.log(results[0].formula);
                var query = FormulaModel.findById(results[0].formula);
                query.exec(function (err, results) {
                    if (err) {
                        console.log("error");
                        mongoose.disconnect();
                        callback(false);
                    }
                    console.log(results);
                    mongoose.disconnect();
                    callback(results);
                });
            }else {
                errorMessage= "No formula exists";
                console.log(errorMessage);
                mongoose.disconnect();
                callback(false);
            }
        });
    });
}




///////////////////////////////////////////// *** JOBS *** ///////////////////////

/*var getJobsBySector = function getJobsBySector(userId, sector, callback) {

    mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    mongoose.connection.once('open', function () {

        var query = UserModel.find(
            {user_id: userId},
            {"jobs.job_id": 1}
        );

        query.exec(function (err, results) {

            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }
            if ( results[0].jobs.length > 0) {
                var jobsIds = [];
                results[0].jobs.forEach(function (item) {
                    jobsIds.push(item.job_id);
                })

                var query = MatchingObjectsModel.find(
                    {matching_object_id: {$in: jobsIds}, sector: sector}
                );
                query.exec(function (err, results) {
                    if (err) {
                        console.log("error");
                        mongoose.disconnect();
                        callback(false);
                    }
                    console.log(results);
                    mongoose.disconnect();
                    callback(results);
                });
            }else {
                errorMessage = "jobs are empty"
                console.log(errorMessage);
                mongoose.disconnect();
                callback( results[0].jobs);
            }

        });
    });
}*/

var getJobsBySector = function getJobsBySector(userId, sector, callback) {

    mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    mongoose.connection.once('open', function () {

        var query = MatchingObjectsModel.find(
            {google_user_id: userId, sector: sector,active:true}
        );

        query.exec(function (err, results) {

            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }
            mongoose.disconnect();
            callback(results);
        });
    });
};

var getUnreadCvsForJob = function getUnreadCvsForJob(userId, jobId, callback) {

    mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    mongoose.connection.once('open', function () {

        var query = MatchingObjectsModel.find(
            {_id: jobId,google_user_id: userId, active:true},
            {cvs:1}
        );

        query.exec(function (err, results) {

            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }
            if ( results[0].cvs.length > 0) {
  /*              var cvs = [];
                results[0].cvs.forEach(function (item) {
                    cvs.push(item.job_id);
                })*/

                var query = MatchingObjectsModel.find(
                    {_id: {$in: results[0].cvs},active:true,"status.current_status":"unread"}
                ).populate('user');
                query.exec(function (err, results) {
                    if (err) {
                        console.log("error");
                        mongoose.disconnect();
                        callback(false);
                    }

                        console.log();
                        mongoose.disconnect();
                        callback(results);


                });
            }else {
                errorMessage = "jobs are empty"
                console.log(errorMessage);
                mongoose.disconnect();
                callback( results);
            }


        });
    });
};



///////////////////////////////////////////// *** CVS *** ///////////////////////



///////////////////////////////////////////// *** EXPORTS *** ///////////////////////
exports.addObject = addObject;
exports.deleteObject = deleteObject;
exports.updateObject = updateObject;

exports.addFormula = addFormula;
exports.deleteFormula = deleteFormula;
exports.updateFormula = updateFormula;
exports.getFormula = getFormula;

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob= getUnreadCvsForJob;

//////////// example to split data ////////

// var b = updateUser.split(/[{},:]/); // Delimiter is a regular expression
// console.log(b);

//////////////////////////////////////////////////


/*
 // Bring Mongoose into the app
 var mongoose = require( 'mongoose' );

 // Build the connection string
 var dbURI = 'mongodb://localhost/ConnectionTest';

 // Create the database connection
 mongoose.connect(dbURI);

 // CONNECTION EVENTS
 // When successfully connected
 mongoose.connection.on('connected', function () {
 console.log('Mongoose default connection open to ' + dbURI);
 });

 // If the connection throws an error
 mongoose.connection.on('error',function (err) {
 console.log('Mongoose default connection error: ' + err);
 });

 // When the connection is disconnected
 mongoose.connection.on('disconnected', function () {
 console.log('Mongoose default connection disconnected');
 });

 // If the Node process ends, close the Mongoose connection
 process.on('SIGINT', function() {
 mongoose.connection.close(function () {
 console.log('Mongoose default connection disconnected through app termination');
 process.exit(0);
 });
 }); */
