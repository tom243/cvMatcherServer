var validationDAO = require('./../dao/validationDAO');

/* Load validation values from DB */

var sectorArr = [];
var candidateTypeArr = [];
var scopeOfPositionArr = [];
var academyTypeArr = [];
var degreeNameArr = [];
var degreeTypeArr = [];


validationDAO.loadValidationValues(function (status, result) {

    if (status === 200) {

        sectorArr = result.sector;
        candidateTypeArr = result.candidate_type;
        scopeOfPositionArr = result.scope_of_position;
        academyTypeArr = result.academy_type;
        degreeNameArr = result.degree_name;
        degreeTypeArr = result.degree_type;

        console.log("init values loaded successfully");

    } else {
        console.log("error while trying to upload init data");
    }
});

/* Private Functions */

/* Common */

function fieldValidation(field, fieldName) {
    var isValid = !!(typeof field !== 'undefined' && field != null);

    if (!isValid) {
        console.log("error in field: " + fieldName);
    }
    return isValid
}

/* Input types validations */

function validateYear(year) {

    var isValid = /^\d{4}$/.test(year);

    if (!isValid) {
        console.log("error in validate year");
    }
    return isValid
}

function validatePositiveNumber(number) {

    var isValid = /^[1-9][0-9]?$|^100$|^0$/.test(number);

    if (!isValid) {
        console.log("error in validate positive number");
    }
    return isValid
}

function validatePersonalId(id) {
    var multiply, digit, sum, numeric;

    // Numeric only
    if (!/^\d{1,9}$/g.test(id)) {
        console.log("error in validate personal id");
        return false;
    }

    // Save original value and length (without leading 0s)
    numeric = parseInt(id, 10);

    if (numeric === 0) {
        console.log("error in validate personal id");
        return false;
    }

    // Perform safety digit check
    for (multiply = false, sum = 0; numeric > 0; multiply = !multiply) {
        digit = numeric % 10;
        numeric = parseInt(( numeric / 10 ), 10);
        if (digit !== 0) {
            if (multiply) {
                digit *= 2;
                if (digit > 9) {
                    digit = ( 1 /*The first digit will be 1 at most*/ + ( digit % 10 ) );
                }
            }
            sum += digit;
        }
    }

    var isValid = ( sum % 10 === 0 );

    if (!isValid) {
        console.log("error in validate personal id");
    }
    return isValid
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var isValid = re.test(email);

    if (!isValid) {
        console.log("error in validate personal id");
    }
    return isValid;
}

/* End common */

/* Private functions for matcher */

function matcherRequirementsValidation(requirements) {
    var isValid = true;
    if (requirements && fieldValidation(requirements.grade, "requirements.grade") &&
        fieldValidation(requirements.details, "requirements.details")) {
        if (requirements.details.constructor === Array) {
            for (var i = 0; i < requirements.details.length; i++) {
                if (!(fieldValidation(requirements.details[i].name, "requirements.details.name")
                    && fieldValidation(requirements.details[i].grade, "requirements.details.grade"))) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) {
                console.log("error in matcherRequirementsValidation");
            }
            return isValid;
        }
    } else {
        console.log("error in matcherRequirementsValidation");
        return false;
    }
}

function matcherFormulaValidation(formula) {

    var isValid = fieldValidation(formula.requirements, "requirements")
        && matcherRequirementsValidation(formula.requirements)
        && fieldValidation(formula.candidate_type, "candidate_type")
        && fieldValidation(formula.locations, "locations")
        && fieldValidation(formula.scope_of_position, "scope_of_position")
        && fieldValidation(formula.academy, "academy");

    if (!isValid) {
        console.log("error in validate matcherFormulaValidations");
    }
    return isValid;
}

/* End private functions for matcher */

