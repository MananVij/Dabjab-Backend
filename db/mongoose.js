const mongoose = require('mongoose')
const dataBaseURL = process.env.DATABASE
console.log('hello')
mongoose.connect(dataBaseURL, {     
    useNewUrlParser: true, 
    // useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log(`successfully connected`);
    }).catch((e)=>{
    console.log(e.message);
});