import express from "express";
import { Secret_EncryptKey } from "../constants/encrypt";
import CryptoJS from "crypto-js";
import { logError } from "../utils/logger";

const router = express.Router();

const execute = (
    type: "encrypt" | "decrypt",
    message: string,
    secret: string,
): string => {
    switch (type) {
        case "encrypt": {
            const passphrase = CryptoJS.enc.Base64.parse(secret).toString(
                CryptoJS.enc.Utf8,
            );

            const encrypted = CryptoJS.AES.encrypt(message, passphrase);
            const cipherText = encrypted.toString();

            return cipherText;
        }

        case "decrypt": {
            const passphrase = CryptoJS.enc.Base64.parse(secret).toString(
                CryptoJS.enc.Utf8,
            );

            const decrypted = CryptoJS.AES.decrypt(message, passphrase);
            const plainText = decrypted.toString(CryptoJS.enc.Utf8);

            return plainText;
        }

        default:
            return "bad encrypt";
    }
};

router.get("", async (req, res) => {
    try {
        const data = req.query.data;

        if (typeof data !== "string") {
            res.status(200).json({ data: "" });
            return;
        }

        const result = execute("encrypt", data, Secret_EncryptKey);
        res.status(200).json({ data: result });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
