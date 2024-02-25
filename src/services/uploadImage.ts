import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'node:path';

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env['S3_ACCESS_KEY'] || "",
        secretAccessKey: process.env['S3_SECRET_KEY'] || ""
    },
    region: process.env['S3_REGION'] || ""
});

const s3Storage = multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: process.env['S3_BUCKET_NAME'] || "",
    metadata: (_, file, cb) => {
        cb(null, { fieldname: file.fieldname })
    },
    key: (_, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

const sanitizeFile = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Define the allowed extension
    const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

    // Check allowed extensions
    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    // Mime type must be an image
    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true); // no errors
    } else {
        // pass error msg to callback, which can be displayed in frontend
        cb(new Error("Error: File type not allowed!"));
    }
}


const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (_, file, callback) => {
        sanitizeFile(file, callback)
    },
    limits: {
        fileSize: 1024 * 1024 * 10 // 10mb file size
    }
})

export default uploadImage;
