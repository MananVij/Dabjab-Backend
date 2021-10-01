const express = require('express')
const app = express()
const {sendWelcomeEmail, sendNotificationEmail} = require('../db/email')



const router = new express.Router()

const SubscriberData = require('../models/subscribe-model')

router.post('/subscribe', async (req, res) => {
    const subscriber = new SubscriberData(req.body)
    await subscriber.save().then(() => {
        console.log(subscriber)
       res.send(subscriber)
       sendWelcomeEmail(subscriber.name, subscriber.email)  
    }).catch((e) => {
        console.log(e)
        res.send(e.message).status(401)
    })
})


module.exports = router 

