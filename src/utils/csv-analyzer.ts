import * as fs from "fs";
import { parse } from "csv-parse";
import { ExhibitorData } from "../databases/exhibitor-sheet.js";
import sampleSize from "lodash/sampleSize.js";

type DataStructure = {
    showId: string;
    badgeId: string;
    title: string;
    fullName: string;
    companyName: string;
    wtf: string;
    phone: string;
    email: string;
};

const convertCSVToArray = (path: string) => {
    const fileContent = fs.readFileSync(path, { encoding: "utf-8" });

    const headers: Array<keyof DataStructure> = [
        "showId",
        "badgeId",
        "title",
        "fullName",
        "companyName",
        "wtf",
        "phone",
        "email",
    ];

    parse(
        fileContent,
        {
            delimiter: ",",
            columns: headers,
            fromLine: 2,
        },
        (error, results) => {
            if (error) return;

            fs.writeFile(
                "src/utils/test.json",
                JSON.stringify(results),
                error => {
                    console.log(error);
                },
            );
        },
    );
};

const getEmailConfirmUrl = (data: DataStructure[]) => {
    let results = "";

    const rootUrl =
        "https://port.rx-vietnamshows.com/api/get-html-template/92baaed6-cb19-404d-baf3-993106451fc5";

    const URL = "https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=";
    const URL2 = "&style=197&type=C128B&width=271&height=50&xres=1&font=3";

    for (const value of data) {
        const { title, fullName, companyName, email, badgeId } = value;

        let finalUrl = rootUrl + "?";
        finalUrl += "contact_title=" + encodeURIComponent(title);
        finalUrl += "&contact_first_name=" + encodeURIComponent(fullName);
        finalUrl += "&contact_full_name=" + encodeURIComponent(fullName);
        finalUrl += "&company_name=" + encodeURIComponent(companyName);
        finalUrl += "&contact_email=" + encodeURIComponent(email);
        finalUrl +=
            "&scan_qr_image=" + encodeURIComponent(URL + badgeId + URL2);

        results += finalUrl + "\n";
    }

    fs.writeFile("src/utils/email-confirm.txt", results, error => {
        if (error) console.log("error::", error);
    });
};

const getEmailRecommendUrl = (data: DataStructure[]) => {
    let results = "";

    const rootUrl =
        "https://port.rx-vietnamshows.com/api/get-html-template/77ce4008-0a4d-4231-8023-440974fe3981";

    const techs = ExhibitorData.reduce<string[]>((techProfiles, exhibitor) => {
        techProfiles.push(...exhibitor.ppsMachineTechnologyProfile);
        return techProfiles;
    }, []);

    const uniqueTechs = Array.from(new Set(techs));

    for (const value of data) {
        const { fullName } = value;

        let finalUrl = rootUrl + "?";
        finalUrl += "contact_first_name=" + encodeURIComponent(fullName);

        const random3Techs = sampleSize(uniqueTechs, 3);

        finalUrl +=
            "&recommendation_list=" +
            encodeURIComponent(random3Techs.join(","));

        results += finalUrl + "\n";
    }

    fs.writeFile("src/utils/email-recommend.txt", results, error => {
        if (error) console.log("error::", error);
    });
};

const getEncryptKeyUrl = (data: DataStructure[]) => {
    let results = "";

    const rootUrl = "https://port.rx-vietnamshows.com/api/emperia-encrypt";

    for (const value of data) {
        const { fullName, companyName, email, badgeId, phone, showId } = value;

        let finalUrl = rootUrl + "?";

        // {{showId}}|{{badgeId}}|{{firstName}}|{{lastName}}|{{position}}|{{company}}|{{email}}|{{phone}}
        const formattedData = [
            encodeURIComponent(showId),
            encodeURIComponent(badgeId),
            encodeURIComponent(fullName),
            encodeURIComponent(""),
            encodeURIComponent(""),
            encodeURIComponent(companyName),
            encodeURIComponent(email),
            encodeURIComponent(phone),
        ];

        finalUrl += "data=" + formattedData.join("|");
        results += finalUrl + "\n";
    }

    fs.writeFile("src/utils/encrypt-code.txt", results, error => {
        if (error) console.log("error::", error);
    });
};

const analyzeData = () => {
    const fileContent = fs.readFileSync(
        "/home/tranquocbao/Desktop/zoho-mail-html-template/src/utils/test.json",
        { encoding: "utf-8" },
    );

    const data: DataStructure[] = JSON.parse(fileContent) as DataStructure[];
    getEmailConfirmUrl(data);
    getEmailRecommendUrl(data);
    getEncryptKeyUrl(data);
};

convertCSVToArray("");
analyzeData();
