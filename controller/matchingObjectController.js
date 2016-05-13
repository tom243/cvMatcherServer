var matchingObjectDAO = require("./../model/dao/matchingObjectDAO"); // dao = data access object = model
var usersDAO = require("./../model/dao/usersDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");

var error = {
    error: null
};

function checkIfAddingIsAllow(req, callback) {

    if (req.body.matching_object_type === "job") {
        usersDAO.verifyEmployerAddedCompany(req.body.user, function (status, result) {
            callback(status, result);
        })
    } else { // cv
        callback(200,null);
    }
}

//** Adding a new object **//
function addMatchingObject(req, res) {

    console.log("in addMatchingObject");

    if (validation.addMatchingObject(req)) {

        checkIfAddingIsAllow(req, function (status, result) {

            if (status === 200) {
                matchingObjectDAO.addMatchingObject(req.body, function (status, result) {

                    if (status === 200 && result.matching_object_type === "cv") {
                        usersDAO.saveCurrentCV(result.user, result._id, function (status, result) {
                            res.status(status).json(result);
                        })
                    } else {
                        res.status(status).json(result);
                    }
                });
            }else {
                res.status(status).json(result);
            }
        })
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

////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.addMatchingObject = addMatchingObject;
exports.deleteMatchingObject = deleteMatchingObject;
exports.reviveMatchingObject = reviveMatchingObject;
exports.updateMatchingObject = updateMatchingObject;
exports.getMatchingObject = getMatchingObject;