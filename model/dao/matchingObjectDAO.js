/*jslint node: true */
"use strict";

var async = require("async");
var schemas = require("./../schemas/schemas");

var MatchingObjectsModel = schemas.MatchingObjectsModel;
var FormulaModel = schemas.FormulaModel;
var RequirementsModel = schemas.RequirementsModel;
var OriginalTextModel = schemas.OriginalTextModel;
var PersonalPropertiesModel = schemas.PersonalPropertiesModel;
var HistoryTimelineModel = schemas.HistoryTimelineModel;
var AcademyModel = schemas.AcademyModel;
var ProfessionalKnowledgeModel = schemas.ProfessionalKnowledgeModel;

var errorMessage;

var error = {
    error: null
};


/////////////////////////////////////// ***  OriginalText  *** /////////////////////////////

function buildTimelineHistory(timeline, callback) {

    var historyTimeLineArray = [];

    // 1st para in async.each() is the array of items
    async.each(timeline,
        // 2nd param is the function that each item is passed to
        function (item, callbackAsync) {
            // Call an asynchronous function, often a save() to DB

            var historyTimeLineToadd = new HistoryTimelineModel({
                text: item.text,
                start_year: item.start_year,
                end_year: item.end_year,
                type: item.type
            });

            /* save the historyTime to db*/
            historyTimeLineToadd.save(function (err, doc) {
                if (err) {
                    console.log("something went wrong " + err);
                    errorMessage = "something went wrong while trying to save timeline history to db";
                    return callbackAsync(new Error(errorMessage));
                }
                historyTimeLineArray.push(doc._id);
                callbackAsync();

            });
        },
        // 3rd param is the function to call when everything is done
        function (err) {
            // All tasks are done now
            callback(err, historyTimeLineArray);
        }
    );
}

// Add OriginalText
function addOriginalText(originalText, type, callback) {

    console.log("in addOriginalText function");
    var history_data = originalText.history_timeline;

    if (type === "cv") { //cv
        buildTimelineHistory(history_data, function (err, historyTimeline) {

            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to save history timeline to db";
                callback(500, error);
            } else {

                var originalTextToAdd = new OriginalTextModel({
                    title: null,
                    description: null,
                    requirements: null,
                    history_timeline: historyTimeline
                });

                /* save the OriginalText to db*/
                originalTextToAdd.save(function (err, doc) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to save originalText to db";
                        callback(500, error);

                    } else {
                        console.log("originalText saved successfully to the db");
                        callback(null, doc);
                    }
                });
            }
        });
    } else { // job
        var originalTextToAdd = new OriginalTextModel({
            title: originalText.title,
            description: originalText.description,
            requirements: originalText.requirements,
            history_timeline: []
        });

        /* save the OriginalText to db*/
        originalTextToAdd.save(function (err, doc) {
            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to save originalText to db";
                callback(500, error);
            } else {
                console.log("originalText saved successfully to the db");
                callback(null, doc);
            }
        });
    }
}

var updateOriginalTextFunctions = {

    getHistoryTimeline: function (originalTextId, callback) {

        console.log("in getHistoryTimeline function");

        var query = OriginalTextModel.find(
            {_id: originalTextId}, {history_timeline: 1}
        );

        query.exec(function (err, results) {

            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to get the user from the db";
                callback(500, error);
            } else {
                if (results.length > 0) {
                    console.log("the history timeline jobs extracted successfully from the db");
                    callback(null, results[0].history_timeline);
                } else {
                    errorMessage = "original text not exists";
                    console.log(errorMessage);
                    error.error = errorMessage;
                    callback(404, error);
                }
            }
        });

    },

    deleteHistoryTimeLineDocs: function (history_timeline, callback) {

        console.log("in deleteHistoryTimeLineDocs function");

        HistoryTimelineModel.remove({_id: {$in: history_timeline}}, function (err) {
            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to delete history timeline docs from db";
                callback(500, error);
            } else {
                console.log("history timeline deleted successfully");
                callback();
            }

        });
    },

    updateNewOriginalText: function (originalTextId, historyTimeline, callback) {

        console.log("in updateNewOriginalText function");

        buildTimelineHistory(historyTimeline, function (err, historyTimeline) {

            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to save history timeline to db";
                callback(500, error);
            } else {

                var query = {"_id": originalTextId};
                var update = {
                    history_timeline: historyTimeline
                };
                var options = {new: true};
                OriginalTextModel.findOneAndUpdate(query, update, options, function (err, results) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to update original text";
                        callback(500, error);
                    } else {
                        if (results !== null) {
                            console.log("Original Text updated successfully");
                            callback(null, results);
                        } else {
                            errorMessage = "Original Text id not exists";
                            console.log(errorMessage);
                            error.error = errorMessage;
                            callback(404, error);
                        }
                    }
                });
            }
        });

    }

};


