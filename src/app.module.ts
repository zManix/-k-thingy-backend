import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './todo/modules/auth/auth.module';
import { TodoModule } from './todo/modules/article/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetModule } from './todo/modules/reset/reset.module';
import { UserService } from './todo/modules/auth/user.service/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database/api.db',
      dropSchema: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    TodoModule,
    ResetModule,
  ],
  providers: [UserService],
})
export class AppModule {}
