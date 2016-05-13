var jobSeekerDAO = require("./../model/dao/jobSeekerDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");
var unirest = require('unirest');

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

        jobSeekerDAO.getMatchingObject(req.body.job_id, "job", function (status, results) {
            if (status === 200) {
                matchObjectToSend.job = results[0];
            } else {
                return res.status(status).json(results);
            }

            jobSeekerDAO.getMatchingObject(req.body.cv_id, "cv", function (status, results) {
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

////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;
exports.getFavoritesJobs = getFavoritesJobs;
exports.checkCV = checkCV;
exports.addCvToJob = addCvToJob;
exports.updateFavoriteJob = updateFavoriteJob;
exports.updateActivityJob = updateActivityJob;