function statusValidation(status) {

    var isValid = fieldValidation(status.current_status, "current_status")
        && ( status.current_status === "liked" || status.current_status === "unliked" )
        && ( (status.current_status === "liked" && fieldValidation(status.stars, "stars") )
        || ( status.current_status === "unliked" && fieldValidation(status.description, "description") ) );

    if (!isValid) {
        console.log("error in validate statusValidation");
    }
    return isValid;
}

/* Private functions for matching object */

function personalPropertiesValidation(personalProperties) {

    var isValid = personalProperties
    && fieldValidation(personalProperties.university_degree, "university_degree")
    && fieldValidation(personalProperties.degree_graduation_with_honors, "degree_graduation_with_honors")
    && fieldValidation(personalProperties.above_two_years_experience, "above_two_years_experience")
    && fieldValidation(personalProperties.psychometric_above_680, "psychometric_above_680")
    && fieldValidation(personalProperties.multilingual, "multilingual")
    && fieldValidation(personalProperties.volunteering, "volunteering")
    && fieldValidation(personalProperties.full_army_service, "full_army_service")
    && fieldValidation(personalProperties.officer_in_the_military, "officer_in_the_military")
    && fieldValidation(personalProperties.high_school_graduation_with_honors, "high_school_graduation_with_honors")
    && fieldValidation(personalProperties.youth_movements, "youth_movements");

    if (isValid) {
        for (var property in personalProperties) {
            if (!(typeof(personalProperties[property]) === "boolean" ) && property != "_id") {
                isValid = false;
                break;
            }
        }
    }

    if (!isValid) {
        console.log("error in validate personalPropertiesValidation");
    }
    return isValid;
}

function historyTimelineValidation(historyTimeline) {

    var isValid = true;
    for (var i = 0; i < historyTimeline.length; i++) {
        isValid = historyTimeline[i].text
            && (historyTimeline[i].start_year && validateYear(historyTimeline[i].start_year))
            && (historyTimeline[i].end_year && validateYear(historyTimeline[i].end_year))
            && (historyTimeline[i].type
            && (historyTimeline[i].type === "experience" || historyTimeline[i].type === "education" ));

        if (!isValid) {
            console.log("error in validate historyTimelineValidation");
            break;
        }
    }

    return isValid;
}

function originalTextValidation(originalText, type) {

    var isValid;

    if (originalText) {
        if (type === "cv") {
            isValid= originalText.history_timeline
            && originalText.history_timeline.constructor === Array
            && historyTimelineValidation(originalText.history_timeline);

        } else if (type === "job") {
            isValid= fieldValidation(originalText.title, "title")
            && fieldValidation(originalText.description, "description")
            && fieldValidation(originalText.requirements, "requirements");
        } else {
            console.log("type not valid");
            return false;
        }
    } else {
        console.log("type not valid");
        return false;
    }

    if (!isValid) {
        console.log("error in validate originalTextValidation");
    }
    return isValid;
}

function locationsValidation(locations) {

    var isValid = locations
        && fieldValidation(locations, "locations")
        && locations.constructor === Array
        && locations.length > 0;

    if (!isValid) {
        console.log("error in locationsValidation");
    }
    return isValid;
}

function candidateTypeValidation(candidateType) {


    var isValid = candidateType
    && candidateType.constructor === Array
    && candidateType.length > 0 ? true : false;

    if (isValid) {
        for (var i = 0; i < candidateType.length; i++) {
            isValid = candidateTypeArr.indexOf(candidateType[i]) != -1;
            if (!isValid) break;
        }
    }

    if (!isValid) {
        console.log("error in candidateTypeValidation");
    }
    return isValid;
}

function scopeOfPositionValidation(scopeOfPosition) {

    var isValid = scopeOfPosition
    && scopeOfPosition.constructor === Array
    && scopeOfPosition.length > 0 ? true : false;

    if (isValid) {
        for (var i = 0; i < scopeOfPosition.length; i++) {
            isValid = scopeOfPositionArr.indexOf(scopeOfPosition[i]) != -1;
            if (!isValid) break;
        }
    }

    if (!isValid) {
        console.log("error in scopeOfPositionValidation");
    }
    return isValid;
}

