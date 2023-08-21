import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import getTemplateLocalRoute from "./routes/get-template-local";
import emperiaEncryptRoute from "./routes/emperia-encrypt";

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

app.get("/api", (_, res) => {
    res.status(200).json({ data: "Welcome 7!" });
});
