const handleWebhook = async (req, res) => {
    const { requestId, status } = req.body;

    console.log(`Webhook received - Request ID: ${requestId}, Status: ${status}`);

    res.status(200).json({ message: "Webhook received successfully" });
};

module.exports = { handleWebhook };
