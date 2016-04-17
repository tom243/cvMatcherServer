
/* Private Functions */

function fieldValidation(field) {
    if ((typeof field !== 'undefined' && field != null )) {
        return true;
    } else {
        return false;
    }
}

function matcherRequirementsValidation(requirements) {
    var valid = true;
    if (requirements && fieldValidation(requirements.grade) && fieldValidation(requirements.details)) {
        if (requirements.details.constructor === Array) {
            for (var i=0; i < requirements.details; i++) {
                valid = requirements.details[i].name && requirements.details[i].grade ? true : false
            }
            return valid;
        }else {
                return valid;
            }
    }
}

function matcherFormulaValidation(formula) {
    return fieldValidation(formula.requirements)
    && matcherRequirementsValidation(formula.requirements)
    && fieldValidation(formula.candidate_type)
    && fieldValidation(formula.locations)
    && fieldValidation(formula.scope_of_position)
    && fieldValidation(formula.academy) ? true : false
}

function statusValidation(status) {
    return fieldValidation(status.current_status)
    && ( status.current_status === "liked" || status.current_status === "unliked" )
    && ( (status.current_status === "liked"  && fieldValidation(status.stars) )
    || ( status.current_status === "unliked" && fieldValidation(status.description) ? true : false ) )
}

var sectorArr = ["software engineering"];

/* Public functions */

/////////////////////////////////////////////////// *** Users *** /////////////////////////////////

function addUser(req){
    return req.body
    && fieldValidation(req.body.google_user_id)
    && fieldValidation(req.body.first_name)
    && fieldValidation(req.body.last_name)
    && fieldValidation(req.body.email) ? true : false
}

function deleteUser(req){
    return req.body && fieldValidation(req.body.user_id) ? true : false
}

function updateUser(req){
    return req.body
    && fieldValidation(req.body._id)
    && fieldValidation(req.body.personal_id)
    && fieldValidation(req.body.first_name)
    && fieldValidation(req.body.last_name)
    && fieldValidation(req.body.birth_date)
    && fieldValidation(req.body.address)
    && fieldValidation(req.body.email)
    && fieldValidation(req.body.phone_number)
    && fieldValidation(req.body.linkedin) ? true : false
}

function getUser(req){
    return req.body && fieldValidation(req.body.user_id) ? true : false
}

function getUserId(req){
    return req.body && fieldValidation(req.body.google_user_id) ? true : false
}

////////////////////////////////////////////// ***  Companies  *** ////////////////////////////////////

function addCompany(req){
    return req.body
    && fieldValidation(req.body.name)
    && fieldValidation(req.body.logo)
    && fieldValidation(req.body.p_c)
    && fieldValidation(req.body.address)
    && fieldValidation(req.body.phone_number)
    && fieldValidation(req.body.user_id) ? true : false
}

function deleteCompany(req){
    return req.body && fieldValidation(req.body.company_id) ? true : false
}

function updateCompany(req){
    return req.body
    && fieldValidation(req.body._id)
    && fieldValidation(req.body.name)
    && fieldValidation(req.body.logo)
    && fieldValidation(req.body.p_c)
    && fieldValidation(req.body.address)
    && fieldValidation(req.body.phone_number) ? true : false
}

function getCompany(req){
    return req.body && fieldValidation(req.body.company_id) ? true : false
}

////////////////////////////////// *** Matching Objects *** ///////////////////////////

function getMatchingObject(req){
    return req.body
    && fieldValidation(req.body.matching_object_id)
    && fieldValidation(req.body.matching_object_type)
    && (req.body.matching_object_type == "cv" || req.body.matching_object_type == "job" )
        ? true : false
}

function deleteMatchingObject(req){
    return req.body && fieldValidation(req.body.matching_object_id)  ? true : false
}

function reviveMatchingObject(req){
    return req.body && fieldValidation(req.body.matching_object_id)  ? true : false
}

///////////////////////////////////////////// *** Employer *** ///////////////////////

function getJobsBySector(req){
    return req.body
    && fieldValidation(req.body.user_id)
    && fieldValidation(req.body.sector)
    && sectorArr.indexOf(req.body.sector)!= -1
    && fieldValidation(req.body.archive)
    && typeof(req.body.archive) === "boolean" ? true : false
}

function getUnreadCvsForJob(req){
    return req.body
    && fieldValidation(req.body.user_id)
    && fieldValidation(req.body.job_id) ? true : false
}

function getRateCvsForJob(req){
    return req.body
    && fieldValidation(req.body.user_id)
    && fieldValidation(req.body.job_id)
    && fieldValidation(req.body.current_status)
    && ( req.body.current_status === "liked" || req.body.current_status === "unliked" )
        ? true : false
}

function rateCV(req){
    return req.body
    && fieldValidation(req.body.cv_id)
    && fieldValidation(req.body.status)
    && statusValidation(req.body.status) ? true : false
}

function updateRateCV(req){
    return req.body
    && fieldValidation(req.body.cv_id)
    && fieldValidation(req.body.status)
    && statusValidation(req.body.status) ? true : false
}

////////////////////////////////// *** JobSeeker *** ///////////////////////

function getAllJobsBySector(req){
    return req.body
    && fieldValidation(req.body.user_id)
    && fieldValidation(req.body.sector)
    && sectorArr.indexOf(req.body.sector)!= -1 ? true : false
}

function getMyJobs(req){
    return req.body
    && fieldValidation(req.body.user_id) ? true : false
}

function getFavoritesJobs(req){
    return req.body
    && fieldValidation(req.body.user_id) ? true : false
}

function getIdOfCV(req){
    return req.body
    && fieldValidation(req.body.user_id) ? true : false
}

function checkCV(req){
    return req.body
    && fieldValidation(req.body.job_id)
    && fieldValidation(req.body.cv_id) ? true : false
}

function addCvToJob(req){
    return req.body
    && fieldValidation(req.body.job_id)
    && fieldValidation(req.body.cv_id) ? true : false
}

function matcherResponse(response){
    console.log("response" , response);
    return response
    && fieldValidation(response.total_grade)
    && fieldValidation(response.formula)
    && matcherFormulaValidation(response.formula) ? true : false

}

///////////////////////////////////////////// *** Utils *** ///////////////////////

function getKeyWordsBySector(req){
    return req.body
    && fieldValidation(req.body.sector)
    && sectorArr.indexOf(req.body.sector)!= -1 ? true : false
}

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.getUser = getUser;
exports.getUserId = getUserId;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

exports.addCompany = addCompany;
exports.deleteCompany = deleteCompany;
exports.reviveMatchingObject = reviveMatchingObject;
exports.updateCompany = updateCompany;
exports.getCompany = getCompany;

exports.getMatchingObject = getMatchingObject;
exports.deleteMatchingObject = deleteMatchingObject;

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;
exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;
exports.getFavoritesJobs = getFavoritesJobs;
exports.getIdOfCV = getIdOfCV;
exports.checkCV = checkCV;
exports.addCvToJob = addCvToJob;
exports.matcherResponse = matcherResponse;

exports.getKeyWordsBySector = getKeyWordsBySector;