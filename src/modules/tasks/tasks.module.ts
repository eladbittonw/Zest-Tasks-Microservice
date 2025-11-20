import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { BullModule } from '@nestjs/bullmq';
import { WorkerMangerListener } from 'src/worker-manager/worker-manager-events.listener';
import { WorkerManagerService } from 'src/worker-manager/worker-manager.service';
import { WorkerManagerModule } from 'src/worker-manager/worker-manager.module';

@Module({
  imports: [
    WorkerManagerModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'tasks',
      },
      { name: 'logs' },
    ),
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
