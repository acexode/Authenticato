// hash password
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
module.exports.getUser = (username, cb) => {
    const query = { username: username }

    providers.findOne(query, cb)
}
module.exports.createUser = (newUser, cb) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.local.password, salt, function(err, hash) {
            newUser.local.password = hash;
            newUser.save(cb)


        });
    });
}

module.exports.validPassword = (password, hash, cb) => {
    bcrypt.compare(password, hash, function(err, match) {
        // if (err) throw err;
        cb(null, match)
    });
}