const express = require('express');
const app = express();
const mongoose = require('mongoose')
const router = new express.Router();

const output = require('../public/output-data')
const CampData = require('../models/camp-data')
const Subscriber = require('../models/subscribe-model')
const {sendWelcomeEmail, sendNotificationEmail} = require('../db/email')



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

router.post('/sendotp', async (req, res) => {
    client.verify
         .services(process.env.SERVICE_ID)
         .verifications.create({
           to: `+91${req.body.phoneNumber}`,
           channel: "sms",
         })
         .then((data) => {
           res.status(200).send(data);
         })
         .catch((error) => {
             console.log(error)
           res.status(500).send(error);
         });

})

router.post('/verifyotp', async (req, res) =>{
    if (req.body.phoneNumber && req.body.code.length === 6) {
        client.verify
          .services(process.env.SERVICE_ID)
          .verificationChecks.create({
            to: `+91${req.body.phoneNumber}`,
            code: req.body.code,
          })
          .then((data) => {
              console.log(data)
            if (data.status === "approved") {
              res.status(200).send({
                message: "User is Verified!!",
                data,
              });
            } 
          }
          );
      } else {
        res.status(400).send({
          message: "Wrong phone number or code :(",
          phonenumber: req.query.phoneNumber,
          
        });
      }
})


router.post('/postdata', async (req, res) => {
    const campData = new CampData(req.body);

    const pincode = req.body.pincode
    const dateOfCamp = req.body.date
    campData.save().then(() => {
        Subscriber.findByCredentials(pincode).then((subscribers) => {

            subscribers.map((subscriber) => {
                const name = subscriber.name
                const email = subscriber.email
                var date = new Date()
                date.setDate(date.getDate());
                console.log(date.typeof)
                console.log(date, subscriber)
                sendNotificationEmail(name, email, dateOfCamp)
            })
        })


        // const subscribers = Subscriber.findByCredentials(pincode)
        // console.log(subscribers.typeof)
        //ok till here

        // console.log(subscribers)
        // subscribers.map((subscriber) => {
        //     const name = subscriber.name
        //     const email = subscriber.email
        //     var date = new Date()
        //     date.setDate(date.getDate() - 2);
        //     console.log(date, subscriber)
            // sendNotificationEmail(name, email, date)
    // })
    // changes end  
    }).catch((error) => {
        console.log(error);
        res.send(error.message).status(401)
    });
})

router.get('/getcowindata', async(req, res) => {
    try{
        if(!req.query.pincode) {
            return res.send('please provide pincode').status()
        }
        else if(!req.query.date) {
            return res.send('please provide date').status()
        }

        output(req.query.pincode, req.query.date, (err, response) => {
            if(err) {
                console.log(err)
                return res.send(err).status(404)
            }
            res.send(
                response.map((data, index) => {
                return ({
                    placeName : data.placeName,
                    hospitalAddress : (data.hospitalAddress),
                    pincode : (data.pincode),
                    vaccine : (data.vaccine),
                    ifPaid : (data.ifPaid),
                    timeStart: data.timeStart,
                    timeEnd: data.timeEnd,
                    // fee: data.fee,
                    date: data.date,
                    slots: data.slots,
                    availDoseOne: data.availDoseOne,
                    availDoseTwo: data.availDoseTwo
                })
            }) )
        })
    } catch (e) {
        console.log(e);
        res.status().send(e)
    }
})

router.get('/getcampdata', async (req, res) => {
    try{
        if(!req.query.pincode) {
            return res.send('please provide pincode').status(404);
        }
        else if(!req.query.date) {
            return res.send('please provide date').status(404)
        }
        const campData = await CampData.findByCredentials(req.query.pincode, req.query.date)
        if(!campData) {
            return res.send('No data found!').status(404)
        }
        res.send(
            campData.map((data, index) => {
            return ({
                placeName : data.placeName,
                address : (data.address),
                pincode : (data.pincode),
                vaccine : (data.vaccine),
                fee: data.fee, //
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                available_capacity_dose1: data.available_capacity_dose1,
                available_capacity_dose2: data.available_capacity_dose2
            })
        })
        )

    } catch(e){
        console.log(e);
        res.status(500).send(e.message)
    }
})

module.exports = router;