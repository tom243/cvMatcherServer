var mongoose = require('mongoose');
var async = require("async");
var unirest = require('unirest');
var validation = require("./../utils/validation");

var MatchingObjectsModel = require('./../schemas/schemas').MatchingObjectsModel;
var FormulaModel = require('./../schemas/schemas').FormulaModel;
var UserModel = require('./../schemas/schemas').UserModel;
var StatusModel = require('./../schemas/schemas').StatusModel;
var RequirementsModel = require('./../schemas/schemas').RequirementsModel;
var OriginalTextModel = require('./../schemas/schemas').OriginalTextModel;
var PersonalPropertiesModel = require('./../schemas/schemas').PersonalPropertiesModel;
var HistoryTimelineModel = require('./../schemas/schemas').HistoryTimelineModel;
var AcademyModel = require('./../schemas/schemas').AcademyModel;
var ProfessionalKnowledgeModel = require('./../schemas/schemas').ProfessionalKnowledgeModel;
var MatchingDetailsModel = require('./../schemas/schemas').MatchingDetailsModel;
var KeyWordsModel = require('./../schemas/schemas').KeyWordsModel;

var errorMessage;

var error = {
    error: null
};

////////////////////////////////// *** Matching Objects *** ////////////////////////


// Add Object
function addMatchingObject(matchingObject, callback) {

    console.log("im in addMatchingObject function");

    /* First we need to insert all embedded documents and after it insert
     matching object with all id references */

    var matchingObject = JSON.parse(matchingObject);

    /* common to job and cv */
    addOriginalText(matchingObject.original_text, function (original_text) {
        if (original_text !== false) {

            matchingObject.original_text = original_text._id;
            /* Add Requirements */
            addRequirements(matchingObject.requirements, function (requirements) {
                if (requirements !== false) {
                    matchingObject.requirements = requirements;
                    addAcademy(matchingObject.academy, function (academy) {
                        if (academy !== false) {
                            matchingObject.academy = academy;
                            console.log("matchingObject.academy", matchingObject.academy);
                            /* start unique parameters */
                            if (matchingObject.matching_object_type === "cv") {

                                /* Add Personal Properties */
                                addPersonalProperties(matchingObject.personal_properties,
                                    function (personal_properties) {
                                        if (personal_properties !== false) {
                                            matchingObject.personal_properties = personal_properties._id;
                                            buildAndSaveMatchingObject(matchingObject, function (matchingObject) {
                                                callback(matchingObject);
                                            })
                                        }
                                    })
                            } else { // Add Job

                                /* Add Formula */
                                addFormula(matchingObject.formula, function (formula) {
                                    if (formula !== false) {
                                        matchingObject.formula = formula._id;

                                        buildAndSaveMatchingObject(matchingObject, function (matchingObject) {
                                            callback(matchingObject);
                                        })
                                    } else {
                                        callback(false);
                                    }
                                })
                            }
                        } else {
                            callback(false)
                        }
                    })
                } else {
                    callback(false);
                }
            })
        } else {
            callback(false);
        }
    });
}

function buildAndSaveMatchingObject(matchingObject, callback) {

    console.log("matchingObject", matchingObject);


    //var class_data = JSON.parse(matchingObject);
    class_data = matchingObject;


    console.log("matchingObject.academy", class_data['academy']);
    var matchingObjectToAdd = new MatchingObjectsModel({
        matching_object_type: class_data['matching_object_type'],
        google_user_id: class_data['google_user_id'],
        date: class_data['date'],
        original_text: class_data['original_text'],
        sector: class_data['sector'],
        locations: class_data.locations,
        candidate_type: class_data.candidate_type,
        scope_of_position: class_data.scope_of_position,
        academy: class_data['academy'],
        sub_sector: class_data.sub_sector,
        formula: class_data['formula'],
        requirements: class_data.requirements,
        compatibility_level: class_data['compatibility_level'],
        status: null,
        personal_properties: class_data['personal_properties'],
        favorites: [],
        cvs: [],
        archive: false,
        active: true,
        user: class_data['user']
    });

    /*save the User in db*/
    matchingObjectToAdd.save(function (err, doc) {
        if (err) {
            console.log("error in insert matching Object to DB");
            console.log(err);
            callback(false);
        } else {
            console.log("Matching Object saved to DB: " + doc);
            callback(doc);
        }
    });
}


