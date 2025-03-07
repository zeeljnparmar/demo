const express = require("express");
const { uploadCSV, upload } = require("../controller/upload.controller");
const { getStatus } = require("../controller/status.controller");

const router = express.Router();


//? This is for task 1
router.post("/upload", upload.single("file"), uploadCSV);
router.get("/status", getStatus);

//? This is for task 2

module.exports = router;