/* update original text */
function updateOriginalText(originalText, type, originalTextCallback) {

    console.log("in updateOriginalText function");

    if (type === "cv") { //cv

        async.waterfall([
            async.apply(updateOriginalTextFunctions.getHistoryTimeline, originalText._id),
            updateOriginalTextFunctions.deleteHistoryTimeLineDocs,
            async.apply(updateOriginalTextFunctions.updateNewOriginalText,
                originalText._id, originalText.history_timeline)
        ], function (status, results) {
            console.log("updateOriginalText status: " + status);
            originalTextCallback(null, results);
        });

    } else { // job

        var query = {"_id": originalText._id};
        var update = {
            title: originalText.title,
            description: originalText.description,
            requirements: originalText.requirements
        };
        var options = {new: true};
        OriginalTextModel.findOneAndUpdate(query, update, options, function (err, results) {
            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to update original text";
                originalTextCallback(500, error);
            } else {
                if (results !== null) {
                    console.log("Original Text updated successfully");
                    originalTextCallback(null, results);
                } else {
                    errorMessage = "Original Text id not exists";
                    console.log(errorMessage);
                    error.error = errorMessage;
                    originalTextCallback(404, error);
                }
            }
        });

    }

}


/////////////////////////////////////// ***  Academy  *** /////////////////////////////

function addAcademy(academy, callback) {

    console.log("in addAcademy");

    var academyToAdd = new AcademyModel({
        academy_type: academy.academy_type,
        degree_name: academy.degree_name,
        degree_type: academy.degree_type
    });

    /* save the academy to db*/
    academyToAdd.save(function (err, doc) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to save academy";
            callback(500, error);
        } else {
            console.log("academy saved successfully");
            callback(null, doc._id);
        }
    });
}

function updateAcademy(academy, callback) {

    console.log("in updateAcademy");

    var query = {"_id": academy._id};
    var update = {
        degree_name: academy.degree_name,
        degree_type: academy.degree_type,
        academy_type: academy.academy_type
    };
    var options = {new: true};
    AcademyModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to update academy";
            callback(500, error);
        } else {
            if (results !== null) {
                console.log("academy updated successfully");
                callback(null, results);
            } else {
                errorMessage = "academy id not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }
    });

}

/////////////////////////////////////// ***  Requirements  *** /////////////////////////////

function buildProfessionalKnowledge(professionalKnowledges, callback) {

    var professionalKnowledgeArr = [];

    // 1st para in async.each() is the array of items
    async.each(professionalKnowledges,
        // 2nd param is the function that each item is passed to
        function (item, callbackAsync) {
            // Call an asynchronous function, often a save() to DB

            var professionalKnowledgeToAdd = new ProfessionalKnowledgeModel({
                name: item.name,
                years: item.years,
                mode: item.mode,
                percentage: item.percentage
            });

            /* save the professionalKnowledge to db*/
            professionalKnowledgeToAdd.save(function (err, doc) {
                if (err) {
                    console.log("something went wrong " + err);
                    errorMessage = "something went wrong while trying to save professionalKnowledge to db to db";
                    return callbackAsync(new Error(errorMessage));
                }
                professionalKnowledgeArr.push(doc._id);
                callbackAsync();
            });
        },
        // 3rd param is the function to call when everything is done
        function (err) {
            // All tasks are done now
            callback(err, professionalKnowledgeArr);
        }
    );
}

// Add Requirements
function addRequirements(requirements, callback) {

    console.log("in addRequirements function");

    var requirementsArr = [];

    // 1st para in async.each() is the array of items
    async.each(requirements,
        // 2nd param is the function that each item is passed to
        function (item, callbackAsync) {
            // Call an asynchronous function, often a save() to DB

            buildProfessionalKnowledge(item.combination, function (err, professionalKnowledgeArr) {
                if (err) {
                    console.log("something went wrong " + err);
                    errorMessage = "something went wrong while trying to save professional knowledge to db";
                    return callbackAsync(new Error(errorMessage));

                }
                var combinationToAdd = new RequirementsModel({
                    combination: professionalKnowledgeArr
                });

                /* save the  the requirements combination to db*/
                combinationToAdd.save(function (err, doc) {
                    if (err) {
                        console.log("something went wrong " + err);
                        errorMessage = "something went wrong while trying to save " +
                            "combination of requirements to db";
                        return callbackAsync(new Error(errorMessage));

                    }
                    requirementsArr.push(doc._id);
                    callbackAsync();
                });
            });
        },
        // 3rd param is the function to call when everything is done
        function (err) {
            // All tasks are done now
            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to save requirements to db";
                callback(500, error);
            } else {
                console.log("Requirements saved successfully to the db");
                callback(null, requirementsArr);
            }

        }
    );
}

