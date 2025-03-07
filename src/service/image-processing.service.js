const { Worker } = require("bullmq");
const { Image } = require("image-js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { AppDataSource } = require("../config/database");

const processedDir = path.join(__dirname, "../../processed");

// Ensure the processed directory exists before saving images
if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
}

new Worker(
    "image-processing",
    async (job) => {
        const { requestId, product, inputUrl } = job.data;
        const outputPath = path.join(processedDir, `${product}-${Date.now()}.jpg`);

        try {
            
            if (!AppDataSource.isInitialized) {
                console.log("🔄 Initializing database connection...");
                await AppDataSource.initialize();
            }

            // Fetch image from URL
            const response = await axios({ url: inputUrl, responseType: "arraybuffer" });
            const imageBuffer = Buffer.from(response.data);
            const image = await Image.load(imageBuffer);
            // Compress by reducing quality to 50%
            const compressedImage = image.toBuffer("image/jpeg", { quality: 50 });

            fs.writeFileSync(outputPath, compressedImage);
            // Update database with the processed image URL
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
