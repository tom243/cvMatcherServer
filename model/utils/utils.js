
function sendErrorValidation(res) {
    var error = {
        error: "the value of fields is incorrect or undefined"
    };
    res.status(400).json(error);
}

exports.sendErrorValidation = sendErrorValidation;
