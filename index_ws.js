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


//////////////////////////////////////////////////////*** Employer *** ////////////////////////////////////////////////

// get Jobs
app.post('/getJobsBySector', jsonParser, function (req, res) {

    console.log("Im in getJobsBySector post");
    if (!req.body) return res.sendStatus(400);
    console.log(req.body.google_user_id);
    console.log(req.body.sector);

    matchingObjectController.getJobsBySector(req.body.google_user_id, req.body.sector, function (jobs) {
        res.json(jobs);
    });
});

// get Unread CV'S
app.post('/getUnreadCvsForJob', jsonParser, function (req, res) {

    console.log("Im in getCvsForJob post");
    if (!req.body) return res.sendStatus(400);
    console.log("jobId" + req.body.job_id);
    console.log("userId" + req.body.google_user_id)

    matchingObjectController.getUnreadCvsForJob(req.body.google_user_id, req.body.job_id, function (cvs) {
        res.json(cvs);
    });
});

// get Unread CV'S
app.post('/getUnreadCvsForJob', jsonParser, function (req, res) {

    console.log("Im in getCvsForJob post");
    if (!req.body) return res.sendStatus(400);
    console.log("jobId" + req.body.job_id);
    console.log("userId" + req.body.google_user_id)

    matchingObjectController.getUnreadCvsForJob(req.body.google_user_id, req.body.job_id, function (cvs) {
        res.json(cvs);
    });
});

// get Unread CV'S
app.post('/getLikedCvsForJob', jsonParser, function (req, res) {

    console.log("Im in getCvsForJob post");
    if (!req.body) return res.sendStatus(400);
    console.log("jobId" + req.body.job_id);
    console.log("userId" + req.body.google_user_id)

    matchingObjectController.getUnreadCvsForJob(req.body.google_user_id, req.body.job_id, function (cvs) {
        res.json(cvs);
    });
});



/////////////////////////////////////////////////////////////// *** JobSeeker *** //////////////////////////////////////


/////////////////////////////////////////////////////////////// ***  Companies  *** ///////////////////////////////////


// Add Company
app.post('/addCompany', jsonParser, function (req, res) {

    console.log("Im in addCompany post");
    if (!req.body) return res.sendStatus(400);
    var company = JSON.stringify(req.body);

    usersController.addCompany(company, function (company) {
        res.json(company);
    });
});


// Delete Company
app.post('/deleteCompany', jsonParser, function (req, res) {

    console.log("Im in deleteCompany post");
    if (!req.body) return res.sendStatus(400);
    var company = JSON.stringify(req.body);

    usersController.deleteCompany(company, function (company) {
        res.json(company);
    });
});


// Update Company
app.post('/updateCompany', jsonParser, function (req, res) {

    console.log("Im in updateCompany post");
    if (!req.body) return res.sendStatus(400);
    var company = JSON.stringify(req.body);

    usersController.updateCompany(company, function (company) {
        res.json(company);
    });
});


/////////////////////////////////////////////////////////////// ***  Formulas  *** ////////////////////////////////////


// Add Formula
app.post('/addFormula', jsonParser, function (req, res) {

    console.log("Im in Formula post");
    if (!req.body) return res.sendStatus(400);
    var formula = JSON.stringify(req.body);

    matchingObjectController.addFormula(formula, function (formula) {
        res.json(formula);
    });
});


// Delete Formula
app.post('/deleteFormula', jsonParser, function (req, res) {

    console.log("Im in deleteFormula post");
    if (!req.body) return res.sendStatus(400);
    var formula = JSON.stringify(req.body);

    matchingObjectController.deleteFormula(formula, function (formula) {
        res.json(formula);
    });
});

// Update Formula
app.post('/updateFormula', jsonParser, function (req, res) {

    console.log("Im in updateFormula post");
    if (!req.body) return res.sendStatus(400);
    var formula = JSON.stringify(req.body);

    matchingObjectController.updateFormula(formula, function (formula) {
        res.json(formula);
    });
});

// get Formula
app.post('/getFormula', jsonParser, function (req, res) {

    console.log("in getFormula post");
    if (!req.body) return res.sendStatus(400);
    console.log(req.body.matching_object_id);

    matchingObjectController.getFormula(req.body.matching_object_id, function (formula) {
        res.json(formula);
    });
});

var port = process.env.PORT || 8000;
app.use('/', express.static('./public')).listen(port);
console.log("listening on port " + port + "\n");