// Delete Object
function deleteMatchingObject(matching_object_id, callback) {

    console.log("im in deleteMatchingObject function");
    var query = MatchingObjectsModel.findOne().where('_id', matching_object_id);

    query.exec(function (err, doc) {
        if (err) {
            console.log("error:" + err);
            callback(false);
        } else {
            var query = doc.update({$set: {archive: true}});
            query.exec(function (err, result) {
                if (err) {
                    console.log("error:" + err);
                    callback(false);
                } else {
                    callback(result);
                }

            });
        }
    });
}


// Update Object
function updateMatchingObject(updateObject, callback) {

    console.log("im in updateMatchingObject function");

    var class_data = JSON.parse(updateObject);
    var matchingObjectToUpdate = new MatchingObjectsModel({
        sector: class_data['sector'],
        locations: class_data['locations'],
        candidate_type: class_data['candidate_type'],
        scope_of_position: class_data['scope_of_position'],
        sub_sector: class_data['sub_sector'],
        compatibility_level: class_data['compatibility_level']
    });


    var query = MatchingObjectsModel.findOne().where('_id', matchingObjectToUpdate._id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {
                sector: matchingObjectToUpdate.sector,
                locations: matchingObjectToUpdate.locations,
                candidate_type: matchingObjectToUpdate.candidate_type,
                scope_of_position: matchingObjectToUpdate.scope_of_position,
                sub_sector: matchingObjectToUpdate.sub_sector,
                compatibility_level: matchingObjectToUpdate.compatibility_level
            }
        });

        query.exec(function (err, result) {

            if (err) {
                console.log("error: " + err);
                callback(false);
            } else {
                callback(result);
            }

        });
    });

}

function getMatchingObject(matchingObjectId, matchingObjectType, callback) {

    if (matchingObjectType === "cv") {

        var query = MatchingObjectsModel.find(
            {_id: matchingObjectId, active: true, matching_object_type: matchingObjectType}
        ).populate('user')
            .populate('academy')
            .populate('personal_properties')
            .populate({
                path: 'original_text',
                populate: {path: 'history_timeline', options: {sort: {'start_year': 1}}}
            })
            .populate({
                path: 'requirements',
                populate: {path: 'combination'}
            })
            .populate({
                path: 'formula',
                populate: {path: 'matching_requirements.details'}
            });



    } else {//job
        var query = MatchingObjectsModel.find(
            {_id: matchingObjectId, active: true, matching_object_type: matchingObjectType}
        ).populate('original_text')
            .populate('academy')
            .populate({
                path: 'requirements',
                populate: {path: 'combination'}
            })
            .populate("formula")
    }

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the "
                + matchingObjectType + " from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log(matchingObjectType + " extracted successfully from the db")
                callback(200, results);
            }else {
                console.log(matchingObjectType + " not exists");
                error.error = matchingObjectType + " not exists";
                callback(404,error);
            }
        }
    });
}

/////////////////////////////////////// ***  OriginalText  *** /////////////////////////////


// Add OriginalText
function addOriginalText(originalText, callback) {

    console.log("im in OriginalText function");
    var history_data = originalText.history_timeline;

    if (originalText.history_timeline.length > 0) { //cv
        buildTimelineHistory(history_data, function (err, historyTimeline) {

            if (err) {
                console.log("error in save originalText to db ");
                console.log(err);
                callback(false);
            } else {

                var originalTextToAdd = new OriginalTextModel({
                    title: null,
                    description: null,
                    requirements: null,
                    history_timeline: historyTimeline
                });

                /* save the OriginalText to db*/
                originalTextToAdd.save(function (err, doc) {
                    if (err) {
                        console.log("error in save originalText to db ");
                        console.log(err);
                        callback(false);
                    } else {
                        callback(doc);
                    }
                })
            }
        })
    } else { // job
        var originalTextToAdd = new OriginalTextModel({
            title: originalText['title'],
            description: originalText['description'],
            requirements: originalText['requirements'],
            history_timeline: []
        });

        /* save the OriginalText to db*/
        originalTextToAdd.save(function (err, doc) {
            if (err) {
                console.log("error in save originalText to db ");
                console.log(err);
                callback(false);
            } else {
                callback(doc);
            }
        })
    }
}

