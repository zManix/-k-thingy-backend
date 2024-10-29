import { Module } from '@nestjs/common';
import { AuthService } from './auth.service/auth.service';
import { ResetService } from '../reset/reset.service/reset.service';
import { AuthController } from './auth.controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from './user.service/user.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ResetService, JwtStrategy, UserService],
  exports: [AuthService, ResetService, UserService],
})
export class AuthModule {}
