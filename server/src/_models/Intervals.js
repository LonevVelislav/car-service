const mongoose = require("mongoose");

const intervalsSchema = new mongoose.Schema({
    oil: {
        type: Number,
        default: null,
    },
    brakes: {
        type: Number,
        default: null,
    },
    cambelts: {
        type: Number,
        default: null,
    },
    suspension: {
        type: Number,
        default: null,
    },
    engine: {
        type: Number,
        default: null,
    },
    battery: {
        type: Number,
        default: null,
    },
    tyres: {
        type: Number,
        default: null,
    },
    clutches: {
        type: Number,
        default: null,
    },
    gearbox: {
        type: Number,
        default: null,
    },
    MOT: {
        type: Date,
        default: null,
    },
    roadtax: {
        type: Date,
        default: null,
    },
    tax: {
        type: Date,
        default: null,
    },
    insurance: {
        type: Date,
        default: null,
    },
});

const Intervals = mongoose.model("Intervals", intervalsSchema);
module.exports = Intervals;
