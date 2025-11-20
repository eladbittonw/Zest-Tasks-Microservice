import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateTaskMessageDto {
  @IsNotEmpty()
  @MinLength(1)
  message: string;
}
