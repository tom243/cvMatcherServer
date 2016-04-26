var async = require("async");
var unirest = require('unirest');
var validation = require("./../utils/validation");

var MatchingObjectsModel = require('./../schemas/schemas').MatchingObjectsModel;
var FormulaModel = require('./../schemas/schemas').FormulaModel;
var UserModel = require('./../schemas/schemas').UserModel;
var StatusModel = require('./../schemas/schemas').StatusModel;
var RequirementsModel = require('./../schemas/schemas').RequirementsModel;
var OriginalTextModel = require('./../schemas/schemas').OriginalTextModel;
var PersonalPropertiesModel = require('./../schemas/schemas').PersonalPropertiesModel;
var HistoryTimelineModel = require('./../schemas/schemas').HistoryTimelineModel;
var AcademyModel = require('./../schemas/schemas').AcademyModel;
var ProfessionalKnowledgeModel = require('./../schemas/schemas').ProfessionalKnowledgeModel;
var MatchingDetailsModel = require('./../schemas/schemas').MatchingDetailsModel;
var KeyWordsModel = require('./../schemas/schemas').KeyWordsModel;

var errorMessage;

var error = {
    error: null
};

////////////////////////////////// *** Matching Objects *** ////////////////////////

// Add Object
function addMatchingObject(matchingObject, callback) {

    /* First we need to insert all embedded documents and after it insert
     matching object with all id references */

    /* common to job and cv */
    addOriginalText(matchingObject.original_text, matchingObject.matching_object_type, function (status, originalTextResults) {
        if (status === 200) {
            matchingObject.original_text = originalTextResults._id;
            /* Add Requirements */
            addRequirements(matchingObject.requirements, function (status, requirementsResults) {
                if (status === 200) {
                    matchingObject.requirements = requirementsResults;
                    addAcademy(matchingObject.academy, function (status, academyResult) {
                        if (status === 200) {
                            matchingObject.academy = academyResult;
                            /* start unique parameters */
                            if (matchingObject.matching_object_type === "cv") {
                                /* Add Personal Properties */
                                addPersonalProperties(matchingObject.personal_properties,
                                    function (status, personalPropertiesResult) {
                                        if (status === 200) {
                                            matchingObject.personal_properties = personalPropertiesResult._id;
                                            buildAndSaveMatchingObject(matchingObject, function (status, matchingObjectResult) {
                                                callback(status, matchingObjectResult);
                                            })
                                        } else {
                                            callback(status, personalPropertiesResult);
                                        }
                                    })
                            } else { // Add Job
                                /* Add Formula */
                                addFormula(matchingObject.formula, function (status, formulaResult) {
                                    if (status === 200) {
                                        matchingObject.formula = formulaResult._id;
                                        buildAndSaveMatchingObject(matchingObject, function (status, matchingObjectResult) {
                                            callback(status, matchingObjectResult);
                                        })
                                    } else {
                                        callback(status, formulaResult);
                                    }
                                })
                            }
                        } else {
                            callback(status, academyResult);
                        }
                    })
                } else {
                    callback(status, requirementsResults);
                }
            })
        } else {
            callback(status, originalTextResults);
        }
    });
}

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
        archive: false,
        active: true,
        user: matchingObject.user
    });

    /*save the User in db*/
    matchingObjectToAdd.save(function (err, result) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to insert matching object to the DB";
            callback(500, error);
        } else {
            console.log("the matching object saved successfully to the db ", result);
            callback(200, result);
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
            if (results != null) {
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
            if (results != null) {
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

    var parallelArr = [];

    if (matchingObject.matching_object_type === "cv") {
        parallelArr = [
            async.apply(updateOriginalText, matchingObject.original_text, matchingObject.matching_object_type),
            async.apply(updateRequirements, matchingObject._id, matchingObject.requirements),
            async.apply(updateAcademy, matchingObject.academy),
            async.apply(updatePersonalProperties, matchingObject.personal_properties)
        ]
    }else { //job
        parallelArr = [
            async.apply(updateOriginalText, matchingObject.original_text, matchingObject.matching_object_type),
            async.apply(updateRequirements, matchingObject._id, matchingObject.requirements),
            async.apply(updateAcademy, matchingObject.academy),
            async.apply(updateFormula, matchingObject.formula)
        ]
    }

    async.parallel(parallelArr, function (status, results) {

        console.log("updateMatchingObject results ", results);

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
                    if (results != null) {
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
        ).populate('user')
            .populate('academy')
            .populate('personal_properties')
            .populate({
                path: 'original_text',
                populate: {path: 'history_timeline', options: {sort: {'start_year': 1}}}
            })
            .populate({
                path: 'requirements',
                populate: {path: 'combination'}
            })
            .populate({
                path: 'formula',
                populate: {path: 'matching_requirements.details'}
            });


    } else {//job
        query = MatchingObjectsModel.find(
            {_id: matchingObjectId, active: true, matching_object_type: matchingObjectType}
        ).populate('original_text')
            .populate('academy')
            .populate({
                path: 'requirements',
                populate: {path: 'combination'}
            })
            .populate("formula")
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

/////////////////////////////////////// ***  OriginalText  *** /////////////////////////////


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
                        callback(200, doc);
                    }
                })
            }
        })
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
                callback(200, doc);
            }
        })
    }
}

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
                } else {
                    historyTimeLineArray.push(doc._id);
                    callbackAsync();
                }
            })
        },
        // 3rd param is the function to call when everything is done
        function (err) {
            // All tasks are done now
            callback(err, historyTimeLineArray);
        }
    );
}

