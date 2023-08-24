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
