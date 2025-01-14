import { Module } from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { HttpModule } from '@nestjs/axios';
import { NewsModule } from 'src/news/news.module';
import { GuardianController } from './guardian.controller';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [HttpModule, NewsModule, OpenaiModule],
  providers: [GuardianService],
  exports: [GuardianService],
  controllers: [GuardianController],
})
export class GuardianModule {}
