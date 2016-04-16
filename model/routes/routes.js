var usersController = require('./../../controller/usersController');
var matchingObjectController = require('./../../controller/matchingObjectController');


function fieldValidation(field) {

    if ((typeof field !== 'undefined' && field )) {
        return true;
    } else {
        return false;
    }
}

function sendErrorFieldValidation(res) {
    var error = {
        error: "the value of fields is incorrect or undefined"
    };
    res.json(error);
}

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

// Add Object (Job or CV)
    app.post('/addMatchingObject', function (req, res) {

        console.log("Im in addMatchingObject post");
        if (!req.body) return res.sendStatus(400);
        var matchingObject = JSON.stringify(req.body);

        matchingObjectController.addMatchingObject(matchingObject, function (object) {
            res.json(object);
        });
    });

// Delete Object (Job or CV)
    app.post('/deleteMatchingObject', function (req, res) {

        console.log("Im in deleteMatchingObject post");
        if (!req.body) return res.sendStatus(400);

        if (fieldValidation(req.body.matching_object_id)) {
            matchingObjectController.deleteMatchingObject(req.body.matching_object_id, function (object) {
                res.json(object);
            });
        } else {
            sendErrorFieldValidation(res);
        }

    });

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

    ///////////////////////////////////////////////////*** Employer *** ///////////////////////////////////////////////


    // get Jobs
    app.post('/employer/getJobsBySector', function (req, res) {

        console.log("Im in getJobsBySector post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.google_user_id) && fieldValidation(req.body.sector)
            && fieldValidation(req.body.archive)) {
            console.log("google user id : " + req.body.google_user_id);
            console.log("sector " + req.body.sector);
            console.log("archive" + req.body.archive);
            matchingObjectController.getJobsBySector(req.body.google_user_id, req.body.sector,
                req.body.archive, function (jobs) {
                    res.json(jobs);
                });
        } else {
            sendErrorFieldValidation(res);
        }
    });

    // get Unread CV'S
    app.post('/employer/getUnreadCvsForJob', function (req, res) {

        console.log("Im in getCvsForJob post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.google_user_id) && fieldValidation(req.body.job_id)) {
            console.log("jobId" + req.body.job_id);
            console.log("userId" + req.body.google_user_id)
            matchingObjectController.getUnreadCvsForJob(req.body.google_user_id, req.body.job_id, function (cvs) {
                res.json(cvs);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });


    // get liked or unliked CV'S
    app.post('/employer/getRateCvsForJob', function (req, res) {

        console.log("Im in getRateCvsForJob post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.job_id) && fieldValidation(req.body.google_user_id)
            && fieldValidation(req.body.current_status)) {
            console.log("jobId" + req.body.job_id);
            console.log("userId" + req.body.google_user_id);
            console.log("status" + req.body.current_status);
            matchingObjectController.getRateCvsForJob(req.body.google_user_id, req.body.job_id, req.body.current_status, function (cvs) {
                res.json(cvs);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });

    // get favorites CV'S
    app.post('/employer/getFavoriteCvs', function (req, res) {

        console.log("Im in getFavorites post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.job_id) && fieldValidation(req.body.google_user_id)) {
            console.log("jobId" + req.body.job_id);
            console.log("userId" + req.body.google_user_id);
            matchingObjectController.getFavoriteCvs(req.body.google_user_id,
                req.body.job_id, function (cvs) {
                    res.json(cvs);
                });
        } else {
            sendErrorFieldValidation(res);
        }
    });

    //** add status for specific cv  **//
    app.post('/employer/rateCV', function (req, res) {

        console.log("Im in addStatusForCV post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.matching_object_id) && fieldValidation(req.body.status)) {
            console.log("matching_object_id" + req.body.matching_object_id);
            console.log("status" + req.body.status);
            var status = JSON.stringify(req.body.status);
            matchingObjectController.rateCV(req.body.matching_object_id, status, function (status) {
                res.json(status);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });

    //** rate specific cv  **//
    app.post('/employer/rateCV', function (req, res) {

        console.log("Im in rateCV post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.matching_object_id) && fieldValidation(req.body.status)) {
            console.log("matching_object_id" + req.body.matching_object_id);
            console.log("status" + req.body.status);
            var status = JSON.stringify(req.body.status);
            matchingObjectController.rateCV(req.body.matching_object_id, status, function (status) {
                res.json(status);
            });
        } else {
            sendErrorFieldValidation(res);
        }

    });

    //** update rate for specific cv  **//
    app.post('/employer/updateRateCV', function (req, res) {

        console.log("Im in updateRateCV post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.matching_object_id) && fieldValidation(req.body.status)) {
            console.log("matching_object_id" + req.body.matching_object_id);
            console.log("status" + req.body.status);
            var status = JSON.stringify(req.body.status);
            matchingObjectController.updateRateCV(req.body.matching_object_id, status, function (status) {
                res.json(status);
            });
        } else {
            sendErrorFieldValidation(res);
        }

    });

/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////

    app.post('/employer/addCompany',usersController.addCompany);
    app.post('/employer/deleteCompany',usersController.deleteCompany);
    app.post('/employer/updateCompany', usersController.updateCompany);
    app.post('/employer/getCompany',usersController.getCompany);

////////////////////////////////////////////////////// ***  Utils  *** ////////////////////////////////////

    app.post('/getKeyWordsBySector',  matchingObjectController.getKeyWordsBySector);

};

