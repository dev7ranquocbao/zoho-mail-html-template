import express from "express";
import AES from "crypto-js/aes";
import { Secret_EncryptKey } from "../constants/encrypt";
import { logError } from "../utils/logger";

const router = express.Router();

router.get("", async (req, res) => {
    try {
        const data = req.query.data;

        if (typeof data !== "string") {
            res.status(200).send("");
            return;
        }

        const encrypted = AES.encrypt(data, Secret_EncryptKey);

        res.status(200).send(encrypted.toString());
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
