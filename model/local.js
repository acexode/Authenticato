const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    email: {
        type: String

    },
    username: {
        type: String

    },
    password: {
        type: String

    }
})


const Users = module.exports = mongoose.model('local', userSchema)

module.exports.getUser = (username, cb) => {
    const query = { username: username }

    Users.findOne(query, cb)
}
module.exports.createUser = (newUser, cb) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(cb)


        });
    });
}

module.exports.validPassword = (password, hash, cb) => {
    bcrypt.compare(password, hash, function(err, match) {
        if (err) throw err;
        cb(null, match)
    });
}