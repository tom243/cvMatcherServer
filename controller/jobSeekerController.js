var jobSeekerDAO = require("./../model/dao/jobSeekerDAO"); // dao = data access object = model
var matchingObjectDAO = require("./../model/dao/matchingObjectDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");
var unirest = require('unirest');
var async = require("async");

var error = {
    error: null
};

////////////////////////////////// *** JobSeeker *** ///////////////////////

//** get jobs by sector for jobSeeker  **//
function getAllJobsBySector(req, res) {

    console.log("in getAllJobsBySector");

    if (validation.getAllJobsBySector(req)) {
        jobSeekerDAO.getAllJobsBySector(req.body.user_id, req.body.sector, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//**  get the jobs that the user has sent his cvs to them  **//
function getMyJobs(req, res) {

    console.log("in getMyJobs");

    if (validation.getMyJobs(req)) {
        jobSeekerDAO.getMyJobs(req.body.user_id, req.body.active, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}
//**  get the  favourites jobs  **//
function getFavoritesJobs(req, res) {

    console.log("in getFavoritesJobs");

    if (validation.getFavoritesJobs(req)) {
        jobSeekerDAO.getFavoritesJobs(req.body.user_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//**  check cv with matcher  **//
function checkCV(req, res) {

    console.log("in checkCV");

    if (validation.checkCV(req)) {

        var matchObjectToSend = {
            job: null,
            cv: null
        };

        matchingObjectDAO.getMatchingObject(req.body.job_id, "job", function (status, results) {
            if (status === 200) {
                matchObjectToSend.job = results[0];
            } else {
                return res.status(status).json(results);
            }

            matchingObjectDAO.getMatchingObject(req.body.cv_id, "cv", function (status, results) {
                if (status === 200) {
                    matchObjectToSend.cv = results[0];
                } else {
                    return res.status(status).json(results);
                }

                unirest.post('https://matcherlogic.herokuapp.com/calculateMatching')
                    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                    .send(matchObjectToSend)
                    .end(function (response) {
                        console.log("response from matcher: ", response.body);
                        if (validation.matcherResponse(response.body)) {
                            res.status(response.code).json(response.body);
                        } else {
                            error.error = "error occurred during matcher process";
                            res.status(400).json(error);
                        }

                    });
            })
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** add the current cv to job **//
function addCvToJob(req, res) {

    console.log("in addCvToJob");

    if (validation.addCvToJob(req)) {
        jobSeekerDAO.addCvToJob(req.body.job_id, req.body.cv_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

function updateFavoriteJob(req, res) {

    console.log("in updateFavoriteJob");

    if (validation.updateFavoriteJob(req)) {
        jobSeekerDAO.updateFavoriteJob(req.body.job_seeker_job_id,
            req.body.favorite, function (status, result) {
                res.status(status).json(result);
            });
    } else {
        utils.sendErrorValidation(res);
    }
}

function updateActivityJob(req, res) {

    console.log("in updateJobSeekerJob");

    if (validation.updateActivityJob(req)) {
        jobSeekerDAO.updateActivityJob(req.body.job_seeker_job_id, req.body.active
            , function (status, result) {
                res.status(status).json(result);
            });
    } else {
        utils.sendErrorValidation(res);
    }

}

getBestMatchJobsFunction = {

    getCurrentCV : function (cvId, type, callback) {

        matchingObjectDAO.getMatchingObject(cvId, type, function (status, result) {

            if (status === 200)  {
                callback(null, result );
            } else {
                callback(status, result);
            }

        })
    }

};

function getBestMatchJobs(req, res) {

    console.log("in getBestMatchJobs");

    var matchObjectToSend = {
        job: null,
        cv: null
    };

    var matcherResponseArr = [];

    if (validation.getBestMatchJobs(req)) {
        async.parallel([
            async.apply(getBestMatchJobsFunction.getCurrentCV, req.body.cv, "cv"),
            async.apply(jobSeekerDAO.getLastTenJobs, req.body.user_id, req.body.sector)

        ], function (status, results) {

            if (status === null) {

                matchObjectToSend.cv = results[0][0];
                // 1st para in async.each() is the array of items
                async.each(results[1],
                    // 2nd param is the function that each item is passed to
                    function (item, callbackAsync) {
                        // Call an asynchronous function
                        matchObjectToSend.job = item;
                        unirest.post('https://matcherlogic.herokuapp.com/calculateMatching')
                            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                            .send(matchObjectToSend)
                            .end(function (response) {

                                if (validation.matcherResponse(response.body)) {

                                    var newItem = item.toObject();
                                    newItem.matcher_grade = response.body.total_grade;

/*                                  console.log("response.body.total_grade ", response.body.total_grade);
                                    console.log("item.matcherGrade" + item.matcherGrade);*/
                                    matcherResponseArr.push(newItem);
                                    callbackAsync();

                                } else {
                                    return callbackAsync(new Error("error occurred during matcher process"));
                                }

                            });

                    },
                    // 3rd param is the function to call when everything is done
                    function (err) {

                        if (err === null) {

                            // All tasks are done now
                            matcherResponseArr.sort(function (a, b) {
                                if (a.matcher_grade > b.matcher_grade) {
                                    return -1;
                                }
                                if (a.matcher_grade < b.matcher_grade) {
                                    return 1;
                                }
                                // a must be equal to b
                                return 0;
                            });
                            // console.log("matcherResponseArr ", matcherResponseArr);
                            res.status(200).json(matcherResponseArr);
                        }else {
                            console.log("something went wrong " + err);
                            var errorMessage = "something went wrong while trying to match top ten jobs";
                            error.error = errorMessage;
                            res.status(500).json(error);
                        }
                    }
                );

            } else {
                console.log("something went wrong while trying to match top ten jobs, status " + status);
                res.status(status).json(results);
            }

        });

    } else {
        utils.sendErrorValidation(res);
    }

}


////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;
exports.getFavoritesJobs = getFavoritesJobs;
exports.checkCV = checkCV;
exports.addCvToJob = addCvToJob;
exports.updateFavoriteJob = updateFavoriteJob;
exports.updateActivityJob = updateActivityJob;
exports.getBestMatchJobs = getBestMatchJobs;