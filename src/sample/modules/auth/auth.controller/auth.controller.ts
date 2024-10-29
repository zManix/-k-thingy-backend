import { Controller, Post, Body, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service/auth.service';
import { LoginDto } from '../../article/dto/login.dto';
import { BearerDto } from '../../../generic.dtos/bearer.dto';
import { UserEntity } from '../../article/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<BearerDto> {
    return this.authService.login(loginDto);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: number, @Body() user: UserEntity): Promise<boolean> {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.authService.deleteUser(id);
  }
}
