const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const app = express();

app.use(cors());

require("dotenv").config();
const PORT = process.env.PORT;
const server = http.createServer(app);
const router = require("./router");
app.use(express.json());

mongoose
    .connect(process.env.DB)
    .then(async () => {
        console.log("DB connected!");
    })
    .catch((err) => console.log("DB failed to connect!"));

app.use("/car-service", router);
app.use("*", (req, res) => {
    res.redirect("/404");
});

server.listen(PORT, () => console.log(`app is running on port: ${PORT}`));
