import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    CoreModule,
    CatsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', //db server
      port: 5432,
      username: 'postgres', // your username
      password: '123456', //your password
      database: 'cat_adoption', //your database name
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true, // set to false in production
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
    UsersModule,
    FavoriteModule
  ],
})
export class AppModule {}
