const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://yash:1234@cluster0.98mjiv3.mongodb.net/test`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log('DATABASE CONNECTED !!!')).catch((err) => console.log("error" + err.message));