var updateRequirementsFunctions = {

    getRequirements: function (matchingObjectId, callback) {

        var query = MatchingObjectsModel.find(
            {_id: matchingObjectId}, {requirements: 1}
        );

        query.exec(function (err, results) {

            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to get the requirements from the db";
                callback(500, error);
            } else {
                if (results.length > 0) {
                    console.log("the requirements extracted successfully from the db");
                    callback(null, results[0].requirements);
                } else {
                    errorMessage = "matching object not exists";
                    console.log(errorMessage);
                    error.error = errorMessage;
                    callback(404, error);
                }
            }
        });

    },

    getCombination: function (requirementsArr, callback) {

        var combinationArr = [];

        var query = RequirementsModel.find(
            {_id: {$in: requirementsArr}}, {combination: 1}
        );

        query.exec(function (err, results) {

            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to get the combination of requirements";
                callback(500, error);
            } else {
                if (results.length > 0) {

                    console.log("the combination of requirements extracted successfully");

                    results.forEach(function (entry) {
                        combinationArr.push.apply(combinationArr, entry.combination);
                    });

                    /*        for (var i = 0; i < results.length; i++) {
                     combinationArr.push.apply(combinationArr, results[i].combination);
                     }*/

                    callback(null, requirementsArr, combinationArr);

                } else {
                    errorMessage = "requirements not exists";
                    console.log(errorMessage);
                    error.error = errorMessage;
                    callback(404, error);
                }
            }
        });
    },

    removeProfessionalKnowledge: function (requirementsArr, combinationArr, callback) {

        ProfessionalKnowledgeModel.remove({_id: {$in: combinationArr}}, function (err) {
            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to delete professional knowledge";
                callback(500, error);
            } else {
                console.log("professional knowledge deleted successfully");
                callback(null, requirementsArr);
            }

        });
    },

    deleteCombinationDocs: function (requirementsArr, callback) {

        RequirementsModel.remove({_id: {$in: requirementsArr}}, function (err) {
            if (err) {
                console.log("something went wrong " + err);
                error.error = "something went wrong while trying to delete history timeline docs from db";
                callback(500, error);
            } else {
                console.log("combination deleted successfully");
                callback();
            }

        });
    }

};

function updateRequirements(matchingObjectId, requirements, requirementsCallback) {

    console.log("in updateRequirements function");

    async.waterfall([
        async.apply(updateRequirementsFunctions.getRequirements, matchingObjectId),
        updateRequirementsFunctions.getCombination,
        updateRequirementsFunctions.removeProfessionalKnowledge,
        updateRequirementsFunctions.deleteCombinationDocs,
        async.apply(addRequirements, requirements)
    ], function (status, results) {
        console.log("results waterfall ", results + "with status " + status);
        requirementsCallback(null, results);
    });

}

/////////////////////////////////////// ***  Personal Properties  *** /////////////////////////////

// Add Status
function addPersonalProperties(personalProperties, callback) {

    console.log("in addPersonalProperties function");

    var personalPropertiesToAdd = new PersonalPropertiesModel({
        university_degree: personalProperties.university_degree,
        degree_graduation_with_honors: personalProperties.degree_graduation_with_honors,
        above_two_years_experience: personalProperties.above_two_years_experience,
        psychometric_above_680: personalProperties.psychometric_above_680,
        multilingual: personalProperties.multilingual,
        volunteering: personalProperties.volunteering,
        full_army_service: personalProperties.full_army_service,
        officer_in_the_military: personalProperties.officer_in_the_military,
        high_school_graduation_with_honors: personalProperties.high_school_graduation_with_honors,
        youth_movements: personalProperties.youth_movements
    });

    /* save the Personal Properties to db*/
    personalPropertiesToAdd.save(function (err, doc) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to save personal properties";
            callback(500, error);
        } else {
            console.log("personal properties saved successfully to db");
            callback(null, doc);
        }
    });

}

