var mongoose = require('mongoose');

var MatchingObjectsModel = require('./../schemas/schemas').MatchingObjectsModel;
var FormulaModel = require('./../schemas/schemas').FormulaModel;
var UserModel = require('./../schemas/schemas').UserModel;
var StatusModel = require('./../schemas/schemas').StatusModel;
var RequirementsModel = require('./../schemas/schemas').RequirementsModel;

var errorMessage;

/////////////////////////////////////////////////////////////// *** Matching Objects *** ///////////////////////////////////////////////////////////////


// Add Object
function addObject(addObject, callback) {

    console.log("im in addObject function");

    var class_data = JSON.parse(addObject);   ////////////change the class json schema
    var newtable = new MatchingObjectsModel({
        matching_object_id: class_data['matching_object_id'],
        user_id: class_data['personal_id'],
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
        archive: class_data['archive'],
        active: class_data['active']
    });


    var query = MatchingObjectsModel.find().where('matching_object_id', newtable.matching_object_id);

    query.exec(function (err, result) {
        console.log("result.length: " + result.length);
        if (err) {
            console.log("error find Object id from DB");
            callback(false);
        }
        if (result.length == 0) {
            console.log("the Object isn't exist");
            /*save the User in db*/
            newtable.save(function (err, doc) {
                console.log("Object saved to DB: " + doc);
                callback(doc);
            });
        }
        else {
            console.log("exist Object with the same id!!!");
            callback(false);
        }
    });

}


// Delete Object
function deleteObject(deleteObject, callback) {

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
                callback(false);
            }
            else {
                callback(result);
            }

        });
    });
}


// Update Object
function updateObject(updateObject, callback) {

    console.log("im in updateObject function");

    var class_data = JSON.parse(updateObject);
    var newtable = new MatchingObjectsModel({
        matching_object_type: class_data['matching_object_type'],
        user_id: class_data['personal_id'],
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
        archive: class_data['archive'],
        active: class_data['active']
    });


    var query = MatchingObjectsModel.findOne().where('matching_object_id', newtable.matching_object_id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {
                matching_object_type: newtable.matching_object_type,
                user_id: newtable.personal_id,
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
                archive: newtable.archive,
                active: newtable.active
            }
        });

        query.exec(function (err, result) {

            if (err) {
                console.log("error");
                callback(false);
            }
            else {
                callback(result);
            }

        });
    });

}

var getMatchingObject = function getMatchingObject(userId, matchingObjectId, matchingObjectType, callback) {

    if (matchingObjectType === "cv") {

        var query = MatchingObjectsModel.find(
            {google_user_id: userId, _id: matchingObjectId, active: true, matching_object_type: matchingObjectType}
        ).populate('user');
    } else {//job
        var query = MatchingObjectsModel.find(
            {google_user_id: userId, _id: matchingObjectId, active: true, matching_object_type: matchingObjectType}
        ).populate('requirements');
    }

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        callback(results);
    });
};


/////////////////////////////////////////////////////////////// ***  Formulas  *** ///////////////////////////////////////////////////////////////


// Add Formula
function addFormula(addFormula, callback) {

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
            callback(false);
        }
        if (result.length == 0) {
            console.log("the formula isn't exist");
            /*save the User in db*/
            newtable.save(function (err, doc) {
                console.log("formula saved to DB: " + doc);
                callback(doc);
            });
        }
        else {
            console.log("exist formula with the same id!!!");
            callback(false);
        }
    });

}


// Delete Formula
function deleteFormula(deleteFormula, callback) {

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
                callback(false);
            }
            else {
                callback(result);
            }

        });
    });
}


// Update Formula
function updateFormula(updateFormula, callback) {

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
                callback(false);
            }
            else {
                callback(result);
            }

        });
    });
}

var getFormula = function getFormula(jobId, callback) {

    var query = MatchingObjectsModel.find(
        {_id: jobId},
        {formula: 1}
    );

    query.exec(function (err, results) {
        if (err) {
            console.log("error");
            callback(false);
        }

        if (typeof(results[0].formula) !== "undefined" && results[0].formula !== null) {

            console.log(results[0].formula);
            var query = FormulaModel.findById(results[0].formula);
            query.exec(function (err, results) {
                if (err) {
                    console.log("error");
                    callback(false);
                }
                console.log(results);
                callback(results);
            });
        } else {
            errorMessage = "No formula exists";
            console.log(errorMessage);
            callback(false);
        }
    });
};


