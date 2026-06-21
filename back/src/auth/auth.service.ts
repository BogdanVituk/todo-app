import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { BCRYPT_ROUNDS } from '../config/constants';
import { UserPayload } from 'src/guards/jwt-auth.guard';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}


  async register(dto: AuthDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new BadRequestException('Користувач з таким Email вже існує');
    }


    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });


    return this.generateToken(user.id, user.email);
  }

 
  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Неправильний email або пароль');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неправильний email або пароль');
    }

    return this.generateToken(user.id, user.email);
  }


  private async generateToken(userId: number, email: string) {
    const payload: { sub: number; email: string } = { sub: userId, email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}