/* update original text */
function updateOriginalText(originalText, type, originalTextCallback) {

    console.log("in updateOriginalText function");

    if (type === "cv") { //cv

        function getHistoryTimeline(callback) {

            console.log("in getHistoryTimeline function");

            var query = OriginalTextModel.find(
                {_id: originalText._id}, {history_timeline: 1}
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

        }

        function deleteHistoryTimeLineDocs(history_timeline, callback) {

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
        }

        function updateNewOriginalText(callback) {

            console.log("in updateNewOriginalText function");

            buildTimelineHistory(originalText.history_timeline, function (err, historyTimeline) {

                if (err) {
                    console.log("something went wrong " + err);
                    error.error = "something went wrong while trying to save history timeline to db";
                    callback(500, error);
                } else {

                    var query = {"_id": originalText._id};
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
                            if (results != null) {
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
            })

        }

        async.waterfall([
            getHistoryTimeline,
            deleteHistoryTimeLineDocs,
            updateNewOriginalText
        ], function (status, results) {
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
                if (results != null) {
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
            callback(200, doc._id);
        }
    })
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
            if (results != null) {
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

                } else {
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

                        } else {
                            requirementsArr.push(doc._id);
                            callbackAsync();
                        }
                    })
                }
            })
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
                callback(200, requirementsArr);
            }

        }
    );
}

function buildProfessionalKnowledge(professionalKnowledges, callback) {

    var professionalKnowledgeArr = [];

    // 1st para in async.each() is the array of items
    async.each(professionalKnowledges,
        // 2nd param is the function that each item is passed to
        function (item, callbackAsync) {
            // Call an asynchronous function, often a save() to DB

            var professionalKnowledgeToadd = new ProfessionalKnowledgeModel({
                name: item.name,
                years: item.years,
                mode: item.mode,
                percentage: item.percentage
            });

            /* save the professionalKnowledge to db*/
            professionalKnowledgeToadd.save(function (err, doc) {
                if (err) {
                    console.log("something went wrong " + err);
                    errorMessage = "something went wrong while trying to save professionalKnowledge to db to db";
                    return callbackAsync(new Error(errorMessage));
                } else {
                    professionalKnowledgeArr.push(doc._id);
                    callbackAsync();
                }
            })
        },
        // 3rd param is the function to call when everything is done
        function (err) {
            // All tasks are done now
            callback(err, professionalKnowledgeArr);
        }
    );
}

