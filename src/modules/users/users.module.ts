import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {userCheckService} from './user.check'
import { AppModule } from 'src/app.module';
import {JwtService} from "@nestjs/jwt";
import { AppService } from 'src/app.service';

@Module({
  imports:[
    forwardRef(() => AppModule),
  ],
  providers: [UsersService,userCheckService,JwtService,AppService],
  controllers: [UsersController],
  exports:[UsersService,userCheckService]
})
export class UsersModule {}
