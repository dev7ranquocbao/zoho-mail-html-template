import express from "express";
import { logError } from "../utils/logger.js";
import { IHTMLTemplate, IHTMLTemplateData } from "../databases/types.js";
import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import { SpecialKey } from "../databases/exhibitor-sheet.js";
import { makeHTMLTableBody } from "../utils/table-html.js";

const router = express.Router();

const defaultData: IHTMLTemplateData = { templates: [] };
const adapter = new JSONFile<IHTMLTemplateData>("src/databases/templates.json");
const db = new Low<IHTMLTemplateData>(adapter, defaultData);

interface ParsedQs {
    [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

const convertTemplate = (template: IHTMLTemplate, query: ParsedQs): string => {
    let cloned = template.content;

    template.variables.forEach(variable => {
        const value = query[variable];
        if (typeof value !== "string") return;

        if (variable === SpecialKey) {
            const keywords = value.split(",");
            const tbody = makeHTMLTableBody(keywords);

            const regex = new RegExp(`{{${SpecialKey}}}`, "g");
            cloned = cloned.replace(regex, tbody);
            return;
        }

        const regex = new RegExp(`{{${variable}}}`, "g");
        cloned = cloned.replace(regex, value);
    });

    return cloned;
};

router.get("/:id", async (req, res) => {
    try {
        await db.read();

        const templateId = req.params.id;
        const query = req.query;

        const template = db.data.templates.find(tpl => {
            return tpl.id === templateId;
        });

        if (!template) {
            res.status(200).json({ data: "" });
            return;
        }

        const cloned = convertTemplate(template, query);
        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/:id/preview", async (req, res) => {
    try {
        await db.read();

        const templateId = req.params.id;
        const query = req.query;

        const template = db.data.templates.find(tpl => {
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
