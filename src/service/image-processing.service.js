const { Worker } = require("bullmq");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { AppDataSource } = require("../config/database");
const { Parser } = require("json2csv");
const {triggerWebhook} =require('../service/webhook.trigger')

const processedDir = path.join(__dirname, "../../processed");
const outputDir = path.join(__dirname, "../../output");

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

// Ensure directories exist
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Function to generate CSV
async function generateCSV(requestId) {


    const records = await AppDataSource.query(
        `SELECT request_id, product_name, input_url, output_url FROM images WHERE request_id = $1`,
        [requestId]
    );

    if (!records.length) {
        console.log(`No records found for Request ID: ${requestId}`);
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

}
const fetchWithTimeout = (url, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`Timeout: Failed to fetch ${url} within ${timeout}ms`)), timeout);

        axios({ url, responseType: 'arraybuffer' })
            .then((response) => {
                clearTimeout(timer); // Clear timeout if successful
                resolve(response);
            })
            .catch((error) => {
                clearTimeout(timer); // Clear timeout if an error occurs
                reject(error);
            });
    });
};

// Add a map to track waiting clients
const waitingClients = new Map();

new Worker(
    "image-processing",
    async (job) => {
        const { requestId, product, inputUrl } = job.data;
        const outputPath = path.join(processedDir, `${product}-${Date.now()}.jpg`);
        await new Promise((resolve) => setTimeout(resolve, 20000));

        try {

            const response = await fetchWithTimeout(inputUrl, 5000); 
            const imageBuffer = Buffer.from(response.data);

            fs.writeFileSync(outputPath, imageBuffer);

            await AppDataSource.query(
                `UPDATE images SET output_url = $1 WHERE input_url = $2 AND request_id = $3`,
                [outputPath, inputUrl, requestId]
            );

            const pending = await AppDataSource.query(
                `SELECT COUNT(*) FROM images WHERE request_id = $1 AND output_url IS NULL`,
                [requestId]
            );

            if (parseInt(pending[0].count) === 0) {
                await AppDataSource.query(
                    `UPDATE requests SET status = 'completed' WHERE id = $1`, 
                    [requestId]
                );
                // Notify waiting clients
                if (waitingClients.has(requestId)) {
                    waitingClients.get(requestId).forEach(client => {
                        client.res.json({ requestId, status: 'completed' });
                    });
                    waitingClients.delete(requestId);
                }
                await triggerWebhook({ requestId, status: 'completed' });

                await generateCSV(requestId);
            }
        } catch (error) {
            console.error(`Error processing image: ${inputUrl}`, error);
            await AppDataSource.query(`UPDATE requests SET status = 'failed' WHERE id = $1`, [
                requestId,
            ]);
            // Notify waiting clients about failure
            if (waitingClients.has(requestId)) {
                waitingClients.get(requestId).forEach(client => {
                    client.res.json({ requestId, status: 'failed' });
                });
                waitingClients.delete(requestId);
            }
        }
    },
    {
        connection: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) },
    }
);
