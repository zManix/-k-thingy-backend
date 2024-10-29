import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../auth.service/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            deleteUser: jest.fn().mockResolvedValue(true), // Mock the deleteUser method
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('deleteUser', () => {
    it('should throw an error if user is not an admin', async () => {
      const mockUser = { id: 1, role: 'user' };
      await expect(authController.deleteUser(1, mockUser)).rejects.toThrow(UnauthorizedException);
    });

    it('should delete user if user is an admin', async () => {
      const mockUser = { id: 1, role: 'admin' };
      jest.spyOn(authService, 'deleteUser').mockResolvedValue(true);
      expect(await authController.deleteUser(1, mockUser)).toBe(true);
    });
  });
});
