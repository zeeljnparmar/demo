import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {userCheckService} from './user.check'

@Module({
  providers: [UsersService,userCheckService],
  controllers: [UsersController],
  exports:[UsersService,userCheckService]
})
export class UsersModule {}
