import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import getTemplateLocalRoute from "./routes/get-template-local.js";
import emperiaEncryptRoute from "./routes/emperia-encrypt.js";
import getHtmlTemplateRoute from "./routes/get-html-template.js";
import mongodb from "./databases/mongodb.js";

dotenv.config();

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/get-template-local", getTemplateLocalRoute);
app.use("/api/emperia-encrypt", emperiaEncryptRoute);
app.use("/api/get-html-template", getHtmlTemplateRoute);

app.get("/api", (_, res) => {
    res.status(200).json({ data: "Welcome 7!" });
});

mongodb.once("open", () => {
    console.log("Connected to MongoDB!");
});
