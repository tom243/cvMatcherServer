var async = require("async");
var unirest = require('unirest');
var validation = require("./../utils/validation");
var matchingObjectDAO = require("./matchingObjectDAO");

var schemas = require('./../schemas/schemas');

var JobSeekerJobsModel = schemas.JobSeekerJobsModel;
var UserModel = schemas.UserModel;
var MatchingObjectsModel = schemas.MatchingObjectsModel;
var CompanyModel = schemas.CompanyModel;
var FormulaModel = schemas.FormulaModel;
var MatchingDetailsModel = schemas.MatchingDetailsModel;

var errorMessage;

var error = {
    error: null
};

///////////////////////////////////////////// *** JobSeeker *** ///////////////////////


function getAllJobsBySector(userId, sector, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {jobs: 1}
    ).populate({
            path: 'jobs',
            select: 'job'
        });

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500, error);
        } else {

            if (results.length > 0) {

                var jobs = [];
                for (var i = 0; i < results[0].jobs.length; i++) {
                    jobs.push(results[0].jobs[i].job);
                }

                var query = MatchingObjectsModel.find(
                    {
                        sector: sector,
                        active: true,
                        matching_object_type: "job",
                        _id: {$nin: jobs},
                        archive: false
                    }
                ).populate('original_text')
                    .populate('academy')
                    .populate({
                        path: 'user',
                        populate: {path: 'company'}
                    });

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
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });
}

function getMyJobs(userId, active, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {jobs: 1}
    )
        .populate({
            path: 'jobs',
            match: {
                active: active
            },
            model: JobSeekerJobsModel,
            populate: {
                path: 'job',
                populate: {
                    path: 'original_text academy user',
                    populate: {
                        path: 'company',
                        model: CompanyModel
                    }
                }
            }
        })
        .populate({
            path: 'jobs',
            match: {
                active: active
            },
            populate: {
                path: 'cv',
                select: 'status hired',
                populate: {path: 'status.status_id'}
            }

        });

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the jobs from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("the jobs extracted successfully from the db");
                callback(200, results);
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });
}

function getFavoritesJobs(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {jobs: 1}
    )
        .populate({
            path: 'jobs',
            match: {
                active: true,
                favorite: true
            },
            populate: {
                path: 'job',
                populate: {
                    path: 'original_text academy user',
                    populate: {
                        path: 'company',
                        model: CompanyModel
                    }
                }
            }
        })
        .populate({
            path: 'jobs',
            match: {
                active: true,
                favorite: true
            },
            populate: {
                path: 'cv',
                select: 'status hired',
                populate: {path: 'status.status_id'}
            }

        });

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the jobs from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("the jobs extracted successfully from the db");
                callback(200, results);
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });
}

