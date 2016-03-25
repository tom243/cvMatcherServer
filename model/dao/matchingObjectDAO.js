var mongoose = require('mongoose');

var MatchingObjectsModel = require('./../schemas/schemas').MatchingObjectsModel;
var FormulaModel = require('./../schemas/schemas').FormulaModel;
var UserModel = require('./../schemas/schemas').UserModel;
var StatusModel = require('./../schemas/schemas').StatusModel;
var RequirementsModel = require('./../schemas/schemas').RequirementsModel;
var OriginalTextModel = require('./../schemas/schemas').OriginalTextModel;
var PersonalPropertiesModel = require('./../schemas/schemas').PersonalPropertiesModel;

var errorMessage;

////////////////////////////////// *** Matching Objects *** ////////////////////////


// Add Object
function addMatchingObject(matchingObject, callback) {

    console.log("im in addMatchingObject function");

    /* First we need to insert all embedded documents and after it insert
     matching object with all id references */

    /* common to job and cv */
    addOriginalText(matchingObject.original_text ,function (original_text) {
        matchingObject.original_text = original_text._id;
        /* Add Requirements */
        addRequirements(matchingObject.requirements, function (requirements) {
            matchingObject.requirements = requirements._id;

            /* start unique parameters */
            if (matchingObject.matching_object_type === "cv") {

                /* Add Personal Properties */
                addPersonalProperties(matchingObject.personal_properties, function (personal_properties) {
                    matchingObject.personal_properties = personal_properties._id;
                    buildAndSaveMatchingObject(matchingObject, function (matchingObject) {
                        callback(matchingObject);
                    })
                })
            } else { // Add Job

                /* Add Formula */
                addFormula(matchingObject.formula, function (formula) {
                    matchingObject.formula = formula._id;

                    buildAndSaveMatchingObject(matchingObject, function (matchingObject) {
                        callback(matchingObject);
                    })
                })
            }
        })
    });


}

function buildAndSaveMatchingObject(matchingObject,callback) {

    var class_data = JSON.parse(matchingObject);
    var matchingObjectToAdd = new MatchingObjectsModel({
        matching_object_type:   class_data['matching_object_type'],
        google_user_id:         class_data['google_user_id'],
        date:                   class_data['date'],
        original_text:          class_data['original_text'],
        sector:                 class_data['sector'],
        locations:              class_data['locations'],
        candidate_type:         class_data['candidate_type'],
        scope_of_position:      class_data['scope_of_position'],
        academy:                class_data['academy'],
        sub_sector:             class_data['sub_sector'],
        formula:                class_data['formula'],
        requirements:           class_data['requirements'],
        compatibility_level:    class_data['compatibility_level'],
        status:                 class_data['status'],
        personal_properties:    class_data['personal_properties'],
        favorites:              class_data['favorites'],
        cvs:                    class_data['cvs'],
        archive:                class_data['archive'],
        active:                 class_data['active'],
        user:                   class_data['user']
    });

    /*save the User in db*/
    matchingObjectToAdd.save(function (err, doc) {
        if (err) {
            console.log("error in insert matching Object to DB");
            callback(false);
        }
        console.log("Object saved to DB: " + doc);
        callback(doc);
    });

}


