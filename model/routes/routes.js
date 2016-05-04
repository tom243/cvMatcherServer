var usersController = require('./../../controller/usersController');
var matchingObjectController = require('./../../controller/matchingObjectController');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.send("Welcome To CV Matcher");
    });

/////////////////////////////////////////////////////////////// *** Users *** //////////////////////////////////////////

    app.post('/addUser', usersController.addUser);
    app.post('/deleteUser', usersController.deleteUser);
    app.post('/updateUser', usersController.updateUser);
    app.post('/getUser', usersController.getUser);
    app.post('/getUserId', usersController.getUserId);

/////////////////////////////////////////////////////////////// *** Matching Objects *** //////////////////////

    app.post('/addMatchingObject', matchingObjectController.addMatchingObject);
    app.post('/deleteMatchingObject', matchingObjectController.deleteMatchingObject);
    app.post('/reviveMatchingObject', matchingObjectController.reviveMatchingObject);
    app.post('/updateMatchingObject', matchingObjectController.updateMatchingObject);
    app.post('/getMatchingObject', matchingObjectController.getMatchingObject);

    /////////////////////////////////////////////////////////////// *** JobSeeker *** /////////////////////////////////

    app.post('/jobSeeker/getJobsBySector', matchingObjectController.getAllJobsBySector);
    app.post('/jobSeeker/getMyJobs', matchingObjectController.getMyJobs);
    app.post('/jobSeeker/getFavoritesJobs', matchingObjectController.getFavoritesJobs);
    app.post('/jobSeeker/checkCV', matchingObjectController.checkCV);
    app.post('/jobSeeker/addCvToJob', matchingObjectController.addCvToJob);
    app.post('/jobSeeker/updateFavoriteJob', matchingObjectController.updateFavoriteJob);
    app.post('/jobSeeker/updateActivityJob', matchingObjectController.updateActivityJob);

//////////////////////////////////////////////////////*** Employer *** ////////////////////////////////////////////////

    app.post('/employer/getJobsBySector', matchingObjectController.getJobsBySector);
    app.post('/employer/getUnreadCvsForJob', matchingObjectController.getUnreadCvsForJob);
    app.post('/employer/getRateCvsForJob', matchingObjectController.getRateCvsForJob);
    app.post('/employer/rateCV', matchingObjectController.rateCV);
    app.post('/employer/updateRateCV', matchingObjectController.updateRateCV);
    app.post('/employer/hireToJob', matchingObjectController.hireToJob);

/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////

    app.post('/employer/addCompany', usersController.addCompany);
    app.post('/employer/deleteCompany', usersController.deleteCompany);
    app.post('/employer/updateCompany', usersController.updateCompany);
    app.post('/employer/getCompany', usersController.getCompany);
    app.post('/getLogoImages' ,usersController.getLogoImages);

////////////////////////////////////////////////////// ***  Utils  *** ////////////////////////////////////

    app.post('/getKeyWordsBySector', matchingObjectController.getKeyWordsBySector);
    app.get('/cleanDB', matchingObjectController.cleanDB); //TODO: DELETE IT

};