function academyValidation(academy) {

    var isValid = academy
    && (fieldValidation(academy.academy_type, "academy_type") && academy.academy_type.constructor === Array
    && academy.academy_type.length > 0)
    && (fieldValidation(academy.degree_name, "degree_name") && degreeNameArr.indexOf(academy.degree_name) != -1)
    && (fieldValidation(academy.degree_type, "degree_type") && academy.degree_type.constructor === Array
    && academy.degree_type.length > 0);

    if (isValid) {
        for (var i = 0; i < academy.academy_type.length; i++) {
            isValid = academyTypeArr.indexOf(academy.academy_type[i]) != -1;
            if (!isValid) break;
        }
        if (isValid) {
            for (var j = 0; j < academy.degree_type.length; j++) {
                isValid = degreeTypeArr.indexOf(academy.degree_type[j]) != -1;
                if (!isValid) break;
            }

        }
    }

    if (!isValid) {
        console.log("error in academyValidation");
    }
    return isValid;
}

function formulaValidation(formula) {

    var isValid = formula
    && fieldValidation(formula.locations, "locations")
    && fieldValidation(formula.candidate_type, "candidate_type")
    && fieldValidation(formula.scope_of_position, "scope_of_position")
    && fieldValidation(formula.academy, "academy")
    && fieldValidation(formula.requirements, "requirements") ? true : false;

    var formulaAmount = 0;
    if (isValid) {
        for (var property in formula) {

            if (property != "_id" && property != "__v" && property != "matching_requirements") {
                if ((validatePositiveNumber(formula[property]))) { // check for positive number and lower then 100
                    formulaAmount += formula[property];
                } else {
                    isValid = false;
                    break;
                }
            }
        }
        isValid =  isValid && formulaAmount === 100; // verify formula is not bigger the 100
    }

    if (!isValid) {
        console.log("error in formulaValidation");
    }
    return isValid;
}

function requirementsValidation(requirements, type) {

    var mustPercentageSum = 0;
    var isValid = requirements
        && requirements.constructor === Array;

    if (isValid) {
        for (var i = 0; i < requirements.length; i++) {
            isValid = fieldValidation(requirements[i].combination, "combination")
                && requirements[i].combination.constructor === Array;
            if (isValid) {
                for (var j = 0; j < requirements[i].combination.length; j++) {
                    if (type === "cv") {
                        isValid = fieldValidation(requirements[i].combination[j].name, "combination.name")
                            && (fieldValidation(requirements[i].combination[j].years, "combination.years")
                            && validatePositiveNumber(requirements[i].combination[j].years));
                        if (!isValid) break;
                    } else if (type === "job") {
                        if (fieldValidation(requirements[i].combination[j].mode, "combination.mode")) {
                            switch (requirements[i].combination[j].mode) {
                                case "must" :
                                    isValid = fieldValidation(requirements[i].combination[j].name, "combination.name")
                                        && (fieldValidation(requirements[i].combination[j].years, "combination.years")
                                        && validatePositiveNumber(requirements[i].combination[j].years))
                                        && (fieldValidation(requirements[i].combination[j].percentage, "combination.percentage")
                                        && validatePositiveNumber(requirements[i].combination[j].percentage));
                                    if (isValid) {
                                        mustPercentageSum += requirements[i].combination[j].percentage;
                                    } else return false;
                                    break;
                                case "adv":
                                case "or" :
                                    isValid = fieldValidation(requirements[i].combination[j].name, "combination.name")
                                        && (fieldValidation(requirements[i].combination[j].years, "combination.years")
                                        && validatePositiveNumber(requirements[i].combination[j].years));
                                    break;
                                default :
                                    console.log("wrong mode");
                                    return false; // wrong mode sent
                                    break;
                            }
                        } else return false;
                    } else return false;
                    if (!isValid) return false;
                }
                if (mustPercentageSum != 100 && type == "job") return false;
                else mustPercentageSum = 0;
            } else return false;
        }
        return isValid;
    } else return false;
}

