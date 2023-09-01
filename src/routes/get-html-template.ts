import express from "express";
import { logError, logRequest } from "../utils/logger.js";
import { IHTMLTemplate } from "../databases/types.js";
import { makeHTMLTableBody } from "../utils/table-html.js";
import { v4 as uuidv4 } from "uuid";
import RecommendationModel, {
    TRecommendation,
} from "../mongodb-models/recommendation.js";
import { AccountIdKey, RecommendationKey } from "../constants/keys.js";
import { HtmlTemplateDb as mainDb, RcmDb } from "../databases/lowdb.js";

const router = express.Router();

const rcmDb = RcmDb;

interface ParsedQs {
    [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

const convertTemplate = (template: IHTMLTemplate, query: ParsedQs): string => {
    let cloned = template.content;

    template.variables.forEach(variable => {
        let value = query[variable];

        if (Array.isArray(value)) {
            const clonedValue = value;
            value = clonedValue[0];
        }

        if (typeof value !== "string") return;

        if (variable === RecommendationKey) {
            const keywords = value.split(",");
            const tbody = makeHTMLTableBody(keywords);

            const regex = new RegExp(`{{${RecommendationKey}}}`, "g");
            cloned = cloned.replace(regex, tbody);
            return;
        }

        const regex = new RegExp(`{{${variable}}}`, "g");
        cloned = cloned.replace(regex, value);
    });

    return cloned;
};

const saveRcmData = async (data: TRecommendation) => {
    try {
        const rcm = new RecommendationModel(data);
        await rcm.save();

        await rcmDb.read();
        rcmDb.data.data.push({ id: uuidv4(), ...data });
        await rcmDb.write();
    } catch (error) {
        logError(`Backup failed ${error}`);
    }
};

router.get("/:id", async (req, res) => {
    try {
        await mainDb.read();
        logRequest(req);

        const templateId = req.params.id;
        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === templateId;
        });

        if (!template) {
            res.status(200).json({ data: "" });
            return;
        }

        const cloned = convertTemplate(template, query);

        if (
            typeof query[RecommendationKey] === "string" &&
            typeof query[AccountIdKey] === "string"
        ) {
            await saveRcmData({
                accountId: query[AccountIdKey],
                htmlContent: cloned,
                templateId: templateId,
            });
        }

        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/:id/preview", async (req, res) => {
    try {
        await mainDb.read();
        logRequest(req);

        const templateId = req.params.id;
        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === templateId;
        });

        if (!template) {
            res.status(200).send("");
            return;
        }

        const cloned = convertTemplate(template, query);
        res.status(200).send(cloned);
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
