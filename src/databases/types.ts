import { TQRCode } from "../mongodb-models/qrcode.js";
import { TRecommendation } from "../mongodb-models/recommendation.js";

export interface IHTMLTemplate {
    id: string;
    content: string;
    variables: string[];
}

export interface IHTMLTemplateData {
    templates: IHTMLTemplate[];
}

export interface IExhibitorInfo {
    id: string;
    companyName: string;
    displayName: string;
    ppsIndustryProfile: string[];
    ppsCompanyActivity: string[];
    ppsMachineTechnologyProfile: string[];
    stands: string;
}

export interface ILowdbData<T> {
    data: T[];
}

export interface IRcmData extends TRecommendation {
    id: string;
}

export interface IQrData extends TQRCode {
    id: string;
}

export interface ParsedQs {
    [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}
