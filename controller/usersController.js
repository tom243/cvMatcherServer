var usersDAO = require("./../model/dao/usersDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");

//////////////////////////////////// *** Users *** /////////////////////////////////////


//** Adding a new user **//
function addUser(req, res) {

    console.log("Im in addUser");

    if (validation.addUser(req) ){
        usersDAO.addUser(req.body, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}


//** Delete an existing user **//
function deleteUser(deleteUser, callback) {
    usersDAO.deleteUser(deleteUser, function (result) {
        callback(result);
    });
}

//** Update an existing user **//



function updateUser(req, res) {

    console.log("Im in updateUser");

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

    console.log(" in getUserId");

    if (validation.getUserId(req)){
        console.log("userId " + req.body.google_user_id);
        usersDAO.getUserId(req.body.google_user_id, function (status,result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

///////////////////////////////// ***  Companies  *** //////////////////////////////////////

//** Adding a new company **//
function addCompany(addCompany, callback) {
    usersDAO.addCompany(addCompany, function (result) {
        callback(result);
    });
}

//** Delete an existing company **//
function deleteCompany(deleteCompany, callback) {
    usersDAO.deleteCompany(deleteCompany, function (result) {
        callback(result);
    });
}

//** Update an existing company **//
function updateCompany(updateCompany, callback) {
    usersDAO.updateCompany(updateCompany, function (result) {
        callback(result);
    });
}

//** get an existing company **//
function getCompany(companyId, callback) {
    usersDAO.getCompany(companyId, function (result) {
        callback(result);
    });
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



