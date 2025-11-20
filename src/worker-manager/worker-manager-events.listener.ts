import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { WorkerManagerService } from './worker-manager.service';
import { redisConfig } from 'src/config/config';

@Injectable()
export class WorkerMangerListener implements OnModuleInit {
  constructor(private workerManagerService: WorkerManagerService) {}

  // tasks queue events
  private tasksQueueEvents: QueueEvents;

  // Logs queue events
  private logsQueueEvents: QueueEvents;

  onModuleInit() {
    // Gets the task queue
    this.tasksQueueEvents = new QueueEvents('tasks', {
      connection: redisConfig,
    });

    // Gets the logs queue
    this.logsQueueEvents = new QueueEvents('logs', {
      connection: redisConfig,
    });

    // listens to the task queue when task being added
    this.tasksQueueEvents.on('added', async () => {
      this.workerManagerService.taskAdded();
    });

    // listens to the Logs queue when task being added
    this.logsQueueEvents.on('added', async () => {
      this.workerManagerService.createLoggerWorker();
    });
    // listens to the Logs queue when its drained
    this.logsQueueEvents.on('drained', async () => {
      this.workerManagerService.deleteLoggerWorker();
    });
  }
}