function buildTimelineHistory(timeline, callback) {
    var historyTimeLineArray = [];

    // 1st para in async.each() is the array of items
    async.each(timeline,
        // 2nd param is the function that each item is passed to
        function (item, callback) {
            // Call an asynchronous function, often a save() to DB

            var historyTimeLineToadd = new HistoryTimelineModel({
                text: item.text,
                start_year: item.start_year,
                end_year: item.end_year,
                type: item.type
            });

            /* save the historyTime to db*/
            historyTimeLineToadd.save(function (err, doc) {
                if (err) {
                    console.log("error in save originalText to db ");
                    console.log(err);
                    callback(false);
                } else {
                    historyTimeLineArray.push(doc._id);
                    callback();
                }
            })
        },
        // 3rd param is the function to call when everything's done
        function (err) {
            // All tasks are done now
            callback(err, historyTimeLineArray);
        }
    );
}

/////////////////////////////////////// ***  Academy  *** /////////////////////////////

function addAcademy(academy, callback) {

        var academyToadd = new AcademyModel({
            academy_type: academy.academy_type,
            degree_name: academy.degree_name,
            degree_type: academy.degree_type
        });

        /* save the academy to db*/
        academyToadd.save(function (err, doc) {
            if (err) {
                console.log("error in save academy to db ");
                console.log(err);
                callback(false);
            } else {
                callback(doc._id);
            }
        })
}

/////////////////////////////////////// ***  Requirements  *** /////////////////////////////

// Add Requirements
function addRequirements(requirements, callback) {

    console.log("im in Requirements function");

    var requirementsArr = [];

    // 1st para in async.each() is the array of items
    async.each(requirements,
        // 2nd param is the function that each item is passed to
        function (item, callback) {
            // Call an asynchronous function, often a save() to DB

            buildProfessionalKnowledge(item.combination, function (err, professionalKnowledgeArr) {
                if (err) {
                    console.log("error in save requirements combination to db ");
                    console.log(err);
                    callback(false);
                } else {
                    var combinationToadd = new RequirementsModel({
                        combination: professionalKnowledgeArr
                    });

                    /* save the  the requirements combination to db*/
                    combinationToadd.save(function (err, doc) {
                        if (err) {
                            console.log("error in save requirements combination to db ");
                            console.log(err);
                            callback(false);
                        } else {
                            requirementsArr.push(doc._id);
                            callback();
                        }
                    })
                }
            })
        },
        // 3rd param is the function to call when everything's done
        function (err) {
            // All tasks are done now
            if (err) {
                console.log("error in save requirements combination to db ");
                console.log(err);
                callback(false);
            } else {
                callback(requirementsArr);
            }
        }
    );
}

function buildProfessionalKnowledge(professionalKnowledges, callback) {

    var professionalKnowledgeArr = [];

    // 1st para in async.each() is the array of items
    async.each(professionalKnowledges,
        // 2nd param is the function that each item is passed to
        function (item, callback) {
            // Call an asynchronous function, often a save() to DB

            var professionalKnowledgeToadd = new ProfessionalKnowledgeModel({
                name: item.name,
                years: item.years,
                mode: item.mode,
                percentage: item.percentage
            });

            /* save the professionalKnowledge to db*/
            professionalKnowledgeToadd.save(function (err, doc) {
                if (err) {
                    console.log("error in save professionalKnowledge to db " + err);
                    callback(false);
                } else {
                    professionalKnowledgeArr.push(doc._id);
                    callback();
                }
            })
        },
        // 3rd param is the function to call when everything's done
        function (err) {
            // All tasks are done now
            callback(err, professionalKnowledgeArr);
        }
    );
}

/////////////////////////////////////// ***  Status  *** /////////////////////////////

// Add Status
function rateCV(matching_object_id, status, callback) {

    console.log("im in rateCV function");
    var class_data = JSON.parse(status);
    var statusToAdd = new StatusModel({
        seen: null,
        rate: {
            status: true,
            stars: class_data.stars,
            description: class_data.description,
            timestamp: Date.now()
        },
        received: null
    });

    /* save the Status to db*/
    statusToAdd.save(function (err, doc) {
        if (err) {
            console.log("error in save Status to db ");
            callback(false);
        }

        var query = {"_id": matching_object_id};
        var update = {
            status: {
                status_id: doc._id,
                current_status: class_data.current_status
            }
        };
        var options = {new: true};
        MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, doc) {
            if (err) {
                console.log('error in save Status id to matching object');
            } else {
                callback(doc);
            }
        });
    });
}

