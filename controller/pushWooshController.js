/*jslint node: true */
"use strict";

var usersDAO = require("./../model/dao/usersDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");

var Pushwoosh = require("pushwoosh-client");

var client = new Pushwoosh("C6CEE-FFEC9",
    "oUvELdvAdzG4qLdFJt4VORYHw3D49lJDhsgbkR0BIBU5TqHEkInmSefNf2KmQYz13QhQrhbsxdf1nqCL5quF");

var error = {
    error: null
};

function sendNotification(req, res) {

    console.log("in sendNotification");

    if (validation.sendNotification(req)) {
        usersDAO.getHWID(req.body.user_id, function (status, result) {


            if (status === 200) {

                var options = {
                    devices: [
                        result.hwid
                    ]
                };

                client.sendMessage(req.body.message, options, function (err) {
                    if (err) {
                        console.log("Some error occurs: ", err);
                        error.error = "error occurred during send notification";
                        res.status(500).json(error);
                    } else {
                        console.log("notification was sent by pushwoosh API successfully");
                        res.status(200).json("notification sent successfully");
                    }
                });
            } else {
                res.status(status).json(result);
            }
        });
    } else {
        utils.sendErrorValidation(res);
    }


}

////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.sendNotification = sendNotification;