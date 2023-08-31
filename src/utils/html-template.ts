import { JSONFile } from "lowdb/node";
import { IHTMLTemplateData } from "../databases/types.js";
import { Low } from "lowdb";
import { v4 as uuidv4 } from "uuid";
import { HTMLTemplateV1 } from "../constants/html-templates.js";

const defaultData: IHTMLTemplateData = { templates: [] };
const adapter = new JSONFile<IHTMLTemplateData>("src/databases/templates.json");
const db = new Low<IHTMLTemplateData>(adapter, defaultData);

const addNewHTMLTemplate = async (html: string, variables: string[]) => {
    try {
        await db.read();
        db.data.templates.push({
            id: uuidv4(),
            content: html,
            variables: variables,
        });
    } catch (error) {
        console.log(error);
    }

    await db.write();
};

addNewHTMLTemplate(HTMLTemplateV1, [
    "contact_title",
    "contact_first_name",
    "contact_full_name",
    "company_name",
    "contact_email",
    "scan_qr_image",
]);
