var usersDAO = require("./../model/dao/usersDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");

//** Adding a new user **//
function addUser(req, res) {

    console.log("in addUser");

    if (validation.addUser(req)) {
        usersDAO.addUser(req.body, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

//** Delete an existing user **//
function deleteUser(req, res) {

    console.log("in deleteUser");

    if (validation.deleteUser(req)) {
        usersDAO.deleteUser(req.body.user_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** Update an existing user **//
function updateUser(req, res) {

    console.log("in updateUser");

    if (validation.updateUser(req)) {
        usersDAO.updateUser(req.body, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** get an existing user **//
function getUser(req, res) {

    console.log("in getUser");

    if (validation.getUser(req)) {
        usersDAO.getUser(req.body.user_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

//** get the mongo user id by the user google id **//
function getUserId(req, res) {

    console.log("in getUserId");

    if (validation.getUserId(req)) {
        usersDAO.getUserId(req.body.google_user_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

function updateHWID(req, res) {

    console.log("in updateHWID");

    if (validation.updateHWID(req)) {
        usersDAO.updateHWID(req.body.google_user_id, req.body.hwid, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUser = getUser;
exports.getUserId = getUserId;
exports.updateHWID = updateHWID;