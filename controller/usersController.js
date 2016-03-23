var usersDAO = require("./../model/dao/usersDAO"); // dao = data access object = model

//////////////////////////////////// *** Users *** /////////////////////////////////////


//** Adding a new user **//
function addUser(newUser, callback) {
    usersDAO.addUser(newUser, function (result) {
        callback(result);
    });
}


//** Delete an existing user **//
function deleteUser(deleteUser, callback) {
    usersDAO.deleteUser(deleteUser, function (result) {
        callback(result);
    });
}

//** Update an existing user **//
function updateUser(updateUser, callback) {
    usersDAO.updateUser(updateUser, function (result) {
        callback(result);
    });
}

//** get an existing user **//
function getUser(userId, userType, callback) {
    usersDAO.getUser(userId, userType, function (result) {
        callback(result);
    });
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

exports.addCompany      = addCompany;
exports.deleteCompany   = deleteCompany;
exports.updateCompany   = updateCompany;
exports.getCompany      = getCompany;



