var async = require("async");

var schemas = require('./../schemas/schemas');

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
var CompanyModel= schemas.CompanyModel;
var UserModel = schemas.UserModel;

var error = {
    error: null
};

function getKeyWordsBySector(sector, callback) {

    var query = KeyWordsModel.find({sector: sector});

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the keywords from DB";
            callback(500, error);
        } else {

            if (results.length > 0) {
                console.log("the keywords extracted successfully from the db ");
                callback(200, results[0].key_words);
            } else {
                console.log("sector not exists");
                error.error = "sector not exists";
                callback(404, error);
            }


        }
    });

}

function cleanDB(cleanDBCallback) { // TODO: DELETE IT

    async.parallel([
        function (callback) {
            AcademyModel.remove({}, callback)
        },
        function (callback) {
            FormulaModel.remove({}, callback)
        },
        function (callback) {
            HistoryTimelineModel.remove({}, callback)
        },
        function (callback) {
            MatchingDetailsModel.remove({}, callback)
        },
        function (callback) {
            MatchingObjectsModel.remove({}, callback)
        },
        function (callback) {
            OriginalTextModel.remove({}, callback)
        },
        function (callback) {
            PersonalPropertiesModel.remove({}, callback)
        },
        function (callback) {
            ProfessionalKnowledgeModel.remove({}, callback)
        },
        function (callback) {
            RequirementsModel.remove({}, callback)
        },
        function (callback) {
            StatusModel.remove({}, callback)
        },
        function (callback) {
            JobSeekerJobsModel.remove({}, callback)
        },
        function (callback) {
            CompanyModel.remove({}, callback)
        },
        function (callback) {
            UserModel.remove({}, callback)
        }

    ], function (err) {
        cleanDBCallback(err)
    })

}

///////////////////////////////////////////// *** EXPORTS *** ///////////////////////

exports.getKeyWordsBySector = getKeyWordsBySector;
exports.cleanDB = cleanDB; // TODO: DELETE IT