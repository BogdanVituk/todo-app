import { IsBoolean } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsBoolean({ message: 'Поле completed має бути логічного типу (true/false)' })
  completed: boolean;
}