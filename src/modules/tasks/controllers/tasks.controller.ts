import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskMessageDto } from 'src/dtos/tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('')
  async createTask(@Body() params: CreateTaskMessageDto) {
    // Gets the massage data from the params body
    const message: string = params.message;
    // Create a new task in the service
    const taskID: string = await this.tasksService.createTask({
      message: message,
    });

    // Return the new task as an id
    return taskID;
  }
}
