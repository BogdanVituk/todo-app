import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';

export class AuthDto {
    @IsEmail({}, { message: 'Email має бути коректним' })
    @IsNotEmpty({ message: 'Email не може бути порожнім' })
    email: string;

    @IsString({ message: 'Пароль має бути рядком' })
    @IsNotEmpty({ message: 'Пароль не може бути порожнім' })
    @MinLength(6, { message: 'Пароль занадто короткий (мін. 6 символів)' })
    @MaxLength(100, { message: 'Пароль занадто довгий (макс. 100 символів)' })
    password: string;
}