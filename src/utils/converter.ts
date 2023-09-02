export const convertToString = <T>(value: T): string => {
    return typeof value === "string" ? value : "";
};
