import { Injectable } from '@nestjs/common';
import { ChildProcess, fork } from 'child_process';
import * as path from 'path';
import logger from 'src/utils/console-logger';
import { WorkerManager } from './worker-manager';
import { FileLogger } from './logger-class';
import { WorkerStatisticsResult } from 'src/types/statistics-types';

export type WorkerState = 'working' | 'idle' | 'offline';

@Injectable()
export class WorkerManagerService {
  private workerManager: WorkerManager;
  private fileLogger: FileLogger;

  // Create a new objects
  constructor() {
    this.workerManager = new WorkerManager();
    this.fileLogger = new FileLogger();
  }

  // Create / Use a worker a task been added
  async taskAdded() {
    // Gets max workers
    const maxWorkers = this.workerManager.getMaxWorkers();
    // Gets the busy workers
    const busyWorkers = this.workerManager.getAllBusyWorkers();

    // check if to create another worker
    if (this.workerManager.getIsAllWorking() && busyWorkers <= maxWorkers) {
      this.workerManager.startWorker();
    } else if (busyWorkers == maxWorkers) {
      logger.error('you have reached the max cors in your computer.');
    }
  }

  // Create the logger Worker
  async createLoggerWorker() {
    this.fileLogger.startLoggerWorker();
  }

  //Shut down the logger worker
  async deleteLoggerWorker() {
    this.fileLogger.deleteLoggerWorker();
  }

  // Gets worker statistics
  async getWorkerStats(): Promise<WorkerStatisticsResult> {
    const busyWorkers = this.workerManager.getAllBusyWorkers();
    const idleWorkers = this.workerManager.getAllIdleWorkers();
    const retriesNumber = this.workerManager.getNumberOfRetries();
    const sumProcessTime = this.workerManager.getSumProcessTime();
    return {
      busyWorkers: busyWorkers,
      idleWorkers: idleWorkers,
      retriesNumber: retriesNumber,
      sumProcessTime: sumProcessTime,
    };
  }
}
