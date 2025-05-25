import { Module } from '@nestjs/common';
import { MemesController } from './memes/memes.controller';
import { MemesService } from './memes/memes.service';

@Module({
  imports: [],
  controllers: [MemesController],
  providers: [MemesService],
})
export class AppModule {}
