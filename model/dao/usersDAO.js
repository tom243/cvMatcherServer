var schemas = require('./../schemas/schemas');

var UserModel = schemas.UserModel;

var error = {
    error: null
};

// Add User
function addUser(newUser, callback) {

    var newTable = new UserModel({
        google_user_id: newUser.google_user_id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email
    });

    var query = UserModel.find().where('google_user_id', newTable.google_user_id);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to find if user already exist";
            callback(500, error);
        }
        if (results.length == 0) {
            /*save the User in db*/
            newTable.save(function (err, result) {
                if (err) {
                    console.log("something went wrong " + err);
                    error.error = "something went wrong while insert user";
                    callback(500, error);

                } else {
                    console.log(" the user saved successfully ", result);
                    callback(200, result);
                }
            });
        }
        else {
            console.log("user already exists with the same google id, user id returns to client!!!");
            getUserId(newUser.google_user_id, function (status, userId) {
                callback(status, userId);
            })
        }
    });
}

// Delete User
function deleteUser(userId, callback) {

    var query = {"_id": userId};
    var update = {
        active: false
    };
    var options = {new: true};
    UserModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while delete user";
            callback(500, error);
        } else {
            if (results != null) {
                console.log("the user deleted successfully ", results);
                callback(200, results);
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
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
            error.error = "something went wrong while update user";
            callback(500, error);
        } else {

            if (results != null) {
                console.log("the user updated successfully, user: ", results);
                callback(200, results);
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });
}

function getUser(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}
    ).limit(1);
    /*    .populate({
     path: 'current_cv',
     populate: {
     path: 'original_text academy personal_properties requirements formula',
     populate: {
     path: 'history_timeline', options: {sort: {'start_year': 1}},
     path: 'combination',
     path: 'matching_requirements.details'

     }
     }
     });*/

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("the user extracted successfully ", results);
                callback(200, results);
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });
}

function getUserId(googleUserId, callback) {

    var query = UserModel.find(
        {google_user_id: googleUserId, active: true},
        {_id: 1}
    ).limit(1);

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user id";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("the user id extracted successfully ", results);
                callback(200, results);
            } else {
                console.log("google user id not exists");
                error.error = "google user id not exists";
                callback(200, false);
            }
        }
    });
}

function saveCurrentCV(userId, cvId, callback) {

    var query = {"_id": userId};
    var update = {
        current_cv: cvId
    };
    var options = {new: true};
    UserModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while update current cv";
            callback(500, error);
        } else {

            if (results != null) {
                console.log("the current cv updated successfully");
                callback(200, results);
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });

}

function verifyEmployerAddedCompany(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true, 'company' : { '$exists' : true }}
    ).limit(1);

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to find if company exists";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("company exists");
                callback(200, results);
            } else {
                console.log("company not exists");
                error.error = "company not exists";
                callback(404, error);
            }
        }
    });

}

function updateHWID(googleUserId, hwid, callback) {

    var query = {"google_user_id": googleUserId};
    var update = {
        hwid: hwid
    };
    var options = {new: true};
    UserModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while update hwid";
            callback(500, error);
        } else {

            if (results != null) {
                console.log("the current hwid updated successfully");
                callback(200, results);
            } else {
                console.log("google user id not exists");
                error.error = "google user id not exists";
                callback(404, error);
            }
        }
    });

}

function getHWID(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true},{hwid:1}
    ).limit(1);

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to extract hwid";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("hwid extracted successfully");
                callback(200, results[0]);
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });
}

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUser = getUser;
exports.getUserId = getUserId;
exports.saveCurrentCV = saveCurrentCV;
exports.verifyEmployerAddedCompany = verifyEmployerAddedCompany;
exports.updateHWID = updateHWID;
exports.getHWID = getHWID;