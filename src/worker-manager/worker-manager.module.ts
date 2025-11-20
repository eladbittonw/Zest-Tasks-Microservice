import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bullmq';
import { WorkerMangerListener } from 'src/worker-manager/worker-manager-events.listener';
import { WorkerManagerService } from 'src/worker-manager/worker-manager.service';

@Module({
  imports: [],
  providers: [WorkerManagerService, WorkerMangerListener],
  exports: [WorkerManagerService],
})
export class WorkerManagerModule {}