function updateRequirements(matchingObjectId, requirements, requirementsCallback) {

    console.log("in updateRequirements function");

    function getRequirements(callback) {

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

    }

    function getCombination(requirementsArr, callback) {

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
                    for (var i = 0; i < results.length; i++) {
                        combinationArr.push.apply(combinationArr, results[i].combination);
                    }
                    callback(null, requirementsArr, combinationArr);

                } else {
                    errorMessage = "requirements not exists";
                    console.log(errorMessage);
                    error.error = errorMessage;
                    callback(404, error);
                }
            }
        });
    }

    function removeProfessionalKnowledge(requirementsArr, combinationArr, callback) {

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
    }

    function deleteCombinationDocs(requirementsArr, callback) {

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

    async.waterfall([
        getRequirements,
        getCombination,
        removeProfessionalKnowledge,
        deleteCombinationDocs,
        async.apply(addRequirements, requirements)
    ], function (status, results) {
        console.log("results waterfall ", results);
        requirementsCallback(null, results);
    });

}

/////////////////////////////////////// ***  Status  *** /////////////////////////////

// Add Status
function rateCV(cvId, status, callback) {

    var statusToAdd = new StatusModel({
        seen: null,
        rate: {
            status: true,
            stars: status.stars,
            description: status.description,
            timestamp: status.timestamp
        },
        received: null
    });

    /* save the Status to db*/
    statusToAdd.save(function (err, result) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to save the status to the db";
            callback(500, error);
        } else {

            var query = {"_id": cvId};
            var update = {
                status: {
                    status_id: result._id,
                    current_status: status.current_status
                }
            };
            var options = {new: true, upsert: true};
            MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, results) {
                if (err) {
                    console.log("something went wrong " + err);
                    error.error = "something went wrong while trying to save the Status id to cv";
                    callback(500, error);
                } else {
                    if (results != null) {
                        console.log("cv rated successfully");
                        callback(200, results);
                    } else {
                        errorMessage = "cv not exists";
                        console.log(errorMessage);
                        error.error = errorMessage;
                        callback(404, error);
                    }
                }
            });
        }
    });
}

// Add Status
function updateRateCV(cvId, status, callback) {

    var query = {"_id": cvId};
    var update = {
        "status.current_status": status.current_status
    };
    var options = {new: true};
    MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err, result) {
        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to update the current status of the cv";
            callback(500, error);
        } else {

            if (result != null) {
                var query = {"_id": result.status.status_id};
                var update = {
                    "rate.stars": status.stars,
                    "rate.description": status.description,
                    "rate.timestamp": status.timestamp
                };
                var options = {new: true};
                StatusModel.findOneAndUpdate(query, update, options, function (err, result) {
                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to update the current status of the cv";
                        callback(500, error);
                    } else {
                        if (result != null) {
                            console.log("status of cv updated successfully");
                            callback(200, result);
                        } else {
                            errorMessage = "status id not exists";
                            console.log(errorMessage);
                            error.error = errorMessage;
                            callback(404, error);
                        }
                    }
                });
            } else {
                errorMessage = "cv id not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }
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
        officer: personalProperties.officer,
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
            callback(200, doc);
        }
    });

}

function updatePersonalProperties(personalProperties,callback) {

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
        officer: personalProperties.officer,
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
            if (results != null) {
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
            callback(200, doc);
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
            if (results != null) {
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


///////////////////////////////////////////// *** Employer *** ///////////////////////

function getJobsBySector(userId, sector, isArchive, callback) {

    var query = MatchingObjectsModel.find(
        {user: userId, sector: sector, active: true, matching_object_type: "job", archive: isArchive}
    ).populate('original_text')
        .populate('academy');


    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the jobs from the db";
            callback(500, error);
        } else {
            console.log("the jobs extracted successfully from the db");
            callback(200, results);
        }
    });
}

