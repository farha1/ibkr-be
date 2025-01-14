import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { GuardianService } from './guardian.service';

@Controller('guardian')
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Get()
  async findAll(
    @Query('from-date') fromDate: string,
    @Query('to-date') toDate: string,
    @Query('section') section: string,
    @Query('page-size') pageSize: string = '10',
  ) {
    try {
      const queryParams = {
        section,
        'page-size': pageSize,
        'from-date': fromDate,
        'to-date': toDate,
      };
      await this.guardianService.fetchData(queryParams);
      return 'fetch data success';
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
