import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import streamifier from 'streamifier';
import AppError from '../errors/error';
import { envVeriables } from '../config/envConfig';

cloudinary.config({
  cloud_name: envVeriables.CLOUDINARY_CLOUD_NAME,
  api_key: envVeriables.CLOUDINARY_API_KEY,
  api_secret: envVeriables.CLOUDINARY_API_SECRET,
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadToCloudinary = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'post-project' },
    (error, result) => {
      if (error) {
        return next(new AppError(500, 'Image upload failed'));
      }
      if (result) {
        req.body.url = result.secure_url;
      }
      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};
