import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ accessToken: 'register-token' }),
    login: jest.fn().mockResolvedValue({ accessToken: 'login-token' }),
  };

  beforeEach(async () => {
    authService = mockAuthService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return token', async () => {
      const dto: AuthDto = { email: 'test@example.com', password: 'password' };

      const result = await controller.register(dto);

      expect(result).toEqual({ accessToken: 'register-token' });
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login and return token', async () => {
      const dto: AuthDto = { email: 'test@example.com', password: 'password' };

      const result = await controller.login(dto);

      expect(result).toEqual({ accessToken: 'login-token' });
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });
});
