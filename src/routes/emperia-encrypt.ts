import express from "express";
import { Secret_EncryptKey } from "../constants/encrypt.js";
import CryptoJS from "crypto-js";
import { logError, logRequest } from "../utils/logger.js";
import { QrDb } from "../databases/lowdb.js";
import QrCodeModel, { TQRCode } from "../mongodb-models/qrcode.js";
import { v4 as uuidv4 } from "uuid";
import { AccountIdKey } from "../constants/keys.js";

const router = express.Router();
const qrDb = QrDb;

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

const saveQrData = async (data: TQRCode) => {
    try {
        const qr = new QrCodeModel(data);
        await qr.save();

        await qrDb.read();
        qrDb.data.data.push({ id: uuidv4(), ...data });
        await qrDb.write();
    } catch (error) {
        logError(`Backup failed ${error}`);
    }
};

router.get("", async (req, res) => {
    try {
        const query = req.query;
        const data = query.data;

        logRequest(req);

        if (typeof data !== "string") {
            res.status(200).json({ data: "" });
            return;
        }

        const result = execute("encrypt", data, Secret_EncryptKey);

        if (typeof query[AccountIdKey] === "string") {
            await saveQrData({
                accountId: query[AccountIdKey],
                htmlContent: result,
            });
        }

        res.status(200).json({ data: result });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
