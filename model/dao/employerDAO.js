/*jslint node: true */
"use strict";

var async = require("async");

var schemas = require("./../schemas/schemas");

var MatchingObjectsModel = schemas.MatchingObjectsModel;
var StatusModel = schemas.StatusModel;
var PersonalPropertiesModel = schemas.PersonalPropertiesModel;
var CompanyModel = schemas.CompanyModel;
var UserModel = schemas.UserModel;

var errorMessage;

var error = {
    error: null
};

///////////////////////////////////////////// *** Employer *** ///////////////////////

function getJobsBySector(userId, sector, isArchive, callback) {

    var query = MatchingObjectsModel.find(
        {user: userId, sector: sector, active: true, matching_object_type: "job", archive: isArchive}
    ).populate("original_text")
        .populate("academy");


    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the jobs from the db";
            callback(500, error);
        } else {
            console.log("the jobs extracted successfully from the db");
            callback(200, results);
        }
    });
}

function getUnreadCvsForJob(userId, jobId, callback) {

    var query = MatchingObjectsModel.find(
        {_id: jobId, user: userId, active: true, matching_object_type: "job"},
        {cvs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the job from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                if (results[0].cvs.length > 0) {

                    query = MatchingObjectsModel.find(
                        {
                            _id: {$in: results[0].cvs},
                            active: true,
                            $or: [{"status.current_status": "unread"}, {"status.current_status": "seen"}],
                            matching_object_type: "cv"
                        }
                    ).populate("user").populate("original_text")
                        .populate("academy");
                    query.exec(function (err, results) {
                        if (err) {
                            console.log("something went wrong " + err);
                            error.error = "something went wrong while trying to get the  unread cvs for job from the db";
                            callback(500, error);
                        } else {
                            console.log("the cvs extracted successfully from the db");
                            callback(200, results);
                        }
                    });
                } else {
                    console.log("no cvs for this job");
                    callback(200, results[0].cvs);
                }
            } else {
                errorMessage = "job not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }

    });
}

function getRateCvsForJob(userId, jobId, current_status, callback) {

    var query = MatchingObjectsModel.find(
        {_id: jobId, user: userId, active: true, matching_object_type: "job"},
        {cvs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the job from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                if (results[0].cvs.length > 0) {

                    query = MatchingObjectsModel.find(
                        {
                            _id: {$in: results[0].cvs},
                            active: true,
                            "status.current_status": current_status,
                            matching_object_type: "cv",
                            hired: false
                        }
                    ).populate("user")
                        .populate("status.status_id")
                        .populate("original_text")
                        .populate("academy");
                    query.exec(function (err, results) {
                        if (err) {
                            console.log("something went wrong " + err);
                            error.error = "something went wrong while trying to get the " + current_status +
                                " cvs for job from the db";
                            callback(500, error);
                        } else {
                            console.log("the cvs extracted successfully from the db");
                            callback(200, results);
                        }
                    });
                } else {
                    errorMessage = "jobs are empty";
                    console.log(errorMessage);
                    callback(200, results[0].cvs);
                }
            } else {
                errorMessage = "job not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }

    });
}

function seenCV(cvId, timestamp, callback) {

    var query = {"_id": cvId};
    var update = {
        status: {
            current_status: "seen",
            timestamp: timestamp
        }
    };
    var options = {new: true};
    MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to save seen to cv";
            callback(500, error);
        } else {
            if (results !== null) {
                console.log("cv set to seen successfully");
                callback(200, results);
            } else {
                errorMessage = "cv not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }
    });

}

// Add Status
function rateCV(cvId, status, callback) {

    var statusToAdd = new StatusModel({
        rate: {
            stars: status.stars,
            description: status.description,
            timestamp: status.timestamp
        }
    });

    /* save the Status to db*/
    statusToAdd.save(function (err, result) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to save the status to the db";
            callback(500, error);
        } else {

            var query = {"_id": cvId};
            var update = {
                status: {
                    status_id: result._id,
                    current_status: status.current_status
                }
            };
            var options = {new: true};
            MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
                if (err) {
                    console.log("something went wrong " + err);
                    error.error = "something went wrong while trying to save the Status id to cv";
                    callback(500, error);
                } else {
                    if (results !== null) {
                        console.log("cv rated successfully");
                        callback(200, result);
                    } else {
                        errorMessage = "cv not exists";
                        console.log(errorMessage);
                        error.error = errorMessage;
                        callback(404, error);
                    }
                }
            });
        }
    });
}

