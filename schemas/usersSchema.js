var users_schema = mongoose.Schema;


// Users Schema
var usersSchema = new users_schema({

    user_id: {
        type: String,
        required: true,
        index: 1,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    family_name: {
        type: String,
        required: true
    },
    birth_date: String,
    address: String,
    personal_properties: Number,
    company: Number,
    phone_number: String,
    sent_cvs: [Number],
    viewed_cvs: [Number],
    jobs: [
        {
            job_id: Number,
            user_cvs: [Number]
        }
    ],
    favorites: [Number],
    user_type: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
}, {collection: 'Users'});

exports.usersSchema = usersSchema;