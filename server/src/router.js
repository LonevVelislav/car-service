const router = require("express").Router();
const globalControl = require("./_controllers/globalControl");
const carControl = require("./_controllers/carControl");
const adminControl = require("./_controllers/adminControl");

router.use(globalControl);
router.use("/cars", carControl);
router.use("/admin", adminControl);

module.exports = router;
