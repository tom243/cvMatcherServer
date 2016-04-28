var UserModel = require('./../schemas/schemas').UserModel;
var CompanyModel = require('./../schemas/schemas').CompanyModel;

var error = {
    error: null
};

/////////////////////////////////////////////////// *** Users *** /////////////////////////////////

// Add User
function addUser(newUser, callback) {

    var newTable = new UserModel({
        google_user_id: newUser['google_user_id'],
        first_name: newUser['first_name'],
        last_name: newUser['last_name'],
        email: newUser['email'],
        active: true
    });

    var query = UserModel.find().where('google_user_id', newTable.google_user_id);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to find if user already exist";
            callback(500,error);
        }
        if (results.length == 0) {
            /*save the User in db*/
            newTable.save(function (err, result) {
                if (err) {
                    console.log("something went wrong " + err);
                    error.error = "something went wrong while insert user to the DB";
                    callback(500,error);

                } else {
                    console.log(" the user saved successfully to the DB: " , result);
                    callback(200,result);
                }
            });
        }
        else {
            console.log("user already exists with the same google id, user id returns to client!!!");
            getUserId(newUser.google_user_id, function(status,userId){
                callback(status,userId);
            })
        }
    });
}


// Delete User
function deleteUser(userId, callback) {

    var query = {"_id":userId};
    var update = {
        active: false
    };
    var options = {new: true};
    UserModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while delete user from the DB";
            callback(500,error);
        } else {
            if (results != null) {
                console.log("the user deleted successfully from the db " , results );
                callback(200, results);
            }else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404,error);
            }
        }
    });

}


// Update User
function updateUser(updateUser, callback) {


    var query = {"_id": updateUser._id};
    var update = {
        personal_id: updateUser.personal_id,
        first_name: updateUser.first_name,
        last_name: updateUser.last_name,
        email: updateUser.email,
        birth_date: updateUser.birth_date,
        address: updateUser.address,
        linkedin: updateUser.linkedin,
        phone_number: updateUser.phone_number
    };
    var options = {new: true};
    UserModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while update user to DB";
            callback(500,error);
        } else {

            if (results != null) {
                console.log("the user updated successfully to the db, user: " , results );
                callback(200,results);
            }else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404,error);
            }
        }
    });
}

var getUser = function getUser(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}
    );

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500,error);
        } else {
            if (results.length > 0) {
                console.log("the user extracted successfully from the db ", results);
                callback(200, results);
            }else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404,error);
            }
        }
    });
};

var getUserId = function getUserId(googleUserId, callback) {

    var query = UserModel.find(
        {google_user_id: googleUserId, active: true},
        {_id: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user id from the db";
            callback(500,error);
        } else {
            if (results.length > 0) {
                console.log("the user id extracted successfully from the db ", results);
                callback(200, results);
            }else {
                console.log("google user id not exists");
                error.error = "google user id not exists";
                callback(404,error);
            }
        }
    });
};


function saveCurrentCV(userId, cvId) {

    var query = {"_id": userId};
    var update = {
        $setOnInsert: {
            current_cv: cvId
        }
    };
    var options = {new: true, upsert:true};
    UserModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while update current cv";
            callback(500,error);
        } else {

            if (results != null) {
                console.log("the current cv updated successfully");
                callback(200,results);
            }else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404,error);
            }
        }
    });

}

////////////////////////////////////////////// ***  Companies  *** ////////////////////////////////////

// Add Company
function addCompany(addCompany, callback) {

    UserModel.count({_id: addCompany.user_id}, function (err, count) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to find if the user exists in db";
            callback(500, error);
        } else {
            if (count > 0) { // user exists
                var newTable = new CompanyModel({
                    name: addCompany.name,
                    logo: addCompany.logo,
                    p_c: addCompany.p_c,
                    address: addCompany.address,
                    phone_number: addCompany.phone_number,
                    active: true
                });

                /*save the company to db*/
                newTable.save(function (err, result) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to insert the company to db";
                        callback(500, error);
                    } else {
                        console.log("Company saved to DB: " + result);

                        var query = {"_id": addCompany.user_id};
                        var update = {
                            company: result._id
                        };
                        var options = {new: true, upsert: true};
                        UserModel.findOneAndUpdate(query, update, options, function (err, user) {
                            if (err) {
                                console.log("something went wrong " + err);
                                error.error = "something went wrong while trying to assign the company to the user in db";
                                callback(500, error);
                            } else {
                                console.log("the company added successfully to the db" , result);
                                callback(200, result);
                            }
                        });
                    }
                });
            } else { // user not exists
                console.log("cannot add company because the user is not exists");
                error.error = "cannot add company because the user is not exists";
                callback(404, error);
            }
        }
    });
}

// Delete Company
function deleteCompany(companyId, callback) {

    var query = {"_id":companyId};
    var update = {
        active: false
    };
    var options = {new: true};
    CompanyModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while delete company from DB";
            callback(500,error);
        } else {

            if (results != null) {
                console.log("the company deleted successfully from the db, company: " , results);
                callback(200,results);
            }else {
                console.log("company not exists");
                error.error = "company not exists ";
                callback(404,error);
            }

        }
    });
}

// Update Company
function updateCompany(updateCompany, callback) {

    var query = {"_id": updateCompany._id};
    var update = {
        name: updateCompany.name,
        logo: updateCompany.logo,
        p_c: updateCompany.p_c,
        address: updateCompany.address,
        phone_number: updateCompany.phone_number
    };
    var options = {new: true};
    CompanyModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while update company to DB";
            callback(500,error);
        } else {

            if (results != null) {
                console.log("the company updated successfully to the db, company: " , results );
                callback(200,results);
            }else {
                console.log("company not exists");
                error.error = "company not exists";
                callback(404,error);
            }
        }
    });
}

var getCompany = function getCompany(companyId, callback) {

    var query = CompanyModel.find(
        {_id: companyId, active: true}
    );

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the company from the db";
            callback(500,error);
        } else {
            if (results.length > 0) {
                console.log("the company extracted successfully from the db ", results);
                callback(200, results);
            }else {
                console.log("company not exists");
                error.error = "company not exists";
                callback(404,error);
            }
        }
    });

};

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUser = getUser;
exports.getUserId = getUserId;
exports.saveCurrentCV = saveCurrentCV;

exports.addCompany = addCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;
exports.getCompany = getCompany;


