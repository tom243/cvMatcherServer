var utilsDAO = require("./../model/dao/utilsDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");
var Bing = require('node-bing-api')({accKey: "701evtSNrrgXAfrchGXi6McRJ5U/23ga7WW2qANZgIk"});

//**  get key words  **//
function getKeyWordsBySector(req, res) {

    console.log("in getKeyWordsBySector");

    if (validation.getKeyWordsBySector(req)) {
        utilsDAO.getKeyWordsBySector(req.body.sector, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

}

function getLogoImages(req, res) {
    var imagesResponse = [];
    Bing.images(req.body.word + " logo",
        {
            top: 10,  // Number of results (max 50)
            imageFilters: {
                size: 'small'
            }
        }
        , function (err, response, body) {
            if (err) {
                console.log("something went wrong while trying to search the logo " + err);
                res.status(500).json("something went wrong while trying to search the logo");
            } else {
                for (var i = 0; i < body.d.results.length; i++) {
                    imagesResponse.push(body.d.results[i].MediaUrl);
                }
                res.status(200).json(imagesResponse);
            }

        });
}

function cleanDB(req, res) { // TODO: DELETE IT
    utilsDAO.cleanDB(function (err) {
        if (err === null) {
            res.status(200).json();
        } else {
            res.status(500).json();
        }
    });
}

////////////////////////////////// *** EXPORTS *** /////////////////////////

exports.getKeyWordsBySector = getKeyWordsBySector;
exports.getLogoImages = getLogoImages;
exports.cleanDB = cleanDB; // TODO: DELETE IT