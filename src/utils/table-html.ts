import intersectionBy from "lodash/intersectionBy.js";
import sampleSize from "lodash/sampleSize.js";
import { ExhibitorData } from "../databases/exhibitor-sheet.js";

export const makeHTMLTableBody = (keywords: string[]) => {
    const collectData = ExhibitorData.filter(exhibitor => {
        const intersect = intersectionBy(
            exhibitor.ppsMachineTechnologyProfile,
            keywords,
        );

        return intersect.length > 0;
    });

    const randomExhibitors = sampleSize(collectData, 10);

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
