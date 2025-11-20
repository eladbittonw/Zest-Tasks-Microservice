import { Module } from '@nestjs/common';
import { StatisticsService } from './services/statistics.service';
import { StatisticsController } from './controllers/statistics.controller';
import { WorkerManagerModule } from 'src/worker-manager/worker-manager.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [WorkerManagerModule, TasksModule],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
