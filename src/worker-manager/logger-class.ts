import { ChildProcess, fork } from 'child_process';
import * as path from 'path';

export class FileLogger {
  private loggerWorkerProcess: ChildProcess = null;

  //Starts the logger worker to write to the file
  startLoggerWorker() {
    const workerFileProcess = path.join(
      __dirname,
      'logger/logging-worker.bootstrap.js',
    );

    // create the logger worker process
    const workerProcess = fork(workerFileProcess);
    // saves the process
    this.loggerWorkerProcess = workerProcess;
  }

  // Delete the wlogs worker when the queue is empty
  deleteLoggerWorker() {
    // kill the logger worker process
    this.loggerWorkerProcess.kill();
  }
}
