var matchingObjectDAO = require("./../model/dao/matchingObjectDAO"); // dao = data access object = model
var request = require('ajax-request');


////////////////////////////////// *** Matching Objects *** ///////////////////////////

//** Adding a new object **//
function addMatchingObject(addObject, callback) {
    console.log("im in matchingObjectControllerrrrr");
    matchingObjectDAO.addMatchingObject(addObject, function (result) {
        callback(result);
    });
}


//** Delete an existing object **//
function deleteMatchingObject(deleteObject, callback) {
    console.log("im in usersControllerrrr");
    matchingObjectDAO.deleteMatchingObject(deleteObject, function (result) {
        callback(result);
    });
}

//** Update an existing object **//
function updateMatchingObject(updateObject, callback) {
    console.log("im in usersControllerrrr");
    matchingObjectDAO.updateMatchingObject(updateObject, function (result) {
        callback(result);
    });
}

//** get Matching Object  **//
function getMatchingObject(matchingObjectId,matchingObjectType, callback) {
    matchingObjectDAO.getMatchingObject(userId, matchingObjectId,
        matchingObjectType, function (result) {
        callback(result);
    });
}


///////////////////////////////////////// ***  Formulas  *** ///////////////////////////

//** Adding a new formula **//
function addFormula(addFormula, callback) {
    matchingObjectDAO.addFormula(addFormula, function (result) {
        callback(result);
    });
}

//** Delete an existing formula **//
function deleteFormula(deleteFormula, callback) {
    matchingObjectDAO.deleteFormula(deleteFormula, function (result) {
        callback(result);
    });
}

//** Update an existing formula **//
function updateFormula(updateFormula, callback) {
    matchingObjectDAO.updateFormula(updateFormula, function (result) {
        callback(result);
    });
}

//** get an existing formula **//
function getFormula(jobId, callback) {
    matchingObjectDAO.getFormula(jobId, function (result) {
        callback(result);
    });
}


///////////////////////////////////////////// *** Employer *** ///////////////////////


//** get jobs by sector for specific employer  **//
function getJobsBySector(userId,sector,isArchive, callback) {
    matchingObjectDAO.getJobsBySector(userId,sector, isArchive, function (result) {
        callback(result);
    });
}


//** get Unread for specific job  **//
function getUnreadCvsForJob(userId, jobId, callback) {
    matchingObjectDAO.getUnreadCvsForJob(userId, jobId, function (result) {
        callback(result);
    });
}


//** get liked or unliked CV'S **//
function getRateCvsForJob(userId, jobId,current_status, callback) {
    matchingObjectDAO.getRateCvsForJob(userId, jobId, current_status, function (result) {
        callback(result);
    });
}

//** get Unread for specific job  **//
function getFavoriteCvs(userId, jobId, callback) {
    matchingObjectDAO.getFavoriteCvs(userId, jobId, function (result) {
        callback(result);
    });
}

//** add status for specific cv  **//
function addStatus(matching_object_id, status, callback) {
    matchingObjectDAO.addStatus(matching_object_id, status, function (result) {
        callback(result);
    });
}


////////////////////////////////// *** JobSeeker *** ///////////////////////

//** get jobs by sector for jobSeeker  **//
function getAllJobsBySector(userId, sector, callback) {
    matchingObjectDAO.getAllJobsBySector(userId,sector, function (result) {
        callback(result);
    });
}

//**  get the jobs that the user has sent his cvs to them  **//
function getMyJobs(userId, callback) {
    matchingObjectDAO.getMyJobs(userId, function (result) {
        callback(result);
    });
}
//**  get the  favourites jobs  **//
function getFavoritesJobs(userId, callback) {
    matchingObjectDAO.getFavoritesJobs(userId, function (result) {
        callback(result);
    });
}