var addCvToJobFunctions = (function () {

    return {
        getJob: function (jobId, callback) {

            matchingObjectDAO.getMatchingObject(jobId, "job", function (status, jobResults) {
                if (status === 200) {
                    //matchObjectToSend.job = jobResults[0];
                    callback(null, jobResults[0]);
                } else {
                    console.log("cannot extract job from db");
                    callback(status, jobResults);
                }
            });
        },
        getCV: function (cvId, callback) {

            matchingObjectDAO.getMatchingObject(cvId, "cv", function (status, cvResults) {
                if (status === 200) {
                    //matchObjectToSend.cv = CvResults[0];
                    callback(null, cvResults[0]);
                } else {
                    console.log("cannot extract cv from db");
                    callback(status, cvResults);
                }

            });
        },
        addJobToUser: function (userId, jobId, cvId, callback) {


            var jobToAdd = new JobSeekerJobsModel({
                job: jobId,
                cv: cvId
            });


            /*save the Formula in db*/
            jobToAdd.save(function (err, doc) {
                if (!err) {

                    console.log("job seeker job saved successfully to db");

                    var query = {
                        '_id': userId
                    };
                    var docToAdd = {
                        $addToSet: {'jobs': doc._id}
                    };
                    var options = {
                        new: true
                    };
                    UserModel.findOneAndUpdate(query, docToAdd, options, function (err, results) {
                        if (err) {
                            console.log("error in add job to user " + err);
                            error.error = "error in add job to user";
                            callback(500, error);

                        } else {
                            if (results !== null) {
                                callback(null, results);
                            } else {
                                errorMessage = "user not exists";
                                console.log(errorMessage);
                                error.error = errorMessage;
                                callback(500, error);
                            }
                        }
                    });
                } else {
                    console.log("something went wrong " + err);
                    error.error = "something went wrong while trying to save job seeker job";
                    callback(500, error);
                }
            });

        },

        updateDataForCV: function (totalGrade, cvId, callback) {

            var query = {"_id": cvId};
            var update = {
                "status.current_status": "unread",
                compatibility_level: totalGrade
            };
            var options = {new: true};
            MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
                if (err) {
                    console.log('error in updating data for cv ' + err);
                    error.error = "error in updating data for cv";
                    callback(500, error);
                } else {
                    if (results !== null) {
                        callback();
                    } else {
                        errorMessage = "cv not exists";
                        console.log(errorMessage);
                        error.error = errorMessage;
                        callback(500, error);
                    }
                }
            });
        },

        sendCvForJob: function (cvId, jobId, callback) {

            var query = {
                '_id': jobId
            };
            var doc = {
                $addToSet: {'cvs': cvId}
            };
            var options = {
                new: true
            };
            MatchingObjectsModel.findOneAndUpdate(query, doc, options, function (err, results) {
                if (err) {
                    console.log("error in add cv to job " + err);
                    error.error = "error in add cv to job";
                    callback(500, error);

                } else {

                    if (results !== null) {
                        console.log("cv added to the job successfully");
                        callback();
                    } else {
                        errorMessage = "job not exists";
                        console.log(errorMessage);
                        error.error = errorMessage;
                        callback(500, error);
                    }

                }
            });

        },

        copyCV: function (cv, callback) {

            matchingObjectDAO.addMatchingObject(cv, function (status, results) {

                if (status === 200) {
                    callback(null, results._id);
                } else {
                    callback(status, results);
                }
            });
        },

        ///////////////////////////////////////////// *** Matcher *** ///////////////////////

        saveMatcherFormula: function (cvId, matcherResponse, callback) {

            buildMatchingDetails(matcherResponse.formula.requirements.details, function (err, matchingDetailsArray) {

                if (err) {
                    console.log("error insert MatcherFormula to DB");
                    error.error = "error insert MatcherFormula to DB";
                    callback(500, error);

                } else {

                    var formulaToAdd = new FormulaModel({
                        locations: matcherResponse.formula.locations,
                        candidate_type: matcherResponse.formula.candidate_type,
                        scope_of_position: matcherResponse.formula.scope_of_position,
                        academy: matcherResponse.formula.academy,
                        matching_requirements: {
                            details: matchingDetailsArray,
                            grade: matcherResponse.formula.requirements.grade
                        }
                    });

                    /*save the MatcherFormula in db*/
                    formulaToAdd.save(function (err, result) {
                        if (err) {
                            console.log("error while trying to insert MatcherFormula " + err);
                            error.error = "error while trying to insert MatcherFormula";
                            callback(500, error);
                        } else {
                            var query = {"_id": cvId};
                            var update = {
                                "formula": result._id
                            };
                            var options = {new: true};
                            MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err) {
                                if (err) {
                                    console.log('error in updating formula id ' + err);
                                    error.error = "error in updating formula id to the cv";
                                    callback(500, error);
                                } else {
                                    console.log("matcher formula saved successfully");
                                    callback(null, matcherResponse);
                                }
                            });
                        }
                    });
                }
            });
        },

        predictorCheck: function (userPersonalProperties, jobUser, cvId, callback) {

            var query = UserModel.find(
                {_id: jobUser, active: true}, {company: 1}
            )
                .populate({
                    path: 'company',
                    select: 'employees',
                    populate: {path: 'employees'}
                }).limit(1);

            query.exec(function (err, results) {

                if (err) {
                    console.log("something went wrong " + err);
                    error.error = "something went wrong while trying to get the personal properties";
                    callback(500, error);
                } else {
                    if (results.length > 0) {

                        console.log("the personal properties extracted successfully");

                        // predictor is accurate with a minimum of 20 employers

                        if (results[0].company.employees.length > 19) {
                            console.log("employees Array size bigger then 19");

                            var predictObjectToSend = {
                                employees: results[0].company.employees,
                                job_seeker: userPersonalProperties
                            };

                            //console.log("predictObjectToSend", JSON.parse(JSON.stringify(predictObjectToSend)));
                            unirest.post('https://matcherpredictor.herokuapp.com/prediction')
                                .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                                .send(predictObjectToSend)
                                .end(function (response) {
                                    if (response.code == 200) {

                                        if (validation.predictorResponse(response.body)) {

                                            var query = {"_id": cvId};
                                            var update = {
                                                predict_result: response.body
                                            };
                                            var options = {new: true};
                                            MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
                                                if (err) {
                                                    console.log("something went wrong " + err);
                                                    error.error = "something went wrong while trying to update predictor result";
                                                    callback(500, error);
                                                } else {
                                                    if (results !== null) {
                                                        console.log("the predictor result updated successfully");
                                                        callback(null, results);
                                                    } else {
                                                        console.log("cv not exists");
                                                        error.error = "cv not exists";
                                                        callback(404, error);
                                                    }
                                                }
                                            });

                                        } else {
                                            errorMessage = "predictor response format is incorrect";
                                            console.log(errorMessage);
                                            error.error = errorMessage;
                                            callback(400, error);
                                        }
                                    } else {
                                        console.log("error occurred during predictor process: ", response.body);
                                        callback(response.code, response.body);
                                    }
                                });

                        } else {
                            errorMessage = "employees Array size below 20";
                            console.log(errorMessage);
                            error.error = errorMessage;
                            callback(null, error);
                        }

                    } else {
                        console.log("user not exists");
                        error.error = "user not exists";
                        callback(404, error);
                    }
                }
            });

        }
    };

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
                    });
                },
                // 3rd param is the function to call when everything is done
                function (err) {
                    // All tasks are done now
                    callback(err, matchingDetailsArray);
                }
            );
        } else {
            console.log("matching details is empty or undefined");
            callback(false, []);
        }

    }

})();