// Add Status
function updateRateCV(matching_object_id, status, callback) {

    console.log("im in updateRateCV function");
    var class_data = JSON.parse(status);

    var query = {"_id": matching_object_id};
    var update = {
            "status.current_status": class_data.current_status
    };
    var options = {new: true};
    MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, doc) {
        if (err) {
            console.log('error in finding cv ' + err);
        } else {
            console.log("doc.status.status_id " + doc);
            var query = {"_id": doc.status.status_id};
            var update = {
                "rate.stars": class_data.stars,
                "rate.description": class_data.description,
                "rate.timestamp": Date.now()
            };
            var options = {new: true};
            StatusModel.findOneAndUpdate(query, update, options, function (err, doc) {
                if (err) {
                    console.log('error in update rate for cv ' + err);
                } else {
                    callback(doc);
                }
            });
        }
    });
}

/////////////////////////////////////// ***  Personal Properties  *** /////////////////////////////

// Add Status
function addPersonalProperties(personalProperties, callback) {

    console.log("im in personalProperties function");

    var class_data = personalProperties;
    var personalPropertiesToAdd = new PersonalPropertiesModel({
        university_degree: class_data['university_degree'],
        degree_graduation_with_honors: class_data['degree_graduation_with_honors'],
        above_two_years_experience: class_data['above_two_years_experience'],
        psychometric_above_680: class_data['psychometric_above_680'],
        multilingual: class_data['multilingual'],
        volunteering: class_data['volunteering'],
        full_army_service: class_data['full_army_service'],
        officer: class_data['officer'],
        high_school_graduation_with_honors: class_data['high_school_graduation_with_honors'],
        youth_movements: class_data['youth_movements']
    });

    /* save the Personal Properties to db*/
    personalPropertiesToAdd.save(function (err, doc) {
        if (err) {
            console.log("error in save Personal Properties to db ");
            callback(false);
        } else {
            console.log("Personal Properties saved to DB");
            callback(doc);
        }
    });

}


/////////////////////////////////////// ***  Formulas  *** /////////////////////////////

// Add Formula
function addFormula(formula, callback) {

    console.log("im in addFormula function");

    var class_data = formula;
    var formulaToAdd = new FormulaModel({
        locations: class_data['locations'],
        candidate_type: class_data['candidate_type'],
        scope_of_position: class_data['scope_of_position'],
        academy: class_data['academy'],
        requirements: class_data['requirements']
    });


    /*save the Formula in db*/
    formulaToAdd.save(function (err, doc) {
        if (err) {
            console.log("error insert formula to DB");
            callback(false);
        } else {
            console.log("formula saved to DB");
            callback(doc);
        }
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
            } else {
                callback(result);
            }

        });
    });
}



///////////////////////////////////////////// *** Employer *** ///////////////////////

function getJobsBySector(userId, sector, isArchive, callback) {

    var query = MatchingObjectsModel.find(
        {google_user_id: userId, sector: sector, active: true, matching_object_type: "job", archive: isArchive}
    ).populate('original_text')
        .populate('academy');


    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        } else {
            callback(results);
        }
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
            ).populate('user').populate('original_text')
                .populate('academy');
            query.exec(function (err, results) {
                if (err) {
                    console.log("error");
                    callback(false);
                } else {
                    callback(results);
                }
            });
        } else {
            errorMessage = "jobs are empty";
            console.log(errorMessage);
            callback(results[0].cvs);
        }

    });
}

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
            ).populate('user')
                .populate('status.status_id')
                .populate('original_text')
                .populate('academy');
            query.exec(function (err, results) {
                if (err) {
                    console.log("error");
                    callback(false);
                } else {
                    callback(results);
                }
            });
        } else {
            errorMessage = "jobs are empty";
            console.log(errorMessage);
            callback(results[0].cvs);
        }

    });
}


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
            ).populate('user')
                .populate('status.status_id')
                .populate('original_text')
                .populate('academy');
            query.exec(function (err, results) {
                if (err) {
                    console.log("error");
                    callback(false);
                } else {
                    callback(results);
                }
            });
        } else {
            errorMessage = "jobs are empty";
            console.log(errorMessage);
            callback(results);
        }

    });
}


///////////////////////////////////////////// *** JobSeeker *** ///////////////////////


