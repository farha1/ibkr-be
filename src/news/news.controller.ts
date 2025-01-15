import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { findNewsOptions, NewsOrder } from './interfaces/news.interface';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  async findAll(
    @Query('section') section: string,
    @Query('page-size') pageSize: string = '10',
    @Query('page') page: string = '1',
  ) {
    try {
      const queryParams: findNewsOptions = {
        where: {
          section: section,
          isPublished: true,
        },
        take: parseInt(pageSize),
        skip: (parseInt(page) - 1) * parseInt(pageSize),
        order: {
          publishDate: NewsOrder.DESC,
        },
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
