import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const Output = z.object({ keyPoints: z.array(z.string()) });

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  async getKeyPoint(content: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'gets key points of news as a numbered list',
          },
          {
            role: 'user',
            content: `news: ${this.cleanHtmlTags(content)}`,
          },
        ],
        response_format: zodResponseFormat(Output, 'keyPoints'),
        max_completion_tokens: 1024,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.log('getKeyPoint error', error);
    }
  }

  cleanHtmlTags(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }
}