function getUnreadCvsForJob(userId, jobId, callback) {

    var query = MatchingObjectsModel.find(
        {_id: jobId, user: userId, active: true, matching_object_type: "job"},
        {cvs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the job from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                if (results[0].cvs.length > 0) {

                    var query = MatchingObjectsModel.find(
                        {
                            _id: {$in: results[0].cvs},
                            active: true,
                            "status.current_status": "unread",
                            matching_object_type: "cv"
                        }
                    ).populate('user').populate('original_text')
                        .populate('academy');
                    query.exec(function (err, results) {
                        if (err) {
                            console.log("something went wrong " + err);
                            error.error = "something went wrong while trying to get the  unread cvs for job from the db";
                            callback(500, error);
                        } else {
                            console.log("the cvs extracted successfully from the db");
                            callback(200, results);
                        }
                    });
                } else {
                    console.log("no cvs for this job");
                    callback(200, results[0].cvs);
                }
            } else {
                errorMessage = "job not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }

    });
}

function getRateCvsForJob(userId, jobId, current_status, callback) {

    var query = MatchingObjectsModel.find(
        {_id: jobId, user: userId, active: true, matching_object_type: "job"},
        {cvs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the job from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                if (results[0].cvs.length > 0) {

                    var query = MatchingObjectsModel.find(
                        {
                            _id: {$in: results[0].cvs}, active: true,
                            "status.current_status": current_status, matching_object_type: "cv"
                        }
                    ).populate('user')
                        .populate('status.status_id')
                        .populate('original_text')
                        .populate('academy');
                    query.exec(function (err, results) {
                        if (err) {
                            console.log("something went wrong " + err);
                            error.error = "something went wrong while trying to get the "
                                + current_status + " cvs for job from the db";
                            callback(500, error);
                        } else {
                            console.log("the cvs extracted successfully from the db");
                            callback(200, results);
                        }
                    });
                } else {
                    errorMessage = "jobs are empty";
                    console.log(errorMessage);
                    callback(200, results[0].cvs);
                }
            } else {
                errorMessage = "job not exists";
                console.log(errorMessage);
                error.error = errorMessage;
                callback(404, error);
            }
        }

    });
}

///////////////////////////////////////////// *** JobSeeker *** ///////////////////////


function getAllJobsBySector(userId, sector, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500, error);
        } else {

            if (results.length > 0) {

                var query = MatchingObjectsModel.find(
                    {
                        sector: sector,
                        active: true,
                        matching_object_type: "job",
                        _id: {$nin: results[0].jobs},
                        archive: false
                    }
                ).populate('original_text')
                    .populate('academy')
                    .populate({
                        path: 'user',
                        populate: {path: 'company'}
                    });

                query.exec(function (err, results) {

                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to get the jobs from the db";
                        callback(500, error);
                    } else {
                        console.log("the jobs extracted successfully from the db");
                        callback(200, results);
                    }
                });
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });
}

function getMyJobs(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {jobs: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                var query = MatchingObjectsModel.find(
                    {active: true, matching_object_type: "job", _id: {$in: results[0].jobs}, archive: false}
                ).populate('status.status_id')
                    .populate('original_text')
                    .populate('academy');

                query.exec(function (err, results) {

                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to get the jobs from the db";
                        callback(500, error);
                    } else {
                        console.log("the jobs extracted successfully from the db");
                        callback(200, results);
                    }
                });
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });
}

function getFavoritesJobs(userId, callback) {

    var query = UserModel.find(
        {_id: userId, active: true}, {favorites: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the user from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                var query = MatchingObjectsModel.find(
                    {active: true, matching_object_type: "job", _id: {$in: results[0].favorites}, archive: false}
                ).populate('status.status_id')
                    .populate('original_text')
                    .populate('academy');

                query.exec(function (err, results) {

                    if (err) {
                        console.log("something went wrong " + err);
                        error.error = "something went wrong while trying to get the favorite jobs from the db";
                        callback(500, error);
                    } else {
                        console.log("the favorite jobs extracted successfully from the db");
                        callback(200, results);
                    }
                });
            } else {
                console.log("user not exists");
                error.error = "user not exists";
                callback(404, error);
            }
        }
    });
}