/* End private functions for matching object */


/* Public functions */

/////////////////////////////////////////////////// *** Users *** /////////////////////////////////

function addUser(req) {
    return req.body
    && fieldValidation(req.body.google_user_id, "google_user_id")
    && (fieldValidation(req.body.email, "email") && validateEmail(req.body.email));
}

function deleteUser(req) {
    return req.body && fieldValidation(req.body.user_id, "req.body.user_id");
}

function updateUser(req) {
    return req.body
    && fieldValidation(req.body._id, "_id")
    && (fieldValidation(req.body.personal_id, "personal_id") && validatePersonalId(req.body.personal_id))
    && fieldValidation(req.body.first_name, "first_name")
    && fieldValidation(req.body.last_name, "last_name")
    && fieldValidation(req.body.birth_date, "birth_date")
    && fieldValidation(req.body.address, "address")
    && (fieldValidation(req.body.email, "email") && validateEmail(req.body.email))
    && fieldValidation(req.body.phone_number, "phone_number")
    && fieldValidation(req.body.linkedin, "linkedin");
}

function getUser(req) {
    return req.body && fieldValidation(req.body.user_id, "user_id");
}

function getUserId(req) {
    return req.body && fieldValidation(req.body.google_user_id, "google_user_id");
}

////////////////////////////////////////////// ***  Companies  *** ////////////////////////////////////

function addCompany(req) {
    return req.body
    && fieldValidation(req.body.name, "name")
    && fieldValidation(req.body.logo, "logo")
    && fieldValidation(req.body.p_c, "p_c")
    && fieldValidation(req.body.address, "address")
    && fieldValidation(req.body.phone_number, "phone_number")
    && fieldValidation(req.body.password, "password")
    && fieldValidation(req.body.user_id, "user_id");
}

function addToExistingCompany(req) {
    return req.body
    && fieldValidation(req.body.user_id, "user_id")
    && fieldValidation(req.body.company_id, "company_id")
    && fieldValidation(req.body.password, "password");
}

function deleteCompany(req) {
    return req.body && fieldValidation(req.body.company_id, "company_id");
}

function updateCompany(req) {
    return req.body
    && fieldValidation(req.body._id, "_id")
    && fieldValidation(req.body.name, "name")
    && fieldValidation(req.body.logo, "logo")
    && fieldValidation(req.body.p_c, "p_c")
    && fieldValidation(req.body.address, "address")
    && fieldValidation(req.body.phone_number, "phone_number");
}

function getCompany(req) {
    return req.body && fieldValidation(req.body.company_id, "company_id");
}

function changeCompanyPassword(req) {
    return req.body
    && fieldValidation(req.body.company_id, "company_id")
    && fieldValidation(req.body.old_password, "old_password")
    && fieldValidation(req.body.new_password, "new_password");
}

////////////////////////////////// *** Matching Objects *** ///////////////////////////

function addMatchingObject(req) {
    var matchingObject = req.body;
    if (matchingObject
        && fieldValidation(matchingObject.date, "date")
        && fieldValidation(matchingObject.sector, "sector")
        && fieldValidation(matchingObject.user, "user")
        && fieldValidation(matchingObject.matching_object_type, "matching_object_type")
        && originalTextValidation(matchingObject.original_text, matchingObject.matching_object_type)
        && locationsValidation(matchingObject.locations)
        && candidateTypeValidation(matchingObject.candidate_type)
        && scopeOfPositionValidation(matchingObject.scope_of_position)
        && academyValidation(matchingObject.academy)

    ) {

        if (!requirementsValidation(matchingObject.requirements, matchingObject.matching_object_type)) {
            console.log("error in requirementsValidation");
            return false;
        }

        if (matchingObject.matching_object_type === "cv") {
            return personalPropertiesValidation(matchingObject.personal_properties);
        } else if (matchingObject.matching_object_type === "job") {
            return fieldValidation(matchingObject.compatibility_level, "compatibility_level")
            && validatePositiveNumber(matchingObject.compatibility_level) // check number between 1-100
            && formulaValidation(matchingObject.formula);
        } else {
            console.log("matching_object_type not valid");
            return false;
        }
    } else {
        return false;
    }
}

