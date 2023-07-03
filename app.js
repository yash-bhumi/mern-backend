const express = require("express");

const app = express();

const port = 8000;
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
const cors = require("cors");


const multer = require('multer');

const users = require('./Schema/user');

const userMongo = require('./Schema/mongoData');


const cookiParser = require("cookie-parser");


const bcrypt = require('bcryptjs');

const auth = require('./middleware/authentication');





require('./DB/database');

app.use("/uploads", express.static("./uploads"));


const router = express.Router();



app.use(express.json());
app.use(cors())
app.use(cookiParser())
// app.use("/uploads", express.static("./uploads"));




app.get('/', (req, res) => {
    res.status(200).send('hellos');
});






// img storage path
const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads")
    },
    filename: (req, file, callback) => {
        // callback(null, `imgae-${Date.now()}. ${file.originalname}`)
        callback(null, `image-${Date.now()}.${file.originalname}`)

        // callback(null, Date.now() + '-' + file.originalname);
    }
})



// img filter
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true)
    } else {
        callback(new Error("only images is allowd"))
    }
}

const upload = multer({
    storage: imgconfig,
    fileFilter: isImage
});




app.get('/addUser', async (req, res) => {



    try {

        const getUser = await users.find();


        console.log(getUser, "getUser....")


        res.status(200).send({ status: 201, getUser })


    } catch (e) {

        console.log("error", e);

    }






})




app.delete(`/delete/:id`, async (req, res) => {

    const { id } = req.params;

    console.log(id, "dd");



    try {

        const dltUser = await users.findByIdAndDelete({ _id: id });

        res.status(201).json({ status: 201, dltUser })


    } catch (e) {
        res.status(201).json({ status: 201, dltUser })

    }



})


app.post('/register', upload.single('file'), async (req, res) => {


    console.log('register api called!');

    console.log(req.body, "req.body is here")


    console.log(req.file, "reqfile");



    const { name } = req.body;
    const { filename } = req.file;

    console.log(req, "reqest",)



    console.log(name, "checkname", req.file);

    // const { file } = req.file;


    // console.log(file, "sgsg")

    // if (!file || !name) {
    //     res.status(401).json({ status: 401, message: "fill all the data" })
    // }

    // console.log('namefrom server', name, file);



    try {
        const userdata = new users({
            name: name,
            imagepath: filename

        })

        const finaldata = await userdata.save();

        res.status(200).json({ status: 201, finaldata })


    }
    catch (error) {
        res.status(401).json({ status: 401, error })
    }

})










app.post('/singup', async (req, res) => {





    const { name, email, password, cpassword } = req.body;

    // console.log(req, "req data", name, email, password, cpassword);








    try {

        if (!name || !email || !password || !cpassword) {

            res.send('please fill the all data')

        }


        const user = new userMongo({

            name, email, password, cpassword

        })



        console.log('checkdata', password, cpassword)
        const finaldata = await user.save();




        res.status(201).json({ status: '201', finaldata })


        // res.status(201).json({ status: '201', msg:'testing...!' })

    } catch (e) {
        console.log(e, "error occurred!!")
    }



});






app.post('/login', async (req, res) => {


    // console.log(req.body, "req-body");


    const { email, password } = req.body;

    if (!email || !password) {

        res.status(422).json({ error: "Please! fill all the details." })

    }


    try {

        const userValid = await userMongo.findOne({ email: email });


        console.log(userValid, "uv")


        if (!userValid) {

            res.status(400).json({ "massage": 'user is not valid!' })
        }

        console.log(password, userValid.password, "campare")

        const isMatch = await bcrypt.compare(password, userValid.password);


        console.log(isMatch, "sm")

        if (isMatch) {

            console.log(isMatch, "ismatch");



            //token generate


            const token = await userValid.generateAuthtoken();


            // console.log(token);


            //cookie generate


            console.log(userValid, token, "dddddddddddddddddddddddddddddddddddddddd")

            res.cookie("usercookie", token, {
                expires: new Date(Date.now() + 9000000),
                httpOnly: true
            })



            const result = {
                userValid,
                token
            }

            res.status(201).json({ status: 201, result })



        }


        // console.log(userValid, "user is valid");


    } catch (e) {
        console.log("error has been occoured !!", e)

    }









})




app.get('/validUser', auth, async (req, res) => {

    // console.log('next called!')

    try {


        const validUserOne = await userMongo.findOne({ _id: req.id })

        // console.log(validUserOne, "vuo");

        res.status(201).json({ status: 201, validUserOne });


    } catch (e) {
        res.status(401).json({ status: 401, e });


    }



})


// app.get('/logout', auth, async (req, res) => {

//     console.log('we have entered!!');


//     try {
//         console.log('a', req.token)


//         req.rootUser.tokens = req.rootUser.tokens.filter((curr) => curr.token !== req.token);
//         console.log(req.rootUser.tokens,'b')

//         res.clearCookie('usercookie', { path: '/' });
//         console.log('c')

//         req.rootUser.save();
//         console.log('')

//         res.status(201).json({ status: 201 })
//     }
//     catch (e) {
//         res.status(401).json({ status: 401, e })

//     }



// })



app.get("/logout", auth, async (req, res) => {
    try {

        console.log('aaaaaaaaaaaaaaa')
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie", { path: "/" });

        req.rootUser.save();

        res.status(201).json({ status: 201 })

    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
})



app.listen(port, () => {
    console.log(`server start at port... ${port}`)
});



