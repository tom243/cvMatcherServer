/* Private Functions */

/* Common */

function fieldValidation(field) {
    return !!(typeof field !== 'undefined' && field != null );
}

/* Input types validations */

function validateYear(year) {
    return /^\d{4}$/.test(year)
}

function validatePositiveNumber(number) {
    return /^[1-9][0-9]?$|^100$|^0$/.test(number);
}

function validatePersonalId( id ) {
    var multiply, digit, sum, numeric;

    // Numeric only
    if ( !/^\d{1,9}$/g.test( id ) ) {
        return false;
    }

    // Save original value and length (without leading 0s)
    numeric = parseInt( id, 10 );

    if(numeric === 0){
        return false;
    }

    // Perform safety digit check
    for (multiply = false, sum = 0; numeric > 0; multiply = !multiply) {
        digit = numeric % 10;
        numeric = parseInt( ( numeric / 10 ), 10 );
        if ( digit !== 0 ) {
            if ( multiply ) {
                digit *= 2;
                if ( digit > 9 ) {
                    digit = ( 1 /*The first digit will be 1 at most*/ + ( digit % 10 ) );
                }
            }
            sum += digit;
        }
    }

    return ( sum % 10 === 0 );
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/* End common */

/* Private functions for matcher */

function matcherRequirementsValidation(requirements) {
    var valid = true;
    if (requirements && fieldValidation(requirements.grade) && fieldValidation(requirements.details)) {
        if (requirements.details.constructor === Array) {
            for (var i = 0; i < requirements.details.length; i++) {
                if (!(fieldValidation(requirements.details[i].name) && fieldValidation(requirements.details[i].grade))) {
                    valid = false;
                    break;
                }
            }
            return !!valid;
        }
    } else {
        return false;
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

/* End private functions for matcher */

function statusValidation(status) {
    return fieldValidation(status.current_status)
        && ( status.current_status === "liked" || status.current_status === "unliked" )
        && ( (status.current_status === "liked" && fieldValidation(status.stars) )
        || ( status.current_status === "unliked" && fieldValidation(status.description) ? true : false ) )
}

/* Private functions for matching object */

function personalPropertiesValidation(personalProperties) {
    var valid = personalProperties
    && fieldValidation(personalProperties.university_degree)
    && fieldValidation(personalProperties.degree_graduation_with_honors)
    && fieldValidation(personalProperties.above_two_years_experience)
    && fieldValidation(personalProperties.psychometric_above_680)
    && fieldValidation(personalProperties.multilingual)
    && fieldValidation(personalProperties.volunteering)
    && fieldValidation(personalProperties.full_army_service)
    && fieldValidation(personalProperties.officer)
    && fieldValidation(personalProperties.high_school_graduation_with_honors)
    && fieldValidation(personalProperties.youth_movements) ? true : false;

    if (valid) {
        for (var property in personalProperties) {
            if (!(typeof(personalProperties[property]) === "boolean" ) && property != "_id" ) {
                valid = false;
                break;
            }
        }
        return valid;
    } else {
        return false;
    }
}

function historyTimelineValidation(historyTimeline) {

    var valid = true;
    for (var i = 0; i < historyTimeline.length; i++) {
        valid = historyTimeline[i].text
            && (historyTimeline[i].start_year && validateYear(historyTimeline[i].start_year))
            && (historyTimeline[i].end_year && validateYear(historyTimeline[i].end_year))
            && (historyTimeline[i].type
            && (historyTimeline[i].type === "experience" || historyTimeline[i].type === "education" ));

        if (!valid) break;
    }
    return valid;

}

function originalTextValidation(originalText, type) {
    if (originalText) {
        if (type === "cv") {
            return originalText.history_timeline
            && originalText.history_timeline.constructor === Array
            && historyTimelineValidation(originalText.history_timeline) ? true : false

        } else if (type === "job") {
            return fieldValidation(originalText.title)
            && fieldValidation(originalText.description)
            && fieldValidation(originalText.requirements) ? true : false;
        } else return false;
    } else return false;
}

function locationsValidation(locations) {
    return locations
    && fieldValidation(locations)
    && locations.constructor === Array
    && locations.length > 0 ? true : false;
}

function candidateTypeValidation(candidateType) {

    var candidateTypeArr = ["student", "mothers", "pensioners", "graduated", "discharged"];
    var valid = candidateType
    && candidateType.constructor === Array
    && candidateType.length > 0 ? true : false;

    if (valid) {
        for (var i = 0; i < candidateType.length; i++) {
            valid = candidateTypeArr.indexOf(candidateType[i]) != -1;
            if (!valid) break;
        }
        return valid;
    } else return false;

}

function scopeOfPositionValidation(scopeOfPosition) {
    var scopeOfPositionArr = ["full", "part", "hours"];
    var valid = scopeOfPosition
    && scopeOfPosition.constructor === Array
    && scopeOfPosition.length > 0 ? true : false;

    if (valid) {
        for (var i = 0; i < scopeOfPosition.length; i++) {
            valid = scopeOfPositionArr.indexOf(scopeOfPosition[i]) != -1;
            if (!valid) break;
        }
        return valid;
    } else return false;
}

function academyValidation(academy) {

    var academyTypeArr = ["university", "college"];
    var degreeNameArr = ["software engineering", "Industrial Engineering and Management"
        , "Electrical Engineering", "Mechanical Engineering"];
    var degreeTypeArr = ["bsc", "msc", "mres"];

    var valid = academy
    && (fieldValidation(academy.academy_type) && academy.academy_type.constructor === Array
    && academy.academy_type.length > 0)
    && (fieldValidation(academy.degree_name) && degreeNameArr.indexOf(academy.degree_name) != -1 )
    && (fieldValidation(academy.degree_type) && academy.degree_type.constructor === Array
    && academy.degree_type.length > 0) ? true : false;

    if (valid) {
        for (var i = 0; i < academy.academy_type.length; i++) {
            valid = academyTypeArr.indexOf(academy.academy_type[i]) != -1;
            if (!valid) break;
        }
        if (valid) {
            for (var j = 0; j < academy.degree_type.length; j++) {
                valid = degreeTypeArr.indexOf(academy.degree_type[j]) != -1;
                if (!valid) break;
            }
            return valid;
        } else return false;
    } else return false;
}

function formulaValidation(formula) {
    var valid = formula
    && fieldValidation(formula.locations)
    && fieldValidation(formula.candidate_type)
    && fieldValidation(formula.scope_of_position)
    && fieldValidation(formula.academy)
    && fieldValidation(formula.requirements) ? true : false;

    var formulaAmount = 0;
    if (valid) {
        for (var property in formula) {

            if ( property != "_id" && property != "__v" && property != "matching_requirements") {
                if (!(validatePositiveNumber(formula[property]))) { // check for positive number and lower then 100
                    valid = false;
                    break;
                }
                formulaAmount += formula[property];
            }
        }
        return !!(valid && formulaAmount === 100); // verify formula is not bigger the 100

    } else return false;
}

function requirementsValidation(requirements, type) {

    var mustPercentageSum = 0;
    var valid = requirements
        && requirements.constructor === Array;

    if (valid) {
        for (var i = 0; i < requirements.length; i++) {
            valid = fieldValidation(requirements[i].combination) && requirements[i].combination.constructor === Array;
            if (valid) {
                for (var j = 0; j < requirements[i].combination.length; j++) {
                    if (type === "cv") {
                        valid = fieldValidation(requirements[i].combination[j].name)
                            && (fieldValidation(requirements[i].combination[j].years) &&
                            validatePositiveNumber(requirements[i].combination[j].years));
                        if (!valid) break;
                    } else if (type === "job") {
                        if (fieldValidation(requirements[i].combination[j].mode)) {
                            switch (requirements[i].combination[j].mode) {
                                case "must" :
                                    valid = fieldValidation(requirements[i].combination[j].name)
                                        && (fieldValidation(requirements[i].combination[j].years) &&
                                        validatePositiveNumber(requirements[i].combination[j].years))
                                        && (fieldValidation(requirements[i].combination[j].percentage) &&
                                        validatePositiveNumber(requirements[i].combination[j].percentage));
                                    if (valid) {
                                        mustPercentageSum += requirements[i].combination[j].percentage;
                                    } else return false;
                                    break;
                                case "adv":
                                case "or" :
                                    valid = fieldValidation(requirements[i].combination[j].name)
                                        && (fieldValidation(requirements[i].combination[j].years) &&
                                        validatePositiveNumber(requirements[i].combination[j].years));
                                    break;
                                default :
                                    return false; // wrong mode sent
                                    break;
                            }
                        } else return false;
                    } else return false;
                    if (!valid) return false;
                }
                if ( mustPercentageSum != 100 && type == "job" ) return false;
                else mustPercentageSum=0;
            } else return false;
        }
        return valid;
    } else return false;
}

/* End private functions for matching object */

var sectorArr = ["software engineering"];

/* Public functions */

/////////////////////////////////////////////////// *** Users *** /////////////////////////////////

function addUser(req) {
    return req.body
    && fieldValidation(req.body.google_user_id)
    && fieldValidation(req.body.first_name)
    && fieldValidation(req.body.last_name)
    && (fieldValidation(req.body.email) && validateEmail(req.body.email)) ? true : false
}

function deleteUser(req) {
    return req.body && fieldValidation(req.body.user_id) ? true : false
}

function updateUser(req) {
    return req.body
    && fieldValidation(req.body._id)
    && (fieldValidation(req.body.personal_id) && validatePersonalId(req.body.personal_id))
    && fieldValidation(req.body.first_name)
    && fieldValidation(req.body.last_name)
    && fieldValidation(req.body.birth_date)
    && fieldValidation(req.body.address)
    && (fieldValidation(req.body.email) && validateEmail(req.body.email))
    && fieldValidation(req.body.phone_number)
    && fieldValidation(req.body.linkedin) ? true : false
}

function getUser(req) {
    return req.body && fieldValidation(req.body.user_id) ? true : false
}

function getUserId(req) {
    return req.body && fieldValidation(req.body.google_user_id) ? true : false
}

////////////////////////////////////////////// ***  Companies  *** ////////////////////////////////////

function addCompany(req) {
    return req.body
    && fieldValidation(req.body.name)
    && fieldValidation(req.body.logo)
    && fieldValidation(req.body.p_c)
    && fieldValidation(req.body.address)
    && fieldValidation(req.body.phone_number)
    && fieldValidation(req.body.user_id) ? true : false
}

function deleteCompany(req) {
    return req.body && fieldValidation(req.body.company_id) ? true : false
}

function updateCompany(req) {
    return req.body
    && fieldValidation(req.body._id)
    && fieldValidation(req.body.name)
    && fieldValidation(req.body.logo)
    && fieldValidation(req.body.p_c)
    && fieldValidation(req.body.address)
    && fieldValidation(req.body.phone_number) ? true : false
}

function getCompany(req) {
    return req.body && fieldValidation(req.body.company_id) ? true : false
}

////////////////////////////////// *** Matching Objects *** ///////////////////////////

function addMatchingObject(req) {
    var matchingObject = req.body;
    if (matchingObject
        && fieldValidation(matchingObject.date)
        && fieldValidation(matchingObject.sector)
        && fieldValidation(matchingObject.user)
        && fieldValidation(matchingObject.matching_object_type)
        && originalTextValidation(matchingObject.original_text, matchingObject.matching_object_type)
        && locationsValidation(matchingObject.locations)
        && candidateTypeValidation(matchingObject.candidate_type)
        && scopeOfPositionValidation(matchingObject.scope_of_position)
        && academyValidation(matchingObject.academy)
        && requirementsValidation(matchingObject.requirements, matchingObject.matching_object_type)

    ) {

        if (matchingObject.matching_object_type === "cv") {
            return personalPropertiesValidation(matchingObject.personal_properties) ? true : false;
        } else if (matchingObject.matching_object_type === "job") {
            return fieldValidation(matchingObject.compatibility_level)
            && validatePositiveNumber(matchingObject.compatibility_level) // check number between 1-100
            && formulaValidation(matchingObject.formula)
                ? true : false;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function getMatchingObject(req) {
    return req.body
    && fieldValidation(req.body.matching_object_id)
    && fieldValidation(req.body.matching_object_type)
    && (req.body.matching_object_type == "cv" || req.body.matching_object_type == "job" )
        ? true : false
}

function deleteMatchingObject(req) {
    return req.body && fieldValidation(req.body.matching_object_id) ? true : false
}

function reviveMatchingObject(req) {
    return req.body && fieldValidation(req.body.matching_object_id) ? true : false
}

function updateMatchingObject(req) {
    var matchingObject = req.body;
    if (matchingObject
        && fieldValidation(matchingObject._id)
        && fieldValidation(matchingObject.sector)
        && fieldValidation(matchingObject.matching_object_type)
        && fieldValidation(matchingObject.original_text._id)
        && originalTextValidation(matchingObject.original_text, matchingObject.matching_object_type)
        && locationsValidation(matchingObject.locations)
        && candidateTypeValidation(matchingObject.candidate_type)
        && scopeOfPositionValidation(matchingObject.scope_of_position)
        && fieldValidation(matchingObject.academy._id)
        && academyValidation(matchingObject.academy)
        && requirementsValidation(matchingObject.requirements, matchingObject.matching_object_type)

    ) {

        if (matchingObject.matching_object_type === "cv") {
            return fieldValidation(matchingObject.personal_properties._id) &&
            personalPropertiesValidation(matchingObject.personal_properties)
        } else if (matchingObject.matching_object_type === "job") {
            return fieldValidation(matchingObject.compatibility_level)
            && validatePositiveNumber(matchingObject.compatibility_level) // check number between 1-100
            && fieldValidation(matchingObject.formula._id)
            && formulaValidation(matchingObject.formula)
                ? true : false;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


///////////////////////////////////////////// *** Employer *** ///////////////////////

function getJobsBySector(req) {
    return req.body
    && fieldValidation(req.body.user_id)
    && fieldValidation(req.body.sector)
    && sectorArr.indexOf(req.body.sector) != -1
    && fieldValidation(req.body.archive)
    && typeof(req.body.archive) === "boolean" ? true : false
}

function getUnreadCvsForJob(req) {
    return req.body
    && fieldValidation(req.body.user_id)
    && fieldValidation(req.body.job_id) ? true : false
}

function getRateCvsForJob(req) {
    return req.body
    && fieldValidation(req.body.user_id)
    && fieldValidation(req.body.job_id)
    && fieldValidation(req.body.current_status)
    && ( req.body.current_status === "liked" || req.body.current_status === "unliked" )
        ? true : false
}

function rateCV(req) {
    return req.body
    && fieldValidation(req.body.cv_id)
    && fieldValidation(req.body.status)
    && statusValidation(req.body.status) ? true : false
}

function updateRateCV(req) {
    return req.body
    && fieldValidation(req.body.cv_id)
    && fieldValidation(req.body.status)
    && statusValidation(req.body.status) ? true : false
}

function hireToJob(req) {
    return req.body
    && fieldValidation(req.body.cv_id)
    && fieldValidation(req.body.job_id) ? true : false
}
////////////////////////////////// *** JobSeeker *** ///////////////////////

function getAllJobsBySector(req) {
    return req.body
    && fieldValidation(req.body.user_id)
    && fieldValidation(req.body.sector)
    && sectorArr.indexOf(req.body.sector) != -1 ? true : false
}

function getMyJobs(req) {
    return req.body
    && fieldValidation(req.body.user_id) ? true : false
}

function getFavoritesJobs(req) {
    return req.body
    && fieldValidation(req.body.user_id) ? true : false
}

function checkCV(req) {
    return req.body
    && fieldValidation(req.body.job_id)
    && fieldValidation(req.body.cv_id) ? true : false
}

function addCvToJob(req) {
    return req.body
    && fieldValidation(req.body.job_id)
    && fieldValidation(req.body.cv_id) ? true : false
}

function matcherResponse(response) {
    console.log("response", response);
    return response
    && fieldValidation(response.total_grade)
    && fieldValidation(response.formula)
    && matcherFormulaValidation(response.formula) ? true : false
}

function updateFavoriteJob(req) {
    return req.body
    && fieldValidation(req.body.job_seeker_job_id)
    && fieldValidation(req.body.favorite)
    && typeof(req.body.favorite) === "boolean" ? true : false
}

function updateActivityJob(req) {
    return req.body
    && fieldValidation(req.body.job_seeker_job_id)
    && fieldValidation(req.body.active)
    && typeof(req.body.active) === "boolean" ? true : false
}

///////////////////////////////////////////// *** Utils *** ///////////////////////

function getKeyWordsBySector(req) {
    return req.body
    && fieldValidation(req.body.sector)
    && sectorArr.indexOf(req.body.sector) != -1 ? true : false
}

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.getUser = getUser;
exports.getUserId = getUserId;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

exports.addCompany = addCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;
exports.getCompany = getCompany;

exports.addMatchingObject = addMatchingObject;
exports.getMatchingObject = getMatchingObject;
exports.deleteMatchingObject = deleteMatchingObject;
exports.reviveMatchingObject = reviveMatchingObject;
exports.updateMatchingObject = updateMatchingObject;
exports.hireToJob = hireToJob;

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
exports.matcherResponse = matcherResponse;
exports.updateFavoriteJob = updateFavoriteJob;
exports.updateActivityJob = updateActivityJob;

exports.getKeyWordsBySector = getKeyWordsBySector;