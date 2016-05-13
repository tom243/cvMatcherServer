var companyDAO = require("./../model/dao/companyDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");

//** Adding a new company **//
function addCompany(req, res) {

    console.log("in addCompany");

    if (validation.addCompany(req)) {
        companyDAO.addCompany(req.body, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }
}

function addToExistingCompany(req, res) {

    console.log("in addToExistingCompany");

    if (validation.addToExistingCompany(req)) {
        companyDAO.addToExistingCompany(req.body.user_id, req.body.company_id,
            req.body.password, function (status, result) {
                res.status(status).json(result);
            });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** Delete an existing company **//
function deleteCompany(req, res) {

    console.log("in deleteCompany");

    if (validation.deleteCompany(req)) {
        companyDAO.deleteCompany(req.body.company_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** Update an existing company **//
function updateCompany(req, res) {

    console.log("in updateCompany");

    if (validation.updateCompany(req)) {
        companyDAO.updateCompany(req.body, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

//** get an existing company **//
function getCompany(req, res) {

    console.log("in getCompany");

    if (validation.getCompany(req)) {
        companyDAO.getCompany(req.body.company_id, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

function getCompanies(req, res) {

    console.log("in getCompanies");

    companyDAO.getCompanies(function (status, result) {
        res.status(status).json(result);
    });
}

function changeCompanyPassword(req, res) {

    console.log("in changeCompanyPassword");

    if (validation.changeCompanyPassword(req)) {
        companyDAO.changeCompanyPassword(req.body.company_id,req.body.old_password,
            req.body.new_password, function (status, result) {
                res.status(status).json(result);
            });
    } else {
        utils.sendErrorValidation(res);
    }

}

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.addCompany = addCompany;
exports.addToExistingCompany = addToExistingCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;
exports.getCompany = getCompany;
exports.getCompanies = getCompanies;
exports.changeCompanyPassword = changeCompanyPassword;