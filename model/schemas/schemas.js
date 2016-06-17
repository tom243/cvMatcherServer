var mongoose = require('mongoose'), Schema = mongoose.Schema;
var companies_schema = mongoose.Schema;
var formulas_schema = mongoose.Schema;
var key_words_schema = mongoose.Schema;
var matching_objects_schema = mongoose.Schema;
var users_schema = mongoose.Schema;
var status_schema = mongoose.Schema;
var requirements_schema = mongoose.Schema;
var original_text_schema = mongoose.Schema;
var personal_properties_schema = mongoose.Schema;
var history_timeline_schema = mongoose.Schema;
var academy_schema = mongoose.Schema;
var professional_knowledge_schema = mongoose.Schema;
var matching_details_schema = mongoose.Schema;
var jobseeker_jobs_schema = mongoose.Schema;
var validation_schema = mongoose.Schema;

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
        unique: true
    },
    first_name: String,
    last_name: String,
    email:{
        type:String,
        required:true
    },
    birth_date: String,
    address: String,
    company: { type: Schema.Types.ObjectId, ref: 'CompanyModel' },
    phone_number: String,
    linkedin: String,
    jobs: [{ type: Schema.Types.ObjectId, ref: 'JobSeekerJobsModel'}],
    current_cv: { type: Schema.Types.ObjectId, ref: 'MatchingObjectsModel' },
    hwid : String,
    active: {
        index: 1,
        type: Boolean,
        default: true
    }
}, {collection: 'Users'});


// historyTimeline Schema
var jobSeekerJobsSchema = new jobseeker_jobs_schema({

    job : { type: Schema.Types.ObjectId, ref: 'MatchingObjectsModel', required:true },
    cv: { type: Schema.Types.ObjectId, ref: 'MatchingObjectsModel', required:true },
    favorite: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }

}, {collection: 'JobSeeker_Jobs'});

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
    phone_number: {
        type: Number,
        required: true
    },
    employees:[{ type: Schema.Types.ObjectId, ref: 'PersonalPropertiesModel' }],
    password: {
        type: String,
        required: true
    },
    active: {
        index: 1,
        type: Boolean,
        default: true
    }

}, {collection: 'Companies'});

// Matching Objects Schema
var matchingObjectsSchema = new matching_objects_schema({

    matching_object_type: {
        type: String,
        required: true,
        index: 1
    },
    date: {
        type: Date,
        required: true
    },
    original_text: { type: Schema.Types.ObjectId, ref: 'OriginalTextModel', required:true },
    sector: {
        type: String,
        required: true,
        index: 1
    },
    locations: [{
        type: String,
        required:true
    }],
    candidate_type:[{
        type: String,
        required:true
    }],
    scope_of_position:[{
        type: String,
        required:true
    }],
    academy: { type: Schema.Types.ObjectId, ref: 'AcademyModel', required:true },
    formula: { type: Schema.Types.ObjectId, ref: 'FormulaModel' },
    requirements: [{ type: Schema.Types.ObjectId, ref: 'RequirementsModel' }],
    compatibility_level: Number,
    status:{
        status_id: { type: Schema.Types.ObjectId, ref: 'StatusModel' },
        current_status: String,
        timestamp: Date //TODO: Not Forget to add to code get it from roni
    },
    personal_properties: { type: Schema.Types.ObjectId, ref: 'PersonalPropertiesModel' },
    favorites: [String],
    cvs: [String],
    archive:{
        index: 1,
        type: Boolean,
        default: false
    },
    active: {
        index: 1,
        type: Boolean,
        default: true
    },
    user: {
            type: Schema.Types.ObjectId,
            required:true,
            index:1,
            ref: 'UserModel'
    },
    hired: {
        type: Boolean,
        default: false
    },
    predict_result: Boolean

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
    requirements: Number,
    matching_requirements : {
        details: [{
         type: Schema.Types.ObjectId,
         ref: 'MatchingDetailsModel'
         }],
        grade: Number
    }

}, {collection: 'Formulas'});

// Status Schema
var statusSchema = new status_schema({
    rate: {
        status: Boolean,
        stars: Number,
        description: String,
        timestamp: Date
    }
}, {collection: 'Status'});

// requirement Schema
var requirementSchema = new requirements_schema({
    combination:[{ type: Schema.Types.ObjectId, ref: 'ProfessionalKnowledgeModel', required:true }]
}, {collection: 'Requirements'});


// originalTextSchema Schema
var originalTextSchema = new original_text_schema({
    title: String,
    description: String,
    requirements: String,
    history_timeline: [{ type: Schema.Types.ObjectId, ref: 'HistoryTimelineModel' }]
}, {collection: 'Original_Text'});

