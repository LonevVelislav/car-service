const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        service: {
            type: String,
            enum: {
                values: [
                    "MOT",
                    "oil_change",
                    "inspection_brakes",
                    "electrical",
                    "diagnostics",
                    "tyres",
                    "interim_service",
                    "full_service",
                ],
                message: "invalid service!",
            },
            required: [true, "define a service!"],
            trim: true,
        },
        summary: {
            type: String,
            minLength: [10, "summary must be longer then 10 symbols"],
            maxLength: [600, "summary must be shorter then 100 symbols"],
            trim: true,
        },
        status: {
            type: String,
            default: "pending",
            enum: {
                values: ["pending", "active", "finished"],
                message: "invalid status",
            },
            trim: true,
        },
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

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
