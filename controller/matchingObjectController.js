var matchingObjectDAO = require("./../model/dao/matchingObjectDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");
var unirest = require('unirest');

var error = {
    error: null
};

////////////////////////////////// *** Matching Objects *** ///////////////////////////

//** Adding a new object **//
function addMatchingObject(addObject, callback) {
    matchingObjectDAO.addMatchingObject(addObject, function (result) {
        callback(result);
    });
}


//** Delete an existing object **//
function deleteMatchingObject(matching_object_id, callback) {
    matchingObjectDAO.deleteMatchingObject(matching_object_id, function (result) {
        callback(result);
    });
}

//** Update an existing object **//
function updateMatchingObject(updateObject, callback) {
    matchingObjectDAO.updateMatchingObject(updateObject, function (result) {
        callback(result);
    });
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
        matchingObjectDAO.rateCV(req.body.cv_id, req.body.status ,function (status, result) {
                res.status(status).json(result);
            });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** update rate for specific cv  **//
function updateRateCV(matching_object_id, status, callback) {
    matchingObjectDAO.updateRateCV(matching_object_id, status, function (result) {
        callback(result);
    });
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
        matchingObjectDAO.getMyJobs(req.body.user_id, function (status, result) {
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

                unirest.post('https://matcherlogic.herokuapp.com/addFormula')
                    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                    .send(matchObjectToSend)
                    .end(function (response) {
                        if (validation.matcherResponse(response.body)) {
                            console.log("response from matcher: ", response.body);
                            res.status(response.code).json(response.body);
                        }else {
                            error.error = "error occurred during matcher process";
                            res.status(response.code).json(error);
                        }

                    });
            })
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//**  get id of cv **//
function getIdOfCV(req, res) {

    console.log("in getIdOfCV");

    if (validation.getIdOfCV(req)) {
        matchingObjectDAO.getIdOfCV(req.body.user_id, function (status, result) {
            res.status(status).json(result);
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

////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.addMatchingObject = addMatchingObject;
exports.deleteMatchingObject = deleteMatchingObject;
exports.updateMatchingObject = updateMatchingObject;
exports.getMatchingObject = getMatchingObject;

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;

exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;
exports.getFavoritesJobs = getFavoritesJobs;
exports.checkCV = checkCV;
exports.getIdOfCV = getIdOfCV;
exports.addCvToJob = addCvToJob;

exports.getKeyWordsBySector = getKeyWordsBySector;