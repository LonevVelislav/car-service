const router = require("express").Router();
const globalControl = require("./_controllers/globalControl");

router.use(globalControl);

module.exports = router;
