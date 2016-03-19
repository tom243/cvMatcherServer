var usersDAO = require("./usersDAO"); // dao = data access object = model 

/////////////////////////////////////////////////////////////// *** Users *** ///////////////////////////////////////////////////////////////


//** Adding a new user **//
function addUser(newUser, callback) {
    console.log("im in usersControllerrrr");
    usersDAO.addUser(newUser, function (result) {
        callback(result);
    });
};


//** Delete an existing user **//
function deleteUser(deleteUser, callback) {
    console.log("im in usersControllerrrr");
    usersDAO.deleteUser(deleteUser, function (result) {
        callback(result);
    });
};

//** Update an existing user **//
function updateUser(updateUser, callback) {
    console.log("im in usersControllerrrr");
    usersDAO.updateUser(updateUser, function (result) {
        callback(result);
    });
};


/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////////////////////////////////


//** Adding a new company **//
function addCompany(addCompany, callback) {
    console.log("im in usersControllerrrr");
    usersDAO.addCompany(addCompany, function (result) {
        callback(result);
    });
};


//** Delete an existing company **//
function deleteCompany(deleteCompany, callback) {
    console.log("im in usersControllerrrr");
    usersDAO.deleteCompany(deleteCompany, function (result) {
        callback(result);
    });
};

//** Update an existing company **//
function updateCompany(updateCompany, callback) {
    console.log("im in usersControllerrrr");
    usersDAO.updateCompany(updateCompany, function (result) {
        callback(result);
    });
};


exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;

exports.addCompany = addCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;



