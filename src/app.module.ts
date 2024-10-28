import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerMiddleware } from './sample/midleware/logger.middleware';
import { ArticleModule } from './sample/modules/article/article.module';
import { AuthModule } from './sample/modules/auth/auth.module';
import { RootModule } from './sample/modules/root/root.module';
import { ResetModule } from './sample/modules/reset/reset.module';

// Import entities
import { ArticleEntity } from './sample/modules/article/entities/article.entity';


@Module({
  imports: [
    ArticleModule,
    AuthModule,
    RootModule,
    ResetModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3',  // Adjust this if you are using a different DB
        database: process.env.DATABASE_NAME || 'database/api.db',
        dropSchema: true,  // WARNING: Do not use in production; this will drop and recreate tables on each run
        entities: [ArticleEntity],  // Add your entities here
        autoLoadEntities: true,  // Automatically load entities from the imports
        logging: process.env.DATABASE_LOG?.toLowerCase() === 'true' || false,
        synchronize: true,  // WARNING: Set to false in production
      }),
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes();
  }
}
