var mongoose = require('mongoose');

var UserModel = require('./../schemas/schemas').UserModel;
var CompanyModel = require('./../schemas/schemas').CompanyModel;

var error = {
    error: null
};

/////////////////////////////////////////////////////////////// *** Users *** ///////////////////////////////////////////////////////////////

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

    query.exec(function (err, result) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to find if user already exist";
            callback(500,error);
        }
        if (result.length == 0) {
            /*save the User in db*/
            newTable.save(function (err, doc) {
                if (err) {
                    console.log("something went wrong " + err);
                    error.error = "something went wrong while insert user to DB";
                    callback(500,error);

                } else {
                    console.log(" the user saved to DB: " + doc);
                    callback(200,doc);
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
function deleteUser(deleteUser, callback) {

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
    var options = {new: true,upsert:true};
    UserModel.findOneAndUpdate(query, update, options, function (err, result) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while update user to DB";
            callback(500,error);
        } else {
            callback(200,result);
        }
    });



/*    var newTable = new UserModel({
        personal_id: updateUser['personal_id'],
        first_name: updateUser['first_name'],
        last_name: updateUser['last_name'],
        email: updateUser['email'],
        birth_date: updateUser['birth_date'],
        address: updateUser['address'],
        linkedin: updateUser['linkedin'],
        phone_number: updateUser['phone_number']
    });

    var query = UserModel.findOne().where('_id', updateUser._id);

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
            },new:true,upsert:true
        });

        query.exec(function (err, result) {

            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while update user to DB";
                callback(500,error);
            }
            else {
                callback(200,result);
            }

        });
    });*/
}

var getUser = function getUser(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}
    );

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from db";
            callback(500,error);
        } else {
            callback(200,results);
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
            error.error = "something went wrong while trying to get the user id from db";
            callback(500,error);
        } else {
            callback(200,results);
        }
    });
};

/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////////////////////////////////


// Add Company
function addCompany(addCompany, callback) {

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

    /*save the company to db*/
    newTable.save(function (err, doc) {
        if (err) {
            console.log("error insert Company to the DB" + err);
            callback(false);
        } else {
            console.log("Company saved to DB: " + doc);

            var query = {"_id": class_data['user_id']};
            var update = {
                company: doc._id
            };
            var options = {new: true,upsert:true};
            UserModel.findOneAndUpdate(query, update, options, function (err, user) {
                if (err) {
                    console.log('error updating company ' + err);
                    callback(false);
                } else {
                    callback(doc);
                }
            });
        }
    });
}


// Delete Company
function deleteCompany(deleteCompany, callback) {

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


