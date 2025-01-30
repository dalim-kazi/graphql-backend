"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// upload single image
const verificationFile = upload.single("verificationFile");
const profilePhoto = upload.single("profilePhoto");
const coverPhoto = upload.single("coverPhoto");
// upload multiple image
const uploadMultiple = upload.fields([
    { name: "galleryImages", maxCount: 10 },
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
]);
exports.fileUploader = {
    upload,
    verificationFile,
    uploadMultiple,
    profilePhoto,
    coverPhoto,
};