function getIdOfCV(userId, callback) {

    var query = MatchingObjectsModel.find(
        {user: userId, active: true, matching_object_type: "cv"}, {_id: 1}
    );

    query.exec(function (err, results) {

        if (err) {
            console.log("something went wrong " + err);
            error.error = "something went wrong while trying to get the id of cv from the db";
            callback(500, error);
        } else {
            if (results.length > 0) {
                console.log("id of the cv extracted successfully from the db");
                callback(200, results);
            } else {
                console.log("cv not exists for this user");
                error.error = "cv not exists for this user";
                callback(404, error);
            }
        }
    })
}

function addCvToJob(jobId, cvId, callback) {

    var matchObjectToSend = {
        job: null,
        cv: null
    };

    getMatchingObject(jobId, "job", function (status, jobResults) {
        if (status === 200) {
            matchObjectToSend.job = jobResults[0];
        } else {
            console.log("cannot extract job from db");
            return callback(status, jobResults);
        }

        getMatchingObject(cvId, "cv", function (status, CvResults) {
            if (status === 200) {
                matchObjectToSend.cv = CvResults[0];
            } else {
                console.log("cannot extract cv from db");
                return callback(status, CvResults);
            }

            unirest.post('https://matcherlogic.herokuapp.com/addFormula')
                .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
                .send(matchObjectToSend)
                .end(function (response) {
                    if (validation.matcherResponse(response.body)) {
                        if (response.code == 200) {
                            saveMatcherFormula(cvId, response.body, function (status, result) {

                                if (status == 200) {

                                    if (response.body.total_grade > jobResults[0].compatibility_level) {

                                        var query = {"_id": cvId};
                                        var update = {
                                            "status.current_status": "unread",
                                            compatibility_level: response.body.total_grade
                                        };
                                        var options = {new: true, upsert: true};
                                        MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err) {
                                            if (err) {
                                                console.log('error in updating data for cv ' + err);
                                                error.error = "error in updating data for cv";
                                                callback(500, error);
                                            } else {

                                                var query = {
                                                    '_id': CvResults[0].user
                                                };
                                                var doc = {
                                                    $addToSet: {'jobs': jobId}
                                                };
                                                var options = {
                                                    upsert: true, new: true
                                                };
                                                UserModel.findOneAndUpdate(query, doc, options, function (err, userResults) {
                                                    if (err) {
                                                        console.log("error in add job to user " + err);
                                                        error.error = "error in add job to user";
                                                        callback(500, error);

                                                    } else {
                                                        var query = {
                                                            '_id': jobId
                                                        };
                                                        var doc = {
                                                            $addToSet: {'cvs': cvId}
                                                        };
                                                        var options = {
                                                            upsert: true, new: true
                                                        };
                                                        MatchingObjectsModel.findOneAndUpdate(query, doc, options, function (err) {
                                                            if (err) {
                                                                console.log("error in add cv to job " + err);
                                                                error.error = "error in add cv to job";
                                                                callback(500, error);

                                                            } else {
                                                                console.log("cv added to the job successfully");
                                                                callback(200, userResults);
                                                            }
                                                        });
                                                    }
                                                });

                                            }
                                        });
                                    } else {
                                        errorMessage = "cannot add cv to the job because it didn't passed the compatibility level of job";
                                        console.log(errorMessage);
                                        error.error = errorMessage;
                                        callback(404, error);
                                    }
                                } else {
                                    // error save matcher formula to db
                                    callback(status, result);
                                }

                            });
                        } else {
                            console.log("error occurred during matcher process: ", response.body);
                            callback(response.code, response.body);
                        }
                    } else {
                        errorMessage = "matcher response format is incorrect";
                        console.log(errorMessage);
                        error.error = errorMessage;
                        callback(404, error);
                    }
                });
        })
    });


}


