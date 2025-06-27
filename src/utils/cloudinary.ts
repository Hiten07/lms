import { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_SECRET_KEY!,
    secure: true,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      return {
        folder: "uploads",
        resource_type: file.mimetype === "application/pdf" ? "raw" : "video",
        public_id: file.originalname.replace(/\.[^/.]+$/, ""), 
        allowed_formats: ["mp4", "pdf", "mov", "avi", "webm"], 
      };
    },
  })

  const allowedMimeTypes = [
    "video/mp4",
    "video/quicktime",
    "application/pdf",
    "video/webm",
  ];

  const fileFilter = ( req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only video and PDF files are allowed!"));
    }
  };
  
  const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, 
    fileFilter,
  });

export { upload }
