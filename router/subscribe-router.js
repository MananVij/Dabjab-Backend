const express = require('express')
const app = express()
const {sendWelcomeEmail, sendNotificationEmail,  sendNotificationEmailIfCampExists} = require('../db/email')



const router = new express.Router()

const SubscriberData = require('../models/subscribe-model')
const CampData = require('../models/camp-data')

router.post('/subscribe', async (req, res) => {
    const subscriber = new SubscriberData(req.body)
    await subscriber.save().then(() => {
       res.send(subscriber)
       console.log(subscriber)
       const pincode = subscriber.pincode

       sendWelcomeEmail(subscriber.name, subscriber.email)  

       CampData.findByCredentialsOfPincode(pincode).then((camps) => {
        
        if(!camps) {
            return 
        }
        console.log(camps)
        sendNotificationEmailIfCampExists(subscriber.name, subscriber.email)
        console.log('Notification Mail Sent')
    })

    }).catch((e) => {
        console.log(e)
        res.send(e.message).status(401)
    })
})


module.exports = router 

