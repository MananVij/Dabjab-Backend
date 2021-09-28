const express = require('express');
const app = express();
const mongoose = require('mongoose')
const router = new express.Router();

const output = require('../public/output-data')
const CampData = require('../models/camp-data')

router.post('/postdata', async (req, res) => {
    const campData = new CampData(req.body);
    console.log(req)
    campData.save().then(() => {
        res.send(campData)
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