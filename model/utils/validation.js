
/* Private Functions */

function fieldValidation(field) {

    if ((typeof field !== 'undefined' && field )) {
        return true;
    } else {
        return false;
    }
}

/* Public functions */

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


exports.getUser = getUser;
exports.getUserId = getUserId;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.addCompany = addCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;