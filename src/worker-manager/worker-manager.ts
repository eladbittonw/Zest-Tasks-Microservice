import logger from 'src/utils/console-logger';
import { WorkerState } from './worker-manager.service';
import * as os from 'os';
import { fork } from 'child_process';
import * as path from 'path';

type eventMessage = { event: string; jobId: number; processingTime?: number };

export class WorkerManager {
  // Workers
  private workers: Map<
    number,
    { state: WorkerState; idleTimer?: NodeJS.Timeout }
  > = new Map();

  // Max workers
  private maxWorkers: number;
  // retry number
  private retryCount: number;
  // Sum process times fot each task
  private sumAvgTime: number;

  constructor() {
    // Sets the max workers limit to
    this.maxWorkers = os.cpus().length;
    this.sumAvgTime = 0;
    this.retryCount = 0;
  }

  // Get all the busy workers
  getIsAllWorking() {
    const allWorking = Array.from(this.workers.values()).every(
      (worker) => worker.state === 'working',
    );
    return allWorking;
  }

  // Get the max workers the user can create
  getMaxWorkers() {
    return this.maxWorkers;
  }

  // Adds to the retryCount
  addRetry() {
    this.retryCount++;
  }

  // Gets to the retryCount
  getNumberOfRetries() {
    return this.retryCount;
  }

  // Gets the sum of the times of all the process
  getSumProcessTime() {
    return this.sumAvgTime;
  }
  // add worker to the list
  addWorker(pid: number) {
    this.workers.set(pid, { state: 'working' });
  }

  // Delete the worker from the list
  exitWorker(pid: number) {
    this.workers.delete(pid);
  }

  // Set the worker to working
  setWorking(pid: number) {
    const w = this.workers.get(pid);
    if (w) w.state = 'working';
  }

  // Set the worker to idle
  setIdle(pid: number, timer?: NodeJS.Timeout) {
    const w = this.workers.get(pid);
    if (w) {
      w.state = 'idle';
      w.idleTimer = timer;
    }
  }

  // Get all the busy workers
  getAllBusyWorkers() {
    const workingCount = Array.from(this.workers.values()).filter(
      (w) => w.state === 'working',
    ).length;
    return workingCount;
  }

  // Get all the idle workers
  getAllIdleWorkers() {
    const idleCount = Array.from(this.workers.values()).filter(
      (w) => w.state === 'idle',
    ).length;
    return idleCount;
  }

  // Start a new worker process
  startWorker() {
    // Gets the worker node file path
    const workerFileProcess = path.join(
      __dirname,
      'workers/single-worker.bootstrap.js',
    );

    // Create the sub process of the worker
    const workerProcess = fork(workerFileProcess);

    logger.debug('Worker pid ', workerProcess.pid, 'started');
    //add the process worker to the map
    this.addWorker(workerProcess.pid);

    // Connection with the sub process to set working or idle
    workerProcess.on('message', (msg: eventMessage) => {
      if (msg.event === 'working') {
        // Sets the worker to working

        this.setWorking(workerProcess.pid);
      } else if (msg.event === 'idle') {
        // Sets the worker to idle
        this.sumAvgTime = this.sumAvgTime + msg.processingTime;
        this.setIdle(workerProcess.pid);
      } else if (msg.event === 'failed') {
        this.addRetry();
      }
    });

    // if the process is finishe it will delete it from the array
    workerProcess.on('exit', () => {
      //delete the worker from the Map
      this.exitWorker(workerProcess.pid);

      logger.debug('Worker pid ', workerProcess.pid, 'exited');
    });
  }
}
