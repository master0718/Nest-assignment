import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register()', () => {
    it('should register a user', async () => {
      const registerUserDto: RegisterUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        roles: ['user', 'admin']
      };
      const result = { id: 1, ...registerUserDto };
      jest.spyOn(service, 'register').mockImplementation(async () => result);

      expect(await controller.register(registerUserDto)).toBe(result);
      expect(service.register).toHaveBeenCalledWith(
        registerUserDto.name,
        registerUserDto.email,
        registerUserDto.password,
        registerUserDto.roles
      );
    });
  });

  describe('login()', () => {
    it('should login a user and return a token', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = { access_token: 'some-token' };
      jest.spyOn(service, 'login').mockImplementation(async () => result);
  
      expect(await controller.login(loginUserDto)).toBe(result);
      expect(service.login).toHaveBeenCalledWith(loginUserDto);
    });
  });
});