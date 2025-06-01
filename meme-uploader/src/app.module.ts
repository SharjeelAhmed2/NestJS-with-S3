import { Module } from '@nestjs/common';
import { MemesController } from './memes/memes.controller';
import { MemesService } from './memes/memes.service';
import {S3Service} from './memes/s3.service';

@Module({
  imports: [],
  controllers: [MemesController],
  providers: [MemesService, S3Service],
})
export class AppModule {}
