const express = require("express");

const router = express.Router();


// init routes
router.use("/api/v1/auth", require("./auth"));


module.exports = router;