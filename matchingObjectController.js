var matchingObjectDAO = require("./matchingObjectDAO"); // dao = data access object = model 


/////////////////////////////////////////////////////////////// *** Matching Objects *** ///////////////////////

//** Adding a new object **//
function addObject(addObject, callback) {
    console.log("im in matchingObjectControllerrrrr");
    matchingObjectDAO.addObject(addObject, function (result) {
        callback(result);
    });
};


//** Delete an existing object **//
function deleteObject(deleteObject, callback) {
    console.log("im in usersControllerrrr");
    matchingObjectDAO.deleteObject(deleteObject, function (result) {
        callback(result);
    });
};

//** Update an existing object **//
function updateObject(updateObject, callback) {
    console.log("im in usersControllerrrr");
    matchingObjectDAO.updateObject(updateObject, function (result) {
        callback(result);
    });
};


/////////////////////////////////////////////////////////////// ***  Formulas  *** ///////////////////////////

//** Adding a new formula **//
function addFormula(addFormula, callback) {
    matchingObjectDAO.addFormula(addFormula, function (result) {
        callback(result);
    });
};


//** Delete an existing formula **//
function deleteFormula(deleteFormula, callback) {
    matchingObjectDAO.deleteFormula(deleteFormula, function (result) {
        callback(result);
    });
};


//** Update an existing formula **//
function updateFormula(updateFormula, callback) {
    matchingObjectDAO.updateFormula(updateFormula, function (result) {
        callback(result);
    });
};

//** get an existing formula **//
function getFormula(jobId, callback) {
    matchingObjectDAO.getFormula(jobId, function (result) {
        callback(result);
    });
};


///////////////////////////////////////////// *** JOBS *** ///////////////////////


//** get jobs by sector for specific employer  **//
function getJobsBySector(userId,sector, callback) {
    matchingObjectDAO.getJobsBySector(userId,sector, function (result) {
        callback(result);
    });
};


//** get Unread for specific job  **//
function getUnreadCvsForJob(userId, jobId, callback) {
    matchingObjectDAO.getUnreadCvsForJob(userId, jobId, function (result) {
        callback(result);
    });
};



///////////////////////////////////////////// *** CVS *** ///////////////////////

///////////////////////////////////////////// *** EXPORTS *** ///////////////////////

exports.addObject = addObject;
exports.deleteObject = deleteObject;
exports.updateObject = updateObject;

exports.addFormula = addFormula;
exports.deleteFormula = deleteFormula;
exports.updateFormula = updateFormula;
exports.getFormula= getFormula;

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob= getUnreadCvsForJob;