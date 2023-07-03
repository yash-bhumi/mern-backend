


const screatKey = 'helloworldprogram';


const userMongo = require('../Schema/mongoData')

const jwt = require('jsonwebtoken');



const auth = async (req, res, next) => {

    console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')


    // console.log(req.headers.authorization, "Req is here...");

    const token = req.headers.authorization;


    console.log(token, "aaauth")


    try {





        const VerifyUser = await jwt.verify(token, screatKey);


        const rootuser = await userMongo.findOne({ _id: VerifyUser._id });


        console.log(rootuser);


        req.token = token;
        req.rootUser = rootuser;
        req.id = rootuser._id;


        next();








        // console.log(VerifyUser, 'user')


    } catch (e) {
        res.status(401).json({ status: 401, message: "Unauthorized no token provide" })

    }




}

module.exports = auth;