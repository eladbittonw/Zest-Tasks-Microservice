import { Worker } from 'bullmq';
import { appendFile } from 'fs/promises';
import { FileLogger } from '../logger-class';
import logger from 'src/utils/console-logger';
import { redisConfig } from 'src/config/config';

//Creates the worker for the logger queue
const fileLogger = new Worker(
  'logs',
  async (job) => {
    // create the line to the file
    const line = job.data.message + '\n';

    // append the line to the file
    await appendFile('shared-log.txt', line);
  },
  {
    connection: redisConfig,
    concurrency: 1,
  },
);

//Logs to the console that the log been done
fileLogger.on('completed', () => {
  logger.debug('Worker enterd the logs file');
});
