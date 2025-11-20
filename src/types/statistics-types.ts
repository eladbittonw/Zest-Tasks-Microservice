export type StatisticsResult = {
  tasksProcessed: number;
  tasksRetries: number;
  ratioSucceededFailed: string;
  avgProcessingTime: number;
  currentQueueLen: number;
  idleWorkers: number;
  hotWorkers: number;
};

export type WorkerStatisticsResult = {
  busyWorkers: number;
  idleWorkers: number;
  retriesNumber: number;
  sumProcessTime: number;
};

export type QueueStatisticsResult = {
  processed: number;
  ratio: string;
  queueLength: number;
};
