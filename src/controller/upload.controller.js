const multer = require("multer");
const fs = require("fs");
const { processCSV } = require("../service/upload.service");

const upload = multer({ dest: "uploads/" });

const uploadCSV = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "CSV file required" });

    const csvContent = fs.readFileSync(req.file.path, "utf8");
    const requestId = await processCSV(csvContent);

    res.json({ requestId, message: "CSV uploaded. Processing started." });
};

module.exports = { uploadCSV, upload };