function updatePersonalProperties(personalProperties, callback) {

    console.log("in updatePersonalProperties");

    var query = {"_id": personalProperties._id};

    var update = {
        university_degree: personalProperties.university_degree,
        degree_graduation_with_honors: personalProperties.degree_graduation_with_honors,
        above_two_years_experience: personalProperties.above_two_years_experience,
        psychometric_above_680: personalProperties.psychometric_above_680,
        multilingual: personalProperties.multilingual,
        volunteering: personalProperties.volunteering,
        full_army_service: personalProperties.full_army_service,
        officer_in_the_military: personalProperties.officer_in_the_military,
        high_school_graduation_with_honors: personalProperties.high_school_graduation_with_honors,
        youth_movements: personalProperties.youth_movements
    };

    var options = {new: true};
    PersonalPropertiesModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to update personal properties";
            callback(500, error);
        } else {
            if (results !== null) {
                console.log("personal properties updated successfully");
                callback(null, results);
            } else {
                errorMessage = "personal properties id not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }
    });

}

/////////////////////////////////////// ***  Formulas  *** /////////////////////////////

// Add Formula
function addFormula(formula, callback) {

    console.log("in addFormula function");

    var formulaToAdd = new FormulaModel({
        locations: formula.locations,
        candidate_type: formula.candidate_type,
        scope_of_position: formula.scope_of_position,
        academy: formula.academy,
        requirements: formula.requirements
    });


    /*save the Formula in db*/
    formulaToAdd.save(function (err, doc) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to save formula";
            callback(500, error);
        } else {
            console.log("formula saved successfully to db");
            callback(null, doc);
        }
    });

}

// Update Formula
function updateFormula(formula, callback) {

    console.log("in updateFormula");

    var query = {"_id": formula._id};

    var update = {
        locations: formula.locations,
        candidate_type: formula.candidate_type,
        scope_of_position: formula.scope_of_position,
        academy: formula.academy,
        requirements: formula.requirements
    };

    var options = {new: true};

    FormulaModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to update formula";
            callback(500, error);
        } else {
            if (results !== null) {
                console.log("formula updated successfully");
                callback(null, results);
            } else {
                errorMessage = "formula not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }
    });
}

/////////////////////////////////////// ***  Matching Object  *** /////////////////////////////

function buildAndSaveMatchingObject(matchingObject, callback) {

    var matchingObjectToAdd = new MatchingObjectsModel({
        matching_object_type: matchingObject.matching_object_type,
        date: matchingObject.date,
        original_text: matchingObject.original_text,
        sector: matchingObject.sector,
        locations: matchingObject.locations,
        candidate_type: matchingObject.candidate_type,
        scope_of_position: matchingObject.scope_of_position,
        academy: matchingObject.academy,
        formula: matchingObject.formula,
        requirements: matchingObject.requirements,
        compatibility_level: matchingObject.compatibility_level,
        status: null,
        personal_properties: matchingObject.personal_properties,
        favorites: [],
        cvs: [],
        user: matchingObject.user
    });

    /*save the User in db*/
    matchingObjectToAdd.save(function (err, result) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to insert matching object";
            callback(500, error);
        } else {
            console.log("the matching object saved successfully");
            callback(200, result);
        }
    });
}


// Add Object
function addMatchingObject(matchingObject, callback) {

    var parallelArr = [
        async.apply(addOriginalText, matchingObject.original_text, matchingObject.matching_object_type),
        async.apply(addRequirements, matchingObject.requirements),
        async.apply(addAcademy, matchingObject.academy)
    ];

    if (matchingObject.matching_object_type === "cv") {
        parallelArr.push(async.apply(addPersonalProperties, matchingObject.personal_properties));
    } else { //job
        parallelArr.push(async.apply(addFormula, matchingObject.formula));
    }

    async.parallel(parallelArr, function (status, results) {

        if (status === null) {
            matchingObject.original_text = results[0];
            matchingObject.requirements = results[1];
            matchingObject.academy = results[2];

            if (matchingObject.matching_object_type === "cv") {
                matchingObject.personal_properties = results[3];
            } else {
                matchingObject.formula = results[3];
            }

            buildAndSaveMatchingObject(matchingObject, function (status, matchingObjectResult) {
                callback(status, matchingObjectResult);
            });
        } else {
            errorMessage = "error while trying to add matching object";
            console.log(errorMessage);
            error.error = errorMessage;
            callback(status, error);
        }
    });

}

