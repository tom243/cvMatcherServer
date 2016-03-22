var express = require('express');
var bodyParser = require('body-parser');
var usersController = require('./usersController');
var matchingObjectController = require('./matchingObjectController');

var app = express();
// create application/json parser
var jsonParser = bodyParser.json();

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.send("Welcome");
});


/////////////////////////////////////////////////////////////// *** Users *** //////////////////////////////////////////

// Add User
app.post('/addUser', jsonParser, function (req, res) {

    console.log("Im in addUser post");
    if (!req.body) return res.sendStatus(400);
    var user = JSON.stringify(req.body);

    usersController.addUser(user, function (user) {
        res.json(user);
    });
});


// Delete User
app.post('/deleteUser', jsonParser, function (req, res) {

    console.log("Im in deleteUser post");
    if (!req.body) return res.sendStatus(400);
    var user = JSON.stringify(req.body);

    usersController.deleteUser(user, function (user) {
        res.json(user);
    });
});


// Update User
app.post('/updateUser', jsonParser, function (req, res) {

    console.log("Im in updateUser post");
    if (!req.body) return res.sendStatus(400);
    var user = JSON.stringify(req.body);

    usersController.updateUser(user, function (user) {
        res.json(user);
    });
});

// get User
app.post('/getUser', jsonParser, function (req, res) {

    console.log("Im in getUser post");
    if (!req.body) return res.sendStatus(400);
    console.log("userId " + req.body.google_user_id);
    console.log("user_type " + req.body.user_type);
    usersController.getUser( req.body.google_user_id, req.body.user_type,  function (user) {
        res.json(user);
    });
});


/////////////////////////////////////////////////////////////// *** Matching Objects *** //////////////////////


// Add Object (Job or CV)
app.post('/addMatchingObject', jsonParser, function (req, res) {

    console.log("Im in addObject post");
    if (!req.body) return res.sendStatus(400);
    var object = JSON.stringify(req.body);

    matchingObjectController.addObject(object, function (object) {
        res.json(object);
    });
});


// Delete Object (Job or CV)
app.post('/deleteMatchingObject', jsonParser, function (req, res) {

    console.log("Im in deleteObject post");
    if (!req.body) return res.sendStatus(400);
    var object = JSON.stringify(req.body);

    matchingObjectController.deleteObject(object, function (object) {
        res.json(object);
    });
});


// Update Object (Job or CV)
app.post('/updateMatchingObject', jsonParser, function (req, res) {

    console.log("Im in updateObject post");
    if (!req.body) return res.sendStatus(400);
    var object = JSON.stringify(req.body);

    matchingObjectController.updateObject(object, function (object) {
        res.json(object);
    });
});

// get MatchingObject
app.post('/employer/getMatchingObject', jsonParser, function (req, res) {

    console.log("Im in getMatchingObject post");
    if (!req.body) return res.sendStatus(400);
    console.log("matchingObjectId " + req.body.matching_object_id);
    console.log("userId " + req.body.google_user_id);
    console.log("type " + req.body.matching_object_type);

    matchingObjectController.getMatchingObject(req.body.google_user_id,
        req.body.matching_object_id,req.body.matching_object_type, function (matchingObject) {
        res.json(matchingObject);
    });
});


//////////////////////////////////////////////////////*** Employer *** ////////////////////////////////////////////////

// get Jobs
app.post('/employer/getJobsBySector', jsonParser, function (req, res) {

    console.log("Im in getJobsBySector post");
    if (!req.body) return res.sendStatus(400);
    console.log("google user id : " + req.body.google_user_id);
    console.log("sector " + req.body.sector);
    console.log("archive" + req.body.archive);

    matchingObjectController.getJobsBySector(req.body.google_user_id, req.body.sector,
        req.body.archive, function (jobs) {
        res.json(jobs);
    });
});

// get Unread CV'S
app.post('/employer/getUnreadCvsForJob', jsonParser, function (req, res) {

    console.log("Im in getCvsForJob post");
    if (!req.body) return res.sendStatus(400);
    console.log("jobId" + req.body.job_id);
    console.log("userId" + req.body.google_user_id)

    matchingObjectController.getUnreadCvsForJob(req.body.google_user_id, req.body.job_id, function (cvs) {
        res.json(cvs);
    });
});


