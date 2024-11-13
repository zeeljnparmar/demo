import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {nestpractice} from './database/database.provider'
import { TypeOrmModule } from "@nestjs/typeorm";
import {BookingsModule} from './modules/bookings/bookings.module'
import {ProjectModule} from './modules/project/project.module'
import {UsersModule} from './modules/users/users.module'
import { AuthorizationModule } from './authorization/authorization.module';
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    UsersModule,
    ProjectModule,
    BookingsModule,
    TypeOrmModule.forRoot({...nestpractice,name:"database"}),
    AuthorizationModule,
    JwtModule.register({
      global:true,
      secret: 'secret',
      signOptions: {expiresIn: '1d'}
  })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
