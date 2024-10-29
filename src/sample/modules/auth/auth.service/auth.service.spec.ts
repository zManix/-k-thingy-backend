import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user.service/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { LoginDto } from '../../article/dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<UserService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    userService = {
      findOne: jest.fn(),
      findById: jest.fn(),
      remove: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate a user', async () => {
    const mockUser = { id: 1, username: 'test', password: 'password' };
    (userService.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.validateUser('test');
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if credentials are invalid', async () => {
    (userService.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.validateUser('invalid')).rejects.toThrow(BadRequestException);
  });
});
