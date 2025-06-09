import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // or hardcode for now if you're testing
    });
  }

  async generateCaption(title: string): Promise<string> {
  const prompt = `Write a witty and short response for: "${title}"`;

  const response = await this.openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'user', content: prompt },
    ],
  });

    return response.choices[0].message.content || 'No response 😢';
  }
}