// get liked or unliked CV'S
app.post('/employer/getRateCvsForJob', jsonParser, function (req, res) {

    console.log("Im in getRateCvsForJob post");
    if (!req.body) return res.sendStatus(400);
    console.log("jobId" + req.body.job_id);
    console.log("userId" + req.body.google_user_id);
    console.log("status" + req.body.current_status);

    matchingObjectController.getRateCvsForJob(req.body.google_user_id, req.body.job_id, req.body.current_status, function (cvs) {
        res.json(cvs);
    });
});

// get favorites CV'S
app.post('/employer/getFavoriteCvs', jsonParser, function (req, res) {

    console.log("Im in getFavorites post");
    if (!req.body) return res.sendStatus(400);
    console.log("jobId" + req.body.job_id);
    console.log("userId" + req.body.google_user_id);

    matchingObjectController.getFavoriteCvs(req.body.google_user_id, req.body.job_id, function (cvs) {
        res.json(cvs);
    });
});

/////////////////////////////////////////////////////////////// *** JobSeeker *** //////////////////////////////////////

// get Jobs by sector
app.post('/JobSeeker/getJobsBySector', jsonParser, function (req, res) {

    console.log("Im in getJobsBySector post");
    if (!req.body) return res.sendStatus(400);
    console.log(req.body.google_user_id);
    console.log(req.body.sector);

    matchingObjectController.getAllJobsBySector(req.body.google_user_id,req.body.sector, function (jobs) {
        res.json(jobs);
    });
});

// get the jobs that the user sent his cvs to them
app.post('/JobSeeker/getMyJobs', jsonParser, function (req, res) {

    console.log("Im in getMyJobs post");
    if (!req.body) return res.sendStatus(400);
    console.log("userId " + req.body.google_user_id);

    matchingObjectController.getMyJobs(req.body.google_user_id, function (jobs) {
        res.json(jobs);
    });
});


/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////


// Add Company
app.post('/employer/addCompany', jsonParser, function (req, res) {

    console.log("Im in addCompany post");
    if (!req.body) return res.sendStatus(400);
    var company = JSON.stringify(req.body);

    usersController.addCompany(company, function (company) {
        res.json(company);
    });
});


// Delete Company
app.post('/employer/deleteCompany', jsonParser, function (req, res) {

    console.log("Im in deleteCompany post");
    if (!req.body) return res.sendStatus(400);
    var company = JSON.stringify(req.body);

    usersController.deleteCompany(company, function (company) {
        res.json(company);
    });
});


// Update Company
app.post('/employer/updateCompany', jsonParser, function (req, res) {

    console.log("Im in updateCompany post");
    if (!req.body) return res.sendStatus(400);
    var company = JSON.stringify(req.body);

    usersController.updateCompany(company, function (company) {
        res.json(company);
    });
});


/////////////////////////////////////////////////////////////// ***  Formulas  *** ////////////////////////////////////


// Add Formula
app.post('/employer/addFormula', jsonParser, function (req, res) {

    console.log("Im in Formula post");
    if (!req.body) return res.sendStatus(400);
    var formula = JSON.stringify(req.body);

    matchingObjectController.addFormula(formula, function (formula) {
        res.json(formula);
    });
});


// Delete Formula
app.post('/employer/deleteFormula', jsonParser, function (req, res) {

    console.log("Im in deleteFormula post");
    if (!req.body) return res.sendStatus(400);
    var formula = JSON.stringify(req.body);

    matchingObjectController.deleteFormula(formula, function (formula) {
        res.json(formula);
    });
});

// Update Formula
app.post('/employer/updateFormula', jsonParser, function (req, res) {

    console.log("Im in updateFormula post");
    if (!req.body) return res.sendStatus(400);
    var formula = JSON.stringify(req.body);

    matchingObjectController.updateFormula(formula, function (formula) {
        res.json(formula);
    });
});

// get Formula
app.post('/employer/getFormula', jsonParser, function (req, res) {

    console.log("in getFormula post");
    if (!req.body) return res.sendStatus(400);
    console.log(req.body.job_id);

    matchingObjectController.getFormula(req.body.job_id, function (formula) {
        res.json(formula);
    });
});

var port = process.env.PORT || 8000;
app.use('/', express.static('./public')).listen(port);
console.log("listening on port " + port + "\n");

