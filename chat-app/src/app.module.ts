import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'charles',
      password: 'hajjar',
      database: 'user1',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // en développement seulement, évitez ceci en production
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}