import CryptoJS from "crypto-js";

export const convertToString = <T>(value: T): string => {
    return typeof value === "string" ? value : "";
};

export const execute = (
    type: "encrypt" | "decrypt",
    message: string,
    secret: string,
): string => {
    switch (type) {
        case "encrypt": {
            const passphrase = CryptoJS.enc.Base64.parse(secret).toString(
                CryptoJS.enc.Utf8,
            );

            const encrypted = CryptoJS.AES.encrypt(message, passphrase);
            const cipherText = encrypted.toString();

            return cipherText;
        }

        case "decrypt": {
            const passphrase = CryptoJS.enc.Base64.parse(secret).toString(
                CryptoJS.enc.Utf8,
            );

            const decrypted = CryptoJS.AES.decrypt(message, passphrase);
            const plainText = decrypted.toString(CryptoJS.enc.Utf8);

            return plainText;
        }

        default:
            return "bad encrypt";
    }
};
