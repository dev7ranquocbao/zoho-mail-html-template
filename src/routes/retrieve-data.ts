import express from "express";
import { QrDb, RcmDb } from "../databases/lowdb.js";
import QrCodeModel from "../mongodb-models/qrcode.js";
import { logError } from "../utils/logger.js";
import findLast from "lodash/findLast.js";
import RecommendationModel from "../mongodb-models/recommendation.js";

const router = express.Router();
const qrDb = QrDb;
const rcmDb = RcmDb;

router.get("/rcm/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const data = await RecommendationModel.findOne({ accountId: id })
            .sort({ createdAt: -1 })
            .exec();

        const content = data?.htmlContent;

        if (!content) {
            logError("Mongodb find failed:::" + id);
            throw new Error("Mongodb find failed");
        }

        res.render("rcm", { content });
    } catch (error) {
        await rcmDb.read();

        const data = findLast(rcmDb.data.data, value => {
            return value.accountId === id;
        });

        const content = data?.htmlContent || "";
        res.render("rcm", { content });
    }
});

router.get("/qr/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const data = await QrCodeModel.findOne({ accountId: id })
            .sort({ createdAt: -1 })
            .exec();

        const content = data?.htmlContent;

        if (!content) {
            logError("Mongodb find failed:::" + id);
            throw new Error("Mongodb find failed");
        }

        res.render("qr", { url: encodeURIComponent(content) });
    } catch (error) {
        await qrDb.read();

        const data = findLast(qrDb.data.data, value => {
            return value.accountId === id;
        });

        const content = data?.htmlContent || "";
        res.render("qr", { url: encodeURIComponent(content) });
    }
});

export default router;
