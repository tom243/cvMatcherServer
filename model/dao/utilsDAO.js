/*jslint node: true */
"use strict";

var async = require("async");

var schemas = require("./../schemas/schemas");

var MatchingObjectsModel = schemas.MatchingObjectsModel;
var FormulaModel = schemas.FormulaModel;
var StatusModel = schemas.StatusModel;
var RequirementsModel = schemas.RequirementsModel;
var OriginalTextModel = schemas.OriginalTextModel;
var PersonalPropertiesModel = schemas.PersonalPropertiesModel;
var HistoryTimelineModel = schemas.HistoryTimelineModel;
var AcademyModel = schemas.AcademyModel;
var ProfessionalKnowledgeModel = schemas.ProfessionalKnowledgeModel;
var MatchingDetailsModel = schemas.MatchingDetailsModel;
var KeyWordsModel = schemas.KeyWordsModel;
var JobSeekerJobsModel = schemas.JobSeekerJobsModel;
var CompanyModel = schemas.CompanyModel;
var UserModel = schemas.UserModel;

var error = {
    error: null
};

function getKeyWordsBySector(sector, callback) {

    var query = KeyWordsModel.find({
        sector: sector,
        count: {$gt: 4}
    }, {word: 1});

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the keywords from DB";
            callback(500, error);
        } else {
            console.log("the keywords extracted successfully from the db ");
            var wordsArr = results.map(function (value) {
                return value.word;
            });
            callback(200, wordsArr);
        }
    });

}

function addKeyWords(sector, wordsList, callback) {

    var resultArr = [];

    // 1st para in async.each() is the array of items
    async.each(wordsList,
        // 2nd param is the function that each item is passed to
        function (item, callbackAsync) {
            // Call an asynchronous function

            var query = {word: item, sector: sector};
            var update = {
                $inc: {count: 1}
                //count:5
            };
            var options = {new: true, upsert: true};
            KeyWordsModel.findOneAndUpdate(query, update, options, function (err, result) {
                if (err) {
                    console.log("error in add new word " + err);
                    return callbackAsync(new Error("error in add new word"));
                }
                resultArr.push(result);
                callbackAsync();
            });
        },
        // 3rd param is the function to call when everything is done
        function (err) {
            // All tasks are done now
            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to update key words";
                callback(500, error);
            } else {
                console.log("key words updated successfully");
                console.log("resultArr", resultArr);
                callback(200, resultArr);
            }

        }
    );

}

function cleanDB(cleanDBCallback) { // TODO: DELETE IT

    async.parallel([
        function (callback) {
            AcademyModel.remove({}, callback);
        },
        function (callback) {
            FormulaModel.remove({}, callback);
        },
        function (callback) {
            HistoryTimelineModel.remove({}, callback);
        },
        function (callback) {
            MatchingDetailsModel.remove({}, callback);
        },
        function (callback) {
            MatchingObjectsModel.remove({}, callback);
        },
        function (callback) {
            OriginalTextModel.remove({}, callback);
        },
        function (callback) {
            PersonalPropertiesModel.remove({}, callback);
        },
        function (callback) {
            ProfessionalKnowledgeModel.remove({}, callback);
        },
        function (callback) {
            RequirementsModel.remove({}, callback);
        },
        function (callback) {
            StatusModel.remove({}, callback);
        },
        function (callback) {
            JobSeekerJobsModel.remove({}, callback);
        },
        function (callback) {
            CompanyModel.remove({}, callback);
        },
        function (callback) {
            UserModel.remove({}, callback);
        }

    ], function (err) {
        cleanDBCallback(err);
    });

}

///////////////////////////////////////////// *** EXPORTS *** ///////////////////////

exports.getKeyWordsBySector = getKeyWordsBySector;
exports.addKeyWords = addKeyWords;
exports.cleanDB = cleanDB; // TODO: DELETE IT