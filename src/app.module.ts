import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './news/news.entity';
import { GuardianModule } from './guardian/guardian.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [News],
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    NewsModule,
    GuardianModule,
    OpenaiModule,
  ],
})
export class AppModule {}