// Add Status
function updateRateCV(cvId, status, callback) {

    var query = {"_id": cvId};
    var update = {
        "status.current_status": status.current_status
    };
    var options = {new: true};
    MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, result) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to update the current status of the cv";
            callback(500, error);
        } else {

            if (result !== null) {
                query = {"_id": result.status.status_id};
                if (status.current_status === "liked") {
                    update = {
                        "rate.stars": status.stars,
                        "rate.timestamp": status.timestamp
                    };
                } else { // unliked
                    update = {
                        "rate.description": status.description,
                        "rate.timestamp": status.timestamp
                    };
                }
                options = {new: true};
                StatusModel.findOneAndUpdate(query, update, options, function (err, result) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to update the current status of the cv";
                        callback(500, error);
                    } else {
                        if (result !== null) {
                            console.log("status of cv updated successfully");
                            callback(200, result);
                        } else {
                            errorMessage = "status id not exists";
                            console.log(errorMessage);
                            error.error = errorMessage;
                            callback(404, error);
                        }
                    }
                });
            } else {
                errorMessage = "cv id not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }
    });
}

function hireToJob(cvId, callback) {

    var query = {
        _id: cvId,
        matching_object_type: "cv",
        active: true
    };
    var update = {
        hired: true
    };
    var options = {new: true, fields: {hired: 1}};
    MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to hire job seeker to job";
            callback(500, error);
        } else {
            if (results !== null) {
                console.log("job seeker hired successfully");
                callback(null, results);
            } else {
                errorMessage = "cv not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }
    });

}

function getHiredCvs(userId, jobId, callback) {

    var query = MatchingObjectsModel.find(
        {_id: jobId, user: userId, active: true, matching_object_type: "job"},
        {cvs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the job from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                if (results[0].cvs.length > 0) {

                    query = MatchingObjectsModel.find(
                        {
                            _id: {$in: results[0].cvs},
                            active: true,
                            matching_object_type: "cv",
                            hired: true
                        }
                    ).populate("user").populate("original_text")
                        .populate("academy");
                    query.exec(function (err, results) {
                        if (err) {
                            console.log("something went wrong " + err);
                            error.error = "something went wrong while trying to get the  hired cvs for job from the db";
                            callback(500, error);
                        } else {
                            console.log("the cvs extracted successfully from the db");
                            callback(200, results);
                        }
                    });
                } else {
                    console.log("no hired cvs for this job");
                    callback(200, results[0].cvs);
                }
            } else {
                errorMessage = "job not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }

    });

}

var setDecisionFunctions = {

    verifyIfDecisionExist: function (personalPropertiesId, callback) {

        var query = PersonalPropertiesModel.find(
            {_id: personalPropertiesId, "decision": {"$exists": true}}
        ).limit(1);

        query.exec(function (err, results) {

            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to find if decision exists";
                callback(500, error);
            } else {
                if (results.length > 0) {
                    console.log("decision exists");
                    callback(null, true);
                } else {
                    console.log("decision not exists");
                    error.error = "decision not exists";
                    callback(null, false);
                }
            }
        });

    },

    incrementPredictCounterByOne : function (companyId, isExist, callback) {

        console.log("isExist " + isExist);

        if (!isExist) {

            var query = {_id: companyId};
            var update = {
                $inc: {predict_count: 1}
            };
            var options = {new: true};
            CompanyModel.findOneAndUpdate(query, update, options, function (err) {
                if (err) {
                    console.log("error while trying to increment predict count " + err);
                    error.error = "error while trying to increment predict count";
                    callback(500,error);
                }else {
                    console.log("predict count incremented by one");
                    callback(null);
                }
            });

        }else { // predict count already exist
            console.log("predict count already exist");
            callback(null);
        }

    },

    setDecisionToPersonalProperties : function (personalPropertiesId, decision, callback) {

        var query = {
            _id: personalPropertiesId
        };
        var update = {
            decision: decision
        };
        var options = {new: true, fields: {decision: 1}};
        PersonalPropertiesModel.findOneAndUpdate(query, update, options, function (err, result) {
            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to update decision";
                callback(500, error);
            } else {
                if (result !== null) {
                    console.log("decision updated successfully");
                    callback(null, result);
                } else {
                    errorMessage = "personal properties not exists";
                    console.log(errorMessage);
                    error.error = errorMessage;
                    callback(404, error);
                }
            }
        });
    }

};

function setDecision(userId, personalPropertiesId, decision, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {company: 1}
    ).limit(1);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {

                async.waterfall([
                    async.apply(setDecisionFunctions.verifyIfDecisionExist, personalPropertiesId),
                    async.apply(setDecisionFunctions.incrementPredictCounterByOne, results[0].company),
                    async.apply(setDecisionFunctions.setDecisionToPersonalProperties, personalPropertiesId, decision)

                ], function (status, results) {

                    if (status === null) {
                        callback(200, results);
                    } else {
                        errorMessage = "error in set decision";
                        console.log(errorMessage);
                        error.error = errorMessage;
                        callback(500, error);
                    }

                });

            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });

}

///////////////////////////////////////////// *** EXPORTS *** ///////////////////////

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;
exports.seenCV = seenCV;
exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;
exports.hireToJob = hireToJob;
exports.getHiredCvs = getHiredCvs;
exports.setDecision = setDecision;