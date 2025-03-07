const { v4: uuidv4 } = require("uuid");
const { AppDataSource } = require("../config/database");
const { Queue } = require("bullmq");

const imageQueue = new Queue("image-processing", {
    connection: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) },
});

const processCSV = async (csvContent) => {
    const requestId = uuidv4();
    const queryRunner = AppDataSource.createQueryRunner();

    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();

        // Insert into requests table using raw SQL (lowercase column names)
        await queryRunner.query(`INSERT INTO requests (id, status) VALUES ($1, $2)`, [
            requestId,
            "processing",
        ]);

        const rows = csvContent.split("\n").slice(1); // Skip header
        for (const row of rows) {
            if (!row) continue;
            const [serial, product, ...urls] = row.split(",");

            for (const url of urls) {
                const inputUrl = url.trim();

                // Insert into images table using TypeORM's getRepository (lowercase columns)
                await AppDataSource.getRepository("Image").save({
                    product_name: product,  // Lowercase
                    input_url: inputUrl,  // Lowercase
                    request_id: requestId,  // Lowercase
                });

                // Add to BullMQ queue for processing
                await imageQueue.add("compress", { requestId, product, inputUrl });
            }
        }

        await queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error processing CSV:", error);
        throw new Error("Failed to process CSV");
    } finally {
        await queryRunner.release();
    }

    return requestId;
};

module.exports = { processCSV };
