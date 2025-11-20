import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from '../services/statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  // statistics get endpoint
  @Get('')
  async getTasksQueueStatistics() {
    // Gets the statistics of the service
    return await this.statisticsService.getStatistics();
  }
}