///////////////////////////////////////////// *** Matcher *** ///////////////////////

function saveMatcherFormula(cvId, matcherResponse, callback) {

    buildMatchingDetails(matcherResponse.formula.requirements.details, function (err, matchingDetailsArray) {

        if (err) {
            console.log("error insert MatcherFormula to DB");
            error.error = "error insert MatcherFormula to DB";
            callback(500, error);

        } else {

            var formulaToAdd = new FormulaModel({
                locations: matcherResponse.formula.locations,
                candidate_type: matcherResponse.formula.candidate_type,
                scope_of_position: matcherResponse.formula.scope_of_position,
                academy: matcherResponse.formula.academy,
                matching_requirements: {
                    details: matchingDetailsArray,
                    grade: matcherResponse.formula.requirements.grade
                }
            });

            /*save the MatcherFormula in db*/
            formulaToAdd.save(function (err, result) {
                if (err) {
                    console.log("error insert MatcherFormula to DB " + err);
                    error.error = "error insert MatcherFormula to DB";
                    callback(500, error);
                } else {
                    var query = {"_id": cvId};
                    var update = {
                        "formula": result._id
                    };
                    var options = {new: true, upsert: true};
                    MatchingObjectsModel.findOneAndUpdate(query, update, options, function (err) {
                        if (err) {
                            console.log('error in updating formula id ' + err);
                            error.error = "error in updating formula id to the cv";
                            callback(500, error);
                        } else {
                            console.log("matcher formula saved successfully to db");
                            callback(200, matcherResponse);
                        }
                    });
                }
            });
        }
    });
}

function buildMatchingDetails(matchingDetails, callback) {

    if (typeof matchingDetails !== 'undefined' && matchingDetails.length > 0) {

        var matchingDetailsArray = [];

        // 1st para in async.each() is the array of items
        async.each(matchingDetails,
            // 2nd param is the function that each item is passed to
            function (item, callbackAsync) {
                // Call an asynchronous function, often a save() to DB

                var matchingDetailsToAdd = new MatchingDetailsModel({
                    name: item.name,
                    grade: item.grade
                });

                /* save the historyTime to db*/
                matchingDetailsToAdd.save(function (err, result) {
                    if (err) {
                        console.log("error in save matchingDetails to db " + err);
                        return callbackAsync(new Error("error in save matchingDetails to db "));
                    } else {
                        matchingDetailsArray.push(result._id);
                        callbackAsync();
                    }
                })
            },
            // 3rd param is the function to call when everything is done
            function (err) {
                // All tasks are done now
                callback(err, matchingDetailsArray);
            }
        );
    } else {
        callback("matching details is empty or undefined", [])
    }


}

///////////////////////////////////////////// *** Utils *** ///////////////////////

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


///////////////////////////////////////////// *** EXPORTS *** ///////////////////////
exports.addMatchingObject = addMatchingObject;
exports.deleteMatchingObject = deleteMatchingObject;
exports.reviveMatchingObject = reviveMatchingObject;
exports.updateMatchingObject = updateMatchingObject;
exports.getMatchingObject = getMatchingObject;

exports.getJobsBySector = getJobsBySector;
exports.getUnreadCvsForJob = getUnreadCvsForJob;
exports.getRateCvsForJob = getRateCvsForJob;

exports.rateCV = rateCV;
exports.updateRateCV = updateRateCV;

exports.getAllJobsBySector = getAllJobsBySector;
exports.getMyJobs = getMyJobs;
exports.getFavoritesJobs = getFavoritesJobs;
exports.getIdOfCV = getIdOfCV;
exports.addCvToJob = addCvToJob;

exports.saveMatcherFormula = saveMatcherFormula;

exports.getKeyWordsBySector = getKeyWordsBySector;