import express from "express";
import { logError, logRequest } from "../utils/logger.js";
import { HtmlTemplateDb as mainDb } from "../databases/lowdb.js";
import { BadgeIdKey, RecommendationKey, ShowIdKey } from "../constants/keys.js";
import { saveRcmData } from "../utils/data-saver.js";
import { makeHTMLTableBodyMXV2023 } from "../utils/table-html.js";
import { IHTMLTemplate, ParsedQs } from "../databases/types.js";

const router = express.Router();

const _convertRCMTemplate = (
    template: IHTMLTemplate,
    query: ParsedQs,
): string => {
    let cloned = template.content;

    template.variables.forEach(variable => {
        let value = query[variable];

        if (Array.isArray(value)) {
            const clonedValue = value;
            value = clonedValue[0];
        }

        if (typeof value !== "string") return;

        if (variable === RecommendationKey) {
            return;
        }

        const regex = new RegExp(`{{${variable}}}`, "g");
        cloned = cloned.replace(regex, value);
    });

    const rcmVariables = query[RecommendationKey];
    const showId = query[ShowIdKey];

    const keywords =
        typeof rcmVariables === "string" ? rcmVariables.split(",") : [];

    const tbody = makeHTMLTableBodyMXV2023(
        showId === "MXV23" ? "MXV23" : "NEVHCM23",
        keywords,
    );

    const regex = new RegExp(`{{${RecommendationKey}}}`, "g");
    cloned = cloned.replace(regex, tbody);

    return cloned;
};

