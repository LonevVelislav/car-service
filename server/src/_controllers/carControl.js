const router = require("express").Router();
const Car = require("../_models/Car");

const { extractErrorMsg } = require("../utils/errorHandler");
const { protect, carProtect } = require("../_middlewares/authMiddleware");
const { filterObjectFields } = require("../utils/filterObjectFields");
const { createAndSendToken } = require("../utils/userToken");

class CarFeatures {
    constructor(query, queryString) {
        (this.query = query), (this.queryString = queryString);
    }

    filter() {
        const queryCopy = { ...this.queryString };
        const fields = ["page", "sort", "limit", "fields"];

        fields.forEach((el) => {
            delete queryCopy[el];
        });

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            this.query = this.query.sort(this.queryString.sort);
        }
        return this;
    }

    filterFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    searchByNumber() {
        if (this.queryString.number) {
            const carNumber = this.queryString.number;
            const regex = new RegExp(carNumber, "i");
            this.query = this.query.find({ number: regex });
        }
        return this;
    }
}

router.get("/", protect, async (req, res) => {
    try {
        const features = new CarFeatures(Car.find(), req.query)
            .filter()
            .sort()
            .filterFields()
            .paginate()
            .searchByNumber();

        const cars = await features.query;

        res.status(200).json({
            status: "success",
            results: cars.length,
            data: {
                cars,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.get("/:id", carProtect, async (req, res) => {
    try {
        const features = new CarFeatures(Car.findById(req.params.id), req.query).filterFields();

        const car = await features.query;
        res.status(200).json({
            status: "success",
            data: {
                car,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        const newCar = await Car.create(req.body);

        createAndSendToken(newCar, 200, res);
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { number, pin } = req.body;
        if (!number || !pin) {
            throw new Error("Provide registration number and pin!");
        }
        const car = await Car.findOne({ number }).select("+pin");
        if (!car || !(await car.correctPin(pin, car.pin))) {
            throw new Error("Incorrect pin!");
        }
        createAndSendToken(car, 200, res);
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.patch("/:id", carProtect, async (req, res) => {
    try {
        const filteredObject = filterObjectFields(req.body, "number", "pin");
        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            {
                ...filteredObject,
            },
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(201).json({
            status: "success",
            data: {
                updatedCar,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

module.exports = router;
