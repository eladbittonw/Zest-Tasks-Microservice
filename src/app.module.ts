import { Module } from '@nestjs/common';

import { TasksModule } from './modules/tasks/tasks.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [TasksModule, StatisticsModule],
})
export class AppModule {}
