const router = require("express").Router();
const globalControl = require("./_controllers/globalControl");
const carControl = require("./_controllers/carControl");
const adminControl = require("./_controllers/adminControl");
const callControl = require("./_controllers/callControl");

router.use(globalControl);
router.use("/cars", carControl);
router.use("/admin", adminControl);
router.use("/calls", callControl);

module.exports = router;
