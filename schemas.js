var mongoose = require('mongoose');
var companies_schema = mongoose.Schema;
var formulas_schema = mongoose.Schema;
var key_words_schema = mongoose.Schema;
var matching_objects_schema = mongoose.Schema;
var users_schema = mongoose.Schema;
var status_schema = mongoose.Schema;
var requirements_schema = mongoose.Schema;

// Users Schema
var usersSchema = new users_schema({

    google_user_id :{
        type: String,
        required: true,
        index: 1,
        unique: true
    },
    personal_id: {
        type: String,
        required: true,
        index: 1,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
    },
    birth_date: String,
    address: String,
    personal_properties: String,
    company: String,
    phone_number: String,
    favorites: [String],
    user_type: {
        type: String,
        required: true
    },
    jobs:[String],
    active: {
        index: 1,
        type: Boolean,
        required: true
    }
}, {collection: 'Users'});




// Companies Schema
var companiesSchema = new companies_schema({

    name: {
        type: String,
        required: true,
        index: 1,
        unique: true
    },
    logo: {
        type: String,
        required: true
    },
    p_c: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    active: {
        index: 1,
        type: Boolean,
        required: true
    }
}, {collection: 'Companies'});

// Matching Objects Schema
var matchingObjectsSchema = new matching_objects_schema({

    matching_object_type: {
        type: String,
        required: true,
        index: 1
    },
    google_user_id:{
        type:String,
        required:true,
        index : 1
    },
    date: {
        type: String,
        required: true
    },
    original_text: [{
        title: String,
        description: String,
        requirements: String
    }],
    sector: {
        type: String,
        required: true,
        index: 1
    },
    locations: {
        type: [String],
        required: true
    },
    candidate_type: {
        type: [String],
        required: true
    },
    scope_of_position: {
        type: [String],
        required: true
    },
    academy: [{
        academy_name: String,
        degree_name: String,
        degree_type: [String]
    }],
    sub_sector: {
        type: [String],
        required: true
    },
    formula: String,
    requirements: [{ type: Number, ref: 'RequirementsModel' }],
    compatibility_level: {
        type: Number,
        required: true
    },
    status:{
        status_id: { type: Number, ref: 'StatusModel' },
        favorite: Boolean,
        current_status: String
    },
    favorites: [String],
    cvs: [String],
    archive:{
        index: 1,
        type: Boolean,
        required: true
    },
    active: {
        index: 1,
        type: Boolean,
        required: true
    },
    user: { type: Number, ref: 'UserModel' }

}, {collection: 'Matching_Objects'});


// Formulas Schema
var formulasSchema = new formulas_schema({

    locations: {
        type: Number,
        required: true
    },
    candidate_type: {
        type: Number,
        required: true
    },
    scope_of_position: {
        type: Number,
        required: true
    },
    academy: {
        type: Number,
        required: true
    },
    requirements: {
        type: Number,
        required: true
    }
}, {collection: 'Formulas'});

// Status Schema
var statusSchema = new status_schema({

    seen: {
        status: Boolean,
        timestamp: String
    },
    rate: {
        status: Boolean,
        stars: Number,
        description: String,
        timestamp: String
    },
    received: {
        status: Boolean,
        timestamp: String
    }
}, {collection: 'Status'});

// Status Schema
var requirementSchema = new requirements_schema({

    combination:[{
        name: {
            type : String,
            required : true
        },
        years: {
            type : Number,
            required : true
        },
        mode: {
            type : String,
            required : true
        },
        percentage:{
            type:Number,
            required:true
        }
    }]
}, {collection: 'Requirements'});



var UserModel = mongoose.model('UserModel', usersSchema);
var StatusModel = mongoose.model('StatusModel',statusSchema);
var RequirementsModel = mongoose.model('RequirementsModel',requirementSchema);

exports.companiesSchema = companiesSchema;
exports.matchingObjectsSchema = matchingObjectsSchema;
exports.formulasSchema = formulasSchema;
exports.UserModel = UserModel;
exports.StatusModel = StatusModel;
exports.RequirementsModel = RequirementsModel;