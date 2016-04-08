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
    matchingObjectDAO.getMatchingObject(matchingObjectId, matchingObjectType, function (result) {
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

//** rate specific cv  **//
function rateCV(matching_object_id, status, callback) {
    matchingObjectDAO.rateCV(matching_object_id, status, function (result) {
        callback(result);
    });
}

//** update rate for specific cv  **//
function updateRateCV(matching_object_id, status, callback) {
    matchingObjectDAO.updateRateCV(matching_object_id, status, function (result) {
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

    //matchingObjectDAO.checkCV(jobId, cvId,  function (result) {

        matchingObjectDAO.getMatchingObject(jobId,"job",function (job) {
            matchObjectToSend.job = job;
            //matchObjectToSend.job.requirements = [];

            matchingObjectDAO.getMatchingObject(cvId,"cv",function (cv) {
                matchObjectToSend.cv = cv;

                console.log(matchObjectToSend);
                request.post({
                    url: 'https://matcherlogic.herokuapp.com/addFormula',
                    data: matchObjectToSend,
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

exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;

exports.getAllJobsBySector  = getAllJobsBySector;
exports.getMyJobs           = getMyJobs;
exports.getFavoritesJobs    = getFavoritesJobs;
exports.checkCV             = checkCV;