// personalPropertiesSchema Schema
var personalPropertiesSchema = new personal_properties_schema({

    university_degree:{
        type : Boolean,
        required : true
    },
    degree_graduation_with_honors: {
        type : Boolean,
        required : true
    },
    above_two_years_experience: {
        type : Boolean,
        required : true
    },
    psychometric_above_680: {
        type : Boolean,
        required : true
    },
    multilingual: {
        type : Boolean,
        required : true
    },
    volunteering: {
        type : Boolean,
        required : true
    },
    full_army_service: {
        type : Boolean,
        required : true
    },
    officer_in_the_military: {
        type : Boolean,
        required : true
    },
    high_school_graduation_with_honors: {
        type : Boolean,
        required : true
    },
    youth_movements: {
        type : Boolean,
        required : true
    },
    decision: Boolean
}, {collection: 'Personal_Properties'});

// historyTimeline Schema
var historyTimelineSchema = new history_timeline_schema({
    text: {
        type: String,
        required:true
    },
    start_year: {
        type: Number,
        required:true
    },
    end_year: {
        type: Number,
        required:true
    },
    type: {
        type: String,
        required:true
    }

}, {collection: 'History_Timeline'});

// AcademySchema Schema
var academySchema = new academy_schema({
    academy_type: [{
        type: String,
        required:true
    }],
    degree_name: {
        type: String,
        required:true
    },
    degree_type: [{
        type: String,
        required:true
    }]

}, {collection: 'Academy'});

// ProfessionalKnowledgeSchema Schema
var professionalKnowledgeSchema = new professional_knowledge_schema({
    name: {
        type : String,
        lowercase: true,
        required : true
    },
    years: {
        type : Number,
        required : true
    },
    mode: String,
    percentage: Number
}, {collection: 'Professional_Knowledge'});

// MatchingDetailsSchema Schema
var matchingDetailsSchema = matching_details_schema({
    name: {
        type : String,
        required : true
    },
    grade: {
        type : Number,
        required : true
    }
}, {collection: 'Matching_Details'});

// keyWords Schema
var keyWordsSchema = key_words_schema({
    sector: {
        type: String,
        required:true
    },
    word: {
        type: String,
        unique:true,
        required:true
    },
    count: {
        type: Number,
        default:4
    }
}, {collection: 'Key_Words'});

var validationSchema = validation_schema({
    sector: [{
        type: String,
        required:true
    }],
    candidate_type: [{
        type: String,
        required:true
    }],
    scope_of_position: [{
        type: String,
        required:true
    }],
    academy_type: [{
        type: String,
        required:true
    }],
    degree_name: [{
        type: String,
        required:true
    }],
    degree_type: [{
        type: String,
        required:true
    }]
}, {collection: 'Validation'});


var UserModel                   = mongoose.model('UserModel', usersSchema);
var StatusModel                 = mongoose.model('StatusModel',statusSchema);
var RequirementsModel           = mongoose.model('RequirementsModel',requirementSchema);
var CompanyModel                = mongoose.model('CompanyModel', companiesSchema);
var FormulaModel                = mongoose.model('FormulaModel', formulasSchema);
var MatchingObjectsModel        = mongoose.model('MatchingObjectsModel', matchingObjectsSchema);
var OriginalTextModel           = mongoose.model('OriginalTextModel', originalTextSchema);
var PersonalPropertiesModel     = mongoose.model('PersonalPropertiesModel', personalPropertiesSchema);
var HistoryTimelineModel        = mongoose.model('HistoryTimelineModel', historyTimelineSchema);
var AcademyModel                = mongoose.model('AcademyModel', academySchema);
var ProfessionalKnowledgeModel  = mongoose.model('ProfessionalKnowledgeModel', professionalKnowledgeSchema);
var MatchingDetailsModel        = mongoose.model('MatchingDetailsModel', matchingDetailsSchema);
var KeyWordsModel               = mongoose.model('KeyWordsModel', keyWordsSchema);
var JobSeekerJobsModel          = mongoose.model('JobSeekerJobsModel', jobSeekerJobsSchema);
var ValidationModel             = mongoose.model('ValidationModel', validationSchema);

exports.CompanyModel                = CompanyModel;
exports.MatchingObjectsModel        = MatchingObjectsModel;
exports.FormulaModel                = FormulaModel;
exports.UserModel                   = UserModel;
exports.StatusModel                 = StatusModel;
exports.RequirementsModel           = RequirementsModel;
exports.OriginalTextModel           = OriginalTextModel;
exports.PersonalPropertiesModel     = PersonalPropertiesModel;
exports.HistoryTimelineModel        = HistoryTimelineModel;
exports.AcademyModel                = AcademyModel;
exports.ProfessionalKnowledgeModel  = ProfessionalKnowledgeModel;
exports.MatchingDetailsModel        = MatchingDetailsModel;
exports.KeyWordsModel               = KeyWordsModel;
exports.JobSeekerJobsModel          = JobSeekerJobsModel;
exports.ValidationModel             = ValidationModel;