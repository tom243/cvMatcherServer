var mongoose = require('mongoose');
//var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');
//var db = mongoose.createConnection('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

var newUser = require('./schemas').usersSchema;
var UserModel = mongoose.model('UserModel', newUser);

var newCompany = require('./schemas').companiesSchema;
var CompanyModel = mongoose.model('CompanyModel', newCompany);


/////////////////////////////////////////////////////////////// *** Users *** ///////////////////////////////////////////////////////////////


// Add User
function addUser(newUser, callback) {

    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in addUser function");

    var class_data = JSON.parse(newUser);
    var newTable = new UserModel({
        google_user_id:class_data['google_user_id'],
        personal_id: class_data['personal_id'],
        first_name: class_data['first_name'],
        last_name: class_data['last_name'],
        email: class_data['email'],
        birth_date: class_data['birth_date'],
        address: class_data['address'],
        personal_properties: class_data['personal_properties'],
        company: class_data['company'],
        phone_number: class_data['phone_number'],
        jobs: class_data['jobs'],
        favorites: class_data['favorites'],
        user_type: class_data['user_type'],
        active: class_data['active']
    });

    var query = UserModel.find().where('personal_id', newTable.personal_id);

    query.exec(function (err, result) {
        console.log("result.length: " + result.length);
        if (err) {
            console.log("error find personal_id from DB");
            mongoose.disconnect();
            callback(false);
        }
        if (result.length == 0) {
            console.log("the user isn't exist");
            /*save the User in db*/
            newTable.save(function (err, doc) {
                console.log("person saved to DB: " + doc);
                mongoose.disconnect();
                callback(doc);
            });
        }
        else {
            console.log("exist user with the same id!!!");
            mongoose.disconnect();
            callback(false);
        }
    });

};


// Delete User
function deleteUser(deleteUser, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in deleteUser function");

    var class_data = JSON.parse(deleteUser);
    var newTable = new UserModel({
        user_id: class_data['personal_id'],
    });

    var query = UserModel.findOne().where('personal_id', newTable.personal_id);

    query.exec(function (err, doc) {
        var query = doc.update({$set: {active: false}});
        query.exec(function (err, result) {

            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }
            else {
                mongoose.disconnect();
                callback(result);
            }

        });
    });
};


// Update User
function updateUser(updateUser, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in updateUser function");

    var class_data = JSON.parse(updateUser);
    var newTable = new UserModel({
        google_user_id:class_data['google_user_id'],
        personal_id: class_data['personal_id'],
        first_name: class_data['first_name'],
        last_name: class_data['last_name'],
        email: class_data['email'],
        birth_date: class_data['birth_date'],
        address: class_data['address'],
        personal_properties: class_data['personal_properties'],
        company: class_data['company'],
        phone_number: class_data['phone_number'],
        jobs: class_data['jobs'],
        favorites: class_data['favorites'],
        user_type: class_data['user_type'],
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
                mongoose.disconnect();
                callback(false);
            }
            else {
                mongoose.disconnect();
                callback(result);
            }

        });
    });

};


/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////////////////////////////////


// Add Company
function addCompany(addCompany, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in addCompany function");

    var class_data = JSON.parse(addCompany);
    var newTable = new CompanyModel({
        company_id: class_data['company_id'],
        name: class_data['name'],
        logo: class_data['logo'],
        p_c: class_data['p_c'],
        address: class_data['address'],
        active: class_data['active'],
    });

    var query = CompanyModel.find().where('company_id', newTable.company_id);

    query.exec(function (err, result) {
        console.log("result.length: " + result.length);
        if (err) {
            console.log("error find company_id from DB");
            mongoose.disconnect();
            callback(false);
        }
        if (result.length == 0) {
            console.log("the company isn't exist");
            /*save the User in db*/
            newTable.save(function (err, doc) {
                console.log("Company saved to DB: " + doc);
                mongoose.disconnect();
                callback(doc);
            });
        }
        else {
            console.log("exist company with the same id!!!");
            mongoose.disconnect();
            callback(false);
        }
    });

};


// Delete Company
function deleteCompany(deleteCompany, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in deleteCompany function");

    var class_data = JSON.parse(deleteCompany);
    var newTable = new CompanyModel({
        company_id: class_data['company_id'],
    });

    var query = CompanyModel.findOne().where('company_id', newTable.company_id);

    query.exec(function (err, doc) {
        var query = doc.update({$set: {active: false}});
        query.exec(function (err, result) {

            if (err) {
                console.log("error");
                mongoose.disconnect();
                callback(false);
            }
            else {
                mongoose.disconnect();
                callback(result);
            }

        });
    });
};


// Update Company
function updateCompany(updateCompany, callback) {
    var db = mongoose.connect('mongodb://dbUser:dbPass@ds037145.mongolab.com:37145/dbcvmatcher');

    console.log("im in updateCompany function");

    var class_data = JSON.parse(updateCompany);
    var newTable = new CompanyModel({
        company_id: class_data['company_id'],
        name: class_data['name'],
        logo: class_data['logo'],
        p_c: class_data['p_c'],
        address: class_data['address'],
        active: class_data['active'],
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
                mongoose.disconnect();
                callback(false);
            }
            else {
                mongoose.disconnect();
                callback(result);
            }

        });
    });

};


exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;

exports.addCompany = addCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;


//////////// example to split data //////// 

// var b = updateUser.split(/[{},:]/); // Delimiter is a regular expression
// console.log(b);

//////////////////////////////////////////////////

