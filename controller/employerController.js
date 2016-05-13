var employerDAO = require("./../model/dao/employerDAO"); // dao = data access object = model
var usersDAO = require("./../model/dao/usersDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");
var async = require("async");

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


        if (req.body.status.current_status === "liked") {

            employerDAO.rateCV(req.body.cv_id, req.body.status, function (status, result) {

                if (status === null) {
                    res.status(200).json(result);
                } else {
                    res.status(status).json(result);
                }
            });
        } else { // === unliked

            function waterfallTasks(cvId, userId, callback) {

                async.waterfall([
                    async.apply(employerDAO.setDecisionToFalse, cvId),
                    async.apply(usersDAO.addPersonalPropertiesToCompany, userId)
                ], callback);
            }

            async.parallel([
                async.apply(employerDAO.rateCV, req.body.cv_id, req.body.status),
                async.apply(waterfallTasks, req.body.cv_id, req.body.user_id)

            ], function (status, results) {

                if (status === null) {
                    res.status(200).json(results[0]);
                } else {
                    res.status(status).json(results);
                }

            });

        }
    } else {
        utils.sendErrorValidation(res);
    }

}

//** update rate for specific cv  **//
function updateRateCV(req, res) {

    console.log("in updateRateCV");

    if (validation.updateRateCV(req)) {

        function waterfallTasks(cvId, userId, callback) {

            var waterfallArr = [];

            if (req.body.status.current_status === "liked") {
                waterfallArr = [
                    async.apply(employerDAO.getPersonalPropertiesID, cvId),
                    async.apply(usersDAO.removePersonalPropertiesFromCompany, userId)
                ];
            } else {// === unliked
                waterfallArr = [
                    async.apply(employerDAO.setDecisionToFalse, cvId),
                    async.apply(usersDAO.addPersonalPropertiesToCompany, userId)
                ];
            }

            async.waterfall(waterfallArr, callback);

        }

        async.parallel([
            async.apply(employerDAO.updateRateCV, req.body.cv_id, req.body.status),
            async.apply(waterfallTasks, req.body.cv_id, req.body.user_id)

        ], function (status, results) {

            if (status === null) {
                res.status(200).json(results[0]);
            } else {
                res.status(status).json(results);
            }

        });

    } else {
        utils.sendErrorValidation(res);
    }

}

// hire job seeker to job
function hireToJob(req, res) {

    console.log("in hireToJob");

    if (validation.hireToJob(req)) {

        async.waterfall([
            async.apply(employerDAO.hireToJob, req.body.cv_id),
            async.apply(usersDAO.addPersonalPropertiesToCompany, req.body.user_id)

        ], function (status, results) {

            if (status == null) {

                console.log("job seeker hired to job successfully");
                res.status(200).json(results);

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

////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;
exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;
exports.hireToJob = hireToJob;
exports.getHiredCvs = getHiredCvs;