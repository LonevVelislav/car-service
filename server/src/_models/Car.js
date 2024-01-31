const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    number: {
        type: String,
        required: [true, "registration number not specified"],
        minLength: [8, "registration number must be of 8 symbols"],
        maxLength: [8, "registration number must be of 8 symbols"],
        unique: true,
        trim: true,
    },
    model: {
        type: String,
        required: [true, "model is not specified!"],
        trim: true,
    },
    MOT: {
        date: Date,
        kilometars: Number,
        info: String,
    },
    oilFilterChange: {
        engineOil: {
            model: String,
            date: Date,
            mileage: Number,
        },
        oilFilter: {
            model: String,
            date: Date,
            mileage: Number,
        },
        airFilter: {
            model: String,
            date: Date,
            mileage: Number,
        },
        fuelFilter: {
            model: String,
            date: Date,
            mileage: Number,
        },
        repears: [],
    },
    diagnostics: {
        info: String,
        repears: [],
    },
    engine: {
        infor: String,
        repears: [],
    },
    breaks: {
        fluid: {
            model: String,
            date: Date,
            mileage: Number,
        },
        pads: {},
        disks: {},
        repears: [],
    },
    tyres: {
        model: {
            model: String,
            date: Date,
        },
        pressure: {
            amount: Number,
            date: Date,
        },
        alignment: {
            date: Date,
        },
        repears: [],
    },
    driveSystem: {
        clutchFluid: {
            model: String,
            date: Date,
            mileage: Number,
        },
        repears: [],
    },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