///////////////////////////////////////////// *** Employer *** ///////////////////////

var getJobsBySector = function getJobsBySector(userId, sector, isArchive, callback) {

    var query = MatchingObjectsModel.find(
        {google_user_id: userId, sector: sector, active: true, matching_object_type: "job", archive: isArchive}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        callback(results);
    });
};

var getUnreadCvsForJob = function getUnreadCvsForJob(userId, jobId, callback) {

    var query = MatchingObjectsModel.find(
        {_id: jobId, google_user_id: userId, active: true, matching_object_type: "job"},
        {cvs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        if (results[0].cvs.length > 0) {

            var query = MatchingObjectsModel.find(
                {
                    _id: {$in: results[0].cvs},
                    active: true,
                    "status.current_status": "unread",
                    matching_object_type: "cv"
                }
            ).populate('user');
            query.exec(function (err, results) {
                if (err) {
                    console.log("error");
                    callback(false);
                }

                console.log();
                callback(results);

            });
        } else {
            errorMessage = "jobs are empty";
            console.log(errorMessage);
            callback(results);
        }

    });
};

var getRateCvsForJob = function getRateCvsForJob(userId, jobId, current_status, callback) {

    var query = MatchingObjectsModel.find(
        {_id: jobId, google_user_id: userId, active: true, matching_object_type: "job"},
        {cvs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        if (results[0].cvs.length > 0) {

            var query = MatchingObjectsModel.find(
                {
                    _id: {$in: results[0].cvs}, active: true,
                    "status.current_status": current_status, matching_object_type: "cv"
                }
            ).populate('user').populate('status.status_id');
            query.exec(function (err, results) {
                if (err) {
                    console.log("error");
                    callback(false);
                }

                console.log();
                callback(results);

            });
        } else {
            errorMessage = "jobs are empty"
            console.log(errorMessage);
            callback(results);
        }

    });
};


var getFavoriteCvs = function getFavoriteCvs(userId, jobId, callback) {

    var query = MatchingObjectsModel.find(
        {_id: jobId, google_user_id: userId, active: true, matching_object_type: "job"},
        {favorites: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        if (results[0].favorites.length > 0) {

            var query = MatchingObjectsModel.find(
                {
                    _id: {$in: results[0].favorites}, active: true,
                    "status.favorite": true, matching_object_type: "cv"
                }
            ).populate('user').populate('status.status_id');
            query.exec(function (err, results) {
                if (err) {
                    console.log("error");
                    callback(false);
                }

                console.log();
                callback(results);

            });
        } else {
            errorMessage = "jobs are empty";
            console.log(errorMessage);
            callback(results);
        }

    });
};


///////////////////////////////////////////// *** JobSeeker *** ///////////////////////


var getAllJobsBySector = function getAllJobsBySector(userId, sector, callback) {

    var query = UserModel.find(
        {google_user_id: userId, active: true}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        console.log(results);
        var query = MatchingObjectsModel.find(
            {sector: sector, active: true, matching_object_type: "job", _id: {$nin: results[0].jobs}, archive: false}
        );

        query.exec(function (err, results) {

            if (err) {
                console.log("error");
                callback(false);
            }
            callback(results);
        });

    });
};

var getMyJobs = function getMyJobs(userId, callback) {

    var query = UserModel.find(
        {google_user_id: userId, active: true}, {jobs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        console.log(results);
        var query = MatchingObjectsModel.find(
            {active: true, matching_object_type: "job", _id: {$in: results[0].jobs}, archive: false}
        );

        query.exec(function (err, results) {

            if (err) {
                console.log("error");
                callback(false);
            }
            callback(results);
        });

    });
};


///////////////////////////////////////////// *** EXPORTS *** ///////////////////////
exports.addObject = addObject;
exports.deleteObject = deleteObject;
exports.updateObject = updateObject;
exports.getMatchingObject = getMatchingObject;

exports.addFormula = addFormula;
exports.deleteFormula = deleteFormula;
exports.updateFormula = updateFormula;
exports.getFormula = getFormula;

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;
exports.getFavoriteCvs = getFavoriteCvs;

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;

//////////// example to split data ////////

// var b = updateUser.split(/[{},:]/); // Delimiter is a regular expression
// console.log(b);

//////////////////////////////////////////////////