function getMatchingObject(req) {
    return req.body
    && fieldValidation(req.body.matching_object_id, "matching_object_id")
    && fieldValidation(req.body.matching_object_type, "matching_object_type")
    && (req.body.matching_object_type == "cv" || req.body.matching_object_type == "job" );
}

function deleteMatchingObject(req) {
    return req.body && fieldValidation(req.body.matching_object_id, "matching_object_id");
}

function reviveMatchingObject(req) {
    return req.body && fieldValidation(req.body.matching_object_id, "matching_object_id");
}

function updateMatchingObject(req) {
    var matchingObject = req.body;
    if (matchingObject
        && fieldValidation(matchingObject._id, "_id")
        && fieldValidation(matchingObject.sector, "sector")
        && fieldValidation(matchingObject.matching_object_type, "matching_object_type")
        && fieldValidation(matchingObject.original_text._id, "original_text._id")
        && originalTextValidation(matchingObject.original_text, matchingObject.matching_object_type)
        && locationsValidation(matchingObject.locations)
        && candidateTypeValidation(matchingObject.candidate_type)
        && scopeOfPositionValidation(matchingObject.scope_of_position)
        && fieldValidation(matchingObject.academy._id, "academy._id")
        && academyValidation(matchingObject.academy)

    ) {

        if (!requirementsValidation(matchingObject.requirements, matchingObject.matching_object_type)) {
            console.log("error in requirementsValidation");
            return false;
        }

        if (matchingObject.matching_object_type === "cv") {
            return fieldValidation(matchingObject.personal_properties._id, "personal_properties._id") &&
                personalPropertiesValidation(matchingObject.personal_properties)
        } else if (matchingObject.matching_object_type === "job") {
            return fieldValidation(matchingObject.compatibility_level, "compatibility_level")
            && validatePositiveNumber(matchingObject.compatibility_level) // check number between 1-100
            && fieldValidation(matchingObject.formula._id, "formula._id")
            && formulaValidation(matchingObject.formula);
        } else {
            console.log("matching_object_type not valid");
            return false;
        }
    } else {
        return false;
    }
}


///////////////////////////////////////////// *** Employer *** ///////////////////////

function getJobsBySector(req) {
    return req.body
    && fieldValidation(req.body.user_id, "user_id")
    && fieldValidation(req.body.sector, "sector")
    && sectorArr.indexOf(req.body.sector) != -1
    && fieldValidation(req.body.archive, "archive")
    && typeof(req.body.archive) === "boolean";
}

function getUnreadCvsForJob(req) {
    return req.body
    && fieldValidation(req.body.user_id, "user_id")
    && fieldValidation(req.body.job_id, "job_id");
}

function getRateCvsForJob(req) {
    return req.body
    && fieldValidation(req.body.user_id, "user_id")
    && fieldValidation(req.body.job_id, "job_id")
    && fieldValidation(req.body.current_status, "current_status")
    && ( req.body.current_status === "liked" || req.body.current_status === "unliked" );
}

function rateCV(req) {
    return req.body
    && fieldValidation(req.body.cv_id, "cv_id")
    && fieldValidation(req.body.user_id, "user_id")
    && fieldValidation(req.body.status, "status")
    && statusValidation(req.body.status);
}

