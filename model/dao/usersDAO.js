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
                }
                console.log("person saved to DB: " + doc);
                callback(doc);
            });
        }
        else {
            console.log("exist user with the same id!!!");
            callback(false);
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
                console.log("error");
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
        google_user_id: class_data['google_user_id'],
        personal_id: class_data['personal_id'],
        first_name: class_data['first_name'],
        last_name: class_data['last_name'],
        email: class_data['email'],
        birth_date: class_data['birth_date'],
        address: class_data['address'],
        personal_properties: class_data['personal_properties'],
        company: class_data['company'],
        linkedin:class_data['linkedin'],
        phone_number: class_data['phone_number'],
        jobs: class_data['jobs'],
        favorites: class_data['favorites'],
        active: class_data['active']
    });

    var query = UserModel.findOne().where('google_user_id', newTable.google_user_id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {

                personal_id: newTable.personal_id,
                first_name: newTable.first_name,
                last_name: newTable.last_name,
                email: newTable.email,
                birth_date: newTable.birth_date,
                address: newTable.address,
                personal_properties: newTable.personal_properties,
                company: newTable.company,
                linkedin: newTable.linkedin,
                phone_number: newTable.phone_number,
                jobs: newTable.jobs,
                favorites: newTable.favorites,
                user_type: newTable.user_type,
                active: newTable.active
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

var getUser = function getUser(userId, callback) {

    var query = UserModel.find(
        {google_user_id: userId, active: true}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("error");
            callback(false);
        }
        callback(results);
    });
};


/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////////////////////////////////


// Add Company
function addCompany(addCompany, callback) {

    console.log("im in addCompany function");

    var class_data = JSON.parse(addCompany);
    var newTable = new CompanyModel({
        company_id: class_data['company_id'],
        name: class_data['name'],
        logo: class_data['logo'],
        p_c: class_data['p_c'],
        address: class_data['address'],
        active: class_data['active']
    });

    var query = CompanyModel.find().where('company_id', newTable.company_id);

    query.exec(function (err, result) {
        console.log("result.length: " + result.length);
        if (err) {
            console.log("error find company_id from DB");
            callback(false);
        }
        if (result.length == 0) {
            console.log("the company isn't exist");
            /*save the User in db*/
            newTable.save(function (err, doc) {
                console.log("Company saved to DB: " + doc);
                callback(doc);
            });
        }
        else {
            console.log("exist company with the same id!!!");
            callback(false);
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
        company_id: class_data['company_id'],
        name: class_data['name'],
        logo: class_data['logo'],
        p_c: class_data['p_c'],
        address: class_data['address'],
        active: class_data['active']
    });


    var query = CompanyModel.findOne().where('company_id', newTable.company_id);

    query.exec(function (err, doc) {

        var query = doc.update({
            $set: {
                company_id: newTable.company_id,
                name: newTable.name,
                logo: newTable.logo,
                p_c: newTable.p_c,
                address: newTable.address
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
        }
        callback(results);
    });
};


///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.addUser     = addUser;
exports.deleteUser  = deleteUser;
exports.updateUser  = updateUser;
exports.getUser     = getUser;

exports.addCompany      = addCompany;
exports.deleteCompany   = deleteCompany;
exports.updateCompany   = updateCompany;
exports.getCompany      = getCompany;


