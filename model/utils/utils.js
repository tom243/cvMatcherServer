
function sendErrorValidation(res) {
    var error = {
        error: "the value of fields or the fields name is incorrect or undefined"
    };
    console.log(error.error);
    res.status(400).json(error);
}

exports.sendErrorValidation = sendErrorValidation;
