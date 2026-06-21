import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return access token', async () => {
      const dto: AuthDto = { email: 'new@example.com', password: 'password' };
      const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;
      (bcryptMock.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.create.mockResolvedValueOnce({ id: 1, email: dto.email, password: 'hashed-password' });

      const result = await service.register(dto);

      expect(result).toEqual({ accessToken: 'jwt-token' });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, expect.any(Number));
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data: { email: dto.email, password: 'hashed-password' } });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: 1, email: dto.email });
    });

    it('should throw BadRequestException when email already exists', async () => {
      const dto: AuthDto = { email: 'exists@example.com', password: 'password' };
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 1, email: dto.email, password: 'existing' });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login existing user and return access token', async () => {
      const dto: AuthDto = { email: 'login@example.com', password: 'password' };
      const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 1, email: dto.email, password: 'hashed-password' });
      (bcryptMock.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.login(dto);

      expect(result).toEqual({ accessToken: 'jwt-token' });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, 'hashed-password');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: 1, email: dto.email });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const dto: AuthDto = { email: 'missing@example.com', password: 'password' };
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const dto: AuthDto = { email: 'login@example.com', password: 'wrong-password' };
      const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 1, email: dto.email, password: 'hashed-password' });
      (bcryptMock.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, 'hashed-password');
    });
  });
});
