const mongoose = require("mongoose");

const serviceCardSchema = new mongoose.Schema(
    {
        date: Date,
        car: {
            type: mongoose.Schema.ObjectId,
            ref: "Car",
        },
        km: Number,
        type: {
            type: String,
            required: [true, "service needs a type"],
            enum: {
                values: [
                    "MOT",
                    "airconditioning",
                    "brakes",
                    "clutches",
                    "engine",
                    "exhaust",
                    "suspension",
                    "tyres",
                    "fuelsystem",
                    "battery",
                    "gearbox",
                    "cambelts",
                    "oil",
                    "cooling",
                    "repair",
                ],
                message: "invalid service!",
            },
            trim: true,
        },

        info: String,
        car: {
            type: mongoose.Schema.ObjectId,
            ref: "Car",
        },
    },

    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Service = mongoose.model("Service", serviceCardSchema);

module.exports = Service;
