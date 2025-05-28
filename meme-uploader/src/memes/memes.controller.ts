import { Controller, Post, Get, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MemesService } from './memes.service';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Multer } from 'multer';

@Controller('memes')
export class MemesController {
  constructor(private readonly memesService: MemesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueSuffix);
      },
    }),
  }))
  uploadMeme(
    @UploadedFile() file: Multer.File,
    @Body('title') title: string,
  ) {
    const imageUrl = `http://localhost:3001/uploads/${file.filename}`;
    return this.memesService.create({ title, imageUrl });
  }

  @Get()
  findAll() {
    return this.memesService.findAll();
  }
}
