const { Worker } = require("bullmq");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { AppDataSource } = require("../config/database");
const { Parser } = require("json2csv");

const processedDir = path.join(__dirname, "../../processed");
const outputDir = path.join(__dirname, "../../output");

// Ensure directories exist
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Function to generate CSV
async function generateCSV(requestId) {
    console.log(`📄 Generating CSV for Request ID: ${requestId}`);

    const records = await AppDataSource.query(
        `SELECT request_id, product_name, input_url, output_url FROM images WHERE request_id = $1`,
        [requestId]
    );

    if (!records.length) {
        console.log(`⚠️ No records found for Request ID: ${requestId}`);
        return;
    }

    // Group records by product_name
    const groupedData = {};
    records.forEach(({ request_id, product_name, input_url, output_url }) => {
        if (!groupedData[product_name]) {
            groupedData[product_name] = { serial_number: Object.keys(groupedData).length + 1, product_name, input_urls: [], output_urls: [] };
        }
        groupedData[product_name].input_urls.push(input_url);
        groupedData[product_name].output_urls.push(output_url);
    });

    // Convert grouped data to array format
    const csvData = Object.values(groupedData).map(item => ({
        "Serial Number": item.serial_number,
        "Product Name": item.product_name,
        "Input Image Urls": item.input_urls.join(", "),
        "Output Image Urls": item.output_urls.join(", ")
    }));

    // Convert to CSV format
    const parser = new Parser();
    const csv = parser.parse(csvData);

    const csvPath = path.join(outputDir, `output-${requestId}.csv`);
    fs.writeFileSync(csvPath, csv);

    console.log(`✅ CSV saved: ${csvPath}`);
}

// BullMQ Worker
new Worker(
    "image-processing",
    async (job) => {
        const { requestId, product, inputUrl } = job.data;
        const outputPath = path.join(processedDir, `${product}-${Date.now()}.jpg`);

        try {
            console.log(`📥 Fetching image: ${inputUrl}`);

            // Fetch image from URL
            const response = await axios({ url: inputUrl, responseType: "arraybuffer" });
            const imageBuffer = Buffer.from(response.data);

            console.log(`🛠️ Processing image...`);
            fs.writeFileSync(outputPath, imageBuffer); // Simulated processing

            console.log(`✅ Image processed: ${outputPath}`);

            // Update database with output image URL
            await AppDataSource.query(
                `UPDATE images SET output_url = $1 WHERE input_url = $2 AND request_id = $3`,
                [outputPath, inputUrl, requestId]
            );

            // Check if all images for the request are processed
            const pending = await AppDataSource.query(
                `SELECT COUNT(*) FROM images WHERE request_id = $1 AND output_url IS NULL`,
                [requestId]
            );

            if (parseInt(pending[0].count) === 0) {
                await AppDataSource.query(`UPDATE requests SET status = 'completed' WHERE id = $1`, [
                    requestId,
                ]);
                console.log(`🎉 All images processed for Request ID: ${requestId}`);

                // Generate CSV
                await generateCSV(requestId);
            }
        } catch (error) {
            console.error(`❌ Error processing image: ${inputUrl}`, error);
            await AppDataSource.query(`UPDATE requests SET status = 'failed' WHERE id = $1`, [
                requestId,
            ]);
        }
    },
    {
        connection: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) },
    }
);
