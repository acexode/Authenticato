const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

const providerSchema = mongoose.Schema({

    facebook: {
        email: String,
        username: String,
        token: String,
        id: String,

    },
    twitter: {
        username: String,
        displayName: String,
        token: String,
        photos: String,
        id: String,

    },
    google: {
        username: String,
        displayName: String,
        token: String,
        photos: String,
        id: String,

    },
    local: {
        username: String,
        email: String,
        password: String
    }
});


const providers = module.exports = mongoose.model('Provider', providerSchema)