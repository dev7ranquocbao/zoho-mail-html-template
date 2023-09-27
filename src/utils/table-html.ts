import intersectionBy from "lodash/intersectionBy.js";
import sampleSize from "lodash/sampleSize.js";
import { ExhibitorData } from "../databases/exhibitor-sheet.js";
import { ExhibitorDataMXV } from "../databases/exhibitor-sheet-mxv.js";
import { MXVDataStructureRCM } from "../databases/types.js";

export const makeHTMLTableBody = (keywords: string[]) => {
    const collectData = ExhibitorData.filter(exhibitor => {
        const intersect = intersectionBy(
            exhibitor.ppsMachineTechnologyProfile,
            keywords,
        );

        return intersect.length > 0;
    });

    let randomExhibitors = sampleSize(collectData, 10);

    if (randomExhibitors.length < 10) {
        randomExhibitors = sampleSize(ExhibitorData, 10);
    }

    let trs = "";

    randomExhibitors.forEach((exhibitor, index) => {
        const { companyName, stands } = exhibitor;

        trs += `<tr>
            <td>${index + 1}</td>
            <td>${companyName}</td>
            <td>${stands}</td>
        </tr>`;
    });

    return `<tbody>${trs}</tbody>`;
};

export const makeHTMLTableBodyMXV2023 = (
    showId: MXVDataStructureRCM["ShowId"],
    keywords: string[],
) => {
    const filteredData = ExhibitorDataMXV.filter(exhibitor => {
        return exhibitor.ShowId === showId;
    });

    const collectData = filteredData.filter(exhibitor => {
        const intersect = intersectionBy(
            exhibitor.PPSMachineTechnologyProfile,
            keywords,
        );

        return intersect.length > 0;
    });

    let randomExhibitors = sampleSize(collectData, 10);

    if (randomExhibitors.length < 10) {
        randomExhibitors = sampleSize(filteredData, 10);
    }

    let trs = "";

    randomExhibitors.forEach((exhibitor, index) => {
        const { CompanyName, Stands } = exhibitor;

        trs += `<tr>
            <td>${index + 1}</td>
            <td>${CompanyName}</td>
            <td>${Stands}</td>
        </tr>`;
    });

    return `<tbody>${trs}</tbody>`;
};
