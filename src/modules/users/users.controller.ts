import { Controller,Get,Post,Body} from '@nestjs/common';
import {UsersService} from './users.service'
import {userDto} from '../../dtos/user.dto'

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService:UsersService
    ){}

    @Post('create')
    private async create(
        @Body() user:userDto
    ):Promise<any>{ 
        return await this.userService.createUser(user);
    }
    @Get('get-all')
    private async getAllUsers():Promise<any>{
        return this.userService.getAllUsers();
    }
}
