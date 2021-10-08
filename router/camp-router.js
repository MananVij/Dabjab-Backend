const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = new express.Router();
const fetch = require("node-fetch");

const output = require("../public/output-data");
const CampData = require("../models/camp-data");
const Subscriber = require("../models/subscribe-model");
const { sendWelcomeEmail, sendNotificationEmail } = require("../db/email");

// Check For Cowin Data
async function checkCowin() {
  const subs = await Subscriber.find();

  const today = new Date();
  const tomm = new Date();
  tomm.setDate(today.getDate() + 1);
  const dateTomm = tomm.toISOString().split("T")[0];

  const year = dateTomm.slice(0, 4);
  const month = dateTomm.slice(5, 7);
  const date = dateTomm.slice(8, 10);

  //final date in dd-mm-yyyy
  const dateSearched = date + "-" + month + "-" + year;

  subs.map((sub) => {
    fetch(
      "https://dabjab.herokuapp.com/getcowindata?date=" +
        dateSearched +
        "&pincode=" +
        sub.pincode
    )
      .then((res) => {
        res
          .json()
          .then((data) => {
            data.map((abc, index) => {
              sendNotificationEmail(sub.name, sub.email, dateSearched);
            });
          })
          .catch((e) => {
            console.log("No Slot Found");
          });
      })
      .catch((e) => {
        console.log(e.message);
      });
  });
}
checkCowin();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Send OTP
router.post("/sendotp", async (req, res) => {
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
      console.log(error);
      res.status(500).send(error);
    });
});

//  Verify OTP
router.post("/verifyotp", async (req, res) => {
  if (req.body.phoneNumber && req.body.code.length === 6) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verificationChecks.create({
        to: `+91${req.body.phoneNumber}`,
        code: req.body.code,
      })
      .then((data) => {
        console.log(data);
        if (data.status === "approved") {
          res.status(200).send({
            message: "User is Verified!!",
            data,
          });
        }
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number or code :(",
      phonenumber: req.query.phoneNumber,
    });
  }
});

// Post Camp Data to db
router.post("/postdata", async (req, res) => {
  const campData = new CampData(req.body);

  const pincode = req.body.pincode;
  const dateOfCamp = req.body.date;
  campData
    .save()
    .then(() => {
      Subscriber.findByCredentials(pincode).then((subscribers) => {
        subscribers.map((subscriber) => {
          const name = subscriber.name;
          const email = subscriber.email;
          var date = new Date();
          date.setDate(date.getDate());
          console.log(date.typeof);
          console.log(date, subscriber);
          sendNotificationEmail(name, email, dateOfCamp);
        });
      });
    })
    .catch((error) => {
      console.log(error);
      res.send(error.message).status(401);
    });
});

// Get Cowin Data from db
router.get("/getcowindata", async (req, res) => {
  try {
    if (!req.query.pincode) {
      return res.send("please provide pincode").status();
    } else if (!req.query.date) {
      return res.send("please provide date").status();
    }

    output(req.query.pincode, req.query.date, (err, response) => {
      if (err) {
        console.log(err);
        return res.send(err).status(404);
      }
      res.send(
        response.map((data, index) => {
          return {
            placeName: data.placeName,
            hospitalAddress: data.hospitalAddress,
            pincode: data.pincode,
            vaccine: data.vaccine,
            ifPaid: data.ifPaid,
            timeStart: data.timeStart,
            timeEnd: data.timeEnd,
            // fee: data.fee,
            date: data.date,
            slots: data.slots,
            availDoseOne: data.availDoseOne,
            availDoseTwo: data.availDoseTwo,
          };
        })
      );
    });
  } catch (e) {
    console.log(e.message);
    res.status().send(e);
  }
});

//  Get Camp Data from db
router.get("/getcampdata", async (req, res) => {
  try {
    if (!req.query.pincode) {
      return res.send("please provide pincode").status(404);
    } else if (!req.query.date) {
      return res.send("please provide date").status(404);
    }
    const campData = await CampData.findByCredentials(
      req.query.pincode,
      req.query.date
    );
    if (!campData) {
      return res.send("No data found!").status(404);
    }
    res.send(
      campData.map((data, index) => {
        return {
          placeName: data.placeName,
          address: data.address,
          pincode: data.pincode,
          vaccine: data.vaccine,
          fee: data.fee, //
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          available_capacity_dose1: data.available_capacity_dose1,
          available_capacity_dose2: data.available_capacity_dose2,
        };
      })
    );
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

module.exports = router;
