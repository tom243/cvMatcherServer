var usersDAO = require("./../model/dao/usersDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");

//////////////////////////////////// *** Users *** /////////////////////////////////////

//** Adding a new user **//
function addUser(req, res) {

    console.log("in addUser");

    if (validation.addUser(req) ){
        usersDAO.addUser(req.body, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

//** Delete an existing user **//
function deleteUser(req, res) {

    console.log("in deleteUser");

    if (validation.deleteUser(req) ){
        usersDAO.deleteUser(req.body.user_id, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** Update an existing user **//
function updateUser(req, res) {

    console.log("in updateUser");

    if (validation.updateUser(req) ){
        usersDAO.updateUser(req.body, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** get an existing user **//
function getUser(req, res) {

    console.log("in getUser");

    if (validation.getUser(req) ){
        usersDAO.getUser(req.body.user_id, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

//** get the mongo user id by the user google id **//
function getUserId(req, res) {

    console.log("in getUserId");

    if (validation.getUserId(req)){
        usersDAO.getUserId(req.body.google_user_id, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

///////////////////////////////// ***  Companies  *** //////////////////////////////////////

//** Adding a new company **//
function addCompany(req, res) {

    console.log("in addCompany");

    if (validation.addCompany(req) ){
        usersDAO.addCompany(req.body, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

//** Delete an existing company **//
function deleteCompany(req, res) {

    console.log("in deleteCompany");

    if (validation.deleteCompany(req) ){
        usersDAO.deleteCompany(req.body.company_id, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** Update an existing company **//
function updateCompany(req, res) {

    console.log("in updateCompany");

    if (validation.updateCompany(req) ){
        usersDAO.updateCompany(req.body, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** get an existing company **//
function getCompany(req, res) {

    console.log("in getCompany");

    if (validation.getCompany(req) ){
        usersDAO.getCompany(req.body.company_id, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.addUser     = addUser;
exports.deleteUser  = deleteUser;
exports.updateUser  = updateUser;
exports.getUser     = getUser;
exports.getUserId   = getUserId;

exports.addCompany      = addCompany;
exports.deleteCompany   = deleteCompany;
exports.updateCompany   = updateCompany;
exports.getCompany      = getCompany;



