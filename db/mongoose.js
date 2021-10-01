const mongoose = require('mongoose')
const dataBaseURL = process.env.DATABASE
mongoose.connect(dataBaseURL, {     
    useNewUrlParser: true, 
    // useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log(`successfully connected`);
    }).catch((e)=>{
    console.log(e.message);
});