function addCvToJob(jobId, cvId, addCvCallback) {

    async.parallel([
        async.apply(addCvToJobFunctions.getJob, jobId),
        async.apply(addCvToJobFunctions.getCV, cvId)

    ], function (status, results) {

        var matchObjectToSend = {
            job: results[0],
            cv: results[1]
        };

        if (status === null) {

            unirest.post('https://matcherlogic.herokuapp.com/calculateMatching')
                .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                .send(matchObjectToSend)
                .end(function (response) {
                    if (response.code == 200) {

                        if (validation.matcherResponse(response.body)) {

                            if (response.body.total_grade > matchObjectToSend.job.compatibility_level) {


                                var parallelTasks =  function (totalGrade, jobId, CvUser, userPersonalProperties,
                                                       jobUser, cvId, callback) {

                                    var parallelArr = [
                                        async.apply(addCvToJobFunctions.saveMatcherFormula, cvId, response.body),
                                        async.apply(addCvToJobFunctions.updateDataForCV, totalGrade, cvId),
                                        async.apply(addCvToJobFunctions.addJobToUser, CvUser, jobId, cvId),
                                        async.apply(addCvToJobFunctions.sendCvForJob, cvId, jobId),
                                        async.apply(addCvToJobFunctions.predictorCheck, userPersonalProperties,
                                            jobUser, cvId)
                                    ];

                                    async.parallel(parallelArr, callback);
                                };

                                async.waterfall([
                                    async.apply(addCvToJobFunctions.copyCV, matchObjectToSend.cv),
                                    async.apply(parallelTasks, response.body.total_grade,
                                        jobId, matchObjectToSend.cv.user,
                                        matchObjectToSend.cv.personal_properties,
                                        matchObjectToSend.job.user)

                                ], function (status, results) {

                                    if (status === null) {
                                        addCvCallback(200, results[3]);
                                    } else {
                                        errorMessage = "error in add cv to job ";
                                        console.log(errorMessage);
                                        error.error = errorMessage;
                                        addCvCallback(500, error);
                                    }

                                });
                            } else {
                                errorMessage = "cannot add cv to the job because it didn't passed the compatibility level of job";
                                console.log(errorMessage);
                                error.error = errorMessage;
                                addCvCallback(404, error);
                            }

                        } else {
                            errorMessage = "matcher response format is incorrect";
                            console.log(errorMessage);
                            error.error = errorMessage;
                            addCvCallback(400, error);
                        }
                    } else {
                        console.log("error occurred during matcher process: ", response.body);
                        addCvCallback(response.code, response.body);
                    }
                });
        } else {
            errorMessage = "something went wrong while trying send the cv";
            console.log(errorMessage);
            error.error = errorMessage;
            addCvCallback(404, error);
        }

    });

}

