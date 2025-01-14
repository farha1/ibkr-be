import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity';
import { CreateNewsDto } from './dto/create-news-dto';
import { UpdateNewsDto } from './dto/update-news-dto';
import { findNewsOptions } from './interfaces/news.interface';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async findAll(options: findNewsOptions = {}): Promise<News[]> {
    try {
      return await this.newsRepository.find(options);
    } catch (error) {
      console.log('error fetch news', error);
      throw new Error('Failed to fetch news data');
    }
  }

  async findOne(): Promise<News> {
    try {
      return await this.newsRepository.findOne({
        where: { isPublished: true },
        order: {
          publishDate: 'DESC',
        },
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  async create(news: CreateNewsDto): Promise<void> {
    try {
      await this.newsRepository.save(news);
    } catch (error) {
      console.log('error create news', error);
      throw new Error('Failed to create news data');
    }
  }

  async update(news: UpdateNewsDto): Promise<News> {
    try {
      const { sourceId, ...rest } = news;
      await this.newsRepository.update({ sourceId }, rest);
      return this.newsRepository.findOneByOrFail({ sourceId });
    } catch (error) {
      console.log('error update news', error);
      throw new Error('Failed to update news data');
    }
  }
}
