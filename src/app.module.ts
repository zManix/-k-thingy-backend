import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './sample/modules/auth/auth.module';
import { ArticleModule } from './sample/modules/article/article.module';
import { User } from './sample/modules/article/entities/user.entity';
import { ArticleEntity } from './sample/modules/article/entities/article.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_NAME || 'database/api.db',
      entities: [User, ArticleEntity],
      synchronize: true,
      logging: process.env.DATABASE_LOG === 'true',
    }),
    AuthModule,
    ArticleModule,
  ],
})
export class AppModule {}
