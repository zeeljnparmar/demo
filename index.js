const express = require("express");
const { AppDataSource } = require("./src/config/database");
const routes = require("./src/routes/routes");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api", routes);

AppDataSource.initialize().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
