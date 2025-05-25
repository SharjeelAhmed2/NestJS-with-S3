import { Controller, Get, Post, Body } from '@nestjs/common';
import { MemesService } from './memes.service';
import { CreateMemeDto } from './dto/create-meme.dto';

@Controller('memes')
export class MemesController {
  constructor(private readonly memesService: MemesService) {}

  @Post()
  create(@Body() createMemeDto: CreateMemeDto) {
    return this.memesService.create(createMemeDto);
  }

  @Get()
  findAll() {
    return this.memesService.findAll();
  }
}
