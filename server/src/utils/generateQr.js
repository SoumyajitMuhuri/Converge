import QRCode from "qrcode";
import { toFile } from "@imagekit/nodejs";
import imagekit from "../config/imagekit.js";

export const generateQr = async (shortUrl, shortCode) => {
  const qrBuffer = await QRCode.toBuffer(shortUrl, {
    type: "png",
    width: 500,
    margin: 2,
    errorCorrectionLevel: "M",
  });

  const uploadedImage = await imagekit.files.upload({
    file: await toFile(qrBuffer, `converge-${shortCode}.png`),
    fileName: `converge-${shortCode}.png`,
    folder: "/converge/qr-codes",
    useUniqueFileName: false,
  });

  return uploadedImage.url;
};