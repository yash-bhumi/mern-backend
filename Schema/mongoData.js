const mongoose = require('mongoose');


const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');



const userMongo = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,


    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 6

    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})



//password hashing

userMongo.pre("save", async function (next) {

    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")

    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }

    next();

})



userMongo.methods.generateAuthtoken = async function () {

    try {

        let token23 = jwt.sign({ _id: this._id }, "helloworldprogram", {
            expiresIn: "1d"
        })


        this.tokens = this.tokens.concat({ token: token23 });

        await this.save();

        return token23;









    } catch (e) {
        res.status(422).json(error)


    }



}


const userdb = new mongoose.model('userData', userMongo)


module.exports = userdb;