router.get("/mxv-recommendation-list", async (req, res) => {
    try {
        await mainDb.read();
        logRequest(req);

        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "mxv-rcm-list";
        });

        if (!template) {
            res.status(200).json({ data: "" });
            return;
        }

        const cloned = _convertRCMTemplate(template, query);

        if (typeof query[BadgeIdKey] === "string") {
            await saveRcmData({
                accountId: query[BadgeIdKey],
                htmlContent: cloned,
                templateId: "mxv-rcm-list",
            });
        }

        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/mxv-recommendation-list/preview", async (req, res) => {
    try {
        await mainDb.read();

        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "mxv-rcm-list";
        });

        if (!template) {
            res.status(200).send("");
            return;
        }

        const cloned = _convertRCMTemplate(template, query);
        res.status(200).send(cloned);
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/mxv/ghm", async (_, res) => {
    res.send(`<svg
    version="1.1"
    id="svg2"
    height="20px"
    viewBox="0 0 607.44 125.98667"
    sodipodi:docname="GHM GROUP_Logo_4c_ohne_slogan.eps"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
>
    <defs id="defs6" />
    <sodipodi:namedview
        id="namedview4"
        pagecolor="#ffffff"
        bordercolor="#000000"
        borderopacity="0.25"
        inkscape:showpageshadow="2"
        inkscape:pageopacity="0.0"
        inkscape:pagecheckerboard="0"
        inkscape:deskcolor="#d1d1d1"
    />
    <g
        id="g8"
        inkscape:groupmode="layer"
        inkscape:label="ink_ext_XXXXXX"
        transform="matrix(1.3333333,0,0,-1.3333333,0,125.98667)"
    >
        <g
            id="g10"
            transform="scale(0.1)"
        >
            <path
                d="m 2543.4,117.91 v 712 h -102 l -137,-373.996 -137.99,373.996 h -101 v -712 h 112 v 439.004 l 95,-287.004 h 61.99 l 97.01,292.004 V 117.91 Z m -577.98,0 v 712 h -112 v -300 h -139 v 300 h -111.99 v -712 h 111.99 v 312 h 139 v -312 z m -444.99,190 v 197 h -181.99 v -92 h 70 V 301.914 c 0,-49.004 -22,-91 -70,-91 -27,0 -43.01,11 -53.01,26.996 -21,34.004 -25,106 -25,236 0,130 4,202.004 25,236 10,16.004 26.01,27.004 53.01,27.004 60,0 69,-56 70,-96 h 111.99 c -1.99,61 -20,112.996 -55,148.996 -30,30 -71.99,48 -126.99,48 -68.01,0 -108.01,-25.996 -138.01,-60 -52.99,-60 -51.99,-164 -51.99,-304 0,-140 -1,-244 51.99,-304 30,-33.996 70,-60 138.01,-60 105.99,0 181.99,69 181.99,198"
                style="
                    fill: #4c5963;
                    fill-opacity: 1;
                    fill-rule: nonzero;
                    stroke: none;
                "
                id="path12"
            />
            <path
                d="m 4496.84,622.91 c 0,-93 -21.99,-145 -93,-145 h -83 v 291 h 83 c 71.01,0 93,-52.996 93,-146 m 59,1 c 0,167.004 -69,198.004 -154,198.004 h -140 V 109.91 h 59 v 315 h 81 c 101.01,0 154,49 154,199 m -403.99,-366 v 564.004 h -58.99 V 252.91 c 0,-60.996 -39.01,-98 -88,-98 -49.01,0 -89.01,37.004 -89.01,98 v 569.004 h -59 V 257.91 c 0,-50 17,-89 43.01,-115 28,-26.996 65,-40.996 105,-40.996 40,0 76.99,14 105,40.996 25.99,26 41.99,65 41.99,115 m -448.98,208.004 c 0,-209 -5,-250 -34.01,-285 -13.99,-16.004 -35,-26.004 -63.99,-26.004 -29.01,0 -49.01,10 -63.01,26.004 -28.99,35 -33.99,76 -33.99,285 0,208.996 5,250 33.99,285 14,16 34,26 63.01,26 28.99,0 50,-10 63.99,-26 29.01,-35 34.01,-76.004 34.01,-285 m 58.99,0 c 0,217.996 -5,273.996 -50,321.996 -23.99,26 -61,42 -106.99,42 -46.01,0 -82,-16 -106.01,-42 -45,-48 -50,-104 -50,-321.996 0,-218.004 5,-274 50,-322.004 24.01,-26 60,-41.996 106.01,-41.996 45.99,0 83,15.996 106.99,41.996 45,48.004 50,104 50,322.004 M 3286.87,624.91 c 0,-92 -21.99,-142.996 -93,-142.996 h -83 V 768.91 h 83 c 71.01,0 93,-51.996 93,-144 m 82,-515 -110.99,330 c 58.99,22.004 87.99,75 87.99,185 0,166.004 -67.99,197.004 -154,197.004 h -140 V 109.91 h 59 v 319 h 92.01 l 102.99,-319 z m -419.99,152.004 v 225 h -148 v -50 h 89.01 v -175 c 0,-67.004 -38.01,-107.004 -89.01,-107.004 -29,0 -49,10 -62.99,26.004 -29.01,35 -34.01,76 -34.01,285 0,208.996 5,250 34.01,285 13.99,16 33.99,26 62.99,26 72.01,0 89.01,-61 89.01,-118.004 h 58.99 c 0,54 -15,101 -45,132.004 -23.99,23.996 -57,38.996 -103,38.996 -45.99,0 -82,-16 -105.99,-42 -45,-48 -50,-104 -50,-321.996 0,-218.004 5,-274 50,-322.004 23.99,-26 60,-41.996 105.99,-41.996 79.01,0 148,54 148,160"
                style="
                    fill: #4c5963;
                    fill-opacity: 1;
                    fill-rule: nonzero;
                    stroke: none;
                "
                id="path14"
            />
            <path
                d="m 322.68,798.609 c 76.523,35.477 162.179,43.036 244.511,20.969 92.754,-24.851 170.176,-84.297 218.02,-167.39 26.234,-45.567 41.824,-95.258 46.449,-146.137 l 113.223,0.359 C 940.09,575.484 919.961,644.547 883.105,708.551 758.453,925.074 487.82,1005.2 266.152,896.785 l 56.528,-98.176"
                style="
                    fill: #ef2e32;
                    fill-opacity: 1;
                    fill-rule: nonzero;
                    stroke: none;
                "
                id="path16"
            />
            <path
                d="M 831.617,441.109 C 829.719,420.531 826.023,399.961 820.508,379.59 795.414,286.816 735.641,209.242 652.207,161.199 568.77,113.16 471.676,100.414 378.828,125.301 c -19.594,5.242 -38.5,12.058 -56.586,20.293 -19.57,-34.813 -38.551,-68.5432 -55.508,-98.6643 135.961,-65.4024 300.993,-64.707 441.825,16.3867 142.179,81.8516 225.882,226.1716 236.336,378.1526 l -113.278,-0.36"
                style="
                    fill: #176fc1;
                    fill-opacity: 1;
                    fill-rule: nonzero;
                    stroke: none;
                "
                id="path18"
            />
            <path
                d="m 265.824,177.75 c -42.539,29.715 -78.375,68.66 -105.011,114.941 -47.848,83.086 -60.379,179.887 -35.309,272.59 22.25,82.278 71.801,152.559 140.902,200.918 l -56.527,98.196 C 4.82422,727.109 -61.7539,452.84 62.9102,236.316 100.527,170.984 151.449,118.09 210.297,79.0195 228.66,111.66 247.383,144.941 265.824,177.75"
                style="
                    fill: #35af3f;
                    fill-opacity: 1;
                    fill-rule: nonzero;
                    stroke: none;
                "
                id="path20"
            />
        </g>
    </g>
</svg>`);
});

export default router;
