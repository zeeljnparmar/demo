const express = require("express");
const { uploadCSV, upload } = require("../controller/upload.controller");
const { getStatus } = require("../controller/status.controller");
const {handleWebhook}=require(`../controller/webhook.controller`)

const router = express.Router();

router.post("/upload", upload.single("file"), uploadCSV);
router.get("/status", getStatus);
router.post("/webhook", handleWebhook);


module.exports = router;
