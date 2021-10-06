const express = require('express')
const app = express();
const cors = require('cors')
const corsOptions = {
    origin: 'https://dabjab.netlify.com',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
// app.use(cors())

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const server = require('http').createServer();
const port = process.env.PORT || 3000
const mongoose = require('./db/mongoose');


const request = require('request')
const fetch = require('node-fetch')
const { ObjectId } = require('mongodb')


const campRouter = require('./router/camp-router')
const subscribeRouter = require('./router/subscribe-router')

app.use(express.json())

app.use(campRouter)
app.use(subscribeRouter)         


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})