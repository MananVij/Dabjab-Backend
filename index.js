const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT
const mongoose = require('./db/mongoose');

const express = require('express')
const app = express();
const cors = require('cors')
app.use(cors())
const request = require('request')
const fetch = require('node-fetch')

const { ObjectId } = require('mongodb')

// const User = require('./models/user_reg')       //To be uploadded Shortly

// const userRouter = require('./router/user-router')
const campRouter = require('./router/camp-router')
const subscribeRouter = require('./router/subscribe-router')
// const otpRouter = require('./router/otp')
app.use(express.json())

// app.use(userRouter)          //here
app.use(campRouter)
app.use(subscribeRouter)         //here
// app.use(otpRouter)


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})