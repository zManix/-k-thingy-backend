import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user.service/user.service';
import { JwtService } from '@nestjs/jwt';
import { BearerDto } from '../../../generic.dtos/bearer.dto';
import { LoginDto } from '../../article/dto/login.dto';
import { UserEntity } from '../../article/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string): Promise<UserEntity> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  async login(loginDto: LoginDto): Promise<BearerDto> {
    const user = await this.validateUser(loginDto.username);
    if (user.password !== loginDto.password) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };
    return { token: this.jwtService.sign(payload) };
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userService.remove(id);
    return true;
  }
}
