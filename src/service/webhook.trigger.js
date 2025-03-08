const axios = require("axios");

const triggerWebhook = async (data) => {
    try {
        const webhookUrl = process.env.WEBHOOK_URL;
        if (!webhookUrl) {
            console.warn("Webhook URL is not defined in .env file");
            return;
        }

        await axios.post(webhookUrl, data);
        console.log(`Webhook triggered successfully for Request ID: ${data.requestId}`);
    } catch (error) {
        console.error(`Failed to trigger webhook for Request ID: ${data.requestId}`, error);
    }
};

module.exports = { triggerWebhook };
