var matchingObjectDAO = require("./../model/dao/matchingObjectDAO"); // dao = data access object = model


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
function getMatchingObject(userId, matchingObjectId,matchingObjectType, callback) {
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

//**  get the jobs that the user sent his cvs to them  **//
function getMyJobs(userId, callback) {
    matchingObjectDAO.getMyJobs(userId, function (result) {
        callback(result);
    });
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