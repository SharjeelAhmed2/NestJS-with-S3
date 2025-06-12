import { Module } from '@nestjs/common';
import { MemesController } from './memes/memes.controller';
import { MemesService } from './memes/memes.service';
import {S3Service} from './memes/s3.service';
import { GptController } from './gpt/gpt.controller';
import { GptService } from './gpt/gpt.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';

@Module({
  controllers: [MemesController, GptController, UserController],
  providers: [MemesService, S3Service, GptService, UserService, PrismaService,],
})
export class AppModule {}
