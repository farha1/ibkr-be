import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News } from './news.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [TypeOrmModule.forFeature([News])],
  exports: [NewsService],
})
export class NewsModule {}
