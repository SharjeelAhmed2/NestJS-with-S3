// src/s3/s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand  } from '@aws-sdk/client-s3';
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

  async uploadFile(file: Multer.File, title: string, email: string): Promise<string> {
    // const fileExt = extname(title);
    // const safeTitle = title.replace(/\s+/g, '_'); // replace spaces
    // const key = `${uuidv4()}--${safeTitle}.$${fileExt}`;
    //const key = `${email}--${uuidv4()}--${safeTitle}${fileExt}`;

    const fileExt = extname(file.originalname); // ← from the actual file
    const safeTitle = title.replace(/\s+/g, '_'); // makes it filename-safe
    console.log(safeTitle);
    const key = `${email}--${uuidv4()}--${safeTitle}${fileExt}`;
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(uploadCommand);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async listAllMemes(): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
  });

  const response = await this.s3.send(command);

  const imageUrls = response.Contents?.map((obj) => {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`;
  }) || [];

  return imageUrls;
}
  async deleteFile(key: string): Promise<any> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    return await this.s3.send(command);
  }
  async listMemesByUser(email: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
  });

  const response = await this.s3.send(command);

  const imageUrls = response.Contents?.map((obj) => {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`;
  }) || [];

  return imageUrls.filter(url => url.includes(`${email}--`));
}
}
