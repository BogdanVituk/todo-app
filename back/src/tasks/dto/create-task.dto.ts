import { Priority } from '@prisma/client';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsEnum, IsDateString } from 'class-validator';


export class CreateTaskDto {
    @IsString({ message: 'Назва має бути рядком' })
    @IsNotEmpty({ message: 'Назва не може бути порожньою' })
    @MinLength(3, { message: 'Назва занадто коротка (мін. 3 символи)' })
    title: string;

    @IsString({ message: 'Опис має бути рядком' })
    @IsNotEmpty({ message: 'Опис не може бути порожнім' })
    @MaxLength(500, { message: 'Опис занадто довгий (макс. 500 символів)' })
    description: string;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @IsDateString()
    deadline?: string;
    
}


