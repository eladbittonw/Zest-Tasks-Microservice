import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CreateTaskMessageDto } from 'src/dtos/tasks.dto';
import * as dotenv from 'dotenv';
import {
  QueueStatisticsResult,
  StatisticsResult,
} from 'src/types/statistics-types';

// config the env vars
dotenv.config();

@Injectable()
export class TasksService {
  constructor(
    // inject the tasks queue
    @InjectQueue('tasks') private tasksQueue: Queue,
  ) {}

  // Create a new Task in the tasks queue
  async createTask({ message }: CreateTaskMessageDto): Promise<string> {
    const job = await this.tasksQueue.add(
      'process',
      { message },
      {
        attempts: Number(process.env.TASK_MAX_RETRIES),
        backoff: {
          type: 'fixed',
          delay: Number(process.env.TASK_ERROR_RETRY_DELAY),
        },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );
    //Return the task id
    return job.id;
  }

  // Gets the needed queue statistics
  async getTasksQueueStatistics(): Promise<QueueStatisticsResult> {
    //completed tasks
    const completed = await this.tasksQueue.getCompletedCount();

    //failed taksks
    const failed = await this.tasksQueue.getFailedCount();
    // Processed tasks
    const processed = completed + failed;

    // Gets the completed / falid ratio
    const ratio = 'completed - ' + completed + ' / ' + 'failed - ' + failed;

    // Gets the current queue length
    const queueLength =
      (await this.tasksQueue.getWaitingCount()) +
      (await this.tasksQueue.getActiveCount());

    return {
      processed: processed,
      ratio: ratio,
      queueLength: queueLength,
    };
  }
}
