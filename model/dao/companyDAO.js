/*jslint node: true */
"use strict";

var schemas = require("./../schemas/schemas");

var UserModel = schemas.UserModel;
var CompanyModel = schemas.CompanyModel;

var md5 = require("md5");

var error = {
    error: null
};

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
                    password: md5(addCompany.password) // MD5 encryption to password
                });

                /*save the company to db*/
                newTable.save(function (err, result) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to insert the company";
                        callback(500, error);
                    } else {

                        var query = {"_id": addCompany.user_id};
                        var update = {
                            company: result._id
                        };
                        var options = {new: true};
                        UserModel.findOneAndUpdate(query, update, options, function (err) {
                            if (err) {
                                console.log("something went wrong " + err);
                                error.error = "something went wrong while trying to assign the company to the user";
                                callback(500, error);
                            } else {
                                console.log("the company added successfully ", result);
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

function addToExistingCompany(userId, companyId, password, callback) {

    var query = CompanyModel.find(
        {_id: companyId, active: true, password: md5(password)}
    ).limit(1);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to find company";
            callback(500, error);
        } else {
            if (results.length > 0) {

                query = {"_id": userId};
                var update = {
                    company: companyId
                };
                var options = {new: true};
                UserModel.findOneAndUpdate(query, update, options, function (err) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to assign the company to the user";
                        callback(500, error);
                    } else {
                        console.log("the company added successfully ", results);
                        callback(200, results);
                    }
                });

            } else {
                console.log("company not exists or password not equals");
                error.error = "company not exists or password not equals";
                callback(404, error);
            }
        }
    });

}

// Delete Company
function deleteCompany(companyId, callback) {

    var query = {"_id": companyId};
    var update = {
        active: false
    };
    var options = {new: true};
    CompanyModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while delete company";
            callback(500, error);
        } else {

            if (results !== null) {
                console.log("the company deleted successfully, company: ", results);
                callback(200, results);
            } else {
                console.log("company not exists");
                error.error = "company not exists ";
                callback(404, error);
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
            error.error = "something went wrong while update company";
            callback(500, error);
        } else {

            if (results !== null) {
                console.log("the company updated successfully, company: ", results);
                callback(200, results);
            } else {
                console.log("company not exists");
                error.error = "company not exists";
                callback(404, error);
            }
        }
    });
}

function getCompany(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {company: 1}
    ).limit(1);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("the user extracted successfully ", results);
                query = CompanyModel.find(
                    {_id: results[0].company, active: true}, {password: 0, employees: 0, active: 0}
                ).limit(1);

                query.exec(function (err, results) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to get the company";
                        callback(500, error);
                    } else {
                        if (results.length > 0) {
                            console.log("the company extracted successfully ", results);
                            callback(200, results);
                        } else {
                            console.log("company not exists");
                            error.error = "company not exists";
                            callback(404, error);
                        }
                    }
                });
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });

}

function getCompanies(callback) {


    var query = CompanyModel.find(
        {active: true}, {name: 1, logo: 1}
    );

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the companies";
            callback(500, error);
        } else {
            console.log("the companies extracted successfully");
            callback(200, results);
        }
    });
}

function addJobSeekerToCompany(userId, cvId, callback) {

    console.log("in addPersonalPropertiesToCompany");

    var query = UserModel.find(
        {_id: userId, active: true}, {company: 1}
    ).limit(1);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {

                query = {"_id": results[0].company};
                var update = {
                    $addToSet: {"employees": cvId}
                };
                var options = {new: true};
                CompanyModel.findOneAndUpdate(query, update, options, function (err, result) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to add job seeker to company";
                        callback(500, error);
                    } else {

                        if (result !== null) {
                            console.log("the job seeker added to company successfully");
                            callback(null, result);
                        } else {
                            console.log("company not exists");
                            error.error = "company not exists";
                            callback(404, error);
                        }
                    }
                });

            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });

}

function removeJobSeekerFromCompany(userId, cvId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {company: 1}
    ).limit(1);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {

                query = {"_id": results[0].company};
                var update = {
                    $pull: {"employees": cvId}
                };
                var options = {new: true};
                CompanyModel.findOneAndUpdate(query, update, options, function (err, result) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to remove job seeker from company";
                        callback(500, error);
                    } else {

                        if (result !== null) {
                            console.log("the job seeker removed from the company successfully");
                            callback(null, result);
                        } else {
                            console.log("company not exists");
                            error.error = "company not exists";
                            callback(404, error);
                        }
                    }
                });

            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });


}

function changeCompanyPassword(companyId, oldPassword, newPassword, callback) {

    var query = CompanyModel.find(
        {_id: companyId, active: true, password: md5(oldPassword)}
    ).limit(1);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to find company";
            callback(500, error);
        } else {
            if (results.length > 0) {

                query = {"_id": companyId};
                var update = {
                    password: md5(newPassword)
                };
                var options = {new: true};
                CompanyModel.findOneAndUpdate(query, update, options, function (err, results) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to update password";
                        callback(500, error);
                    } else {
                        console.log("the password updated successfully");
                        callback(200, results);
                    }
                });

            } else {
                console.log("company not exists or password not equals");
                error.error = "company not exists or password not equals";
                callback(404, error);
            }
        }
    });

}

function getEmployees(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {company: 1}
    ).limit(1);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {

                query = CompanyModel.find(
                    {_id: results[0].company}, {employees: 1}
                ).limit(1).populate({
                    path: "employees",
                    select: "user personal_properties",
                    populate: {
                        path: "user personal_properties",
                        select: "first_name last_name personal_id decision"
                    }
                });

                query.exec(function (err, results) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to get the company from the db";
                        callback(500, error);
                    } else {
                        if (results.length > 0) {
                            console.log("the employees extracted successfully");
                            callback(200, results[0].employees);
                        } else {
                            console.log("company not exists");
                            error.error = "company not exists";
                            callback(404, error);
                        }
                    }
                });

            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });

}

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.addCompany = addCompany;
exports.addToExistingCompany = addToExistingCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;
exports.getCompany = getCompany;
exports.getCompanies = getCompanies;
exports.addJobSeekerToCompany = addJobSeekerToCompany;
exports.removeJobSeekerFromCompany = removeJobSeekerFromCompany;
exports.changeCompanyPassword = changeCompanyPassword;
exports.getEmployees = getEmployees;