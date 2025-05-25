import { Injectable } from '@nestjs/common';
import { CreateMemeDto } from './dto/create-meme.dto';

@Injectable()
export class MemesService {
  private memes: CreateMemeDto[] = [];

  create(meme: CreateMemeDto) {
    this.memes.push(meme);
    return meme;
  }

  findAll() {
    return this.memes;
  }
}
