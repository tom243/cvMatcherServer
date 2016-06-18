var employerDAO = require("./../model/dao/employerDAO"); // dao = data access object = model
var companyDAO = require("./../model/dao/companyDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");
var async = require("async");

var error = {
    error: null
};

///////////////////////////////////////////// *** Employer *** ///////////////////////

//** get jobs by sector for specific employer  **//
function getJobsBySector(req, res) {

    console.log("in getJobsBySector");

    if (validation.getJobsBySector(req)) {
        employerDAO.getJobsBySector(req.body.user_id, req.body.sector,
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
        employerDAO.getUnreadCvsForJob(req.body.user_id, req.body.job_id, function (status, result) {
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
        employerDAO.getRateCvsForJob(req.body.user_id, req.body.job_id,
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
        employerDAO.rateCV(req.body.cv_id, req.body.status, function (status, result) {
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

        employerDAO.updateRateCV(req.body.cv_id, req.body.status, function (status, result) {
            res.status(status).json(result);
        });

    } else {
        utils.sendErrorValidation(res);
    }

}

// hire job seeker to job
function hireToJob(req, res) {

    console.log("in hireToJob");

    if (validation.hireToJob(req)) {

        async.parallel([
            async.apply(employerDAO.hireToJob, req.body.cv_id),
            async.apply(companyDAO.addJobSeekerToCompany, req.body.user_id, req.body.cv_id)

        ], function (status, results) {

            if (status == null) {

                console.log("job seeker hired to job successfully");
                res.status(200).json(results[0]);

            } else {
                console.log("error while trying to hire job seeker to job");
                error.error = "error while trying to hire job seeker to job";
                callback(status, error);
            }

        });

    } else {
        utils.sendErrorValidation(res);
    }

}

function getHiredCvs(req, res) {

    console.log("in getHiredCvs");

    if (validation.getHiredCvs(req)) {
        employerDAO.getHiredCvs(req.body.user_id, req.body.job_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

function setDecision(req, res) {

    console.log("in setDecision");

    if (validation.setDecision(req)) {
        employerDAO.setDecision(req.body.personal_properties_id, req.body.decision, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;
exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;
exports.hireToJob = hireToJob;
exports.getHiredCvs = getHiredCvs;
exports.setDecision = setDecision;