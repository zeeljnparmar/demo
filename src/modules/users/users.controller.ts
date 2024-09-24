import { Controller,Get,Post,Body} from '@nestjs/common';
import {UsersService} from './users.service'
import {userDto} from '../../dtos/user.dto'

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService:UsersService
    ){}

    @Post('login')
    private async login(@Body() body:any){
        return await this.userService.login(body);
    }
    
    // @Post('sign-up')
    // private async signup(){}

    @Post('create')
    private async create(
        @Body() user:userDto
    ):Promise<any>{ 
        return await this.userService.createUser(user);
    }

    @Get('get-all')
    private async getAllUsers():Promise<any>{
        const res=this.userService.getAllUsers();
        return res;
    }

    @Post('get-a-user')
    private async getSingle(
        @Body() body:any
    ):Promise<any>{
        const res= this.userService.getSingleUser(body);
        return res;
    }
}
