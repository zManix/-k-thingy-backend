import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from '../../midleware/logger.middleware';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service/auth.service';
import { AuthController } from './auth.controller/auth.controller';
import { ProfileController } from './profile.controller/profile.controller';
import { UserService } from './user.service/user.service';
import { Security } from '../../../security';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../article/entities/user.entity'; // Updated path for the User entity

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || Security.secret,
      signOptions: { expiresIn: `${parseInt(process.env.JWT_EXPIRES_IN_S || '60', 10)}s` },
    }),
    TypeOrmModule.forFeature([User]), // Register User entity for this module
  ],
  controllers: [AuthController, ProfileController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController, ProfileController);
  }
}
