import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { NewsService } from 'src/news/news.service';
import {
  GuardianApiByIdResponse,
  GuardianApiResponse,
} from './interfaces/guardian.interface';
import { AxiosResponse } from 'axios';
import { CreateNewsDto } from 'src/news/dto/create-news-dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OpenaiService } from 'src/openai/openai.service';
import { NewsOrder } from 'src/news/interfaces/news.interface';

@Injectable()
export class GuardianService {
  constructor(
    private readonly http: HttpService,
    private readonly newsService: NewsService,
    private readonly openaiService: OpenaiService,
  ) {}
  private generateQueryString(params: Record<string, string>): string {
    return Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async fetchDataSchedule() {
    const sections = [
      'world',
      'technology',
      'science',
      'environment',
      'football',
    ];
    for (const section of sections) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      await this.fetchData({
        section,
        'from-date': this.formatDate(yesterday),
        'to-date': this.formatDate(today),
        'page-size': '20',
      });
      await this.sleep(10 * 1000);
    }
  }

  async fetchData(params: Record<string, string>): Promise<void> {
    try {
      const queryString = this.generateQueryString(params);
      const response = await firstValueFrom<AxiosResponse<GuardianApiResponse>>(
        this.http.get(
          `https://content.guardianapis.com/search?${queryString}&api-key=${process.env.GUARDIAN_API_KEY}`,
        ),
      );
      const data = response.data.response.results;
      for (const news of data) {
        try {
          const createNewsDto: CreateNewsDto = {
            title: news.webTitle,
            sourceUrl: news.webUrl,
            apiUrl: news.apiUrl,
            source: 'guardian',
            sourceId: news.id,
            section: news.sectionId,
            publishDate: news.webPublicationDate,
          };
          await this.newsService.create(createNewsDto);
        } catch (err) {
          console.log('error create news', err);
          break;
        }
      }
    } catch (error) {
      console.log('Fetch data error', error);
      throw new Error('Failed to fetch data');
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async getContent() {
    console.log('run getContent job');
    try {
      const options = {
        where: { isPublished: false },
        order: {
          publishDate: NewsOrder.DESC,
        },
        take: 10,
      };
      const datas = await this.newsService.findAll(options);
      for (const e of datas) {
        try {
          const response = await firstValueFrom<
            AxiosResponse<GuardianApiByIdResponse>
          >(
            this.http.get(
              `${e.apiUrl}?api-key=${process.env.GUARDIAN_API_KEY}&show-fields=body`,
            ),
          );
          const news = response.data.response.content;
          const content = news.fields.body;

          const keyPoint = await this.openaiService.getKeyPoint(content);

          const parsedKeyPoint = JSON.parse(keyPoint);
          await this.newsService.update({
            content,
            sourceId: e.sourceId,
            keyPoint: JSON.stringify(parsedKeyPoint.keyPoints),
            isPublished: true,
          });
          console.log('update content and keyPoint success');
        } catch (error) {
          console.log('update content and keyPoint error', error);
          throw new Error('Failed to update content and keyPoint');
        }
      }
    } catch (error) {
      console.log('get content error', error);
      throw new Error('Failed to get content');
    }
  }
}
