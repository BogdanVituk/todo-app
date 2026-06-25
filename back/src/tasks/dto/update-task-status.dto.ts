import { Priority } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsOptional } from 'class-validator';


export class UpdateTaskStatusDto {
  @IsBoolean({ message: 'Поле completed має бути логічного типу (true/false)' })
  completed: boolean;
  
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

