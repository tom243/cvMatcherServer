
/* Private Functions */

function fieldValidation(field) {

    if ((typeof field !== 'undefined' && field )) {
        return true;
    } else {
        return false;
    }
}

/* Public functions */

function getUser(req){
    return req.body && fieldValidation(req.body.user_id) ? true : false
}

function getUserId(req){
    return req.body && fieldValidation(req.body.google_user_id) ? true : false
}

function addUser(req){

    return req.body
    && fieldValidation(req.body.google_user_id)
    && fieldValidation(req.body.first_name)
    && fieldValidation(req.body.last_name)
    && fieldValidation(req.body.email) ? true : false

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


exports.getUser = getUser;
exports.getUserId = getUserId;
exports.addUser = addUser;
exports.updateUser = updateUser;