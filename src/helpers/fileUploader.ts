import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

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

export const fileUploader = {
  upload,
  verificationFile,
  uploadMultiple,
  profilePhoto,
  coverPhoto,
};