function updateFavoriteJob(jobId, isFavorite, callback) {

    var query = {
        '_id': jobId
    };
    var doc = {
        favorite: isFavorite
    };
    var options = {
        new: true
    };
    JobSeekerJobsModel.findOneAndUpdate(query, doc, options, function (err, results) {
        if (err) {
            console.log("error in update favorite job " + err);
            error.error = "error in update favorite job";
            callback(500, error);

        } else {
            if (results !== null) {
                console.log("job favorite updated successfully");
                callback(200, results);
            } else {
                errorMessage = "job not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(500, error);
            }
        }
    });

}

function updateActivityJob(jobId, isActive, callback) {

    var query = {
        '_id': jobId
    };
    var doc = {
        active: isActive
    };
    var options = {
        new: true
    };
    JobSeekerJobsModel.findOneAndUpdate(query, doc, options, function (err, results) {
        if (err) {
            errorMessage = "error in change job activity ";
            console.log(errorMessage + err);
            error.error = errorMessage;
            callback(500, error);

        } else {
            if (results !== null) {
                console.log("job activity changed successfully");
                callback(200, results);
            } else {
                errorMessage = "job not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(500, error);
            }
        }
    });

}

function getLastTenJobs(userId, sector, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {jobs: 1}
    ).populate({
        path: 'jobs',
        select: 'job'
    });

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500, error);
        } else {

            if (results.length > 0) {

                var jobs = [];
                for (var i = 0; i < results[0].jobs.length; i++) {
                    jobs.push(results[0].jobs[i].job);
                }

                var query = MatchingObjectsModel.find(
                    {
                        sector: sector,
                        active: true,
                        matching_object_type: "job",
                        _id: {$nin: jobs},
                        archive: false
                    }
                ).sort({date:-1}).limit(30)
                    .populate({
                        path: 'requirements',
                        populate: {path: 'combination'}
                    })
                    .populate("formula")
                    .populate('original_text')
                    .populate('academy')
                    .populate({
                        path: 'user',
                        populate: {path: 'company'}
                    });

                query.exec(function (err, results) {

                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to get the jobs from the db";
                        callback(500, error);
                    } else {
                        console.log("the jobs extracted successfully from the db");
                        callback(null, results);
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

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;
exports.getFavoritesJobs = getFavoritesJobs;
exports.addCvToJob = addCvToJob;
exports.updateFavoriteJob = updateFavoriteJob;
exports.updateActivityJob = updateActivityJob;
exports.getLastTenJobs = getLastTenJobs;