const express = require('express')
const app = express();
const cors = require('cors')
// const corsOptions = {
//     origin: '*',
//     // origin: 'https://dabjab.netlify.com',
//     optionsSuccessStatus: 200
// }
// app.use(cors(corsOptions))
app.use(cors())
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
//     );
//     res.header("Access-Control-Allow-Credentials", true);
//     next(); // dont forget this
//   });

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
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