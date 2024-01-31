const router = require("express").Router();
const Car = require("../_models/Car");

const { extractErrorMsg } = require("../utils/errorHandler");
const { protect } = require("../_middlewares/authMiddleware");

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
            const sortBy = this.queryString.sort.slit(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
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
        const limit = this.queryString.limi * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

router.get("/", protect, async (req, res) => {
    try {
        const features = new CarFeatures(Car.find(), req.query)
            .filter()
            .sort()
            .filterFields()
            .paginate();

        const cars = await features.query;

        res.status(200).json({
            status: "success",
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

router.post("/", async (req, res) => {
    try {
        const newCar = await Car.create({
            ...req.body,
        });

        res.status(200).json({
            status: "success",
            data: {
                newCar,
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
