import { Controller, Post, Get, UseInterceptors, UploadedFile, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MemesService } from './memes.service';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Multer } from 'multer';
import * as dotenv from 'dotenv';
import { S3Service } from './s3.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
dotenv.config();



@Controller('memes')
export class MemesController {
  constructor(private readonly memesService: MemesService, private readonly s3service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
   storage: memoryStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueSuffix);
      },
    }),
  }))
 async uploadMeme(
    @UploadedFile() file: Multer.File,
    @Body('title') title: string,
  ) {
    //const imageUrl = `http://localhost:3001/uploads/${file.filename}`;
    console.log(file);
    const imageUrl = await this.s3service.uploadFile(file, title);
    return this.memesService.create({ title, imageUrl });
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.memesService.findAll();
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('from-s3')
  getAllS3Memes() {
    return this.s3service.listAllMemes();
  }
  @Delete(':key')
  delete(@Param('key') key: string) {
  return this.s3service.deleteFile(key);
}
}
