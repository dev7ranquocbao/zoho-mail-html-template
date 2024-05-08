import express from "express";
import QRCode from "qrcode";
import { logError } from "../utils/logger.js";

const router = express.Router();
const invalidStr = "invalid_data";
const defaultSize = "250";

router.get("/qr-code", async (req, res) => {
    try {
        const query = req.query;
        const data = query.data?.toString() || invalidStr;
        const size = query.size?.toString() || defaultSize;

        let imgSrc = "";
        const qr = await QRCode.toDataURL(data, {
            type: "image/jpeg",
            width: Number.isNaN(Number(size)) ? 250 : Number(size),
            errorCorrectionLevel: "H",
        });
        imgSrc = `<image src="${qr}" />`;
        return res.send(imgSrc);
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
