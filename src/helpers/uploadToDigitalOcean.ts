import { S3Client, S3ClientConfig, ObjectCannedACL } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import path from "path";

// DigitalOcean Spaces Configuration
const DO_CONFIG = {
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "nyc3",
  credentials: {
    accessKeyId: "DO002RGDJ947DJHJ9WDT",
    secretAccessKey: "e5+/pko6Ojar51Hb8ojUKfq2HtXy+tnGKOfs3rIcEfo",
  },
  spaceName: "smtech-space",
};

// Configure the S3 client for DigitalOcean Spaces
const s3Config: S3ClientConfig = {
  endpoint: DO_CONFIG.endpoint,
  region: DO_CONFIG.region,
  credentials: DO_CONFIG.credentials,
  forcePathStyle: true, // Required for DigitalOcean Spaces
};

const s3 = new S3Client(s3Config);

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MBnpm install @aws-sdk/lib-storage

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Uploads a file buffer to DigitalOcean Spaces and returns the file URL.
 * @param {Express.Multer.File} file - The file object from multer
 * @returns {Promise<string>} - The URL of the uploaded file
 * @throws {Error} - If file validation fails or upload fails
 */
const uploadToDigitalOcean = async (
  file: Express.Multer.File
): Promise<string> => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error("File type not allowed");
    }

    // Generate a unique filename with original extension
    const fileExtension = path.extname(file.originalname);
    const fileName = `uploads/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}${fileExtension}`;

    const uploadParams = {
      Bucket: DO_CONFIG.spaceName,
      Key: fileName,
      Body: file.buffer, // Use the buffer directly
      ACL: "public-read" as ObjectCannedACL,
      ContentType: file.mimetype,
    };

    // Using Upload from @aws-sdk/lib-storage for better handling of large files
    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    const data = await upload.done();

    // Construct the file URL using HTTPS
    const fileUrl =
      data.Location ||
      `${DO_CONFIG.endpoint}/${DO_CONFIG.spaceName}/${fileName}`;

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to DigitalOcean Spaces:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to upload file: ${error.message}`
        : "Failed to upload file to DigitalOcean Spaces"
    );
  }
};

// Export the upload function
export default uploadToDigitalOcean;
