var usersController = require('./../../controller/usersController');
var matchingObjectController = require('./../../controller/matchingObjectController');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.send("Welcome");
    });

/////////////////////////////////////////////////////////////// *** Users *** //////////////////////////////////////////

    app.post('/addUser',  usersController.addUser);
    app.post('/deleteUser', usersController.deleteUser);
    app.post('/updateUser',  usersController.updateUser);
    app.post('/getUser',  usersController.getUser);
    app.post('/getUserId',usersController.getUserId);

/////////////////////////////////////////////////////////////// *** Matching Objects *** //////////////////////

    app.post('/addMatchingObject', matchingObjectController.addMatchingObject);
    app.post('/deleteMatchingObject',matchingObjectController.deleteMatchingObject);
    app.post('/reviveMatchingObject',matchingObjectController.reviveMatchingObject);

// Update Object (Job or CV)
    app.post('/updateMatchingObject', function (req, res) {

        console.log("Im in updateMatchingObject post");
        if (!req.body) return res.sendStatus(400);
        var object = JSON.stringify(req.body);

        matchingObjectController.updateMatchingObject(object, function (object) {
            res.json(object);
        });
    });

    app.post('/getMatchingObject', matchingObjectController.getMatchingObject);

    /////////////////////////////////////////////////////////////// *** JobSeeker *** /////////////////////////////////

    app.post('/jobSeeker/getJobsBySector', matchingObjectController.getAllJobsBySector);
    app.post('/jobSeeker/getMyJobs',  matchingObjectController.getMyJobs);
    app.post('/jobSeeker/getFavoritesJobs',matchingObjectController.getFavoritesJobs);
    app.post('/jobSeeker/getIdOfCV',  matchingObjectController.getIdOfCV);
    app.post('/jobSeeker/checkCV',  matchingObjectController.checkCV);
    app.post('/jobSeeker/addCvToJob',matchingObjectController.addCvToJob);

//////////////////////////////////////////////////////*** Employer *** ////////////////////////////////////////////////

    app.post('/employer/getJobsBySector',matchingObjectController.getJobsBySector);
    app.post('/employer/getUnreadCvsForJob', matchingObjectController.getUnreadCvsForJob);
    app.post('/employer/getRateCvsForJob',  matchingObjectController.getRateCvsForJob);
    app.post('/employer/rateCV', matchingObjectController.rateCV);
    app.post('/employer/updateRateCV',matchingObjectController.updateRateCV);

/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////

    app.post('/employer/addCompany',usersController.addCompany);
    app.post('/employer/deleteCompany',usersController.deleteCompany);
    app.post('/employer/updateCompany', usersController.updateCompany);
    app.post('/employer/getCompany',usersController.getCompany);

////////////////////////////////////////////////////// ***  Utils  *** ////////////////////////////////////

    app.post('/getKeyWordsBySector',  matchingObjectController.getKeyWordsBySector);

};

