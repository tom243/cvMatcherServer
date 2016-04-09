var mongoose = require('mongoose');

var UserModel = require('./../schemas/schemas').UserModel;
var CompanyModel = require('./../schemas/schemas').CompanyModel;


/////////////////////////////////////////////////////////////// *** Users *** ///////////////////////////////////////////////////////////////

// Add User
function addUser(newUser, callback) {

    console.log("im in addUser function");

    var class_data = JSON.parse(newUser);
    var newTable = new UserModel({
        google_user_id: class_data['google_user_id'],
        first_name: class_data['first_name'],
        last_name: class_data['last_name'],
        email: class_data['email'],
        active: true
    });

    var query = UserModel.find().where('google_user_id', newTable.google_user_id);

    query.exec(function (err, result) {
        console.log("result.length: " + result.length);
        if (err) {
            console.log("error find personal_id from DB");
            callback(false);
        }
        if (result.length == 0) {
            console.log("the user isn't exist");
            /*save the User in db*/
            newTable.save(function (err, doc) {
                if (err) {
                    console.log("error insert user to DB" + err);
                    callback(false);
                } else {
                    console.log(" the user saved to DB: " + doc);
                    callback(doc);
                }
            });
        }
        else {
            console.log("user already exists with the same google id!!!");
            getUserId(class_data.google_user_id, function(userId){
                callback(userId);
            })
        }
    });
}


// Delete User
function deleteUser(deleteUser, callback) {

    console.log("im in deleteUser function");

    var class_data = JSON.parse(deleteUser);
    var newTable = new UserModel({
        user_id: class_data['personal_id']
    });

    var query = UserModel.findOne().where('personal_id', newTable.personal_id);

    query.exec(function (err, doc) {
        var query = doc.update({$set: {active: false}});
        query.exec(function (err, result) {

            if (err) {
                console.log(err);
                callback(false);
            }
            else {
                callback(result);
            }

        });
    });
}


// Update User
function updateUser(updateUser, callback) {

    console.log("im in updateUser function");

    var class_data = JSON.parse(updateUser);
    var newTable = new UserModel({
        personal_id: class_data['personal_id'],
        first_name: class_data['first_name'],
        last_name: class_data['last_name'],
        email: class_data['email'],
        birth_date: class_data['birth_date'],
        address: class_data['address'],
        linkedin: class_data['linkedin'],
        phone_number: class_data['phone_number']
    });

    var query = UserModel.findOne().where('_id', class_data._id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {
                personal_id: newTable.personal_id,
                first_name: newTable.first_name,
                last_name: newTable.last_name,
                email: newTable.email,
                birth_date: newTable.birth_date,
                address: newTable.address,
                linkedin: newTable.linkedin,
                phone_number: newTable.phone_number
            }
        });

        query.exec(function (err, result) {

            if (err) {
                console.log(err);
                callback(false);
            }
            else {
                callback(result);
            }

        });
    });
}

var getUser = function getUser(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log(err);
            callback(false);
        } else {
            callback(results);
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
            console.log(err);
            callback(false);
        } else {
            callback(results);
        }
    });
};

/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////////////////////////////////


// Add Company
function addCompany(addCompany, callback) {

    console.log("im in addCompany function");

    var class_data = JSON.parse(addCompany);

    console.log(" addCompany", class_data);

    var newTable = new CompanyModel({
        name: class_data['name'],
        logo: class_data['logo'],
        p_c: class_data['p_c'],
        address: class_data['address'],
        phone_number: class_data['phone_number'],
        active: true
    });

    var query = UserModel.find().where('_id', class_data['user_id']);

    query.exec(function (err, result) {
        console.log("result.length: " + result.length);
        if (err) {
            console.log("error insert company id");
            callback(false);
        } else {
            if (result.length == 0) {
                /*save the company to db*/
                newTable.save(function (err, doc) {
                    if (err) {
                        console.log("error insert Company to the DB" + err);
                        callback(false);
                    } else {
                        console.log("Company saved to DB: " + doc);

                        query.exec(doc, function (err, user) {
                            if (err) {
                                console.log(err);
                                callback(false);
                            } else {
                                var query = user.update({
                                    $set: {company: doc._id},
                                    upsert: true
                                });
                                query.exec(function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        callback(false);
                                    }
                                    else {
                                        callback(doc);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else {
                console.log("Company already exists with the same user id!!!");
                callback(false);
            }
        }
    });
}


// Delete Company
function deleteCompany(deleteCompany, callback) {

    console.log("im in deleteCompany function");

    var class_data = JSON.parse(deleteCompany);
    var newTable = new CompanyModel({
        company_id: class_data['company_id']
    });

    var query = CompanyModel.findOne().where('company_id', newTable.company_id);

    query.exec(function (err, doc) {
        var query = doc.update({$set: {active: false}});
        query.exec(function (err, result) {

            if (err) {
                console.log("error");
                callback(false);
            }
            else {
                callback(result);
            }

        });
    });
}

// Update Company
function updateCompany(updateCompany, callback) {

    console.log("im in updateCompany function");

    var class_data = JSON.parse(updateCompany);
    var newTable = new CompanyModel({
        name: class_data['name'],
        logo: class_data['logo'],
        p_c: class_data['p_c'],
        address: class_data['address'],
        phone_number: class_data['phone_number']
    });


    var query = CompanyModel.findOne().where('_id', newTable.company_id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {
                name: newTable.name,
                logo: newTable.logo,
                p_c: newTable.p_c,
                address: newTable.address,
                phone_number: newTable.phone_number
            }
        });

        query.exec(function (err, result) {

            if (err) {
                console.log("error");
                callback(false);
            }
            else {
                callback(result);
            }

        });
    });
}

var getCompany = function getCompany(companyId, callback) {

    var query = CompanyModel.findById(companyId);

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        } else {
            callback(results);
        }
    });
};

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUser = getUser;
exports.getUserId = getUserId;

exports.addCompany = addCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;
exports.getCompany = getCompany;


