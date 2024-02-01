const router = require("express").Router();
const globalControl = require("./_controllers/globalControl");
const carControl = require("./_controllers/carControl");
const adminControl = require("./_controllers/adminControl");
const serviceControl = require("./_controllers/serviceControl");

router.use(globalControl);
router.use("/cars", carControl);
router.use("/admin", adminControl);
router.use("/service", serviceControl);

module.exports = router;
