const router = require("express").Router();
const Service = require("../_models/Service");

const { extractErrorMsg } = require("../utils/errorHandler");
const { protect, carProtect } = require("../_middlewares/authMiddleware");

class ServiceFeatures {
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
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

router.get("/car/:id", carProtect, async (req, res) => {
    try {
        const features = new ServiceFeatures(Service.find({ car: req.params.id }), req.query)
            .filter()
            .sort()
            .filterFields()
            .paginate();

        const services = await features.query;

        res.status(200).json({
            status: "success",
            results: services.length,
            data: {
                services,
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
        const service = await Service.findById(req.params.id).select([
            "-createdAt",
            "-type",
            "-car",
            "-km",
            "-__v",
        ]);

        res.status(200).json({
            status: "success",
            data: {
                service,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.post("/:id", carProtect, async (req, res) => {
    try {
        if (req.body.km) {
            if (req.body.km > req.car.km) {
                throw new Error("Car mileage is higher then given input!");
            }
        }
        const newService = await Service.create({
            ...req.body,
            car: req.params.id,
        });
        res.status(200).json({
            status: "success",
            data: {
                newService,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.patch("/:id", carProtect, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        service.parts.push(req.body.part);

        await service.save();

        res.status(201).json({
            status: "success",
            data: {
                service,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.delete("/:id", carProtect, async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

module.exports = router;
