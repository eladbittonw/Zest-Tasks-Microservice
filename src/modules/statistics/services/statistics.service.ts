import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { TasksService } from 'src/modules/tasks/services/tasks.service';
import {
  QueueStatisticsResult,
  StatisticsResult,
  WorkerStatisticsResult,
} from 'src/types/statistics-types';
import { WorkerManagerService } from 'src/worker-manager/worker-manager.service';

@Injectable()
export class StatisticsService {
  constructor(
    // Tasks service
    private readonly tasksService: TasksService,
    // Worker manager service
    private readonly workerManagerService: WorkerManagerService,
  ) {}

  async getStatistics(): Promise<StatisticsResult> {
    // Gets the queue Stats
    const queueStats: QueueStatisticsResult =
      await this.tasksService.getTasksQueueStatistics();
    // Gets the worker stats
    const workerStats: WorkerStatisticsResult =
      await this.workerManagerService.getWorkerStats();
    const avgProcessTime = workerStats.sumProcessTime / queueStats.processed;

    // Returns the statistics
    return {
      tasksProcessed: queueStats.processed,
      ratioSucceededFailed: queueStats.ratio,
      currentQueueLen: queueStats.queueLength,
      avgProcessingTime: avgProcessTime,
      hotWorkers: workerStats.busyWorkers,
      idleWorkers: workerStats.idleWorkers,
      tasksRetries: workerStats.retriesNumber,
    };
  }
}