// Delete Object
function deleteMatchingObject(deleteObject, callback) {

    console.log("im in deleteMatchingObject function");

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
function updateMatchingObject(updateObject, callback) {

    console.log("im in updateMatchingObject function");

    var class_data = JSON.parse(updateObject);
    var matchingObjectToUpdate = new MatchingObjectsModel({
        matching_object_type:   class_data['matching_object_type'],
        google_user_id:         class_data['google_user_id'],
        date:                   class_data['date'],
        original_text:          class_data['original_text'],
        sector:                 class_data['sector'],
        locations:              class_data['locations'],
        candidate_type:         class_data['candidate_type'],
        scope_of_position:      class_data['scope_of_position'],
        academy:                class_data['academy'],
        sub_sector:             class_data['sub_sector'],
        formula:                class_data['formula'],
        requirements:           class_data['requirements'],
        compatibility_level:    class_data['compatibility_level'],
        status:                 class_data['status'],
        personal_properties:    class_data['personal_properties'],
        favorites:              class_data['favorites'],
        cvs:                    class_data['cvs'],
        archive:                class_data['archive'],
        active:                 class_data['active'],
        user:                   class_data['user']
    });


    var query = MatchingObjectsModel.findOne().where('_id', matchingObjectToUpdate._id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {
                matching_object_type:   matchingObjectToUpdate.matching_object_type,
                google_user_id:         matchingObjectToUpdate.google_user_id,
                date:                   matchingObjectToUpdate.date,
                original_text:          matchingObjectToUpdate.original_text,
                sector:                 matchingObjectToUpdate.sector,
                locations:              matchingObjectToUpdate.locations,
                candidate_type:         matchingObjectToUpdate.candidate_type,
                scope_of_position:      matchingObjectToUpdate.scope_of_position,
                academy:                matchingObjectToUpdate.academy,
                sub_sector:             matchingObjectToUpdate.sub_sector,
                formula:                matchingObjectToUpdate.formula,
                requirements:           matchingObjectToUpdate.requirements,
                compatibility_level:    matchingObjectToUpdate.compatibility_level,
                status:                 matchingObjectToUpdate.status,
                personal_properties:    matchingObjectToUpdate.personal_properties,
                favorites:              matchingObjectToUpdate.favorites,
                cvs:                    matchingObjectToUpdate.cvs,
                archive:                matchingObjectToUpdate.archive,
                active:                 matchingObjectToUpdate.active,
                user:                   matchingObjectToUpdate.user
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

function getMatchingObject(userId, matchingObjectId, matchingObjectType, callback) {

    if (matchingObjectType === "cv") {

        var query = MatchingObjectsModel.find(
            {google_user_id: userId, _id: matchingObjectId, active: true, matching_object_type: matchingObjectType}
        ).populate('user').populate('original_text');
    } else {//job
        var query = MatchingObjectsModel.find(
            {google_user_id: userId, _id: matchingObjectId, active: true, matching_object_type: matchingObjectType}
        ).populate('requirements').populate('original_text');
    }

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        callback(results);
    });
}

/////////////////////////////////////// ***  OriginalText  *** /////////////////////////////

// Add OriginalText
function addOriginalText(originalText, callback) {

    console.log("im in OriginalText function");

    var class_data = JSON.parse(originalText);
    var originalTextToAdd = new OriginalTextModel({
            title:          class_data['title'],
        description:        class_data['description'],
        requirements:       class_data['requirements'],
        history_timeline:   class_data['history_timeline']
    });

    /* save the OriginalText to db*/
    originalTextToAdd.save(function (err, doc) {
        if (err) {
            console.log("error in save originalText to db ");
            callback(false);
        }
        console.log("OriginalText saved to DB: " + doc);
        callback(doc);
    });

}

/////////////////////////////////////// ***  Requirements  *** /////////////////////////////

// Add Requirements
function addRequirements(requirements, callback) {

    console.log("im in Requirements function");

    var class_data = JSON.parse(requirements);
    var requirementsToAdd = new RequirementsModel({
        combination: class_data['combination']
    });

    /* save the Requirements to db*/
    requirementsToAdd.save(function (err, doc) {
        if (err) {
            console.log("error in save Requirements to db ");
            callback(false);
        }
        console.log("Requirements saved to DB: " + doc);
        callback(doc);
    });

}

/////////////////////////////////////// ***  Status  *** /////////////////////////////

// Add Status
function addStatus(matching_object_id, status, callback) {

    console.log("im in Status function");

    var class_data = JSON.parse(status);
    var statusToAdd = new StatusModel({
        seen:       class_data['combination'],
        rate:       class_data['rate'],
        received:   class_data['received']
    });

    /* save the Status to db*/
    statusToAdd.save(function (err, doc) {
        if (err) {
            console.log("error in save Status to db ");
            callback(false);
        }
        console.log("Status saved to DB: " + doc);

        var query = {"_id": matching_object_id};
        var update = {status: {status_id: doc._id}};
        var options = {new: true};
        MatchingObjectsModel.findOneAndUpdate(query, update, options, function(err, person) {
            if (err) {
                console.log('got an error');
            }

            // at this point person is null.
        });


        callback(doc);
    });

}

/////////////////////////////////////// ***  Personal Properties  *** /////////////////////////////

// Add Status
function addPersonalProperties(personalProperties, callback) {

    console.log("im in personalProperties function");

    var class_data = JSON.parse(personalProperties);
    var personalPropertiesToAdd = new PersonalPropertiesModel({
        university_degree:                  class_data['university_degree'],
        degree_graduation_with_honors:      class_data['degree_graduation_with_honors'] ,
        above_two_years_experience:         class_data['above_two_years_experience'] ,
        psychometric_above_680:             class_data['psychometric_above_680'] ,
        multilingual:                       class_data['multilingual'] ,
        volunteering:                       class_data['volunteering'] ,
        full_army_service:                  class_data['full_army_service'] ,
        officer:                            class_data['officer'] ,
        high_school_graduation_with_honors: class_data['high_school_graduation_with_honors'] ,
        youth_movements:                    class_data['youth_movements']
    });

    /* save the Personal Properties to db*/
    personalPropertiesToAdd.save(function (err, doc) {
        if (err) {
            console.log("error in save Personal Properties to db ");
            callback(false);
        }
        console.log("Personal Properties saved to DB: " + doc);
        callback(doc);
    });

}



/////////////////////////////////////// ***  Formulas  *** /////////////////////////////


// Add Formula
function addFormula(formula, callback) {

    console.log("im in addFormula function");

    var class_data = JSON.parse(formula);
    var formulaToAdd = new FormulaModel({
        locations: class_data['locations'],
        candidate_type: class_data['candidate_type'],
        scope_of_position: class_data['scope_of_position'],
        academy: class_data['academy'],
        requirements: class_data['requirements']
    });


    /*save the Formula in db*/
    formula.save(function (err, doc) {
        if (err) {
            console.log("error insert formula to DB");
            callback(false);
        }
        console.log("formula saved to DB: " + doc);
        callback(doc);
    });

}


// Delete Formula
function deleteFormula(formula, callback) {

    console.log("im in deleteFormula function");

    var class_data = JSON.parse(formula);

    var query = FormulaModel.findOne().where('_id', class_data['_id']);

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
    var formulaToUpdate = new FormulaModel({
        locations: class_data['locations'],
        candidate_type: class_data['candidate_type'],
        scope_of_position: class_data['scope_of_position'],
        academy: class_data['academy'],
        requirements: class_data['requirements']
    });


    var query = FormulaModel.findOne().where('_id', formulaToUpdate._id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {
                locations: formulaToUpdate.locations,
                candidate_type: formulaToUpdate.candidate_type,
                scope_of_position: formulaToUpdate.scope_of_position,
                academy: newtable.formulaToAdd,
                requirements: formulaToUpdate.requirements
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

function getFormula(jobId, callback) {

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
}


///////////////////////////////////////////// *** Employer *** ///////////////////////

function getJobsBySector(userId, sector, isArchive, callback) {

    var query = MatchingObjectsModel.find(
        {google_user_id: userId, sector: sector, active: true, matching_object_type: "job", archive: isArchive}
    ).populate('original_text');

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        callback(results);
    });
}

function getUnreadCvsForJob(userId, jobId, callback) {

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
            ).populate('user').populate('original_text');
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

function getRateCvsForJob(userId, jobId, current_status, callback) {

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
            ).populate('user').populate('status.status_id').populate('original_text');
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


function getFavoriteCvs(userId, jobId, callback) {

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
            ).populate('user').populate('status.status_id').populate('original_text');
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


function getAllJobsBySector(userId, sector, callback) {

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
        ).populate('original_text');

        query.exec(function (err, results) {

            if (err) {
                console.log("error");
                callback(false);
            }
            callback(results);
        });

    });
};

function getMyJobs(userId, callback) {

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
        ).populate('original_text');

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
exports.addMatchingObject       = addMatchingObject;
exports.deleteMatchingObject    = deleteMatchingObject;
exports.updateMatchingObject    = updateMatchingObject;
exports.getMatchingObject       = getMatchingObject;

exports.addFormula      = addFormula;
exports.deleteFormula   = deleteFormula;
exports.updateFormula   = updateFormula;
exports.getFormula      = getFormula;

exports.getJobsBySector     = getJobsBySector;
exports.getUnreadCvsForJob  = getUnreadCvsForJob;
exports.getRateCvsForJob    = getRateCvsForJob;
exports.getFavoriteCvs      = getFavoriteCvs;

exports.getAllJobsBySector  = getAllJobsBySector;
exports.getMyJobs           = getMyJobs;

