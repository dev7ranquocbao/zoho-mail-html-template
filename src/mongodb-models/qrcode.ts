import mongoose from "mongoose";

export type TQRCode = {
    accountId: string;
    htmlContent: string;
    createdAt?: Date;
};

const QrCodeSchema = new mongoose.Schema<TQRCode>({
    accountId: String,
    htmlContent: String,
    createdAt: { type: Date, default: Date.now },
});

const QrCodeModel = mongoose.model("qr-code-list", QrCodeSchema);
export default QrCodeModel;
