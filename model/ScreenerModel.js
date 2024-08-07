const mongoose = require("mongoose");
const validator = require("validator");
const {
    body
} = require("express-validator");

const screenerSchema = new mongoose.Schema({
    screenerId: {
        type: String,
        required: [true, 'Screener Id is required']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    sex: {
        type: String,
        required: [true, 'Sex is required'],
    },        
    mobile: {
        type: String,
        unique:true,
        required: [true, 'Mobile number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // 10-digit mobile number validation
            },
            message: props => `${props.value} is not a valid mobile number`
        }
    },
    mobile2: {
        type: String,
        validate: {
            validator: function(v) {
                return v ? /^\d{10}$/.test(v) : true; // Optional 10-digit mobile number validation
            },
            message: props => `${props.value} is not a valid mobile number`
        }
    },
    age: {
        type: String,
        required: [true, 'Age is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} is not a valid email`
        }
    },
    ngoId :{
        type: String,
        required: [true, 'ngoId is required'],
    },
    parentId: {
        type: String,
        required: [true, 'parentId is required'],
    },
    isMapped: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isSubScreener: {
        type: Number,
        default: 0
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Date of Birth is required"],
        validate: {
            validator: function(v) {
                return !isNaN(Date.parse(v));
            },
            message: (props) => `${props.value} is not a valid date`,
        },
    },
    dateOfOnBoarding: {
        type: Date,
        required: [true, "Date of Onboarding is required"],
        default: Date.now,
    },
    qualification: {
        type: String,
        required: [true, "Qualification is required"],
    },
    specialisation: {
        type: String,
        required: [true, "Specialisation is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    state: {
        type: String,
        required: [true, "State is required"],
    },
    ngoId: {
        type: String,
    },
    district: {
        type: String,
        required: [true, "District is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    pincode: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{6}$/.test(v); // Indian 6-digit pincode validation
            },
            message: (props) => `${props.value} is not a valid pincode`,
        },
    },
    photo: {
        type: String,
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        default: 0,
        min: [0, "Rating must be at least 0"],
        max: [5, "Rating must be at most 5"],
    },
    geolocations: {
        lat: {
            type: Number,
            default: -1,
        },
        lng: {
            type: Number,
            default: -1,
        },
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const ScreenerModel = mongoose.model("ScreenerDetails", screenerSchema);

module.exports = ScreenerModel;