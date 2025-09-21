import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'projects'): Promise<string> {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: folder,
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      return (result as any).secure_url;
    } catch (error) {
      throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
    }
  }

  async uploadGif(file: Express.Multer.File, folder: string = 'projects/gifs'): Promise<string> {
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: folder,
            transformation: [
              { width: 800, height: 600, crop: 'limit' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      return (result as any).secure_url;
    } catch (error) {
      throw new Error(`Error uploading GIF to Cloudinary: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
    }
  }

  extractPublicId(url: string): string {
    const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|mp4|webm)$/);
    return matches ? matches[1] : '';
  }
}
