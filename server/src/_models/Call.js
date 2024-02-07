const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
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

const Call = mongoose.model("Call", callSchema);

module.exports = Call;