function getAllJobsBySector(userId, sector, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500,error);
        } else {

            if (results.length > 0) {

                var query = MatchingObjectsModel.find(
                    {
                        sector: sector,
                        active: true,
                        matching_object_type: "job",
                        _id: {$nin: results[0].jobs},
                        archive: false
                    }
                ).populate('original_text')
                    .populate('academy');

                query.exec(function (err, results) {

                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to get the jobs from the db";
                        callback(500,error);
                    } else {
                        console.log("the jobs extracted successfully from the db");
                        callback(200, results);
                    }
                });
            }else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404,error);
            }
        }
    });
}

function getMyJobs(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {jobs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500,error);
        } else {
            if (results.length > 0) {
                var query = MatchingObjectsModel.find(
                    {active: true, matching_object_type: "job", _id: {$in: results[0].jobs}, archive: false}
                ).populate('status.status_id')
                    .populate('original_text')
                    .populate('academy');

                query.exec(function (err, results) {

                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to get the jobs from the db";
                        callback(500,error);
                    } else {
                        console.log("the jobs extracted successfully from the db");
                        callback(200, results);
                    }
                });
            }else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404,error);
            }
        }
    });
}

function getFavoritesJobs(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {favorites: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500,error);
        } else {
            if (results.length > 0) {
                var query = MatchingObjectsModel.find(
                    {active: true, matching_object_type: "job", _id: {$in: results[0].favorites}, archive: false}
                ).populate('status.status_id')
                    .populate('original_text')
                    .populate('academy');

                query.exec(function (err, results) {

                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to get the favorite jobs from the db";
                        callback(500, error);
                    } else {
                        console.log("the favorite jobs extracted successfully from the db");
                        callback(200, results);
                    }
                });
            }else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404,error);
            }
        }
    });
}

function getIdOfCV(userId, callback) {

    var query = MatchingObjectsModel.find(
        {user: userId, active: true, matching_object_type:"cv"}, {_id: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the id of cv from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("id of the cv extracted successfully from the db");
                callback(200, results);
            }else {
                console.log("cv not exists for this user");
                error.error = "cv not exists for this user";
                callback(404,error);
            }
        }
    })
}

function addCvToJob(jobId, cvId, callback) {

    var matchObjectToSend = {
        job: null,
        cv: null
    };

    getMatchingObject(jobId, "job", function (status,jobResults) {
        if (status === 200) {
            matchObjectToSend.job = jobResults[0];
        }else {
            console.log("cannot extract job from db");
            return callback(status,jobResults);
        }

        getMatchingObject(cvId, "cv", function (status,CvResults) {
            if (status === 200) {
                matchObjectToSend.cv = CvResults[0];
            }else {
                console.log("cannot extract cv from db");
                return callback(status,CvResults);
            }

            unirest.post('https://matcherlogic.herokuapp.com/addFormula')
                .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                .send(matchObjectToSend)
                .end(function (response) {
                    if (validation.matcherResponse(response.body)) {
                        if (response.code == 200) {
                            saveMatcherFormula(cvId, response.body, function (status, result) {

                                if (status == 200) {

                                    if (response.body.total_grade > jobResults[0].compatibility_level) {

                                        var query = {"_id": cvId};
                                        var update = {
                                            "status.current_status": "unread",
                                            compatibility_level: response.body.total_grade
                                        };
                                        var options = {new: true, upsert: true};
                                        MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, doc) {
                                            if (err) {
                                                console.log('error in updating data for cv ' + err);
                                                error.error = "error in updating data for cv";
                                                callback(404, error);
                                            } else {


                                                var query = {
                                                    '_id':  CvResults[0].user
                                                };
                                                var doc = {
                                                    $addToSet: {'jobs': jobId}
                                                };
                                                var options = {
                                                    upsert: true,new:true
                                                };
                                                UserModel.findOneAndUpdate(query, doc, options, function (err, userResults) {
                                                    if (err) {
                                                        console.log("error in add job to user " + err);
                                                        error.error = "error in add job to user";
                                                        callback(404, error);

                                                    } else {
                                                        var query = {
                                                            '_id': jobId
                                                        };
                                                        var doc = {
                                                            $addToSet: {'cvs': cvId}
                                                        };
                                                        var options = {
                                                            upsert: true,new:true
                                                        };
                                                        MatchingObjectsModel.findOneAndUpdate(query, doc, options, function (err, results) {
                                                            if (err) {
                                                                console.log("error in add cv to job " + err);
                                                                error.error = "error in add cv to job";
                                                                callback(404, error);

                                                            } else {
                                                                console.log("cv added to the job successfully");
                                                                callback(200, userResults);
                                                            }
                                                        });
                                                    }
                                                });

                                            }
                                        });
                                    } else {
                                        errorMessage = "cannot add cv to the job because it didn't passed the compatibility level of job";
                                        console.log(errorMessage);
                                        error.error = errorMessage;
                                        callback(404, error);
                                    }
                                } else {
                                    // error save matcher formula to db
                                    callback(status, result);
                                }

                            });
                        } else {
                            console.log("error occurred during matcher process: ", response.body);
                            callback(response.code, response.body);
                        }
                    }else {
                        errorMessage = "matcher response format is incorrect";
                        console.log(errorMessage);
                        error.error = errorMessage;
                        callback(404, error);
                    }
                });
        })
    });






}


