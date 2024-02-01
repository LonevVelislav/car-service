const router = require("express").Router();
const Service = require("../_models/Service");

const { extractErrorMsg } = require("../utils/errorHandler");
const { protect } = require("../_middlewares/authMiddleware");

router.get("/", protect, async (req, res) => {
    try {
        const services = await Service.find().populate("car", ["number", "model"]);
        res.status(200).json({
            status: "success",
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

router.get("/:id", protect, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate("car");

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

router.patch("/:id", protect, async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(201).json({
            status: "success",
            data: {
                updatedService,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
});

router.post("/:carId", async (req, res) => {
    try {
        const service = await Service.create({
            ...req.body,
            car: req.params.carId,
        });
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

module.exports = router;
