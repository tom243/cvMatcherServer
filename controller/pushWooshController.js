var Pushwoosh = require('pushwoosh-client');

var client= new Pushwoosh("C6CEE-FFEC9",
    "oUvELdvAdzG4qLdFJt4VORYHw3D49lJDhsgbkR0BIBU5TqHEkInmSefNf2KmQYz13QhQrhbsxdf1nqCL5quF");

function sendNotification (req,res) {

    options = {
        devices:[
            //"becedb40b7e16121"
            req.body.hwid
        ]
    };

    client.sendMessage(req.body.message, options , function(error, response) {
        if (error) {
            console.log('Some error occurs: ', error);
            res.status(500).json("error occurred during send notification ");
        }else {
            res.status(500).json("notification sent successfully");
        }

        console.log('Pushwoosh API response is', response);
    });

}

////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.sendNotification = sendNotification;