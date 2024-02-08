const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const carSchema = new mongoose.Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        number: {
            type: String,
            required: [true, "registration number not specified!"],
            minLength: [8, "registration number must be of 8 symbols!"],
            maxLength: [8, "registration number must be of 8 symbols!"],
            unique: true,
            trim: true,
        },
        pin: {
            type: String,
            required: [true, "pin number not specified!"],
            minLength: [4, "pin must be 4 numbers!"],
            maxLength: [4, "pin must be 4 numbers!"],
            trim: true,
            validate: {
                validator: function (value) {
                    return isNaN(Number(value)) === false && Number(value) % 1 === 0;
                },
                message: "ivalid pin!",
            },
            select: false,
        },

        model: {
            type: String,
            trim: true,
        },
        engine: {
            type: String,
            trim: true,
        },
        km: {
            type: Number,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
carSchema.pre("save", async function (next) {
    this.number = this.number.toUpperCase();
    this.pin = await bcrypt.hash(this.pin, 10);
    next();
});

carSchema.pre(/^find/, function (next) {
    if (this.op === "findOneAndUpdate") {
        console.log(this);
        if (this._update.km && this._update.km < 0) {
            this._update.km = Math.abs(this._update.km);
        }
    }
    next();
});

carSchema.methods.correctPin = async function (incomingPin, correctPin) {
    return await bcrypt.compare(incomingPin, correctPin);
};

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