function updateRateCV(req) {
    return req.body
    && fieldValidation(req.body.cv_id, "cv_id")
    && fieldValidation(req.body.status, "status")
    && statusValidation(req.body.status);
}

function hireToJob(req) {
    return req.body
    && fieldValidation(req.body.cv_id, "cv_id")
    && fieldValidation(req.body.user_id, "user_id");
}

function getHiredCvs(req) {
    return req.body
    && fieldValidation(req.body.user_id, "user_id")
    && fieldValidation(req.body.job_id, "job_id");
}

////////////////////////////////// *** JobSeeker *** ///////////////////////

function getAllJobsBySector(req) {
    return req.body
    && fieldValidation(req.body.user_id, "user_id)")
    && fieldValidation(req.body.sector, "sector")
    && sectorArr.indexOf(req.body.sector) != -1 ;
}

function getMyJobs(req) {
    return req.body
    && fieldValidation(req.body.user_id, "user_id")
    && fieldValidation(req.body.active, "active")
    && typeof(req.body.active) === "boolean" ;
}

function getFavoritesJobs(req) {
    return req.body
    && fieldValidation(req.body.user_id, "user_id");
}

function checkCV(req) {
    return req.body
    && fieldValidation(req.body.job_id, "job_id")
    && fieldValidation(req.body.cv_id, "cv_id");
}

function addCvToJob(req) {
    return req.body
    && fieldValidation(req.body.job_id, "job_id")
    && fieldValidation(req.body.cv_id, "cv_id");
}

function matcherResponse(response) {
    console.log("response", response);
    return response
    && fieldValidation(response.total_grade, "total_grade")
    && fieldValidation(response.formula, "formula")
    && matcherFormulaValidation(response.formula) ;
}

function predictorResponse(response) {
    return typeof(response) === "boolean"
}

function updateFavoriteJob(req) {
    return req.body
    && fieldValidation(req.body.job_seeker_job_id, "job_seeker_job_id")
    && fieldValidation(req.body.favorite, "favorite")
    && typeof(req.body.favorite) === "boolean" ;
}

function updateActivityJob(req) {
    return req.body
    && fieldValidation(req.body.job_seeker_job_id, "job_seeker_job_id")
    && fieldValidation(req.body.active, "active")
    && typeof(req.body.active) === "boolean" ;
}

///////////////////////////////////////////// *** Utils *** ///////////////////////

function getKeyWordsBySector(req) {
    return req.body
    && fieldValidation(req.body.sector, "sector")
    && sectorArr.indexOf(req.body.sector) != -1 ;
}

function addKeyWords(req) {
    console.log("req.body.sector " + req.body.sector);

    return req.body
    && fieldValidation(req.body.sector, "sector")
    && fieldValidation(req.body.words_list, "words_list")
    && req.body.words_list.constructor === Array

}

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.getUser = getUser;
exports.getUserId = getUserId;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

exports.addCompany = addCompany;
exports.addToExistingCompany = addToExistingCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;
exports.getCompany = getCompany;
exports.changeCompanyPassword = changeCompanyPassword;

exports.addMatchingObject = addMatchingObject;
exports.getMatchingObject = getMatchingObject;
exports.deleteMatchingObject = deleteMatchingObject;
exports.reviveMatchingObject = reviveMatchingObject;
exports.updateMatchingObject = updateMatchingObject;
exports.hireToJob = hireToJob;
exports.getHiredCvs = getHiredCvs;

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;
exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;
exports.getFavoritesJobs = getFavoritesJobs;
exports.checkCV = checkCV;
exports.addCvToJob = addCvToJob;

exports.updateFavoriteJob = updateFavoriteJob;
exports.updateActivityJob = updateActivityJob;

exports.getKeyWordsBySector = getKeyWordsBySector;
exports.addKeyWords = addKeyWords;

exports.predictorResponse = predictorResponse;
exports.matcherResponse = matcherResponse;



