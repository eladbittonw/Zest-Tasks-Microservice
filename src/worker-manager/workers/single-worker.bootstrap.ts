import { Worker, Job } from 'bullmq';
import { Queue } from 'bullmq';
import * as dotenv from 'dotenv';
import { redisConfig } from 'src/config/config';
import logger from 'src/utils/console-logger';
// config the env vars
dotenv.config();

let idleTimer: NodeJS.Timeout | null = null;
const FAIL_RATE =
  Number(process.env.TASK_SIMULATED_ERROR_PERCENTAGE) / 100 || 0.2;

const worker = new Worker(
  'tasks',
  async (job: Job) => {
    logger.debug('job ', job.id, 'started');

    // Sends the main process that the worker is working
    if (process.send) process.send({ event: 'working', jobId: job.id });
    // clears the timeout idle
    clearTimeout(idleTimer);

    // Simulate Fail Rate
    if (Math.random() < FAIL_RATE) {
      throw new Error('Simulated failure');
    }

    // Add the logs to the logs queue
    const logQueue = new Queue('logs', {
      connection: redisConfig,
    });
    // Add the task to the logs queue
    await logQueue.add(
      'log',
      {
        message: `JOB START: worker=${process.pid}, job=${job.id}, time=${new Date().toISOString()}, message=${JSON.stringify(job.data.message)}`,
      },
      { removeOnComplete: true },
    );

    // Simulate process
    await new Promise((res) =>
      setTimeout(res, Number(process.env.TASK_SIMULATED_DURATION)),
    );

    //Logs to the console that the job finished
    logger.debug('job ', job.id, 'finished');
    return true;
  },
  {
    connection: redisConfig,
    concurrency: 1,
    stalledInterval: Number(process.env.TASK_SIMULATED_DURATION) + 2000,
  },
);

// Handle on completed event
worker.on('completed', (job) => {
  // Tell parent we are now idle
  if (process.send)
    process.send({
      event: 'idle',
      jobId: job.id,
      processingTime: job.finishedOn - job.processedOn,
    });

  // Clear any previous idle timer
  if (idleTimer) clearTimeout(idleTimer);
  logger.warn('Idle started');
  // Start idle timeout countdown
  idleTimer = setTimeout(async () => {
    await worker.close();
    process.exit(0);
  }, Number(process.env.WORKER_TIMEOUT));
});

// Handle on fail event
worker.on('failed', async (job, err) => {
  // Send to the process that the worker failed
  if (process.send) process.send({ event: 'failed' });
  logger.error('Worker error:', err);
  // Check for his last attempt and after that close the worker
  if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
    logger.warn(
      `Job ${job.id} used all ${job.opts.attempts} attempts → Closing worker.`,
    );

    await worker.close();
    process.exit(0);
  }
});
