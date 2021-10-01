const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    nameOfPerson: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    placeName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    pincode: {
        required: true,
        type: String,
    },
    date: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        trim: true,
        // required: true,
    },
    endTime: {
        type: String,
        trim: true,
        // required: true,
    },
    vaccine: {
        type: String,
        uppercase: true,
        // required: true,
    },
    fee_type: {
        type: Boolean,
        // required: true,
    },
    fee: {
        type: Number,
        required: true,
        default: 0
    },
    available_capacity_dose1: {
        type: Number,
        // required: true,
    },
    available_capacity_dose2: {
        type: Number,
        // required: true,
    }
},{
    timestamps: true
})

userSchema.statics.findByCredentials = async (pincode, date) => {
    // console.log(pincode, date);
    const data = await CampData.find({pincode, date})
    console.log(data)
    return data
}

const CampData = mongoose.model('CampData', userSchema)
module.exports = CampData