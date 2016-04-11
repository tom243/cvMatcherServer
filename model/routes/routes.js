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

// Add User
    app.post('/addUser', function (req, res) {

        console.log("Im in addUser post");
        if (!req.body) return res.sendStatus(400);
        var user = JSON.stringify(req.body);

        usersController.addUser(user, function (user) {
            res.json(user);
        });
    });

// Delete User
    app.post('/deleteUser', function (req, res) {

        console.log("Im in deleteUser post");
        if (!req.body) return res.sendStatus(400);
        var user = JSON.stringify(req.body);

        usersController.deleteUser(user, function (user) {
            res.json(user);
        });
    });


// Update User
    app.post('/updateUser', function (req, res) {

        console.log("Im in updateUser post");
        if (!req.body) return res.sendStatus(400);
        var user = JSON.stringify(req.body);

        usersController.updateUser(user, function (user) {
            res.json(user);
        });
    });

// get User
    app.post('/getUser', function (req, res) {

        console.log("Im in getUser post");
        if (!req.body) return res.sendStatus(400);

        if (fieldValidation(req.body.user_id)) {
            console.log("userId " + req.body.user_id);
            usersController.getUser(req.body.user_id, function (user) {
                res.json(user);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });

// get the mongo user id by the user google id
    app.post('/getUserId', function (req, res) {

        console.log("Im in getUserId post");
        if (!req.body) return res.sendStatus(400);

        if (fieldValidation(req.body.google_user_id)) {
            console.log("userId" + req.body.google_user_id);

            usersController.getUserId(req.body.google_user_id, function (userId) {
                res.json(userId);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });


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

// get MatchingObject
    app.post('/getMatchingObject', function (req, res) {

        console.log("Im in getMatchingObject post");
        if (!req.body) return res.sendStatus(400);

        if (fieldValidation(req.body.matching_object_id) && fieldValidation(req.body.matching_object_type)) {
            console.log("matchingObjectId " + req.body.matching_object_id);
            console.log("type " + req.body.matching_object_type);

            matchingObjectController.getMatchingObject(req.body.matching_object_id,
                req.body.matching_object_type, function (matchingObject) {
                    res.json(matchingObject);
                });
        } else {
            sendErrorFieldValidation(res);
        }
    });


    /////////////////////////////////////////////////////////////// *** JobSeeker *** //////////////////////////////////////

    // get Jobs by sector
    app.post('/jobSeeker/getJobsBySector', function (req, res) {

        console.log("Im in getJobsBySector post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.google_user_id) && fieldValidation(req.body.sector)) {
            console.log(req.body.google_user_id);
            console.log(req.body.sector);

            matchingObjectController.getAllJobsBySector(req.body.google_user_id, req.body.sector, function (jobs) {
                res.json(jobs);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });

    // get the jobs that the user sent his cvs to them
    app.post('/jobSeeker/getMyJobs', function (req, res) {

        console.log("Im in getMyJobs post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.google_user_id)) {
            console.log("userId " + req.body.google_user_id);
            matchingObjectController.getMyJobs(req.body.google_user_id, function (jobs) {
                res.json(jobs);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });

    // get the jobs that the user sent his cvs to them
    app.post('/jobSeeker/getFavoritesJobs', function (req, res) {

        console.log("Im in getFavoritesJobs post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.google_user_id)) {
            console.log("userId " + req.body.google_user_id);
            matchingObjectController.getFavoritesJobs(req.body.google_user_id, function (jobs) {
                res.json(jobs);
            });
        } else {
            sendErrorFieldValidation(res);
        }

    });

    // get id of cv
    app.post('/jobSeeker/getIdOfCV', function (req, res) {

        console.log("Im in getIdOfCV post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.user_id)) {
            console.log("user_id " + req.body.user_id);
            matchingObjectController.getIdOfCV(req.body.user_id, function (results) {
                res.json(results);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });

    // check cv with matcher
    app.post('/jobSeeker/checkCV', function (req, res) {

        console.log("Im in checkCV post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.job_id) && fieldValidation(req.body.cv_id)) {
            console.log("matching_object_id " + req.body.job_id);
            console.log("matching_object_id " + req.body.cv_id);
            matchingObjectController.checkCV(req.body.job_id, req.body.cv_id, function (results) {
                res.json(results);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });

    // add the current cv to job
    app.post('/jobSeeker/addCvToJob', function (req, res) {

        console.log("Im in addCvToJob post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.job_id) && fieldValidation(req.body.cv_id) &&
            fieldValidation(req.body.compatibility_level)) {
            console.log("matching_object_id " + req.body.job_id);
            console.log("matching_object_id " + req.body.cv_id);
            console.log("compatibility_level " + req.body.compatibility_level);
            matchingObjectController.addCvToJob(req.body.compatibility_level,
                req.body.job_id, req.body.cv_id, function (results) {
                    res.json(results);
                });
        } else {
            sendErrorFieldValidation(res);
        }
    });

//////////////////////////////////////////////////////*** Employer *** ////////////////////////////////////////////////


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

    // Add Company
    app.post('/employer/addCompany', function (req, res) {

        console.log("Im in addCompany post");
        if (!req.body) return res.sendStatus(400);
        var company = JSON.stringify(req.body);

        usersController.addCompany(company, function (company) {
            res.json(company);
        });
    });

    // Delete Company
    app.post('/employer/deleteCompany', function (req, res) {

        console.log("Im in deleteCompany post");
        if (!req.body) return res.sendStatus(400);
        var company = JSON.stringify(req.body);

        usersController.deleteCompany(company, function (company) {
            res.json(company);
        });
    });

    // Update Company
    app.post('/employer/updateCompany', function (req, res) {

        console.log("Im in updateCompany post");
        if (!req.body) return res.sendStatus(400);
        var company = JSON.stringify(req.body);

        usersController.updateCompany(company, function (company) {
            res.json(company);
        });
    });

    // get Company
    app.post('/employer/getCompany', function (req, res) {

        console.log("Im in getCompany post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.company_id)) {
            console.log("company_id " + req.body.company_id);

            usersController.getCompany(req.body.company_id, function (company) {
                res.json(company);
            });
        } else {
            sendErrorFieldValidation(res);
        }

    });


/////////////////////////////////////////////////////////////// ***  Formulas  *** ////////////////////////////////////

    // Add Formula
    app.post('/employer/addFormula', function (req, res) {

        console.log("Im in Formula post");
        if (!req.body) return res.sendStatus(400);
        var formula = JSON.stringify(req.body);

        matchingObjectController.addFormula(formula, function (formula) {
            res.json(formula);
        });
    });


    // Delete Formula
    app.post('/employer/deleteFormula', function (req, res) {

        console.log("Im in deleteFormula post");
        if (!req.body) return res.sendStatus(400);
        var formula = JSON.stringify(req.body);

        matchingObjectController.deleteFormula(formula, function (formula) {
            res.json(formula);
        });
    });

    // Update Formula
    app.post('/employer/updateFormula', function (req, res) {

        console.log("Im in updateFormula post");
        if (!req.body) return res.sendStatus(400);
        var formula = JSON.stringify(req.body);

        matchingObjectController.updateFormula(formula, function (formula) {
            res.json(formula);
        });
    });

    // get Formula
    app.post('/employer/getFormula', function (req, res) {

        console.log("in getFormula post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.job_id)) {
            console.log(req.body.job_id);

            matchingObjectController.getFormula(req.body.job_id, function (formula) {
                res.json(formula);
            });
        } else {
            sendErrorFieldValidation(res);
        }
    });

    ////////////////////////////////////////////////////// ***  Utils  *** ////////////////////////////////////

// get getKeyWordsBySector
    app.post('/getKeyWordsBySector', function (req, res) {

        console.log("in getKeyWordsBySector post");
        if (!req.body) return res.sendStatus(400);
        if (fieldValidation(req.body.sector)) {
            matchingObjectController.getKeyWordsBySector(req.body.sector, function (keywords) {
                res.json(keywords);
            })
        } else {
            sendErrorFieldValidation(res);
        }

    });

};

