/*jslint node: true */
"use strict";

var utilsDAO = require("./../model/dao/utilsDAO"); // dao = data access object = model
var utils = require("./../model/utils/utils");
var validation = require("./../model/utils/validation");
var Bing = require("node-bing-api")({accKey: "701evtSNrrgXAfrchGXi6McRJ5U/23ga7WW2qANZgIk"});
var request = require("request");
var async = require("async");

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

/* verify that url is not broken */
function checkUrlExists(url, callback) {

    request(url, function (error, response) {
        if (!error && response.statusCode === 200) {
            callback(true);
        } else {
            console.log("bad url " + url);
            callback(false);
        }
    });
}

/* get top 10 logo images for company */
function getLogoImages(req, res) {
    var imagesResponse = [];
    Bing.images(req.body.word + " logo",
        {
            top: 10,  // Number of results (max 50)
            imageFilters: {
                size: "small"
            }
        }, function (err, response, body) {
            if (err) {
                console.log("something went wrong while trying to search the logo " + err);
                res.status(500).json("something went wrong while trying to search the logo");
            } else {

                // 1st para in async.each() is the array of items
                async.each(body.d.results,
                    // 2nd param is the function that each item is passed to
                    function (item, callbackAsync) {
                        // Call an asynchronous function
                        checkUrlExists(item.MediaUrl, function (isValidUrl) { // verify url exists
                            if (isValidUrl) {
                                imagesResponse.push(item.MediaUrl);
                            }
                            callbackAsync();
                        });

                    },
                    // 3rd param is the function to call when everything is done
                    function (err) {
                        if (err) {
                            console.log("something went wrong while trying to search the logo " + err);
                            res.status(500).json("something went wrong while trying to search the logo");
                        } else {
                            res.status(200).json(imagesResponse);
                        }
                    }
                );

            }

        });
}

/* add key words to db */
function addKeyWords(req, res) {

    console.log("in addKeyWords");

    if (validation.addKeyWords(req)) {
        utilsDAO.addKeyWords(req.body.sector, req.body.words_list, function (status, result) {
            res.status(status).json(result);
        });
    } else {
        utils.sendErrorValidation(res);
    }

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
exports.addKeyWords = addKeyWords;
exports.cleanDB = cleanDB; // TODO: DELETE IT