// Delete matching object
function deleteMatchingObject(matching_object_id, callback) {

    var query = {"_id": matching_object_id};
    var update = {
        archive: true
    };
    var options = {new: true};
    MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while delete matching object from the DB";
            callback(500, error);
        } else {
            if (results !== null) {
                console.log("the matching object deleted successfully from the db ", results);
                callback(200, results);
            } else {
                console.log("matching object not exists");
                error.error = "matching object not exists";
                callback(404, error);
            }
        }
    });

}

// Revive matching object
function reviveMatchingObject(matching_object_id, callback) {

    var query = {"_id": matching_object_id};
    var update = {
        archive: false
    };
    var options = {new: true};
    MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while revive matching object";
            callback(500, error);
        } else {
            if (results !== null) {
                console.log("the matching object revived successfully", results);
                callback(200, results);
            } else {
                console.log("matching object not exists");
                error.error = "matching object not exists";
                callback(404, error);
            }
        }
    });

}

// Update Object
function updateMatchingObject(matchingObject, callback) {

    var parallelArr = [
        async.apply(updateOriginalText, matchingObject.original_text, matchingObject.matching_object_type),
        async.apply(updateRequirements, matchingObject._id, matchingObject.requirements),
        async.apply(updateAcademy, matchingObject.academy)
    ];

    if (matchingObject.matching_object_type === "cv") {
        parallelArr.push(async.apply(updatePersonalProperties, matchingObject.personal_properties));
    } else { //job
        parallelArr.push(async.apply(updateFormula, matchingObject.formula));
    }

    async.parallel(parallelArr, function (status, results) {

        if (status === null) {

            var query = {"_id": matchingObject._id};
            var update;

            if (matchingObject.matching_object_type === "cv") {
                update = {
                    requirements: results[1],
                    sector: matchingObject.sector,
                    scope_of_position: matchingObject.scope_of_position,
                    candidate_type: matchingObject.candidate_type,
                    locations: matchingObject.locations
                };
            } else { // job
                update = {
                    requirements: results[1],
                    sector: matchingObject.sector,
                    compatibility_level: matchingObject.compatibility_level,
                    scope_of_position: matchingObject.scope_of_position,
                    candidate_type: matchingObject.candidate_type,
                    locations: matchingObject.locations
                };
            }

            var options = {new: true};
            MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
                if (err) {
                    console.log("something went wrong " + err);
                    error.error = "something went wrong while trying to update " + matchingObject.matching_object_type;
                    callback(500, error);
                } else {
                    if (results !== null) {
                        console.log(matchingObject.matching_object_type + " updated successfully");
                        callback(200, results);
                    } else {
                        errorMessage = matchingObject.matching_object_type + " not exists";
                        console.log(errorMessage);
                        error.error = errorMessage;
                        callback(404, error);
                    }
                }
            });
        } else {
            error.error = "something went wrong while trying to update " + matchingObject.matching_object_type;
            callback(status, error);
        }
    });

}

function getMatchingObject(matchingObjectId, matchingObjectType, callback) {

    var query;

    if (matchingObjectType === "cv") {

        query = MatchingObjectsModel.find(
            {_id: matchingObjectId, active: true, matching_object_type: matchingObjectType}
        ).limit(1).populate("user")
            .populate("academy")
            .populate("personal_properties")
            .populate({
                path: "original_text",
                populate: {path: "history_timeline", options: {sort: {"start_year": 1}}}
            })
            .populate({
                path: "requirements",
                populate: {path: "combination"}
            })
            .populate({
                path: "formula",
                populate: {path: "matching_requirements.details"}
            });


    } else {//job
        query = MatchingObjectsModel.find(
            {_id: matchingObjectId, active: true, matching_object_type: matchingObjectType}
        ).limit(1).populate("original_text")
            .populate("academy")
            .populate({
                path: "requirements",
                populate: {path: "combination"}
            })
            .populate("formula");
    }

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the " + matchingObjectType + " from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log(matchingObjectType + " extracted successfully from the db");
                callback(200, results);
            } else {
                console.log(matchingObjectType + " not exists");
                error.error = matchingObjectType + " not exists";
                callback(404, error);
            }
        }
    });
}

///////////////////////////////////////////// *** EXPORTS *** ///////////////////////

exports.addMatchingObject = addMatchingObject;
exports.deleteMatchingObject = deleteMatchingObject;
exports.reviveMatchingObject = reviveMatchingObject;
exports.updateMatchingObject = updateMatchingObject;
exports.getMatchingObject = getMatchingObject;