const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
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
            mileage: Number,
            information: String,
        },

        airConditioning: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },

        breaks: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },

        clutches: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        engine: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        exhaust: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        suspension: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        tyres: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        fuelSystem: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        battery: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        gearbox: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        cambelts: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        oilChange: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },

        coolingSystem: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },
        crashRepear: {
            mileage: {
                type: Number,
                default: 10000,
            },
            repears: [
                {
                    information: String,
                    date: {
                        type: Date,
                        default: Date.now(),
                    },
                },
            ],
        },

        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