///////////////////////////////////////////// *** Matcher *** ///////////////////////

function saveMatcherFormula(cvId,matcherResponse, callback) {

    buildMatchingDetails(matcherResponse.formula.requirements.details , function(err,matchingDetailsArray) {

        if (err) {
            console.log("error insert MatcherFormula to DB");
            error.error = "error insert MatcherFormula to DB";
            callback(500, error);

        }else {

            var formulaToAdd = new FormulaModel({
                locations: matcherResponse.formula.locations,
                candidate_type: matcherResponse.formula.candidate_type,
                scope_of_position: matcherResponse.formula.scope_of_position,
                academy: matcherResponse.formula.academy,
                matching_requirements:{
                    details:matchingDetailsArray,
                    grade: matcherResponse.formula.requirements.grade
                }
            });

            /*save the MatcherFormula in db*/
            formulaToAdd.save(function (err, result) {
                if (err) {
                    console.log("error insert MatcherFormula to DB " + err);
                    error.error = "error insert MatcherFormula to DB";
                    callback(500, error);
                } else {
                    var query = {"_id": cvId};
                    var update = {
                        "formula": result._id
                    };
                    var options = {new: true,upsert:true};
                    MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
                        if (err) {
                            console.log('error in updating formula id ' + err);
                            error.error = "error in updating formula id to the cv";
                            callback(500, error);
                        } else {
                            console.log("matcher formula saved successfully to db")
                            callback(200,matcherResponse);
                        }
                    });
                }
            });
        }
    });
}

function buildMatchingDetails(matchingDetails, callback) {

    if (typeof matchingDetails !== 'undefined' && matchingDetails.length > 0) {

        var matchingDetailsArray = [];

        // 1st para in async.each() is the array of items
        async.each(matchingDetails,
            // 2nd param is the function that each item is passed to
            function (item, callbackAsync) {
                // Call an asynchronous function, often a save() to DB

                var matchingDetailsToAdd = new MatchingDetailsModel({
                    name: item.name,
                    grade: item.grade
                });

                /* save the historyTime to db*/
                matchingDetailsToAdd.save(function (err, result) {
                    if (err) {
                        console.log("error in save matchingDetails to db " + err);
                        return callbackAsync(new Error("error in save matchingDetails to db "));
                    } else {
                        matchingDetailsArray.push(result._id);
                        callbackAsync();
                    }
                })
            },
            // 3rd param is the function to call when everything's done
            function (err) {
                // All tasks are done now
                callback(err, matchingDetailsArray);
            }
        );
    }else {
        callback("matching details is empty or undefined",[])
    }


}

///////////////////////////////////////////// *** Utils *** ///////////////////////

function getKeyWordsBySector(sector,callback) {

    var query = KeyWordsModel.find({sector: sector});

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the keywords from DB";
            callback(500,error);
        } else {

            if (results.length > 0) {
                console.log("the keywords extracted successfully from the db ", results);
                callback(200,results[0].key_words);
            }else {
                console.log("sector not exists");
                error.error = "sector not exists";
                callback(404,error);
            }


        }
    });

}


///////////////////////////////////////////// *** EXPORTS *** ///////////////////////
exports.addMatchingObject = addMatchingObject;
exports.deleteMatchingObject = deleteMatchingObject;
exports.updateMatchingObject = updateMatchingObject;
exports.getMatchingObject = getMatchingObject;

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;
exports.getFavoriteCvs = getFavoriteCvs;

exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;
exports.getFavoritesJobs = getFavoritesJobs;
exports.getIdOfCV = getIdOfCV;
exports.addCvToJob = addCvToJob;

exports.saveMatcherFormula = saveMatcherFormula;

exports.getKeyWordsBySector = getKeyWordsBySector;