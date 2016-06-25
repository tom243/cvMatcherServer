/*jslint node: true */
"use strict";

var usersController = require("./../../controller/usersController");
var matchingObjectController = require("./../../controller/matchingObjectController");
var jobSeekerController = require("./../../controller/jobSeekerController");
var employerController = require("./../../controller/employerController");
var utilsController = require("./../../controller/utilsController");
var companyController = require("./../../controller/companyController");
var pushWooshController = require("./../../controller/pushWooshController");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.send("Welcome To CV Matcher");
    });

/////////////////////////////////////////////////////////////// *** Users *** //////////////////////////

    app.post("/addUser", usersController.addUser);
    app.post("/deleteUser", usersController.deleteUser);
    app.post("/updateUser", usersController.updateUser);
    app.post("/getUser", usersController.getUser);
    app.post("/getUserId", usersController.getUserId);
    app.post("/updateHWID", usersController.updateHWID);

/////////////////////////////////////////////////////////////// *** Matching Objects *** ///////////////

    app.post("/addMatchingObject", matchingObjectController.addMatchingObject);
    app.post("/deleteMatchingObject", matchingObjectController.deleteMatchingObject);
    app.post("/reviveMatchingObject", matchingObjectController.reviveMatchingObject);
    app.post("/updateMatchingObject", matchingObjectController.updateMatchingObject);
    app.post("/getMatchingObject", matchingObjectController.getMatchingObject);

    /////////////////////////////////////////////////////////////// *** JobSeeker *** ///////////////////

    app.post("/jobSeeker/getJobsBySector", jobSeekerController.getAllJobsBySector);
    app.post("/jobSeeker/getMyJobs", jobSeekerController.getMyJobs);
    app.post("/jobSeeker/getFavoritesJobs", jobSeekerController.getFavoritesJobs);
    app.post("/jobSeeker/checkCV", jobSeekerController.checkCV);
    app.post("/jobSeeker/addCvToJob", jobSeekerController.addCvToJob);
    app.post("/jobSeeker/updateFavoriteJob", jobSeekerController.updateFavoriteJob);
    app.post("/jobSeeker/updateActivityJob", jobSeekerController.updateActivityJob);
    app.post("/jobSeeker/getBestMatchJobs", jobSeekerController.getBestMatchJobs);

//////////////////////////////////////////////////////*** Employer *** /////////////////////////////////

    app.post("/employer/getJobsBySector", employerController.getJobsBySector);
    app.post("/employer/getUnreadCvsForJob", employerController.getUnreadCvsForJob);
    app.post("/employer/getRateCvsForJob", employerController.getRateCvsForJob);
    app.post("/employer/rateCV", employerController.rateCV);
    app.post("/employer/updateRateCV", employerController.updateRateCV);
    app.post("/employer/hireToJob", employerController.hireToJob);
    app.post("/employer/getHiredCvs", employerController.getHiredCvs);
    app.post("/employer/setDecision", employerController.setDecision);

//////////////////////////////////////////////////***  Companies  ***//////////////////////////////////

    app.post("/employer/addCompany", companyController.addCompany);
    app.post("/employer/addToExistingCompany", companyController.addToExistingCompany);
    app.post("/employer/deleteCompany", companyController.deleteCompany);
    app.post("/employer/updateCompany", companyController.updateCompany);
    app.post("/employer/getCompany", companyController.getCompany);
    app.get("/employer/getCompanies", companyController.getCompanies);
    app.post("/employer/changeCompanyPassword", companyController.changeCompanyPassword);
    app.post("/employer/getEmployees", companyController.getEmployees);

////////////////////////////////////////////////////// ***  Utils  *** ////////////////////////////////

    app.post("/getKeyWordsBySector", utilsController.getKeyWordsBySector);
    app.post("/getLogoImages", utilsController.getLogoImages);
    app.post("/addKeyWords", utilsController.addKeyWords);
    app.get("/cleanDB", utilsController.cleanDB); //TODO: DELETE IT

///////////////////////////////////////////////////// *** pushWoosh *** ///////////////////////////////

    app.post("/sendNotification", pushWooshController.sendNotification);

};