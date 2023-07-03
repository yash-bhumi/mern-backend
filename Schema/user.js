const mongoose = require('mongoose');

const userSchema = ({

    name: {
        type: String,
        required: true
    },
    imagepath: {
        type: String,
        required: true
    },


});


const users = mongoose.model('users', userSchema);
module.exports = users;
