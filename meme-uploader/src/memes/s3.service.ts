// src/s3/s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as dotenv from 'dotenv';
import { Multer } from 'multer';
dotenv.config();

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async uploadFile(file: Multer.File): Promise<string> {
    const fileExt = extname(file.originalname);
    const key = `${uuidv4()}${fileExt}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
     // ACL: 'public-read', // So your image is accessible by URL
    });

    await this.s3.send(uploadCommand);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
