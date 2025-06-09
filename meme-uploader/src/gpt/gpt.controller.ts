import { Controller, Post, Body } from '@nestjs/common';
import { GptService } from './gpt.service'; // Adjust path as needed

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post()
  async generate(@Body('prompt') prompt: string) {
    const result = await this.gptService.generateCaption(prompt);
    return { response: result };
  }}