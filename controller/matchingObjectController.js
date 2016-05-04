var matchingObjectDAO = require("./../model/dao/matchingObjectDAO"); // dao = data access object = model
var usersDAO = require("./../model/dao/usersDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");
var unirest = require('unirest');

var error = {
    error: null
};

////////////////////////////////// *** Matching Objects *** ///////////////////////////

//** Adding a new object **//
function addMatchingObject(req, res) {

    console.log("in addMatchingObject");

    if (validation.addMatchingObject(req)) {
        matchingObjectDAO.addMatchingObject(req.body, function (status, result) {

            if(status === 200 && result.matching_object_type === "cv") {
                usersDAO.saveCurrentCV(result.user, result._id, function (status,result) {
                    res.status(status).json(result);
                })
            }else {
                res.status(status).json(result);
            }
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** Delete an existing object **//
function deleteMatchingObject(req, res) {

    console.log("in deleteMatchingObject");

    if (validation.deleteMatchingObject(req)) {
        matchingObjectDAO.deleteMatchingObject(req.body.matching_object_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** Delete an existing object **//
function reviveMatchingObject(req, res) {

    console.log("in reviveMatchingObject");

    if (validation.reviveMatchingObject(req)) {
        matchingObjectDAO.reviveMatchingObject(req.body.matching_object_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** Update an existing object **//
function updateMatchingObject(req, res) {

    console.log("in updateMatchingObject");

    if (validation.updateMatchingObject(req)) {
        matchingObjectDAO.updateMatchingObject(req.body, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** get Matching Object  **//
function getMatchingObject(req, res) {

    console.log("in getMatchingObject");

    if (validation.getMatchingObject(req)) {
        matchingObjectDAO.getMatchingObject(req.body.matching_object_id,
            req.body.matching_object_type, function (status, result) {
                res.status(status).json(result);
            });
    } else {
        utils.sendErrorValidation(res);
    }

}

///////////////////////////////////////////// *** Employer *** ///////////////////////

//** get jobs by sector for specific employer  **//
function getJobsBySector(req, res) {

    console.log("in getJobsBySector");

    if (validation.getJobsBySector(req)) {
        matchingObjectDAO.getJobsBySector(req.body.user_id, req.body.sector,
            req.body.archive, function (status, result) {
                res.status(status).json(result);
            });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** get Unread for specific job  **//
function getUnreadCvsForJob(req, res) {

    console.log("in getUnreadCvsForJob");

    if (validation.getUnreadCvsForJob(req)) {
        matchingObjectDAO.getUnreadCvsForJob(req.body.user_id, req.body.job_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}


//** get liked or unliked CV'S **//
function getRateCvsForJob(req, res) {

    console.log("in getRateCvsForJob");

    if (validation.getRateCvsForJob(req)) {
        matchingObjectDAO.getRateCvsForJob(req.body.user_id, req.body.job_id,
            req.body.current_status, function (status, result) {
                res.status(status).json(result);
            });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** rate specific cv  **//
function rateCV(req, res) {

    console.log("in rateCV");

    if (validation.rateCV(req)) {
        matchingObjectDAO.rateCV(req.body.cv_id, req.body.status, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** update rate for specific cv  **//
function updateRateCV(req, res) {

    console.log("in updateRateCV");

    if (validation.updateRateCV(req)) {
        matchingObjectDAO.updateRateCV(req.body.cv_id, req.body.status, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

// hire job seeker to job
function hireToJob(req, res) {

    console.log("in updateRateCV");

    if (validation.hireToJob(req)) {
        matchingObjectDAO.hireToJob(req.body.cv_id, req.body.job_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

////////////////////////////////// *** JobSeeker *** ///////////////////////

//** get jobs by sector for jobSeeker  **//
function getAllJobsBySector(req, res) {

    console.log("in getAllJobsBySector");

    if (validation.getAllJobsBySector(req)) {
        matchingObjectDAO.getAllJobsBySector(req.body.user_id, req.body.sector, function (status, result) {
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
        matchingObjectDAO.getMyJobs(req.body.user_id, req.body.active, function (status, result) {
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
        matchingObjectDAO.getFavoritesJobs(req.body.user_id, function (status, result) {
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
                        //console.log("response from matcher - details: " , response.body.formula.requirements.details);
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
        matchingObjectDAO.addCvToJob(req.body.job_id, req.body.cv_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

function updateFavoriteJob(req, res) {

    console.log("in updateFavoriteJob");

    if (validation.updateFavoriteJob(req)) {
        matchingObjectDAO.updateFavoriteJob(req.body.job_seeker_job_id,
            req.body.favorite,  function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

function  updateActivityJob(req,res){

    console.log("in updateJobSeekerJob");

    if (validation.updateActivityJob(req)) {
        matchingObjectDAO.updateActivityJob(req.body.job_seeker_job_id,req.body.active
            , function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

///////////////////////////////////////////// *** Utils *** ///////////////////////

//**  get key words  **//
function getKeyWordsBySector(req, res) {

    console.log("in getKeyWordsBySector");

    if (validation.getKeyWordsBySector(req)) {
        matchingObjectDAO.getKeyWordsBySector(req.body.sector, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

function cleanDB(req, res) { // TODO: DELETE IT
    matchingObjectDAO.cleanDB(function(err) {
        if (err === null) {
            res.status(200).json();
        }else {
            res.status(500).json();
        }
    });
}

////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.addMatchingObject = addMatchingObject;
exports.deleteMatchingObject = deleteMatchingObject;
exports.reviveMatchingObject = reviveMatchingObject;
exports.updateMatchingObject = updateMatchingObject;
exports.getMatchingObject = getMatchingObject;

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;
exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;
exports.hireToJob = hireToJob;

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;
exports.getFavoritesJobs = getFavoritesJobs;
exports.checkCV = checkCV;
exports.addCvToJob = addCvToJob;
exports.updateFavoriteJob = updateFavoriteJob;
exports.updateActivityJob = updateActivityJob;

exports.getKeyWordsBySector = getKeyWordsBySector;
exports.cleanDB = cleanDB; // TODO: DELETE IT