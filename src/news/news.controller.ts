import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { findNewsOptions } from './interfaces/news.interface';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  async findAll(
    @Query('section') section: string,
    @Query('page-size') pageSize: string = '10',
    @Query('page-offset') pageOffset: string = '0',
  ) {
    try {
      const queryParams: findNewsOptions = {
        where: {
          section: section || 'world',
          isPublished: true,
        },
        take: parseInt(pageSize),
        skip: parseInt(pageOffset),
      };
      const news = await this.newsService.findAll(queryParams);
      return news;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'error fetch data',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
