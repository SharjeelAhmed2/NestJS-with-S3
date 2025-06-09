import { Module } from '@nestjs/common';
import { MemesController } from './memes/memes.controller';
import { MemesService } from './memes/memes.service';
import {S3Service} from './memes/s3.service';
import { GptController } from './gpt/gpt.controller';
import { GptService } from './gpt/gpt.service';

@Module({
  imports: [],
  controllers: [MemesController, GptController],
  providers: [MemesService, S3Service, GptService],
})
export class AppModule {}