//**  check cv with matcher  **//
function checkCV(jobId, cvId, callback) {

    var matchObjectToSend = {
        job: null,
        cv: null
    };

    var json = {
        "job": {
            "_id": {
                "$oid": "56ed4a6fe4b0a216f2521c3b"
            },
            "matching_object_type": "job",
            "date": "10/03/2016",
            "original_text": null,
            "sector": "software engineering",
            "locations": [
                "Tel Aviv", "Ramat Gan", "Hadera"
            ],
            "candidate_type": ["student","no_experience","mothers","pensioners"],
            "scope_of_position": [
                "full time",
                "by hours"
            ],
            "academy": {
                "academy_type": ["university","college"],
                "degree_type": ["bsc"]
            },
            "formula": {
                "locations": 20,
                "candidate_type": 20,
                "scope_of_position": 20,
                "academy": 20,
                "requirements": 20
            },
            "requirements": [
                {
                    "name": "c++",
                    "years": 1,
                    "mode": "must",
                    "percentage": 80
                },
                {
                    "name": "c",
                    "years": 3,
                    "mode": "must",
                    "percentage": 20
                },
                {
                    "name": "java",
                    "years": 0,
                    "mode": "or",
                    "percentage": null
                },
                {
                    "name": "html",
                    "years": 0,
                    "mode": "or",
                    "percentage": null
                },
                {
                    "name": "c#",
                    "years": 1,
                    "mode": "adv",
                    "percentage": null
                },
                {
                    "name": "js",
                    "years": 2,
                    "mode": "adv",
                    "percentage": null
                },
                {
                    "name": "angular",
                    "years": 1,
                    "mode": "adv",
                    "percentage": null
                }

            ],
            "compatibility_level": null,
            "status": {
                "status_id": "56ed3e9be4b0a216f2521b68",
                "current_status": "unread"
            },
            "favorites": null,
            "cvs": null,
            "google_user_id": "100",
            "active": true,
            "user": "56ed7bd2e4b0fd187fd7a723"
        },

        "cv": {
            "_id": {
                "$oid": "56ed4a6fe4b0a216f2521c3b"
            },
            "matching_object_type": "cv",
            "date": "10/03/2016",
            "original_text": null,
            "sector": "software engineering",
            "locations": [
                "Raanana", "Haifa", "Tel Aviv"
            ],
            "candidate_type": ["discharged_soldiers","no_experience","mothers","pensioners"],
            "scope_of_position": [
                "part time",
                "by hours"
            ],
            "academy": {
                "academy_type": ["college"],
                "degree_type": ["bsc"]
            },
            "formula": {
                "locations": null,
                "candidate_type": null,
                "scope_of_position": null,
                "academy": null,
                "requirements": null
            },
            "requirements": [
                {
                    "name": "c++",
                    "years": 1,
                    "mode": null,
                    "percentage": null
                },
                {
                    "name": "java",
                    "years": 0,
                    "mode": null,
                    "percentage": null
                },
                {
                    "name": "c",
                    "years": 1,
                    "mode": null,
                    "percentage": null
                },
                {
                    "name": "angular",
                    "years": 0.5,
                    "mode": null,
                    "percentage": null
                }

            ],
            "compatibility_level": null,
            "status": {
                "status_id": "56ed3e9be4b0a216f2521b68",
                "current_status": "unread"
            },
            "favorites": null,
            "cvs": null,
            "google_user_id": "100",
            "active": true,
            "user": "56ed7bd2e4b0fd187fd7a723"
        }
    }

    //matchingObjectDAO.checkCV(jobId, cvId,  function (result) {

        matchingObjectDAO.getMatchingObject(jobId,"job",function (job) {
            matchObjectToSend.job = job;
            matchObjectToSend.job.requirements = [];

            matchingObjectDAO.getMatchingObject(cvId,"cv",function (cv) {
                matchObjectToSend.cv = cv;
                console.log("job" , job);

                console.log(" matchObjectToSend" , matchObjectToSend);
                request.post({
                    url: 'https://matcherlogic.herokuapp.com/addFormula',
                    data: json,
                    headers: {
                        "Content-Type" : "application/json"
                    }
                }, function(err, res, body) {
                    if (err) {
                        console.log("error from matcher");
                        callback(false);
                    } else {
                        var jsonResponse = JSON.parse(body);
                        console.log(jsonResponse);
                        matchingObjectDAO.saveMatcherFormula(jsonResponse ,function()  {
                            callback(jsonResponse);
                        });
                    }
                });
            })
        })
    //});
}


////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.addMatchingObject       = addMatchingObject;
exports.deleteMatchingObject    = deleteMatchingObject;
exports.updateMatchingObject    = updateMatchingObject;
exports.getMatchingObject       = getMatchingObject;

exports.addFormula      = addFormula;
exports.deleteFormula   = deleteFormula;
exports.updateFormula   = updateFormula;
exports.getFormula      = getFormula;

exports.getJobsBySector     = getJobsBySector;
exports.getUnreadCvsForJob  = getUnreadCvsForJob;
exports.getRateCvsForJob    = getRateCvsForJob;
exports.getFavoriteCvs      = getFavoriteCvs;

exports.addStatus = addStatus;

exports.getAllJobsBySector  = getAllJobsBySector;
exports.getMyJobs           = getMyJobs;
exports.getFavoritesJobs    = getFavoritesJobs;
exports.checkCV             = checkCV;