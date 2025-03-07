const { AppDataSource } = require("../config/database");

const getStatus = async (req, res) => {
    const requestId = req.body.id;
  
    const request = await AppDataSource.query(`SELECT * FROM requests WHERE id = $1`, [requestId]);

    if (!request.length) return res.status(404).json({ error: "Request not found" });

    const images = await AppDataSource.query(`
            select * from requests 
            inner join images on requests.id = images.request_id
            where requests.id = $1
        `,[requestId]);

    res.json({ requestId, status: request[0].status, images });
};

module.exports = { getStatus };
