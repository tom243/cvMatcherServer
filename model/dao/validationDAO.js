/*jslint node: true */
"use strict";

var schemas = require("./../schemas/schemas");
var ValidationModel = schemas.ValidationModel;

var error = {
    error: null
};

function loadValidationValues(callback) {

    var query = ValidationModel.find(
        {_id: "57359ed5dcba0f0892823b91"}
    ).limit(1);

    query.exec(function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the validation values";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("validation values extracted successfully");
                callback(200,results[0]);

            } else {
                console.log("id of validation not exists");
                error.error = "id of validation not exists";
                callback(404, error);
            }
        }
    });

}

///////////////////////////////////// *** EXPORTS *** /////////////////////////////////

exports.loadValidationValues =  loadValidationValues;